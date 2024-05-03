import { useEffect, useState, FC  } from 'react';
import { Footer, AvatarDropdown, AvatarName } from '@/components';
import { ProLayout } from '@ant-design/pro-layout';
import { ProConfigProvider } from '@ant-design/pro-provider';
import { useLocation, Outlet ,useNavigate } from 'react-router-dom';

import { getMenuList } from '@/services/admin/system/basic'
import fixMenuItemIcon from '@/utils/fixMenuItemIcon';

import useStore from '@/stores'

import Settings from '~/config/defaultSettings'
import logoSvg from '@/assets/images/logo.svg'

const BasicLayout: FC = () => {
    const [ pathname, setPathname ] = useState(window.location.pathname)
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = useStore(state=>state.currentUser);
    
    useEffect(() => {
        setPathname(location.pathname)
    }, [location.pathname])


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
                menuHeaderRender = {undefined}
                menuItemRender={(item, dom) => (
                    <div
                        onClick={() => {
                            setPathname(item.path || '/');
                        }}
                    >
                        {dom}
                    </div>
                )}
                menuProps={{
                    onClick: ({ key }) => {
                        navigate(key || '/')
                    }
                }}
                footerRender={() => <Footer />}
                {...Settings}
            >
                <div
                    style={{
                        height: '100vh',
                        minHeight: 800,
                    }}
                >
                    <Outlet />
                </div>
            </ProLayout>
        </ProConfigProvider>
    )
}

export default BasicLayout