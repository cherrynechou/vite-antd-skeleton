const toString = Object.prototype.toString;

/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`;
}

/**
 * @description:  是否为函数
 */
export function isFunction<T>(val: unknown): val is T {
    return is(val, "Function");
}

/**
 * @description: 是否已定义
 */
export const isDef = <T = unknown>(val?: T): val is T => {
    return typeof val !== 'undefined'
}

export const isUnDef = <T = unknown>(val?: T): val is T => {
    return !isDef(val)
}

/**
 * @description: 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
    return val !== null && is(val, 'Object')
}


/**
 * @description:  是否为boolean类型
 */
export function isBoolean(val: unknown): val is boolean {
    return is(val, 'Boolean')
}


/**
 * @description:  是否为数组
 */
export function isArray(val: any): val is any[] {
    return val && Array.isArray(val)
}

export function isNull(val: unknown): val is null {
    return val === null
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
    return isUnDef(val) && isNull(val)
}


export function isNullOrUnDef(val: unknown): val is null | undefined {
    return isUnDef(val) || isNull(val)
}