import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ArrowRight, MapPin, PlayCircle, Quote, Bus, Navigation } from 'lucide-react';

// Cập nhật hình ảnh chính xác
const FEATURED_DESTINATIONS = [
  { id: 1, name: 'Vịnh Hạ Long', price: 1500000, image: 'https://images.unsplash.com/photo-1504457047772-27faf1c00561?q=80&w=2800&auto=format&fit=crop', rating: 4.9, reviews: 3248, label: 'Quảng Ninh' },
  { id: 2, name: 'Phố Cổ Hội An', price: 800000, image: 'https://images.unsplash.com/photo-1557750255-c76072a7bed1?q=80&w=2940&auto=format&fit=crop', rating: 4.8, reviews: 3420, label: 'Quảng Nam' },
  { id: 3, name: 'TP. Hồ Chí Minh', price: 550000, image: 'https://images.unsplash.com/photo-1565031491318-8b2d9158725d?q=80&w=2940&auto=format&fit=crop', rating: 4.7, reviews: 2150, label: 'Sài Gòn' },
  { id: 4, name: 'Sapa - Lào Cai', price: 450000, image: 'https://images.unsplash.com/photo-1565269724037-d0d61994b637?q=80&w=2940&auto=format&fit=crop', rating: 4.6, reviews: 5200, label: 'Tây Bắc' },
];

const TESTIMONIALS = [
  { id: 1, name: "Minh Anh", role: "Về Quê Ăn Tết", text: "Đặt vé xe Phương Trang về quê chưa bao giờ dễ dàng đến thế. Hành Trình Việt giúp mình tìm vé rẻ nhất và chỗ ngồi tốt nhất.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 2, name: "Hoàng Nam", role: "Phượt Thủ", text: "AI gợi ý những quán ăn địa phương ở Huế cực chuẩn. Cảm giác như được người bản địa dẫn đi ăn vậy.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 3, name: "Chị Lan", role: "Gia Đình", text: "Tôi đã đặt cả tour cho đại gia đình đi Phú Quốc. Quản lý ví rất tiện, minh bạch chi tiêu.", avatar: "https://randomuser.me/api/portraits/women/68.jpg" }
];

// Full 63 Provinces/Cities of Vietnam
const LOCATIONS = [
  "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", // Major Cities
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", 
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", 
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông", 
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", 
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình", 
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", 
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", 
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", 
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", 
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", 
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang", 
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
].sort((a, b) => a.localeCompare(b, 'vi'));

// Helper to remove accents for search
const removeAccents = (str: string) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

export default function Home() {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [bookingType, setBookingType] = useState('Xe Khách (Bus)');

  // Click outside to close suggestions
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
        setShowToSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    navigate(`/search?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}&type=${bookingType}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Filter logic
  const getFilteredLocations = (query: string) => {
    if (!query) return LOCATIONS;
    const normalizedQuery = removeAccents(query.toLowerCase());
    return LOCATIONS.filter(loc => 
      removeAccents(loc.toLowerCase()).includes(normalizedQuery)
    );
  };

  const filteredFromLocations = getFilteredLocations(fromLocation);
  const filteredToLocations = getFilteredLocations(toLocation);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Modern Hero Section */}
      <div className="relative h-[650px] lg:h-[750px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay - Mu Cang Chai Rice Terraces */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596541612739-16e530999583?q=80&w=2940&auto=format&fit=crop" 
            alt="Vietnam Rice Fields" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/30" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-3xl animate-slide-up">
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold tracking-wider uppercase mb-6">
              Về nhà - Về với yêu thương
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Hành trình trở về <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-brand-300">Quê Hương Việt Nam.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-xl leading-relaxed">
              Dù bạn đi đâu, quê hương vẫn là nơi để trở về. Tìm vé xe khách, vé máy bay và những điểm đến bình yên nhất cùng Hành Trình Việt.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
               <button onClick={handleSearch} className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold shadow-lg shadow-brand-600/30 transition-all transform hover:-translate-y-1 text-center">
                 Đặt Vé Ngay
               </button>
               <Link to="/ai-planner" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-full font-semibold transition-all text-center flex items-center justify-center gap-2">
                 <PlayCircle className="w-5 h-5" /> Hỏi Trợ Lý AI
               </Link>
            </div>
          </div>
        </div>

        {/* Floating Search Bar (Overlapping Hero & Content) */}
        <div className="absolute -bottom-24 md:-bottom-16 left-0 right-0 z-20 px-4" ref={searchRef}>
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl shadow-slate-900/10 p-4 animate-fade-in border border-slate-100">
             <div className="flex flex-col lg:flex-row gap-2">
                
                {/* Nơi đi */}
                <div className="flex-1 relative p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div className="w-full relative">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nơi đi</p>
                      <input 
                        type="text" 
                        value={fromLocation}
                        onChange={(e) => { setFromLocation(e.target.value); setShowFromSuggestions(true); }}
                        onFocus={() => setShowFromSuggestions(true)}
                        placeholder="Tỉnh / Thành phố" 
                        className="w-full font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none" 
                      />
                      {showFromSuggestions && (
                        <div className="absolute top-10 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 mt-2 py-2 z-50 max-h-60 overflow-y-auto">
                          {filteredFromLocations.length > 0 ? (
                            filteredFromLocations.map(loc => (
                              <button key={loc} onClick={() => { setFromLocation(loc); setShowFromSuggestions(false); }} className="w-full text-left px-4 py-2 hover:bg-brand-50 hover:text-brand-600 text-sm font-medium">
                                {loc}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-slate-400">Không tìm thấy địa điểm</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-px bg-slate-100 my-2 hidden lg:block"></div>

                {/* Nơi đến */}
                <div className="flex-1 relative p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="w-full relative">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nơi đến</p>
                      <input 
                        type="text" 
                        value={toLocation}
                        onChange={(e) => { setToLocation(e.target.value); setShowToSuggestions(true); }}
                        onFocus={() => setShowToSuggestions(true)}
                        placeholder="Tỉnh / Thành phố" 
                        className="w-full font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none" 
                      />
                      {showToSuggestions && (
                        <div className="absolute top-10 left-0 w-full bg-white rounded-xl shadow-xl border border-slate-100 mt-2 py-2 z-50 max-h-60 overflow-y-auto">
                          {filteredToLocations.length > 0 ? (
                            filteredToLocations.map(loc => (
                              <button key={loc} onClick={() => { setToLocation(loc); setShowToSuggestions(false); }} className="w-full text-left px-4 py-2 hover:bg-brand-50 hover:text-brand-600 text-sm font-medium">
                                {loc}
                              </button>
                            ))
                          ) : (
                             <div className="px-4 py-2 text-sm text-slate-400">Không tìm thấy địa điểm</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-px bg-slate-100 my-2 hidden lg:block"></div>
                
                {/* Phương tiện */}
                <div className="flex-1 p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phương Tiện</p>
                      <select 
                        value={bookingType}
                        onChange={(e) => setBookingType(e.target.value)}
                        className="w-full font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                      >
                        <option value="Xe Khách (Bus)">Xe Khách (Bus)</option>
                        <option value="Máy Bay">Máy Bay</option>
                        <option value="Khách Sạn">Khách Sạn</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-1">
                   <button onClick={handleSearch} className="w-full h-full bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center px-8 py-3 lg:py-0 transition-all shadow-lg shadow-brand-500/20">
                     Tìm Kiếm
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <section className="pt-40 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Điểm Đến Yêu Thích</h2>
            <p className="text-slate-500 text-lg">Những nơi chốn bình yên đang chờ đón bạn.</p>
          </div>
          <Link to="/search" className="hidden md:flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors group">
            Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_DESTINATIONS.map((dest) => (
            <Link to={`/search?q=${dest.name}`} key={dest.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 transform hover:-translate-y-2">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
              
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                  <span className="text-xs font-bold text-slate-800">{dest.rating}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-teal-300 font-medium text-sm mb-1">{dest.label}</p>
                <h3 className="text-xl font-bold mb-1">{dest.name}</h3>
                <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
                   <span>{dest.reviews} đánh giá</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/20 pt-4">
                  <div>
                    <p className="text-xs text-slate-300 uppercase tracking-wider">Giá vé từ</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(dest.price)}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white text-brand-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
           <Link to="/search" className="inline-flex items-center gap-2 text-brand-600 font-bold">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* AI Feature Section */}
      <section className="py-20 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500 rounded-full blur-[100px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-500 to-teal-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                   {/* Chat UI Mockup */}
                   <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                           <Star className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 text-sm text-slate-300">
                           Bạn muốn đi đâu dịp này? Mình có thể giúp tìm vé xe rẻ nhất về quê.
                        </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                           <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
                        </div>
                        <div className="bg-brand-600 rounded-2xl rounded-tr-none p-3 text-sm text-white">
                           Mình muốn tìm xe giường nằm đi Buôn Ma Thuột tối thứ 6 tuần này.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                           <Star className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 text-sm text-slate-300">
                           <p className="mb-2">Tuyệt vời! Tuyến Sài Gòn - Buôn Ma Thuột có nhiều xe tốt:</p>
                           <div className="space-y-2">
                              <div className="bg-slate-900 p-2 rounded-lg flex items-center gap-3 border border-slate-700">
                                <Bus className="w-10 h-10 text-brand-400 p-2 bg-slate-800 rounded-md" />
                                <div>
                                   <p className="text-white font-bold text-xs">Xe Tiến Oanh Limousine</p>
                                   <p className="text-teal-400 text-xs">400.000đ • 22:00 xuất bến</p>
                                </div>
                              </div>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 text-white">
              <span className="text-teal-400 font-bold tracking-wider uppercase text-sm">Công nghệ Google Gemini</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 leading-tight">Thổ địa du lịch <br />ngay trong túi bạn</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Không cần phải tìm kiếm nhiều nơi. Trợ lý AI sẽ giúp bạn lên lịch trình, tìm quán ăn ngon chuẩn vị mẹ nấu và đặt vé xe nhanh chóng.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="bg-brand-500/20 p-1 rounded-full"><ArrowRight className="w-4 h-4 text-brand-400" /></div>
                  Gợi ý món ngon đặc sản địa phương
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="bg-brand-500/20 p-1 rounded-full"><ArrowRight className="w-4 h-4 text-brand-400" /></div>
                  So sánh giá vé xe khách, máy bay
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="bg-brand-500/20 p-1 rounded-full"><ArrowRight className="w-4 h-4 text-brand-400" /></div>
                  Thanh toán an toàn, không lo hết vé
                </li>
              </ul>
              <Link to="/ai-planner" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-slate-200 transition-colors">
                 Hỏi AI Ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Khách Hàng Nói Gì?</h2>
            <p className="text-slate-500 mt-4">Hàng ngàn người đã tìm được chuyến đi về nhà ưng ý.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200 border border-slate-100 relative">
                 <Quote className="w-10 h-10 text-brand-100 absolute top-6 right-6" />
                 <p className="text-slate-600 mb-6 relative z-10 leading-relaxed">"{t.text}"</p>
                 <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100" />
                    <div>
                       <h4 className="font-bold text-slate-900">{t.name}</h4>
                       <p className="text-xs text-brand-600 font-semibold uppercase">{t.role}</p>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </section>

    </div>
  );
}