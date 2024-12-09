import {
    Activity,
    Bot,
    Component,
    HomeIcon,
    Mail,
    Package,
    ScrollText,
    ShoppingCart,
    SquareDashedBottomCode,
    SunMoon,
  } from 'lucide-react';
  
  import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';
import Image from 'next/image';
  
  const data = [
    {
      title: 'Twitter',
      icon: (
        <Image src='/x.svg' alt='Twitter' width={24} height={24} className='h-full w-full text-neutral-300' />
      ),
      href: 'https://x.com/Goatse_Solana',
    },
    {
      title: 'Dexscreener',
      icon: (
        <Image src='/dexscreener.svg' alt='Dexscreener' width={24} height={24} className='h-full w-full text-neutral-300' />
      ),
      href: 'https://dexscreener.com/solana/bilkbpsrjxsorqxcnxox3kargpfbpekjjggeokpyhkgp',
    },
    {
      title: 'Buy',
      icon: (
        <ShoppingCart className='h-full w-full text-neutral-300' />
      ),
      href: '/buy',
    },
    {
      title: 'Telegram',
      icon: (
        <Image src='/telegram.svg' alt='Telegram' width={24} height={24} className='h-full w-full text-neutral-300' />
      ),
      href: 'https://t.me/Goatse_Singularity',
    },
    {
      title: 'AI',
      icon: (
        <Bot className='h-full w-full text-neutral-300' />
      ),
      href: 'https://x.com/goatse_terminal',
    },
    {
      title: 'Terminal',
      icon: (
        <SquareDashedBottomCode className='h-full w-full text-neutral-300' />
      ),
      href: 'https://terminal.goatse.app',
    },
  ];
  
  export function AppleStyleDock() {
    return (
      <div className='absolute bottom-5 left-1/2 max-w-full -translate-x-1/2'>
        <Dock className='items-end pb-3'>
          {data.map((item, idx) => (
            <DockItem
              key={idx}
              className='aspect-square rounded-full bg-neutral-800'
            >
              <DockLabel>{item.title}</DockLabel>
              <DockIcon>{item.icon}</DockIcon>
            </DockItem>
          ))}
        </Dock>
      </div>
    );
  }
  