/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCK_MODE?: string;
  readonly VITE_LEARN_ARENA_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
