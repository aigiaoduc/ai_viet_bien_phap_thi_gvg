
import React from 'react';
import { ReportData } from '../../types';

interface Props {
  data: ReportData;
  update: (field: keyof ReportData, value: string) => void;
  onNext: () => void;
}

const Step1Intro: React.FC<Props> = ({ data, update, onNext }) => {
  const canProceed = data.title && data.subject && data.class;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Thông tin cơ bản</h2>
        <p className="text-xl text-gray-500">Bước khởi đầu quan trọng cho biện pháp của bạn</p>
      </div>
      
      <div className="space-y-8 bg-white">
        <div className="relative group">
          <label htmlFor="title" className="block text-xl font-bold text-gray-700 mb-3">
            Tên biện pháp
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <input
              type="text"
              id="title"
              value={data.title}
              onChange={(e) => update('title', e.target.value)}
              className="block w-full pl-12 pr-4 py-4 text-xl bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400"
              placeholder="Ví dụ: Nâng cao hứng thú học tập môn Toán..."
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group">
              <label htmlFor="subject" className="block text-xl font-bold text-gray-700 mb-3">Môn học</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <input
                  type="text"
                  id="subject"
                  value={data.subject}
                  onChange={(e) => update('subject', e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-xl bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400"
                  placeholder="Ví dụ: Toán"
                />
              </div>
            </div>
            <div className="relative group">
              <label htmlFor="class" className="block text-xl font-bold text-gray-700 mb-3">Lớp áp dụng</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <input
                  type="text"
                  id="class"
                  value={data.class}
                  onChange={(e) => update('class', e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-xl bg-gray-50 border-2 border-gray-200 rounded-2xl shadow-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 placeholder-gray-400"
                  placeholder="Ví dụ: 5A"
                />
              </div>
            </div>
        </div>
      </div>
      
      <div className="mt-12 flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-10 py-4 text-xl font-bold rounded-2xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-gray-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all duration-300"
        >
          Tiếp theo <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default Step1Intro;
