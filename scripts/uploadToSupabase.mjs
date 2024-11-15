// scripts/uploadToSupabase.mjs
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  'https://djlnotfpcpsnqxsopxgm.supabase.co',  // Your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbG5vdGZwY3BzbnF4c29weGdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTc5ODU0NiwiZXhwIjoyMDQ1Mzc0NTQ2fQ.rXkiQhTKAhuF7cC4BaAB7EHB9jM-yamHSZwy21O9s_M'  // Your service role key
);

async function uploadAllNFTs() {
  try {
    let successCount = 0;
    let errorCount = 0;
    const totalFiles = 2222;

    // Upload collection image if not already done
    console.log('Checking collection image...');
    const collectionImage = fs.readFileSync(path.join(__dirname, '../public/collection.png'));
    await supabase.storage
      .from('nfts')
      .upload('collection.png', collectionImage, {
        contentType: 'image/png',
        upsert: true
      });

    console.log('Starting NFT uploads...');
    
    // Upload all NFTs
    for (let i = 1; i <= totalFiles; i++) {
      try {
        const filePath = path.join(__dirname, '../public/collection', `${i}.png`);
        
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath);
          const { error } = await supabase.storage
            .from('nfts')
            .upload(`${i}.png`, fileContent, {
              contentType: 'image/png',
              upsert: true
            });

          if (error) {
            console.error(`Error uploading ${i}.png:`, error.message);
            errorCount++;
          } else {
            successCount++;
            // Log progress every 100 files
            if (successCount % 100 === 0) {
              console.log(`Progress: ${successCount}/${totalFiles} files uploaded`);
            }
          }
        } else {
          console.warn(`File ${i}.png not found`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing ${i}.png:`, error.message);
        errorCount++;
      }

      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log('\nUpload Summary:');
    console.log(`Successfully uploaded: ${successCount} files`);
    console.log(`Failed uploads: ${errorCount} files`);
    console.log('Total files processed:', successCount + errorCount);

  } catch (error) {
    console.error('Fatal error during upload:', error);
    throw error;
  }
}

// Run the upload
console.log('Starting upload process...');
uploadAllNFTs()
  .then(() => console.log('Upload process complete!'))
  .catch(console.error);