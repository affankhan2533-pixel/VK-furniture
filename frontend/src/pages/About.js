import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Phone } from 'lucide-react';
import SEO from '../components/SEO';

const timelineMilestones = [
  {
    year: "1999",
    title: "First Workshop Setup",
    desc: "Established a small artisanal woodworking shop in Naik Nagar, Dharavi, focusing on authentic solid teakwood furniture."
  },
  {
    year: "2005",
    title: "B2B Expansion",
    desc: "Began manufacturing customized timber furniture frames for showroom dealers and B2B wholesale buyers across Mumbai."
  },
  {
    year: "2012",
    title: "First Hotel Project",
    desc: "Secured our first large-scale commercial hotel contract, fabricating bespoke bedroom frames and lounge seating in Maharashtra."
  },
  {
    year: "2020",
    title: "500+ Projects Completed",
    desc: "Crossed the milestone of 500 bespoke custom residential projects, bringing tailored teak designs into Indian households."
  },
  {
    year: "Present Day",
    title: "Leading Custom Hardwood Supplier",
    desc: "Providing factory-direct custom furniture planning online, while maintaining traditional joinery craftsmanship at our Dharavi shop."
  }
];

const craftsmenStats = [
  {
    title: "25+ Years Experience",
    desc: "Handcrafting solid timber in Mumbai since 1999."
  },
  {
    title: "500+ Projects",
    desc: "Custom residential and commercial spaces furnished."
  },
  {
    title: "100% Sagwan Wood",
    desc: "Grade-A teakwood selected for grain longevity."
  },
  {
    title: "Mumbai Workshop",
    desc: "Located in the heart of Dharavi supporting local artisans."
  },
  {
    title: "Google 5★ Reviews",
    desc: "Consistently rated 5 stars for durability and craftsmanship."
  }
];

const customerReviews = [
  {
    name: "Aarav Mehta",
    location: "Bandra, Mumbai",
    quote: "The craftsmanship is unparalleled. Our custom 8-seater dining table is the center of our home now. V.K. Furniture transformed our sketch into a masterpiece.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=compress&cs=tinysrgb&crop=face&fit=crop&h=100&w=100",
    rating: 5
  },
  {
    name: "Priya Sharma",
    location: "Colaba, Mumbai",
    quote: "I was skeptical about ordering custom sofas online, but visiting their Dharavi workshop and seeing the raw sagwan wood convinced me. The final sectional is gorgeous and heavy!",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=compress&cs=tinysrgb&crop=face&fit=crop&h=100&w=100",
    rating: 5
  },
  {
    name: "Rajesh Patel",
    location: "Andheri, Mumbai",
    quote: "Flawless joinery and beautiful honey finish. They accommodated our custom dimensions to the inch. Highly recommended for premium hardwood pieces.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=compress&cs=tinysrgb&crop=face&fit=crop&h=100&w=100",
    rating: 5
  }
];

const About = () => {
  return (
    <div className="bg-cream dark:bg-dark text-espresso dark:text-light transition-colors duration-500 py-8 md:py-16 fade-in font-sans">
      <SEO
        title="Our Dharavi Woodworking Story | V.K. Furniture"
        description="V.K. Furniture has manufactured premium teak wood (sagwan) furniture in Naik Nagar, Dharavi, Mumbai since 1999. Learn about our traditional joinery and master craftsmen."
        ogImage="/images/workshop.png"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-28">
        
        {/* SECTION 1: Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side */}
          <div className="lg:col-span-7 text-left space-y-5">
            <span className="font-devanagari text-base md:text-lg text-brass block tracking-wider font-semibold">
              हमारे बारे में — परंपरा और शिल्प कौशल
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Crafted in Dharavi,<br />
              <span className="text-brass">Built to Last Forever</span>
            </h1>
            <div className="h-1 w-20 bg-brass rounded" />
            <p className="text-stone dark:text-gray-300 font-sans text-sm md:text-base max-w-xl leading-relaxed">
              V.K. Furniture was born out of a simple belief: that every Indian home and business deserves beautifully crafted, durable furniture at honest prices. From our Naik Nagar workshop in Dharavi, we fabricate solid teakwood pieces that honor heritage joint methods and stand the test of time.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/custom-planner"
                className="bg-brass text-white hover:bg-[#977848] px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-[8px] cursor-pointer shadow-md shadow-brass/20"
              >
                Plan Custom Order
              </Link>
              <a
                href="https://wa.me/919930668406?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20discussing%20a%20teak%20furniture%20project."
                target="_blank"
                rel="noreferrer"
                className="border border-borderSubtle dark:border-brass/20 text-espresso dark:text-light hover:border-brass dark:hover:border-brass px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-[8px]"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right Side: Showcase image in floating card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[400px] overflow-hidden rounded-[24px] border border-borderSubtle dark:border-brass/15 h-80 sm:h-96 shadow-2xl group"
            >
              <img
                src="https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg"
                alt="Founder at Work"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                fetchPriority="high"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-cream text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brass">Our Workshop Founder</span>
                <h4 className="font-serif text-lg font-bold mt-1">Authentic Hardwood Joinery</h4>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Our Story Timeline */}
        <section className="space-y-12 max-w-3xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Chronology of Craft</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Our Story Timeline</h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="relative border-l border-dashed border-brass/35 dark:border-brass/20 pl-8 space-y-10 text-left">
            {timelineMilestones.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-cream dark:bg-dark border border-brass flex items-center justify-center group-hover:bg-brass transition-colors duration-300">
                  <div className="w-2 h-2 rounded-full bg-brass group-hover:bg-cream" />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <span className="font-serif text-xl font-bold text-brass block leading-none">
                    {item.year}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-espresso dark:text-light">
                    {item.title}
                  </h4>
                  <p className="text-stone dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Meet Our Craftsmen */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: story details */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-brass font-bold">Traditional Joiners</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                Meet Our Master Craftsmen
              </h2>
            </div>
            
            <p className="text-stone dark:text-gray-300 font-sans text-sm leading-relaxed">
              Carpentry is not just cutting wood—it is an art of patience and structural details. Our Dharavi team consists of local artisans who have spent decades working with solid timber. They understand how natural teak wood breathes, select grains for maximum structural strength, and construct joints like the mortise-and-tenon that outlive metal screws and glue bounds.
            </p>

            <div className="flex gap-4">
              <div className="space-y-1">
                <span className="font-serif text-xl font-bold text-brass block">15+ Master Artisans</span>
                <span className="text-[10px] text-stone dark:text-gray-400 uppercase tracking-widest font-semibold block">In-House Workshop Carvers</span>
              </div>
              <div className="h-10 w-[1px] bg-borderSubtle dark:bg-brass/25 self-center" />
              <div className="space-y-1">
                <span className="font-serif text-xl font-bold text-brass block">Lifetime Joint Policy</span>
                <span className="text-[10px] text-stone dark:text-gray-400 uppercase tracking-widest font-semibold block">On Wood-Joint Joinery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Collection of 4 photos */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="h-44 sm:h-48 overflow-hidden rounded-[16px] border border-borderSubtle dark:border-brass/10">
              <img
                src="https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg"
                alt="Woodcarving detail"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="h-44 sm:h-48 overflow-hidden rounded-[16px] border border-borderSubtle dark:border-brass/10">
              <img
                src="https://images.pexels.com/photos/37145335/pexels-photo-37145335.jpeg"
                alt="Workshop interior"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="h-44 sm:h-48 overflow-hidden rounded-[16px] border border-borderSubtle dark:border-brass/10">
              <img
                src="/images/workshop.png"
                alt="Raw timber framing"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="h-44 sm:h-48 overflow-hidden rounded-[16px] border border-borderSubtle dark:border-brass/10">
              <img
                src="/images/dining-6seater.png"
                alt="Polishing finished dining set"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* SECTION 4: Why Customers Trust Us */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Key Indicators</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Why Customers Trust Us</h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {craftsmenStats.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 hover:border-brass dark:hover:border-brass p-6 rounded-[20px] shadow-sm hover:shadow-lg transition-all duration-300 text-center space-y-3 relative group"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-brass/0 group-hover:bg-brass transition-all rounded-t-[20px]" />
                <h4 className="font-serif text-xl font-bold text-brass">{item.title}</h4>
                <p className="text-stone dark:text-gray-300 font-sans text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Workshop Gallery */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Visual Proof</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Our Workshop Gallery</h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { img: "https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg", title: "Hand-Carving Detail" },
              { img: "https://images.pexels.com/photos/37145335/pexels-photo-37145335.jpeg", title: "Authentic Timber Planks" },
              { img: "/images/workshop.png", title: "Dharavi Workshop Assembly" },
              { img: "/images/dining-6seater.png", title: "Bespoke Dining Finish" }
            ].map((item, idx) => (
              <div key={idx} className="overflow-hidden rounded-[20px] border border-borderSubtle dark:border-brass/10 relative h-72 group shadow-md">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-cream text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[9px] uppercase tracking-wider text-brass font-bold">VK Workshop</span>
                  <p className="font-serif text-sm font-bold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: Customer Reviews */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Client Appreciations</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Bespoke Reviews</h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {customerReviews.map((test, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 p-6 md:p-8 rounded-[24px] shadow-sm flex flex-col justify-between text-left space-y-6"
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-brass stroke-none" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-stone dark:text-gray-300 font-sans text-xs md:text-sm leading-relaxed italic">
                    "{test.quote}"
                  </p>
                </div>

                {/* Client Profile */}
                <div className="flex items-center gap-3 border-t border-borderSubtle dark:border-brass/10 pt-4">
                  <img
                    src={test.img}
                    alt={test.name}
                    className="w-10 h-10 object-cover rounded-full border border-brass/20"
                  />
                  <div>
                    <h5 className="font-serif text-sm font-bold text-espresso dark:text-light">{test.name}</h5>
                    <p className="text-[10px] text-stone dark:text-gray-400 font-sans mt-0.5">{test.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: CTA Section */}
        <section className="bg-[#221E1B] border border-brass/15 p-8 md:p-16 text-center rounded-[32px] relative overflow-hidden text-white shadow-2xl">
          {/* Design Accent details */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-[2px] bg-brass"></div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Need Premium Furniture?
            </h2>
            <p className="text-gray-400 font-sans text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Connect directly with our master craftsmen. Bring a drawing, a photo reference, or just an idea, and we will refine it into a premium Teakwood masterpiece.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a
                href="https://wa.me/919930668406?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20building%20some%20custom%20hardwood%20furniture."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#20ba5a] transition-all duration-300 rounded-[10px] w-full sm:w-auto shadow-md shadow-green-500/10 cursor-pointer"
              >
                <MessageSquare size={16} className="fill-white stroke-none" />
                WhatsApp Consultation
              </a>
              <a
                href="tel:+919930668406"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white text-white px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-[#1A1715] transition-all duration-300 rounded-[10px] w-full sm:w-auto cursor-pointer"
              >
                <Phone size={15} />
                Call Workshop
              </a>
              <Link
                to="/custom-planner"
                className="inline-flex items-center justify-center gap-2 bg-brass text-white hover:bg-[#977848] px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-[10px] w-full sm:w-auto cursor-pointer"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
