import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import type { ThemeConfig } from 'antd';
import { ConfigProvider,App } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs'
import './i18n'

import RouterGuard from '@/routes/routerGuard';
import { Router } from '@/routes/renderRouter';
import routes from '@/routes';

import './global.less'

const config: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
  },
};

dayjs.locale('zh-cn')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={config}
    >
      <App>
        <HashRouter>
          <RouterGuard key="guard">
            <Router routes={routes} />
          </RouterGuard>
        </HashRouter>
      </App>
    </ConfigProvider>
  </React.StrictMode>,
)
