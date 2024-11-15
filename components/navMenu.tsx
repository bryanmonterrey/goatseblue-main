"use client";

import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

export default function NavMenu() {
    const pathname = usePathname();

    // Define your links as a Map
    const linksMap = new Map<string, string>([
        ['twitter', 'https://x.com/Goatse_Solana'],
        ['dexscreener', 'https://dexscreener.com/solana/bilkbpsrjxsorqxcnxox3kargpfbpekjjggeokpyhkgp'],
        ['buy', '/buy'],
        ['telegram', 'https://t.me/Goatse_Singularity'],
        
    ]);

    // Find the active link key based on the current pathname
    const activeLinkKey = Array.from(linksMap.entries()).find(([, href]) => href === pathname)?.[0] || null;

    return (
        <div className="flex flex-col items-start space-y-5 mt-3 z-[9999999]">
            {Array.from(linksMap.entries()).map(([label, href]) => (
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                <Button key={`${label}-${href}`} className='block font-inter backdrop-blur-custom h-7 backdrop-filter backdrop-blur-lg bg-transparent border border-white rounded-none'>
                    <Link href={href} className={`px-3 py-2 ${activeLinkKey === label ? 'text-bold text-white italic' : 'text-white hover:text-white hover:italic transition-colors ease-in-out duration-150'}`}>
                        {label}
                    </Link>
                </Button>
            ))}
        </div>
    );
}

