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
import './App.css';

const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import('./pages/About'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const CustomPlanner = React.lazy(() => import('./pages/CustomPlanner'));
const Services = React.lazy(() => import('./pages/Services'));
const CartCheckout = React.lazy(() => import('./pages/CartCheckout'));
const ShippingReturns = React.lazy(() => import('./pages/ShippingReturns'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-cream dark:bg-dark">
    <div className="w-10 h-10 border-4 border-brass/20 border-t-brass rounded-full animate-spin"></div>
  </div>
);

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
            <React.Suspense fallback={<PageFallback />}>
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
            </React.Suspense>
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
