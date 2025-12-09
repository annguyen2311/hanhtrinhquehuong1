import { GoogleGenAI } from "@google/genai";
import { SearchParams, TravelItem, TransportType } from "../types";
import { CITY_IMAGES } from "../constants";

const API_KEY = process.env.API_KEY || 'AIzaSyDpiZ8LHJNPXd1VgtHFV7luhc5cbIt3cnM';

export const generateTravelAdvice = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return "Vui lòng cấu hình API KEY để sử dụng tính năng này.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Bạn là một trợ lý du lịch Việt Nam thân thiện, am hiểu và nhiệt tình. Hãy trả lời ngắn gọn, hữu ích và sử dụng tiếng Việt.",
      }
    });

    return response.text || "Xin lỗi, tôi không thể trả lời lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã có lỗi xảy ra khi kết nối với trợ lý AI.";
  }
};

export const searchRealTimeTickets = async (params: SearchParams): Promise<{ items: TravelItem[], groundingMetadata?: any }> => {
  if (!API_KEY) {
    console.warn("No API Key configured for real-time search");
    return { items: [] };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `
      Hãy tìm vé ${params.type} từ ${params.from} đến ${params.to} cho ngày ${params.date}.
      Sử dụng Google Search để tìm giá vé và lịch trình THỰC TẾ mới nhất hiện nay.
      
      QUAN TRỌNG: Trả về kết quả dưới dạng một mảng JSON thuần túy (không có markdown code block).
      Mỗi item trong mảng phải có cấu trúc sau:
      {
        "name": "Tên hãng xe/tàu/máy bay/khách sạn",
        "price": (số nguyên, giá VND ước tính),
        "description": "Thời gian khởi hành - Thời gian đến (hoặc thông tin ngắn gọn)",
        "rating": (số thực từ 3.5 đến 5.0, tự ước lượng dựa trên uy tín),
        "link": "Link đặt vé nếu tìm thấy",
        "destination_normalized": "Mã thành phố điểm đến không dấu, viết liền, chữ thường (ví dụ: 'hanoi', 'hochiminh', 'danang', 'dalat', 'sapa', 'nhatrang', 'vungtau', 'phuquoc', 'quynhon')"
      }
      
      Nếu người dùng tìm khách sạn, destination_normalized là thành phố của khách sạn đó.
      Nếu không tìm thấy thông tin chính xác, hãy ước lượng dựa trên dữ liệu phổ biến.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "[]";
    let items: any[] = [];
    
    // Attempt to clean and parse JSON
    try {
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      items = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse AI JSON response", e);
    }

    // Map AI results to TravelItem structure
    const travelItems: TravelItem[] = items.map((item, index) => {
      // Determine image based on destination
      let imageUrl = '';
      
      // 1. Try exact match from AI normalized destination
      if (item.destination_normalized && CITY_IMAGES[item.destination_normalized]) {
        imageUrl = CITY_IMAGES[item.destination_normalized];
      }
      
      // 2. Try fuzzy match from user input 'to'
      if (!imageUrl) {
        const userInputTo = params.to.toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const key of Object.keys(CITY_IMAGES)) {
            if (userInputTo.includes(key) || key.includes(userInputTo)) {
                imageUrl = CITY_IMAGES[key];
                break;
            }
        }
      }

      // 3. Fallback to random/type based image
      if (!imageUrl) {
        imageUrl = getImageForType(params.type, index);
      }

      return {
        id: `ai-${Date.now()}-${index}`,
        name: item.name || 'Nhà cung cấp',
        from: params.from,
        to: params.to,
        price: Number(item.price) || 0,
        rating: Number(item.rating) || 4.5,
        image: imageUrl,
        type: params.type,
        description: item.description,
        link: item.link
      };
    });

    return {
      items: travelItems,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };

  } catch (error) {
    console.error("Real-time Search Error:", error);
    return { items: [] };
  }
};

function getImageForType(type: TransportType, index: number): string {
  const seed = (index + 1) * 123;
  switch (type) {
    case TransportType.BUS: return `https://picsum.photos/seed/bus${seed}/400/300`;
    case TransportType.FLIGHT: return `https://picsum.photos/seed/flight${seed}/400/300`;
    case TransportType.TRAIN: return `https://picsum.photos/seed/train${seed}/400/300`;
    case TransportType.HOTEL: return `https://picsum.photos/seed/hotel${seed}/400/300`;
    default: return `https://picsum.photos/seed/travel${seed}/400/300`;
  }
}