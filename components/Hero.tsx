import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-[500px] flex items-center justify-center text-center mb-10 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('https://picsum.photos/seed/travelhero/1200/600')` 
        }}
      ></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-sky-500/30 to-teal-500/20 mix-blend-overlay"></div>
      <div className="absolute inset-0 z-10 bg-slate-900/60"></div>
      
      {/* Content */}
      <div className="relative z-20 px-4 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 text-transparent bg-clip-text mb-4 drop-shadow-sm">
          Hành Trình Trở Về Quê Hương
        </h1>
        <p className="text-xl md:text-2xl text-slate-200 font-light">
          Khám phá, Đặt chỗ, Trở về - Tất cả trong một ứng dụng
        </p>
      </div>
    </div>
  );
};