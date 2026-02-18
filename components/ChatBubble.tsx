
import React from 'react';
import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isBot = message.sender === Sender.BOT;

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end animate-in slide-in-from-right-4 duration-300'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm transition-colors duration-300 ${
        isBot 
          ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700' 
          : 'bg-teal-600 dark:bg-teal-700 text-white rounded-tr-none'
      }`}>
        {isBot && (
          <div className="flex items-center mb-2 gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300">A</span>
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Aria</span>
          </div>
        )}
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </div>
        <div className={`text-[10px] mt-2 opacity-50 ${isBot ? 'text-slate-400 dark:text-slate-500' : 'text-teal-50'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
