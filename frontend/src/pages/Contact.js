import React, { useState } from 'react';
import axios from 'axios';
import { Phone, MapPin, Clock, Send, Star, AlertCircle, CheckCircle, Navigation } from 'lucide-react';

const Contact = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API = `${BACKEND_URL}/api`;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
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

    // Field Valdation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields (Name, Phone, Subject, Message).');
      setShowErrorModal(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${API}/enquiries`, formData);
      if (response.status === 201) {
        setShowSuccessModal(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (e) {
      console.error(e);
      const serverMsg = e.response?.data?.detail || 'Failed to submit enquiry. Please check your network connection.';
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
    call: "tel:09821454706"
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
                  <label htmlFor="subject" className="block text-stone font-semibold mb-1 uppercase tracking-wider text-[11px]">
                    Subject <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Wholesale Sofa Inquiry"
                    data-testid="contact-subject-input"
                    className="w-full p-3 bg-cream border border-borderSubtle focus:outline-none focus:border-teak"
                    required
                  />
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
                className="bg-teak text-cream px-8 py-4 rounded-none hover:bg-walnut transition-colors uppercase tracking-widest text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer w-full disabled:bg-teak/70"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Info & Map Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            {/* Contact details */}
            <div className="p-6 md:p-12 text-left bg-parchment flex-grow">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-espresso mb-6">Our Showroom</h2>
              <div className="space-y-4 font-sans text-sm text-stone mb-6">
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

              {/* Interactive Quick Links */}
              <div className="border-t border-borderSubtle pt-6">
                <h3 className="font-serif text-lg font-bold text-espresso mb-3">Google Maps Interaction</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={mapUrls.directions}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="map-action-directions"
                    className="flex items-center justify-center gap-2 border border-teak text-teak p-3 hover:bg-teak hover:text-white transition-all text-xs font-semibold uppercase tracking-wider text-center"
                  >
                    <Navigation size={14} />
                    Directions
                  </a>
                  <a
                    href={mapUrls.call}
                    data-testid="map-action-call"
                    className="flex items-center justify-center gap-2 border border-teak text-teak p-3 hover:bg-teak hover:text-white transition-all text-xs font-semibold uppercase tracking-wider text-center"
                  >
                    <Phone size={14} />
                    Call
                  </a>
                  <a
                    href={mapUrls.navigation}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="map-action-nav"
                    className="flex items-center justify-center gap-2 border border-teak text-teak p-3 hover:bg-teak hover:text-white transition-all text-xs font-semibold uppercase tracking-wider text-center"
                  >
                    <Navigation size={14} className="rotate-45" />
                    Navigate
                  </a>
                  <a
                    href={mapUrls.reviews}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="map-action-reviews"
                    className="flex items-center justify-center gap-2 border border-teak text-teak p-3 hover:bg-teak hover:text-white transition-all text-xs font-semibold uppercase tracking-wider text-center"
                  >
                    <Star size={14} className="fill-current" />
                    Reviews
                  </a>
                </div>
              </div>
            </div>
            
            {/* Map Frame */}
            <div className="h-[250px] border-t border-borderSubtle relative">
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

      {/* Success Popup Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="success-modal">
          <div className="bg-white border border-borderSubtle max-w-md w-full p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mx-auto border border-[#25D366]/30">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-espresso">Enquiry Received!</h3>
            <p className="text-stone font-sans text-sm leading-relaxed">
              Your inquiry has been successfully saved to our cloud database. An automatic email confirmation has been sent to your address. Our Dharavi team will reach out shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              data-testid="success-modal-dismiss"
              className="bg-teak text-cream px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold hover:bg-walnut transition-colors w-full cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Error Popup Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-espresso/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="error-modal">
          <div className="bg-white border border-borderSubtle max-w-md w-full p-8 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto border border-terracotta/30">
              <AlertCircle size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-espresso">Submission Failed</h3>
            <p className="text-stone font-sans text-sm leading-relaxed">
              {error || 'Failed to submit enquiry. Please check your network or try again.'}
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              data-testid="error-modal-dismiss"
              className="bg-espresso text-cream px-6 py-3 font-sans text-xs uppercase tracking-widest font-bold hover:bg-teak transition-colors w-full cursor-pointer"
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
