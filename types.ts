export enum BookingType {
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
  CAR = 'CAR',
  TOUR = 'TOUR',
  BUS = 'BUS'
}

export enum BookingStatus {
  CONFIRMED = 'ĐÃ XÁC NHẬN',
  COMPLETED = 'HOÀN THÀNH',
  CANCELLED = 'ĐÃ HỦY'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  walletBalance: number;
  avatar?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'NẠP TIỀN' | 'THANH TOÁN' | 'HOÀN TIỀN';
  description: string;
}

export interface Booking {
  id: string;
  userId: string;
  type: BookingType;
  title: string;
  details: string; // e.g., "NYC to LON", "Grand Hotel"
  date: string;
  endDate?: string;
  price: number;
  status: BookingStatus;
  image?: string;
}

export interface TripPackage {
  id: string;
  type: BookingType;
  title: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  dates?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}