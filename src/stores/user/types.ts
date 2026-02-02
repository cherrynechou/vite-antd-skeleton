export interface AuthUserStoreState {
    currentUser: any,
    initialized: boolean,
}

export interface AuthUserStoreActions{
    userId: () => number,
    login: (credentials: any) => Promise<void>,
    logout: () => Promise<void>,
    fetchCurrentUser: () => Promise<void>,
}

export type AuthUserStore = AuthUserStoreState & AuthUserStoreActions;