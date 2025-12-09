import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Booking, Transaction, BookingType, BookingStatus } from '../types';

interface AppContextType {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  walletDeposit: (amount: number) => void;
  makeBooking: (booking: Omit<Booking, 'id' | 'status' | 'userId'>) => boolean;
  cancelBooking: (id: string) => void;
  transactions: Transaction[];
  bookings: Booking[];
  myTrips: Booking[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data
const MOCK_USER: User = {
  id: 'u1',
  name: 'Khách Trải Nghiệm',
  email: 'khach@example.com',
  walletBalance: 0, 
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2023-10-01', amount: 5000000, type: 'NẠP TIỀN', description: 'Nạp tiền vào ví' },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    userId: 'u1',
    type: BookingType.BUS,
    title: 'Xe Giường Nằm đi Đà Lạt',
    details: 'Nhà xe Phương Trang • 1 Ghế A05',
    date: '2023-12-20',
    endDate: '2023-12-20',
    price: 350000,
    status: BookingStatus.COMPLETED,
    image: 'https://images.unsplash.com/photo-1623567341691-1f46b5e5a953?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'b2',
    userId: 'u1',
    type: BookingType.HOTEL,
    title: 'Homestay Tam Đảo',
    details: 'Phòng View Núi • 2 Đêm',
    date: '2023-12-20',
    endDate: '2023-12-22',
    price: 1200000,
    status: BookingStatus.COMPLETED,
    image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=600&auto=format&fit=crop'
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // Load user from local storage on mount (simulate session)
  useEffect(() => {
    const storedUser = localStorage.getItem('viet_journey_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, name?: string) => {
    // If name is provided (Registration), use it. 
    // If login with just email, use existing mock name or extract from email.
    const displayName = name || email.split('@')[0];
    
    // In a real app, we would fetch the user data. Here we mock it.
    // If it's a "new" registration (name provided), we reset balance to 0 for realism, else keep mock balance.
    const initialBalance = name ? 0 : 5000000;

    const newUser = { 
        ...MOCK_USER, 
        email, 
        name: displayName,
        walletBalance: initialBalance
    };
    setUser(newUser);
    localStorage.setItem('viet_journey_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('viet_journey_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('viet_journey_user', JSON.stringify(updatedUser));
  };

  const walletDeposit = (amount: number) => {
    if (!user) return;
    const newBalance = user.walletBalance + amount;
    const updatedUser = { ...user, walletBalance: newBalance };
    setUser(updatedUser);
    localStorage.setItem('viet_journey_user', JSON.stringify(updatedUser));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      type: 'NẠP TIỀN',
      description: 'Nạp tiền tài khoản'
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const makeBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'userId'>) => {
    if (!user) return false;
    if (user.walletBalance < bookingData.price) {
      alert("Số dư không đủ! Vui lòng nạp thêm tiền.");
      return false;
    }

    // Deduct funds
    const newBalance = user.walletBalance - bookingData.price;
    const updatedUser = { ...user, walletBalance: newBalance };
    setUser(updatedUser);
    localStorage.setItem('viet_journey_user', JSON.stringify(updatedUser));

    // Record Transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: -bookingData.price,
      type: 'THANH TOÁN',
      description: `Thanh toán: ${bookingData.title}`
    };
    setTransactions([newTransaction, ...transactions]);

    // Create Booking
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      userId: user.id,
      status: BookingStatus.CONFIRMED
    };
    setBookings([newBooking, ...bookings]);
    
    return true;
  };

  const cancelBooking = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking || booking.status === BookingStatus.CANCELLED) return;

    // Refund Logic (Simplified: 100% refund)
    if (user) {
      const newBalance = user.walletBalance + booking.price;
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('viet_journey_user', JSON.stringify(updatedUser));
      
       const newTransaction: Transaction = {
        id: `ref-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: booking.price,
        type: 'HOÀN TIỀN',
        description: `Hoàn tiền: ${booking.title}`
      };
      setTransactions([newTransaction, ...transactions]);
    }

    // Update Booking Status
    setBookings(bookings.map(b => b.id === id ? { ...b, status: BookingStatus.CANCELLED } : b));
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      updateProfile,
      walletDeposit,
      makeBooking,
      cancelBooking,
      transactions,
      bookings,
      myTrips: bookings.filter(b => b.userId === user?.id)
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};