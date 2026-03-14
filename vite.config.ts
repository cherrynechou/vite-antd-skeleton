import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode })=>{
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      babel({
        presets: [reactCompilerPreset()]
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
      port: Number(env.VITE_API_PORT) || 8080, // 自定义端口
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
      // 将警告阈值从500KB提高到1500KB
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        // https://rollupjs.org/guide/en/#big-list-of-options
        output: {
          codeSplitting: {
            minSize: 20000,
            groups: [
              {
                name: 'vendor',
                test: /node_modules/,
              },
            ],
          },
        },
      },
      // 其他构建配置
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false, // 生产环境通常关闭sourcemap
    }
  }
})
