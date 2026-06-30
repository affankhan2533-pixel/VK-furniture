import React, { useState } from 'react';
import axios from 'axios';
import { 
  Calendar, Calculator, CreditCard, Percent, 
  Search, Printer
} from 'lucide-react';
import SEO from '../components/SEO';

const Services = () => {
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

  return (
    <div className="bg-cream py-12 text-espresso font-sans fade-in">
      <SEO
        title="Planning Tools & Services | V.K. Furniture"
        description="Calculate furniture pricing estimations, request quotes, compute monthly EMI options, book appointments, and check production track states."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-left border-b border-borderSubtle pb-8">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-none">
            Business Tools & Services
          </h1>
          <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
            कस्टम योजना उपकरण और सेवाएँ
          </span>
          <p className="text-stone font-sans text-sm max-w-xl mt-3">
            Estimate direct-factory custom production rates, calculate monthly EMIs, schedule showroom visits, or track active orders.
          </p>
        </div>

        {/* Top Calculators section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Section 1: Estimate Calculator */}
          <div className="lg:col-span-7 bg-white border border-borderSubtle p-6 md:p-8 space-y-6 text-left shadow-sm">
            <div className="flex items-center gap-3 border-b border-cream pb-4">
              <Calculator className="text-teak" size={24} />
              <div>
                <h3 className="font-serif text-xl font-bold text-espresso">Estimate rate Calculator</h3>
                <span className="text-[10px] text-stone uppercase tracking-wider font-bold block">Dynamic Factory rate quotes</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Furniture Type</label>
                <select
                  value={estimate.category}
                  onChange={(e) => setEstimate({ ...estimate, category: e.target.value })}
                  className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                >
                  <option value="Sofa">Sofa Set (per running foot)</option>
                  <option value="Bed">Royal Storage Bed (per width foot)</option>
                  <option value="Table">Dining Table Frame (per length foot)</option>
                  <option value="Chair">Armchair / High Chairs</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Select Wood Type</label>
                <select
                  value={estimate.wood}
                  onChange={(e) => setEstimate({ ...estimate, wood: e.target.value })}
                  className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                >
                  <option value="Teakwood (Sagwan)">Genuine Teak Wood (Sagwan)</option>
                  <option value="Rosewood (Sheesham)">Rosewood (Sheesham)</option>
                  <option value="Hardwood">Standard Country Hardwood</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Cushion Foam Grade</label>
                <select
                  value={estimate.foam}
                  onChange={(e) => setEstimate({ ...estimate, foam: e.target.value })}
                  className="w-full px-3 py-2.5 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                >
                  <option value="40 Density Premium">40 Density Royal Orthopedic</option>
                  <option value="32 Density Orthopedic">32 Density Orthopedic</option>
                  <option value="Standard Soft">Standard soft foam</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Dimension scale (Feet)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="3" max="15" step="1"
                    value={estimate.width}
                    onChange={(e) => setEstimate({ ...estimate, width: parseInt(e.target.value) })}
                    className="w-full accent-teak h-1.5 bg-cream"
                  />
                  <span className="font-bold text-sm text-espresso whitespace-nowrap">{estimate.width} Feet</span>
                </div>
              </div>
            </div>

            {/* Coupon Application */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2 items-end border-t border-cream pt-4">
              <div className="flex-grow space-y-1 text-left">
                <label className="text-[9px] uppercase font-bold tracking-widest text-stone">Voucher Coupon Code</label>
                <input
                  type="text" placeholder="E.g. VKWELCOME10"
                  value={estimate.coupon}
                  onChange={(e) => setEstimate({ ...estimate, coupon: e.target.value })}
                  className="w-full px-3 py-2 border border-borderSubtle font-mono text-sm focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-espresso text-cream hover:bg-teak px-5 py-2.5 text-xs font-bold tracking-wider uppercase border-none cursor-pointer"
              >
                Apply Coupon
              </button>
            </form>
            {estimate.couponError && <p className="text-red-500 text-[10px] font-sans text-left">{estimate.couponError}</p>}
            {estimate.couponApplied && (
              <p className="text-emerald-600 text-[10px] font-bold text-left flex items-center gap-1">
                <Percent size={12} /> Voucher `{estimate.couponApplied}` Applied! {estimate.discountPercent}% Discount applied.
              </p>
            )}

            {/* Estimated Rate Result Display */}
            <div className="bg-parchment/60 p-6 border border-borderSubtle flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-stone">Estimated direct Rate</span>
                <div className="text-3xl font-serif font-bold text-teak mt-1">₹ {estimatedPrice.toLocaleString('en-IN')}*</div>
                <span className="text-[9px] text-stone-500 block mt-1">*Tax & transport shipping excluded. B2B rates negotiable.</span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowInvoice(true)}
                  className="bg-white border border-borderSubtle text-stone hover:text-espresso py-3 px-4 text-xs font-bold tracking-widest uppercase flex items-center gap-1 cursor-pointer w-full sm:w-auto justify-center"
                >
                  <Printer size={14} />
                  Print Invoice
                </button>
                <a
                  href={`https://wa.me/919821454706?text=Hi%20VK%20Furniture%2C%20I%20calculated%20an%20estimate%20quote%20on%20your%20site%21%0A-%20Type%3A%20${estimate.category}%0A-%20Wood%3A%20${estimate.wood}%0A-%20Foam%3A%20${estimate.foam}%0A-%20Size%3A%20${estimate.width}%20Ft%0A-%20Estimated%20Price%3A%20Rs.%20${estimatedPrice}%0APlease%20confirm%20fabrication%20time%21`}
                  target="_blank" rel="noreferrer"
                  className="bg-teak text-cream hover:bg-walnut py-3 px-5 text-xs font-bold tracking-widest uppercase text-center cursor-pointer w-full sm:w-auto"
                >
                  Confirm Fabrication
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: EMI Calculator */}
          <div className="lg:col-span-5 bg-white border border-borderSubtle p-6 md:p-8 space-y-6 text-left shadow-sm">
            <div className="flex items-center gap-3 border-b border-cream pb-4">
              <CreditCard className="text-teak" size={24} />
              <div>
                <h3 className="font-serif text-xl font-bold text-espresso">EMI Monthly Calculator</h3>
                <span className="text-[10px] text-stone uppercase tracking-wider font-bold block">Bajaj / Credit Card EMI estimates</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-sans">
                  <span className="uppercase font-bold tracking-widest text-stone">Purchase Amount</span>
                  <span className="font-bold text-espresso">₹ {emiInput.principal.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range" min="10000" max="200000" step="5000"
                  value={emiInput.principal}
                  onChange={(e) => setEmiInput({ ...emiInput, principal: parseInt(e.target.value) })}
                  className="w-full accent-teak h-1 bg-cream"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-sans">
                  <span className="uppercase font-bold tracking-widest text-stone">Interest Rate (p.a.)</span>
                  <span className="font-bold text-espresso">{emiInput.rate}%</span>
                </div>
                <input
                  type="range" min="8" max="18" step="0.5"
                  value={emiInput.rate}
                  onChange={(e) => setEmiInput({ ...emiInput, rate: parseFloat(e.target.value) })}
                  className="w-full accent-teak h-1 bg-cream"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone font-sans block mb-1">Tenure Period</label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 6, 9, 12].map(months => (
                    <button
                      key={months}
                      onClick={() => setEmiInput({ ...emiInput, tenure: months })}
                      className={`py-2 border font-sans text-xs font-bold transition-all cursor-pointer ${
                        emiInput.tenure === months ? 'bg-teak text-cream border-teak' : 'bg-white border-borderSubtle text-stone hover:border-teak'
                      }`}
                    >
                      {months} Mo
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly results */}
            <div className="bg-parchment/60 p-4 border border-borderSubtle space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone">Monthly EMI Payment:</span>
                <span className="font-bold text-espresso font-mono">₹ {emiResults.monthly.toLocaleString('en-IN')} / mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Total Interest Payable:</span>
                <span className="font-bold text-espresso font-mono">₹ {emiResults.interest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-borderSubtle pt-2">
                <span className="font-semibold text-espresso">Total Amount Payable:</span>
                <span className="font-bold text-teak font-mono">₹ {emiResults.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Appointment Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white border border-borderSubtle p-6 md:p-8 space-y-6 text-left shadow-sm">
            <div className="flex items-center gap-3 border-b border-cream pb-4">
              <Calendar className="text-teak" size={24} />
              <div>
                <h3 className="font-serif text-xl font-bold text-espresso">Book Showroom Appointment</h3>
                <span className="text-[10px] text-stone uppercase tracking-wider font-bold block">Visit our workshop in Dharavi, Mumbai</span>
              </div>
            </div>

            {aptSuccess && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs">{aptSuccess}</div>}
            {aptError && <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs">{aptError}</div>}

            <form onSubmit={handleAptSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Your Name</label>
                  <input
                    type="text" required placeholder="Enter name"
                    value={aptForm.name}
                    onChange={(e) => setAptForm({ ...aptForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Phone Number</label>
                  <input
                    type="tel" required placeholder="Enter mobile"
                    value={aptForm.phone}
                    onChange={(e) => setAptForm({ ...aptForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Consultation Date</label>
                  <input
                    type="date" required
                    value={aptForm.date}
                    onChange={(e) => setAptForm({ ...aptForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none font-sans"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Time Slot</label>
                  <select
                    value={aptForm.time}
                    onChange={(e) => setAptForm({ ...aptForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                  >
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-stone">Purpose of Visit</label>
                <select
                  value={aptForm.purpose}
                  onChange={(e) => setAptForm({ ...aptForm, purpose: e.target.value })}
                  className="w-full px-3 py-2 bg-cream/40 border border-borderSubtle text-sm focus:outline-none"
                >
                  <option value="Showroom Visit">Browse Showroom items</option>
                  <option value="Workshop Tour">See production & joint details</option>
                  <option value="Custom Consultation">Blueprint planning with woodcarver</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={aptSubmitting}
                className="w-full bg-espresso text-cream hover:bg-teak hover:text-white py-3.5 text-xs font-sans font-bold tracking-widest uppercase transition-all cursor-pointer border-none"
              >
                {aptSubmitting ? 'Reserving time slot...' : 'Reserve Appointment Slot'}
              </button>
            </form>
          </div>

          {/* Section 4: Live Order Tracking progress */}
          <div className="bg-white border border-borderSubtle p-6 md:p-8 space-y-6 text-left shadow-sm">
            <div className="flex items-center gap-3 border-b border-cream pb-4">
              <Search className="text-teak" size={24} />
              <div>
                <h3 className="font-serif text-xl font-bold text-espresso">Order Progress Tracker</h3>
                <span className="text-[10px] text-stone uppercase tracking-wider font-bold block">Monitor live fabrication steps</span>
              </div>
            </div>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                type="tel" placeholder="Enter contact phone number"
                value={trackPhone}
                onChange={(e) => setTrackPhone(e.target.value)}
                className="flex-grow px-3 py-2 border border-borderSubtle text-sm focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={trackLoading}
                className="bg-espresso text-cream hover:bg-teak px-6 py-2.5 text-xs font-bold tracking-widest uppercase border-none cursor-pointer"
              >
                {trackLoading ? 'Searching...' : 'Track'}
              </button>
            </form>

            {trackError && <p className="text-red-500 text-xs font-sans">{trackError}</p>}

            {/* Tracking progress graph */}
            {trackResult && (
              <div className="space-y-6 border border-borderSubtle bg-parchment/30 p-5 rounded-none fade-in">
                <div className="flex justify-between items-center text-xs font-sans pb-3 border-b border-cream">
                  <div>
                    <span className="text-stone">Order Ref: </span>
                    <span className="font-bold text-espresso font-mono">{trackResult.id}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-teak text-cream text-[9px] uppercase font-bold tracking-wider">{trackResult.status}</span>
                </div>

                {/* Progress bar stages */}
                <div className="relative">
                  {/* Backdrop line */}
                  <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-cream-300 md:left-1/2 md:-translate-x-1/2 md:top-4 md:bottom-4 md:left-4 md:right-4 md:w-auto md:h-0.5 bg-stone-200" />
                  
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
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-colors ${
                            isDone ? 'bg-teak text-cream' : 'bg-stone-200 text-stone-500'
                          }`}>
                            {st.step}
                          </div>
                          <span className={`text-[10px] uppercase tracking-wider font-bold ${isDone ? 'text-espresso' : 'text-stone-400'}`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[11px] text-stone font-sans text-center pt-2">
                  Items: **{trackResult.items}** | Updated: **{new Date(trackResult.timestamp).toLocaleDateString()}**
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic invoice Modal Sheet */}
      {showInvoice && (
        <div className="fixed inset-0 bg-espresso/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border border-borderSubtle shadow-2xl p-6 md:p-8 relative text-left font-mono text-xs text-espresso">
            
            {/* Close Button */}
            <button
              onClick={() => setShowInvoice(false)}
              className="absolute top-4 right-4 text-stone hover:text-espresso p-1 cursor-pointer border border-borderSubtle"
              title="Close Invoice"
            >
              Close
            </button>

            {/* Printable Area */}
            <div id="printable-invoice-content" className="space-y-6">
              {/* Header */}
              <div className="text-center border-b-2 border-dashed border-borderSubtle pb-4">
                <h3 className="font-serif text-lg font-bold uppercase tracking-wider">V.K. Furniture Showroom</h3>
                <p className="text-[10px] text-stone mt-1">Naik Nagar, Dharavi, Mumbai-400070 | Phone: 098214 54706</p>
                <p className="text-[9px] text-stone mt-0.5">Direct Factory-to-Customer Invoice Sheet</p>
              </div>

              {/* Specs parameters */}
              <div className="space-y-1 bg-parchment/20 p-3 border border-borderSubtle">
                <div className="flex justify-between">
                  <span>DATE:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>INVOICE REF:</span>
                  <span className="font-bold">VK-EST-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span>Valued Custom Client</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-y border-dashed border-borderSubtle py-3 space-y-2">
                <div className="flex justify-between font-bold border-b border-cream pb-1 text-[10px]">
                  <span>FABRICATION ITEM</span>
                  <span>EST. COST</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>{estimate.category} Set ({estimate.width} Running Feet)</span>
                    <span>₹ {(calculatePrice() / (1 - estimate.discountPercent / 100)).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-[9px] text-stone-500 pl-2">
                    - Wood Finish: {estimate.wood} <br/>
                    - Foam Class: {estimate.foam}
                  </div>
                </div>
              </div>

              {/* Final totals */}
              <div className="space-y-1.5 text-right font-bold text-sm">
                {estimate.discountPercent > 0 && (
                  <div className="text-xs text-emerald-600 flex justify-between font-normal">
                    <span>Voucher Discount ({estimate.couponApplied}):</span>
                    <span>- {estimate.discountPercent}%</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-borderSubtle pt-2 text-teak">
                  <span>ESTIMATED PAYABLE:</span>
                  <span>₹ {estimatedPrice.toLocaleString('en-IN')}*</span>
                </div>
              </div>

              <div className="text-[9px] text-stone leading-relaxed border-t border-dashed border-borderSubtle pt-4 text-center">
                *This is an estimated price statement generated on the digital fabrication planner tools. Fabrications require a 30% advance deposit.
              </div>
            </div>

            {/* Print Trigger Button */}
            <button
              onClick={() => window.print()}
              className="mt-6 w-full bg-espresso text-cream hover:bg-teak py-3 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer border-none"
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
