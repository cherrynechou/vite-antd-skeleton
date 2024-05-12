import { useEffect, useState, FC  } from 'react';
import { Footer, AvatarDropdown, AvatarName } from '@/components';
import { ProLayout } from '@ant-design/pro-layout';
import { ProConfigProvider } from '@ant-design/pro-provider';
import { useTranslation } from 'react-i18next';
import { useLocation, Outlet ,useNavigate } from 'react-router-dom';

import { getMenuList } from '@/services/admin/system/basic'
import fixMenuItemIcon from '@/utils/fixMenuItemIcon';

import useStore from '@/stores'

import { loginPath } from '@/constants/pages';

import Settings from '~/config/defaultSettings'
import logoSvg from '@/assets/images/logo.svg'
import localforage from 'localforage';
import { cloneDeep } from 'lodash-es';



const BasicLayout: FC = () => {
    const [ pathname, setPathname ] = useState(window.location.pathname)
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const currentUser = useStore(state=>state.currentUser);
    
    useEffect(() => {
        setPathname(location.pathname)
    }, [location.pathname])
    
    
    /**
     * 处理菜单国际化
     * @param routerData
     */
    const generateRoutes = (
      routerData: any[]
    ) =>{
        const resultRouter: any[] = cloneDeep(routerData);
        
        const formatRouter = (routerData: any)=>{
            routerData.forEach((item: any)=>{
                if(item['children']){
                    formatRouter(item['children'])
                }else{
                    item.name = t(item.locale);
                }
            })
        }
        
        formatRouter(resultRouter);
        return resultRouter;
    }


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
                        return fixMenuItemIcon( generateRoutes(menuData.data));
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
                onPageChange={async()=>{
                    const accessToken = await localforage.getItem('access_token');
                    if(!currentUser?.name && !accessToken && location.pathname!== loginPath ){
                        navigate(loginPath);
                    }
                }}
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