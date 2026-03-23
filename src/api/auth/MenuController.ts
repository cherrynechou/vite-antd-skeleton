import request from '@/utils/request';

export async function queryMenus(params: any = {}) {
    return request.get('/auth/menu',{
        params
    });
}

/**
 * 创建菜单
 * @param params
 */
export async function createMenu(params: any = {}) {
    return request.post('/auth/menu', params);
}


/**
 * 获取当前菜单
 * @param id
 */
export async function getMenu(id: string | number) {
    return request.get(`/auth/menu/${id}`);
}

/**
 * 删除菜单
 * @param id
 */
export async function destroyMenu(id: string | number) {
    return request.delete(`/auth/menu/${id}`);
}

/**
 * 删除
 * @param id
 */
export async function hideMenu(id: string | number) {
    return request.put(`/menu/${id}/hide`);
}

/**
 * 显示
 * @param id
 */
export async function displayMenu(id: string | number) {
    return request.put(`/menu/${id}/display`);
}

/**
 *
 * @param id
 */
export async function switchMenu(id: string | number) {
    return request.put(`/menu/${id}/switch`);
}


/**
 * 更新
 * @param id
 * @param params
 */
export async function updateMenu(id: string | number, params: any = {}) {
    return request.put(`/auth/menu/${id}`, params);
}