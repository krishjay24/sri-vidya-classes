import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { resolveSeoEnvironment } from './scripts/seo-environment.mjs'
export default defineConfig(({mode})=>({
 plugins:[react(),tailwindcss()],
 define:{__SEO_CONFIG__:JSON.stringify(resolveSeoEnvironment({...loadEnv(mode,process.cwd(),''),...process.env}))},
 build:{reportCompressedSize:true},
}))

