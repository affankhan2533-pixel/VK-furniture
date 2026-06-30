import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MessageSquareCode, Send, X, Bot, Armchair, Calculator, MapPin } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am your V.K. Furniture AI Design Assistant. Feel free to ask me anything about seasoned Teak wood (Sagwan), delivery options, layout recommendations for rooms, or ask for "furniture under 50000" to see matching products!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/ai/chat`, { message: userText });
      const data = response.data;
      
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: data.reply, 
          layout: data.layout, 
          recommendations: data.recommendations 
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Apologies, I encountered a communication delay. Please check your internet or retry.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    setInput(question);
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 font-sans">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-espresso hover:bg-teak text-cream p-4 rounded-full shadow-2xl border border-brass flex items-center justify-center transition-all duration-300 transform hover:scale-110 cursor-pointer group"
          title="Open AI Assistant"
        >
          <MessageSquareCode size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute right-full mr-3 bg-espresso/90 border border-borderSubtle text-cream text-[10px] uppercase tracking-widest font-sans font-bold py-1.5 px-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            AI Assistant
          </span>
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[500px] bg-white border border-borderSubtle shadow-2xl flex flex-col justify-between overflow-hidden scale-in">
          
          {/* Header */}
          <div className="bg-espresso text-cream p-4 border-b border-walnut flex justify-between items-center text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-teak rounded-full flex items-center justify-center border border-brass">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold tracking-wider leading-none">VK AI Assistant</h4>
                <span className="font-devanagari text-[10px] text-brass block mt-0.5 tracking-wider">एआई इंटीरियर गाइड</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone hover:text-white p-1 cursor-pointer border-none bg-transparent"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-cream/20">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}>
                
                <div className={`p-3 max-w-[85%] text-xs text-left leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-teak text-white font-semibold' 
                    : 'bg-white border border-borderSubtle text-espresso shadow-sm'
                }`}>
                  {m.text}
                </div>

                {/* Optional Room Layout recommendations */}
                {m.layout && (
                  <div className="bg-parchment/60 border border-borderSubtle p-2.5 max-w-[85%] font-mono text-[9px] text-left text-espresso select-all whitespace-pre-wrap">
                    {m.layout}
                  </div>
                )}

                {/* Optional Product Recommendations cards */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 w-[85%] mt-1">
                    {m.recommendations.map(p => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        onClick={() => setIsOpen(false)}
                        className="bg-white border border-borderSubtle p-2 flex gap-2 hover:border-teak transition-colors text-left"
                      >
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover bg-cream" />
                        <div className="overflow-hidden">
                          <h5 className="font-serif text-[11px] font-bold text-espresso truncate leading-tight">{p.name}</h5>
                          <span className="text-[9px] text-brass uppercase font-bold tracking-wider block mt-0.5">{p.category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-stone text-[10px] font-semibold tracking-wider font-sans">
                <RefreshCw size={12} className="animate-spin text-teak" />
                Thinking Layouts...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick recommendations chips */}
          <div className="px-4 py-2 border-t border-cream bg-parchment/10 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide text-left">
            <button
              onClick={() => handleQuickQuestion('Suggest layout for 10x12 ft room')}
              className="px-2.5 py-1.5 bg-white border border-borderSubtle text-[9px] font-bold uppercase tracking-wider text-stone hover:border-teak cursor-pointer"
            >
              <Calculator size={10} className="inline mr-1" /> Room Layout
            </button>
            <button
              onClick={() => handleQuickQuestion('Teak furniture under 50000')}
              className="px-2.5 py-1.5 bg-white border border-borderSubtle text-[9px] font-bold uppercase tracking-wider text-stone hover:border-teak cursor-pointer"
            >
              <Armchair size={10} className="inline mr-1" /> Budget Recs
            </button>
            <button
              onClick={() => handleQuickQuestion('Where is the showroom located?')}
              className="px-2.5 py-1.5 bg-white border border-borderSubtle text-[9px] font-bold uppercase tracking-wider text-stone hover:border-teak cursor-pointer"
            >
              <MapPin size={10} className="inline mr-1" /> Showroom Address
            </button>
          </div>

          {/* Chat Input form */}
          <form onSubmit={handleSend} className="p-3 border-t border-borderSubtle bg-white flex gap-2">
            <input
              type="text"
              aria-label="AI Chat message input"
              placeholder="Ask AI Interior Guide..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow px-3 py-2 bg-cream/20 border border-borderSubtle text-xs focus:outline-none focus:border-teak"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Send message"
              className="bg-espresso text-cream hover:bg-teak px-3.5 flex items-center justify-center border-none cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

// Simple spinner icon for loaders
const RefreshCw = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

export default AIChatbot;
