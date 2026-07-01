import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Calculator, CreditCard, Percent, Search, Printer,
  Sparkles, ShieldCheck, Hotel, Briefcase, Wrench, MessageSquare,
  Compass, Layers, Hammer, CheckSquare, ChevronDown, ChevronUp,
  Phone
} from 'lucide-react';
import SEO from '../components/SEO';

const serviceItems = [
  {
    title: "Custom Furniture Design",
    desc: "Collaborate with our designers to configure bespoke dimensions, shapes, and carvings tailored to your layout.",
    icon: Sparkles
  },
  {
    title: "Premium Teak Hardwood",
    desc: "Select heirloom-grade 100% solid Sagwan teak wood possessing unique oil layers and natural termite resistance.",
    icon: ShieldCheck
  },
  {
    title: "Hotel & Restaurant Bulk",
    desc: "Direct-from-workshop commercial bulk orders with unified shipping timelines for lounges, cafes, and hotels.",
    icon: Hotel
  },
  {
    title: "Office Furniture Suites",
    desc: "Solid wood conference tables, study desks, and sturdy lounge seating configured for professional utility.",
    icon: Briefcase
  },
  {
    title: "Hardwood Restoration",
    desc: "Expert structural restoration, custom cushion replacement, and organic re-polishing for vintage heritage furniture.",
    icon: Wrench
  },
  {
    title: "Interior Consultation",
    desc: "Schedule structural blueprint consults with workshop owners to design cohesive room collections.",
    icon: MessageSquare
  }
];

const processSteps = [
  {
    num: "01",
    title: "Consultation",
    desc: "Review size specs, references, and spacing limitations.",
    icon: MessageSquare
  },
  {
    num: "02",
    title: "Design Approval",
    desc: "Approve 2D drawings and detailed timber material lists.",
    icon: Compass
  },
  {
    num: "03",
    title: "Material Selection",
    desc: "Choose wood grain grades, polishes, fabrics, and foam density.",
    icon: Layers
  },
  {
    num: "04",
    title: "Manufacturing",
    desc: "Our master carvers join, shape, hand-carve, and polish.",
    icon: Hammer
  },
  {
    num: "05",
    title: "Delivery & Setup",
    desc: "Free inside-home shipping and professional installation in Mumbai.",
    icon: CheckSquare
  }
];

const statCards = [
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
    title: "Direct Factory Pricing",
    desc: "Zero intermediate distributor markups or showroom margins."
  },
  {
    title: "Mumbai Workshop",
    desc: "Located in the heart of Dharavi supporting local artisans."
  },
  {
    title: "Google 5★ Reviews",
    desc: "Trusted by customers across the MMR region."
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

const Services = () => {
  // Navigation active tab for planners
  const [activeTab, setActiveTab] = useState('estimator');

  // Accordion active FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // Appointment states
  const [aptForm, setAptForm] = useState({ name: '', phone: '', date: '', time: '11:00 AM', purpose: 'Showroom Visit' });
  const [aptSubmitting, setAptSubmitting] = useState(false);
  const [aptSuccess, setAptSuccess] = useState('');
  const [aptError, setAptError] = useState('');

  // Estimate Calculator states
  const [estimate, setEstimate] = useState({
    category: 'Sofa',
    wood: 'Teakwood (Sagwan)',
    foam: '40 Density Premium',
    width: 6, // feet
    coupon: '',
    discountPercent: 0,
    couponApplied: '',
    couponError: ''
  });

  // EMI Calculator states
  const [emiInput, setEmiInput] = useState({ principal: 45000, rate: 12, tenure: 6 });

  // Order Tracking states
  const [trackPhone, setTrackPhone] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);

  // Invoice states
  const [showInvoice, setShowInvoice] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // 1. Book Appointment
  const handleAptSubmit = async (e) => {
    e.preventDefault();
    setAptError('');
    setAptSuccess('');
    setAptSubmitting(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/appointments`, aptForm);
      if (response.status === 201) {
        setAptSuccess(`Appointment booked successfully! Slot Reference: ${response.data.id}`);
        setAptForm({ name: '', phone: '', date: '', time: '11:00 AM', purpose: 'Showroom Visit' });
      }
    } catch (err) {
      console.error(err);
      setAptError('Failed to book appointment slot. Check connection.');
    } finally {
      setAptSubmitting(false);
    }
  };

  // 2. Estimate Price Formula
  const calculatePrice = () => {
    let baseRate = 0;
    if (estimate.category === 'Sofa') baseRate = 8000;      // price per foot
    if (estimate.category === 'Bed') baseRate = 12000;       // price per foot
    if (estimate.category === 'Table') baseRate = 6000;      // price per foot
    if (estimate.category === 'Chair') baseRate = 4500;      // price per foot

    let woodMultiplier = 1.0;
    if (estimate.wood === 'Teakwood (Sagwan)') woodMultiplier = 1.4;
    if (estimate.wood === 'Rosewood (Sheesham)') woodMultiplier = 1.25;

    let foamMultiplier = 1.0;
    if (estimate.foam === '40 Density Premium') foamMultiplier = 1.2;
    if (estimate.foam === '32 Density Orthopedic') foamMultiplier = 1.1;

    let rawPrice = baseRate * estimate.width * woodMultiplier * foamMultiplier;

    // Apply Coupon discount
    if (estimate.discountPercent > 0) {
      rawPrice = rawPrice * (1 - estimate.discountPercent / 100);
    }

    return Math.round(rawPrice);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setEstimate(prev => ({ ...prev, couponError: '', couponApplied: '', discountPercent: 0 }));
    const code = estimate.coupon.trim().toUpperCase();
    if (code === 'VKWELCOME10') {
      setEstimate(prev => ({ ...prev, discountPercent: 10, couponApplied: 'VKWELCOME10' }));
    } else if (code === 'FESTIVE15') {
      setEstimate(prev => ({ ...prev, discountPercent: 15, couponApplied: 'FESTIVE15' }));
    } else {
      setEstimate(prev => ({ ...prev, couponError: 'Invalid coupon voucher code.' }));
    }
  };

  // 3. Amortization EMI Calculation
  const calculateEMI = () => {
    const P = emiInput.principal;
    const r = (emiInput.rate / 12) / 100;
    const n = emiInput.tenure;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;

    return {
      monthly: Math.round(emi),
      interest: Math.round(totalInterest),
      total: Math.round(totalAmount)
    };
  };

  // 4. Track Order
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);
    if (!trackPhone.trim()) {
      setTrackError('Please enter a valid phone number.');
      return;
    }
    setTrackLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/orders/track?phone=${encodeURIComponent(trackPhone)}`);
      setTrackResult(response.data);
    } catch (err) {
      setTrackError('Could not locate any active orders with this phone number.');
    } finally {
      setTrackLoading(false);
    }
  };

  const emiResults = calculateEMI();
  const estimatedPrice = calculatePrice();

  const scrollToTools = () => {
    document.getElementById('studio-tools-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-cream dark:bg-dark text-espresso dark:text-light transition-colors duration-500 py-8 md:py-16 fade-in font-sans">
      <SEO
        title="Planning Tools & Services | V.K. Furniture"
        description="Calculate furniture pricing estimations, request quotes, compute monthly EMI options, book appointments, and check production track states."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-28">
        
        {/* SECTION 1: Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 text-left space-y-5">
            <span className="font-devanagari text-base md:text-lg text-brass block tracking-wider font-semibold">
              कस्टम फ़र्नीचर सेवाएँ — गुणवत्ता और परंपरा
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Our Services
            </h1>
            <div className="h-1 w-20 bg-brass rounded" />
            <p className="text-stone dark:text-gray-300 font-sans text-sm md:text-base max-w-xl leading-relaxed">
              Experience the art of authentic Indian joinery. We fabricate premium custom home items, execute hotel contract supplies, provide layout consultations, and restore vintage hardwood pieces directly at our Mumbai workshop since 1999.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={scrollToTools}
                className="bg-brass text-white hover:bg-[#977848] px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-[8px] cursor-pointer shadow-md shadow-brass/20"
              >
                Estimate Pricing
              </button>
              <a
                href="https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20inquiring%20about%20your%20services."
                target="_blank"
                rel="noreferrer"
                className="border border-borderSubtle dark:border-brass/20 text-espresso dark:text-light hover:border-brass dark:hover:border-brass px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-[8px]"
              >
                Direct Enquiry
              </a>
            </div>
          </div>

          {/* Right Column: Workshop Image with floating animation */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full max-w-[400px] overflow-hidden rounded-[24px] border border-borderSubtle dark:border-brass/15 h-80 sm:h-96 shadow-2xl group"
            >
              <img
                src="https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg"
                alt="Master Craftsman Working"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                fetchPriority="high"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-cream text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brass">Our Workshop</span>
                <h4 className="font-serif text-lg font-bold mt-1">Carving Teak Joints since 1999</h4>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: Service Cards */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Showroom Offerings</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Bespoke Joinery Services</h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 hover:border-brass dark:hover:border-brass p-6 rounded-[20px] shadow-sm hover:shadow-lg transition-all duration-300 text-left space-y-4"
                >
                  <div className="p-3 bg-brass/10 rounded-xl w-fit">
                    <IconComp className="text-brass" size={22} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-lg font-bold">{item.title}</h4>
                    <p className="text-stone dark:text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* INTERACTIVE DASHBOARD SECTION: Studio Planning Tools */}
        <section id="studio-tools-section" className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 rounded-[28px] p-6 md:p-10 shadow-xl space-y-8 scroll-mt-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cream dark:border-brass/5 pb-6">
            <div className="text-left">
              <span className="text-xs uppercase tracking-widest text-brass font-bold">Interactive Studio</span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold">Planning & Estimation Tools</h3>
            </div>
            
            {/* Tab selector buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'estimator', label: 'Rate Estimator', icon: Calculator },
                { id: 'emi', label: 'EMI Planner', icon: CreditCard },
                { id: 'appointment', label: 'Book Visit', icon: Calendar },
                { id: 'track', label: 'Track Order', icon: Search }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-[8px] border transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-brass text-cream border-brass shadow-sm'
                        : 'bg-cream/20 dark:bg-dark/30 border-borderSubtle dark:border-brass/10 text-stone dark:text-gray-300 hover:border-brass hover:text-brass'
                    }`}
                  >
                    <TabIcon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Screen */}
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === 'estimator' && (
                <motion.div
                  key="estimator"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-left"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Furniture Type</label>
                      <select
                        value={estimate.category}
                        onChange={(e) => setEstimate({ ...estimate, category: e.target.value })}
                        className="w-full px-4 py-3 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 focus:border-brass focus:outline-none transition-colors rounded-[8px] font-sans text-sm text-espresso dark:text-light h-[44px]"
                      >
                        <option value="Sofa">Sofa Set (per running foot)</option>
                        <option value="Bed">Royal Storage Bed (per width foot)</option>
                        <option value="Table">Dining Table Frame (per length foot)</option>
                        <option value="Chair">Armchair / High Chairs</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Select Wood Type</label>
                      <select
                        value={estimate.wood}
                        onChange={(e) => setEstimate({ ...estimate, wood: e.target.value })}
                        className="w-full px-4 py-3 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 focus:border-brass focus:outline-none transition-colors rounded-[8px] font-sans text-sm text-espresso dark:text-light h-[44px]"
                      >
                        <option value="Teakwood (Sagwan)">Genuine Teak Wood (Sagwan)</option>
                        <option value="Rosewood (Sheesham)">Rosewood (Sheesham)</option>
                        <option value="Hardwood">Standard Country Hardwood</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Cushion Foam Grade</label>
                      <select
                        value={estimate.foam}
                        onChange={(e) => setEstimate({ ...estimate, foam: e.target.value })}
                        className="w-full px-4 py-3 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 focus:border-brass focus:outline-none transition-colors rounded-[8px] font-sans text-sm text-espresso dark:text-light h-[44px]"
                      >
                        <option value="40 Density Premium">40 Density Royal Orthopedic</option>
                        <option value="32 Density Orthopedic">32 Density Orthopedic</option>
                        <option value="Standard Soft">Standard soft foam</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Dimension scale (Feet)</label>
                      <div className="flex items-center gap-4 h-[44px]">
                        <input
                          type="range" min="3" max="15" step="1"
                          value={estimate.width}
                          onChange={(e) => setEstimate({ ...estimate, width: parseInt(e.target.value) })}
                          className="w-full accent-brass h-1.5 bg-cream/60 dark:bg-dark rounded-full cursor-pointer"
                        />
                        <span className="font-bold text-sm text-espresso dark:text-light whitespace-nowrap">{estimate.width} Feet</span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Application */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-4 items-end border-t border-cream dark:border-brass/5 pt-4">
                    <div className="flex-grow space-y-1.5 text-left max-w-xs">
                      <label className="text-[9px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Voucher Coupon Code</label>
                      <input
                        type="text" placeholder="E.g. VKWELCOME10"
                        value={estimate.coupon}
                        onChange={(e) => setEstimate({ ...estimate, coupon: e.target.value })}
                        className="w-full px-4 py-2.5 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 rounded-[8px] focus:border-brass focus:outline-none font-mono text-sm uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-brass hover:bg-[#977848] text-white px-6 py-3 text-xs font-bold tracking-wider uppercase rounded-[8px] cursor-pointer"
                    >
                      Apply Coupon
                    </button>
                  </form>
                  {estimate.couponError && <p className="text-red-500 text-[11px] font-sans text-left mt-1">{estimate.couponError}</p>}
                  {estimate.couponApplied && (
                    <p className="text-emerald-600 dark:text-emerald-500 text-[11px] font-bold text-left flex items-center gap-1 mt-1">
                      <Percent size={12} /> Voucher `{estimate.couponApplied}` Applied! {estimate.discountPercent}% Discount applied.
                    </p>
                  )}

                  {/* Estimated Rate Result Display */}
                  <div className="bg-parchment/40 dark:bg-[#1A1715]/45 p-6 border border-borderSubtle dark:border-brass/10 rounded-[14px] flex flex-col sm:flex-row justify-between items-center gap-6 mt-6">
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Estimated Rate</span>
                      <div className="text-3xl font-serif font-bold text-brass mt-1">₹ {estimatedPrice.toLocaleString('en-IN')}*</div>
                      <span className="text-[9px] text-stone dark:text-gray-400 block mt-1">*Tax & transport shipping excluded. B2B rates negotiable.</span>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setShowInvoice(true)}
                        className="bg-white dark:bg-dark border border-borderSubtle dark:border-brass/15 text-stone hover:text-espresso dark:hover:text-light py-3 px-5 text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center rounded-[8px]"
                      >
                        <Printer size={14} />
                        Invoice Draft
                      </button>
                      <a
                        href={`https://wa.me/919821454706?text=Hi%20VK%20Furniture%2C%20I%20calculated%20an%20estimate%20quote%20on%20your%20site%21%0A-%20Type%3A%20${estimate.category}%0A-%20Wood%3A%20${estimate.wood}%0A-%20Foam%3A%20${estimate.foam}%0A-%20Size%3A%20${estimate.width}%20Ft%0A-%20Estimated%20Price%3A%20Rs.%20${estimatedPrice}%0APlease%20confirm%20fabrication%20time%21`}
                        target="_blank" rel="noreferrer"
                        className="bg-brass text-cream hover:bg-[#977848] py-3 px-6 text-xs font-bold tracking-widest uppercase text-center cursor-pointer w-full sm:w-auto rounded-[8px]"
                      >
                        WhatsApp Order
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'emi' && (
                <motion.div
                  key="emi"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-left"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-sans">
                        <span className="uppercase font-bold tracking-widest text-stone dark:text-gray-400">Purchase Amount</span>
                        <span className="font-bold text-brass">₹ {emiInput.principal.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range" min="10000" max="200000" step="5000"
                        value={emiInput.principal}
                        onChange={(e) => setEmiInput({ ...emiInput, principal: parseInt(e.target.value) })}
                        className="w-full accent-brass h-1.5 bg-cream/60 dark:bg-dark rounded-full cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-sans">
                        <span className="uppercase font-bold tracking-widest text-stone dark:text-gray-400">Interest Rate (p.a.)</span>
                        <span className="font-bold text-brass">{emiInput.rate}%</span>
                      </div>
                      <input
                        type="range" min="8" max="18" step="0.5"
                        value={emiInput.rate}
                        onChange={(e) => setEmiInput({ ...emiInput, rate: parseFloat(e.target.value) })}
                        className="w-full accent-brass h-1.5 bg-cream/60 dark:bg-dark rounded-full cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400 font-sans block mb-1">Tenure Period</label>
                    <div className="grid grid-cols-4 gap-3 max-w-md">
                      {[3, 6, 9, 12].map(months => (
                        <button
                          key={months}
                          onClick={() => setEmiInput({ ...emiInput, tenure: months })}
                          className={`py-2.5 border font-sans text-xs font-bold transition-all cursor-pointer rounded-[8px] select-none ${
                            emiInput.tenure === months 
                              ? 'bg-brass text-cream border-brass shadow-sm' 
                              : 'bg-white dark:bg-dark border-borderSubtle dark:border-brass/10 text-stone dark:text-gray-300 hover:border-brass hover:text-brass'
                          }`}
                        >
                          {months} Months
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly results */}
                  <div className="bg-parchment/40 dark:bg-[#1A1715]/45 p-6 border border-borderSubtle dark:border-brass/10 rounded-[14px] max-w-xl space-y-3 mt-6">
                    <div className="flex justify-between items-center text-sm border-b border-cream dark:border-brass/5 pb-2">
                      <span className="text-stone dark:text-gray-400">Monthly EMI Payment:</span>
                      <span className="font-bold text-brass text-base font-mono">₹ {emiResults.monthly.toLocaleString('en-IN')} / mo</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-cream dark:border-brass/5 pb-2">
                      <span className="text-stone dark:text-gray-400">Total Interest Payable:</span>
                      <span className="font-bold text-espresso dark:text-light font-mono">₹ {emiResults.interest.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-1">
                      <span className="font-semibold text-espresso dark:text-light">Total Amount Payable:</span>
                      <span className="font-bold text-brass text-lg font-mono">₹ {emiResults.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'appointment' && (
                <motion.div
                  key="appointment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-left"
                >
                  {aptSuccess && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-xs rounded-[6px]">{aptSuccess}</div>}
                  {aptError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-[6px]">{aptError}</div>}

                  <form onSubmit={handleAptSubmit} className="space-y-4 max-w-3xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Your Name</label>
                        <input
                          type="text" required placeholder="Enter name"
                          value={aptForm.name}
                          onChange={(e) => setAptForm({ ...aptForm, name: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 rounded-[8px] text-sm focus:outline-none focus:border-brass"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Phone Number</label>
                        <input
                          type="tel" required placeholder="Enter mobile"
                          value={aptForm.phone}
                          onChange={(e) => setAptForm({ ...aptForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 rounded-[8px] text-sm focus:outline-none focus:border-brass"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Consultation Date</label>
                        <input
                          type="date" required
                          value={aptForm.date}
                          onChange={(e) => setAptForm({ ...aptForm, date: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 rounded-[8px] text-sm focus:outline-none focus:border-brass font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Time Slot</label>
                        <div className="relative">
                          <select
                            value={aptForm.time}
                            onChange={(e) => setAptForm({ ...aptForm, time: e.target.value })}
                            className="w-full px-4 py-2.5 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 rounded-[8px] text-sm focus:outline-none focus:border-brass appearance-none pr-10 cursor-pointer h-[44px] font-medium"
                          >
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="01:00 PM">01:00 PM</option>
                            <option value="04:00 PM">04:00 PM</option>
                            <option value="07:00 PM">07:00 PM</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-3 text-stone pointer-events-none" size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Purpose of Visit</label>
                      <div className="relative">
                        <select
                          value={aptForm.purpose}
                          onChange={(e) => setAptForm({ ...aptForm, purpose: e.target.value })}
                          className="w-full px-4 py-2.5 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 rounded-[8px] text-sm focus:outline-none focus:border-brass appearance-none pr-10 cursor-pointer h-[44px] font-medium"
                        >
                          <option value="Showroom Visit">Browse Showroom items</option>
                          <option value="Workshop Tour">See production & joint details</option>
                          <option value="Custom Consultation">Blueprint planning with woodcarver</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-stone pointer-events-none" size={16} />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={aptSubmitting}
                        className="bg-brass hover:bg-[#977848] text-white px-8 py-3.5 text-xs font-sans font-bold tracking-widest uppercase transition-all cursor-pointer rounded-[8px] shadow-md shadow-brass/10"
                      >
                        {aptSubmitting ? 'Reserving time slot...' : 'Reserve Showroom Visit'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'track' && (
                <motion.div
                  key="track"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 text-left max-w-3xl"
                >
                  <form onSubmit={handleTrackOrder} className="flex gap-3 max-w-lg items-end">
                    <div className="flex-grow space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-stone dark:text-gray-400">Contact Phone Number</label>
                      <input
                        type="tel" placeholder="Enter number registered at booking"
                        value={trackPhone}
                        onChange={(e) => setTrackPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-cream/40 dark:bg-dark border border-borderSubtle dark:border-brass/10 rounded-[8px] text-sm focus:outline-none focus:border-brass font-mono h-[44px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={trackLoading}
                      className="bg-brass hover:bg-[#977848] text-white px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-[8px] cursor-pointer h-[44px]"
                    >
                      {trackLoading ? 'Searching...' : 'Track Order'}
                    </button>
                  </form>

                  {trackError && <p className="text-red-500 text-xs font-sans mt-1">{trackError}</p>}

                  {/* Tracking progress graph */}
                  {trackResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 border border-borderSubtle dark:border-brass/10 bg-parchment/20 dark:bg-[#1A1715]/45 p-6 rounded-[16px]"
                    >
                      <div className="flex justify-between items-center text-xs font-sans pb-3 border-b border-cream dark:border-brass/5">
                        <div>
                          <span className="text-stone">Order Reference ID: </span>
                          <span className="font-bold text-brass font-mono">{trackResult.id}</span>
                        </div>
                        <span className="px-2.5 py-1 bg-brass text-white text-[9px] uppercase font-bold tracking-widest rounded-full">{trackResult.status}</span>
                      </div>

                      {/* Progress bar stages */}
                      <div className="relative py-4">
                        {/* Line connector */}
                        <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-stone-200 dark:bg-brass/10 md:left-4 md:right-4 md:h-0.5 md:w-auto md:top-4 md:bottom-auto" />
                        
                        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-4 md:gap-4 relative text-left">
                          {[
                            { step: 1, label: 'Approved' },
                            { step: 2, label: 'Wood Setup' },
                            { step: 3, label: 'Carving' },
                            { step: 4, label: 'Out for Delivery' }
                          ].map(st => {
                            const isDone = trackResult.step >= st.step;
                            return (
                              <div key={st.step} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold z-10 transition-colors ${
                                  isDone ? 'bg-brass text-white' : 'bg-stone-200 dark:bg-dark text-stone-500 dark:text-stone-400 border dark:border-brass/10'
                                }`}>
                                  {st.step}
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider font-extrabold ${isDone ? 'text-brass' : 'text-stone-400'}`}>
                                  {st.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-[11px] text-stone dark:text-gray-400 font-sans text-center pt-2">
                        Configured Items: <strong className="text-espresso dark:text-light">{trackResult.items}</strong> | Status Update Date: <strong className="text-espresso dark:text-light">{new Date(trackResult.timestamp).toLocaleDateString()}</strong>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* SECTION 3: Our Process */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Timeless Execution</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Our Process Timeline</h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative pt-4">
            {processSteps.map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <div key={idx} className="relative group flex flex-col items-center text-center px-4">
                  {/* Icon wrapper */}
                  <div className="relative z-10 w-16 h-16 bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 group-hover:border-brass rounded-full flex items-center justify-center transition-all duration-300 shadow-md group-hover:shadow-[0_0_15px_rgba(176,141,87,0.3)] mb-4">
                    <StepIcon className="text-brass group-hover:scale-110 transition-transform duration-300" size={24} />
                    <span className="absolute -top-1 -right-1 bg-brass text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.num}
                    </span>
                  </div>

                  {/* Text */}
                  <h4 className="font-serif text-base font-bold text-espresso dark:text-light mb-1.5">{item.title}</h4>
                  <p className="text-stone dark:text-gray-400 text-xs leading-relaxed max-w-[180px]">{item.desc}</p>

                  {/* Connecting Line */}
                  {idx < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[1px] border-t border-dashed border-brass/20 -z-0" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: Why Choose VK Furniture */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Key Indicators</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Why Choose VK Furniture</h2>
            <div className="h-[2px] w-12 bg-brass mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((mat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/10 hover:border-brass dark:hover:border-brass p-6 rounded-[20px] shadow-sm hover:shadow-lg transition-all duration-300 text-center space-y-3 relative group"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-brass/0 group-hover:bg-brass transition-all rounded-t-[20px]" />
                <h4 className="font-serif text-xl font-bold text-brass">{mat.title}</h4>
                <p className="text-stone dark:text-gray-300 font-sans text-xs leading-relaxed">{mat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Workshop Details */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: story details */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-brass font-bold">Authentic Carpentry</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight">
                Our Dharavi Workshop
              </h2>
            </div>
            
            <p className="text-stone dark:text-gray-300 font-sans text-sm leading-relaxed">
              We fabricate every collection under direct workshop supervision. Our factory in Naik Nagar, Dharavi houses master carvers who handle wood sourcing, joint alignment, and premium polishes in-house. We do not use wood dust or hollow particleboard sheets. From first slice of timber to final polish finish, we implement thorough inspection to ensure custom furniture lives up to lifetime standards.
            </p>

            <div className="flex gap-4">
              <div className="space-y-1">
                <span className="font-serif text-xl font-bold text-brass block">100% Solid</span>
                <span className="text-[10px] text-stone dark:text-gray-400 uppercase tracking-widest font-semibold block">Sagwan Hardwood Only</span>
              </div>
              <div className="h-10 w-[1px] bg-borderSubtle dark:bg-brass/25 self-center" />
              <div className="space-y-1">
                <span className="font-serif text-xl font-bold text-brass block">Mumbai Region</span>
                <span className="text-[10px] text-stone dark:text-gray-400 uppercase tracking-widest font-semibold block">Local Handcrafted Joinery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Collection of 3 photos */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-3">
            <div className="h-64 sm:h-80 overflow-hidden rounded-[16px] border border-borderSubtle dark:border-brass/10">
              <img
                src="https://images.pexels.com/photos/31567149/pexels-photo-31567149.jpeg"
                alt="Artisan woodcarving details"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="h-64 sm:h-80 overflow-hidden rounded-[16px] border border-borderSubtle dark:border-brass/10 mt-6">
              <img
                src="https://images.pexels.com/photos/37145335/pexels-photo-37145335.jpeg"
                alt="Workshop layout"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            <div className="h-64 sm:h-80 overflow-hidden rounded-[16px] border border-borderSubtle dark:border-brass/10">
              <img
                src="/images/workshop.png"
                alt="Assembled furniture frame"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* SECTION 6: FAQ Accordion */}
        <section className="space-y-12 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-brass font-bold">Frequently Asked Questions</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Services & Deliveries</h2>
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
              Need Custom Furniture?
            </h2>
            <p className="text-gray-400 font-sans text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Connect directly with our master craftsmen. Bring a drawing, a photo reference, or just an idea, and we will refine it into a premium Teakwood masterpiece.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a
                href="https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20building%20some%20custom%20hardwood%20furniture."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#20ba5a] transition-all duration-300 rounded-[10px] w-full sm:w-auto shadow-md shadow-green-500/10 cursor-pointer"
              >
                <MessageSquare size={16} className="fill-white stroke-none" />
                WhatsApp Consultation
              </a>
              <a
                href="tel:09821454706"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white text-white px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-[#1A1715] transition-all duration-300 rounded-[10px] w-full sm:w-auto cursor-pointer"
              >
                <Phone size={15} />
                Call Workshop
              </a>
              <button
                onClick={scrollToTools}
                className="inline-flex items-center justify-center gap-2 bg-brass text-white hover:bg-[#977848] px-8 py-3.5 font-sans text-xs uppercase tracking-widest font-bold transition-all duration-300 rounded-[10px] w-full sm:w-auto cursor-pointer"
              >
                Get Rate Estimate
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Dynamic invoice Modal Sheet */}
      {showInvoice && (
        <div className="fixed inset-0 bg-[#1A1715]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#221E1B] border border-borderSubtle dark:border-brass/25 max-w-lg w-full shadow-2xl p-6 md:p-8 relative text-left font-mono text-xs text-espresso dark:text-light rounded-[20px]">
            
            {/* Close Button */}
            <button
              onClick={() => setShowInvoice(false)}
              className="absolute top-4 right-4 text-stone hover:text-espresso dark:hover:text-light p-1.5 cursor-pointer border border-borderSubtle dark:border-brass/20 rounded-[4px] bg-transparent"
              title="Close Invoice"
            >
              Close
            </button>

            {/* Printable Area */}
            <div id="printable-invoice-content" className="space-y-6">
              {/* Header */}
              <div className="text-center border-b-2 border-dashed border-borderSubtle dark:border-brass/10 pb-4">
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider">V.K. Furniture Showroom</h3>
                <p className="text-[10px] text-stone dark:text-gray-400 mt-1">Naik Nagar, Dharavi, Mumbai-400070 | Phone: 098214 54706</p>
                <p className="text-[9px] text-stone dark:text-gray-400 mt-0.5">Direct Factory-to-Customer Invoice Sheet</p>
              </div>

              {/* Specs parameters */}
              <div className="space-y-1 bg-parchment/20 dark:bg-dark p-3 border border-borderSubtle dark:border-brass/10 rounded-[6px]">
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>INVOICE REF:</span>
                  <span className="font-bold text-brass">VK-EST-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span>Valued Custom Client</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-y border-dashed border-borderSubtle dark:border-brass/10 py-3 space-y-2">
                <div className="flex justify-between font-bold border-b border-cream dark:border-brass/5 pb-1 text-[10px]">
                  <span>FABRICATION ITEM</span>
                  <span>EST. COST</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>{estimate.category} Set ({estimate.width} Running Feet)</span>
                    <span>₹ {(calculatePrice() / (1 - estimate.discountPercent / 100)).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[9px] text-stone dark:text-gray-400 pl-2">
                    - Wood Finish: {estimate.wood} <br/>
                    - Foam Class: {estimate.foam}
                  </div>
                </div>
              </div>

              {/* Final totals */}
              <div className="space-y-1.5 text-right font-bold text-sm">
                {estimate.discountPercent > 0 && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-500 flex justify-between font-normal">
                    <span>Voucher Discount ({estimate.couponApplied}):</span>
                    <span>- {estimate.discountPercent}%</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-borderSubtle dark:border-brass/10 pt-2 text-brass">
                  <span>ESTIMATED PAYABLE:</span>
                  <span>₹ {estimatedPrice.toLocaleString('en-IN')}*</span>
                </div>
              </div>

              <div className="text-[9px] text-stone dark:text-gray-400 leading-relaxed border-t border-dashed border-borderSubtle dark:border-brass/10 pt-4 text-center">
                *This is an estimated price statement generated on the digital fabrication planner tools. Fabrications require a 30% advance deposit.
              </div>
            </div>

            {/* Print Trigger Button */}
            <button
              onClick={() => window.print()}
              className="mt-6 w-full bg-brass hover:bg-[#977848] text-white py-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer border-none rounded-[8px]"
            >
              <Printer size={14} />
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
