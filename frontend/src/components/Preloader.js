import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 1200; // 1.2s loading time
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 600); // Wait for fade transition
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-espresso flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-6 max-w-xs w-full px-4">
        {/* Luxury Logo Branding */}
        <div className="space-y-1">
          <h2 className="font-serif text-3xl md:text-4xl text-white tracking-widest uppercase animate-pulse leading-none">
            V.K. Furniture
          </h2>
          <span className="font-devanagari text-brass text-sm tracking-wider font-semibold block">
            वी.के. फर्नीचर
          </span>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full bg-stone-800 h-[2px] overflow-hidden relative">
          <div
            className="bg-brass h-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Counter */}
        <div className="font-sans text-xs uppercase tracking-widest text-stone-400">
          <span>Loading</span>
          <span className="inline-block w-8 text-right font-medium text-white ml-1">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
