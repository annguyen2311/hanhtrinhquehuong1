import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateTravelAdvice } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Xin chào! 👋 Tôi là trợ lý du lịch AI của bạn. Tôi có thể giúp bạn tìm vé, gợi ý điểm đến, hoặc trả lời câu hỏi về du lịch Việt Nam.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await generateTravelAdvice(userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-[600px] flex flex-col shadow-2xl">
        <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-4 rounded-xl flex gap-3 ${
                  msg.role === 'user' 
                    ? 'bg-sky-500/20 text-slate-100 rounded-tr-none' 
                    : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700'
                }`}
              >
                <div className="mt-1 flex-shrink-0">
                  {msg.role === 'model' ? <Bot size={18} className="text-teal-400" /> : <User size={18} className="text-sky-400" />}
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 p-4 rounded-xl rounded-tl-none border border-slate-700 flex items-center gap-2 text-slate-400 text-sm">
                 <Sparkles size={16} className="animate-spin text-teal-400" />
                 Đang suy nghĩ...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Nhập câu hỏi của bạn..." 
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 p-4 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-500"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-sky-500 hover:bg-sky-400 text-white p-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <button 
          onClick={() => handleQuickQuestion('Tìm xe từ Hà Nội đến Hồ Chí Minh')}
          className="bg-slate-800/50 border border-slate-700 hover:border-sky-500 p-4 rounded-xl text-left transition-all hover:-translate-y-1"
        >
          <h4 className="font-semibold text-slate-200 mb-1 text-sm">🚌 Xe khách Bắc Nam</h4>
          <p className="text-xs text-slate-400">Tìm xe từ Hà Nội đến Hồ Chí Minh</p>
        </button>
        <button 
          onClick={() => handleQuickQuestion('Gợi ý khách sạn ở Đà Nẵng view biển')}
          className="bg-slate-800/50 border border-slate-700 hover:border-sky-500 p-4 rounded-xl text-left transition-all hover:-translate-y-1"
        >
          <h4 className="font-semibold text-slate-200 mb-1 text-sm">🏨 Khách sạn Đà Nẵng</h4>
          <p className="text-xs text-slate-400">Gợi ý nơi nghỉ dưỡng view đẹp</p>
        </button>
      </div>
    </div>
  );
};