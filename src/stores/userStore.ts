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
  hasLogin: boolean,
  setCurrentUser: (userInfo: any)=>void
}

const userStore = create<TUserStore>()(
  persist(
    (set) => ({
      currentUser: {} ,
      hasLogin: false,
      setCurrentUser:async (userInfo: any)=>{
        set({hasLogin: true});
        set({currentUser: userInfo});
      }
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize: (state)=>({
        currentUser: state.currentUser,
      })
    },
  ),
)

export default userStore;