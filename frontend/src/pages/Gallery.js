import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/SEO';

const galleryItems = [
  {
    id: 'g1',
    src: '/images/dining-4seater.png',
    alt: 'Teak Glass-Top 4-Seater Dining Set',
    category: 'Dining',
    label: '4-Seater Glass Dining Set',
    productId: 'handcrafted-teak-dining-set'
  },
  {
    id: 'g2',
    src: '/images/dining-6seater.png',
    alt: '6-Seater Sagwan Dining Table with Chairs',
    category: 'Dining',
    label: '6-Seater Sagwan Dining Set',
    productId: 'handcrafted-teak-dining-set'
  },
  {
    id: 'g3',
    src: '/images/grey-armchair.png',
    alt: 'Modern Grey Upholstered Accent Chair',
    category: 'Chairs',
    label: 'Modern Upholstered Armchair',
    productId: 'upholstered-accent-armchair'
  },
  {
    id: 'g4',
    src: '/images/sofa-teak.png',
    alt: 'Heavy Carved Teak Sofa Set',
    category: 'Sofas',
    label: 'Royal Sagwan Sofa Set',
    productId: 'royal-sagwan-sofa'
  },
  {
    id: 'g5',
    src: '/images/king-bed.png',
    alt: 'Premium Sagwan King Size Bed',
    category: 'Beds',
    label: 'Imperial King Bed with Storage',
    productId: 'traditional-sagwan-bed'
  },
  {
    id: 'g6',
    src: '/images/workshop.png',
    alt: 'V.K. Furniture Dharavi Workshop',
    category: 'Workshop',
    label: 'Our Craftsmen at Work',
    productId: null
  },
  {
    id: 'g7',
    src: 'https://images.pexels.com/photos/33349415/pexels-photo-33349415.jpeg',
    alt: 'Modern Luxury Sofa',
    category: 'Sofas',
    label: 'Luxury Upholstered Sofa',
    productId: 'royal-sagwan-sofa'
  },
  {
    id: 'g8',
    src: 'https://images.unsplash.com/photo-1762803841091-c5327f7aed37',
    alt: 'Vintage Lounge Chair',
    category: 'Chairs',
    label: 'Vintage Lounge Chair',
    productId: 'vintage-wooden-lounge-chair'
  },
  {
    id: 'g9',
    src: 'https://images.pexels.com/photos/19093861/pexels-photo-19093861.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Dining Room Teak Wood Set',
    category: 'Dining',
    label: 'Premium Dining Room Set',
    productId: 'handcrafted-teak-dining-set'
  },
  {
    id: 'g10',
    src: 'https://images.pexels.com/photos/6830012/pexels-photo-6830012.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Bedroom Sagwan Furniture',
    category: 'Beds',
    label: 'Bedroom Collection',
    productId: 'traditional-sagwan-bed'
  },
  {
    id: 'g11',
    src: 'https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg',
    alt: 'Craftsman restoring chair',
    category: 'Workshop',
    label: 'Craftsman at Work',
    productId: null
  },
  {
    id: 'g12',
    src: 'https://images.pexels.com/photos/37145335/pexels-photo-37145335.jpeg',
    alt: 'Furniture workshop showroom',
    category: 'Workshop',
    label: 'Our Dharavi Showroom',
    productId: null
  },
];

const categories = ['All', 'Dining', 'Sofas', 'Chairs', 'Beds', 'Workshop'];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [items, setItems] = useState(galleryItems);

  useEffect(() => {
    const fetchGallery = async () => {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      try {
        const res = await axios.get(`${BACKEND_URL}/api/gallery`);
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        }
      } catch (err) {
        console.error("Failed to load gallery items:", err);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxImg(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = activeFilter === 'All'
    ? items
    : items.filter(g => g.category === activeFilter);

  return (
    <div className="bg-cream dark:bg-dark py-8 md:py-16 transition-colors duration-500 fade-in">
      <SEO
        title="Handcrafted Furniture Gallery | V.K. Furniture"
        description="Explore photos of premium custom furniture built at our Mumbai workshop. View detailed designs for teak wood sofa sets, dining tables, and beds."
        ogImage="/images/workshop.png"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-borderSubtle pb-6 md:pb-12 mb-8 md:mb-12">
          {/* Left Column: Heading & Intro */}
          <div className="md:col-span-7 text-left space-y-3">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-espresso dark:text-light leading-tight">
              Our Gallery
            </h1>
            <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
              फर्नीचर गैलरी — हमारे बेहतरीन नमूने
            </span>
            <p className="text-stone dark:text-gray-300 font-sans text-sm md:text-base max-w-xl leading-relaxed mt-2">
              A visual showcase of our finest work — premium sagwan pieces crafted in our Dharavi workshop. Click any image to see full view.
            </p>
          </div>
          
          {/* Right Column: Premium Visual Element (Refined Statistics Card) */}
          <div className="md:col-span-5 w-full">
            <div className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 p-6 md:p-8 rounded-[16px] shadow-sm relative overflow-hidden group">
              {/* Subtle gold line accent */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-brass"></div>
              
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                <div>
                  <p className="font-serif text-2xl md:text-3xl font-bold text-brass">Since 1999</p>
                  <p className="text-[10px] font-sans uppercase tracking-wider text-stone dark:text-gray-300 font-semibold mt-1">Established</p>
                </div>
                <div>
                  <p className="font-serif text-2xl md:text-3xl font-bold text-brass">500+</p>
                  <p className="text-[10px] font-sans uppercase tracking-wider text-stone dark:text-gray-300 font-semibold mt-1">Bespoke Projects</p>
                </div>
                <div>
                  <p className="font-serif text-xl md:text-2xl font-bold text-brass">Premium</p>
                  <p className="text-[10px] font-sans uppercase tracking-wider text-stone dark:text-gray-300 font-semibold mt-1">Sagwan Wood</p>
                </div>
                <div>
                  <p className="font-serif text-xl md:text-2xl font-bold text-brass">Mumbai</p>
                  <p className="text-[10px] font-sans uppercase tracking-wider text-stone dark:text-gray-300 font-semibold mt-1">Dharavi Workshop</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2.5 mb-8 md:mb-10">
          {categories.map(cat => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                data-testid={`gallery-filter-${cat.toLowerCase()}`}
                className={`px-5 py-2.5 border font-sans text-xs tracking-widest uppercase transition-all duration-300 rounded-[8px] cursor-pointer font-bold ${
                  isActive
                    ? 'bg-brass text-white border-brass shadow-[0_4px_12px_rgba(176,141,87,0.3)]'
                    : 'bg-white dark:bg-[#221E1B] text-stone dark:text-gray-300 border-borderSubtle dark:border-brass/10 hover:border-brass dark:hover:border-brass hover:text-brass dark:hover:text-brass'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 overflow-hidden group relative rounded-[12px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(176,141,87,0.35)] hover:border-brass/50"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 cursor-pointer"
                  onClick={() => setLightboxImg(item)}
                  data-testid={`gallery-img-${item.id}`}
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div 
                  className="absolute inset-0 bg-espresso/0 group-hover:bg-[#1A1715]/60 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  onClick={() => setLightboxImg(item)}
                >
                  <span className="text-cream text-xs uppercase tracking-widest font-sans font-bold py-2.5 px-5 bg-[#221E1B]/95 border border-brass/30 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-brass hover:text-white hover:border-brass rounded-[6px]">
                    View Image →
                  </span>
                </div>
                {/* Category badge */}
                <div className="absolute top-3 left-3 bg-brass text-white dark:bg-brass dark:text-[#1A1715] px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold font-sans rounded-[4px] shadow-sm z-10">
                  {item.category}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="font-serif text-base font-semibold text-espresso dark:text-light">{item.label}</p>
                {item.productId && (
                  <Link
                    to={`/product/${item.productId}`}
                    data-testid={`gallery-view-${item.id}`}
                    className="text-brass hover:text-teak dark:text-brass dark:hover:text-white font-sans text-[11px] uppercase tracking-wider font-bold border-b border-brass hover:border-teak dark:hover:border-white transition-colors"
                  >
                    View Image →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-24 bg-parchment border border-borderSubtle dark:border-brass/10 dark:bg-[#221E1B] p-8 md:p-16 text-center rounded-[24px] relative overflow-hidden">
          {/* Subtle design element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-brass"></div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso dark:text-light mb-4 leading-tight">
            Commission Your Custom Masterpiece
          </h2>
          <p className="text-stone dark:text-gray-300 font-sans text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Every piece we construct is a testament to timeless artistry and premium timber. Connect with our principal designers to customize any design, explore bespoke sizing, or request our premium material catalogue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/919930668406?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20a%20custom%20furniture%20consultation."
              target="_blank"
              rel="noreferrer"
              data-testid="gallery-whatsapp-cta"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#20ba5a] transition-all duration-300 rounded-[10px] w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              <MessageSquare size={16} className="fill-white stroke-none" />
              WhatsApp Consultation
            </a>
            <a
              href="/catalogue.pdf"
              download
              data-testid="gallery-download-catalogue"
              className="inline-flex items-center justify-center gap-2 border border-brass text-brass dark:border-brass dark:text-brass px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-brass hover:text-white dark:hover:text-[#1A1715] dark:hover:bg-brass transition-all duration-300 rounded-[10px] w-full sm:w-auto bg-transparent"
            >
              Request Catalogue
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-[#1A1715]/90 dark:bg-[#1A1715]/95 z-50 flex items-center justify-center p-4 transition-all"
          onClick={() => setLightboxImg(null)}
          data-testid="gallery-lightbox"
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-[#221E1B] border dark:border-brass/20 rounded-[16px] overflow-hidden shadow-2xl animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              className="w-full max-h-[70vh] object-contain"
            />
            <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-borderSubtle dark:border-brass/10">
              <div>
                <p className="font-serif text-xl font-bold text-espresso dark:text-light">{lightboxImg.label}</p>
                <p className="text-brass font-sans text-xs uppercase tracking-wider font-bold mt-0.5">{lightboxImg.category}</p>
              </div>
              <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
                {lightboxImg.productId && (
                  <Link
                    to={`/product/${lightboxImg.productId}`}
                    onClick={() => setLightboxImg(null)}
                    className="border border-teak text-teak dark:border-brass dark:text-brass px-5 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-teak hover:text-white dark:hover:bg-brass dark:hover:text-[#1A1715] rounded-[8px] transition-colors text-center"
                  >
                    Full Specs
                  </Link>
                )}
                <a
                  href={`https://wa.me/919930668406?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20${encodeURIComponent(lightboxImg.label)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-[#20ba5a] rounded-[8px] transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={13} className="fill-white stroke-none" />
                  Enquire
                </a>
                <button
                  onClick={() => setLightboxImg(null)}
                  className="bg-espresso text-white dark:bg-brass dark:text-[#1A1715] dark:hover:bg-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-teak transition-colors rounded-[8px] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
