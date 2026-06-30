import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappUrl = "https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20visited%20your%20website%20and%20want%20to%20enquire%20about%20your%20custom%2Fwholesale%20furniture.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-sticky"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center group"
      aria-label="Enquire on WhatsApp"
    >
      <MessageCircle size={28} className="fill-white stroke-none" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 font-sans font-semibold text-sm uppercase tracking-wider transition-all duration-500 ease-in-out whitespace-nowrap">
        Enquire via WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
