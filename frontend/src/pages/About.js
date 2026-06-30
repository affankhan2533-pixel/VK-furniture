import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Clock, Truck, Star, Award, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const About = () => {
  const values = [
    {
      icon: <Award size={28} className="text-brass" />,
      title: 'Premium Sagwan Wood',
      desc: 'We source only A-grade kiln-dried teak (sagwan) — the same premium wood used in colonial-era Indian furniture that lasts for generations.'
    },
    {
      icon: <Users size={28} className="text-brass" />,
      title: 'B2B & Wholesale First',
      desc: 'Built for dealers, hotels, restaurants, offices & institutions. Direct-from-factory pricing with minimum order quantities tailored for commercial projects.'
    },
    {
      icon: <Clock size={28} className="text-brass" />,
      title: 'Open 24 Hours',
      desc: 'Our Dharavi showroom never closes. Walk in at any hour to browse our live collection and speak directly with our master craftsmen.'
    },
    {
      icon: <CheckCircle size={28} className="text-brass" />,
      title: 'Custom Sizing',
      desc: "Every piece can be adjusted to your exact dimensions. Bring your blueprint, measurements or inspiration — we'll make it happen."
    },
    {
      icon: <Truck size={28} className="text-brass" />,
      title: 'Mumbai Delivery',
      desc: 'We handle delivery logistics across Mumbai and Maharashtra for both retail and bulk orders.'
    },
    {
      icon: <Star size={28} className="text-brass" />,
      title: '5.0 Star Rated',
      desc: 'Consistently rated 5 stars by wholesale buyers and retail customers alike on Google for our quality, pricing, and service.'
    },
  ];

  const exclusions = [
    'Modular Kitchens',
    'Built-in Wardrobes',
    'TV Units / Wall Panels',
    'Fixed Interior Work',
  ];

  return (
    <div className="bg-cream fade-in">
      <SEO
        title="Our Dharavi Woodworking Story | V.K. Furniture"
        description="V.K. Furniture has manufactured premium teak wood (sagwan) furniture in Naik Nagar, Dharavi, Mumbai since 1999. Learn about our traditional joinery and master craftsmen."
        ogImage="/images/workshop.png"
      />

      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src="/images/workshop.png"
          alt="V.K. Furniture Craftsman Workshop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/85 via-espresso/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <span className="font-devanagari text-brass text-lg block mb-2 tracking-wider font-semibold">
              हमारे बारे में
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-white leading-none">
              Crafted in Dharavi,<br />
              <span className="text-brass">Built to Last Forever</span>
            </h1>
            <p className="text-stone-200 font-sans text-base mt-4 max-w-xl leading-relaxed">
              A Mumbai-born furniture workshop manufacturing premium teakwood pieces for wholesale dealers, hotels, institutions, and discerning homes since 1999.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-tight">
              Our Story
            </h2>
            <div className="h-1 w-16 bg-brass" />
            <p className="text-stone font-sans text-base leading-relaxed">
              V.K. Furniture was born out of a simple belief: that every Indian home and business deserves beautifully crafted, durable furniture at honest prices. From a small workshop on Lal Bahadur Shastri Marg in Naik Nagar, Dharavi, we have grown into one of Mumbai's most trusted wholesale furniture manufacturers.
            </p>
            <p className="text-stone font-sans text-base leading-relaxed">
              Our craftsmen bring decades of traditional woodworking expertise to every piece — hand-carving teakwood frames, precision-cutting joints, and finishing with premium lacquers that preserve the natural grain. We specialize exclusively in standalone furniture: sofas, chairs, tables, and beds. We deliberately avoid fixed interior work to keep our focus on what we do best.
            </p>
            <p className="text-stone font-sans text-base leading-relaxed">
              Today, our furniture is sold in showrooms across Mumbai, furnishes hotels and restaurants in Maharashtra, and graces homes that value authenticity over mass-produced alternatives.
            </p>
          </div>
          <div className="relative">
            <img
              src="/images/dining-6seater.png"
              alt="Premium sagwan dining set"
              className="w-full h-[480px] object-cover border border-borderSubtle"
            />
            <div className="absolute -bottom-6 -right-6 bg-teak text-cream p-6 border border-walnut hidden md:block">
              <span className="font-serif text-4xl font-bold text-brass block">25+</span>
              <span className="font-sans text-xs uppercase tracking-wider text-stone-200">Years of Craftsmanship</span>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do NOT Make (B2B Clarity) */}
      <section className="py-14 bg-parchment border-y border-borderSubtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-serif text-3xl font-bold text-espresso mb-2">Our Specialization</h3>
            <p className="text-stone font-sans text-sm leading-relaxed mb-4">
              We are a <strong>standalone furniture manufacturer</strong>. To protect our quality standards, we do not take on fixed interior work. This focus allows us to be the best at what we do.
            </p>
            <div className="space-y-2">
              <p className="font-sans text-xs uppercase tracking-wider font-bold text-brass mb-3">We do NOT make:</p>
              {exclusions.map((item) => (
                <div key={item} className="flex items-center gap-3 text-stone font-sans text-sm">
                  <span className="w-1.5 h-1.5 bg-terracotta rounded-full flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/images/sofa-teak.png" alt="Teak Sofa Set" className="w-full h-48 object-cover border border-borderSubtle" />
            <img src="/images/dining-4seater.png" alt="Dining Set" className="w-full h-48 object-cover border border-borderSubtle" />
            <img src="/images/king-bed.png" alt="King Bed" className="w-full h-48 object-cover border border-borderSubtle" />
            <img src="/images/grey-armchair.png" alt="Accent Chair" className="w-full h-48 object-cover border border-borderSubtle" />
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-tight">Why V.K. Furniture?</h2>
            <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">हमें क्यों चुनें</span>
            <div className="h-1 w-20 bg-brass mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((val, i) => (
              <div key={i} className="bg-white border border-borderSubtle p-8 flex flex-col space-y-4 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 flex items-center justify-center bg-parchment border border-borderSubtle">
                  {val.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso">{val.title}</h3>
                <p className="text-stone font-sans text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-teak">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white leading-tight">
              Ready to place a wholesale order?
            </h2>
            <p className="text-stone-300 font-sans text-sm mt-2">
              Call us or send a WhatsApp message to start the conversation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <a
              href="https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20want%20to%20discuss%20a%20wholesale%20order."
              target="_blank"
              rel="noreferrer"
              data-testid="about-whatsapp-cta"
              className="bg-[#25D366] text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#20ba5a] transition-colors text-center"
            >
              WhatsApp Us
            </a>
            <Link
              to="/catalog"
              data-testid="about-catalog-cta"
              className="border border-white text-white px-8 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-teak transition-colors flex items-center gap-2 justify-center"
            >
              Browse Catalog <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
