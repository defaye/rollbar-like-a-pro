import React from 'react';
import { createRoot, Root } from 'react-dom/client';

/**
 * Creates a Shadow DOM container and mounts a React app inside it
 * This provides complete style isolation from the host page
 */
export class ShadowRootContainer {
  private shadowHost: HTMLDivElement;
  private shadowRoot: ShadowRoot;
  private reactRoot: Root | null = null;

  constructor(containerId: string) {
    // Create the shadow host element
    this.shadowHost = document.createElement('div');
    this.shadowHost.id = containerId;

    // Attach shadow root with mode 'open' (allows access from outside)
    this.shadowRoot = this.shadowHost.attachShadow({ mode: 'open' });

    // Create a container inside the shadow root for React
    const reactContainer = document.createElement('div');
    reactContainer.id = 'react-root';
    this.shadowRoot.appendChild(reactContainer);
  }

  /**
   * Mounts the React app inside the shadow root
   */
  mount(app: React.ReactElement, styles: string) {
    console.log('🎨 [ShadowRoot] Mounting React app...');
    console.log('🎨 [ShadowRoot] Styles length:', styles.length);

    // Inject styles into shadow root
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    this.shadowRoot.insertBefore(styleSheet, this.shadowRoot.firstChild);
    console.log('🎨 [ShadowRoot] Styles injected');

    // Mount React app
    const container = this.shadowRoot.querySelector('#react-root');
    if (container) {
      console.log('🎨 [ShadowRoot] Found react-root container');
      this.reactRoot = createRoot(container);
      this.reactRoot.render(app);
      console.log('🎨 [ShadowRoot] React app rendered');
    } else {
      console.error('❌ [ShadowRoot] react-root container not found!');
    }
  }

  /**
   * Appends the shadow host to a target element
   */
  appendTo(target: Element) {
    target.appendChild(this.shadowHost);
  }

  /**
   * Removes the shadow host from the DOM
   */
  unmount() {
    if (this.reactRoot) {
      this.reactRoot.unmount();
    }
    this.shadowHost.remove();
  }

  /**
   * Returns the shadow root for direct DOM access if needed
   */
  getShadowRoot(): ShadowRoot {
    return this.shadowRoot;
  }
}
