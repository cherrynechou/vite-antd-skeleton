import { useEffect, useState, FC  } from 'react';
import { ProLayout } from '@ant-design/pro-layout';
import { ProConfigProvider } from '@ant-design/pro-provider';
import { ProCard } from '@ant-design/pro-components';
import {  useLocation, Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';

import Settings from '~/config/defaultSettings'
import logoSvg from '@/assets/images/logo.svg'


const BasicLayout: FC = (props: any) => {
    const [ pathname, setPathname ] = useState(window.location.pathname)
    const location = useLocation();

    useEffect(() => {
        setPathname(window.location.pathname)
        console.log(1);
    }, [window.location.pathname])

    return (
        <ProConfigProvider
            dark={false}
            hashed={false}
        >
            <ProLayout
                siderWidth={216}
                logo={logoSvg}
                location={{
                    pathname,
                }}
                onPageChange={() => {
                    // 如果没有登录，重定向到 login
                    // 如果没有登录，重定向到 login
                    // if ( !currentUser?.username && location.pathname !== loginPath) {
                    //     //window.location.href = loginPath;
                    // }
                }}
                menuHeaderRender = {undefined}
                footerRender={() => <Footer />}
                {...Settings}
            >
                <ProCard
                    style={{
                        height: '100vh',
                        minHeight: 800,
                    }}
                >
                    <Outlet />
                </ProCard>
            </ProLayout>
        </ProConfigProvider>
    )
}

export default BasicLayout