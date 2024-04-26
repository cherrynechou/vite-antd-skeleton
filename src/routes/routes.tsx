import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import BasicLayout from '@/layouts/BasicLayout'
import lazyLoad from './lazyLoad'

export const routes: RouteObject[] = [
    {
        path: '/admin/login',
        element: lazyLoad(lazy(() => import('@/pages/Admin/Login')))
    }, {
        path: '/',
        element: <BasicLayout />,
        children: [
            {
                index: true,
                element: lazyLoad(lazy(() => import('@/pages/Home'))),
            },{
                path:'/dashboard',
                element: lazyLoad(lazy(()=>import('@/pages/Dashboard')))
            },{
                path: '/auth',
                children: [
                    {
                        path: '/auth/users',
                        element: lazyLoad(lazy(() => import('@/pages/Auth/User'))),
                    },{
                        path: '/auth/roles',
                        element: lazyLoad(lazy(() => import('@/pages/Auth/Role'))),
                    },{
                        path: '/auth/permissions',
                        element: lazyLoad(lazy(() => import('@/pages/Auth/Permission'))),
                    },{
                        path: '/auth/menus',
                        element: lazyLoad(lazy(() => import('@/pages/Auth/Menu'))),
                    }
                ]
            }
        ]
    },{
        path: '*',
        element: lazyLoad(lazy(() => import('@/pages/Exception/404'))),
    }
];