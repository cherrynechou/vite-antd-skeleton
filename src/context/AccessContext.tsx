import React, {createContext, useContext, useMemo, ReactNode, useState, FC} from 'react';
import useAuthUserStore from "@/stores/user";

export interface AccessInstance {
    canSeeAdmin: boolean;
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

// 创建 Context（默认值设为 null，后续用 Hook 做非空校验）
const AccessContext = createContext<AccessInstance | null>(null);

const AccessProvider:FC<AccessProviderProps> = ({ children }) => {
    // 用 useState 管理权限，支持动态更新
    const currentUser = useAuthUserStore(state => state.currentUser);

    const contextValue = useMemo(()=>({
        canSeeAdmin: currentUser && currentUser?.roles?.includes('administrator')
    }),[currentUser]);

    return (
        <AccessContext.Provider value={contextValue}>
            {children}
        </AccessContext.Provider>
    );
};

// 自定义 useAccess Hook：和 Umi 用法一致，直接调用获取权限
const useAccess = () => {
    const context = useContext(AccessContext);
    // 非空校验：如果没包裹 AccessProvider，直接报错（提示用户）
    if (!context) {
        throw new Error('useAccess 必须在 AccessProvider 内部使用');
    }
    return context;
};

const Access : FC<AccessProps> = ({ accessible, children, fallback })=>{
    return accessible ? <>{children}</> : <>{fallback}</>;
}
export {AccessProvider, useAccess, Access}