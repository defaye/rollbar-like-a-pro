# Rollbar Like a Pro

Rollbar Like a Pro is a Chrome extension designed to enhance your experience with Rollbar. It offers custom preset comments for resolving Rollbar items, along with the ability to modify and manage these presets directly in the UI. It also allows placeholders for dynamic parameters like job IDs.

## Features

- **Preset Comments**: Easily insert frequently used comments with one click.
- **Dynamic Placeholders**: Automatically replaces placeholders with real-time values (e.g., `JID`) from the page.
- **Customisable Presets**: Modify your preset comments via an easy-to-use UI.
- **Clipboard Copying**: Selected comments are automatically copied to your clipboard.
- **Local Storage**: Your presets are stored locally and persist across sessions.

## Installation

### From GitHub (For Developers)

1. Clone this repository:
  ```bash
  git clone https://github.com/defaye/rollbar-like-a-pro.git
  ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable Developer mode in the top-right corner.
4. Click on **Load unpacked** and select the directory where you cloned this repository.

The extension should now be active. It will automatically apply to Rollbar when visiting `https://app.rollbar.com/*`.

### From the Chrome Web Store (Coming Soon)

The extension may be available on the Chrome Web Store for easy installation in the future. (TBD).

## Usage

1. Navigate to a Rollbar item on `app.rollbar.com`.
2. Once inside a Rollbar item, open the comment box.
3. A **Presets** dropdown will appear, where you can select predefined comments, including dynamic parameters such as Job IDs if present.
4. You can modify the presets by clicking the pencil icon next to the dropdown.
5. Select a preset, and the comment will be populated into the comment box. The selected text will also be copied to your clipboard.

## Updating the Extension

To update the extension with the latest changes:

1. Pull the latest changes from the GitHub repository:
  ```bash
  git pull origin main
  ```
2. Navigate to `chrome://extensions/` in Chrome.
3. Click the **Reload** button on the Rollbar Like a Pro extension to load the latest changes.

## Customising Presets

1. Click on the pencil icon next to the **Presets** dropdown.
2. A modal will appear where you can edit your presets, one per line.
3. Save the changes, and your updated presets will be reflected in the dropdown.

## License

This project is licensed under the MIT License.

