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
  },
  build: {
    outDir: 'dist',
    //minify: 'esbuild',
    // esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        //每个node_modules模块分成一个js文件
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  }
}))
