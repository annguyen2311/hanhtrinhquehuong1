import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SearchParams, TransportType } from '../types';

interface SearchBoxProps {
  onSearch: (params: SearchParams) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [from, setFrom] = useState('Hà Nội');
  const [to, setTo] = useState('Hồ Chí Minh');
  const [type, setType] = useState<TransportType>(TransportType.BUS);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSearch = () => {
    onSearch({ from, to, type, date });
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 -mt-[80px] mb-12 max-w-[1100px] mx-auto relative z-30 shadow-2xl shadow-slate-950/50">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nơi Đi</label>
          <input 
            type="text" 
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Hà Nội" 
            className="bg-slate-800/50 border border-slate-700 text-slate-200 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nơi Đến</label>
          <input 
            type="text" 
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Hồ Chí Minh" 
            className="bg-slate-800/50 border border-slate-700 text-slate-200 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ngày Đi</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-800/50 border border-slate-700 text-slate-200 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Loại Hình</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as TransportType)}
            className="bg-slate-800/50 border border-slate-700 text-slate-200 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all cursor-pointer appearance-none w-full"
          >
            <option value={TransportType.BUS}>Xe Buýt</option>
            <option value={TransportType.TRAIN}>Tàu Hỏa</option>
            <option value={TransportType.FLIGHT}>Máy Bay</option>
            <option value={TransportType.HOTEL}>Khách Sạn</option>
          </select>
        </div>
        <button 
          onClick={handleSearch}
          className="bg-gradient-to-br from-sky-500 to-cyan-600 text-white font-bold py-3 px-6 rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2 h-[50px]"
        >
          <Search size={20} />
          Tìm Kiếm
        </button>
      </div>
    </div>
  );
};