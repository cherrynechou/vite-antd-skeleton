import {type PropsWithChildren, useMemo} from 'react';
import ContextHolder from "@/components/ContextHolder";
import {App, ConfigProvider, ThemeConfig} from "antd";
import {useGlobalStore} from "@/stores";
import dayjs from 'dayjs'


dayjs.locale('zh-cn')

const AppProvider = ({ children }: PropsWithChildren) => {
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const theme: ThemeConfig = useMemo(() => ({
        token: {
            colorPrimary: '#1890ff',
        }
    }),[themeConfig])


    return (
        <ConfigProvider theme={{...theme}}>
            <App>
                <ContextHolder />
                {children}
            </App>
        </ConfigProvider>
    );
};

export default AppProvider;