import { useAsyncEffect } from 'ahooks';
import localforage from 'localforage';
import { useLocation, useNavigate  } from 'react-router-dom'
import useStore from '@/stores'
import { loginPath } from '@/constants/pages';
import { queryCurrentUser } from '@/services/admin/auth/user';

const RouterGuard = (props: any) =>{
  
  const currentUser = useStore(state=>state.currentUser);
  const setCurrentUser = useStore(state=>state.setCurrentUser);
  
  const route = useLocation();
  const navigate = useNavigate();
  
  useAsyncEffect(async()=>{
    const accessToken = await localforage.getItem('access_token');
    
    if(accessToken){
      if (route.pathname != loginPath) {
        if(!currentUser?.name){  //没有用户信息
          const userInfo = await queryCurrentUser();
          if(userInfo){
            await setCurrentUser(userInfo.data);
          }
        }
      }else{
        navigate('/',{replace:true});
      }
    }else{
      navigate(loginPath);
    }
    
  }, [route.pathname])
  
  return props.children;
}

export default RouterGuard;