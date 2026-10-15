'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const SmoothScrollControls: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [docHeight, setDocHeight] = useState(0);
  const [winHeight, setWinHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setDocHeight(document.documentElement.scrollHeight);
      setWinHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const isScrolledDown = scrollY > 300;
  const isNearBottom = scrollY + winHeight >= docHeight - 200;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col space-y-2 pointer-events-auto"
      aria-label="Page scroll controls"
    >
      {/* Scroll to Top Button */}
      {isScrolledDown && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 bg-charcoal-900/90 hover:bg-copper hover:text-charcoal-950 text-copper border border-archival-border hover:border-copper transition-all duration-300 shadow-xl flex items-center justify-center backdrop-blur-md group"
          title="Smooth Scroll to Top"
          aria-label="Smooth scroll to top of page"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Scroll to Bottom Button */}
      {!isNearBottom && (
        <button
          onClick={scrollToBottom}
          className="w-10 h-10 bg-charcoal-900/90 hover:bg-copper hover:text-charcoal-950 text-ivory-400 hover:text-charcoal-950 border border-archival-border hover:border-copper transition-all duration-300 shadow-xl flex items-center justify-center backdrop-blur-md group"
          title="Smooth Scroll to Bottom"
          aria-label="Smooth scroll to bottom of page"
        >
          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
