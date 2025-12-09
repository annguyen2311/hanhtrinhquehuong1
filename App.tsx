import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SearchBox } from './components/SearchBox';
import { ChatInterface } from './components/ChatInterface';
import { PageView, User, SearchParams, TransportType, TravelItem } from './types';
import { MOCK_DATA, POPULAR_DESTINATIONS } from './constants';
import { searchRealTimeTickets } from './services/geminiService';
import { Star, Wallet, MapPin, Calendar, CheckCircle, Train, Loader2, ExternalLink, ArrowLeft } from 'lucide-react';

// Sub-components defined here to keep file count low as requested, 
// usually would be split further.

const FeaturedCard: React.FC<{ item: any }> = ({ item }) => (
  <div className="group bg-slate-900/70 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10">
    <div className="h-[200px] overflow-hidden">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    </div>
    <div className="p-5">
      <h3 className="text-lg font-bold text-slate-100 mb-1">{item.name}</h3>
      <p className="text-sm text-slate-400 mb-3">{item.description}</p>
      <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
        <span className="flex items-center gap-1 text-amber-400 font-bold text-sm">
          <Star size={14} fill="currentColor" /> {item.rating}
        </span>
        <span className="text-cyan-400 font-bold text-lg">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
        </span>
      </div>
    </div>
  </div>
);

const SearchResults: React.FC<{ results: TravelItem[], loading: boolean, groundingMetadata: any }> = ({ results, loading, groundingMetadata }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 size={48} className="animate-spin text-sky-500 mb-4" />
        <p className="text-lg">AI đang tìm kiếm vé theo thời gian thực...</p>
        <p className="text-sm text-slate-500 mt-2">Đang quét Google Search cho lịch trình mới nhất</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groundingMetadata && groundingMetadata.groundingChunks && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-xs text-slate-400 mb-4">
          <span className="font-bold text-slate-300 block mb-2">Nguồn dữ liệu (Google Search):</span>
          <div className="flex flex-wrap gap-2">
            {groundingMetadata.groundingChunks.map((chunk: any, idx: number) => 
               chunk.web?.uri ? (
                <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded hover:text-sky-400 transition-colors">
                  <ExternalLink size={10} />
                  {chunk.web.title || new URL(chunk.web.uri).hostname}
                </a>
               ) : null
            )}
          </div>
        </div>
      )}

      {results.map((item) => (
        <div key={item.id} className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 flex flex-col md:flex-row gap-6 hover:border-sky-500/50 transition-all group">
          <img src={item.image} alt={item.name} className="w-full md:w-[240px] h-[160px] object-cover rounded-xl" />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-100 mb-2">{item.name}</h3>
                <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded text-sm">
                  <Star size={14} fill="currentColor" /> {item.rating}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <MapPin size={16} />
                {item.type === TransportType.HOTEL ? `Tại: ${item.to}` : `${item.from} ➝ ${item.to}`}
              </div>
              <p className="text-slate-400 text-sm">{item.description}</p>
            </div>
            <div className="flex justify-between items-end mt-4 md:mt-0">
               <div className="text-right ml-auto">
                  <div className="text-xs text-slate-500 mb-1">Giá tham khảo</div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </div>
               </div>
               {item.link ? (
                 <a href={item.link} target="_blank" rel="noreferrer" className="ml-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                   Xem Chi Tiết <ExternalLink size={14}/>
                 </a>
               ) : (
                 <button className="ml-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                   Đặt Ngay
                 </button>
               )}
            </div>
          </div>
        </div>
      ))}
      {results.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          Không tìm thấy kết quả phù hợp cho ngày này.
        </div>
      )}
    </div>
  );
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({ from: '', to: '', type: TransportType.BUS, date: '' });
  const [realTimeResults, setRealTimeResults] = useState<TravelItem[]>([]);
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    setCurrentPage('search');
    setIsSearching(true);
    setRealTimeResults([]);
    setGroundingMetadata(null);

    // Call Real-time AI Search
    const { items, groundingMetadata } = await searchRealTimeTickets(params);
    
    // Fallback to mock data if AI returns nothing (just for demo continuity)
    if (items.length === 0) {
        const mock = MOCK_DATA[params.type] || [];
        const filteredMock = mock.filter(item => 
          !params.to || item.to.toLowerCase().includes(params.to.toLowerCase()) || 
          (item.from && item.from.toLowerCase().includes(params.to.toLowerCase()))
        );
        setRealTimeResults(filteredMock);
    } else {
        setRealTimeResults(items);
    }
    
    setGroundingMetadata(groundingMetadata);
    setIsSearching(false);
  };

  const handleLogin = () => {
    // Simulated login
    if (email && password) {
      setCurrentUser({
        name: 'Nguyễn Văn A',
        email: email,
        walletBalance: 5000000
      });
      setCurrentPage('home');
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero />
            <div className="max-w-[1200px] mx-auto px-5 pb-20">
              <SearchBox onSearch={handleSearch} />
              
              <h2 className="text-3xl font-bold mb-8 text-slate-100">Điểm Đến Nổi Bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {POPULAR_DESTINATIONS.map((dest, idx) => (
                  <FeaturedCard key={idx} item={dest} />
                ))}
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-teal-500"></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 text-transparent bg-clip-text mb-4 inline-block">
                  🤖 Trợ Lý Du Lịch AI
                </h2>
                <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                  Được hỗ trợ bởi Gemini AI. Lên kế hoạch chuyến đi, tìm kiếm vé rẻ và khám phá ẩm thực địa phương chỉ trong vài giây.
                </p>
                <button 
                  onClick={() => setCurrentPage('ai')}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-8 rounded-full backdrop-blur-sm transition-all hover:scale-105"
                >
                  Bắt Đầu Trò Chuyện Ngay
                </button>
              </div>
            </div>
          </>
        );

      case 'search':
        return (
          <div className="max-w-[1200px] mx-auto px-5 py-10">
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors mb-6 font-medium"
            >
              <ArrowLeft size={20} />
              Quay lại trang chủ
            </button>

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="text-sky-400">Kết Quả:</span> 
              {searchParams.type === TransportType.HOTEL ? `Khách sạn tại ${searchParams.to || 'Việt Nam'}` : `${searchParams.from || '...'} đi ${searchParams.to || '...'}`}
              <span className="text-slate-500 text-sm font-normal ml-2 bg-slate-800 px-3 py-1 rounded-full">{searchParams.date}</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-6 sticky top-24">
                  <h3 className="font-bold text-lg mb-4">Bộ Lọc</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Khoảng giá</label>
                      <input type="range" className="w-full accent-sky-500 bg-slate-700 h-1 rounded-full appearance-none" />
                      <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>0đ</span>
                        <span>5.000.000đ</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Đánh giá</label>
                      <div className="space-y-2">
                        {['4.5+ ⭐', '4.0+ ⭐', '3.5+ ⭐'].map(r => (
                          <label key={r} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                            <input type="checkbox" className="rounded bg-slate-700 border-slate-600 text-sky-500 focus:ring-sky-500" />
                            {r}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <SearchResults results={realTimeResults} loading={isSearching} groundingMetadata={groundingMetadata} />
              </div>
            </div>
          </div>
        );

      case 'auth':
        return (
          <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-sky-400 to-teal-400 text-transparent bg-clip-text">
                {authMode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
              </h2>
              <p className="text-center text-slate-400 mb-8">Chào mừng bạn đến với Hành Trình Việt</p>
              
              <div className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Họ Tên</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none" placeholder="Nguyễn Văn A" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none" 
                    placeholder="user@example.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Mật khẩu</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:border-sky-500 focus:outline-none" 
                    placeholder="••••••••" 
                  />
                </div>
                
                <button 
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-sky-500/20 transition-all mt-4"
                >
                  {authMode === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
                </button>
                
                <div className="text-center mt-4">
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-sm text-sky-400 hover:text-sky-300 underline underline-offset-4"
                  >
                    {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile':
        if (!currentUser) return <></>;
        return (
          <div className="max-w-[800px] mx-auto px-5 py-10 space-y-6">
            <h2 className="text-3xl font-bold mb-6">Hồ Sơ Của Tôi</h2>
            
            <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 mb-1">Số Dư Ví</p>
                <div className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 text-transparent bg-clip-text flex items-center gap-2">
                  <Wallet className="text-sky-400" />
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentUser.walletBalance)}
                </div>
              </div>
              <button className="bg-slate-800 hover:bg-slate-700 border border-slate-600 px-6 py-2 rounded-lg text-slate-200 transition-colors">
                Nạp Tiền
              </button>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Thông Tin Cá Nhân</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-slate-500 uppercase font-semibold">Tên Hiển Thị</label>
                   <div className="text-lg text-slate-200 mt-1">{currentUser.name}</div>
                </div>
                <div>
                   <label className="text-xs text-slate-500 uppercase font-semibold">Email</label>
                   <div className="text-lg text-slate-200 mt-1">{currentUser.email}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Lịch Sử Chuyến Đi</h3>
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex gap-4">
                 <div className="bg-green-500/10 p-3 rounded-full h-fit">
                    <CheckCircle className="text-green-500" size={24} />
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-slate-200">Xe Buýt: Hà Nội → Hồ Chí Minh</h4>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                      <Calendar size={14} /> 25/12/2024
                    </p>
                 </div>
                 <div className="flex items-center">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                      Đã Hoàn Thành
                    </span>
                 </div>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="max-w-[1200px] mx-auto px-5 py-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-teal-400 text-transparent bg-clip-text mb-3">
                Trợ Lý AI
              </h2>
              <p className="text-slate-400">Hỏi tôi bất cứ điều gì về chuyến đi tiếp theo của bạn</p>
            </div>
            <ChatInterface />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-200">
      <Navbar 
        onNavigate={setCurrentPage} 
        currentUser={currentUser} 
        onLogout={() => { setCurrentUser(null); setCurrentPage('home'); }} 
      />
      <main className="animate-fade-in">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;