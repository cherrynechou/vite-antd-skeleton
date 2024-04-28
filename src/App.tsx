import { routes } from '@/routes/routes';
import dayjs from 'dayjs'
import type { ThemeConfig } from 'antd';
import {  useRoutes } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import RouterGuard from '@/routes/RouterGuard';
import { ConfigProvider } from 'antd';

import './global.less'

const config: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
  },
};

dayjs.locale('zh-cn')

function App() {
  return (
      <ConfigProvider
          locale={zhCN}
          theme={config}
      >
          <RouterGuard key="guard">
              {useRoutes(routes)}
          </RouterGuard>
    </ConfigProvider>
  )
}

export default App
