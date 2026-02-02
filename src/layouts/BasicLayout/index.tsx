import {FC} from "react";
import {Layout} from "antd";
import SideMenu from "@/layouts/SideMenu";
import HeaderRender from "@/layouts/HeaderRender";
import Footer from "@/layouts/Footer";
import AnimatedOutlet from "@/layouts/AnimatedOutlet";

const BasicLayout : FC = ()=>{
    return (
        <Layout>
            <SideMenu/>
            <Layout>
               <HeaderRender/>
                <Content>
                    <AnimatedOutlet />
                </Content>
                <Footer />
            </Layout>
        </Layout>
    )
}

export default BasicLayout;