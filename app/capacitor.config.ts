import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'es.pinkypet.app',
  appName: 'Pinky Pet',
  webDir: 'www',
  // Origen de la app en Android: https://localhost (está en CORS_ORIGINS de render.yaml).
  android: { allowMixedContent: false },
};

export default config;
