import React from 'react';
import { useApp } from '../context/AppContext';
import { BookingStatus } from '../types';
import { Calendar, Download, XCircle, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Trips() {
  const { myTrips, cancelBooking } = useApp();

  const handleCancel = (id: string) => {
    if(window.confirm("Bạn có chắc chắn muốn hủy chuyến đi này? Tiền sẽ được hoàn về ví của bạn.")) {
      cancelBooking(id);
    }
  };

  const handleDownload = (booking: any) => {
     alert("Đang tải xuống hóa đơn...");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
           <h1 className="text-3xl font-bold text-slate-900">Chuyến Đi Của Tôi</h1>
           <div className="text-slate-500 text-sm">{myTrips.length} Vé đã đặt</div>
        </div>

        {myTrips.length === 0 ? (
           <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100">
             <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <MapPin className="w-10 h-10 text-brand-300" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 mb-2">Chưa có chuyến đi nào</h3>
             <p className="text-slate-500 mb-8 max-w-sm mx-auto">Bạn chưa đặt vé nào. Quê hương đang vẫy gọi!</p>
             <Link to="/search" className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/20 inline-flex items-center gap-2">
               <Search className="w-4 h-4" /> Bắt Đầu Khám Phá
             </Link>
           </div>
        ) : (
          <div className="grid gap-6">
            {myTrips.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-all group">
                 <div className="md:w-72 relative overflow-hidden">
                    <img src={booking.image || 'https://picsum.photos/300/200'} alt={booking.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute bottom-4 left-4 text-white md:hidden">
                       <span className="text-xs font-bold uppercase tracking-wider opacity-80">{booking.type}</span>
                    </div>
                 </div>
                 
                 <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide mb-2 ${
                            booking.status === BookingStatus.CONFIRMED ? 'bg-green-100 text-green-700' :
                            booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {booking.status === BookingStatus.CONFIRMED && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                            {booking.status}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900">{booking.title}</h3>
                        <p className="text-slate-500 font-medium">{booking.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-600">{formatCurrency(booking.price)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-auto py-4 border-t border-slate-50">
                       <div className="flex items-center gap-2 text-slate-600">
                          <div className="p-2 bg-slate-50 rounded-lg">
                             <Calendar className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="font-medium text-sm">{booking.date} {booking.endDate && `— ${booking.endDate}`}</span>
                       </div>
                    </div>

                    <div className="flex gap-4 mt-4 pt-4">
                       <button 
                         onClick={() => handleDownload(booking)}
                         className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
                       >
                         <Download className="w-4 h-4" /> Hóa Đơn
                       </button>
                       {booking.status === BookingStatus.CONFIRMED && (
                         <button 
                           onClick={() => handleCancel(booking.id)}
                           className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2"
                         >
                           <XCircle className="w-4 h-4" /> Hủy Vé
                         </button>
                       )}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}