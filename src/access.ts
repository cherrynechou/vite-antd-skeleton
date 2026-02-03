import useAuthUserStore from '@/stores/user';

const initialAccess = ()=> {
    const currentUser = useAuthUserStore(state => state.currentUser);

    return {
        canAdmin: currentUser && currentUser.roles.includes('administrator'),    //是否为系统管理员
    }
}

export default initialAccess;