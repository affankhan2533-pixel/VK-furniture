import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const location = useLocation();

  const getWhatsappUrl = () => {
    const path = location.pathname;
    let pageName = "Homepage";
    let productName = "General Teak Wood Furniture";

    if (path === '/') {
      pageName = "Home Page";
      productName = "General Collection";
    } else if (path === '/catalog') {
      pageName = "Collections Catalog";
      productName = "Store Catalog Items";
    } else if (path.startsWith('/product/')) {
      pageName = "Product Specs Page";
      const slug = path.split('/').pop() || "";
      productName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else if (path === '/gallery') {
      pageName = "Gallery Page";
      productName = "Gallery Showcases";
    } else if (path === '/about') {
      pageName = "About Us Page";
      productName = "Wholesale Custom Manufacturing";
    } else if (path === '/contact') {
      pageName = "Contact Page";
      productName = "Custom Quote Query";
    } else if (path === '/custom-planner') {
      pageName = "Custom Furniture Planner";
      productName = "Bespoke Design Configuration";
    }

    const text = `Hello VK Furniture,
I am interested in:
Product: ${productName}
Page: ${pageName}

Please contact me.`;

    return `https://wa.me/919821454706?text=${encodeURIComponent(text)}`;
  };

  return (
    <a
      href={getWhatsappUrl()}
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

export default React.memo(WhatsAppButton);
