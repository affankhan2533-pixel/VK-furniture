import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Sun, Moon, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('vk_theme') || 'light');

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = JSON.parse(localStorage.getItem('vk_cart') || '[]');
      const count = savedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 1500);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // Sticky scroll detector
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme manager
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vk_theme', theme);
  }, [theme]);

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
    <nav 
      className={`sticky top-0 z-40 transition-all duration-500 border-b ${
        scrolled
          ? 'bg-light/80 dark:bg-dark-light/80 backdrop-blur-md py-4 border-borderSubtle shadow-md'
          : 'bg-transparent py-6 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex flex-col text-left group" data-testid="logo-link">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-wide text-espresso transition-colors duration-300">
                V.K. Furniture
              </span>
              <span className="font-devanagari text-xs text-brass tracking-wider font-semibold">
                वी.के. फर्नीचर
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={link.id}
                className={`relative font-sans font-semibold text-[11px] uppercase tracking-widest transition-colors duration-300 pb-1.5 ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-espresso/70 hover:text-primary'
                } before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-primary before:transition-all before:duration-300 ${
                  isActive(link.path) ? 'before:w-full' : 'hover:before:w-full'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Shopping Cart */}
            <Link
              to="/cart"
              data-testid="nav-cart"
              className="relative text-espresso/70 hover:text-primary flex items-center p-2 transition-colors duration-300"
              title="View Cart"
            >
              <ShoppingBag size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 text-espresso/70 hover:text-primary transition-colors duration-300 cursor-pointer bg-transparent border-none"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* B2B Quote Action CTA */}
            <Link
              to="/contact"
              data-testid="nav-quote-btn"
              className="flex items-center gap-1.5 bg-primary text-white hover:bg-primary-dark px-4 py-2.5 transition-all duration-300 font-sans text-[10px] uppercase tracking-widest font-bold shine-hover"
            >
              Get Quote
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <Link
              to="/cart"
              className="relative text-espresso/70 hover:text-primary p-2 transition-colors"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 text-espresso/70 hover:text-primary bg-transparent border-none cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              data-testid="mobile-menu-toggle"
              className="text-espresso hover:text-primary transition-colors p-2 bg-transparent border-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-light/95 dark:bg-dark-light/95 backdrop-blur-md border-b border-borderSubtle fade-in">
          <div className="px-4 pt-4 pb-8 flex flex-col items-center space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`${link.id}-mobile`}
                onClick={() => setIsOpen(false)}
                className={`block w-full py-3.5 text-center font-sans font-bold text-xs uppercase tracking-widest transition-colors ${
                  isActive(link.path)
                    ? 'text-primary bg-parchment'
                    : 'text-espresso/70 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 w-full">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary text-white py-3.5 hover:bg-primary-dark transition-all font-sans text-xs uppercase tracking-widest font-bold w-full"
              >
                Get Custom Quote
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
