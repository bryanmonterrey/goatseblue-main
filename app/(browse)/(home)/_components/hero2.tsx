import React from 'react';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';
import DesktopHero from './desktopHero';
import Home from './lenis';

const HeroSection = () => {
  const { isMobile } = useDeviceDetect();

  return isMobile ? <Home /> : <Home />;
};

export default HeroSection;