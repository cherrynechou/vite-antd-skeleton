import request from '@/utils/request';

/**
 * 根据分组获取配置
 */
export async function queryAllConfig(params: any = {}) {
    return request.get('/setting/group/all',{
        params
    });
}

/**
 * 获取配置组
 * @param name
 * @param params
 */
export async function updateConfigByGroup(name: string, params: any = {}) {
    return request.post(`/setting/update/${name}`,params);
}


/**
 * 获取醘置
 * @param id
 */
export async function getConfigOptions(id: number){
    return request.get(`/setting/config/options/${id}`);
}

/**
 * 更橷数据
 * @param id
 * @param params
 */
export async function updateConfigOptions(id: number,params: any = {}) {
    return request.post(`/setting/config/options/${id}/update`,params);
}