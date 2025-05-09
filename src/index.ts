import dotenv from 'dotenv';
import path from 'path';
import { generateData } from './generator';
import { sendData } from './transport/sender';
import { sendToKafka } from './transport/producer';
import { loadConfig } from './config';

dotenv.config();

async function generateAndSend() {
  try {
    const config = loadConfig();
    const data = generateData(config.templatePath);

    if (process.env.USE_KAFKA === 'true') {
      const topic = process.env.KAFKA_TOPIC || 'graphrunner.ingest';
      await sendToKafka(topic, data);
    } else {
      await sendData(config.graphRunnerUrl, data);
    }

    console.log('Data sent:', JSON.stringify(data));
  } catch (err) {
    console.error('Error during data generation or sending:', err);
  }
}

function start() {
  const interval = parseInt(process.env.SEND_INTERVAL_MS || '1000', 10);
  console.log(`Starting data generator, sending every ${interval}ms via ${process.env.USE_KAFKA === 'true' ? 'Kafka' : 'HTTP'}...`);
  setInterval(generateAndSend, interval);
}

start();
