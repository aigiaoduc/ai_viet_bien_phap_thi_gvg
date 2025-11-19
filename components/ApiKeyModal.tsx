import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('user_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim().length < 10) {
      alert('API Key không hợp lệ.');
      return;
    }
    localStorage.setItem('user_api_key', apiKey.trim());
    alert('Đã lưu API Key thành công!');
    onClose();
    // Force reload to ensure services pick up new key if needed, 
    // though the logic is dynamic so reload isn't strictly necessary 
    // but good for resetting state.
    // window.location.reload(); 
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
             <h2 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                Cấu hình Gemini API Key
             </h2>
             <p className="text-gray-400 text-sm mt-1">Cần có API Key của riêng bạn để sử dụng ứng dụng.</p>
        </div>

        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nhập Google Gemini API Key</label>
                <div className="relative">
                    <input
                        type={isVisible ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10"
                        placeholder="AIzaSy..."
                    />
                    <button 
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        {isVisible ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        )}
                    </button>
                </div>
            </div>

            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p>Chưa có Key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">Lấy miễn phí tại đây</a>.</p>
                <p className="mt-1 text-xs text-gray-500">Key được lưu an toàn trên trình duyệt của bạn.</p>
            </div>

            <button 
                onClick={handleSave}
                disabled={!apiKey}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:bg-gray-300"
            >
                Lưu và Bắt đầu
            </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;