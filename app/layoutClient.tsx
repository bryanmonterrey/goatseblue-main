// layoutClient.tsx
"use client";


import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { useRef, useState } from 'react';
import { Cursor } from '@/components/ui/cursor';
import { AnimatePresence, motion } from 'motion/react';
import { SnowEffect } from "@/components/snow";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <div className="absolute top-0 z-[9999999] pointer-events-none">
      
    </div>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-[9999] pointer-events-auto">
        
      </div>
      <Toaster />
      <Analytics/>
    </>
  );
}