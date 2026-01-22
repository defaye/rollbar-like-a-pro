/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_ROLLBAR_ACCESS_TOKEN: string;
  readonly VITE_DEV_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Support for CSS imports as inline strings
declare module '*?inline' {
  const content: string;
  export default content;
}
