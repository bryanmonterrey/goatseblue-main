// app/(browse)/nft/_components/WalletProviders.tsx
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => {
    const endpoints = [
      "https://mainnet.helius-rpc.com/?api-key=24625112-b6d7-4e1b-bfe4-da6551887c95",
      "https://mainnet.helius-rpc.com/?api-key=f09cbd78-a0f7-4b52-983c-71880b01240b",
      'https://api.mainnet-beta.solana.com',
      'https://rpc.ankr.com/solana',
      clusterApiUrl('mainnet-beta'),
    ];
    return endpoints[0]; // Using Helius as primary
  }, []);
  
  const network = WalletAdapterNetwork.Mainnet;
  
  const connection = useMemo(
    () => new Connection(endpoint, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 120000, // 2 minute timeout
    }),
    [endpoint]
  );

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}