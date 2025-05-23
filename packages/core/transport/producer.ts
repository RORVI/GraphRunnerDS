import { Kafka, Message } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();

const mode = process.env.KAFKA_MODE || 'local';

const brokers =
  mode === 'docker'
    ? [process.env.KAFKA_BROKER_DOCKER || 'kafka:9092']
    : [process.env.KAFKA_BROKER_LOCALHOST || 'localhost:9092'];

const kafka = new Kafka({
  clientId: 'graph-runner-ds',
  brokers,
});

export const producer = kafka.producer();

let isConnected = false;

export async function sendToKafka(topic: string, message: Record<string, any>) {
  try {
    if (!isConnected) {
      await producer.connect();
      isConnected = true;
    }

    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });

    console.log(`✅ Sent message to topic '${topic}'`);
  } catch (err) {
    console.error('❌ Kafka producer error:', err);
  }
}
