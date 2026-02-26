import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode })=>{
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      tailwindcss()
    ],
    resolve: {
      alias:  [
        { find: '@', replacement: path.resolve(__dirname, 'src')},
        { find: '~', replacement: path.resolve(__dirname, '')},
      ]
    },
    server: {
      host: '0.0.0.0', // 默认是 localhost
      port: parseInt(env.VITE_API_PORT) || 8080, // 自定义端口
      strictPort:false, // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
      open: false, // 启动后是否浏览器自动打开
      hmr:true, // 为开发服务启用热更新，默认是不启用热更新的
      proxy: {
        "/api": {
          target: env.VITE_API_HOST, // easymock
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        }
      }
    },
    build: {
      outDir: 'dist',
      minify: 'terser',
      terserOptions:{
        compress:{
          drop_console: true,             // Remove console.*
          drop_debugger: true,           // Remove debugger
          pure_funcs: ['console.log'], // Remove specific functions
        },
        format: {
          comments: false,         // Remove comments
        },
        mangle: {
          toplevel: true,          // Mangle top-level names
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            utils: ['lodash', 'axios']
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        }
      }
    }
  }
})