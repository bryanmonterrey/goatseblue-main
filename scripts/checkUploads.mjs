// scripts/checkUploads.mjs
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://djlnotfpcpsnqxsopxgm.supabase.co',  // Your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbG5vdGZwY3BzbnF4c29weGdtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTc5ODU0NiwiZXhwIjoyMDQ1Mzc0NTQ2fQ.rXkiQhTKAhuF7cC4BaAB7EHB9jM-yamHSZwy21O9s_M'  // Your service role key
);

async function getAllFiles() {
  let allFiles = [];
  let offset = 0;
  const limit = 1000; // Supabase's maximum limit per request
  
  while (true) {
    const { data: files, error } = await supabase.storage
      .from('nfts')
      .list('', {
        limit: limit,
        offset: offset,
        sortBy: { column: 'name', order: 'asc' }
      });

    if (error) {
      throw error;
    }

    if (files.length === 0) {
      break;
    }

    allFiles = allFiles.concat(files);
    offset += limit;

    if (files.length < limit) {
      break;
    }
  }

  return allFiles;
}

async function checkUploads() {
  try {
    console.log('Checking uploaded files...');
    
    const files = await getAllFiles();

    // Get all files except collection.png
    const uploadedFiles = files
      .filter(file => file.name !== 'collection.png')
      .map(file => ({
        name: file.name,
        size: file.metadata?.size || 0,
        created: new Date(file.created_at).toLocaleString()
      }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}));

    console.log('\n=== Storage Contents ===');
    console.log(`Total files: ${uploadedFiles.length}`);
    
    // Show first 5 files
    console.log('\nFirst 5 files:');
    uploadedFiles.slice(0, 5).forEach(file => {
      console.log(`${file.name} (uploaded: ${file.created})`);
    });

    // Show last 5 files
    console.log('\nLast 5 files:');
    uploadedFiles.slice(-5).forEach(file => {
      console.log(`${file.name} (uploaded: ${file.created})`);
    });

    // Save full list to a file
    const fs = await import('fs');
    const fullList = uploadedFiles.map(f => f.name).join('\n');
    fs.writeFileSync('uploaded-files.txt', fullList);
    
    console.log('\nFull list saved to uploaded-files.txt');

    // Check for specific file 2039.png
    const has2039 = uploadedFiles.some(f => f.name === '2039.png');
    console.log(`\nFile 2039.png: ${has2039 ? 'Found' : 'Missing'}`);

  } catch (error) {
    console.error('Error checking uploads:', error);
  }
}

checkUploads();