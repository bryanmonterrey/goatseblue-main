// app/(browse)/nft/_components/nftConfig.ts
import metadata from './metadata.json';

export const COLLECTION_CONFIG = {
  name: "$Goatse Singularity",
  symbol: "GOATSE",
  description: "Enter the Goatse Singularity",
  seller_fee_basis_points: 500,
  maxSupply: 2222,
  baseImageUrl: "https://djlnotfpcpsnqxsopxgm.supabase.co/storage/v1/object/public/nfts/",
  maxPerWallet: 1
};

export const generateNFTMetadata = (mintNumber: number) => {
  const nftMetadata = metadata.collection[mintNumber - 1]; // Array is 0-based, mint numbers are 1-based
  return {
    name: `Goatse Singularity #${nftMetadata.name}`,
    symbol: COLLECTION_CONFIG.symbol,
    description: nftMetadata.description,
    image: `${COLLECTION_CONFIG.baseImageUrl}${nftMetadata.image}`,
    attributes: nftMetadata.attributes,
    properties: {
      ...nftMetadata.properties,
      creators: [
        // Will be filled in during minting with the wallet address
      ]
    },
    external_url: nftMetadata.external_url,
    compiler: nftMetadata.compiler
  };
};