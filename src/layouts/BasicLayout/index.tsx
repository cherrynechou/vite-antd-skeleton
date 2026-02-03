import { FC } from "react";
import { Layout } from "antd";
import {useGlobalStore} from "@/stores";
import SideMenu from "@/layouts/SideMenu";
import HeaderRender from "@/layouts/HeaderRender";
import AnimatedOutlet from "@/layouts/AnimatedOutlet";
import FooterRender from "@/layouts/FooterRender";

const { Content } = Layout;

const BasicLayout : FC = ()=>{
    const themeConfig = useGlobalStore(state => state.themeConfig);


    return (
        <Layout
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                background: themeConfig.background,
                transition: 'background 0.3s ease-in-out',
            }}
        >
            <SideMenu/>
            <Layout>
               <HeaderRender/>
                <Content style={{padding: themeConfig.bodyPadding}}>
                    <AnimatedOutlet />
                </Content>
                <FooterRender />
            </Layout>
        </Layout>
    )
}

export default BasicLayout;