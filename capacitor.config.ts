import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.webforger.fr',
  appName: 'chatbot',
  webDir: 'public',
  server: {
    url: "http://localhost:3000/"
  }
};

export default config;
