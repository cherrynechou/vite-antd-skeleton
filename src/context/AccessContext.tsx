import React, {createContext, useContext, useMemo, ReactNode, FC} from 'react';

export interface AccessInstance {
    access: AccessState;
}
// 通用权限规则类型：支持布尔值/带参函数（和Umi一致）
export type AccessRule = boolean | ((...args: any[]) => boolean);
export type AccessState = Record<string, AccessRule>;

// 权限 Provider 组件：包裹根组件，注入全局权限
export interface AccessProviderProps {
    children: ReactNode;
    access: () => AccessState; // access.ts导出的默认函数
}

export interface AccessProps {
    accessible: boolean,
    fallback: ReactNode
    children: ReactNode;
}

// 创建 Context（默认值设为 null，后续用 Hook 做非空校验）
const AccessContext = createContext<AccessInstance | null>(null);

const AccessProvider:FC<AccessProviderProps> = ({
    children ,
    access
}) => {
    const accessRules = access();
    return (
        <AccessContext.Provider value={{ access: accessRules }}>
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