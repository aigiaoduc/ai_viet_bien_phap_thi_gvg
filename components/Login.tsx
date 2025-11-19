
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  isLoading: boolean;
  userCount: number | null;
  onRegisterClick: () => void; // New prop
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, userCount, onRegisterClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim() && !isLoading) {
      onLogin(username.trim(), password.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] p-4">
      <div className="w-full max-w-xl p-8 sm:p-10 space-y-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 transition-all duration-500">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 mb-2 shadow-sm">
             <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 leading-tight">
            Đăng nhập hệ thống
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Trợ lý AI viết biện pháp thi giáo viên giỏi
          </p>
        </div>

        {userCount !== null && (
          <div className="flex justify-center">
             <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold border border-indigo-100">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
                Hệ thống đang hoạt động: {userCount} người dùng
             </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder-gray-400"
              placeholder="Nhập tên tài khoản..."
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder-gray-400"
              placeholder="Nhập mật khẩu..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={!username || !password || isLoading}
              className="w-full py-4 px-6 text-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang kiểm tra...
                </>
              ) : (
                'Đăng nhập & Trừ 1 lượt'
              )}
            </button>
          </div>
        </form>
        
        <div className="flex flex-col items-center justify-center space-y-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">Chưa có tài khoản?</p>
          
          <button 
            type="button"
            onClick={onRegisterClick}
            className="w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 transition-all flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            Xem Bảng Giá & Đăng Ký Ngay
          </button>

          <p className="text-xs text-gray-400 italic">Hoặc liên hệ Admin để được cấp quyền.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
