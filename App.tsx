
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Sender } from './types';
import { CLINIC_SERVICES, QUICK_LINKS } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import ServiceCard from './components/ServiceCard';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        return 'dark';
      }
    }
    return 'light';
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: Sender.BOT,
      text: "Welcome to Lumina Medical Aesthetics. I'm Aria, your personalized aesthetic consultant. How can I assist you with your beauty goals today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.BOT,
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-20 glass h-20 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-100 dark:shadow-teal-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100 leading-none">LUMINA</h1>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold tracking-[0.2em] uppercase mt-1">Medical Aesthetics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600 transition-all border border-slate-200 dark:border-slate-700"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          <div className="hidden md:flex gap-4">
            <button className="px-5 py-2 bg-teal-600 text-white text-sm font-bold rounded-full hover:bg-teal-700 transition-all shadow-md shadow-teal-100 dark:shadow-none">Book Now</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-6 p-4 md:p-8">
        
        {/* Left Sidebar - Discovery (Desktop only) */}
        <aside className="hidden lg:flex flex-col gap-6 w-72 shrink-0">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Popular Treatments
            </h2>
            <div className="space-y-4">
              {CLINIC_SERVICES.map(s => (
                <div 
                  key={s.id} 
                  className="flex gap-3 group cursor-pointer"
                  onClick={() => handleSend(`Tell me about ${s.name}`)}
                >
                  <img src={s.image} alt={s.name} className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-teal-600">{s.name}</h3>
                    <p className="text-[10px] text-slate-400">{s.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-teal-600 dark:bg-teal-800 p-6 rounded-2xl shadow-lg shadow-teal-100 dark:shadow-none text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-display font-medium mb-2">New Patient Offer</h3>
              <p className="text-xs text-teal-50 mb-4 leading-relaxed">Join our Lumina family and receive 15% off your first treatment.</p>
              <button className="w-full bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 text-xs font-bold py-2 rounded-lg hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors">Claim Now</button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500 dark:bg-teal-700 rounded-full opacity-50 blur-3xl"></div>
          </div>
        </aside>

        {/* Chat Interface Container */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 relative min-h-[600px] max-h-[800px] transition-colors">
          
          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/30 dark:bg-slate-950/20"
          >
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-200 dark:bg-slate-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-200 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Footer / Input */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
            
            {/* Quick Links Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {QUICK_LINKS.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(link.query)}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 transition-all shadow-sm bg-white dark:bg-slate-900"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="relative flex items-center"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aria anything..."
                className="w-full pl-4 pr-14 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-teal-100 dark:shadow-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-3 font-medium">
              Information provided by AI Aria. Consult our staff for medical advice.
            </p>
          </div>
        </div>

        {/* Mobile Featured Services */}
        <div className="lg:hidden mt-8">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 px-2">Featured Treatments</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
            {CLINIC_SERVICES.map(s => (
              <ServiceCard key={s.id} service={s} onSelect={handleSend} />
            ))}
          </div>
        </div>

      </main>

      {/* Sticky Bottom Actions (Mobile) */}
      <div className="md:hidden sticky bottom-0 z-30 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 flex gap-2 transition-colors">
        <button className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-100 dark:shadow-none">
          Book Appointment
        </button>
        <button className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold">
          Call
        </button>
      </div>

      {/* Global Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12 px-6 mt-12 transition-colors border-t border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h2 className="font-display text-2xl mb-4">LUMINA</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">Redefining clinical excellence in medical aesthetics through science and artistry.</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer">
                <span className="text-xs">IG</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer">
                <span className="text-xs">FB</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-teal-400">Quick Links</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Our Team</li>
              <li className="hover:text-white cursor-pointer transition-colors">Services</li>
              <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-6 uppercase tracking-widest text-teal-400">Location</h3>
            <p className="text-sm text-slate-400 mb-2">123 Radiance Blvd, Suite 400</p>
            <p className="text-sm text-slate-400 mb-6">Beverly Hills, CA 90210</p>
            <p className="text-sm text-slate-100 font-bold">(555) 123-4567</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2024 Lumina Medical Aesthetics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
