'use client';

import React, { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor = () => {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if device is touch-enabled
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    // Add cursor styles to html and all elements
    if (document.documentElement instanceof HTMLElement) {
      document.documentElement.style.cursor = 'none';
    }
    
    const elements = document.getElementsByTagName('*');
    Array.from(elements).forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.cursor = 'none';
      }
    });

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
      
      // Reset cursor styles
      if (document.documentElement instanceof HTMLElement) {
        document.documentElement.style.cursor = '';
      }
      Array.from(elements).forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.cursor = '';
        }
      });
    };
  }, [visible]);

  // Don't render anything on server or if touch device
  if (!mounted || isTouch) return null;

  return (
    <div 
      className="fixed pointer-events-none z-50 mix-blend-difference" 
      style={{
        transform: `translate3d(${position.x - 8}px, ${position.y - 8}px, 0)`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div className="w-4 h-4 bg-white rounded-full scale-100 transition-transform duration-300" />
    </div>
  );
};

export default CustomCursor;