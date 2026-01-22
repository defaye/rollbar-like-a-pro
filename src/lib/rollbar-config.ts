import { Configuration } from 'rollbar';

const accessToken = import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN;

console.log('🔧 [Rollbar Config] Access token:', accessToken ? `${accessToken.substring(0, 8)}...` : 'MISSING!');
console.log('🔧 [Rollbar Config] Environment:', import.meta.env.MODE);

// Rollbar configuration for dogfooding
// Token is loaded from environment variables (safe for client-side usage)
export const rollbarConfig: Configuration = {
  accessToken,
  environment: import.meta.env.MODE || 'production',
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: true,
  verbose: true, // Enable verbose logging
  payload: {
    client: {
      javascript: {
        code_version: '2.0.0',
        source_map_enabled: true,
      },
    },
    context: 'chrome-extension',
  },
  // Log every item sent to Rollbar
  checkIgnore: (isUncaught, _args, item) => {
    console.log('📤 [Rollbar] Sending item:', {
      isUncaught,
      level: item.level,
      message: item.message,
      timestamp: new Date().toISOString(),
    });
    return false; // Don't ignore anything
  },
  // Transform payload to add extension-specific context
  transform: (payload) => {
    console.log('📦 [Rollbar] Transform called for payload:', payload);
    payload.custom = {
      ...(payload.custom || {}),
      extensionVersion: chrome.runtime.getManifest().version,
      chromeVersion: navigator.userAgent.match(/Chrome\/(\d+)/)?.[1],
      rollbarPage: window.location.href,
    };
  },
};
