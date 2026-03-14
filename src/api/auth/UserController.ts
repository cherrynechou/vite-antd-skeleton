import request from '@/utils/request';

/**
 * 当前用户
 */
export async function queryCurrentUser() {
    return request.get('/currentUser');
}

/**
 * 获取用户列表
 */
export async function queryUsers(params: any = {}) {
    return request.get('/auth/users', {
        params,
    });
}

/**
 * 添加用户
 * @param params
 */
export async function createUser(params: any = {}) {
    return request.post('/auth/users', params);
}

/**
 * 当前查询用户
 * @param id
 */
export async function getUser(id: string | number) {
    return request.get(`/auth/users/${id}`);
}

/**
 * 更新用户
 * @param id
 * @param params
 */
export async function updateUser(id: string | number, params: any = {}) {
    return request.put(`/auth/users/${id}`, params);
}

/**
 * 删除用户
 * @param id
 */
export async function destroyUser(id: string | number) {
    return request.delete(`/auth/user/${id}`);
}
