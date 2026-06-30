import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import axios from 'axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import AIChatbot from './components/AIChatbot';
import Preloader from './components/Preloader';
import ScrollProgressBar from './components/ScrollProgressBar';
import CustomCursor from './components/CustomCursor';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import Gallery from './pages/Gallery';
import CustomPlanner from './pages/CustomPlanner';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Services from './pages/Services';
import CartCheckout from './pages/CartCheckout';
import ShippingReturns from './pages/ShippingReturns';

import './App.css';

// Automated page hit tracker mapping visits in MongoDB
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageHit = async () => {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
      try {
        if (!location.pathname.startsWith('/admin')) {
          await axios.post(`${BACKEND_URL}/api/analytics/track`, { path: location.pathname });
        }
      } catch (err) {
        console.error("Traffic logger failed:", err);
      }
    };
    trackPageHit();
  }, [location]);

  return null;
};

function App() {
  const [loading, setLoading] = useState(true);

  // Initialize Smooth Lenis Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Global Scroll Reveal Observer Setup
  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const setupObserver = () => {
      const elements = document.querySelectorAll('.reveal, .image-reveal');
      elements.forEach(el => observer.observe(el));
    };

    setupObserver();

    const mutationObserver = new MutationObserver(setupObserver);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [loading]);

  return (
    <BrowserRouter>
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <div className="flex flex-col min-h-screen bg-cream selection:bg-brass selection:text-white transition-opacity duration-700 ease-in-out">
          <AnalyticsTracker />
          <ScrollProgressBar />
          <CustomCursor />
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/custom-planner" element={<CustomPlanner />} />
              <Route path="/services" element={<Services />} />
              <Route path="/cart" element={<CartCheckout />} />
              <Route path="/shipping-returns" element={<ShippingReturns />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          
          <Footer />
          <WhatsAppButton />
          <AIChatbot />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
