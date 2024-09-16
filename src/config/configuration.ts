import { AppConfig } from './app.interface';

export default () => ({
  app: {
    apiUrl: process.env.API_URL,
    apiKey: process.env.API_KEY,
    port: parseInt(process.env.PORT, 10) || 3000,
  } as AppConfig,
});
