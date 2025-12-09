import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Facebook, User as UserIcon } from 'lucide-react';

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // New state for name
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
       // Validate Name if registering
       if (!isLogin && !name.trim()) {
           alert("Vui lòng nhập họ tên của bạn");
           return;
       }
       login(email, name);
       navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-900">
      {/* Background Image - Ha Long Bay */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img src="https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=2800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Ha Long Bay Vietnam" />
      </div>

      <div className="relative z-10 w-full flex items-center justify-center px-4">
         <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-teal-400 text-white mb-6 shadow-lg shadow-brand-500/30">
                <MapPin className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Chào mừng trở lại' : 'Đăng ký tài khoản'}</h2>
              <p className="text-slate-300">
                {isLogin ? 'Tiếp tục hành trình về với quê hương' : 'Tham gia cộng đồng du lịch Việt ngay hôm nay'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1 animate-slide-up">
                    <label className="text-sm font-medium text-slate-300 ml-1">Họ và Tên</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                        placeholder="Nguyễn Văn A"
                        required={!isLogin}
                        />
                    </div>
                </div>
              )}
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Mật khẩu</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 group mt-4">
                {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="h-px bg-white/20 flex-1"></div>
                <span className="text-xs text-slate-400 font-medium">Hoặc tiếp tục với</span>
                <div className="h-px bg-white/20 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-sm transition shadow-md">
                    <GoogleIcon /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] hover:bg-[#156adb] text-white rounded-xl font-bold text-sm transition shadow-md">
                   <Facebook className="w-5 h-5 fill-current" /> Facebook
                </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <span className="text-slate-400 text-sm">
                {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              </span>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-bold hover:underline ml-1"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}