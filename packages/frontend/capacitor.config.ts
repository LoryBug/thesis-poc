import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'it.unibo.cardiacmassdss',
  appName: 'Cardiac Mass DSS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#173b68',
      showSpinner: false,
      androidSplashResourceName: 'splash',
    },
  },
}

export default config
