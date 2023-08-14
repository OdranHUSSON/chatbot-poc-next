import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.webforger.fr',
  appName: 'chatbot',
  webDir: 'out',
  server: {
    url: "http://de1.webforger.fr:3000/"
  }
};

export default config;
