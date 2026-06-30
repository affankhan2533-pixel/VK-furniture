import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Sun, Moon, ArrowRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('vk_theme');
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });


  // Track shopping cart quantity
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

  // Sticky scroll offset listener
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

  // Theme configuration manager
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vk_theme', theme);
  }, [theme]);

  // Mobile scroll lock when side menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    <>
      <nav 
        className={`sticky top-0 z-40 transition-all duration-300 ease-in-out h-[60px] md:h-[68px] lg:h-[78px] flex items-center ${
          scrolled
            ? 'bg-[#2F241E]/95 backdrop-blur-md border-b border-white/10 shadow-md text-white'
            : 'bg-light dark:bg-[#171411] border-b border-borderSubtle text-espresso dark:text-light'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-full">

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="flex flex-col text-left group h-[42px] md:h-[48px] lg:h-[58px] justify-center transition-all duration-300" 
                data-testid="logo-link"
              >
                <span className={`font-serif text-xl md:text-2xl lg:text-3xl font-bold tracking-wide transition-colors duration-300 ease-in-out leading-none ${
                  scrolled ? 'text-white' : 'text-espresso dark:text-light'
                }`}>
                  V.K. Furniture
                </span>
                <span className="font-devanagari text-[9px] md:text-[10px] text-primary tracking-wider font-semibold mt-1 transition-colors duration-300">
                  वी.के. फर्नीचर
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={link.id}
                  className={`relative font-sans font-semibold text-[11px] uppercase tracking-widest transition-colors duration-300 ease-in-out pb-1.5 ${
                    isActive(link.path)
                      ? 'text-primary font-bold'
                      : scrolled
                        ? 'text-white/90 hover:text-primary'
                        : 'text-espresso/90 dark:text-light/90 hover:text-primary'
                  } before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-primary before:transition-all before:duration-300 ${
                    isActive(link.path) ? 'before:w-full' : 'hover:before:w-full'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Shopping Bag Button */}
              <Link
                to="/cart"
                data-testid="nav-cart"
                className={`relative flex items-center p-2 transition-colors duration-300 ease-in-out ${
                  scrolled ? 'text-white/90 hover:text-primary' : 'text-espresso/90 dark:text-light/90 hover:text-primary'
                }`}
                title="View Cart"
              >
                <ShoppingBag size={17} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={`p-2 transition-colors duration-300 ease-in-out cursor-pointer bg-transparent border-none ${
                  scrolled ? 'text-white/90 hover:text-primary' : 'text-espresso/90 dark:text-light/90 hover:text-primary'
                }`}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
              </button>

              {/* Get Quote Action Button */}
              <Link
                to="/contact"
                data-testid="nav-quote-btn"
                className="flex items-center gap-1.5 bg-primary text-white hover:bg-primary-dark px-4 py-2.5 transition-all duration-300 ease-in-out font-sans text-[10px] uppercase tracking-widest font-bold shine-hover animate-pulse-subtle"
              >
                Get Quote
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/cart"
                className={`relative p-3 transition-colors duration-300 ease-in-out ${
                  scrolled ? 'text-white/90 hover:text-primary' : 'text-espresso/90 dark:text-light/90 hover:text-primary'
                }`}
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
                className={`p-3 bg-transparent border-none cursor-pointer transition-colors duration-300 ease-in-out ${
                  scrolled ? 'text-white/90 hover:text-primary' : 'text-espresso/90 dark:text-light/90 hover:text-primary'
                }`}
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                data-testid="mobile-menu-toggle"
                className={`p-3 bg-transparent border-none cursor-pointer transition-colors duration-300 ease-in-out ${
                  scrolled ? 'text-white hover:text-primary' : 'text-espresso dark:text-light hover:text-primary'
                }`}
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

            </div>
          </div>
        </div>
      </nav>


      {/* Mobile Slide-From-Right Drawer Menu */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsOpen(false)} 
      />
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[85vw] max-w-[380px] bg-[#4B3A2D] z-50 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex justify-between items-center border-b border-primary/20 pb-4 mb-6">
            <span className="font-serif text-xl font-bold text-[#F7F3EC]">Menu</span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-[#F7F3EC] hover:text-primary transition-colors bg-transparent border-none cursor-pointer w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-all p-0"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col space-y-3.5 text-left">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`${link.id}-mobile`}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center min-h-[48px] py-3.5 transition-all duration-200 ease-in-out hover:scale-[1.02] font-sans text-[18px] font-semibold uppercase tracking-wider ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10 border-l-4 border-primary pl-4 rounded-r-[8px]'
                    : 'text-[#F7F3EC] border-l-4 border-transparent pl-4 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-primary/20 pb-8">
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 bg-primary text-white py-4 hover:bg-primary-dark transition-all duration-200 font-sans text-xs uppercase tracking-widest font-bold w-full rounded-[10px] min-h-[48px] active:scale-95 shadow-md shadow-primary/20"
          >
            Get Custom Quote
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </>
  );
};

export default Navbar;


