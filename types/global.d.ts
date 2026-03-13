import { ReactNode } from 'react'

declare global {

    // 通用权限规则类型：支持布尔值/带参函数（和Umi一致）
    export interface AccessState {
        canSeeAdmin: boolean;
        hasPermissions: (permission: string) => boolean;
    }

    export interface AccessInstance {
        access: AccessState;
    }

    // 权限 Provider 组件：包裹根组件，注入全局权限
    export interface AccessProviderProps {
        children: ReactNode;
    }

    export interface AccessProps {
        accessible: boolean,
        fallback: ReactNode
        children: ReactNode;
    }
}
