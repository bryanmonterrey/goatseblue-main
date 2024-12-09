import {
    Bot,
    ShoppingCart,
    SquareDashedBottomCode,
  } from 'lucide-react';
  import Link from 'next/link';
  
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
    const handleExternalClick = (href: string) => {
        window.open(href, '_blank', 'noopener,noreferrer');
      };
    
    return (
        <div className='fixed bottom-[20px] md:bottom-5 left-1/2 w-full max-w-full -translate-x-1/2 z-[9999]'>
        <Dock className='items-end pb-3'>
        {data.map((item, idx) => (
          item.href.startsWith('/') ? (
            <Link key={idx} href={item.href} className="block">
              <DockItem className='aspect-square rounded-2xl bg-neutral-800/50 backdrop-blur-custom backdrop-filter backdrop-blur-lg'>
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            </Link>
          ) : (
            <div
              key={idx}
              onClick={() => handleExternalClick(item.href)}
              className="cursor-pointer"
            >
              <DockItem className='aspect-square rounded-2xl bg-neutral-800/50 backdrop-blur-custom backdrop-filter backdrop-blur-lg'>
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>{item.icon}</DockIcon>
              </DockItem>
            </div>
          )
        ))}
      </Dock>
      </div>
    );
  }
  