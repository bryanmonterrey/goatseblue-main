// app/(browse)/nft/_components/MintingInterface.tsx
'use client';

import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useRef } from 'react';
import { 
  Metaplex, 
  walletAdapterIdentity,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
  Metadata,
  FindNftsByOwnerOutput
} from '@metaplex-foundation/js';
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TOKEN_CONFIG } from './tokenConfig';
import { COLLECTION_CONFIG, generateNFTMetadata } from './nftConfig';
import styles from './styles.module.css';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const {
  REQUIRED_TOKEN_MINT,
  MIN_TOKEN_AMOUNT,
  MESSAGES,
} = TOKEN_CONFIG;

const COLLECTION_ADDRESS = 'CxLcBVGSJaqo8HfdWgypYzxmez5y6odvMFrZxTvtGUGM';
const COLLECTION_AUTHORITY = '5N2GNUGbNVMD4u297wwTpRwctzWfecjaS5XE7ALnsxwj';

const RPC_ENDPOINTS = [
  "https://mainnet.helius-rpc.com/?api-key=24625112-b6d7-4e1b-bfe4-da6551887c95",
  "https://mainnet.helius-rpc.com/?api-key=f09cbd78-a0f7-4b52-983c-71880b01240b"
];

let currentRpcIndex = 0;

const getHealthyConnection = async () => {
  const startIndex = currentRpcIndex;
  
  do {
    const endpoint = RPC_ENDPOINTS[currentRpcIndex];
    try {
      const connection = new Connection(endpoint, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000,
        httpHeaders: {
          'Cache-Control': 'max-age=30'
        }
      });
      
      await connection.getSlot();
      return connection;
    } catch (error) {
      console.warn(`RPC ${endpoint} failed:`, error);
      currentRpcIndex = (currentRpcIndex + 1) % RPC_ENDPOINTS.length;
      
      if (currentRpcIndex === startIndex) {
        await sleep(2000);
      }
    }
  } while (true);
};

const withRetry = async <T,>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError;
  let delay = initialDelay;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (error?.message?.includes('429') || error?.message?.includes('exceeded limit')) {
        console.log(`Rate limit hit, rotating RPC endpoint...`);
        currentRpcIndex = (currentRpcIndex + 1) % RPC_ENDPOINTS.length;
        
        delay *= 2;
        await sleep(delay);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
};

const getAuthorityString = (nft: Nft | NftWithToken | Sft | SftWithToken): string => {
  if ('updateAuthorityAddress' in nft) {
    return nft.updateAuthorityAddress.toString();
  }
  return 'unknown';
};

const isCollectionAuthority = (wallet: PublicKey, nft: Nft | NftWithToken | Sft | SftWithToken): boolean => {
  if ('updateAuthorityAddress' in nft) {
    return nft.updateAuthorityAddress.toString() === COLLECTION_AUTHORITY;
  }
  return false;
};

// Helper for RPC retries
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Add proper types for cache
interface CacheTypes {
  totalMinted: number | null;
  walletNfts: (Nft | NftWithToken | Sft | SftWithToken)[] | null;
  lastUpdate: number;
}

// Add proper types for timestamps
interface FetchTimestamps {
  totalMinted: number;
  walletNfts: number;
}

// Define constants and cache with proper types
const CACHE_DURATION = 30000; // 30 seconds
const POLL_INTERVAL = 60000; // 1 minute

const lastFetchTimestamp: FetchTimestamps = {
  totalMinted: 0,
  walletNfts: 0
};

const cache: CacheTypes = {
  totalMinted: null,
  walletNfts: null,
  lastUpdate: 0
};

// Update fetchTotalMinted with proper type checking
const fetchTotalMinted = async (
  connection: Connection, 
  wallet: WalletContextState,
  setTotalMinted: (value: number) => void,
  setCollectionNft: (value: Nft | Sft | SftWithToken | NftWithToken | null) => void,
  setWalletMintCount: (value: number) => void,
  setUnverifiedCount: (value: number) => void
) => {
  if (!connection || !wallet) return;

  try {
    const now = Date.now();
    
    // Return cached data if it's fresh enough
    if (cache.totalMinted !== null && 
        now - lastFetchTimestamp.totalMinted < CACHE_DURATION) {
      setTotalMinted(cache.totalMinted);
      return;
    }

    console.log('Fetching total minted...');
    const metaplex = Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet));

    const fetchedNft = await metaplex.nfts().findByMint({
      mintAddress: new PublicKey(COLLECTION_ADDRESS),
    });

    if (fetchedNft) {
      setCollectionNft(fetchedNft);

      if ('collectionDetails' in fetchedNft && fetchedNft.collectionDetails) {
        const size = Number(fetchedNft.collectionDetails.size) || 0;
        setTotalMinted(size);
        cache.totalMinted = size;
        lastFetchTimestamp.totalMinted = now;
      }

      // Only fetch wallet NFTs if needed and wallet is connected
      if (wallet.publicKey && 
          (!cache.walletNfts || now - lastFetchTimestamp.walletNfts >= CACHE_DURATION)) {
        const walletNfts = await metaplex.nfts().findAllByOwner({
          owner: wallet.publicKey,
        });

        const walletCollectionNfts = walletNfts.filter((nft): nft is Nft | NftWithToken | Sft | SftWithToken => 
          'collection' in nft && 
          nft.collection !== null && 
          nft.collection.address.toString() === COLLECTION_ADDRESS
        );

        setWalletMintCount(walletCollectionNfts.length);
        cache.walletNfts = walletCollectionNfts;
        lastFetchTimestamp.walletNfts = now;

        if (wallet.publicKey.toString() === COLLECTION_AUTHORITY) {
          const unverified = walletCollectionNfts.filter(nft => 
            nft.collection && !nft.collection.verified
          );
          setUnverifiedCount(unverified.length);
        }
      }
    }
  } catch (error) {
    console.error('Error in fetchTotalMinted:', error);
    // Use cached data if available
    if (cache.totalMinted !== null) {
      setTotalMinted(cache.totalMinted);
    }
  }
};

export function MintingInterface() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState('');
  const [hasRequiredTokens, setHasRequiredTokens] = useState(false);
  const [isCheckingBalance, setIsCheckingBalance] = useState(false);
  const [totalMinted, setTotalMinted] = useState(0);
  const [unverifiedCount, setUnverifiedCount] = useState(0);
  const [walletMintCount, setWalletMintCount] = useState(0);
  const [collectionNft, setCollectionNft] = useState<Nft | Sft | SftWithToken | NftWithToken | null>(null);

  // Collection verification check function
  const verifyCollectionSetup = async () => {
    if (!wallet.publicKey) return;
    
    try {
      const healthyConnection = await getHealthyConnection();
      const metaplex = Metaplex.make(healthyConnection)
        .use(walletAdapterIdentity(wallet));

      const collectionNft = await metaplex.nfts().findByMint({
        mintAddress: new PublicKey(COLLECTION_ADDRESS),
      });

      console.log("Collection Details:", {
        address: collectionNft.address.toString(),
        authorityAddress: ('updateAuthorityAddress' in collectionNft) ? 
          collectionNft.updateAuthorityAddress.toString() : 'unknown',
        collection: collectionNft.collection,
        collectionDetails: collectionNft.collectionDetails,
      });

      setCollectionNft(collectionNft);
    } catch (error) {
      console.error("Error checking collection:", error);
    }
  };

  const checkTokenBalance = async (walletAddress: PublicKey) => {
    try {
      setIsCheckingBalance(true);
      console.log('Checking balance for wallet:', walletAddress.toString());
      console.log('Looking for token:', REQUIRED_TOKEN_MINT.toString());

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletAddress,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      console.log('Found token accounts:', JSON.stringify(tokenAccounts.value.map(account => ({
        mint: account.account.data.parsed.info.mint,
        balance: account.account.data.parsed.info.tokenAmount.amount,
        decimals: account.account.data.parsed.info.tokenAmount.decimals
      })), null, 2));

      const requiredTokenAccount = tokenAccounts.value.find(
        (account) => {
          const tokenMint = account.account.data.parsed.info.mint;
          console.log(`Comparing ${tokenMint} with ${REQUIRED_TOKEN_MINT.toString()}`);
          return tokenMint === REQUIRED_TOKEN_MINT.toString();
        }
      );

      if (requiredTokenAccount) {
        const balance = Number(requiredTokenAccount.account.data.parsed.info.tokenAmount.amount);
        const decimals = requiredTokenAccount.account.data.parsed.info.tokenAmount.decimals;
        console.log('Found token balance:', balance.toString());
        console.log('Token decimals:', decimals.toString());
        console.log('Required minimum:', MIN_TOKEN_AMOUNT.toString());
        console.log('Has required tokens:', (balance >= MIN_TOKEN_AMOUNT).toString());
        setHasRequiredTokens(balance >= MIN_TOKEN_AMOUNT);
      } else {
        console.log('Required token not found');
        setHasRequiredTokens(false);
      }
    } catch (error) {
      console.error('Error checking token balance:', error);
      setHasRequiredTokens(false);
      setError(getErrorMessage(error));
    } finally {
      setIsCheckingBalance(false);
    }
  };

  // Update useEffect with proper dependency typing
  useEffect(() => {
    if (!connection) return;

    let mounted = true;
    
    const fetchData = async () => {
      if (!mounted) return;
      await fetchTotalMinted(connection, wallet, setTotalMinted, setCollectionNft, setWalletMintCount, setUnverifiedCount);
    };

    fetchData();

    const intervalId = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [connection, wallet.publicKey, wallet]); // Added wallet to dependencies

  // Add cleanup effect with proper typing
  useEffect(() => {
    // Clear cache when wallet changes
    cache.walletNfts = null;
    lastFetchTimestamp.walletNfts = 0;
  }, [wallet.publicKey]);

  const setupGoatseCollection = async () => {
    if (!wallet.publicKey) return;
    
    try {
      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet));

      console.log("Starting collection setup...");
      // Add your collection setup logic here if needed
    } catch (error) {
      console.error("Failed to setup collection:", error);
    }
  };

  const verifyPendingNFTs = async () => {
    if (!wallet.publicKey || wallet.publicKey.toString() !== COLLECTION_AUTHORITY) {
      return;
    }
    
    try {
      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet));
  
      let retries = 3;
      // Fix: Update type to match FindNftsByOwnerOutput
      let allNfts: FindNftsByOwnerOutput = [];
  
      while (retries > 0) {
        try {
          allNfts = await metaplex.nfts().findAllByOwner({
            owner: wallet.publicKey,
          });
          break;
        } catch (error) {
          console.error(`Fetch attempt ${4 - retries} failed:`, error);
          retries--;
          if (retries > 0) {
            await sleep(2000 * (4 - retries));
          }
        }
      }
  
      // Filter to only include items with collection property
      const unverifiedNfts = allNfts.filter((nft): nft is Nft | NftWithToken | Sft | SftWithToken => 
        'collection' in nft && 
        nft.collection?.address.toString() === COLLECTION_ADDRESS && 
        !nft.collection?.verified
      );
  
      console.log("Found unverified NFTs:", unverifiedNfts.length);
  
      // Verify each unverified NFT with retry logic
      for (const nft of unverifiedNfts) {
        retries = 3;
        while (retries > 0) {
          try {
            console.log(`Attempting to verify NFT: ${nft.address.toString()}`);
            await metaplex
              .nfts()
              .verifyCollection({
                mintAddress: nft.address,
                collectionMintAddress: new PublicKey(COLLECTION_ADDRESS),
                collectionAuthority: metaplex.identity(),
              }, {
                commitment: 'confirmed',
              });
                
            console.log(`Successfully verified NFT: ${nft.address.toString()}`);
            break;
          } catch (error) {
            console.error(`Verification attempt ${4 - retries} failed for NFT ${nft.address.toString()}:`, error);
            retries--;
            if (retries > 0) {
              await sleep(2000 * (4 - retries));
            }
          }
        }
        // Add delay between NFTs regardless of success
        await sleep(2000);
      }
  
      await fetchTotalMinted(connection, wallet, setTotalMinted, setCollectionNft, setWalletMintCount, setUnverifiedCount);
      alert(`Verification complete! ${unverifiedNfts.length} NFTs processed`);
    } catch (error) {
      console.error("Error verifying NFTs:", error);
      alert('Error during verification process. Check console for details.');
    }
  };

  // Effect for handling initial setup and wallet connection
  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout;

    const initialize = async () => {
      if (!wallet.publicKey || !mounted) return;

      try {
        await Promise.all([
          checkTokenBalance(wallet.publicKey),
          fetchTotalMinted(connection, wallet, setTotalMinted, setCollectionNft, setWalletMintCount, setUnverifiedCount),
          verifyCollectionSetup()
        ]);

        intervalId = setInterval(() => {
          if (mounted) {
            fetchTotalMinted(connection, wallet, setTotalMinted, setCollectionNft, setWalletMintCount, setUnverifiedCount);
          }
        }, 60000);
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to initialize. Please refresh the page.');
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [wallet.publicKey]);

  // Effect for logging collection authority connection
  useEffect(() => {
    if (wallet.connected && wallet.publicKey?.toString() === COLLECTION_AUTHORITY) {
      console.log('Collection authority connected:', wallet.publicKey.toString());
    }
  }, [wallet.connected, wallet.publicKey]);

  const mintNFT = async () => {
    if (!wallet.publicKey) return;
    
    try {
      setIsMinting(true);
      setError('');

      const metaplex = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet));

      console.log("Verifying collection before mint...");
      let retries = 3;
      let collectionCheck = null;

      while (retries > 0) {
        try {
          collectionCheck = await metaplex.nfts().findByMint({
            mintAddress: new PublicKey(COLLECTION_ADDRESS),
          });
          break;
        } catch (error) {
          console.error(`Collection check attempt ${4 - retries} failed:`, error);
          retries--;
          if (retries > 0) {
            await sleep(2000 * (4 - retries));
          }
        }
      }

      if (!collectionCheck) {
        throw new Error('Collection not found. Please contact support.');
      }

      console.log("Collection pre-mint check:", {
        address: collectionCheck.address.toString(),
        authorityAddress: ('updateAuthorityAddress' in collectionCheck) ? 
          collectionCheck.updateAuthorityAddress.toString() : 'unknown',
        verified: collectionCheck.collection?.verified
      });

      if (walletMintCount >= COLLECTION_CONFIG.maxPerWallet) {
        throw new Error(`You can only mint ${COLLECTION_CONFIG.maxPerWallet} NFT per wallet`);
      }
      
      await checkTokenBalance(wallet.publicKey);
      
      if (!hasRequiredTokens) {
        throw new Error(MESSAGES.NOT_ELIGIBLE);
      }

      await fetchTotalMinted(connection, wallet, setTotalMinted, setCollectionNft, setWalletMintCount, setUnverifiedCount);

      if (totalMinted >= COLLECTION_CONFIG.maxSupply) {
        throw new Error('Collection is sold out!');
      }

      const balance = await connection.getBalance(wallet.publicKey);
      const minBalance = 0.015 * 1e9;
      
      if (balance < minBalance) {
        throw new Error(`Not enough SOL. Need at least 0.015 SOL.`);
      }

      const nextMintNumber = totalMinted + 1;
      console.log('Minting NFT number:', nextMintNumber);
      const nftData = generateNFTMetadata(nextMintNumber);

      console.log('Uploading metadata...');
      let metadataUri;
      retries = 3;

      while (retries > 0) {
        try {
          const result = await metaplex
            .nfts()
            .uploadMetadata({
              ...nftData,
              collection: {
                name: COLLECTION_CONFIG.name,
                family: COLLECTION_CONFIG.symbol,
              },
              properties: {
                files: [
                  {
                    uri: nftData.image,
                    type: "image/png"
                  }
                ],
                category: "image",
                collection: {
                  name: COLLECTION_CONFIG.name,
                  family: COLLECTION_CONFIG.symbol,
                }
              },
            });
          metadataUri = result.uri;
          console.log('Metadata uploaded:', metadataUri);
          break;
        } catch (error) {
          console.error(`Metadata upload attempt ${4 - retries} failed:`, error);
          retries--;
          if (retries > 0) {
            await sleep(2000 * (4 - retries));
          } else {
            throw error;
          }
        }
      }

      let nft;
      retries = 3;
      
      const mintKeypair = Keypair.generate();
      console.log('Mint keypair created:', mintKeypair.publicKey.toString());

      if (!metadataUri) {
        throw new Error('Failed to upload metadata');
      }

      while (retries > 0) {
        try {
          console.log(`Attempt ${4 - retries}: Creating NFT...`);
          const { nft, response } = await metaplex
            .nfts()
            .create({
              uri: metadataUri,
              name: `${COLLECTION_CONFIG.name} #${nextMintNumber}`,
              sellerFeeBasisPoints: COLLECTION_CONFIG.seller_fee_basis_points,
              symbol: COLLECTION_CONFIG.symbol,
              creators: [
                {
                  address: wallet.publicKey,
                  share: 100
                }
              ],
              useNewMint: mintKeypair,
              collection: new PublicKey(COLLECTION_ADDRESS),
              tokenOwner: wallet.publicKey,
              updateAuthority: metaplex.identity(),
              collectionIsSized: true,
            }, {
              commitment: 'finalized'
            });
            
          // Wait for transaction confirmation
          await connection.confirmTransaction(response.signature, 'finalized');
          
          // Verify the mint account exists before proceeding
          const mintAccount = await connection.getAccountInfo(nft.address);
          if (!mintAccount) {
            throw new Error('Mint account not found after creation');
          }

          console.log("NFT created successfully:", {
            signature: response.signature,
            address: nft.address.toString()
          });
          break;
        } catch (error) {
          console.error(`Mint attempt ${4 - retries} failed:`, error);
          retries--;
          if (retries > 0) {
            await sleep(2000 * (4 - retries));
          } else {
            throw error;
          }
        }
      }

      if (!nft) {
        throw new Error('Failed to mint NFT after multiple attempts');
      }

      console.log("Attempting to verify NFT in collection...");
      retries = 3;
      let verified = false;

      while (retries > 0 && !verified) {
        try {
          await metaplex
            .nfts()
            .verifyCollection({
              mintAddress: nft.address,
              collectionMintAddress: new PublicKey(COLLECTION_ADDRESS),
              collectionAuthority: metaplex.identity(),
            }, {
              commitment: 'confirmed'
            });
            
          console.log("NFT verified in collection successfully");
          verified = true;
          break;
        } catch (error) {
          console.error(`Verification attempt ${4 - retries} failed:`, error);
          retries--;
          if (retries > 0) {
            await sleep(2000 * (4 - retries));
          }
        }
      }

      if (!verified) {
        console.log("NFT minted but needs verification - will be verified later");
      }

      setWalletMintCount(prev => prev + 1);
      await fetchTotalMinted(connection, wallet, setTotalMinted, setCollectionNft, setWalletMintCount, setUnverifiedCount);
      
      setError('');
      alert('NFT minted successfully!');
      
    } catch (error) {
      console.error('Minting error:', error);
      const errorMessage = getErrorMessage(error);
      setError(
        errorMessage.includes('0.015 SOL') 
          ? 'Not enough SOL. Please ensure you have at least 0.015 SOL to cover Solana fees.'
          : errorMessage.includes('sold out') 
            ? 'Collection is sold out!'
            : errorMessage.includes('Blockhash not found')
            ? 'Network busy. Please try again.'
            : errorMessage.includes('per wallet')
            ? 'You have reached the maximum mint limit for this wallet.'
            : MESSAGES.MINT_ERROR
      );
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 min-h-screen bg-transparent">
      <div className='absolute right-3 top-3 mb-6'>
        <Button className='border border-azul py-1 px-4 rounded-none text-azul hover:text-white hover:italic font-goatse mx-auto'>
          <Link href="https://www.goatsesingularity.vip/">
            back to Home
          </Link>
        </Button>
      </div>
      <p className='absolute bottom-3 text-sm font-courier text-azul'>* Solana fees apply</p>
      <h1 className="text-azul text-2xl font-goatse">$GoAtse Singularity NFT</h1>
      
      {wallet.connected && wallet.publicKey?.toString() === COLLECTION_AUTHORITY && collectionNft && (
        <div className="flex flex-col gap-4 mb-4">
          <button
            onClick={setupGoatseCollection}
            className={styles.mintButton}
          >
            Setup Collection (Admin Only)
          </button>
          <button
            onClick={verifyPendingNFTs}
            className={styles.mintButton}
          >
            Verify All Pending NFTs
            {unverifiedCount > 0 && ` (${unverifiedCount})`}
          </button>
        </div>
      )}
      
      <div className="text-[#74FFCC] text-xl font-goatse text-center">
        {typeof totalMinted === 'number' ? totalMinted : 0} / {COLLECTION_CONFIG.maxSupply} Minted
        {wallet.connected && (
          <div className="text-sm mt-1">
            Your wallet has minted: {walletMintCount} / {COLLECTION_CONFIG.maxPerWallet}
          </div>
        )}
        {unverifiedCount > 0 && wallet.publicKey?.toString() === COLLECTION_AUTHORITY && 
          ` (${unverifiedCount} unverified)`
        }
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <div className={styles.walletButtonContainer}>
          <WalletMultiButton />
        </div>
        
        {wallet.connected && (
          <>
            {isCheckingBalance ? (
              <p className="text-[#74FFCC] font-goatse">{String(MESSAGES.CHECKING)}</p>
            ) : hasRequiredTokens ? (
              <>
                <p className="text-[#74FFCC] font-goatse">{String(MESSAGES.ELIGIBLE)}</p>
                <button
                  onClick={mintNFT}
                  disabled={isMinting || totalMinted >= COLLECTION_CONFIG.maxSupply || walletMintCount >= COLLECTION_CONFIG.maxPerWallet}
                  className={styles.mintButton}
                >
                  {isMinting 
                    ? 'Minting...' 
                    : totalMinted >= COLLECTION_CONFIG.maxSupply 
                    ? 'Sold Out' 
                    : walletMintCount >= COLLECTION_CONFIG.maxPerWallet
                    ? 'Max Minted'
                    : 'Mint NFT (Free)'}
                </button>
              </>
            ) : (
              <p className="text-red-500 font-courier">
                {String(MESSAGES.NOT_ELIGIBLE)}
              </p>
            )}
          </>
        )}

        {error && (
          <p className="text-red-500 font-courier">{String(error)}</p>
        )}
      </div>
    </div>
  );
}

export default MintingInterface;