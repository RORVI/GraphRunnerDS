import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const sources = process.env.ENABLED_SOURCES?.split(',') || [];

  console.log(`🔧 Enabled ingestion sources: ${sources.join(', ') || 'none'}`);

  for (const mod of sources) {
    try {
      const module = await import(`@graphrunnerds/${mod}`);
      if (typeof module.init === 'function') {
        module.init();
        console.log(`✅ ${mod} initialized.`);
      } else {
        console.warn(`⚠️ ${mod} has no init() function.`);
      }
    } catch (err: any) {
      console.error(`❌ Failed to load ${mod}:`, err.message);
    }
  }
}

main();
