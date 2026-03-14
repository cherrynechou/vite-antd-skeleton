import request from '@/utils/request';

/**
 * 获取配置分组列表
 */
export async function queryConfigDatas(params: any = {}) {
    return request.get('/auth/config/datas',{
        params
    });
}

export async function createConfigData(params:any = {}){
    return request.post('/auth/config/datas',params)
}

export async function getConfigData(id: string | number){
    return request.get(`/auth/config/datas/${id}`)
}

export async function updateConfigData(id: string | number, params:any = {}){
    return request.put(`/auth/config/datas/${id}`,params)
}

/**
 * 删除菜单
 * @param id
 */
export async function destroyConfigData(id: string | number) {
    return request.delete(`/auth/config/datas/${id}`);
}
