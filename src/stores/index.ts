import { create } from 'zustand';
import { persist, createJSONStorage  } from 'zustand/middleware';

// 类型声明
type TUserStore = {
    currentUser: {
        userid?: string,
        username?: string,
        name?: string,
        avatar?: string,
        roles?: any[];
        allPermissions?: any[]
    },
    setCurrentUser: (userInfo: any)=>void
}

const userStore = create<TUserStore>()(
    persist(
        (set) => ({
            currentUser: {} ,
            setCurrentUser:async (userInfo: any)=>{
                set({currentUser: userInfo});
            }
        }),
        {
            name: 'user-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)

export default userStore;