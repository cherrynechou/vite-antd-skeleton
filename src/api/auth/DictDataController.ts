import request from '@/utils/request';

/**
 * 获取菜单列表
 */
export async function queryDictDatas(params: any = {}) {
    return request.get('/dict/datas', {
        params
    });
}

export async function getDictAllDataList(code: string) {
    return request.get(`/dict/${code}/dataList`)
}

export async function createDictData(params:any = {}){
    return request.post('/dict/datas',params);
}

export async function getDictData(id: number){
    return request.get(`/dict/datas/${id}`)
}

export async function updateDictData(id: number, params:any = {}){
    return request.put(`/dict/datas/${id}`)
}

//设置默认值
export async function setDictDataDefault(id: number, params:any = {}){
    return request.put(`/dict/setDefault/${id}`,params)
}

/**
 * 删除菜单
 * @param id
 */
export async function destroyDictData(id: number) {
    return request.delete(`/dict/datas/${id}`);
}
