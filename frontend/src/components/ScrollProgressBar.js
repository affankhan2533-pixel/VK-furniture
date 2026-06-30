import React, { useState, useEffect } from 'react';

const ScrollProgressBar = () => {
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const scrolled = (window.pageYOffset / totalScroll) * 100;
        setScrollWidth(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none">
      <div
        className="bg-brass h-full transition-all duration-75 ease-out"
        style={{ width: `${scrollWidth}%` }}
      />
    </div>
  );
};

export default ScrollProgressBar;
