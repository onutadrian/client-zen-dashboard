/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_TASK_LIST_V2?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
