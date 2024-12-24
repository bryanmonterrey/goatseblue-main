// layoutClient.tsx
"use client";


import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { useRef, useState } from 'react';
import { Cursor } from '@/components/ui/cursor';
import { AnimatePresence, motion } from 'motion/react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    
      {children}
      <div className="fixed inset-x-0 bottom-0 z-[9999] pointer-events-auto">
        
      </div>
      <Toaster />
      <Analytics/>
    </>
  );
}