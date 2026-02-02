import { FC } from 'react'
import { Button, ConfigProvider, Layout, type ThemeConfig } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { useGlobalStore } from '@/stores'
import RightContent from '@/layouts/RightContent';
const {Header} = Layout;

const HeaderRender: FC = ()=> {
    const collapsed = useGlobalStore(state => state.collapsed);
    const setCollapsed = useGlobalStore(state => state.setCollapsed);
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
                <div className="flex items-center relative">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </div>
                <div className="overflow-hidden flex-1"></div>
                <RightContent />
            </Header>
        </ConfigProvider>
    )
}


export default HeaderRender;