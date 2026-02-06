export function matchPermission(permissions: string[] | undefined, value: any): boolean {
    if (permissions === undefined) return false;
    const type = typeof value;
    if (type === 'string') {
        return matchPerm(permissions, value);
    }
    return matchPerms(permissions, value);
}


export function matchPerm(permissions: string[], checkValue: string) {
    if (checkValue && checkValue.length > 0) {
        const all_permission = '[]';
        return permissions.some((permission) => {
            return all_permission === permission || checkValue === permission;
        });

    }
    return false;
}

// /**
//  * 字符权限校验
//  * @param {Array} value 校验值
//  * @returns {Boolean}
//  */
export function matchPerms(permissions: string[], checkValues: string[]) {
    if (checkValues && checkValues.length > 0) {
        const all_permission = '[]';
        return permissions.some((permission) => {
            return all_permission === permission || checkValues.includes(permission);
        });

    }
    return false;
}

