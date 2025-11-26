/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_LARK_APP_ID: string
  readonly VITE_LARK_APP_SECRET: string
  readonly VITE_LARK_REDIRECT_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
