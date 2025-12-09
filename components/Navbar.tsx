import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Wallet, MapPin, Bell, Menu, X, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path: string) => 
    location.pathname === path 
      ? 'text-brand-600 font-bold bg-brand-50/50' 
      : 'text-slate-600 hover:text-brand-500 hover:bg-slate-50';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-brand-500 to-teal-400 p-2 rounded-xl text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-300">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Hành Trình Việt
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className={`px-4 py-2 rounded-full text-sm transition-all ${isActive('/')}`}>Trang Chủ</Link>
            <Link to="/search" className={`px-4 py-2 rounded-full text-sm transition-all ${isActive('/search')}`}>Đặt Vé & Khách Sạn</Link>
            <Link to="/ai-planner" className={`px-4 py-2 rounded-full text-sm transition-all ${isActive('/ai-planner')}`}>Trợ Lý AI</Link>
            {user && <Link to="/trips" className={`px-4 py-2 rounded-full text-sm transition-all ${isActive('/trips')}`}>Chuyến Đi</Link>}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                 <button className="relative p-2 text-slate-500 hover:text-brand-600 transition-colors">
                   <Bell className="w-5 h-5" />
                   <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                 </button>
                 
                 <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex flex-col items-end px-2">
                         <span className="text-sm font-bold text-slate-700">{user.name}</span>
                         <span className="text-xs text-brand-600 font-bold flex items-center gap-1">
                           <Wallet className="w-3 h-3" /> {formatCurrency(user.walletBalance)}
                         </span>
                      </div>
                      <img src={user.avatar} alt="Profile" className="h-9 w-9 rounded-full border-2 border-white shadow-sm object-cover" />
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animation-fade-in origin-top-right">
                        <div className="p-2">
                          <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                            <UserIcon className="w-4 h-4 text-brand-500" /> Tài khoản & Ví
                          </Link>
                          <Link to="/trips" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                            <MapPin className="w-4 h-4 text-teal-500" /> Lịch sử chuyến đi
                          </Link>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut className="w-4 h-4" /> Đăng Xuất
                          </button>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 font-medium hover:text-brand-600 px-4 py-2">Đăng Nhập</Link>
                <Link to="/login" className="bg-brand-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5">
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-slide-up absolute w-full">
          <div className="px-4 py-6 space-y-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600">Trang Chủ</Link>
            <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600">Tìm Kiếm</Link>
            <Link to="/ai-planner" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600">Trợ Lý AI</Link>
            {user && (
              <>
                <Link to="/trips" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600">Chuyến Đi Của Tôi</Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600">Tài Khoản</Link>
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50">Đăng Xuất</button>
              </>
            )}
            {!user && (
              <div className="pt-4 flex flex-col gap-3">
                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 rounded-xl border border-slate-200 font-medium">Đăng Nhập</Link>
                 <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 rounded-xl bg-brand-600 text-white font-medium shadow-lg shadow-brand-500/30">Đăng Ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}