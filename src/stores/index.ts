import { create } from 'zustand';
import { persist, createJSONStorage  } from 'zustand/middleware'

const userStore = create((set,get)=>{
    persist(
        (set,get)=>({
            currentUser:null,
            setCurrentUser:async (userInfo: any)=>{
                set({currentUser:userInfo});
            }
        }),{
            name: 'user-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage),
        }
    )
})


export default userStore;