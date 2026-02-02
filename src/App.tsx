import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import AntdProvider from '@/components/AntdProvider';
import  { routers }  from './routers'
import useAuthUserStore from '@/stores/user';
import useAuthMenuStore from '@/stores/menu';

import '@/locales/i18n'

function App() {
    const fetchCurrentUser = useAuthUserStore(state => state.fetchCurrentUser);
    const fetchMenus=useAuthMenuStore(state => state.getMenus);

    useEffect(()=>{
        if(localStorage.getItem("access_token")){
            //若出错跳过登录页
            Promise.all([
                fetchCurrentUser(),
                fetchMenus()
            ]).then(()=>{
                //console.log(menus);
            })
        }
    },[fetchCurrentUser,fetchMenus]);

    return (
        <AntdProvider>
            <RouterProvider router={routers} />
        </AntdProvider>
    )
}

export default App
