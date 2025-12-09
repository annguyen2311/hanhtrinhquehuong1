import React from 'react';
import { MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary pt-20 pb-10 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-brand-500 to-teal-400 p-1.5 rounded-lg text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">Hành Trình Việt</span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Kết nối mọi miền tổ quốc. Mang đến cho bạn những chuyến đi an toàn, tiết kiệm và đầy ắp kỷ niệm về quê hương Việt Nam.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Công Ty</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Về Chúng Tôi</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Tuyển Dụng</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Blog Du Lịch</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Báo Chí</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Hỗ Trợ</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Trung Tâm Trợ Giúp</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Điều Khoản Sử Dụng</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">An Toàn Du Lịch</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Đăng Ký Nhận Tin</h4>
            <p className="text-sm mb-4 opacity-80">Nhận thông tin ưu đãi vé xe, máy bay và khách sạn mới nhất.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-4 pr-12 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm"
              />
              <button className="absolute right-2 top-2 p-1.5 bg-brand-600 text-white rounded-md hover:bg-brand-500 transition">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <p>© {new Date().getFullYear()} Hành Trình Việt. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Bảo mật</a>
            <a href="#" className="hover:text-white">Điều khoản</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}