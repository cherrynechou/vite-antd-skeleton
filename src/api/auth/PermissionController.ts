import request from '@/utils/request';


/**
 * 获取权限树型列表
 */
export async function queryPermissions(params: any = {}) {
    return request.get('/auth/permissions',{
        params
    });
}

/**
 * 查询当前权限
 * @param id
 */
export async function queryPermission(id: string | number) {
    return request.get(`/auth/permissions/${id}`);
}

/**
 * 创建权限
 * @param params
 */
export async function createPermission(params: any = {}) {
    return request.post('/auth/permissions', params);
}

/**
 * 更新权限
 * @param id
 * @param params
 */
export async function updatePermission(id: string | number, params: any = {}) {
    return request.put(`/auth/permissions/${id}`, params);
}

/**
 * 删除权限
 * @param id
 */
export async function destroyPermission(id: string | number) {
    return request.delete(`/auth/permissions/${id}`);
}

/**
 * 生成权限列表
 */
export async function queryAllPermissions() {
    return request.get('/permission/all');
}

/**
 * 获取权限路由
 */
export async function queryAllPermissionRoutes() {
    return request.get('/permission/routes');
}
