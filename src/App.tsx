import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import AntdProvider from '@/components/AntdProvider';
import useAuthUserStore from '@/stores/user';
import useAuthMenuStore from '@/stores/menu';
import { routers }  from './routers'
import { AccessProvider } from '@/context'
import access from './access'

function App() {
    const fetchCurrentUser = useAuthUserStore(state => state.fetchCurrentUser);
    const fetchMenus= useAuthMenuStore(state => state.getMenus);

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
        <AccessProvider access={access}>
            <AntdProvider>
                <RouterProvider router={routers} />
            </AntdProvider>
        </AccessProvider>
    )
}

export default App
