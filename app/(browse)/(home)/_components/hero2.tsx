import React from 'react';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';
import DesktopHero from './desktopHero';
import MobileHero from './mobileHero';

const HeroSection = () => {
  const { isMobile } = useDeviceDetect();

  return isMobile ? <MobileHero /> : <DesktopHero />;
};

export default HeroSection;