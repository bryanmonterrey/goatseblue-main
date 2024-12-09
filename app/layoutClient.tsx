// layoutClient.tsx
"use client";


import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { AppleStyleDock } from "@/components/applestyledock";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      
      <Toaster />
      <Analytics/>
    </>
  );
}