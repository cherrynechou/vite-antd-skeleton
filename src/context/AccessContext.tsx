import React, { createContext, useContext, useMemo, ReactNode, useState } from 'react';

// 定义权限配置的类型（支持 布尔值 / 带参数的判断函数）
export type AccessObj = Record<
    string,
    boolean | ((...args: any[]) => boolean)
>;

// 新增：定义初始权限的类型 - 支持【对象】或【返回对象的无参函数】
export type InitialAccess = AccessObj | (() => AccessObj);

// 定义 Context 的值类型：包含权限对象 + 动态更新权限的方法
type AccessContextType = {
    access: AccessObj;
    setAccess: (newAccess: AccessObj) => void;
};

// 创建 Context（默认值设为 null，后续用 Hook 做非空校验）
const AccessContext = createContext<AccessContextType | null>(null);

// 权限 Provider 组件：包裹根组件，注入全局权限
interface AccessProviderProps {
    children: ReactNode;
    // 初始权限配置（外部传入，比如从接口获取、从本地存储读取）
    initialAccess: InitialAccess;
}

const AccessProvider = ({
   children,
   initialAccess,
}: AccessProviderProps) => {
    // 用 useState 管理权限，支持动态更新
    const [access, setAccess] = useState<AccessObj>(initialAccess);

    // 缓存 Context 值，避免子组件不必要重渲染
    const contextValue = useMemo<AccessContextType>(() => ({
        access, setAccess
    }), [access]);

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
    return context.access;
};


export {AccessProvider,useAccess}

