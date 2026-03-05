import request from '@/utils/request';

/**
 * 获取菜单列表
 */
export async function queryAllConfig(params: any = {}) {
    return request.get('/config/all',{
        params
    });
}
