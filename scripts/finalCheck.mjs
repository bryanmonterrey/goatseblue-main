// scripts/finalCheck.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://djlnotfpcpsnqxsopxgm.supabase.co',  // Your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbG5vdGZwY3BzbnF4c29weGdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTc5ODU0NiwiZXhwIjoyMDQ1Mzc0NTQ2fQ.rXkiQhTKAhuF7cC4BaAB7EHB9jM-yamHSZwy21O9s_M'  // Your service role key
);

async function getAllFiles() {
  let allFiles = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data: files, error } = await supabase.storage
      .from('nfts')
      .list('', {
        limit: limit,
        offset: offset,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) throw error;
    if (files.length === 0) break;
    
    allFiles = allFiles.concat(files);
    offset += limit;
    
    if (files.length < limit) break;
  }

  return allFiles;
}

async function finalCheck() {
  try {
    console.log('Performing final verification...');
    
    const files = await getAllFiles();
    const uploadedFiles = files
      .filter(file => file.name.endsWith('.png'))
      .map(file => file.name);

    const expectedFiles = new Set();
    for (let i = 1; i <= 2222; i++) {
      expectedFiles.add(`${i}.png`);
    }

    // Check for missing files
    const missingFiles = [];
    expectedFiles.forEach(file => {
      if (!uploadedFiles.includes(file)) {
        missingFiles.push(file);
      }
    });

    // Check for unexpected extra files
    const extraFiles = uploadedFiles.filter(file => !expectedFiles.has(file) && file !== 'collection.png');

    console.log('\n=== Verification Results ===');
    console.log(`Total files: ${uploadedFiles.length}`);
    console.log(`Expected files: 2222`);
    console.log(`Collection.png: ${uploadedFiles.includes('collection.png') ? 'Present' : 'Missing'}`);
    
    if (missingFiles.length > 0) {
      console.log('\nMissing files:');
      console.log(missingFiles.join(', '));
    } else {
      console.log('\n✅ All expected files are present!');
    }

    if (extraFiles.length > 0) {
      console.log('\nUnexpected extra files:');
      console.log(extraFiles.join(', '));
    }

  } catch (error) {
    console.error('Error during verification:', error);
  }
}

finalCheck();