import { App } from './App';
import { ShadowRootContainer } from './lib/shadow-root';
import styles from './styles/index.css?inline';

console.log('🎯 [Rollbar Pro] Content script loaded');
console.log('🎯 [Rollbar Pro] Current URL:', window.location.href);

// Track if we've already injected to avoid duplicates
let currentContainer: ShadowRootContainer | null = null;

/**
 * Injects the preset dropdown into Rollbar's resolve modal
 */
function injectPresetDropdown() {
  console.log('🎯 [Rollbar Pro] injectPresetDropdown called');

  // Check if the resolve form exists
  const resolveForm = document.querySelector('form[data-testid="item-resolve-form"]');
  if (!resolveForm) {
    console.log('⏸️ [Rollbar Pro] Resolve form not found yet');
    return;
  }

  console.log('✅ [Rollbar Pro] Found resolve form!');

  // Check if we already have an injected component in this form
  const existingRoot = resolveForm.querySelector('#rollbar-pro-root');
  if (existingRoot && currentContainer) {
    console.log('✅ [Rollbar Pro] Already injected and mounted, skipping');
    return;
  }

  // If we have a stale reference but no DOM element, clean up
  if (currentContainer && !existingRoot) {
    console.log('⚠️ [Rollbar Pro] Found stale container reference, cleaning up...');
    cleanup();
  }

  // If we have a DOM element but no container reference, something went wrong
  if (existingRoot && !currentContainer) {
    console.log('⚠️ [Rollbar Pro] Found orphaned DOM element, removing...');
    existingRoot.remove();
  }

  // Find the comment textarea
  const commentTextarea = resolveForm.querySelector('textarea#comment');
  if (!commentTextarea) {
    console.log('⚠️ [Rollbar Pro] Comment textarea not found');
    return;
  }

  console.log('✅ [Rollbar Pro] Found comment textarea!');

  try {
    console.log('🎯 [Rollbar Pro] Creating shadow DOM for presets...');

    // Create shadow DOM container
    currentContainer = new ShadowRootContainer('rollbar-pro-root');

    // Mount the React app with styles
    currentContainer.mount(<App />, styles);

    // Insert after the comment textarea
    commentTextarea.parentElement?.appendChild(currentContainer['shadowHost']);

    console.log('✅ [Rollbar Pro] Preset dropdown injected successfully!');
    console.log('👉 [Rollbar Pro] Look for "Presets" dropdown below comment field');
  } catch (error) {
    console.error('❌ [Rollbar Pro] Failed to inject preset dropdown:', error);
    currentContainer = null; // Reset on error
  }
}

/**
 * Removes the injected component when modal closes
 */
function cleanup() {
  if (currentContainer) {
    console.log('🧹 [Rollbar Pro] Starting cleanup...');
    try {
      currentContainer.unmount();
      currentContainer = null;
      console.log('✅ [Rollbar Pro] Cleanup completed successfully');
    } catch (error) {
      console.error('❌ [Rollbar Pro] Error during cleanup:', error);
      currentContainer = null; // Reset anyway
    }
  } else {
    console.log('⏸️ [Rollbar Pro] Cleanup called but nothing to clean');
  }
}

/**
 * Observes DOM changes to detect when Rollbar's modal opens/closes
 */
function observeModalChanges() {
  console.log('🎯 [Rollbar Pro] Setting up MutationObserver...');

  let mutationCount = 0;

  const observer = new MutationObserver((mutations) => {
    mutationCount++;

    // Log every 50 mutations to show we're watching
    if (mutationCount % 50 === 0) {
      console.log(`🎯 [Rollbar Pro] Observed ${mutationCount} DOM mutations so far...`);
    }

    for (const mutation of mutations) {
      // ONLY watch for added nodes (modal opening)
      // Don't watch removedNodes - Rollbar shuffles DOM too much, causing false positives
      // We'll use the health check for cleanup instead
      for (const node of Array.from(mutation.addedNodes)) {
        if (node instanceof HTMLElement) {
          // Check if the resolve form was added
          if (node.querySelector('form[data-testid="item-resolve-form"]')) {
            console.log('🎉 [Rollbar Pro] Resolve modal detected!');
            injectPresetDropdown();
          }
        }
      }
    }
  });

  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log('✅ [Rollbar Pro] MutationObserver started successfully!');
  console.log('👀 [Rollbar Pro] Watching for Rollbar resolve modal...');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('🎯 [Rollbar Pro] DOM still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', observeModalChanges);
} else {
  console.log('🎯 [Rollbar Pro] DOM already ready, starting observer immediately');
  observeModalChanges();
}

// Also try to inject immediately in case the modal is already open
console.log('🎯 [Rollbar Pro] Checking if resolve modal is already open...');
injectPresetDropdown();

// Periodic health check to catch any missed state changes
// This is the ONLY place we do cleanup (not in MutationObserver)
// Rollbar shuffles DOM too much, causing false cleanup triggers
setInterval(() => {
  const resolveForm = document.querySelector('form[data-testid="item-resolve-form"]');
  const existingRoot = document.querySelector('#rollbar-pro-root');

  // Modal is open but we haven't injected
  if (resolveForm && !existingRoot && !currentContainer) {
    console.log('🔄 [Rollbar Pro] Health check: Modal open but not injected, injecting now...');
    injectPresetDropdown();
  }

  // We have a container reference but modal is closed - CLEANUP
  if (currentContainer && !resolveForm) {
    console.log('🔄 [Rollbar Pro] Health check: Modal closed, cleaning up...');
    cleanup();
  }

  // Orphaned DOM element without container reference
  if (existingRoot && !currentContainer && !resolveForm) {
    console.log('🔄 [Rollbar Pro] Health check: Found orphaned element, removing...');
    existingRoot.remove();
  }
}, 500); // Check every 500ms for faster response
