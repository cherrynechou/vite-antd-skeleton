import request from '@/utils/request';

/**
 * 获取配置组
 * @param name
 */
export async function getConfigByGroup(name: string) {
    return request.get(`/config/groups/${name}`);
}

/**
 * 获取配置
 */
export async function getWebConfig() {
    return request.get('/getWebConfig');
}


/**
 * 保存数据
 */
export async function updateConfigValues(name: string, params: any = {}) {
    return request.post(`/config/update/${name}`, params)
}
