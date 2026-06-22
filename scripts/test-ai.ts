// Quick test: panggil generateCusWebsite langsung + print hasil + raw response kalau error.
// Usage: npx tsx scripts/test-ai.ts

import { generateCusWebsite } from '../src/lib/openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const sample = {
  namaBisnis: 'Kopi Srawung',
  jenisBisnis: 'Kafe / Restoran' as const,
  lokasi: 'Jl. Kaliurang KM 5, Yogyakarta',
  whatsapp: '6281234567890',
  email: 'demo@cus.site',
  vibe: 'casual' as const,
  subdomain: 'kopisrawung',
  layanan: [
    { title: 'Kopi Susu', description: 'Kopi susu kekinian harga ramah' },
    { title: 'Nasi Goreng', description: 'Nasi goreng spesial buat malam' },
  ],
};

async function main() {
  console.log('▶ Calling generateCusWebsite...');
  console.log(`  Model: ${process.env.OPENAI_MODEL}`);
  console.log(`  Base URL: ${process.env.OPENAI_BASE_URL}`);
  console.log(`  API Key: ${process.env.OPENAI_API_KEY?.slice(0, 10)}...`);
  console.log('');

  const result = await generateCusWebsite(sample);

  if (result.success) {
    console.log('✅ SUCCESS');
    console.log('Mode:', result.mode);
    console.log('Data:');
    console.log(JSON.stringify(result.data, null, 2));
  } else {
    console.log('❌ FAILED');
    console.log('Error:', result.error);
    if ('cleanedPreview' in result && result.cleanedPreview) {
      console.log('');
      console.log('Cleaned preview (after think-strip, first 600 chars):');
      console.log('─'.repeat(50));
      console.log(result.cleanedPreview.slice(0, 600));
      console.log('─'.repeat(50));
    }
    if (result.rawResponse) {
      console.log('');
      console.log('Raw response (first 1500 chars):');
      console.log('═'.repeat(50));
      console.log(result.rawResponse.slice(0, 1500));
      console.log('═'.repeat(50));
    }
  }
}

main().catch(console.error);
