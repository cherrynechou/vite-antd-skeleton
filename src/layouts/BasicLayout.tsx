import { useEffect, useState, FC  } from 'react';
import { Footer, AvatarDropdown, AvatarName } from '@/components';
import { ProLayout } from '@ant-design/pro-layout';
import { ProConfigProvider } from '@ant-design/pro-provider';
import { ProCard } from '@ant-design/pro-components';
import {  useLocation, Outlet } from 'react-router-dom';


import Settings from '~/config/defaultSettings'
import logoSvg from '@/assets/images/logo.svg'

import useStore from '@/stores'

const loginPath = '/admin/login';

const BasicLayout: FC = (props: any) => {
    const [ pathname, setPathname ] = useState(window.location.pathname)
    const location = useLocation();
    const currentUser = useStore();

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
                avatarProps={{
                    src: "123",
                    title: <AvatarName />,
                    render: (_, avatarChildren) => {
                        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
                    },
                }}
                onPageChange={() => {
                    // 如果没有登录，重定向到 login
                    // 如果没有登录，重定向到 login
                    if ( !currentUser?.username && location.pathname !== loginPath) {
                        //window.location.href = loginPath;
                    }
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