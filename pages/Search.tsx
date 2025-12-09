import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { BookingType } from '../types';
import { Plane, Hotel, Filter, Calendar, MapPin, Search as SearchIcon, Star, Check, ArrowRight, Bus, Navigation, X, ChevronRight, ChevronLeft, Users, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const MOCK_RESULTS = [
  { id: 'r1', type: BookingType.FLIGHT, title: 'Hà Nội (HAN) - Sài Gòn (SGN)', airline: 'Vietnam Airlines', time: '10:00 - 12:00', startTime: '10:00', duration: '2h 00m', price: 1500000, rating: 4.8, image: 'https://images.unsplash.com/photo-1565031491318-8b2d9158725d?q=80&w=2940&auto=format&fit=crop', badges: ['Vietnam Airlines', 'Bay thẳng', 'Uy tín'], gallery: ['https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=600', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600'], origin: 'Hà Nội', destination: 'Hồ Chí Minh' },
  { id: 'r2', type: BookingType.FLIGHT, title: 'Đà Nẵng (DAD) - Hà Nội (HAN)', airline: 'VietJet Air', time: '14:00 - 15:15', startTime: '14:00', duration: '1h 15m', price: 850000, rating: 4.2, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2940&auto=format&fit=crop', badges: ['Giá rẻ nhất'], gallery: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600', 'https://images.unsplash.com/photo-1557750255-c76072a7bed1?q=80&w=600'], origin: 'Đà Nẵng', destination: 'Hà Nội' },
  { id: 'r3', type: BookingType.HOTEL, title: 'Rex Hotel Sài Gòn', location: 'Quận 1, TP.HCM', amenities: 'Hồ bơi, Spa, Gần phố đi bộ', price: 2500000, rating: 4.6, image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2940&auto=format&fit=crop', badges: ['Trung tâm', 'Uy tín'], gallery: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600'], origin: '', destination: 'Hồ Chí Minh' },
  { id: 'r4', type: BookingType.BUS, title: 'Xe Phương Trang - Đà Lạt', airline: 'Phương Trang (Futa)', time: '23:00 - 05:00', startTime: '23:00', duration: '6h 00m', price: 320000, rating: 4.9, image: 'https://images.unsplash.com/photo-1623567341691-1f46b5e5a953?q=80&w=2940&auto=format&fit=crop', badges: ['Giường nằm', 'Uy tín'], gallery: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600'], origin: 'Hồ Chí Minh', destination: 'Đà Lạt' },
  { id: 'r5', type: BookingType.BUS, title: 'Limousine đi Vũng Tàu', airline: 'Hoa Mai', time: '08:00 - 10:00', startTime: '08:00', duration: '2h 00m', price: 180000, rating: 4.7, image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2940&auto=format&fit=crop', badges: ['Limousine', 'Đón tận nơi'], gallery: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600'], origin: 'Hồ Chí Minh', destination: 'Vũng Tàu' },
  { id: 'r6', type: BookingType.BUS, title: 'Xe Khách đi Buôn Ma Thuột', airline: 'Tiến Oanh', time: '21:00 - 05:00', startTime: '21:00', duration: '8h 00m', price: 450000, rating: 4.5, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2940&auto=format&fit=crop', badges: ['Cabin đôi', 'Sắp hết vé'], gallery: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600', 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600'], origin: 'Hồ Chí Minh', destination: 'Buôn Ma Thuột' },
  { id: 'r7', type: BookingType.BUS, title: 'Xe Khách Thành Bưởi - Đà Lạt', airline: 'Thành Bưởi', time: '09:00 - 15:00', startTime: '09:00', duration: '6h 00m', price: 310000, rating: 4.6, image: 'https://images.unsplash.com/photo-1623567341691-1f46b5e5a953?q=80&w=2940&auto=format&fit=crop', badges: ['Giường nằm'], gallery: ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600'], origin: 'Hồ Chí Minh', destination: 'Đà Lạt' },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper to remove accents
const removeAccents = (str: string) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

// Modal Component for Image Details
const DetailModal = ({ item, onClose, onBook }: { item: any; onClose: () => void; onBook: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const allImages = [item.image, ...(item.gallery || [])];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-[90vh] md:h-[600px]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition">
          <X className="w-5 h-5" />
        </button>

        {/* Image Gallery Section */}
        <div className="md:w-2/3 bg-black relative flex items-center justify-center h-1/2 md:h-full group">
          <img src={allImages[currentImage]} alt="Gallery" className="w-full h-full object-contain" />
          
          {allImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextImage} className="absolute right-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-6 flex gap-2 overflow-x-auto px-4 w-full justify-center">
            {allImages.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentImage(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentImage === idx ? 'border-brand-500 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="md:w-1/3 p-8 flex flex-col bg-white overflow-y-auto">
          <div className="mb-auto">
             <div className="flex gap-2 flex-wrap mb-4">
                {item.badges?.map((badge: string) => (
                  <span key={badge} className="px-2 py-1 bg-brand-50 text-brand-600 text-xs font-bold rounded-md uppercase tracking-wider">{badge}</span>
                ))}
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">{item.title}</h2>
             <p className="text-slate-500 mb-6 flex items-center gap-2">
               <MapPin className="w-4 h-4" /> {item.airline || item.location}
             </p>
             
             <div className="space-y-4 mb-8 bg-slate-50 p-4 rounded-2xl">
               <div className="flex items-center gap-3 text-slate-700">
                  <div className="p-2 bg-white rounded-lg shadow-sm"><Star className="w-4 h-4 text-orange-500" /></div>
                  <span className="font-semibold">{item.rating} / 5.0 (Tuyệt vời)</span>
               </div>
               {item.time && (
                 <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2 bg-white rounded-lg shadow-sm"><Calendar className="w-4 h-4 text-brand-500" /></div>
                    <span className="font-medium">Giờ đi: {item.time}</span>
                 </div>
               )}
               {item.amenities && (
                 <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2 bg-white rounded-lg shadow-sm"><Check className="w-4 h-4 text-green-500" /></div>
                    <span className="text-sm leading-tight">{item.amenities}</span>
                 </div>
               )}
             </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
             <div className="flex justify-between items-end mb-4">
                <span className="text-slate-500 text-sm font-medium">Tổng cộng</span>
                <span className="text-3xl font-bold text-brand-600">{formatCurrency(item.price)}</span>
             </div>
             <button onClick={onBook} className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-95">
               Đặt Vé Ngay <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal Confirmation Booking
const BookingConfirmationModal = ({ item, onClose, onConfirm, isProcessing }: { item: any; onClose: () => void; onConfirm: (data: any) => void; isProcessing: boolean }) => {
  const [passengers, setPassengers] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [insurance, setInsurance] = useState(false);
  const [meal, setMeal] = useState(false);

  const insurancePrice = 50000;
  const mealPrice = 80000;

  const total = (item.price * passengers) + (insurance ? insurancePrice * passengers : 0) + (meal ? mealPrice * passengers : 0);

  const handlePayment = () => {
    onConfirm({
      passengers,
      date,
      total,
      details: `${item.title} - ${passengers} Khách`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 md:p-8 animate-slide-up relative max-h-[90vh] overflow-y-auto">
         <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
           <X className="w-6 h-6" />
         </button>

         <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
           <ShieldCheck className="w-6 h-6 text-brand-600" /> Xác Nhận Đặt Chỗ
         </h2>

         {/* Item Summary */}
         <div className="bg-slate-50 p-4 rounded-2xl mb-6 flex gap-4 border border-slate-100">
            <img src={item.image} alt="thumb" className="w-20 h-20 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-slate-900 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-slate-500 mb-1">{item.airline || item.location}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                 {item.badges?.slice(0, 2).map((b: string) => (
                    <span key={b} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-slate-600">{b}</span>
                 ))}
              </div>
            </div>
         </div>

         {/* Form */}
         <div className="space-y-5 mb-6">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Ngày đi</label>
                  <div className="relative">
                     <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 font-medium focus:ring-2 focus:ring-brand-500 outline-none text-slate-700" />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Số khách</label>
                  <div className="relative">
                     <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input 
                       type="number" 
                       min="1" 
                       max="10" 
                       value={passengers} 
                       onChange={(e) => setPassengers(parseInt(e.target.value) || 1)} 
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 font-medium focus:ring-2 focus:ring-brand-500 outline-none text-slate-700" 
                     />
                  </div>
               </div>
            </div>

            {/* Add-ons */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Dịch vụ bổ sung</label>
              <div className="space-y-2">
                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${insurance ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                   <div className="flex items-center gap-3">
                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${insurance ? 'bg-brand-500 border-brand-500' : 'border-slate-300'}`}>
                        {insurance && <Check className="w-3 h-3 text-white" />}
                     </div>
                     <div>
                       <span className="text-sm font-medium text-slate-700 block">Bảo hiểm chuyến đi</span>
                       <span className="text-xs text-slate-400">Đền bù lên đến 100tr VNĐ</span>
                     </div>
                   </div>
                   <span className="text-sm font-bold text-slate-600">+{formatCurrency(insurancePrice)}</span>
                   <input type="checkbox" checked={insurance} onChange={() => setInsurance(!insurance)} className="hidden" />
                </label>

                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${meal ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                   <div className="flex items-center gap-3">
                     <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${meal ? 'bg-brand-500 border-brand-500' : 'border-slate-300'}`}>
                        {meal && <Check className="w-3 h-3 text-white" />}
                     </div>
                     <div>
                       <span className="text-sm font-medium text-slate-700 block">Suất ăn nhẹ</span>
                       <span className="text-xs text-slate-400">Bánh mì & Nước suối</span>
                     </div>
                   </div>
                   <span className="text-sm font-bold text-slate-600">+{formatCurrency(mealPrice)}</span>
                   <input type="checkbox" checked={meal} onChange={() => setMeal(!meal)} className="hidden" />
                </label>
              </div>
            </div>
         </div>

         {/* Pricing Breakdown */}
         <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Vé người lớn x{passengers}</span>
              <span className="font-medium text-slate-700">{formatCurrency(item.price * passengers)}</span>
            </div>
            {insurance && (
              <div className="flex justify-between">
                <span className="text-slate-500">Bảo hiểm x{passengers}</span>
                <span className="font-medium text-slate-700">{formatCurrency(insurancePrice * passengers)}</span>
              </div>
            )}
            {meal && (
              <div className="flex justify-between">
                <span className="text-slate-500">Suất ăn x{passengers}</span>
                <span className="font-medium text-slate-700">{formatCurrency(mealPrice * passengers)}</span>
              </div>
            )}
            <div className="h-px bg-slate-200 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">Tổng thanh toán</span>
              <span className="text-xl font-bold text-brand-600">{formatCurrency(total)}</span>
            </div>
         </div>

         <button 
           onClick={handlePayment} 
           disabled={isProcessing}
           className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
         >
           {isProcessing ? 'Đang Xử Lý...' : 'Thanh Toán Ngay'}
         </button>
      </div>
    </div>
  );
};

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { makeBooking } = useApp();
  
  // Real-time Search State
  const [searchInputs, setSearchInputs] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    query: searchParams.get('q') || '',
  });

  const [debouncedSearch, setDebouncedSearch] = useState(searchInputs);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Initial params
  const initialType = searchParams.get('type') || '';

  // Filter States
  const [sortBy, setSortBy] = useState('price-asc');
  const [filterReputable, setFilterReputable] = useState(false);
  const [filterAvailability, setFilterAvailability] = useState(false);

  // Modal States
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewDetailItem, setViewDetailItem] = useState<any>(null);

  // Debounce Effect
  useEffect(() => {
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInputs);
      setIsDebouncing(false);
    }, 500); // 500ms delay

    return () => clearTimeout(handler);
  }, [searchInputs]);

  // Handle Input Changes
  const handleInputChange = (field: string, value: string) => {
    setSearchInputs(prev => ({ ...prev, [field]: value }));
  };

  const filteredResults = useMemo(() => {
    let results = MOCK_RESULTS;

    // Filter using DEBOUNCED values
    if (debouncedSearch.from) {
      const normalizedFrom = removeAccents(debouncedSearch.from.toLowerCase());
      results = results.filter(r => removeAccents(r.origin.toLowerCase()).includes(normalizedFrom));
    }
    if (debouncedSearch.to) {
      const normalizedTo = removeAccents(debouncedSearch.to.toLowerCase());
      results = results.filter(r => removeAccents(r.destination.toLowerCase()).includes(normalizedTo));
    }
    if (debouncedSearch.query) {
       const normalizedQ = removeAccents(debouncedSearch.query.toLowerCase());
       results = results.filter(r => removeAccents(r.title.toLowerCase()).includes(normalizedQ) || removeAccents(r.destination.toLowerCase()).includes(normalizedQ));
    }

    // Type Filter (Basic, based on params)
    if (initialType) {
        if(initialType.includes('Xe') || initialType.includes('Bus')) {
            results = results.filter(r => r.type === BookingType.BUS);
        } else if (initialType.includes('Bay')) {
            results = results.filter(r => r.type === BookingType.FLIGHT);
        } else if (initialType.includes('Khách')) {
            results = results.filter(r => r.type === BookingType.HOTEL);
        }
    }

    // Advanced Filters
    if (filterReputable) {
      results = results.filter(r => r.badges?.includes('Uy tín'));
    }
    if (filterAvailability) {
      results = results.filter(r => !r.badges?.includes('Sắp hết vé'));
    }

    // Sort
    return results.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'early') {
         return (a.startTime || '00:00').localeCompare(b.startTime || '00:00');
      }
      return 0;
    });
  }, [debouncedSearch, initialType, sortBy, filterReputable, filterAvailability]);

  const handleBook = (item: any) => {
    setSelectedBooking(item);
  };

  const handleConfirmBooking = async (data: any) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = makeBooking({
      type: selectedBooking.type,
      title: selectedBooking.title,
      details: data.details,
      date: data.date,
      price: data.total,
      image: selectedBooking.image
    });

    setIsProcessing(false);
    setSelectedBooking(null);
    if (success) {
      navigate('/trips');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Modals */}
      {selectedBooking && (
        <BookingConfirmationModal 
          item={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
          onConfirm={handleConfirmBooking}
          isProcessing={isProcessing}
        />
      )}
      
      {viewDetailItem && (
        <DetailModal 
          item={viewDetailItem} 
          onClose={() => setViewDetailItem(null)} 
          onBook={() => { setViewDetailItem(null); setSelectedBooking(viewDetailItem); }}
        />
      )}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg">
              <Filter className="w-5 h-5" /> Tìm Kiếm & Lọc
            </div>

            {/* Real-time Inputs */}
            <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Nơi đi</label>
                 <div className="relative">
                   <Navigation className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     value={searchInputs.from}
                     onChange={(e) => handleInputChange('from', e.target.value)}
                     className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                     placeholder="Tỉnh/Thành phố..."
                   />
                 </div>
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Nơi đến</label>
                 <div className="relative">
                   <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     value={searchInputs.to}
                     onChange={(e) => handleInputChange('to', e.target.value)}
                     className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                     placeholder="Tỉnh/Thành phố..."
                   />
                 </div>
               </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 block">Sắp xếp theo</label>
               <select 
                 value={sortBy} 
                 onChange={(e) => setSortBy(e.target.value)}
                 className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
               >
                 <option value="price-asc">Giá tăng dần</option>
                 <option value="price-desc">Giá giảm dần</option>
                 <option value="rating">Đánh giá cao nhất</option>
                 <option value="early">Giờ khởi hành sớm nhất</option>
               </select>
            </div>

            {/* Checkbox Filters */}
            <div className="space-y-3">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filterReputable ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white group-hover:border-brand-400'}`}>
                     {filterReputable && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={filterReputable} onChange={() => setFilterReputable(!filterReputable)} />
                  <span className="text-sm font-medium text-slate-700">Nhà xe/Hãng uy tín</span>
               </label>

               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filterAvailability ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white group-hover:border-brand-400'}`}>
                     {filterAvailability && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={filterAvailability} onChange={() => setFilterAvailability(!filterAvailability)} />
                  <span className="text-sm font-medium text-slate-700">Tình trạng còn vé nhiều</span>
               </label>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 relative">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               Kết quả tìm kiếm
               {(debouncedSearch.from || debouncedSearch.to) && <span className="text-slate-500 text-lg font-normal">({filteredResults.length})</span>}
             </h2>
          </div>

          {/* Loading Overlay */}
          {isDebouncing && (
             <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-start justify-center pt-20 rounded-3xl">
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-xl border border-slate-100">
                    <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                    <span className="text-slate-600 font-medium">Đang tìm kiếm...</span>
                </div>
             </div>
          )}

          <div className={`space-y-4 transition-opacity duration-300 ${isDebouncing ? 'opacity-40' : 'opacity-100'}`}>
            {filteredResults.length > 0 ? filteredResults.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 group">
                 {/* Image */}
                 <div className="md:w-64 h-48 md:h-auto flex-shrink-0 relative overflow-hidden rounded-2xl cursor-pointer" onClick={() => setViewDetailItem(item)}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                       <Star className="w-3 h-3 text-orange-500 fill-orange-500" /> {item.rating}
                    </div>
                 </div>

                 {/* Content */}
                 <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors cursor-pointer" onClick={() => setViewDetailItem(item)}>{item.title}</h3>
                          <p className="text-slate-500 text-sm mb-2 flex items-center gap-1">
                            {item.type === BookingType.BUS ? <Bus className="w-4 h-4" /> : item.type === BookingType.FLIGHT ? <Plane className="w-4 h-4" /> : <Hotel className="w-4 h-4" />}
                            {item.airline || item.location}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {item.badges?.map(badge => (
                               <span key={badge} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-md border border-slate-100">{badge}</span>
                            ))}
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-bold text-brand-600">{formatCurrency(item.price)}</p>
                          <p className="text-xs text-slate-400">/ khách</p>
                       </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                       <div className="flex gap-6 text-sm text-slate-600">
                          {item.time && (
                             <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-brand-400" />
                                <span className="font-semibold">{item.time}</span>
                             </div>
                          )}
                          {item.duration && (
                             <div className="hidden sm:flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                <span>{item.duration}</span>
                             </div>
                          )}
                       </div>
                       
                       <div className="flex gap-3 w-full sm:w-auto">
                          <button onClick={() => setViewDetailItem(item)} className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition">
                             Chi Tiết
                          </button>
                          <button onClick={() => handleBook(item)} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition transform active:scale-95">
                             Chọn
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900">Không tìm thấy kết quả</h3>
                 <p className="text-slate-500">Hãy thử thay đổi bộ lọc hoặc tìm kiếm địa điểm khác.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}