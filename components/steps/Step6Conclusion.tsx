
import React, { useState } from 'react';
import { ReportData } from '../../types';
import Loader from '../common/Loader';
import { generateSuggestions } from '../../services/geminiService';

interface Props {
  data: ReportData;
  onGenerate: (section: 'conclusion', prompt: string, systemInstruction: string) => Promise<void>;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  update: (field: keyof ReportData, value: string) => void;
}

const Step6Conclusion: React.FC<Props> = ({ data, onGenerate, onNext, onBack, isLoading, update }) => {
  const [suggestions, setSuggestions] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSuggest = async () => {
    setIsSuggesting(true);
    const fullContext = `
      Tên biện pháp: ${data.title}
      Lý do: ${data.reason}
      Nội dung: ${data.content}
      Thực hiện: ${data.implementation}
      Kết quả: ${data.results}
    `;
    const prompt = `Dựa trên toàn bộ thông tin của biện pháp đã trình bày ở trên, hãy gợi ý các ý chính để viết phần "Kết luận và Kiến nghị". 
    Phần kết luận cần khẳng định lại tính hiệu quả. Phần kiến nghị cần đề xuất hướng phát triển.
    Trình bày dưới dạng gạch đầu dòng.`;
    const systemInstruction = "Bạn là một trợ lý giáo dục, chuyên tóm tắt và đưa ra các đề xuất chiến lược.";
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
    const prompt = `Dựa trên các ý chính sau:\n${suggestions}\nHãy viết hoàn chỉnh phần "Kết luận và Kiến nghị". 
    Phần kết luận cần khẳng định lại tính hiệu quả và ý nghĩa của biện pháp. 
    Phần kiến nghị cần đề xuất hướng phát triển, nhân rộng mô hình một cách cụ thể.`;
    const systemInstruction = "Bạn là một nhà giáo dục uyên bác, hãy viết phần kết luận và kiến nghị súc tích, sâu sắc và có tầm nhìn.";
    onGenerate('conclusion', prompt, systemInstruction);
  };

  const handleCopy = () => {
    if (!data.conclusion) return;
    navigator.clipboard.writeText(data.conclusion).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Kết luận & Kiến nghị</h2>
        <p className="text-lg text-gray-500">Tổng kết lại giá trị và đề xuất hướng phát triển.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 h-full">
        {/* Step 1: Suggestions */}
        <div className="flex flex-col h-full space-y-4">
           <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex flex-col h-full shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <label className="block text-xl font-bold text-indigo-900">1. Điểm chính & Đề xuất</label>
                <span className="text-xs font-semibold bg-indigo-200 text-indigo-800 px-2 py-1 rounded-md">AI Assistant</span>
            </div>
            
             <textarea
                rows={12}
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="flex-1 w-full p-4 text-lg bg-white border border-indigo-200 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                placeholder="Nhấn nút để AI tổng hợp ý tưởng..."
            />
            
             <div className="mt-4">
                 {isSuggesting ? (
                     <Loader text="Đang tổng hợp..." />
                ) : (
                    <button
                        onClick={handleSuggest}
                         className="w-full py-4 flex items-center justify-center gap-2 text-lg font-bold rounded-2xl shadow-md text-indigo-700 bg-white border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        AI Gợi ý kết luận
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
                {data.conclusion && (
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
                        value={data.conclusion}
                        onChange={(e) => update('conclusion', e.target.value)}
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
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
          disabled={!data.conclusion}
          className="px-10 py-3 text-lg font-bold rounded-2xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none transition-all"
        >
          Hoàn thành
        </button>
      </div>
    </div>
  );
};

export default Step6Conclusion;
