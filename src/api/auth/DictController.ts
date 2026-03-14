import request from '@/utils/request';

/**
 * 获取菜单列表
 */
export async function queryDicts(params: any = {}) {
    return request.get('/auth/dicts',{
        params
    });
}


export async function createDict(params:any = {}){
    return request.post('/auth/dicts',params)
}

export async function getDict(id: string | number){
    return request.get(`/auth/dicts/${id}`)
}

export async function updateDict(id: string | number, params:any = {}){
    return request.put(`/auth/dicts/${id}`,params)
}


/**
 * 删除菜单
 * @param id
 */
export async function destroyDict(id: string | number) {
    return request.delete(`/auth/dicts/${id}`);
}
