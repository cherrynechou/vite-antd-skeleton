import request from '@/utils/request';

/**
 * 获取菜单列表
 */
export async function queryDictDatas(params: any = {}) {
    return request.get('/auth/dict/datas', {
        params
    });
}

export async function getDictAllDataList(code: string) {
    return request.get(`/auth/dict/${code}/dataList`)
}

export async function createDictData(params:any = {}){
    return request.post('/auth/dict/datas',params);
}

export async function getDictData(id: number){
    return request.get(`/auth/dict/datas/${id}`)
}

export async function updateDictData(id: number, params:any = {}){
    return request.put(`/auth/dict/datas/${id}`)
}

//设置默认值
export async function setDictDataDefault(id: number, params:any = {}){
    return request.put(`/auth/dict/setDefault/${id}`,params)
}

/**
 * 删除菜单
 * @param id
 */
export async function destroyDictData(id: number) {
    return request.delete(`/auth/dict/datas/${id}`);
}
