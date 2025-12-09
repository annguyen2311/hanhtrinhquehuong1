import { TransportType, TravelItem } from './types';

export const CITY_IMAGES: Record<string, string> = {
  'hanoi': 'https://images.unsplash.com/photo-1509064714125-80f51643132f?q=80&w=600&auto=format&fit=crop',
  'hochiminh': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600&auto=format&fit=crop',
  'saigon': 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600&auto=format&fit=crop',
  'danang': 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600&auto=format&fit=crop',
  'hoian': 'https://images.unsplash.com/photo-1552550130-9b363404c00d?q=80&w=600&auto=format&fit=crop',
  'nhatrang': 'https://images.unsplash.com/photo-1546452292-62a67e54f913?q=80&w=600&auto=format&fit=crop',
  'dalat': 'https://images.unsplash.com/photo-1623594056708-8e692237e103?q=80&w=600&auto=format&fit=crop',
  'phuquoc': 'https://images.unsplash.com/photo-1540202404-a6f2964571d0?q=80&w=600&auto=format&fit=crop',
  'halong': 'https://images.unsplash.com/photo-1528127223428-ff0052963b6e?q=80&w=600&auto=format&fit=crop',
  'hue': 'https://images.unsplash.com/photo-1589122359556-33923483984d?q=80&w=600&auto=format&fit=crop',
  'sapa': 'https://images.unsplash.com/photo-1601206894042-32b03d58849b?q=80&w=600&auto=format&fit=crop',
  'vungtau': 'https://images.unsplash.com/photo-1621845184288-06e87d4a046a?q=80&w=600&auto=format&fit=crop',
  'quynhon': 'https://images.unsplash.com/photo-1609172421396-80512534571f?q=80&w=600&auto=format&fit=crop',
  'cantho': 'https://images.unsplash.com/photo-1605625907936-8c4377042858?q=80&w=600&auto=format&fit=crop',
  'haiphong': 'https://images.unsplash.com/photo-1638287513361-9c84e1df2b82?q=80&w=600&auto=format&fit=crop',
  'quangbinh': 'https://images.unsplash.com/photo-1616487535541-60a66df65437?q=80&w=600&auto=format&fit=crop'
};

export const MOCK_DATA: Record<TransportType, TravelItem[]> = {
  [TransportType.BUS]: [
    { 
      id: 1, 
      name: 'Xe Limousine VIP', 
      from: 'Hà Nội', 
      to: 'Hồ Chí Minh', 
      price: 850000, 
      rating: 4.8, 
      image: CITY_IMAGES['hochiminh'], 
      type: TransportType.BUS,
      description: 'Ghế massage cao cấp, wifi miễn phí'
    },
    { 
      id: 2, 
      name: 'Xe Giường Nằm', 
      from: 'Hà Nội', 
      to: 'Đà Nẵng', 
      price: 450000, 
      rating: 4.6, 
      image: CITY_IMAGES['danang'], 
      type: TransportType.BUS,
      description: 'Giường rộng rãi, nước uống miễn phí'
    },
    { 
      id: 3, 
      name: 'Xe Phương Trang', 
      from: 'Hồ Chí Minh', 
      to: 'Nha Trang', 
      price: 350000, 
      rating: 4.7, 
      image: CITY_IMAGES['nhatrang'], 
      type: TransportType.BUS,
      description: 'Khởi hành đúng giờ, an toàn'
    }
  ],
  [TransportType.FLIGHT]: [
    { 
      id: 4, 
      name: 'Vietnam Airlines', 
      from: 'Hà Nội', 
      to: 'Hồ Chí Minh', 
      price: 1500000, 
      rating: 4.9, 
      image: CITY_IMAGES['hochiminh'], 
      type: TransportType.FLIGHT,
      description: 'Hãng hàng không quốc gia 4 sao'
    },
    { 
      id: 5, 
      name: 'VietJet Air', 
      from: 'Hà Nội', 
      to: 'Đà Nẵng', 
      price: 980000, 
      rating: 4.5, 
      image: CITY_IMAGES['danang'], 
      type: TransportType.FLIGHT,
      description: 'Bay là thích ngay, giá rẻ'
    }
  ],
  [TransportType.HOTEL]: [
    { 
      id: 6, 
      name: 'Khách Sạn Mường Thanh', 
      from: '', 
      to: 'Đà Nẵng', 
      price: 1200000, 
      rating: 4.8, 
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop', 
      type: TransportType.HOTEL,
      description: 'View biển Mỹ Khê tuyệt đẹp'
    },
    { 
      id: 7, 
      name: 'Vinpearl Resort', 
      from: '', 
      to: 'Nha Trang', 
      price: 2500000, 
      rating: 4.9, 
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop', 
      type: TransportType.HOTEL,
      description: 'Đẳng cấp nghỉ dưỡng 5 sao'
    }
  ],
  [TransportType.TRAIN]: [
    { 
      id: 8, 
      name: 'Tàu Thống Nhất SE1', 
      from: 'Hà Nội', 
      to: 'Hồ Chí Minh', 
      price: 1100000, 
      rating: 4.5, 
      image: CITY_IMAGES['hochiminh'], 
      type: TransportType.TRAIN,
      description: 'Toa thế hệ mới, điều hoà mát lạnh'
    },
    { 
      id: 9, 
      name: 'Tàu Du Lịch Luxury', 
      from: 'Đà Nẵng', 
      to: 'Quy Nhơn', 
      price: 650000, 
      rating: 4.8, 
      image: CITY_IMAGES['quynhon'], 
      type: TransportType.TRAIN,
      description: 'Ngắm cảnh biển tuyệt đẹp qua cửa sổ'
    }
  ]
};

export const POPULAR_DESTINATIONS = [
  {
    name: 'Hạ Long',
    description: 'Vịnh đẹp nhất thế giới',
    rating: 4.9,
    price: 3500000,
    image: CITY_IMAGES['halong']
  },
  {
    name: 'Hội An',
    description: 'Phố cổ lãng mạn',
    rating: 4.8,
    price: 2800000,
    image: CITY_IMAGES['hoian']
  },
  {
    name: 'Đà Nẵng',
    description: 'Thành phố đáng sống',
    rating: 4.7,
    price: 2200000,
    image: CITY_IMAGES['danang']
  }
];