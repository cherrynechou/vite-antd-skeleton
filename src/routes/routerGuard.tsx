import { useLocation, useNavigate  } from 'react-router-dom'
import { useAsyncEffect } from 'ahooks';
import { userStore } from '@/stores'
import { loginPath } from '@/constants/pages';
import { queryCurrentUser } from '@/services/admin/auth/user';
import localforage from 'localforage';

const RouterGuard = (props: any) =>{
  
  const hasLogin = userStore(state=>state.hasLogin);
  const setCurrentUser = userStore(state=>state.setCurrentUser);
  
  const route = useLocation();
  const navigate = useNavigate();
  
  useAsyncEffect(async()=>{
    const accessToken = await localforage.getItem('access_token');
    if(accessToken){
      if (route.pathname !== loginPath) {
        if(!hasLogin){  //没有用户信息
          try {
            const userInfo = await queryCurrentUser();
            if(userInfo){
              await setCurrentUser(userInfo.data);
            }
          }catch (error){
            navigate( loginPath, { replace: true });
          }
        }
      }
    }else{
      navigate( loginPath, { replace: true });
    }
    
  },[route.pathname, navigate])

  return (
    <>
      {props.children}
    </>
  )
}

export default RouterGuard;