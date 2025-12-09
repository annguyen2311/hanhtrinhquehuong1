
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, CreditCard, History, Plus, ChevronRight, Settings, Shield, LogOut, CheckCircle, Smartphone, Building2, User as UserIcon, Mail, Phone, Camera, Image, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PAYMENT_METHODS = [
    { id: 'momo', name: 'Ví MoMo', icon: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png', type: 'E-Wallet', color: 'bg-pink-50 border-pink-200 text-pink-700' },
    { id: 'zalo', name: 'ZaloPay', icon: 'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png', type: 'E-Wallet', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { id: 'bank', name: 'Chuyển Khoản', icon: null, component: <Building2 className="w-8 h-8 text-brand-600"/>, type: 'Ngân Hàng', color: 'bg-brand-50 border-brand-200 text-brand-700' },
    { id: 'visa', name: 'Thẻ Quốc Tế', icon: null, component: <CreditCard className="w-8 h-8 text-purple-600"/>, type: 'Visa/Master', color: 'bg-purple-50 border-purple-200 text-purple-700' },
];

export default function Profile() {
  const { user, walletDeposit, transactions, updateProfile, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'wallet'>('wallet');
  
  // Top Up Logic
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: user?.phone || '', 
    avatar: user?.avatar || '' 
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) {
        alert("Vui lòng chọn phương thức thanh toán");
        return;
    }
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
          walletDeposit(amount);
          setIsProcessing(false);
          setShowSuccess(true);
          setTimeout(() => {
              setShowSuccess(false);
              setShowTopUpModal(false);
              setDepositAmount('');
              setSelectedMethod(null);
          }, 2000);
      }, 1500);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    alert("Cập nhật thông tin thành công!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Top Up Modal */}
      {showTopUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative overflow-hidden">
                  {showSuccess ? (
                      <div className="text-center py-10 animate-fade-in">
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                              <CheckCircle className="w-10 h-10 text-green-600" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">Nạp Tiền Thành Công!</h3>
                          <p className="text-slate-500 mb-2">Số tiền đã nạp: {formatCurrency(parseFloat(depositAmount))}</p>
                          <p className="text-brand-600 font-bold text-lg">Số dư mới: {formatCurrency(user.walletBalance + parseFloat(depositAmount))}</p>
                      </div>
                  ) : (
                    <>
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Nạp Tiền Vào Ví</h3>
                        <form onSubmit={handleDeposit}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Số tiền muốn nạp (VNĐ)</label>
                                <input 
                                    type="number" 
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="Nhập số tiền..."
                                    className="w-full text-2xl font-bold p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-brand-600"
                                    min="10000"
                                    required
                                />
                                <div className="flex gap-2 mt-3">
                                    {[100000, 200000, 500000, 1000000].map(amt => (
                                        <button 
                                            key={amt}
                                            type="button"
                                            onClick={() => setDepositAmount(amt.toString())}
                                            className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                                        >
                                            {formatCurrency(amt)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-bold text-slate-700 mb-3">Chọn nguồn tiền</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {PAYMENT_METHODS.map(method => (
                                        <div 
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`p-3 border rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                                                selectedMethod === method.id 
                                                ? `${method.color} ring-2 ring-offset-1 ring-brand-500 shadow-md` 
                                                : 'border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center">
                                                {method.icon ? (
                                                    <img src={method.icon} alt={method.name} className="w-full h-full object-contain rounded-md" />
                                                ) : (
                                                    method.component
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate">{method.name}</p>
                                                <p className="text-[10px] opacity-70">{method.type}</p>
                                            </div>
                                            {selectedMethod === method.id && <CheckCircle className="w-4 h-4 ml-auto text-current" />}
                                        </div>
                                    ))}
                                </div>
                                {selectedMethod && (
                                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-sm text-slate-600 animate-fade-in">
                                      <Shield className="w-4 h-4 text-brand-600" />
                                      Bạn đang chọn thanh toán qua <span className="font-bold">{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}</span>
                                  </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowTopUpModal(false)}
                                    className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition"
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isProcessing || !depositAmount || !selectedMethod}
                                    className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? 'Đang xử lý...' : 'Xác Nhận'}
                                </button>
                            </div>
                        </form>
                    </>
                  )}
              </div>
          </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
           <div className="relative group cursor-pointer">
             <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover shadow-md group-hover:opacity-90 transition" />
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition" onClick={() => setActiveTab('details')}>
                <div className="bg-black/30 w-full h-full rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white drop-shadow-md" />
                </div>
             </div>
           </div>
           <div className="text-center md:text-left flex-1">
             <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
             <p className="text-slate-500">{user.email}</p>
             <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
               <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full border border-brand-100">Thành Viên Hạng Bạc</span>
               <span className="bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                   <Shield className="w-3 h-3" /> Đã xác minh
               </span>
             </div>
           </div>
           <div className="flex gap-3">
             <button 
               onClick={() => { logout(); navigate('/'); }}
               className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-slate-600"
             >
               <LogOut className="w-4 h-4" /> Đăng Xuất
             </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
                    <button 
                        onClick={() => setActiveTab('wallet')}
                        className={`w-full text-left p-4 flex items-center gap-4 transition-all border-l-4 ${activeTab === 'wallet' ? 'border-brand-600 bg-brand-50/50' : 'border-transparent hover:bg-slate-50'}`}
                    >
                        <div className={`p-2 rounded-xl ${activeTab === 'wallet' ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className={`font-bold ${activeTab === 'wallet' ? 'text-brand-900' : 'text-slate-700'}`}>Ví Của Tôi</h4>
                            <p className="text-xs text-slate-500">Số dư & Lịch sử</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 ml-auto ${activeTab === 'wallet' ? 'text-brand-600' : 'text-slate-300'}`} />
                    </button>
                    
                    <div className="h-px bg-slate-100 mx-4"></div>

                    <button 
                        onClick={() => setActiveTab('details')}
                        className={`w-full text-left p-4 flex items-center gap-4 transition-all border-l-4 ${activeTab === 'details' ? 'border-brand-600 bg-brand-50/50' : 'border-transparent hover:bg-slate-50'}`}
                    >
                        <div className={`p-2 rounded-xl ${activeTab === 'details' ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className={`font-bold ${activeTab === 'details' ? 'text-brand-900' : 'text-slate-700'}`}>Thông Tin Tài Khoản</h4>
                            <p className="text-xs text-slate-500">Chỉnh sửa hồ sơ</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 ml-auto ${activeTab === 'details' ? 'text-brand-600' : 'text-slate-300'}`} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
                {activeTab === 'wallet' ? (
                    <div className="space-y-6 animate-fade-in">
                        {/* Wallet Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                            <div className="relative z-10">
                                <p className="text-slate-400 font-medium mb-1">Tổng số dư khả dụng</p>
                                <h2 className="text-4xl font-bold mb-6 tracking-tight">{formatCurrency(user.walletBalance)}</h2>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setShowTopUpModal(true)}
                                        className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-brand-900/50"
                                    >
                                        <Plus className="w-5 h-5" /> Nạp Tiền
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <History className="w-5 h-5 text-slate-400" /> Lịch Sử Giao Dịch
                            </h3>
                            <div className="space-y-4">
                                {transactions.length > 0 ? transactions.map((tx) => (
                                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition border border-transparent hover:border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                tx.type === 'NẠP TIỀN' || tx.type === 'HOÀN TIỀN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {tx.type === 'NẠP TIỀN' || tx.type === 'HOÀN TIỀN' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{tx.description}</p>
                                                <p className="text-xs text-slate-500">{tx.date}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold ${
                                            tx.type === 'NẠP TIỀN' || tx.type === 'HOÀN TIỀN' ? 'text-green-600' : 'text-slate-900'
                                        }`}>
                                            {tx.type === 'NẠP TIỀN' || tx.type === 'HOÀN TIỀN' ? '+' : ''}{formatCurrency(tx.amount)}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-slate-500">Chưa có giao dịch nào</div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-fade-in">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                           <Settings className="w-6 h-6 text-brand-600" /> Chỉnh Sửa Hồ Sơ
                        </h3>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Họ và Tên</label>
                                    <div className="relative">
                                        <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                          type="text" 
                                          value={formData.name} 
                                          onChange={e => setFormData({...formData, name: e.target.value})}
                                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-700"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                          type="email" 
                                          value={formData.email} 
                                          disabled
                                          className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Số điện thoại</label>
                                    <div className="relative">
                                        <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                          type="tel" 
                                          value={formData.phone} 
                                          onChange={e => setFormData({...formData, phone: e.target.value})}
                                          placeholder="0912..."
                                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-700"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Avatar (URL)</label>
                                    <div className="relative">
                                        <Image className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input 
                                          type="text" 
                                          value={formData.avatar} 
                                          onChange={e => setFormData({...formData, avatar: e.target.value})}
                                          placeholder="https://..."
                                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-700"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all active:scale-95">
                                    Lưu Thay Đổi
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
