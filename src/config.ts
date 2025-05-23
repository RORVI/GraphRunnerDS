import fs from 'fs';
import path from 'path';

export interface Config {
  graphRunnerUrl: string;
  sendInterval: number;
  templatePath: string;
}

export function loadConfig(): Config {
  const templateId = process.env.TEMPLATE_ID || '01';
  const templateDir = './templates/network';

  const files = fs.readdirSync(templateDir);
  const matchedFile = files.find(f => f.startsWith(templateId + '-'));

  if (!matchedFile) {
    throw new Error(`❌ No template file found for ID ${templateId}`);
  }

  return {
    graphRunnerUrl: process.env.GRAPH_RUNNER_URL || 'http://localhost:3030/ingest',
    sendInterval: parseInt(process.env.SEND_INTERVAL_MS || '1000', 10),
    templatePath: path.join(templateDir, matchedFile)
  };
}
