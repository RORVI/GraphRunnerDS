import dotenv from 'dotenv';
import path from 'path';
import { generateData } from './generator';
import { sendData } from './sender';
import { loadConfig } from './config';

dotenv.config();

async function generateAndSend() {
  try {
    const config = loadConfig();
    const data = generateData(config.templatePath);
    await sendData(config.graphRunnerUrl, data);
    console.log('Data sent:', JSON.stringify(data));
  } catch (err) {
    console.error('Error during data generation or sending:', err);
  }
}

function start() {
  const interval = parseInt(process.env.SEND_INTERVAL_MS || '1000', 10);
  console.log(`Starting data generator, sending every ${interval}ms...`);
  setInterval(generateAndSend, interval);
}

start();
