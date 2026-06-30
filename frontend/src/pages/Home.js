import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, ArrowRight, MapPin } from 'lucide-react';
import SEO from '../components/SEO';

const Home = () => {
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
      rows: 'md:row-span-1',
      categoryKey: 'Sofas'
    },
    {
      title: 'Accent Chairs',
      hindi: 'आराम कुर्सियाँ',
      desc: 'Vintage Royal, Armchairs, Bar Stools',
      image: '/images/grey-armchair.png',
      cols: 'md:col-span-4',
      rows: 'md:row-span-2',
      categoryKey: 'Chairs'
    },
    {
      title: 'Dining Tables',
      hindi: 'डाइनिंग टेबल',
      desc: 'Solid Teak with custom sizes & premium glass tops',
      image: '/images/dining-4seater.png',
      cols: 'md:col-span-4',
      rows: 'md:row-span-1',
      categoryKey: 'Tables'
    },
    {
      title: 'Luxury Beds',
      hindi: 'लक्जरी बेड',
      desc: 'Solid sag wood structure built to last for generations',
      image: '/images/king-bed.png',
      cols: 'md:col-span-8',
      rows: 'md:row-span-1',
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
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
            <div className="flex items-center gap-2 bg-parchment py-1.5 px-3 border border-borderSubtle w-fit">
              <Star size={16} fill="#C59D5F" className="text-brass" />
              <span className="text-sm font-semibold text-espresso">5.0 Star Rated Wholesale Manufacturer</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-espresso leading-none">
              Wholesale & Custom <br />
              <span className="text-teak">Teakwood Masterpieces</span>
            </h1>
            
            <span className="font-devanagari text-2xl text-brass mt-1 block tracking-wider font-semibold">
              थोक और कस्टम सागवान (टीक) फर्नीचर निर्माता
            </span>

            <p className="text-lg text-stone font-sans max-w-xl leading-relaxed">
              We specialize in custom size standalone furniture built in Mumbai since 1999. 
              Get direct-from-factory pricing on sag wood sofa sets, royal dining tables, beds, and chairs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/catalog"
                data-testid="hero-catalog-btn"
                className="bg-teak text-cream px-8 py-4 rounded-none hover:bg-walnut hover:translate-y-[-2px] transition-all duration-300 font-sans tracking-widest text-center uppercase text-sm font-semibold flex items-center justify-center gap-2"
              >
                Browse Masterpieces
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20want%20to%20enquire%20about%20your%20furniture%20wholesale%20catalog."
                target="_blank"
                rel="noreferrer"
                data-testid="hero-whatsapp-btn"
                className="border border-teak text-teak px-8 py-4 rounded-none hover:bg-teak hover:text-white hover:translate-y-[-2px] transition-all duration-300 font-sans tracking-widest text-center uppercase text-sm font-semibold flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                WhatsApp Enquiry
              </a>
            </div>
          </div>

          {/* Hero Right Images / Bento-like offset wrapper */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-md h-[450px] bg-parchment border border-borderSubtle p-4 shadow-xl">
              <img
                src="/images/king-bed.png"
                alt="Sagwan Showroom"
                className="w-full h-full object-cover border border-borderSubtle"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 shadow-lg border border-borderSubtle hidden sm:block">
                <p className="text-xs uppercase tracking-widest text-stone font-semibold">Quality Guaranteed</p>
                <p className="text-sm font-serif font-bold text-espresso">100% Genuine Sagwan Wood</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-teak text-cream py-8 border-y border-walnut">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col space-y-1">
                <span className="font-serif text-3xl md:text-4xl font-bold text-brass">{stat.value}</span>
                <span className="font-sans text-xs uppercase tracking-widest text-stone-300 font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections (Bento Grid) */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-tight">
              Featured Collections
            </h2>
            <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
              संग्रह श्रेणियों का अन्वेषण करें
            </span>
            <div className="h-1 w-20 bg-brass mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/catalog?category=${cat.categoryKey}`}
                data-testid={`featured-cat-${cat.categoryKey.toLowerCase()}`}
                className={`${cat.cols} relative group overflow-hidden border border-borderSubtle h-[320px] bg-espresso`}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 text-left w-full">
                  <span className="font-devanagari text-xs text-brass block uppercase tracking-wider mb-1 font-semibold">
                    {cat.hindi}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl text-white font-bold leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-stone-300 text-sm font-sans mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Review Wall */}
      <section className="py-20 bg-parchment border-y border-borderSubtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-tight">
              Words From Our Clients
            </h2>
            <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
              ग्राहकों के अनुभव और प्रतिक्रियाएं
            </span>
            <div className="h-1 w-20 bg-brass mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <div
                key={i}
                data-testid={`review-card-${i}`}
                className="bg-white p-8 border-l-4 border-brass shadow-sm flex flex-col justify-between"
              >
                <div className="flex text-brass mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif text-lg text-espresso italic leading-relaxed mb-6">
                  "{rev.text}"
                </p>
                <div className="flex justify-between items-center text-xs uppercase tracking-widest text-stone font-semibold border-t border-cream pt-4">
                  <span>{rev.author}</span>
                  <span className="text-brass">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Location CTA Strip */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-borderSubtle grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-16 flex flex-col justify-center space-y-6 text-left">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso leading-tight">
                Visit Our Manufacturing Facility in Dharavi
              </h2>
              <p className="text-stone font-sans text-base leading-relaxed">
                See raw premium Sagwan logs turned into fine furniture. Walk into our showroom in Naik Nagar, Dharavi, Mumbai, to experience our collections first-hand and discuss custom dimensions or bulk wholesale order pricing.
              </p>
              <div className="flex items-start gap-3 text-sm text-espresso font-sans">
                <MapPin size={18} className="text-brass mt-0.5 flex-shrink-0" />
                <span>
                  Munna seth compound, Lal Bahadur Shastri Marg, <br />
                  near by Himalaya refrigerator, Naik Nagar, Dharavi, Mumbai
                </span>
              </div>
              <Link
                to="/contact"
                data-testid="home-directions-btn"
                className="bg-teak text-cream px-8 py-3.5 w-fit hover:bg-walnut transition-colors uppercase font-sans text-xs font-semibold tracking-wider"
              >
                Get Directions & Contact Form
              </Link>
            </div>
            
            {/* Workshop image */}
            <div className="h-[350px] lg:h-auto min-h-[300px]">
              <img
                src="https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg"
                alt="V.K. Furniture Workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
