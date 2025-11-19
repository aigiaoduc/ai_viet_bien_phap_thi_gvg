import React, { useState, useCallback, useEffect } from 'react';
import { ReportData, Step, ChartData } from './types';
import Stepper from './components/Stepper';
import Login from './components/Login';
import PricingModal from './components/PricingModal';
import ApiKeyModal from './components/ApiKeyModal';
import Step1Intro from './components/steps/Step1Intro';
import Step2Reason from './components/steps/Step2Reason';
import Step3Content from './components/steps/Step3Content';
import Step4Implementation from './components/steps/Step4Implementation';
import Step5Results from './components/steps/Step5Results';
import Step6Conclusion from './components/steps/Step6Conclusion';
import Step7Review from './components/steps/Step7Review';
import { generateContent } from './services/geminiService';
import { getUserCount, loginUser, deductCredit } from './services/sheetService';
import { cleanupMarkdown } from './utils';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.Intro);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Credit State
  const [credits, setCredits] = useState<number>(0);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const [reportData, setReportData] = useState<ReportData>({
    title: '',
    subject: '',
    class: '',
    reason: '',
    content: '',
    implementation: '',
    results: '',
    conclusion: '',
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getUserCount();
      if (count !== null) {
        setUserCount(count);
      }
    };
    fetchCount();
    
    // Check for API Key on load
    const apiKey = localStorage.getItem('user_api_key');
    if (!apiKey) {
        // Optionally open it immediately, but maybe better to wait until logged in
        // setIsApiKeyModalOpen(true); 
    }
  }, []);

  const checkApiKey = (): boolean => {
      const key = localStorage.getItem('user_api_key');
      if (!key) {
          setIsApiKeyModalOpen(true);
          return false;
      }
      return true;
  };

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // 1. Authenticate
      const authResult = await loginUser(username, password);
      
      if (authResult.status === 'success' && authResult.credits !== undefined) {
         // 2. Check if user has credits
         if (authResult.credits > 0) {
             // 3. Deduct credit immediately (1 session = 1 credit)
             const deductResult = await deductCredit(username);
             
             if (deductResult.status === 'success' && deductResult.credits !== undefined) {
                 // 4. Login successful
                 setUserName(authResult.name || username);
                 setCredits(deductResult.credits);
                 if (userCount !== null) setUserCount(userCount + 1);
                 
                 // Prompt for API Key if missing after login
                 setTimeout(() => checkApiKey(), 1000);

             } else {
                 alert(deductResult.message || "Lỗi khi trừ lượt sử dụng.");
             }
         } else {
             // HẾT TIỀN: Mở modal thông báo ngay lập tức, không dùng alert
             setIsPricingOpen(true);
         }
      } else {
        alert(authResult.message || "Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, Object.keys(Step).length / 2));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAdminStepJump = (step: Step) => {
    setCurrentStep(step);
  };
  
  const handleReset = () => {
    setReportData({
      title: '',
      subject: '',
      class: '',
      reason: '',
      content: '',
      implementation: '',
      results: '',
      conclusion: '',
    });
    setChartData([]);
    setCurrentStep(Step.Intro);
  };

  const updateReportData = (field: keyof ReportData, value: string) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSection = useCallback(async (
    section: keyof ReportData,
    prompt: string,
    systemInstruction: string
  ) => {
    if (!checkApiKey()) return;

    setIsLoading(true);
    try {
      const result = await generateContent(prompt, systemInstruction);
      updateReportData(section, cleanupMarkdown(result));
    } catch (error) {
      const err = error as Error;
      if (err.message === "MISSING_API_KEY") {
          setIsApiKeyModalOpen(true);
      } else {
          console.error(`Error generating ${section}:`, error);
          alert(`Đã xảy ra lỗi khi tạo nội dung. ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const generateResultsAndChart = useCallback(async (
    userInput: string,
    context: string
  ) => {
    if (!checkApiKey()) return;

    setIsLoading(true);
    try {
      const analysisPrompt = `Dựa vào các thông tin sau: ${context}\nHãy viết một đoạn văn phân tích kết quả đạt được dựa trên số liệu do người dùng cung cấp: "${userInput}". Phân tích sự tiến bộ và hiệu quả của biện pháp.`;
      const analysisSystemInstruction = "Bạn là một chuyên gia giáo dục, hãy viết một đoạn văn phân tích kết quả một cách chuyên nghiệp và thuyết phục.";
      const analysisResult = await generateContent(analysisPrompt, analysisSystemInstruction);
      updateReportData('results', cleanupMarkdown(analysisResult));

      const chartPrompt = `Chuyển đổi dữ liệu sau thành một mảng JSON cho biểu đồ: "${userInput}". JSON phải có dạng [{"name": "Tên cột", "value": số}]. Chỉ trả về JSON, không thêm bất kỳ văn bản nào khác.`;
      const chartSystemInstruction = "Bạn là một công cụ chuyển đổi dữ liệu sang JSON.";
      const chartJsonString = await generateContent(chartPrompt, chartSystemInstruction);
      
      try {
        const parsedChartData: ChartData[] = JSON.parse(chartJsonString.replace(/```json\n|\n```/g, ''));
        setChartData(parsedChartData);
      } catch (e) {
        console.error("Failed to parse chart data JSON:", e);
        setChartData([]); 
      }
    } catch (error) {
      const err = error as Error;
      if (err.message === "MISSING_API_KEY") {
          setIsApiKeyModalOpen(true);
      } else {
          console.error(`Error generating results:`, error);
          alert(`Đã xảy ra lỗi khi tạo kết quả.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);


  const renderStep = () => {
    switch (currentStep) {
      case Step.Intro:
        return <Step1Intro data={reportData} update={updateReportData} onNext={handleNext} />;
      case Step.Reason:
        return <Step2Reason data={reportData} onGenerate={generateSection} onNext={handleNext} onBack={handleBack} isLoading={isLoading} update={updateReportData} />;
      case Step.Content:
        return <Step3Content data={reportData} onGenerate={generateSection} onNext={handleNext} onBack={handleBack} isLoading={isLoading} update={updateReportData} />;
      case Step.Implementation:
        return <Step4Implementation data={reportData} onGenerate={generateSection} onNext={handleNext} onBack={handleBack} isLoading={isLoading} update={updateReportData} />;
      case Step.Results:
        return <Step5Results data={reportData} chartData={chartData} onGenerate={generateResultsAndChart} onNext={handleNext} onBack={handleBack} isLoading={isLoading} update={updateReportData} />;
      case Step.Conclusion:
        return <Step6Conclusion data={reportData} onGenerate={generateSection} onNext={handleNext} onBack={handleBack} isLoading={isLoading} update={updateReportData} />;
      case Step.Review:
        return <Step7Review data={reportData} chartData={chartData} onBack={handleBack} onReset={handleReset} />;
      default:
        return <div>Bước không hợp lệ</div>;
    }
  };

  const renderContent = () => {
    if (!userName) {
      return (
        <>
          <Login 
            onLogin={handleLogin} 
            isLoading={isLoading} 
            userCount={userCount}
            onRegisterClick={() => setIsPricingOpen(true)} 
          />
          <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
          <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
        </>
      );
    }
    return (
      <>
        {/* Header with Credits */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight leading-snug">
              Trợ lý AI viết biện pháp thi giáo viên giỏi
            </h1>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Trợ lý thông minh hỗ trợ viết biện pháp dự thi
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-white px-4 py-2 rounded-full shadow-md border border-indigo-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-semibold uppercase">Số dư</p>
                   <p className="text-lg font-bold text-indigo-900">{credits} lượt</p>
                </div>
             </div>
             <button 
               onClick={() => setIsPricingOpen(true)}
               className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-2.5 px-4 rounded-full shadow-sm transition-all flex items-center gap-2 text-sm"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Hỗ trợ
             </button>
          </div>
        </header>
        
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-gray-100 relative">
          <Stepper 
            currentStep={currentStep} 
            onStepClick={isAdmin ? handleAdminStepJump : undefined}
          />
          <div className="mt-12">
            {renderStep()}
          </div>
        </div>
        
        <footer className="text-center mt-12 pb-8 flex flex-col items-center gap-4">
           <div className="text-sm font-medium text-gray-500">
             <p>Xin chào, <span className="text-indigo-600 font-bold">{userName}</span>. Chúc bạn một ngày làm việc hiệu quả!</p>
             <p className="mt-2 opacity-75">© 2025 Ứng Dụng Phục Vụ Giáo Viên. Thiết Kế Bới Thầy Quân.</p>
           </div>

           <div className="flex gap-4">
             <button 
                onClick={() => setIsApiKeyModalOpen(true)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-colors border shadow-sm bg-gray-800 text-white hover:bg-gray-700 flex items-center gap-2"
             >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                Cài đặt API Key
             </button>

             <button 
               onClick={() => setIsAdmin(!isAdmin)}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border shadow-sm flex items-center gap-2 ${
                 isAdmin 
                   ? 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200' 
                   : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200 hover:text-gray-600'
               }`}
             >
               {isAdmin ? (
                   <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                      Tắt chế độ Admin
                   </>
               ) : (
                   <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Bật chế độ Admin (Dev)
                   </>
               )}
             </button>
           </div>
        </footer>

        <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
        <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;