import React, { useState } from 'react';
import axios from 'axios';
import { Phone, MapPin, Clock, Send, Star, AlertCircle, CheckCircle } from 'lucide-react';

const Contact = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API = `${BACKEND_URL}/api`;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product_interest: 'Sofas',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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

    // Simple validation
    if (!formData.name || !formData.phone || !formData.message) {
      setError('Please fill in all required fields (Name, Phone, Message).');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API}/enquiries`, formData);
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          product_interest: 'Sofas',
          message: ''
        });
      }
    } catch (e) {
      console.error(e);
      setError('Failed to submit enquiry. Please try again or contact us directly on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream py-12 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-left border-b border-borderSubtle pb-8 mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-espresso leading-none">
            Get In Touch
          </h1>
          <span className="font-devanagari text-lg text-brass mt-1 block tracking-wider font-semibold">
            हमसे संपर्क करें — वी.के. फर्नीचर
          </span>
          <p className="text-stone font-sans text-sm max-w-xl mt-3">
            Fill out the inquiry form below to receive a custom quote, catalog lists, or details regarding wholesale delivery coordinates.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-borderSubtle overflow-hidden">
          
          {/* Left Form Column */}
          <div className="lg:col-span-6 p-6 md:p-12 text-left flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-borderSubtle">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso mb-2">Send Enquiry</h2>
            <p className="text-stone font-sans text-xs uppercase tracking-widest font-semibold mb-6">B2B & Custom Design Requests</p>

            {success && (
              <div className="bg-[#25D366]/10 border border-[#25D366] text-[#1b9c4a] p-4 mb-6 flex items-start gap-3">
                <CheckCircle className="flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm font-sans">
                  <span className="font-semibold block">Thank you!</span>
                  Your enquiry has been successfully saved. Our team will contact you shortly.
                </div>
              </div>
            )}

            {error && (
              <div className="bg-terracotta/10 border border-terracotta text-terracotta p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
                <span className="text-sm font-sans">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-stone font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Your Name <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    data-testid="contact-name-input"
                    className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-stone font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Phone Number <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    data-testid="contact-phone-input"
                    className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-stone font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    data-testid="contact-email-input"
                    className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak"
                  />
                </div>
                <div>
                  <label htmlFor="product_interest" className="block text-stone font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Product Interest
                  </label>
                  <select
                    id="product_interest"
                    name="product_interest"
                    value={formData.product_interest}
                    onChange={handleChange}
                    data-testid="contact-interest-select"
                    className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak h-[46px]"
                  >
                    <option value="Sofas">Sofa Sets</option>
                    <option value="Chairs">Accent Chairs</option>
                    <option value="Tables">Dining Tables</option>
                    <option value="Beds">Luxury Beds</option>
                    <option value="Other">Other standalone furniture</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-stone font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Your Message <span className="text-terracotta">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  data-testid="contact-message-input"
                  className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="contact-submit-btn"
                className="bg-teak text-cream px-8 py-4 rounded-none hover:bg-walnut transition-colors uppercase tracking-widest text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Right Info & Map Column */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Contact details */}
            <div className="p-6 md:p-12 text-left bg-parchment flex-grow">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso mb-6">Our Showroom</h2>
              <div className="space-y-4 font-sans text-sm text-stone">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-brass mt-0.5 flex-shrink-0" />
                  <span>
                    Munna seth compound, Lal Bahadur Shastri Marg, <br />
                    near by Himalaya refrigerator, Naik Nagar, <br />
                    Dharavi, Mumbai, Maharashtra 400070
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-brass flex-shrink-0" />
                  <a href="tel:09821454706" className="hover:text-brass text-espresso font-semibold">
                    098214 54706
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-brass flex-shrink-0" />
                  <span>Open 24 hours (7 Days a week)</span>
                </div>
                <div className="flex items-center gap-3 border-t border-borderSubtle pt-4 mt-2">
                  <Star size={18} fill="#C59D5F" className="text-brass" />
                  <span className="font-semibold text-espresso">5.0 Star Rating</span>
                  <span className="text-xs text-stone-500">(Validated manufacturer on Google)</span>
                </div>
              </div>
            </div>
            
            {/* Map Frame */}
            <div className="h-[300px] border-t border-borderSubtle">
              <iframe
                title="VK Furniture Google Maps Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.168798547285!2d72.8596644!3d19.0563844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c92bfa0ee515%3A0xe54d249d97a5c68f!2sV.K.%20Furniture!5e0!3m2!1sen!2sin!4v1703900000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
