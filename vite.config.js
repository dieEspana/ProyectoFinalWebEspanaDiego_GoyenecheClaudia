import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']
    })
  ],
  server: {
    port: 3000
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
})