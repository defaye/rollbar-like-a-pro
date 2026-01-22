# Rollbar Like a Pro

A modern Chrome extension built with React and TypeScript that enhances your Rollbar developer experience. Add preset comments when resolving issues, with support for dynamic placeholders and customisable presets.

## Features

- ✨ **Preset Comments**: Quickly insert frequently used comments with one click
- 🔄 **Dynamic Placeholders**: Automatically replaces placeholders like `#{request.params.jid}` with actual values from the page
- ✏️ **Customisable Presets**: Edit your presets via an intuitive modal interface
- 📋 **Clipboard Integration**: Selected comments are automatically copied to your clipboard
- 💾 **Local Storage**: Your presets persist across sessions
- 🔒 **Style Isolation**: Uses Shadow DOM to prevent style conflicts with Rollbar's UI
- 🐛 **Dogfooding**: Extension reports its own errors to Rollbar for continuous improvement

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast builds and HMR
- **Tailwind CSS** for styling (isolated via Shadow DOM)
- **Rollbar React SDK** for error tracking
- Chrome Extension Manifest V3

## Installation

### For Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/defaye/rollbar-like-a-pro.git
   cd rollbar-like-a-pro
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Rollbar access token
   ```

   See [Environment Setup Guide](docs/ENVIRONMENT_SETUP.md) for details.

4. **Build the extension**
   ```bash
   yarn build
   ```

5. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right)
   - Click **Load unpacked**
   - Select the `dist/` directory from this project

6. The extension is now active on `https://app.rollbar.com/*`

### Development Mode

Enable the developer panel to test Rollbar integration:

1. Set `VITE_DEV_MODE=true` in your `.env` file
2. Rebuild: `yarn build`
3. Reload the extension in Chrome
4. Visit any Rollbar page - you'll see a floating panel on the left edge
5. Click to expand and trigger test errors

The dev panel lets you:
- 🔴 Trigger various error types (manual, uncaught, promise rejections)
- 📋 Send errors with custom context (simulates real scenarios)
- ⚡ Test warnings and info messages
- ✅ Verify errors appear in your Rollbar dashboard

### From Chrome Web Store

Coming soon (TBD).

## Development

### Available Scripts

- `yarn dev` - Build in watch mode for active development
- `yarn build` - Production build with optimisations
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn test` - Run Playwright tests (coming soon)

### Project Structure

```
src/
├── components/          # React components
│   ├── PresetsDropdown.tsx
│   └── EditPresetsModal.tsx
├── contexts/           # React Context providers
│   └── PresetContext.tsx
├── lib/                # Utilities and helpers
│   ├── shadow-root.tsx    # Shadow DOM wrapper
│   ├── placeholders.ts    # Placeholder parsing logic
│   └── rollbar-config.ts  # Rollbar SDK configuration
├── styles/             # Tailwind CSS
│   └── index.css
├── types.ts            # TypeScript types
├── App.tsx             # Main app with Rollbar provider
└── content.tsx         # Content script entry point
```

### How It Works

1. **Content Script Injection**: The extension uses a MutationObserver to detect when Rollbar's resolve modal appears
2. **Shadow DOM Mounting**: Our React app is mounted inside a Shadow DOM for complete style isolation
3. **Preset Injection**: The preset dropdown is inserted below the comment textarea
4. **Placeholder Resolution**: Placeholders like `#{request.params.jid}` are parsed from the page content and replaced with actual values
5. **State Management**: Presets are managed via React Context and persisted to localStorage

## Usage

1. Navigate to any Rollbar item at `app.rollbar.com`
2. Click the **Resolve** button to open the resolve modal
3. You'll see a **Presets** dropdown below the comment textarea
4. Select a preset to:
   - Populate the comment field
   - Copy the text to your clipboard
5. Click the **pencil icon** to edit your presets
6. Add/modify presets (one per line) and save

### Dynamic Placeholders

Use the format `#{parameter.path}` in your presets. The extension will search the page for these values:

```
JID #{request.params.jid} completed successfully.
```

If the page contains "jid: 12345", this becomes:

```
JID 12345 completed successfully.
```

Presets with unresolved placeholders are automatically hidden from the dropdown.

## Updating the Extension

### During Development

1. Make your code changes
2. Run `yarn build`
3. Go to `chrome://extensions/`
4. Click the **reload icon** on the extension card

### From Repository

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```
2. Rebuild:
   ```bash
   yarn install  # if dependencies changed
   yarn build
   ```
3. Reload the extension in Chrome

## Contributing

This project follows:
- **British English** spelling throughout
- **Conventional Commits** format
- **Sandy Metz principles** (small methods, single responsibility)
- **Prettier** for code formatting

## Roadmap

- [ ] E2E testing with Playwright
- [ ] Export/import presets (JSON)
- [ ] Preset categories or tags
- [ ] Keyboard shortcuts
- [ ] Chrome Web Store publication
- [ ] Statistics on most-used presets

## License

MIT License - See LICENSE file for details

## Credits

Built with ❤️ to make Rollbar triaging faster and more efficient.

