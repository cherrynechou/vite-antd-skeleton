import { ReactNode } from 'react'


/**
 * AccessContext 上下文值的类型（包含所有认证状态、方法、权限对象）
 */
export interface AccessContextValueProp {
    // 认证状态
    access: {}
}

export interface AccessComponentProp {
    accessible: boolean | ((access: any) => boolean); // 权限判断条件,
    children: ReactNode,
    fallback?: ReactNode
}

