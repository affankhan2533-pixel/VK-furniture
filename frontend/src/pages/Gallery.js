import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ZoomIn } from 'lucide-react';

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

  const filtered = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter(g => g.category === activeFilter);

  return (
    <div className="bg-cream py-12 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-left border-b border-borderSubtle pb-8 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-none">
            Our Gallery
          </h1>
          <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
            फर्नीचर गैलरी — हमारे बेहतरीन नमूने
          </span>
          <p className="text-stone font-sans text-sm max-w-xl mt-3">
            A visual showcase of our finest work — premium sagwan pieces crafted in our Dharavi workshop. Click any image to see full view.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              data-testid={`gallery-filter-${cat.toLowerCase()}`}
              className={`px-5 py-2 border font-sans text-sm tracking-wider uppercase transition-all duration-300 ${
                activeFilter === cat
                  ? 'bg-teak text-cream border-teak'
                  : 'bg-white text-stone border-borderSubtle hover:border-teak'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid bg-white border border-borderSubtle overflow-hidden group relative"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                  onClick={() => setLightboxImg(item)}
                  data-testid={`gallery-img-${item.id}`}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/50 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
                </div>
                {/* Category badge */}
                <div className="absolute top-3 left-3 bg-teak text-cream px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold font-sans">
                  {item.category}
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="font-serif text-base font-semibold text-espresso">{item.label}</p>
                {item.productId && (
                  <Link
                    to={`/product/${item.productId}`}
                    data-testid={`gallery-view-${item.id}`}
                    className="text-brass hover:text-teak font-sans text-[11px] uppercase tracking-wider font-bold border-b border-brass hover:border-teak transition-colors"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-parchment border border-borderSubtle p-10 md:p-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso mb-4">
            Interested in a piece you see?
          </h2>
          <p className="text-stone font-sans text-sm max-w-lg mx-auto mb-8">
            Share a screenshot or name the design with us on WhatsApp to get direct factory pricing and availability.
          </p>
          <a
            href="https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20saw%20some%20items%20in%20your%20gallery%20and%20want%20to%20enquire%20about%20pricing."
            target="_blank"
            rel="noreferrer"
            data-testid="gallery-whatsapp-cta"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-10 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#20ba5a] transition-colors"
          >
            <MessageSquare size={16} className="fill-white stroke-none" />
            WhatsApp for Pricing
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-espresso/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
          data-testid="gallery-lightbox"
        >
          <div
            className="relative max-w-4xl w-full bg-white"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-serif text-xl font-bold text-espresso">{lightboxImg.label}</p>
                <p className="text-brass font-sans text-xs uppercase tracking-wider font-bold mt-0.5">{lightboxImg.category}</p>
              </div>
              <div className="flex gap-3">
                {lightboxImg.productId && (
                  <Link
                    to={`/product/${lightboxImg.productId}`}
                    onClick={() => setLightboxImg(null)}
                    className="border border-teak text-teak px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-teak hover:text-white transition-colors"
                  >
                    Full Specs
                  </Link>
                )}
                <a
                  href={`https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20${encodeURIComponent(lightboxImg.label)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] text-white px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-[#20ba5a] transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare size={13} className="fill-white stroke-none" />
                  Enquire
                </a>
                <button
                  onClick={() => setLightboxImg(null)}
                  className="bg-espresso text-white px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-teak transition-colors"
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
