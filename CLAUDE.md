# Rollbar Like a Pro - Project Context

## Project Purpose

A Chrome browser extension that enhances the developer experience with Rollbar by:
- Providing quick-access preset comments when resolving Rollbar items
- Supporting dynamic placeholders (e.g., `#{jid}` → actual job ID from page)
- Allowing users to customise presets via an in-page modal
- Automatically copying selected comments to clipboard

**Target users:** Developers who frequently triage and resolve Rollbar errors and need to add consistent, informative comments.

## Current State (v2.0 - Fresh Rewrite)

### Tech Stack
- **Runtime:** Chrome Extension (Manifest V3)
- **Framework:** React 18 with TypeScript
- **Build System:** Vite with custom Chrome extension plugin
- **Styling:** Tailwind CSS (isolated via Shadow DOM)
- **State Management:** React Context + hooks
- **Error Tracking:** Rollbar React SDK (dogfooding enabled)
- **Storage:** localStorage for preset persistence
- **Testing:** Playwright (infrastructure ready, tests pending)

### Architecture
- **Shadow DOM Isolation:** React app mounted in Shadow DOM for complete style encapsulation
- **Content Script:** `content.tsx` watches for Rollbar modal, injects React app
- **Component Structure:**
  - `App.tsx` - Root with Rollbar Provider + ErrorBoundary
  - `PresetsDropdown.tsx` - Preset selector with dynamic placeholder resolution
  - `EditPresetsModal.tsx` - Inline preset editor
  - `PresetContext.tsx` - State management with localStorage sync
- **Placeholder Engine:** `lib/placeholders.ts` parses page content for dynamic values
- **Build Output:** Single `content.js` bundle (~245KB) + manifest in `dist/`

### Key Files
```
src/
├── components/          # React components
├── contexts/           # State management
├── lib/                # Utilities (Shadow DOM, placeholders, Rollbar)
├── styles/             # Tailwind CSS
├── types.ts            # TypeScript definitions
├── App.tsx             # Main app
└── content.tsx         # Entry point
```

### Infrastructure
- ESLint + Prettier configured
- TypeScript strict mode enabled
- Conventional commits enforced
- Vite watch mode for rapid development
- Shadow DOM prevents Rollbar CSS conflicts

## Resolved Issues

### ✅ v1 Preset Bug Fixed
The original jQuery version had issues setting presets properly. The React rewrite:
- Uses proper React event dispatch (`input` + `change` events with `bubbles: true`)
- Directly manipulates Rollbar's textarea with native DOM APIs
- More reliable clipboard integration via modern Clipboard API

### ✅ Architecture Concerns Addressed
- Moved from jQuery to React + TypeScript for type safety and maintainability
- Added Vite for fast builds and HMR
- Shadow DOM prevents style conflicts
- Rollbar SDK integration for dogfooding (extension reports its own errors)

## Outstanding Tasks

### Testing
1. **E2E tests with Playwright**
   - Playwright is installed but tests not yet written
   - Need to create test scenarios for:
     - Modal detection and injection
     - Preset selection and textarea population
     - Placeholder replacement
     - Edit modal save/cancel
     - localStorage persistence

2. **Test Rollbar account setup**
   - Free Rollbar account created (project: `rollbar-like-a-pro`)
   - Access token: `c4b07386f40d433ba6a95d03b25b74a5`
   - Need to create reproducible test errors with known parameters (e.g., JID values)
   - Consider seeding test data for deterministic e2e tests

## Architecture Decision: React + TypeScript ✅

**Decision made:** Went with React + TypeScript rewrite

### Why This Approach Won
1. **Type Safety:** TypeScript catches errors at compile time, reducing runtime bugs
2. **Maintainability:** Component-based architecture scales better than jQuery spaghetti
3. **Testability:** React Testing Library + Playwright provide comprehensive test coverage
4. **Dogfooding:** Rollbar React SDK allows the extension to report its own errors
5. **Modern DX:** Vite's HMR makes development rapid, ESLint/Prettier enforce consistency
6. **Style Isolation:** Shadow DOM + Tailwind gives us both pragmatism and encapsulation

### Trade-offs Accepted
- **Bundle size:** 245KB (vs ~170 lines of jQuery), but acceptable for a dev tool
- **Build step:** Adds complexity, but Vite makes it painless
- **Dependency maintenance:** More packages to keep updated, but worth it for stability

### Shadow DOM + Tailwind Hybrid
We achieved both isolation and pragmatism:
- Shadow DOM creates a style boundary (Rollbar's CSS can't affect us)
- Our own Tailwind stylesheet loaded inside the shadow root
- Zero CSS conflicts while maintaining familiar utility classes

## Testing Strategy

### E2E Testing
- **Framework:** Playwright (has excellent Chrome extension support)
- **Test scenarios:**
  - Preset injection when resolve modal opens
  - Placeholder replacement (requires test page with known values)
  - Preset editing and persistence
  - Clipboard copying

### Test Environment Setup
- Create free Rollbar account specifically for testing
- Set up project with reproducible errors containing known parameters
- Consider recording test data (HAR files) for offline testing
- Mock localStorage in tests

## Development Workflow

### Local Testing
1. Clone repo
2. Navigate to `chrome://extensions/`
3. Enable Developer mode
4. Load unpacked extension
5. Visit Rollbar test account
6. Reload extension after changes

### Current Gaps
- No linting (consider ESLint or Biome)
- No formatting (consider Prettier or Biome)
- No git hooks for quality checks
- No CI/CD pipeline

## Developer Tools

### Dev Mode Panel
A floating developer panel for testing and debugging:
- **Activation:** Set `VITE_DEV_MODE=true` in `.env`
- **Location:** Collapsible panel on left side of Rollbar pages
- **Purpose:** Trigger test errors to verify Rollbar integration

**Test scenarios available:**
- Manual errors (simple error reporting)
- Uncaught errors (simulates runtime exceptions)
- Promise rejections (async error handling)
- Errors with context (includes custom data like JID)
- Warnings and info messages

**Use cases:**
- Verify extension is reporting to Rollbar correctly
- Test error handling and ErrorBoundary
- Generate test data for placeholder testing
- Debug Rollbar SDK integration

### Environment Variables
See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for:
- Rollbar access token configuration
- Dev mode setup
- Playwright test credentials
- Security considerations

## Future Considerations

### Features
- Export/import presets (JSON)
- Preset categories or tags
- Keyboard shortcuts for common actions
- Support for markdown in presets
- Statistics on most-used presets
- Configurable dev panel position

### Distribution
- Consider Chrome Web Store publication once stable
- Would require privacy policy and potentially review process
- Currently intended for developer mode installation only

## Code Style Preferences

Since this is a TypeScript/React shop:
- Follow Sandy Metz principles (small functions, single responsibility)
- Prefer composition over inheritance
- Use dependency injection for testability
- Write self-documenting code (minimal comments)
- Favour readability over cleverness

## Notes for Claude

- This is a utility project, not production software - pragmatism over perfectionism
- The user has deep experience, no need to over-explain fundamentals
- Use British English spellings
- When suggesting commits, use conventional commit format, no co-author trailers
- Focus on solving the immediate preset bug before considering rewrites
