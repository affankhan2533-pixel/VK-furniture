import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth trail interpolation
  useEffect(() => {
    let reqId;
    const updateTrail = () => {
      setTrailPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15, // Speed factor
          y: prev.y + dy * 0.15
        };
      });
      reqId = requestAnimationFrame(updateTrail);
    };
    reqId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(reqId);
  }, [position]);

  // Set up hover listeners on elements
  useEffect(() => {
    const handleMouseEnterElement = () => setIsHovered(true);
    const handleMouseLeaveElement = () => setIsHovered(false);

    const updateHoverListeners = () => {
      const clickables = document.querySelectorAll('a, button, select, input, textarea, [role="button"], .interactive-card');
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnterElement);
        el.addEventListener('mouseleave', handleMouseLeaveElement);
      });
    };

    // Update initially and setup mutation observer to watch DOM changes
    updateHoverListeners();
    const observer = new MutationObserver(updateHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: 'transform 0.05s ease-out'
        }}
      />
      {/* Outer Follower Ring */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out hidden md:block ${
          isHovered ? 'scale-150 bg-primary/10 border-primary/50' : 'scale-100 bg-transparent'
        }`}
        style={{
          left: `${trailPosition.x}px`,
          top: `${trailPosition.y}px`
        }}
      />
    </>
  );
};

export default CustomCursor;
