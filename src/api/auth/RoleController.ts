import request from '@/utils/request';

/**
 * 角色 分页列表
 * @param params
 */
export async function queryRoles(params: any = {}) {
    return request.get('/auth/roles', {
        params,
    });
}

/**
 * 添加角色
 * @param params
 */
export async function createRole(params: any = {}) {
    return request.post('/auth/roles', params);
}

/**
 * 查询角色信息
 * @param roleId
 */
export async function getRoleById(roleId: string | number) {
    return request.get('/auth/roles/' + roleId);
}

/**
 * 查询角色权限
 * @param id
 */
export async function getPermissionIdsByRoleId(id: string | number) {
    return request.get(`/role/${id}/permissions`);
}

/**
 * 更新角色权限
 * @param id
 * @param params
 */
export async function updatePermissionByRoleId(id: string | number, params: any = {}) {
    return request.put(`/role/${id}/permissions`,params);
}


/**
 * 更新角色
 * @param id
 * @param params
 */
export async function updateRole(id: string | number, params: any = {}) {
    return request.put(`/auth/roles/${id}`, params);
}

/**
 * 删除角色
 * @param id
 */
export async function destroyRole(id: string | number) {
    return request.delete(`/auth/roles/${id}`);
}


/**
 * 所有角色列表
 */
export function queryAllRoles() {
    return request.get('/role/all');
}
