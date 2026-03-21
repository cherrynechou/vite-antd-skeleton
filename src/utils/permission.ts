export const ALL_PERMISSION = '*:*:*';

export function matchPermission(permissions: string[] | undefined, value: any): boolean {
    if (!permissions || permissions.length === 0) return false;

    if (typeof value === 'string') {
        return matchPerm(permissions, value);
    }
    return matchPerms(permissions, value);
}


export function matchPerm(permissions: string[], checkValue: string) {
    if (!checkValue || checkValue.length === 0) return false;

    // 检查是否拥有所有权限
    if (permissions.includes(ALL_PERMISSION)) return true;

    return permissions.includes(checkValue);
}

// /**
//  * 字符权限校验
//  * @param {Array} value 校验值
//  * @returns {Boolean}
//  */
export function matchPerms(permissions: string[], checkValues: string[]) {
    if (!checkValues || checkValues.length === 0) return false;

    // 检查是否拥有所有权限
    if (permissions.includes(ALL_PERMISSION)) return true;

    // 检查是否拥有所需的所有权限
    return checkValues.every(permission => permissions.includes(permission));
}

