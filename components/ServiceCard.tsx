
import React from 'react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelect: (name: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div 
      className="group min-w-[240px] bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => onSelect(`Tell me more about ${service.name}`)}
    >
      <div className="h-32 overflow-hidden relative">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-teal-800 dark:text-teal-400">
          {service.price}
        </div>
      </div>
      <div className="p-3">
        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">{service.category}</span>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">{service.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{service.description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
