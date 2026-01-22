# Development Workflow

## Quick Start

### First Time Setup

1. **Build the extension**
   ```bash
   yarn build
   ```

2. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (toggle top-right)
   - Click "Load unpacked"
   - Select the `dist/` folder

3. **Visit Rollbar**
   - Go to `https://app.rollbar.com`
   - Look for purple arrow (▶) on left edge
   - Click to expand dev panel

4. **Send your first event**
   - Click "🔴 Manual Error" in dev panel
   - Refresh Rollbar setup page to confirm

## Development Cycle

### Making Changes

**Option 1: Manual Build (Recommended for quick iterations)**
```bash
yarn build
# Then:
# 1. Go to chrome://extensions/
# 2. Click reload icon (🔄) on extension
# 3. Refresh Rollbar page
```

**Option 2: Watch Mode**
```bash
yarn dev
# Automatically rebuilds on file changes
# Still need to manually:
# 1. Reload extension in chrome://extensions/
# 2. Refresh Rollbar page
```

### Why No Hot Module Reload?

Chrome extensions run in a different context than web apps:
- Content scripts inject into existing pages
- No direct connection to Vite dev server
- Must reload extension to pick up changes

This is a limitation of Chrome's extension architecture, not our setup.

## Debugging

### Check if Extension is Loaded

1. Open `chrome://extensions/`
2. Find "Rollbar Like a Pro"
3. Check for errors under the extension card

### Check if Content Scripts are Running

On any Rollbar page, open browser console (F12) and look for:
```
Rollbar Like a Pro: Started observing DOM changes
Rollbar Like a Pro: Dev panel injected
```

### Dev Panel Not Appearing?

**Checklist:**
- [ ] `VITE_DEV_MODE=true` in `.env`
- [ ] Extension rebuilt after setting env var
- [ ] Extension reloaded in Chrome
- [ ] Rollbar page refreshed
- [ ] Check browser console for errors

**Manual check:**
```javascript
// In browser console on Rollbar page
document.querySelector('#rollbar-pro-dev-panel')
// Should return: <div id="rollbar-pro-dev-panel">
```

### Common Issues

**"Cannot read property of undefined"**
- Usually means React components trying to access DOM before it's ready
- Check MutationObserver is working
- Verify Rollbar's DOM structure hasn't changed

**"Rollbar access token is undefined"**
- `.env` file not loaded
- Variable not prefixed with `VITE_`
- Need to rebuild: `yarn build`

**Extension loads but nothing happens**
- Check you're on `app.rollbar.com` (not `rollbar.com`)
- Open console for errors
- Verify content scripts in manifest match build output

## Testing in Rollbar

### Preset Dropdown Testing

1. Navigate to any Rollbar item with errors
2. Click "Resolve" button
3. Modal opens with comment textarea
4. Preset dropdown should appear below textarea
5. Select a preset → populates textarea + copies to clipboard

### Placeholder Testing

Add a preset with placeholders:
```
JID #{request.params.jid} completed successfully.
```

Requirements:
- The Rollbar error page must contain "jid" followed by a value
- Example: "jid: 12345" or "jid 12345"
- The preset will only appear if the value is found

### Edit Modal Testing

1. Click pencil icon next to Presets dropdown
2. Modal opens with current presets (one per line)
3. Add/edit/remove lines
4. Click "Save" → presets update
5. Click "Cancel" → changes discarded

## Using the Dev Panel

### Error Types Explained

**🔴 Manual Error**
- Simple error via `rollbar.error()`
- Good for testing basic reporting

**💥 Uncaught Error**
- Throws an error in a setTimeout
- Tests ErrorBoundary doesn't catch it
- Should appear as "uncaught exception" in Rollbar

**⚠️ Promise Rejection**
- Unhandled promise rejection
- Tests async error handling
- Should appear as "unhandled promise rejection"

**📋 Error with Context**
- Includes custom data (simulated JID, user ID)
- Good for testing Rollbar's context features
- Check "Occurrences" tab in Rollbar for custom data

**⚡ Warning / ℹ️ Info**
- Non-error severity levels
- Tests different Rollbar log levels

### Viewing Errors in Rollbar

1. Trigger an error via dev panel
2. Go to Rollbar dashboard: `https://app.rollbar.com/a/YOUR_SLUG/items/`
3. Look for recent items
4. Click to see full error details
5. Check "Custom Data" section for extension context

## Browser Console Tips

### Useful Commands

```javascript
// Check if extension is loaded
chrome.runtime.id

// Check localStorage presets
localStorage.getItem('rollbar-pro-presets')

// Clear presets (reset to defaults)
localStorage.removeItem('rollbar-pro-presets')

// Check Rollbar instance
// (Only works if you expose it - we don't by default)
```

### Console Logs to Watch For

**Good signs:**
```
Rollbar Like a Pro: Started observing DOM changes
Rollbar Like a Pro: Dev panel injected
Rollbar Like a Pro: Injected preset dropdown
Preset copied to clipboard: ...
```

**Warning signs:**
```
Failed to load presets from localStorage: ...
Failed to copy to clipboard: ...
Failed to save presets: ...
```

## Playwright (E2E Tests)

**Not needed for manual testing!** Playwright is for automated testing later.

When we write e2e tests, they will:
- Launch Chrome with the extension pre-loaded
- Navigate to Rollbar automatically
- Interact with the extension programmatically
- Assert expected behaviour

For now, focus on manual testing with the dev panel.

## Performance Tips

### Build Time

**Slow TypeScript compilation?**
```bash
# Skip type checking during development
yarn vite build --watch
```

**Faster rebuilds:**
- Use `yarn dev` and keep it running
- Only reload extension when testing

### Bundle Size

Check bundle size:
```bash
yarn build
ls -lh dist/
```

Current sizes:
- `content.js`: ~6KB (presets feature)
- `content-dev-panel.js`: ~4KB (dev tools)
- `index.js`: ~240KB (React + Rollbar SDK)

The large `index.js` is shared between both content scripts, so actual overhead is acceptable for a dev tool.

## Next Steps

Once manual testing works:
1. ✅ Verify dev panel appears
2. ✅ Test error reporting to Rollbar
3. ✅ Test preset selection and editing
4. ✅ Test placeholder replacement
5. 🚧 Write Playwright e2e tests
6. 🚧 Set up CI/CD pipeline
7. 🚧 Consider Chrome Web Store publication
