import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MapPin, Clock, Send, AlertCircle, CheckCircle, 
  Navigation, MessageSquare, Mail, Upload, ChevronUp, ChevronDown 
} from 'lucide-react';
import SEO from '../components/SEO';

const whyVisitCards = [
  {
    title: "See Raw Sagwan Timber",
    desc: "Inspect the thickness, moisture levels, and organic grains of our Grade-A seasoned teakwood before manufacturing begins."
  },
  {
    title: "Custom Dimension Layout",
    desc: "Collaborate directly with our master woodcarver to sketch blueprints to the exact inch of your space."
  },
  {
    title: "Test Cushion Firmness",
    desc: "Sit on our various cushion foam densities (32 Density, 40 Density HR foam) to choose your perfect level of comfort."
  },
  {
    title: "Verify Joint Strength",
    desc: "Witness our hand-chiselled tongue-and-groove and mortise-and-tenon joints that ensure lifetime stability."
  }
];

const faqAccordions = [
  {
    q: "What is your standard delivery timeline?",
    a: "Standalone residential custom items take 10-14 days. Wholesale commercial or large bulk hotel orders require 3-4 weeks depending on quantities."
  },
  {
    q: "Is there a Minimum Order Quantity (MOQ)?",
    a: "We have no MOQ for custom household orders. For bulk commercial chairs, the MOQ starts at 50 units. For commercial beds or dining sets, MOQ starts at 3 to 5 units."
  },
  {
    q: "Do your wood fabrications carry a warranty?",
    a: "Yes. Every piece of genuine solid Sagwan teakwood carries a lifetime warranty against termites, borers, and structural joint failure."
  },
  {
    q: "Can you build from custom architectural blueprints?",
    a: "Yes. Our team can build precisely according to custom dimensions, layouts, CAD mockups, or photograph references down to the exact inch."
  },
  {
    q: "What wood types do you support in your workshop?",
    a: "We work exclusively with Solid Grade-A Sagwan Wood (Teakwood) for its high density, unique grains, and lifetime durability. We avoid MDF, particleboard, and plywood laminates."
  }
];

const Contact = () => {
 const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("REACT_APP_BACKEND_URL is not configured.");
}

const API = `${BACKEND_URL}/api`;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Sofa Customization', // Used as Furniture Type selection
    message: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState('');
  
  // FAQ accordion active state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Field Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields (Name, Phone, Furniture Type, Message).');
      setShowErrorModal(true);
      setIsSubmitting(false);
      return;
    }

    // Attach filename indicators to message since backend doesn't take files directly
    let finalMessage = formData.message;
    if (selectedFile) {
      finalMessage += `\n\n[Attached Reference Image: ${selectedFile.name}]`;
    }

    try {
      const payload = {
        ...formData,
        message: finalMessage
      };

      const response = await axios.post(`${API}/enquiries`, payload);
      if (response.status === 201) {
        setShowSuccessModal(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: 'Sofa Customization',
          message: ''
        });
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.detail || 'Failed to submit enquiry. Please check your network connection.';
      setError(serverMsg);
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Maps Interactivity links
  const mapUrls = {
    directions: "https://www.google.com/maps/dir/?api=1&destination=V.K.+Furniture+Dharavi+Mumbai&destination_place_id=ChIJF1UO-ivJ5zsRj8alT50kTeU",
    navigation: "https://www.google.com/maps/search/?api=1&query=V.K.+Furniture+Dharavi+Mumbai&query_place_id=ChIJF1UO-ivJ5zsRj8alT50kTeU",
    reviews: "https://www.google.com/maps?cid=16522851918342407823",
    call: "tel:+919930668406"
  };

  const scrollToForm = () => {
    document.getElementById('contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://vk-furniture.vercel.app/contact",
        "url": "https://vk-furniture.vercel.app/contact",
        "name": "Contact V.K. Furniture Showroom Mumbai",
        "description": "Visit our Mumbai showroom open 24/7 or submit your custom quote request. Find directions, phone numbers, map, reviews and FAQs."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Does V.K. Furniture do modular kitchen work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. We specialize strictly in manufacturing standalone furniture pieces (sofas, tables, chairs, beds). We do not do fixed modular kitchens or wardrobes."
            }
          },
          {
            "@type": "Question",
            "name": "Where is the showroom located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We are located at Munna seth compound, Lal Bahadur Shastri Marg, near Himalaya refrigerator, Naik Nagar, Dharavi, Mumbai, Maharashtra 400070."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-cream dark:bg-dark text-espresso dark:text-light transition-colors duration-500 py-8 md:py-16 fade-in font-sans">
      <SEO
        title="Contact V.K. Furniture Dharavi Showroom | Mumbai"
        description="Visit our Mumbai showroom open 24/7 or submit your custom quote request. Find directions, phone numbers, maps, reviews, and FAQs."
        schema={contactSchema}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-28">
        
        {/* SECTION 1: Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side */}
          <div className="lg:col-span-7 text-left space-y-5">
            <span className="font-devanagari text-base md:text-lg text-brass block tracking-wider font-semibold">
              हमसे संपर्क करें — वी.के. फर्नीचर
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Let's Build Your <br/>Dream Furniture
            </h1>
            <div className="h-1 w-20 bg-brass rounded" />
            <p className="text-stone dark:text-gray-300 font-sans text-sm md:text-base max-w-xl leading-relaxed">
              Whether you need a custom size sofa sectional, a custom carved bed frame, or contract bulk dining sets for a cafe, our Dharavi workshop craftsmen are ready to bring your blueprint plans to life.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="tel:+919930668406"
                className="bg-brass text-white hover:bg-[#977848] px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-[8px] cursor-pointer shadow-md shadow-brass/20"
              >
                Call Now
              </a>
              <a
                href="https://wa.me/919930668406?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20building%20some%20custom%20hardwood%20furniture."
                target="_blank"
                rel="noreferrer"
                className="border border-borderSubtle dark:border-brass/20 text-espresso dark:text-light hover:border-brass dark:hover:border-brass px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-[8px]"
              >
                WhatsApp Consultation
              </a>
            </div>
          </div>

          {/* Right Side: Floating card with stats */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[360px] bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/15 p-4 rounded-[24px] shadow-2xl overflow-visible group"
            >
              {/* Image */}
              <div className="overflow-hidden rounded-[18px] h-60 relative">
                <img
                  src="https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg"
                  alt="Premium Custom Woodworking"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  fetchPriority="high"
                  loading="eager"
                />
              </div>
              
              {/* Trust stats below image */}
              <div className="mt-4 border-t border-borderSubtle dark:border-brass/10 pt-4 space-y-2 text-left">
                <div className="grid grid-cols-2 gap-2 text-stone dark:text-gray-300 font-sans text-[11px] leading-relaxed">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-brass" />
                    <span>Since 1999</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-brass" />
                    <span>500+ Projects</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-brass" />
                    <span>100% Solid Teakwood</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-brass" />
                    <span>Mumbai Workshop</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Contact Info Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Workshop Address", detail: "Munna seth compound, Lal Bahadur Shastri Marg, near by Himalaya refrigerator, Naik Nagar, Dharavi, Mumbai, Maharashtra 400070", icon: MapPin },
            { title: "Phone Number", detail: "+91 99306 68406", icon: Phone, isLink: true, link: "tel:+919930668406" },
            { title: "Email Address", detail: "riteshsharma9930@gmail.com", icon: Mail, isLink: true, link: "mailto:riteshsharma9930@gmail.com" },
            { title: "Working Hours", detail: "Open 24 hours, 7 Days a week (Showroom and Factory)", icon: Clock }
          ].map((item, idx) => {
            const InfoIcon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 hover:border-brass p-6 rounded-[20px] shadow-sm flex flex-col justify-between text-left space-y-4"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-brass/10 rounded-xl w-fit">
                    <InfoIcon className="text-brass" size={20} />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-espresso dark:text-light">{item.title}</h4>
                </div>
                {item.isLink ? (
                  <a href={item.link} className="text-brass hover:underline font-sans text-xs md:text-sm leading-relaxed block mt-2 break-all">
                    {item.detail}
                  </a>
                ) : (
                  <p className="text-stone dark:text-gray-400 font-sans text-xs md:text-sm leading-relaxed mt-2">
                    {item.detail}
                  </p>
                )}
              </motion.div>
            );
          })}
        </section>

        {/* SECTION 3: Modern Contact Form */}
        <section id="contact-form-section" className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 rounded-[28px] p-6 md:p-12 shadow-xl scroll-mt-12 text-left space-y-8">
          <div className="space-y-2 border-b border-cream dark:border-brass/5 pb-6">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Enquiry Desk</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso dark:text-light">Send Wholesale / Custom Design Enquiry</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 font-sans text-sm text-espresso dark:text-light">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">
                  Full Name <span className="text-brass font-bold">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  data-testid="contact-name-input"
                  className="w-full px-4 py-3 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 focus:border-brass focus:outline-none transition-colors rounded-[8px] h-[46px]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">
                  Phone Number <span className="text-brass font-bold">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  data-testid="contact-phone-input"
                  className="w-full px-4 py-3 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 focus:border-brass focus:outline-none transition-colors rounded-[8px] h-[46px]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  data-testid="contact-email-input"
                  className="w-full px-4 py-3 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 focus:border-brass focus:outline-none transition-colors rounded-[8px] h-[46px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="subject" className="block text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">
                  Furniture Type <span className="text-brass font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    data-testid="contact-subject-input"
                    className="w-full px-4 py-3 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 focus:border-brass focus:outline-none transition-colors rounded-[8px] appearance-none pr-10 cursor-pointer h-[46px] font-semibold text-espresso dark:text-light"
                    required
                  >
                    <option value="Sofa Customization">Sofa Set / Sectional</option>
                    <option value="Beds & Storage">Beds & Hydraulic Frames</option>
                    <option value="Dining & Coffee Tables">Dining Tables & Frames</option>
                    <option value="Chairs & Stools">Accent Chairs / Office Seating</option>
                    <option value="Commercial B2B Bulk">Commercial Bulk B2B Orders</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-stone pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">
                  Optional Image Reference
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-3 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 hover:border-brass rounded-[8px] cursor-pointer transition-colors duration-300 font-semibold text-xs text-stone dark:text-gray-300 w-full sm:w-auto h-[46px] select-none justify-center">
                    <Upload size={16} className="text-brass" />
                    <span>{selectedFile ? 'Change Reference' : 'Upload Sketch/Drawing'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {selectedFile && (
                    <span className="text-xs text-stone dark:text-gray-400 font-mono truncate max-w-[200px]" title={selectedFile.name}>
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">
                Inquiry Details <span className="text-brass font-bold">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                data-testid="contact-message-input"
                placeholder="List specifications, wood finish type, or layout coordinates..."
                className="w-full p-4 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 focus:border-brass focus:outline-none transition-colors rounded-[12px] resize-none h-[120px]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="contact-submit-btn"
              className="bg-brass text-white hover:bg-[#977848] px-8 py-4 rounded-[10px] transition-all duration-300 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 cursor-pointer w-full shadow-lg shadow-brass/15 min-h-[50px] select-none disabled:bg-brass/50"
            >
              {isSubmitting ? 'Logging spec sheets...' : 'Submit Custom Inquiry'}
              <Send size={14} />
            </button>
          </form>
        </section>

        {/* SECTION 4: Google Map Frame */}
        <section className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 rounded-[28px] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Map */}
          <div className="lg:col-span-8 h-80 sm:h-96 relative">
            <iframe
              title="VK Furniture Showroom Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.168798547285!2d72.8596644!3d19.0563844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c92bfa0ee515%3A0xe54d249d97a5c68f!2sV.K.%20Furniture!5e0!3m2!1sen!2sin!4v1703900000000!5m2!1sen!2sin"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Action details */}
          <div className="lg:col-span-4 p-6 md:p-10 text-left flex flex-col justify-between bg-parchment dark:bg-[#1A1715]/45">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-brass font-bold">Location Hub</span>
              <h3 className="font-serif text-2xl font-bold text-espresso dark:text-light">Dharavi Showroom</h3>
              <p className="text-stone dark:text-gray-400 font-sans text-xs md:text-sm leading-relaxed">
                We are located right on LBS Marg in Mumbai, easily accessible from Bandra Kurla Complex (BKC), Sion, and Andheri. Walk in anytime to inspect wood joints and speak with carvers.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-borderSubtle dark:border-brass/10">
              <a
                href={mapUrls.directions}
                target="_blank"
                rel="noreferrer"
                data-testid="map-action-directions"
                className="flex items-center justify-center gap-2 bg-brass text-cream hover:bg-[#977848] p-3.5 transition-all text-xs font-bold uppercase tracking-widest text-center rounded-[8px] shadow-sm select-none"
              >
                <Navigation size={14} />
                Get Directions
              </a>
              <a
                href={mapUrls.navigation}
                target="_blank"
                rel="noreferrer"
                data-testid="map-action-nav"
                className="flex items-center justify-center gap-2 border border-borderSubtle dark:border-brass/25 hover:border-brass text-espresso dark:text-light p-3.5 transition-all text-xs font-bold uppercase tracking-widest text-center rounded-[8px] bg-white dark:bg-dark select-none"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 5: Why Visit Our Workshop */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Showroom Transparency</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Why Visit Our Workshop</h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyVisitCards.map((card, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 hover:border-brass p-6 rounded-[20px] shadow-sm flex flex-col justify-between text-left space-y-4 group relative"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-brass/0 group-hover:bg-brass transition-all rounded-t-[20px]" />
                <div className="space-y-2">
                  <h4 className="font-serif text-lg font-bold text-espresso dark:text-light">{card.title}</h4>
                  <p className="text-stone dark:text-gray-400 font-sans text-xs leading-relaxed mt-2">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 6: FAQ Accordion */}
        <section className="space-y-12 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Frequently Asked Questions</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-espresso dark:text-light">
              Showroom FAQs
            </h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="border-y border-borderSubtle dark:border-brass/10 divide-y divide-borderSubtle dark:divide-brass/10 text-left">
            {faqAccordions.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left py-2 font-serif font-bold text-base md:text-lg text-espresso dark:text-light hover:text-brass transition-all bg-transparent border-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-brass flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown size={18} className="text-brass flex-shrink-0 ml-2" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 pt-1.5 text-stone dark:text-gray-400 font-sans text-xs md:text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 7: Signature CTA */}
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
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 bg-brass text-white hover:bg-[#977848] px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-[10px] w-full sm:w-auto cursor-pointer"
              >
                Get Quote
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Success Popup Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[#1A1715]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="success-modal">
          <div className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/25 max-w-md w-full p-8 shadow-2xl text-center space-y-4 rounded-[20px]">
            <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto border border-[#25D366]/30">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-espresso dark:text-light">Enquiry Received!</h3>
            <p className="text-stone dark:text-gray-400 font-sans text-sm leading-relaxed">
              Your inquiry has been successfully saved to our cloud database. Our Dharavi team will reach out shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              data-testid="success-modal-dismiss"
              className="bg-brass text-cream px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#977848] transition-colors w-full cursor-pointer rounded-[8px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Error Popup Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-[#1A1715]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="error-modal">
          <div className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/25 max-w-md w-full p-8 shadow-2xl text-center space-y-4 rounded-[20px]">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
              <AlertCircle size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-espresso dark:text-light">Submission Failed</h3>
            <p className="text-stone dark:text-gray-400 font-sans text-sm leading-relaxed">
              {error || 'Failed to submit enquiry. Please check your network or try again.'}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              data-testid="error-modal-dismiss"
              className="bg-brass text-cream px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#977848] transition-colors w-full cursor-pointer rounded-[8px]"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Contact;
