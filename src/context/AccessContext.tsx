import React, {createContext, useContext, FC} from 'react';
import access from '@/access.ts'

// 创建 Context（默认值设为 null，后续用 Hook 做非空校验）
const AccessContext = createContext<AccessInstance | null>(null);

const AccessProvider:FC<AccessProviderProps> = ({
    children
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
    return context.access;
};

const Access : FC<AccessProps> = ({ accessible, children, fallback })=>{
    return accessible ? <>{children}</> : <>{fallback}</>;
}
export {AccessProvider, useAccess, Access}