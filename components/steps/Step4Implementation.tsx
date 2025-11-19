
import React, { useState } from 'react';
import { ReportData } from '../../types';
import Loader from '../common/Loader';
import { generateSuggestions } from '../../services/geminiService';

interface Props {
  data: ReportData;
  onGenerate: (section: 'implementation', prompt: string, systemInstruction: string) => Promise<void>;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  update: (field: keyof ReportData, value: string) => void;
}

const Step4Implementation: React.FC<Props> = ({ data, onGenerate, onNext, onBack, isLoading, update }) => {
  const [suggestions, setSuggestions] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSuggest = async () => {
    setIsSuggesting(true);
    const prompt = `Dựa trên nội dung biện pháp đã có: "${data.content}", 
    hãy gợi ý các bước thực hiện chi tiết cho biện pháp "${data.title}". 
    Gợi ý cần bao gồm các khía cạnh: các bước tiến hành, thời gian, sự phối hợp và các điều kiện cần thiết (cơ sở vật chất, con người).
    Trình bày dưới dạng gạch đầu dòng.`;
    const systemInstruction = "Bạn là một trợ lý giáo dục, chuyên đưa ra các ý tưởng cốt lõi, súc tích cho báo cáo chuyên môn.";
    try {
      const result = await generateSuggestions(prompt, systemInstruction);
      setSuggestions(result);
    } catch (error) {
      alert("Đã có lỗi xảy ra khi tạo gợi ý. Vui lòng thử lại.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleGenerate = () => {
    const prompt = `Dựa trên các ý tưởng về cách thực hiện sau:\n${suggestions}\nhãy viết hoàn chỉnh phần "Cách thức và Điều kiện thực hiện" cho biện pháp "${data.title}". 
    Phần này cần được trình bày một cách chi tiết, khả thi và logic.`;
    const systemInstruction = "Bạn là một nhà quản lý giáo dục, hãy trình bày kế hoạch thực hiện một cách chi tiết, khả thi và logic.";
    onGenerate('implementation', prompt, systemInstruction);
  };

  const handleCopy = () => {
    if (!data.implementation) return;
    navigator.clipboard.writeText(data.implementation).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Cách thức & Điều kiện</h2>
        <p className="text-lg text-gray-500">Kế hoạch triển khai cụ thể và các yêu cầu cần thiết.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 h-full">
        {/* Step 1: Suggestions */}
        <div className="flex flex-col h-full space-y-4">
           <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex flex-col h-full shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <label className="block text-xl font-bold text-indigo-900">1. Kế hoạch & Điều kiện</label>
                <span className="text-xs font-semibold bg-indigo-200 text-indigo-800 px-2 py-1 rounded-md">AI Assistant</span>
            </div>
            
             <textarea
                rows={12}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="flex-1 w-full p-4 text-lg bg-white border border-indigo-200 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                placeholder="Nhấn nút để AI gợi ý kế hoạch..."
            />
            
             <div className="mt-4">
                 {isSuggesting ? (
                     <Loader text="Đang phân tích..." />
                ) : (
                    <button
                        onClick={handleSuggest}
                        className="w-full py-4 flex items-center justify-center gap-2 text-lg font-bold rounded-2xl shadow-md text-indigo-700 bg-white border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        AI Gợi ý kế hoạch
                    </button>
                )}
            </div>
          </div>
        </div>

        {/* Step 2: Generate Full Content */}
        <div className="flex flex-col h-full space-y-4">
           <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col h-full shadow-xl">
             <div className="flex justify-between items-center mb-4">
                <label className="block text-xl font-bold text-gray-800">2. Nội dung chi tiết</label>
                {data.implementation && (
                     <button
                        onClick={handleCopy}
                        className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-colors ${copySuccess ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {copySuccess ? 'Đã sao chép!' : 'Sao chép'}
                    </button>
                )}
            </div>

            <div className="relative flex-1 flex flex-col">
                 {isLoading ? (
                    <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
                         <Loader text="AI đang viết bài..." />
                    </div>
                ) : (
                    <textarea
                        rows={14}
                        value={data.implementation}
                        onChange={(e) => update('implementation', e.target.value)}
                        className="flex-1 w-full p-5 text-lg leading-relaxed bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all duration-300 placeholder-gray-400"
                        placeholder="Nội dung chi tiết sẽ xuất hiện ở đây..."
                    />
                )}
            </div>

             <div className="mt-4">
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !suggestions}
                    className="w-full py-4 flex items-center justify-center gap-2 text-lg font-bold rounded-2xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none transition-all duration-200"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    AI Viết chi tiết
                </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-8 flex justify-between border-t border-gray-100 mt-8">
        <button onClick={onBack} className="px-8 py-3 text-lg font-semibold rounded-2xl border-2 border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
          Quay lại
        </button>
        <button
          onClick={onNext}
          disabled={!data.implementation}
          className="px-10 py-3 text-lg font-bold rounded-2xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none transition-all"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default Step4Implementation;
