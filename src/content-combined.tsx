// Combined content script: includes both preset dropdown AND dev panel
import { Provider, ErrorBoundary, useRollbar } from '@rollbar/react';
import { App } from './App';
import { DevPanel } from './components/DevPanel';
import { ShadowRootContainer } from './lib/shadow-root';
import { rollbarConfig } from './lib/rollbar-config';
import styles from './styles/index.css?inline';

const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

console.log('🎯 [Rollbar Pro] Content script loaded');
console.log('🎯 [Rollbar Pro] Current URL:', window.location.href);
console.log('🔧 [Rollbar Pro] Dev mode:', isDevMode);
console.log('🔧 [Rollbar Pro] Environment:', import.meta.env.MODE);
console.log('🔧 [Rollbar Pro] Rollbar token configured:', !!rollbarConfig.accessToken);

// Monitor network requests to Rollbar API
const originalFetch = window.fetch;
window.fetch = function (...args) {
  const url = args[0]?.toString() || '';
  if (url.includes('rollbar.com') || url.includes('api.rollbar.com')) {
    console.log('🌐 [Network] Fetch to Rollbar:', url);
    console.log('🌐 [Network] Fetch args:', args);
  }
  return originalFetch.apply(this, args as any).then((response) => {
    if (url.includes('rollbar.com')) {
      console.log('🌐 [Network] Rollbar response:', response.status, response.statusText);
      response.clone().text().then((body) => {
        console.log('🌐 [Network] Rollbar response body:', body);
      });
    }
    return response;
  }).catch((error) => {
    if (url.includes('rollbar.com')) {
      console.error('🌐 [Network] Rollbar fetch error:', error);
    }
    throw error;
  });
};

// =============================================================================
// PART 1: Preset Dropdown (injected into resolve modal)
// =============================================================================

let currentPresetContainer: ShadowRootContainer | null = null;

function injectPresetDropdown() {
  console.log('🎯 [Rollbar Pro] injectPresetDropdown called');

  const resolveForm = document.querySelector('form[data-testid="item-resolve-form"]');
  if (!resolveForm) {
    console.log('⏸️ [Rollbar Pro] Resolve form not found yet');
    return;
  }

  console.log('✅ [Rollbar Pro] Found resolve form!');

  if (currentPresetContainer || resolveForm.querySelector('#rollbar-pro-root')) {
    console.log('⚠️ [Rollbar Pro] Already injected, skipping');
    return;
  }

  const commentTextarea = resolveForm.querySelector('textarea#comment');
  if (!commentTextarea) {
    console.log('⚠️ [Rollbar Pro] Comment textarea not found');
    return;
  }

  console.log('✅ [Rollbar Pro] Found comment textarea!');

  try {
    console.log('🎯 [Rollbar Pro] Creating shadow DOM for presets...');

    currentPresetContainer = new ShadowRootContainer('rollbar-pro-root');
    currentPresetContainer.mount(<App />, styles);
    commentTextarea.parentElement?.appendChild(currentPresetContainer['shadowHost']);

    console.log('✅ [Rollbar Pro] Preset dropdown injected successfully!');
    console.log('👉 [Rollbar Pro] Look for "Presets" dropdown below comment field');
  } catch (error) {
    console.error('❌ [Rollbar Pro] Failed to inject preset dropdown:', error);
  }
}

function cleanupPresetDropdown() {
  if (currentPresetContainer) {
    currentPresetContainer.unmount();
    currentPresetContainer = null;
    console.log('🧹 [Rollbar Pro] Cleaned up preset dropdown');
  }
}

// =============================================================================
// PART 2: Dev Panel (floating overlay on all pages)
// =============================================================================

function DevPanelApp() {
  const rollbar = useRollbar();
  return <DevPanel rollbar={rollbar} />;
}

function injectDevPanel() {
  if (!isDevMode) {
    console.log('⚠️ [Rollbar Pro] Dev mode disabled - skipping dev panel injection');
    console.log('💡 [Rollbar Pro] Set VITE_DEV_MODE=true in .env to enable');
    return;
  }

  if (document.querySelector('#rollbar-pro-dev-panel')) {
    console.log('⚠️ [Rollbar Pro] Dev panel already exists - skipping');
    return;
  }

  try {
    console.log('🔧 [Rollbar Pro] Creating shadow DOM for dev panel...');

    const devPanelContainer = new ShadowRootContainer('rollbar-pro-dev-panel');
    devPanelContainer.mount(
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
          <DevPanelApp />
        </ErrorBoundary>
      </Provider>,
      styles
    );

    document.body.appendChild(devPanelContainer['shadowHost']);

    console.log('✅ [Rollbar Pro] Dev panel injected successfully!');
    console.log('👉 [Rollbar Pro] Look for purple arrow (▶) on left edge of page');

    // Debug: Check if the shadow root is accessible
    setTimeout(() => {
      const shadowHost = document.querySelector('#rollbar-pro-dev-panel');
      if (shadowHost && shadowHost.shadowRoot) {
        console.log('🔍 [Rollbar Pro] Shadow host found:', shadowHost);
        console.log('🔍 [Rollbar Pro] Shadow root:', shadowHost.shadowRoot);
        console.log('🔍 [Rollbar Pro] Shadow root children:', shadowHost.shadowRoot.children.length);

        // Check if buttons exist
        const buttons = shadowHost.shadowRoot.querySelectorAll('button');
        console.log('🔍 [Rollbar Pro] Found', buttons.length, 'buttons');

        buttons.forEach((button, index) => {
          console.log(`🔍 [Rollbar Pro] Button ${index}:`, button.textContent?.trim());
          const styles = window.getComputedStyle(button);
          console.log(`🔍 [Rollbar Pro] Button ${index} pointer-events:`, styles.pointerEvents);
          console.log(`🔍 [Rollbar Pro] Button ${index} display:`, styles.display);
          console.log(`🔍 [Rollbar Pro] Button ${index} z-index:`, styles.zIndex);

          // Test manual click
          button.addEventListener('click', (e) => {
            console.log(`✅ [Rollbar Pro] Button ${index} click event fired!`, e);
          });
        });

        // Check for overlays
        const allElements = shadowHost.shadowRoot.querySelectorAll('*');
        console.log('🔍 [Rollbar Pro] Total elements in shadow root:', allElements.length);
      }
    }, 1000); // Wait 1 second for React to render
  } catch (error) {
    console.error('❌ [Rollbar Pro] Failed to inject dev panel:', error);
  }
}

// =============================================================================
// PART 3: MutationObserver (watches for modal open/close)
// =============================================================================

function observeModalChanges() {
  console.log('🎯 [Rollbar Pro] Setting up MutationObserver...');

  let mutationCount = 0;

  const observer = new MutationObserver((mutations) => {
    mutationCount++;

    if (mutationCount % 50 === 0) {
      console.log(`🎯 [Rollbar Pro] Observed ${mutationCount} DOM mutations so far...`);
    }

    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if (node instanceof HTMLElement) {
          if (node.querySelector('form[data-testid="item-resolve-form"]')) {
            console.log('🎉 [Rollbar Pro] Resolve modal detected!');
            injectPresetDropdown();
          }
        }
      }

      for (const node of Array.from(mutation.removedNodes)) {
        if (node instanceof HTMLElement) {
          if (node.querySelector('#rollbar-pro-root') || currentPresetContainer) {
            cleanupPresetDropdown();
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log('✅ [Rollbar Pro] MutationObserver started successfully!');
  console.log('👀 [Rollbar Pro] Watching for Rollbar resolve modal...');
}

// =============================================================================
// INITIALISATION
// =============================================================================

function init() {
  // Part 1: Set up mutation observer for preset dropdown
  if (document.readyState === 'loading') {
    console.log('🎯 [Rollbar Pro] DOM still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', observeModalChanges);
  } else {
    console.log('🎯 [Rollbar Pro] DOM already ready, starting observer immediately');
    observeModalChanges();
  }

  // Check if modal is already open
  console.log('🎯 [Rollbar Pro] Checking if resolve modal is already open...');
  injectPresetDropdown();

  // Part 2: Inject dev panel (if enabled)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDevPanel);
  } else {
    injectDevPanel();
  }
}

init();
