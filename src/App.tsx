import { RouterProvider} from 'react-router-dom'
import router from '@/routes';
import dayjs from 'dayjs'
import type { ThemeConfig } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';

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
        <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
