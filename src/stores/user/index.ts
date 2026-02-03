import { create, type StateCreator } from 'zustand';
import type {AuthUserStore, AuthUserStoreActions, AuthUserStoreState} from "./types";
import { createJSONStorage, persist,devtools } from "zustand/middleware";
import { login } from '@/api/system/CommonController'
import { queryCurrentUser } from "@/api/auth/UserController";

const authState: AuthUserStoreState = {
    currentUser: {},
    roles: [],
    allPermissions: [],
    initialized: false,
};

const authAction: StateCreator<AuthUserStore,[],[],AuthUserStoreActions> = (set,get)=>({
    userId: () => get().currentUser.id,
    login: async (credentials: any) => {
        const { data } = await login(credentials);
        localStorage.setItem("access_token", data!.access_token);
        set({initialized: true})
    },
    logout: async () => {
        set(authState);
    },
    fetchCurrentUser:async () =>{
        const result = await queryCurrentUser();
        const data = result.data!;

        set({
            currentUser: data,
            roles: data.roles,
            allPermissions: data.allPermissions,
        })
    }
})

const useAuthUserStore = create<AuthUserStore>()(
    devtools(
        persist(
            (...args)=>({
                ...authState,
                ...authAction(...args),
            }),{
                name: 'auth-user-storage',
                storage: createJSONStorage(()=>localStorage)
            }
        ),
        {name: 'auth-user-store'}
    )
)

export type { AuthUserStoreActions, AuthUserStoreState }
export default useAuthUserStore;