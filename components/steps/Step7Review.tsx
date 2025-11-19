import React, { useState } from 'react';
import { ReportData, ChartData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cleanupMarkdown } from '../../utils';

interface Props {
  data: ReportData;
  chartData: ChartData[];
  onBack: () => void;
  onReset: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-10">
    <h3 className="text-xl font-bold text-gray-900 uppercase mb-4 border-b-2 border-gray-200 pb-2">{title}</h3>
    <div className="text-lg text-gray-800 whitespace-pre-wrap leading-8 font-serif">{children}</div>
  </div>
);

const Step7Review: React.FC<Props> = ({ data, chartData, onBack, onReset }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const cleanedData = {
    title: data.title,
    subject: data.subject,
    class: data.class,
    reason: cleanupMarkdown(data.reason),
    content: cleanupMarkdown(data.content),
    implementation: cleanupMarkdown(data.implementation),
    results: cleanupMarkdown(data.results),
    conclusion: cleanupMarkdown(data.conclusion),
  };

  const fullReportText = `TÊN BIỆN PHÁP: ${cleanedData.title}
Môn học: ${cleanedData.subject}
Lớp áp dụng: ${cleanedData.class}

I. LÝ DO CHỌN BIỆN PHÁP
${cleanedData.reason}

II. NỘI DUNG BIỆN PHÁP
${cleanedData.content}

III. CÁCH THỨC VÀ ĐIỀU KIỆN THỰC HIỆN
${cleanedData.implementation}

IV. KẾT QUẢ ĐẠT ĐƯỢC
${cleanedData.results}

V. KẾT LUẬN VÀ KIẾN NGHỊ
${cleanedData.conclusion}
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(fullReportText).then(() => {
      setCopySuccess('Đã sao chép thành công!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Sao chép thất bại!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Hoàn thành báo cáo</h2>
        <p className="text-lg text-gray-500">Dưới đây là bản xem trước báo cáo của bạn.</p>
      </div>

      {/* Document Preview */}
      <div className="bg-white border border-gray-200 shadow-2xl rounded-xl p-10 sm:p-16 max-h-[70vh] overflow-y-auto custom-scrollbar mx-auto max-w-5xl">
        <div className="text-center mb-16">
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase mb-4 leading-tight">{cleanedData.title}</h1>
             <div className="text-lg text-gray-600 space-y-1">
                <p><span className="font-semibold">Môn học:</span> {cleanedData.subject}</p>
                <p><span className="font-semibold">Lớp áp dụng:</span> {cleanedData.class}</p>
             </div>
        </div>

        <Section title="I. Lý do chọn biện pháp">{cleanedData.reason}</Section>
        <Section title="II. Nội dung biện pháp">{cleanedData.content}</Section>
        <Section title="III. Cách thức và điều kiện thực hiện">{cleanedData.implementation}</Section>
        <Section title="IV. Kết quả đạt được">
            {cleanedData.results}
            {chartData && chartData.length > 0 && (
                <div className="mt-8 p-6 bg-white rounded-xl border border-gray-100 h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#4f46e5" name="Giá trị" radius={[4, 4, 0, 0]} barSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                     <p className="text-center text-sm text-gray-500 mt-2 italic">Biểu đồ minh họa kết quả</p>
                </div>
            )}
        </Section>
        <Section title="V. Kết luận và kiến nghị">{cleanedData.conclusion}</Section>
        
        <div className="mt-16 text-center italic text-gray-500">
            --- Hết văn bản ---
        </div>
      </div>
      
      <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-6 border-t border-gray-100 mt-8">
        <button onClick={onBack} className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all w-full sm:w-auto min-w-[200px]">
          Quay lại chỉnh sửa
        </button>
        
        <button
            onClick={handleCopy}
            className="px-8 py-4 text-lg font-bold rounded-2xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2 w-full sm:w-auto min-w-[200px]"
        >
            {copySuccess ? (
                <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {copySuccess}
                </>
            ) : (
                <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    Sao chép toàn bộ
                </>
            )}
        </button>
        
        <button
            onClick={onReset}
            className="px-8 py-4 text-lg font-bold rounded-2xl shadow-lg text-white bg-red-500 hover:bg-red-600 hover:shadow-xl hover:-translate-y-1 transition-all w-full sm:w-auto min-w-[200px]"
        >
            Làm mới
        </button>
      </div>
    </div>
  );
};

export default Step7Review;