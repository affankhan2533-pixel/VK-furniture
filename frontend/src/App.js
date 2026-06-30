import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
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

import './App.css';

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

    // Run setup immediately and on location changes
    setupObserver();

    // Watch for dynamic DOM changes (e.g. page routing or list filters)
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
            </Routes>
          </main>
          
          <Footer />
          <WhatsAppButton />
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
