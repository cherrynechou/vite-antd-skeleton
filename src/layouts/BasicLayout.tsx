import { useEffect, useState, FC  } from 'react';
import { Footer, AvatarDropdown, AvatarName } from '@/components';
import { ProLayout } from '@ant-design/pro-layout';
import { ProConfigProvider } from '@ant-design/pro-provider';
import { ProCard } from '@ant-design/pro-components';
import { useLocation,matchRoutes, Outlet ,useNavigate} from 'react-router-dom';
import { routes } from '@/routes/routes';
import { loginPath } from '@/constants/pages'
import { getMenuList } from '@/services/admin/system/basic'
import fixMenuItemIcon from '@/utils/fixMenuItemIcon';

import useStore from '@/stores'

import Settings from '~/config/defaultSettings'
import logoSvg from '@/assets/images/logo.svg'

const BasicLayout: FC = () => {
    const [ pathname, setPathname ] = useState(window.location.pathname)
    const location = useLocation();
    const navigate = useNavigate();
    const matchRoute = matchRoutes(routes, location)
    const currentUser = useStore(state=>state.currentUser);
    
    useEffect(() => {
        setPathname(window.location.pathname)
    }, [window.location.pathname])


    return (
        <ProConfigProvider dark={false} hashed={false}>
            <ProLayout
                siderWidth={216}
                logo={logoSvg}
                location={{
                    pathname,
                }}
                menu={{
                    params: {
                        username: currentUser?.username,
                    },
                    request: async () => {
                        const menuData = await getMenuList();
                        return fixMenuItemIcon(menuData.data);
                    },
                }}
                avatarProps={{
                    title: <AvatarName />,
                    size: 'small',
                    src: currentUser?.avatar,
                    render: (_, avatarChildren) => {
                        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
                    },
                }}
                onPageChange={() => {
                    // 如果没有登录，重定向到 login
                    // 如果没有登录，重定向到 login
                    console.log(currentUser)
                    if ( !currentUser?.username && location.pathname !== loginPath) {
                        //window.location.href = loginPath;
                    }
                }}
                menuHeaderRender = {undefined}
                menuProps={{
                    onClick: ({ key }) => {
                        navigate(key || '/')
                    }
                }}
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