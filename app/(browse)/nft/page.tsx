// app/(browse)/nft/page.tsx
'use client';

import { WalletProviders } from './_components/WalletProviders';
import dynamic from 'next/dynamic';

const MintingInterface = dynamic(() => import('./_components/MintingInterface'), {
  ssr: false
});

export default function NFTPage() {
  return (
    <WalletProviders>
      <div className="min-h-screen">
        <MintingInterface />
      </div>
    </WalletProviders>
  );
}