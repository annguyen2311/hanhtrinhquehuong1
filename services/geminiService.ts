import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// SAFELY access process.env to prevent "process is not defined" crash in browser
const getApiKey = () => {
  try {
    // Check if process is defined (Node.js/Webpack/specific bundlers)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Error accessing process.env", e);
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const generateTripAdvice = async (
  prompt: string,
  history: ChatMessage[],
  userLocation?: { lat: number; lng: number }
): Promise<{ text: string; sources: Array<{ title: string; uri: string }> }> => {
  try {
    if (!apiKey) {
      return {
        text: "Vui lòng cấu hình API KEY để sử dụng tính năng này.",
        sources: []
      }
    }

    const modelId = 'gemini-2.5-flash';
    
    // Prepare tools
    const tools: any[] = [
      { googleSearch: {} },
      { googleMaps: {} }
    ];

    const toolConfig = userLocation ? {
      retrievalConfig: {
        latLng: {
          latitude: userLocation.lat,
          longitude: userLocation.lng
        }
      }
    } : undefined;

    // Convert history to format expected by Gemini
    const contents = [
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    const response = await ai.models.generateContent({
      model: modelId,
      contents: contents,
      config: {
        tools,
        toolConfig,
        systemInstruction: "Bạn là một trợ lý du lịch ảo thân thiện, am hiểu sâu sắc về Việt Nam, đặc biệt là văn hóa 'về quê' và du lịch trải nghiệm. Hãy sử dụng Google Search và Google Maps để cung cấp thông tin cập nhật về các địa điểm (như Miền Tây, Tây Bắc, Đà Lạt, Huế...), các tuyến xe khách (xe giường nằm, limousine), vé máy bay và ẩm thực địa phương. Ngôn ngữ giao tiếp: Tiếng Việt. Phong cách: Ấm áp, gần gũi, như một người bạn đồng hành.",
      }
    });

    const text = response.text || "Xin lỗi, tôi chưa thể trả lời ngay lúc này. Bạn thử lại nhé!";
    
    // Extract grounding chunks for sources
    const sources: Array<{ title: string; uri: string }> = [];
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Nguồn Web',
            uri: chunk.web.uri
          });
        }
        if (chunk.maps?.uri) { // Check for Maps grounding
           sources.push({
            title: chunk.maps.title || 'Google Maps',
            uri: chunk.maps.uri
           });
        }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "Xin lỗi, có lỗi xảy ra khi kết nối. Vui lòng kiểm tra lại mạng hoặc khóa API.", 
      sources: [] 
    };
  }
};
