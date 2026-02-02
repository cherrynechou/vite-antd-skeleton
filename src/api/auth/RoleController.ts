import request from '@/utils/request';

/**
 * 角色 分页列表
 * @param params
 */
export function queryRoles(params: any = {}) {
    return request.get('/auth/roles', {
        params,
    });
}

/**
 * 添加角色
 * @param params
 */
export function createRole(params: any = {}) {
    return request.post('/auth/roles', params);
}

/**
 * 查询角色信息
 * @param id
 */
export function getRoleById(roleId: string) {
    return request.get('/auth/roles/' + roleId);
}