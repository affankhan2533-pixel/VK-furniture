import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', id: 'nav-home' },
    { name: 'Collections', path: '/catalog', id: 'nav-catalog' },
    { name: 'Custom Design', path: '/custom-planner', id: 'nav-custom' },
    { name: 'Gallery', path: '/gallery', id: 'nav-gallery' },
    { name: 'Services', path: '/services', id: 'nav-services' },
    { name: 'About Us', path: '/about', id: 'nav-about' },
    { name: 'Contact', path: '/contact', id: 'nav-contact' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-borderSubtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex flex-col" data-testid="logo-link">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-espresso leading-none">
                V.K. Furniture
              </span>
              <span className="font-devanagari text-sm text-brass mt-0.5 tracking-wider font-semibold">
                वी.के. फर्नीचर
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={link.id}
                className={`font-sans font-medium text-xs uppercase tracking-widest transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-teak border-b-2 border-brass pb-1'
                    : 'text-stone hover:text-teak'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="tel:09821454706"
              data-testid="nav-call-btn"
              className="flex items-center gap-2 bg-teak text-cream px-4 py-2.5 hover:bg-walnut transition-all duration-300 font-sans text-xs uppercase tracking-wider font-semibold"
            >
              <Phone size={13} />
              Call Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-toggle"
              className="text-espresso hover:text-brass transition-colors p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-cream border-b border-borderSubtle fade-in">
          <div className="px-4 pt-2 pb-6 flex flex-col items-center space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`${link.id}-mobile`}
                onClick={() => setIsOpen(false)}
                className={`block w-full py-3 text-center font-sans font-semibold text-sm uppercase tracking-widest transition-colors ${
                  isActive(link.path)
                    ? 'text-teak bg-parchment'
                    : 'text-stone hover:text-teak'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 w-full flex flex-col gap-3">
              <a
                href="tel:09821454706"
                data-testid="nav-call-btn-mobile"
                className="flex items-center justify-center gap-2 bg-teak text-cream py-3 hover:bg-walnut transition-all font-sans text-sm uppercase tracking-wider font-semibold w-full"
              >
                <Phone size={16} />
                Call 098214 54706
              </a>
              <a
                href="https://wa.me/919821454706?text=Hi%20V.K.%20Furniture%2C%20I%20am%20interested%20in%20your%20furniture%20catalog."
                target="_blank"
                rel="noreferrer"
                data-testid="nav-whatsapp-btn-mobile"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 hover:bg-[#20ba5a] transition-all font-sans text-sm uppercase tracking-wider font-semibold w-full"
              >
                <MessageSquare size={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
