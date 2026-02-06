import request from '@/utils/request';

/**
 * 获取菜单列表
 */
export async function queryDicts(params: any = {}) {
    return request.get('/dicts',params);
}


export async function createDict(params:any = {}){
    return request.post('/dicts',params)
}

export async function getDict(id: number){
    return request.get(`/dicts/${id}`)
}

export async function updateDict(id: number, params:any = {}){
    return request.put(`/dicts/${id}`,params)
}


/**
 * 删除菜单
 * @param id
 */
export async function destroyDict(id: number) {
    return request.delete(`/dicts/${id}`);
}
