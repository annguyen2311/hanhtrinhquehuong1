import React, { useState, useRef, useEffect } from 'react';
import { generateTripAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Map, Link as LinkIcon, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';

export default function Assistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Xin chào! Tôi là trợ lý du lịch ảo của bạn. Tôi có thể giúp bạn tìm vé xe về quê, gợi ý địa điểm ăn uống ngon bổ rẻ hoặc lên lịch trình phượt xuyên Việt. Bạn muốn đi đâu hôm nay?',
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | undefined>(undefined);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log('Geolocation denied or error:', error)
      );
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const response = await generateTripAdvice(userMsg.text, messages, location);
    
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response.text,
      timestamp: Date.now(),
      sources: response.sources
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 pt-20">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center py-4">
             <div className="inline-flex items-center gap-2 bg-brand-50 px-4 py-1.5 rounded-full border border-brand-100 mb-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wide">Trợ Lý Du Lịch AI</span>
             </div>
             <p className="text-slate-400 text-sm">Hỗ trợ bởi Google Gemini 2.5</p>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
               <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'model' ? 'bg-gradient-to-br from-brand-500 to-teal-400 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                 {msg.role === 'model' ? <Bot className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
               </div>
               
               <div className={`max-w-[85%] lg:max-w-[75%] space-y-2`}>
                  <div className={`p-6 rounded-3xl shadow-sm leading-relaxed text-base ${
                    msg.role === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-sm' 
                      : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                  
                  {/* Sources Card */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm inline-block max-w-full">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Map className="w-3 h-3" /> Nguồn tham khảo
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-brand-300 hover:bg-brand-50 px-3 py-1.5 rounded-lg text-brand-600 text-xs font-medium transition-colors max-w-[200px] truncate group"
                          >
                             <LinkIcon className="w-3 h-3 flex-shrink-0 text-slate-400 group-hover:text-brand-500" />
                             <span className="truncate">{source.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <span className={`text-xs text-slate-400 block px-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
               </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-teal-400 text-white flex items-center justify-center shadow-sm">
                 <Bot className="w-6 h-6" />
               </div>
               <div className="bg-white p-4 rounded-3xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-3">
                 <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
                 <span className="text-slate-500 font-medium">Đang tìm thông tin từ Google...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 p-4 md:p-6 shadow-lg relative z-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi bất cứ điều gì... (vd: 'Tìm xe limousine đi Vũng Tàu')"
              className="w-full pl-6 pr-14 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all font-medium text-slate-800"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-md shadow-brand-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}