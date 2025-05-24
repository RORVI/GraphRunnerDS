import fs from 'fs';
import { generateData, parseBitrate } from '@graphrunnerds/core/generator';
import { sendToKafka } from '@graphrunnerds/core/transport/producer';
import { sendData } from '@graphrunnerds/core/transport/sender';
import { loadConfig } from '@graphrunnerds/core/config';

import {
  initController,
  createControlAPI,
  getCurrentRate
} from '@graphrunnerds/control-api';

const useKafka = process.env.USE_KAFKA === 'true';

async function emitData(): Promise<void> {
  try {
    const config = loadConfig();
    const data = generateData(config.templatePath);

    const rawTemplate = JSON.parse(fs.readFileSync(config.templatePath, 'utf-8'));
    if (rawTemplate.maxBitrate) {
      const interval = getCurrentRate();
      const maxBitrate = parseBitrate(rawTemplate.maxBitrate);
      const allowedBytes = (maxBitrate / 8) * (interval / 1000);
      const payloadSize = Buffer.byteLength(JSON.stringify(data), 'utf-8');

      if (payloadSize > allowedBytes) {
        console.warn(`⚠️ Skipped emit: ${payloadSize}B > ${allowedBytes.toFixed(0)}B`);
        return;
      }
    }

    if (useKafka) {
      const topic = process.env.KAFKA_TOPIC || 'graphrunner.ingest';
      await sendToKafka(topic, data);
    } else {
      await sendData(config.graphRunnerUrl, data);
    }

    console.log('📤 Data sent:', JSON.stringify(data));
  } catch (err) {
    console.error('❌ Error during send:', err);
  }
}

const defaultRate = parseInt(process.env.SEND_INTERVAL_MS || '1000', 10);
initController(emitData, defaultRate);
createControlAPI(4001);
