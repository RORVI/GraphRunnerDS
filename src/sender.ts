import axios from 'axios';

export async function sendData(url: string, payload: any): Promise<void> {
  try {
    const response = await axios.post(url, payload);
    if (response.status >= 200 && response.status < 300) {
      return;
    } else {
      console.warn(`⚠️ Non-2xx response from GraphRunner: ${response.status}`);
    }
  } catch (error: any) {
    console.error(`❌ Failed to send data to ${url}:`, error.message || error);
  }
}
