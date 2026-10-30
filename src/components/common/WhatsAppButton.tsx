import React from 'react';
import { MessageSquare } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/917906308640?text=Hello%20Vmove%20Logistics%2C%20I%20would%20like%20to%20enquire%20about%20freight%20services"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1EBE5D] hover:shadow-xl hover:scale-105 transition-all group font-semibold text-sm"
      aria-label="Chat with Vmove Logistics on WhatsApp at 7906308640"
    >
      <MessageSquare className="w-5 h-5 fill-white text-white group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline">WhatsApp Us: 7906308640</span>
    </a>
  );
};
