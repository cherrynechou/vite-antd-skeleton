import {Navigate, redirect, RouteObject} from 'react-router-dom';
import { lazy } from 'react';
import { LazyImport }  from '@/components/LazyImport';
import { LOGIN_PATH } from '@/constants/pages';

import { ErrorBoundary } from '@ant-design/pro-components'

//中间件处理权限  只判定当前是否登录
const authMiddleware = async ()=>{
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        throw redirect(LOGIN_PATH);
    }

    return null;
}

const routeConfig: RouteObject[] = [
    {
        ErrorBoundary: ErrorBoundary,
        element: <LazyImport lazy={lazy(()=>import('@/layouts/AppLayout'))}/>,
        children:[
            {
                path: '/admin/login',
                element: <LazyImport lazy={lazy(() => import('@/pages/Admin/Login'))}/>,
                handle: {
                    titleKey: 'router.login'
                }
            },{
                path: '/',
                element:  <LazyImport lazy={lazy(()=>import('@/layouts/BasicLayout'))} />, // 🏠 All pages will be inside Layout
                loader: authMiddleware,
                children:[
                    {
                        index: true,
                        element: <Navigate to='/dashboard'/>
                    },{
                        path: '/dashboard',
                        element: <LazyImport lazy={lazy(() => import('@/pages/Dashboard'))}/>,
                        handle: {
                            titleKey: 'router.dashboard'
                        }
                    },{
                        path: '/auth',
                        children: [
                            {
                                index:true,
                                element: <Navigate to='/auth/users' />
                            }, {
                                path: '/auth/users',
                                element: <LazyImport lazy={lazy(() => import('@/pages/Auth/User'))}/>,
                                handle: {
                                    titleKey: 'router.admin.users'
                                }
                            },{
                                path: '/auth/roles',
                                element: <LazyImport lazy={lazy(() => import('@/pages/Auth/Role'))}/>,
                                handle: {
                                    titleKey: 'router.admin.roles'
                                }
                            },{
                                path: '/auth/permissions',
                                element: <LazyImport lazy={lazy(() => import('@/pages/Auth/Permission'))}/>,
                                handle: {
                                    titleKey: 'router.admin.permissions'
                                }
                            },{
                                path: '/auth/departments',
                                element: <LazyImport lazy={lazy(() => import('@/pages/Auth/Department'))}/>,
                                handle: {
                                    titleKey: 'router.admin.departments'
                                }
                            },{
                                path: '/auth/menu',
                                element: <LazyImport lazy={lazy(() => import('@/pages/Auth/Menu'))}/>,
                                handle: {
                                    titleKey: 'router.admin.menu'
                                }
                            },{
                                path: '/auth/dicts',
                                element: <LazyImport lazy={lazy(()=>import('@/pages/Auth/Dict'))}/>,
                                handle: {
                                    titleKey: 'router.admin.dict'
                                }
                            }
                        ]
                    }

                ]
            },{
                path: '*',
                element: <LazyImport lazy={lazy(()=>import('@/pages/Exception/NotFound.tsx'))}/>
            }
        ]
    }
];


export default routeConfig;
