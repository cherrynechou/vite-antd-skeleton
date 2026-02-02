import {FC} from "react";
import {Layout} from "antd";
import SideMenu from "@/layouts/SideMenu";
import HeaderRender from "@/layouts/HeaderRender";
import {Content} from "antd/es/layout/layout";
import Footer from "@/layouts/Footer";

const BasicLayout : FC = ()=>{
    return (
        <Layout>
            <SideMenu/>
            <Layout>
               <HeaderRender/>
                <Content>
                    Content
                </Content>
                <Footer />
            </Layout>
        </Layout>
    )
}

export default BasicLayout;