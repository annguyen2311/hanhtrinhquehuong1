export type PageView = 'home' | 'search' | 'auth' | 'profile' | 'ai';

export enum TransportType {
  BUS = 'bus',
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  TRAIN = 'train',
}

export interface SearchParams {
  from: string;
  to: string;
  type: TransportType;
  date: string;
}

export interface TravelItem {
  id: number | string;
  name: string;
  from: string;
  to: string;
  price: number;
  rating: number;
  image: string;
  type: TransportType;
  description?: string;
  link?: string; // Optional link to book
}

export interface User {
  name: string;
  email: string;
  walletBalance: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}