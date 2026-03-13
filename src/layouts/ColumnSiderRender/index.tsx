import {FC} from "react";
import {ConfigProvider, Layout,theme} from "antd";
import {useGlobalStore} from "@/stores";
import SideMenuHeader from "./SideMenuHeader";
import MenuRender from '@/layouts/MenuRender'

const { Sider } = Layout;

const ColumnSiderRender:FC = () =>{
    const themeConfig = useGlobalStore(state => state.themeConfig);
    const collapsed = useGlobalStore(state => state.collapsed);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <ConfigProvider
            theme={{
                token: { colorTextBase: themeConfig.siderColor }
            }}
        >
            <Sider
                width={256}
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: colorBgContainer
                }}
            >
                <SideMenuHeader />
                <MenuRender />
            </Sider>
        </ConfigProvider>
    )
}

export default ColumnSiderRender;