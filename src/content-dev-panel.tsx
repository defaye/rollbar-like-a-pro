import { Provider, ErrorBoundary, useRollbar } from '@rollbar/react';
import { ShadowRootContainer } from './lib/shadow-root';
import { rollbarConfig } from './lib/rollbar-config';
import { DevPanel } from './components/DevPanel';
import styles from './styles/index.css?inline';

// Only run this in dev mode
const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

console.log('🔧 [Rollbar Pro] Dev panel script loaded');
console.log('🔧 [Rollbar Pro] Dev mode:', isDevMode);
console.log('🔧 [Rollbar Pro] Environment:', import.meta.env.MODE);
console.log('🔧 [Rollbar Pro] Rollbar token configured:', !!rollbarConfig.accessToken);

function DevPanelApp() {
  const rollbar = useRollbar();
  return <DevPanel rollbar={rollbar} />;
}

/**
 * Injects the dev panel as a floating overlay on all Rollbar pages
 */
function injectDevPanel() {
  console.log('🔧 [Rollbar Pro] injectDevPanel called');

  if (!isDevMode) {
    console.log('⚠️ [Rollbar Pro] Dev mode disabled - skipping dev panel injection');
    console.log('💡 [Rollbar Pro] Set VITE_DEV_MODE=true in .env to enable');
    return;
  }

  // Check if already injected
  if (document.querySelector('#rollbar-pro-dev-panel')) {
    console.log('⚠️ [Rollbar Pro] Dev panel already exists - skipping');
    return;
  }

  try {
    console.log('🔧 [Rollbar Pro] Creating shadow DOM for dev panel...');

    // Create shadow DOM container for dev panel
    const devPanelContainer = new ShadowRootContainer('rollbar-pro-dev-panel');

    // Mount the React app with Rollbar provider
    devPanelContainer.mount(
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
          <DevPanelApp />
        </ErrorBoundary>
      </Provider>,
      styles
    );

    // Append to body (not inside any modal)
    document.body.appendChild(devPanelContainer['shadowHost']);

    console.log('✅ [Rollbar Pro] Dev panel injected successfully!');
    console.log('👉 [Rollbar Pro] Look for purple arrow (▶) on left edge of page');
  } catch (error) {
    console.error('❌ [Rollbar Pro] Failed to inject dev panel:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('🔧 [Rollbar Pro] DOM still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', injectDevPanel);
} else {
  console.log('🔧 [Rollbar Pro] DOM already ready, injecting immediately');
  injectDevPanel();
}
