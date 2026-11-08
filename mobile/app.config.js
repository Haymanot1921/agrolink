// Reads .env.* values at build time and injects them into the app config.
// Never hardcode secrets here — read from process.env.

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';
const IS_PROD = !IS_DEV && !IS_PREVIEW;

const getAppName = () => {
  if (IS_DEV) return 'AgroLink (Dev)';
  if (IS_PREVIEW) return 'AgroLink (Preview)';
  return 'AgroLink Ethiopia';
};

const getBundleId = () => {
  if (IS_DEV) return 'et.agrolink.app.dev';
  if (IS_PREVIEW) return 'et.agrolink.app.preview';
  return 'et.agrolink.app';
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  slug: 'agrolink-ethiopia',
  scheme: IS_DEV ? 'agrolink-dev' : IS_PREVIEW ? 'agrolink-preview' : 'agrolink',
  ios: {
    ...config.ios,
    bundleIdentifier: getBundleId(),
    buildNumber: '1'
  },
  android: {
    ...config.android,
    package: getBundleId(),
    versionCode: 1
  },
  extra: {
    ...config.extra,
    apiUrl: process.env.API_URL || 'http://localhost:5000/api/v1',
    socketUrl: process.env.SOCKET_URL || 'http://localhost:5000',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    agoraAppId: process.env.AGORA_APP_ID || '',
    sentryDsn: process.env.SENTRY_DSN || '',
    enableDebug: process.env.ENABLE_DEBUG === 'true',
    appVariant: process.env.APP_VARIANT || 'production',
    eas: {
      projectId: process.env.EAS_PROJECT_ID || 'REPLACE_WITH_YOUR_EAS_PROJECT_ID'
    }
  }
});