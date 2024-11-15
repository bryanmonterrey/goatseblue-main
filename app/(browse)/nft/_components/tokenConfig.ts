// app/(browse)/nft/_components/tokenConfig.ts
import { PublicKey } from '@solana/web3.js';

export const TOKEN_CONFIG = {
  REQUIRED_TOKEN_MINT: new PublicKey('9kG8CWxdNeZzg8PLHTaFYmH6ihD1JMegRE1y6G8Dpump'),
  MIN_TOKEN_AMOUNT: 1_000_000, // 1 full token with 6 decimals
  MESSAGES: {
    ELIGIBLE: '🐐 Eligible for free mint!',
    NOT_ELIGIBLE: 'Hold $GOATSE to mint for free',
    CHECKING: 'Checking $GOATSE balance...',
    MINT_SUCCESS: 'Successfully minted your NFT!',
    MINT_ERROR: 'Failed to mint NFT. Make sure you have enough SOL to cover network fees (≈0.015 SOL).',
  }
} as const;