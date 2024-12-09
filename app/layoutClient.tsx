// layoutClient.tsx
"use client";


import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import { AppleStyleDock } from "@/components/applestyledock";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-[9999] pointer-events-auto">
        <AppleStyleDock />
      </div>
      <Toaster />
      <Analytics/>
    </>
  );
}