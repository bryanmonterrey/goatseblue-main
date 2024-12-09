// layoutClient.tsx
"use client";


import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
      <Analytics/>
    </>
  );
}