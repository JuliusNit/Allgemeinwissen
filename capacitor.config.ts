import type { CapacitorConfig } from '@capacitor/cli'

// Native Huelle (iOS/Android) um denselben Vite-Build wie die Web-Version (dist/), Bauen: `npm run cap:sync`.
// App-ID = Bundle-ID (iOS) und Paketname (Android): nach der ersten Store-Einreichung nicht mehr aenderbar.
// Das URL-Schema fuer Konto-Mails (lib/native.ts → AUTH_SCHEME) ist dieselbe Zeichenkette.
const config: CapacitorConfig = {
  appId: 'de.allgemeinwissen.app',
  appName: 'Allgemeinwissen',
  webDir: 'dist',
  backgroundColor: '#ffffff',
  ios: {
    contentInset: 'never',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
    // Seite reicht unter Uhr/Notch; die Abstaende setzt index.css ueber --sa-top (env(safe-area-inset-*))
    StatusBar: {
      style: 'LIGHT',
      overlaysWebView: true,
    },
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_notify',
      iconColor: '#000000',
    },
  },
}

export default config
