import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer' //查看生成stats打包视图
import proxy from './config/proxy'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    }),
  ],
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
    outDir: "dist",
    //minify: "esbuild",
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
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    }
  },
}))
