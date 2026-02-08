import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'
import AntdProvider from '@/components/AntdProvider';
import useAuthUserStore from '@/stores/user';
import useAuthMenuStore from '@/stores/menu';
import { routers }  from './routers'
import { AccessProvider } from '@/context'

function App() {
    const fetchCurrentUser = useAuthUserStore(state => state.fetchCurrentUser);
    const fetchMenus= useAuthMenuStore(state => state.getMenus);
    const setIsMobile = useGlobalStore(state => state.setIsMobile);

    // 移动端检测
    const mobileDetected = useMobile();

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

    // 移动端状态同步
    useEffect(() => { setIsMobile(mobileDetected) }, [mobileDetected, setIsMobile]);

    return (
        <AccessProvider>
            <AntdProvider>
                <RouterProvider router={routers} />
            </AntdProvider>
        </AccessProvider>
    )
}

export default App
