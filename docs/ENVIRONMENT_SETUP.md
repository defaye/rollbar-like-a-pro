# Environment Setup

## Configuration Files

The project uses `.env` files for configuration. These files contain sensitive information and should **never** be committed to version control.

### Setup Steps

1. **Copy the example file**
   ```bash
   cp .env.example .env
   ```

2. **Configure your Rollbar access token**
   ```env
   VITE_ROLLBAR_ACCESS_TOKEN=your_client_side_token_here
   ```

   - Get this from: https://app.rollbar.com/settings/access_tokens/
   - Use the **post_client_item** token (client-side)
   - This is safe to include in browser bundles

3. **Enable dev mode (optional)**
   ```env
   VITE_DEV_MODE=true
   ```

   This enables a floating dev panel on Rollbar pages that lets you:
   - Trigger test errors on demand
   - See errors flow into your Rollbar dashboard
   - Test different error types (manual, uncaught, promise rejections)
   - Verify the extension is reporting properly

4. **Configure Rollbar account details (for testing)**
   ```env
   ROLLBAR_ACCOUNT_SLUG=your_account_slug
   ```

   - Find this in your Rollbar URL: `https://app.rollbar.com/a/YOUR_SLUG`
   - Used for Playwright e2e tests

## Environment Variables Explained

### Bundled into Extension (VITE_ prefix)
These are included in the built extension:

- `VITE_ROLLBAR_ACCESS_TOKEN` - Client-side Rollbar token
- `VITE_DEV_MODE` - Enables developer tools panel

### Node.js Only (no prefix)
These are only available in Node.js (Playwright tests):

- `ROLLBAR_ACCOUNT_SLUG` - Your Rollbar account identifier

## Security Notes

### Client-Side Token Safety
The `VITE_ROLLBAR_ACCESS_TOKEN` is a **client-side** token:
- ✅ Safe to include in browser bundles
- ✅ Only has permissions to report errors
- ✅ Cannot access or modify Rollbar configuration
- ❌ Still shouldn't be committed to version control (for tidiness)

### GitHub OAuth Authentication
If you log into Rollbar with GitHub:
- Playwright tests will use authenticated storage state
- No need to store GitHub credentials in `.env`
- See Playwright docs: https://playwright.dev/docs/auth

## Example Configuration

```env
# Rollbar Configuration
VITE_ROLLBAR_ACCESS_TOKEN=c4b07386f40d433ba6a95d03b25b74a5

# Development Mode
VITE_DEV_MODE=true

# Playwright Testing
ROLLBAR_ACCOUNT_SLUG=d3faye
```

## Troubleshooting

### "Access token is undefined"
Make sure:
1. `.env` file exists in project root
2. Variable is prefixed with `VITE_`
3. You've rebuilt the extension: `yarn build`

### Dev panel not appearing
Check:
1. `VITE_DEV_MODE=true` in `.env`
2. Extension is reloaded in Chrome
3. You're on a Rollbar page (app.rollbar.com)

### Rollbar errors not appearing
Verify:
1. Access token is correct
2. Token has `post_client_item` permissions
3. Check browser console for Rollbar SDK errors
