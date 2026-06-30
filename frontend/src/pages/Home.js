import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import gsap from 'gsap';
import SEO from '../components/SEO';

const Home = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Ambient dust particles
    const dots = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      size: `${Math.random() * 4 + 2}px`,
      duration: `${Math.random() * 5 + 6}s`
    }));
    setParticles(dots);

    // GSAP text animations
    gsap.fromTo('.hero-fade-up', 
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out', stagger: 0.15 }
    );
    gsap.fromTo('.hero-bg-zoom',
      { scale: 1.12 },
      { scale: 1, duration: 2.8, ease: 'power3.out' }
    );
  }, []);

  const stats = [
    { value: '5.0 ★', label: 'Google Rating' },
    { value: '50+ Units', label: 'Chairs/Stools MOQ' },
    { value: '24 Hours', label: 'Open Daily' },
    { value: 'Sag Wood', label: 'Teak/Sagwan Quality' },
  ];

  const categories = [
    {
      title: 'Sofa Sets',
      hindi: 'सोफा सेट',
      desc: 'L/U-Shape, Recliners, Sofa Cum Beds',
      image: '/images/sofa-teak.png',
      cols: 'md:col-span-8',
      categoryKey: 'Sofas'
    },
    {
      title: 'Accent Chairs',
      hindi: 'आराम कुर्सियाँ',
      desc: 'Vintage Royal, Armchairs, Bar Stools',
      image: '/images/grey-armchair.png',
      cols: 'md:col-span-4',
      categoryKey: 'Chairs'
    },
    {
      title: 'Dining Tables',
      hindi: 'डाइनिंग टेबल',
      desc: 'Solid Teak with custom sizes & premium glass tops',
      image: '/images/dining-4seater.png',
      cols: 'md:col-span-4',
      categoryKey: 'Tables'
    },
    {
      title: 'Luxury Beds',
      hindi: 'लक्जरी बेड',
      desc: 'Solid sag wood structure built to last for generations',
      image: '/images/king-bed.png',
      cols: 'md:col-span-8',
      categoryKey: 'Beds'
    }
  ];

  const reviews = [
    {
      text: "Shop have big collection and products prices is also very good n cheap.",
      author: "Local Buyer",
      location: "Mumbai"
    },
    {
      text: "The quality for the product is very good furniture in kurla Mumbai.",
      author: "Siddhesh K.",
      location: "Kurla, Mumbai"
    },
    {
      text: "Best manufacturer in wholesaler and retailer in Mumbai. I purchase furniture this shops very nice everyone visit this shops only sag wood like chair sofa come bed.",
      author: "Satisfied Customer",
      location: "Dharavi, Mumbai"
    }
  ];

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness"],
    "name": "V.K. Furniture (वी.के. फर्नीचर)",
    "image": "https://vk-furniture.vercel.app/images/workshop.png",
    "telephone": "098214 54706",
    "url": "https://vk-furniture.vercel.app",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Munna seth compound, Lal Bahadur Shastri Marg, Naik Nagar, Dharavi",
      "addressLocality": "Mumbai",
      "addressRegion": "MH",
      "postalCode": "400070",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.0563844,
      "longitude": 72.8596644
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "priceRange": "$$"
  };

  return (
    <div className="fade-in">
      <SEO
        title="V.K. Furniture | Premium Wholesale & Custom Furniture Mumbai"
        description="V.K. Furniture (वी.के.फर्नीचर) — Premium custom & wholesale teak wood (sagwan) furniture manufacturer in Dharavi, Mumbai. Wholesale rates for dealers & hotels. Walk in 24/7."
        schema={homeSchema}
      />

      {/* Cinematic Parallax Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#2B2621]">
        
        {/* Parallax / Zoom Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg"
            alt="Premium Furniture Setup"
            className="w-full h-full object-cover opacity-50 hero-bg-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A3028] via-black/35 to-transparent"></div>
        </div>

        {/* Dust Overlay Animation */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {particles.map(p => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: p.left,
                animationDelay: p.delay,
                width: p.size,
                height: p.size,
                animationDuration: p.duration
              }}
            />
          ))}
        </div>

        {/* Content Box */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30 text-center py-24 md:py-36">
          <div className="flex flex-col items-center space-y-7 max-w-4xl mx-auto">
            
            <div className="hero-fade-up flex items-center gap-2 bg-white/15 backdrop-blur-md py-1.5 px-4 border border-white/25 rounded-full w-fit">
              <Star size={13} fill="#B08D57" className="text-primary" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary font-sans hero-text-shadow">
                Genuine Seasoned Sagwan Teak Wood
              </span>
            </div>

            <h1 className="hero-fade-up font-serif text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] hero-text-shadow">
              Crafting <span className="text-primary italic">Timeless</span> Elegance
            </h1>

            <span className="hero-fade-up font-devanagari text-xl text-primary block tracking-wider font-semibold hero-text-shadow">
              थोक और कस्टम सागवान (टीक) फर्नीचर निर्माता
            </span>

            <p className="hero-fade-up text-sm md:text-base text-white font-semibold font-sans max-w-2xl leading-relaxed md:leading-[1.7] tracking-wide hero-text-shadow">
              Serving dealers, hotels, and homeowners since 1999. Get B2B wholesale rates on custom-carved luxury sofas, imperial beds, and glass dining suites.
            </p>

            <div className="hero-fade-up flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center">
              <Link
                to="/catalog"
                data-testid="hero-catalog-btn"
                className="bg-primary hover:bg-primary-dark text-white border border-primary px-10 py-4 font-sans tracking-widest text-center uppercase text-xs font-bold transition-all duration-300 cursor-pointer"
              >
                Explore Collection
              </Link>
              <Link
                to="/custom-planner"
                className="border border-white hover:border-primary text-white hover:bg-primary hover:text-white px-10 py-4 font-sans tracking-widest text-center uppercase text-xs font-bold transition-all duration-300 cursor-pointer"
              >
                Custom Furniture
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[#3A3028] text-white py-10 border-t border-primary/20 border-b border-primary/10 shadow-inner relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col space-y-1">
                <span className="font-serif text-3xl md:text-4xl font-bold text-primary">{stat.value}</span>
                <span className="font-sans text-[10px] uppercase tracking-widest text-[#FAF7F2]/80 font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Bento Grid Featured Collections */}
      <section className="py-24 bg-light text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
              Featured Collections
            </h2>
            <span className="font-devanagari text-lg text-primary mt-1.5 block tracking-wider font-semibold">
              संग्रह श्रेणियों का अन्वेषण करें
            </span>
            <div className="h-[1px] w-16 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/catalog?category=${cat.categoryKey}`}
                data-testid={`featured-cat-${cat.categoryKey.toLowerCase()}`}
                className={`${cat.cols} relative group overflow-hidden border border-borderSubtle h-[340px] bg-dark block reveal reveal-delay-${i % 4}`}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-left w-full">
                  <span className="font-devanagari text-xs text-primary block uppercase tracking-wider mb-1 font-semibold">
                    {cat.hindi}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-white font-bold leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-gray-300 text-xs font-sans mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Review Wall */}
      <section className="py-24 bg-[#FAF7F2] border-y border-borderSubtle text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
              Words From Our Clients
            </h2>
            <span className="font-devanagari text-lg text-primary mt-1.5 block tracking-wider font-semibold">
              ग्राहकों के अनुभव और प्रतिक्रियाएं
            </span>
            <div className="h-[1px] w-16 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <div
                key={i}
                data-testid={`review-card-${i}`}
                className={`bg-white p-8 border-t-2 border-primary shadow-sm flex flex-col justify-between reveal reveal-delay-${i % 3} glass-hover-card`}
              >
                <div>
                  <div className="flex text-primary mb-4 justify-start">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="font-serif text-lg italic leading-relaxed text-dark mb-6 text-left">
                    "{rev.text}"
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-500 font-bold border-t border-borderSubtle pt-4">
                  <span>{rev.author}</span>
                  <span className="text-primary">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Location CTA Strip */}
      <section className="py-24 bg-light text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-borderSubtle grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center space-y-6 text-left">
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                Visit Our Manufacturing Facility in Dharavi
              </h2>
              <p className="text-gray-600 dark:text-gray-300 font-sans text-sm leading-relaxed">
                See raw premium Sagwan logs turned into fine furniture. Walk into our showroom in Naik Nagar, Dharavi, Mumbai, to experience our collections first-hand and discuss custom dimensions or bulk wholesale order pricing.
              </p>
              <div className="flex items-start gap-3 text-xs text-dark font-sans">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Munna seth compound, Lal Bahadur Shastri Marg, <br />
                  near by Himalaya refrigerator, Naik Nagar, Dharavi, Mumbai
                </span>
              </div>
              <Link
                to="/contact"
                data-testid="home-directions-btn"
                className="luxury-btn shine-hover bg-primary text-white border-primary px-8 py-3.5 w-fit uppercase font-sans text-xs font-bold tracking-widest"
              >
                Get Directions
              </Link>
            </div>
            
            <div className="h-[350px] lg:h-auto min-h-[300px] overflow-hidden image-reveal active">
              <img
                src="https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg"
                alt="V.K. Furniture Workshop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
