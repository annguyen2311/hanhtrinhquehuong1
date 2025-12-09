import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { PageView, User } from '../types';

interface NavbarProps {
  onNavigate: (page: PageView) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentUser, onLogout }) => {
  return (
    <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 py-4">
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center">
        <div 
          className="text-2xl font-bold bg-gradient-to-br from-sky-400 to-teal-400 text-transparent bg-clip-text cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onNavigate('home')}
        >
          🛫 Hành Trình Việt
        </div>
        <div className="flex gap-3">
          {!currentUser ? (
            <>
              <button 
                onClick={() => onNavigate('auth')}
                className="px-5 py-2 rounded-lg font-outfit font-semibold text-sm transition-all bg-slate-700/30 border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:border-sky-500 hover:text-sky-500"
              >
                Đăng Nhập
              </button>
              <button 
                onClick={() => onNavigate('auth')}
                className="px-5 py-2 rounded-lg font-outfit font-semibold text-sm transition-all bg-gradient-to-br from-sky-500 to-cyan-500 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30"
              >
                Đăng Ký
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-outfit font-semibold text-sm transition-all bg-slate-700/30 border border-slate-600/50 text-sky-400 hover:bg-slate-700/50"
              >
                <UserIcon size={16} />
                <span>{currentUser.name}</span>
              </button>
              <button 
                onClick={onLogout}
                className="p-2 rounded-lg transition-all bg-slate-700/30 border border-slate-600/50 text-slate-400 hover:text-red-400 hover:border-red-400/50"
                title="Đăng xuất"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};