/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
    dev:{
        '/api': {
            target: 'https://smartapi.ysxinyi.com/',
            changeOrigin: true,
            secure: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
    },
    test:{
        '/api': {
            target: 'https://smpartapi.ysxinyi.com/admin',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
    },
    pre: {
        '/api': {
            target: 'https://smpartapi.ysxinyi.com/admin',
            changeOrigin: true,
            rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
    }
};