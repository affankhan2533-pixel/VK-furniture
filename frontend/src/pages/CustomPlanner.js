import React, { useState } from 'react';
import axios from 'axios';
import { Settings2, Send, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';

const CustomPlanner = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API = `${BACKEND_URL}/api`;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Sofas',
    dimensions: '',
    wood_finish: 'Natural Teak Polish',
    cushion_density: '32 Density HR Foam',
    fabric: 'Linen Blend',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [savedOrder, setSavedOrder] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.phone || !formData.dimensions) {
      setError('Please fill in your Name, Phone Number, and desired Dimensions.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API}/custom-orders`, formData);
      if (response.status === 201) {
        setSuccess(true);
        setSavedOrder(response.data);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to submit design configuration. Please check your network or send us details via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Whatsapp Link for Custom Configurations
  const getWhatsappLink = () => {
    if (!savedOrder) return '#';
    const text = `Hi V.K. Furniture, I configured a custom furniture request on your website!
👤 Name: ${savedOrder.name}
📞 Phone: ${savedOrder.phone}
🛋️ Category: ${savedOrder.category}
📏 Dimensions: ${savedOrder.dimensions}
🪵 Wood Finish: ${savedOrder.wood_finish}
🧽 Foam Density: ${savedOrder.cushion_density || 'N/A'}
🧵 Fabric: ${savedOrder.fabric || 'N/A'}
📝 Special Notes: ${savedOrder.notes || 'None'}

Please let me know the estimated cost and time to fabricate this design!`;
    return `https://wa.me/919821454706?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-cream py-12 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left border-b border-borderSubtle pb-8 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-none">
            Custom Furniture Planner
          </h1>
          <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
            कस्टम फ़र्नीचर प्लानर — अपनी पसंद का फ़र्नीचर डिज़ाइन करें
          </span>
          <p className="text-stone font-sans text-sm max-w-2xl mt-3">
            Since our workshop specializes in custom orders, you can specify your desired dimensions, wood polishes, and upholstery configurations below. Submit the form to save it, then chat with the owner on WhatsApp to finalize the deal.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-borderSubtle grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-sm">
          
          {/* Form Side */}
          <div className="lg:col-span-7 p-6 md:p-12 text-left border-b lg:border-b-0 lg:border-r border-borderSubtle">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso mb-6 flex items-center gap-2">
              <Settings2 className="text-brass" />
              Configure Your Design
            </h2>

            {success ? (
              <div className="bg-[#25D366]/10 border border-[#25D366] text-[#1b9c4a] p-6 mb-8 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="flex-shrink-0 mt-1" size={24} />
                  <div className="space-y-4 w-full">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-espresso">Design Submitted Successfully!</h3>
                      <p className="text-stone font-sans text-sm mt-1">
                        Your custom dimensions and material selections have been saved into our manufacturing queue database.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 border border-borderSubtle/60 rounded-none font-sans text-xs text-stone space-y-1">
                      <p><strong>Configured Item:</strong> {savedOrder.category}</p>
                      <p><strong>Dimensions:</strong> {savedOrder.dimensions}</p>
                      <p><strong>Wood Polish:</strong> {savedOrder.wood_finish}</p>
                      {savedOrder.category !== 'Tables' && <p><strong>Foam:</strong> {savedOrder.cushion_density}</p>}
                      {savedOrder.category !== 'Tables' && <p><strong>Fabric:</strong> {savedOrder.fabric}</p>}
                    </div>

                    <div className="pt-2">
                      <a
                        href={getWhatsappLink()}
                        target="_blank"
                        rel="noreferrer"
                        data-testid="discuss-design-whatsapp"
                        className="bg-[#25D366] text-white px-6 py-4 font-sans text-xs uppercase tracking-widest font-bold hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-2 w-full text-center"
                      >
                        <MessageSquare size={16} className="fill-white stroke-none" />
                        Discuss Design on WhatsApp
                      </a>
                    </div>

                    <button
                      onClick={() => setSuccess(false)}
                      className="text-stone hover:text-teak font-sans text-xs underline font-semibold cursor-pointer"
                    >
                      Configure Another Design
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-sans text-sm text-espresso">
                
                {error && (
                  <div className="bg-terracotta/10 border border-terracotta text-terracotta p-4 mb-4 flex items-start gap-3">
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Step 1: Category & Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block font-semibold mb-1.5 uppercase tracking-wider text-[11px] text-stone">
                      1. Furniture Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      data-testid="planner-category-select"
                      className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak h-[46px]"
                    >
                      <option value="Sofas">Sofa Set / Sectional</option>
                      <option value="Tables">Dining Table / Coffee Table</option>
                      <option value="Beds">Bed frame (Imperial/Hydraulic)</option>
                      <option value="Chairs">Accent Chair / Armchair</option>
                      <option value="Other">Other Custom Woodwork</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dimensions" className="block font-semibold mb-1.5 uppercase tracking-wider text-[11px] text-stone">
                      2. Desired Dimensions (W x D x H in inches) <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="text"
                      id="dimensions"
                      name="dimensions"
                      placeholder="e.g. 78W x 34D x 36H inches"
                      value={formData.dimensions}
                      onChange={handleChange}
                      data-testid="planner-dimensions-input"
                      className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak"
                      required
                    />
                  </div>
                </div>

                {/* Step 2: Wood & Polish Finish */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="wood_finish" className="block font-semibold mb-1.5 uppercase tracking-wider text-[11px] text-stone">
                      3. Teakwood Polish Finish
                    </label>
                    <select
                      id="wood_finish"
                      name="wood_finish"
                      value={formData.wood_finish}
                      onChange={handleChange}
                      data-testid="planner-wood-select"
                      className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak h-[46px]"
                    >
                      <option value="Natural Teak Polish">Natural Teak Polish (Matte)</option>
                      <option value="Teak Gold Polish">Teak Gold Polish (Glossy)</option>
                      <option value="Honey Finish">Warm Honey Finish</option>
                      <option value="Dark Walnut Polish">Dark Walnut Polish</option>
                      <option value="Raw Unpolished Wood">Raw Unpolished (Direct Wood)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cushion_density" className="block font-semibold mb-1.5 uppercase tracking-wider text-[11px] text-stone">
                      4. Cushion/Foam Density (for Sofas/Beds/Chairs)
                    </label>
                    <select
                      id="cushion_density"
                      name="cushion_density"
                      value={formData.cushion_density}
                      onChange={handleChange}
                      data-testid="planner-foam-select"
                      className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak h-[46px]"
                    >
                      <option value="32 Density HR Foam">32 Density High Resilience (Comfortable)</option>
                      <option value="40 Density Heavy Duty">40 Density Heavy Duty (Firm & Durable)</option>
                      <option value="Pocket Springs with Foam">Pocket Spring + Foam layers</option>
                      <option value="No Cushion / Solid Wood Only">No Cushion (Solid Wood Only)</option>
                    </select>
                  </div>
                </div>

                {/* Step 3: Fabric & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fabric" className="block font-semibold mb-1.5 uppercase tracking-wider text-[11px] text-stone">
                      5. Fabric Preference
                    </label>
                    <select
                      id="fabric"
                      name="fabric"
                      value={formData.fabric}
                      onChange={handleChange}
                      data-testid="planner-fabric-select"
                      className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak h-[46px]"
                    >
                      <option value="Linen Blend">Premium Linen Blend</option>
                      <option value="Cotton Velvet">Luxury Cotton Velvet</option>
                      <option value="Leatherette">Stain-Free Leatherette</option>
                      <option value="Jute Weave">Organic Jute Weave</option>
                      <option value="No Fabric">No Upholstery (Solid Wood/Rattan Cane)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block font-semibold mb-1.5 uppercase tracking-wider text-[11px] text-stone">
                      6. Describe custom carvings or sketch details
                    </label>
                    <input
                      type="text"
                      id="notes"
                      name="notes"
                      placeholder="e.g. want rose design carving on back pillars..."
                      value={formData.notes}
                      onChange={handleChange}
                      data-testid="planner-notes-input"
                      className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak"
                    />
                  </div>
                </div>

                {/* Step 4: Contact Info */}
                <div className="border-t border-borderSubtle pt-6">
                  <h3 className="font-serif text-lg font-bold text-espresso mb-4">Contact Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block font-semibold mb-1.5 uppercase tracking-wider text-[11px] text-stone">
                        Your Name <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        data-testid="planner-name-input"
                        className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block font-semibold mb-1.5 uppercase tracking-wider text-[11px] text-stone">
                        Phone Number <span className="text-terracotta">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="e.g. 098214 54706"
                        value={formData.phone}
                        onChange={handleChange}
                        data-testid="planner-phone-input"
                        className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="planner-submit-btn"
                  className="bg-teak text-cream px-8 py-4 rounded-none hover:bg-walnut transition-colors uppercase tracking-widest text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer w-full"
                >
                  {isSubmitting ? 'Submitting configurations...' : 'Save Design Configuration'}
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>

          {/* Guidelines / FAQ Side */}
          <div className="lg:col-span-5 bg-parchment p-6 md:p-12 text-left flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso">Customization Policy</h2>
              <div className="h-1 w-16 bg-brass" />
              
              <div className="space-y-4 font-sans text-sm text-stone leading-relaxed">
                <div>
                  <h4 className="font-bold text-espresso uppercase tracking-wider text-xs">How it works:</h4>
                  <p className="mt-1">
                    Fill out the specs above and click "Save". This logs your request into our showroom database. Once submitted, click the WhatsApp button to instantly forward your specifications directly to the workshop owner's chat to get an estimate.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-espresso uppercase tracking-wider text-xs">Wholesale Minimum Order Quantity (MOQ):</h4>
                  <p className="mt-1">
                    For bulk orders, we offer special rates. Our minimum order quantity for custom stools or chairs is <strong>50 units</strong>. For custom beds, sofas, or dining sets, we accept orders starting from <strong>3 to 5 units</strong>.
                  </p>
                </div>

                <div className="bg-white p-4 border border-borderSubtle/60">
                  <h4 className="font-bold text-terracotta uppercase tracking-wider text-xs">⚠️ Important Notice</h4>
                  <p className="mt-1 text-xs">
                    We strictly fabricate **standalone** furniture items. We do <strong>not</strong> undertake interior fit-out services such as modular kitchen cabinets, built-in wardrobes, or fixed TV panels.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-borderSubtle/65 pt-6 mt-8">
              <p className="font-sans text-xs text-stone">
                Need advice on wood grains or dimensions? Call us directly:
              </p>
              <p className="font-serif text-xl font-bold text-teak mt-1">
                098214 54706
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomPlanner;
