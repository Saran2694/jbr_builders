import React, { useState } from 'react';
import { X } from 'lucide-react';
import { COMPANY_INFO } from '../data/company';
import { useCMS } from '../context/CMSContext';
import { WhatsAppIcon } from './WhatsAppIcon';

export const FloatingWhatsApp: React.FC = () => {
  const { company } = useCMS();
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl = company?.whatsappUrl || COMPANY_INFO.whatsappUrl;

  return (
    <aside aria-label="WhatsApp quick contact" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Frosted Glass Tooltip bubble in Blue and White */}
      <div
        className={`hidden sm:flex items-center gap-2 mr-3 px-4 py-2.5 rounded-full glass-panel border border-white/90 text-xs font-bold text-[#123B68] shadow-lg transition-all duration-300 ${
          showTooltip
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#2468A6] animate-pulse" />
        <span>Chat with JBR Builders Engineering</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(false);
          }}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100"
          aria-label="Dismiss tooltip"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Blue & White Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with JBR Builders"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-[#123B68] to-[#2468A6] text-white shadow-[0_8px_30px_rgba(18,59,104,0.45)] hover:shadow-[0_12px_40px_rgba(36,104,166,0.6)] transition-all duration-300 transform hover:scale-110 focus:outline-none"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38BDF8] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#2468A6] border-2 border-white"></span>
        </span>
        <WhatsAppIcon className="w-7 h-7 text-white" />
      </a>
    </aside>
  );
};
