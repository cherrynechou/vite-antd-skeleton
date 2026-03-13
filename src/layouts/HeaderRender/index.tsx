import { FC } from 'react'
import { ConfigProvider, Layout, type ThemeConfig } from 'antd'
import { useGlobalStore } from '@/stores'
import RightContent from '@/layouts/RightContent'
import Collapse from '@/layouts/Collapse'
const { Header } = Layout;

const HeaderRender: FC = ()=> {
    const themeConfig = useGlobalStore(state => state.themeConfig);

    const theme: ThemeConfig = {
        token: { colorTextBase: themeConfig.headerColor },
        components: {
            Menu: {
                activeBarBorderWidth: 0,
                itemBg: 'transparent',
            }
        }
    }

    return (
        <ConfigProvider
            theme={theme}
        >
            <Header
                className={"flex sticky z-1 top-0 backdrop-blur-xs"}
                style={{ paddingLeft: 0,background: '#fff' }}
            >
                <Collapse />
                <div className="overflow-hidden flex-1"></div>
                <RightContent />
            </Header>
        </ConfigProvider>
    )
}


export default HeaderRender;