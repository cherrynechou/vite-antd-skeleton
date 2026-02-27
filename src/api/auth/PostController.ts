import request from '@/utils/request';

export function queryPosts(params: any = {}) {
    return request.get('/auth/posts',{
        params
    });
}

/**
 * 创建菜单
 * @param params
 */
export function createPost(params: any = {}) {
    return request.post('/auth/posts', params);
}


/**
 * 获取当前菜单
 * @param id
 */
export function getPost(id: number) {
    return request.get(`/auth/posts/${id}`);
}

/**
 * 删除菜单
 * @param id
 */
export function destroyPost(id: number) {
    return request.delete(`/auth/posts/${id}`);
}

/**
 * 更新
 * @param id
 * @param params
 */
export function updatePost(id: string, params: any = {}) {
    return request.put(`/auth/posts/${id}`, params);
}