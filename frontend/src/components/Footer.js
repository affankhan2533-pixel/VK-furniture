import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, Star, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-espresso text-parchment border-t border-teak/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-5 flex flex-col space-y-4">
            <div>
              <span className="font-serif text-3xl font-bold tracking-wide text-white block">
                V.K. Furniture
              </span>
              <span className="font-devanagari text-base text-brass mt-1 block tracking-wider font-medium">
                वी.के. फर्नीचर
              </span>
            </div>
            <p className="text-stone-300 font-sans text-sm max-w-sm leading-relaxed">
              Premium wholesale & custom standalone furniture manufacturer based in Dharavi, Mumbai. 
              Specializing in teak wood (sagwan) chairs, sofas, beds, and custom tables.
            </p>
            {/* Trust rating badge */}
            <div className="flex items-center gap-2 bg-walnut p-3 border border-teak/30 rounded-none w-fit">
              <div className="flex text-brass">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">5.0★</span>
              <span className="text-xs text-stone-300">(5 Google Reviews)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3 flex flex-col space-y-4">
            <h4 className="font-serif text-lg text-brass font-semibold tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <Link to="/" data-testid="footer-home" className="hover:text-brass transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/catalog" data-testid="footer-catalog" className="hover:text-brass transition-colors">Featured Catalog</Link>
              </li>
              <li>
                <Link to="/shipping-returns" data-testid="footer-shipping" className="hover:text-brass transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/contact" data-testid="footer-contact" className="hover:text-brass transition-colors">Contact & Location</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-1 md:col-span-4 flex flex-col space-y-4">
            <h4 className="font-serif text-lg text-brass font-semibold tracking-wider">Workshop Info</h4>
            <ul className="space-y-3 font-sans text-sm text-stone-300">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brass mt-0.5 flex-shrink-0" />
                <span>
                  Munna seth compound, Lal Bahadur Shastri Marg, <br />
                  near by Himalaya refrigerator, Naik Nagar, <br />
                  Dharavi, Mumbai, Maharashtra 400070
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brass flex-shrink-0" />
                <a href="tel:09821454706" className="hover:text-brass transition-colors text-white font-medium">
                  098214 54706
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-brass flex-shrink-0" />
                <span>Open 24 Hours (7 Days a week)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-teak/20 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-400 font-sans gap-4">
          <div className="flex flex-col space-y-1 text-center sm:text-left">
            <p>© {new Date().getFullYear()} V.K. Furniture. All Rights Reserved.</p>
            <p className="text-stone-500">
              Developed by <a href="https://affan.nexcoreinstitute.org/" target="_blank" rel="noopener noreferrer" className="text-brass hover:text-white transition-colors underline font-medium" data-testid="developer-link">Affan Khan</a>
            </p>
          </div>
          <p className="flex items-center gap-1.5 mt-4 sm:mt-0">
            Crafted in Mumbai since 1999 <Heart size={10} className="text-terracotta" /> Wholesale & Retail Manufacturer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
