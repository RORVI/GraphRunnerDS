import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  graphRunnerUrl: string;
  sendInterval: number;
  templatePath: string;
}

export function loadConfig(): Config {
  return {
    graphRunnerUrl: process.env.GRAPH_RUNNER_URL || 'http://localhost:3000/ingest',
    sendInterval: parseInt(process.env.SEND_INTERVAL_MS || '1000', 10),
    templatePath: process.env.TEMPLATE_PATH || './templates/sample-template.json',
  };
}
