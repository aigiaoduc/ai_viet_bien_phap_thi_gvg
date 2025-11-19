import React, { useState } from 'react';
import { ReportData, ChartData } from '../../types';
import Loader from '../common/Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { downloadChartImage } from '../../utils';

interface Props {
  data: ReportData;
  chartData: ChartData[];
  onGenerate: (userInput: string, context: string) => Promise<void>;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  update: (field: keyof ReportData, value: string) => void;
}

const Step5Results: React.FC<Props> = ({ data, chartData, onGenerate, onNext, onBack, isLoading, update }) => {
  const [userInput, setUserInput] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = () => {
    const context = `Biện pháp: "${data.title}". Nội dung: "${data.content}".`;
    onGenerate(userInput, context);
  };

  const handleDownloadChart = async () => {
    setIsDownloading(true);
    await downloadChartImage('result-chart-container', 'Bieu_Do_Ket_Qua');
    setIsDownloading(false);
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Kết quả đạt được</h2>
        <p className="text-lg text-gray-500">Phân tích số liệu và minh họa sự tiến bộ.</p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 shadow-sm">
                <label htmlFor="userInput" className="block text-xl font-bold text-indigo-900 mb-3">Nhập số liệu so sánh</label>
                <textarea
                    id="userInput"
                    rows={10}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full p-4 text-lg bg-white border-2 border-indigo-100 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none placeholder-gray-400"
                    placeholder="Ví dụ: 
Trước khi áp dụng: 10/30 học sinh hứng thú (33%).
Sau khi áp dụng: 25/30 học sinh hứng thú (83%)."
                />
                <div className="mt-4">
                     {isLoading ? (
                         <Loader text="Đang xử lý số liệu..." />
                    ) : (
                        <button
                        onClick={handleGenerate}
                        disabled={isLoading || !userInput}
                        className="w-full py-4 flex items-center justify-center gap-2 text-lg font-bold rounded-2xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                        >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        Phân tích & Tạo biểu đồ
                        </button>
                    )}
                </div>
            </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
             {data.results && (
              <>
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center mb-4">
                     <span className="p-2 bg-green-100 rounded-lg mr-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </span>
                     <h3 className="text-xl font-bold text-gray-800">Phân tích hiệu quả</h3>
                  </div>
                  <textarea
                    rows={12}
                    value={data.results}
                    onChange={(e) => update('results', e.target.value)}
                    className="w-full p-4 text-lg leading-relaxed bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all duration-300 placeholder-gray-400"
                  />
                </div>

                {chartData && chartData.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center">
                            <span className="p-2 bg-blue-100 rounded-lg mr-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                            </span>
                            <h3 className="text-xl font-bold text-gray-800">Biểu đồ trực quan</h3>
                         </div>
                         <button
                            onClick={handleDownloadChart}
                            disabled={isDownloading}
                            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                         >
                            {isDownloading ? 'Đang tải...' : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Tải ảnh biểu đồ
                                </>
                            )}
                         </button>
                      </div>
                      <div id="result-chart-container" className="h-[350px] w-full bg-white rounded-xl p-4">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                  <XAxis dataKey="name" tick={{fontSize: 14, fill: '#4b5563'}} axisLine={false} tickLine={false} dy={10} />
                                  <YAxis tick={{fontSize: 14, fill: '#4b5563'}} axisLine={false} tickLine={false} />
                                  <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                                    cursor={{fill: '#f3f4f6'}}
                                  />
                                  <Legend iconType="circle" />
                                  <Bar dataKey="value" fill="#6366f1" name="Giá trị" radius={[6, 6, 0, 0]} barSize={60} />
                              </BarChart>
                          </ResponsiveContainer>
                          <p className="text-center text-gray-500 mt-4 font-semibold">Biểu đồ so sánh kết quả</p>
                      </div>
                    </div>
                )}
              </>
            )}
        </div>
      </div>
      
      <div className="pt-8 flex justify-between border-t border-gray-100 mt-8">
        <button onClick={onBack} className="px-8 py-3 text-lg font-semibold rounded-2xl border-2 border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all">
          Quay lại
        </button>
        <button
          onClick={onNext}
          disabled={!data.results}
          className="px-10 py-3 text-lg font-bold rounded-2xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none transition-all"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default Step5Results;