
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Sender } from './types.ts';
import { CLINIC_SERVICES, QUICK_LINKS } from './constants.tsx';
import { sendMessageToGemini } from './services/geminiService.ts';
import ChatBubble from './components/ChatBubble.tsx';
import ServiceCard from './components/ServiceCard.tsx';

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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-20 glass h-20 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-11 h-11 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/30 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            {/* Live Indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse shadow-sm"></span>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-none">LUMINA</h1>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold tracking-[0.2em] uppercase">Medical Aesthetics</p>
               <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
               <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live Assistant</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
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
          <button className="hidden sm:flex px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-full transition-all shadow-lg shadow-teal-100 dark:shadow-none uppercase tracking-widest">
            Book Now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-8 p-4 md:p-10">
        
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-8 w-80 shrink-0">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
              <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
              Clinical Focus
            </h2>
            <div className="space-y-6">
              {CLINIC_SERVICES.map(s => (
                <div 
                  key={s.id} 
                  className="flex gap-4 group cursor-pointer"
                  onClick={() => handleSend(`Tell me about ${s.name}`)}
                >
                  <div className="relative shrink-0">
                    <img src={s.image} alt={s.name} className="w-14 h-14 rounded-2xl object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 shadow-sm" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 transition-colors">{s.name}</h3>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold mt-1">{s.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-8 rounded-3xl shadow-2xl shadow-teal-200/20 dark:shadow-none text-white relative overflow-hidden group">
            <div className="relative z-10">
              <span className="inline-block px-2 py-1 bg-white/20 rounded text-[9px] font-bold uppercase tracking-widest mb-4">Limited Offer</span>
              <h3 className="text-xl font-display font-semibold mb-3">Expert Consultation</h3>
              <p className="text-xs text-teal-50/80 mb-6 leading-relaxed">Schedule your skin analysis with our master injectors this month and receive a signature glow treatment.</p>
              <button className="w-full bg-white text-teal-800 text-xs font-black py-3 rounded-2xl hover:bg-teal-50 transition-all shadow-md active:scale-95 uppercase tracking-widest">Claim Consultation</button>
            </div>
            {/* Abstract Decorative Element */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-teal-400 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          </div>
        </aside>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 relative min-h-[600px] transition-colors">
          
          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/20 dark:bg-slate-950/20"
          >
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Footer */}
          <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            
            {/* Quick Suggestions */}
            <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
              {QUICK_LINKS.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(link.query)}
                  className="whitespace-nowrap px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all shadow-sm bg-white dark:bg-slate-900 active:scale-95"
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
                placeholder="Ask Aria about our clinical services..."
                className="w-full pl-6 pr-16 py-5 bg-slate-100 dark:bg-slate-800/50 border-none rounded-3xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500/50 transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-3.5 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-teal-100 dark:shadow-none active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-4">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
               <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                 System Optimized for Netlify Production
               </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-16 px-6 mt-12 transition-colors border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="font-display text-3xl mb-4 font-bold tracking-tight">LUMINA</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              We provide the highest standard of non-surgical aesthetic care. Our mission is to enhance your natural beauty with precision, science, and a meticulous touch.
            </p>
            <div className="flex gap-5">
              {['Instagram', 'Facebook', 'LinkedIn'].map(social => (
                <span key={social} className="text-[10px] font-black uppercase tracking-widest text-teal-400 hover:text-white cursor-pointer transition-colors">
                  {social}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-black text-[10px] mb-8 uppercase tracking-[0.2em] text-teal-400">Clinic Info</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="hover:text-teal-400 cursor-pointer transition-colors">Treatments & Results</li>
              <li className="hover:text-teal-400 cursor-pointer transition-colors">Safety Protocols</li>
              <li className="hover:text-teal-400 cursor-pointer transition-colors">Client Testimonials</li>
              <li className="hover:text-teal-400 cursor-pointer transition-colors">Aesthetic Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="font-black text-[10px] mb-8 uppercase tracking-[0.2em] text-teal-400">Contact</h3>
            <p className="text-sm text-slate-400 mb-2">123 Radiance Blvd, Suite 400</p>
            <p className="text-sm text-slate-400 mb-8">Beverly Hills, CA 90210</p>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-xs text-teal-400 font-bold uppercase tracking-widest mb-1">Direct Line</p>
              <p className="text-sm text-slate-100 font-bold tracking-wide">(555) 123-4567</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-800 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">© 2024 Lumina Medical Aesthetics. Deployed with Precision.</p>
          <div className="flex gap-8">
            <span className="text-[10px] text-slate-500 hover:text-white cursor-pointer uppercase tracking-widest transition-colors">Privacy</span>
            <span className="text-[10px] text-slate-500 hover:text-white cursor-pointer uppercase tracking-widest transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
