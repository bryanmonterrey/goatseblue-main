'use client';

import dynamic from 'next/dynamic';

// Dynamically import HeroSection with no SSR
const HeroSection = dynamic(() => import('./_components/mobileHero'), {
  ssr: false
});

export default function HomePage() {
  return (
    <main className='bg-darkblue'>
      <HeroSection />
    </main>
  );
}