import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import proxy from './config/proxy'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias:  [
      { find: '@', replacement: path.resolve(__dirname, 'src')},
      { find: '~', replacement: path.resolve(__dirname, '')},
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
    proxy: proxy[mode]
  }
}))
