// layoutClient.tsx
"use client";


import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"

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