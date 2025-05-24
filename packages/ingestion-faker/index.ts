import { generateData } from '@graphrunnerds/core/generator';
import { sendToKafka } from '@graphrunnerds/core/transport/producer';
import { sendData } from '@graphrunnerds/core/transport/sender';
import { loadConfig } from '@graphrunnerds/core/config';
import { parseBitrate } from '@graphrunnerds/core/generator';
import fs from 'fs';

export function init() {
  const interval = parseInt(process.env.SEND_INTERVAL_MS || '1000', 10);
  const useKafka = process.env.USE_KAFKA === 'true';
  console.log(`🧪 [Faker] Starting — every ${interval}ms via ${useKafka ? 'Kafka' : 'HTTP'}`);

  setInterval(async () => {
    try {
      const config = loadConfig();
      const data = generateData(config.templatePath);
  
      // 🔍 Check if template enforces maxBitrate
      const rawTemplate = JSON.parse(fs.readFileSync(config.templatePath, 'utf-8'));
      if (rawTemplate.maxBitrate) {
        const maxBitrate = parseBitrate(rawTemplate.maxBitrate); // in bps
        const allowedBytes = (maxBitrate / 8) * (interval / 1000); // bytes per interval
        const payloadSize = Buffer.byteLength(JSON.stringify(data), 'utf-8');
  
        if (payloadSize > allowedBytes) {
          console.warn(`⚠️ [Faker] Skipped emit: payload (${payloadSize}B) exceeds maxBitrate (${allowedBytes.toFixed(0)}B allowed)`);
          return;
        }
      }
  
      if (useKafka) {
        const topic = process.env.KAFKA_TOPIC || 'graphrunner.ingest';
        await sendToKafka(topic, data);
      } else {
        await sendData(config.graphRunnerUrl, data);
      }
  
      console.log('📤 [Faker] Data sent:', JSON.stringify(data));
    } catch (err) {
      console.error('❌ [Faker] Error during send:', err);
    }
  }, interval);
}
