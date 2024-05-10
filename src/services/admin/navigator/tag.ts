import request from '@/utils/request';

/**
 * 获取供应商列表
 */
export function queryTags(params: any = {}){
  return request.get('/tags', {
    params
  });
}

export function createTag(params: any = {}){
  return request.post('/tags', params);
}

/**
 * 获取品牌
 * @param id
 */
export function getTag(id: string){
  return request.get(`/tags/${id}`);
}

/**
 * 获取所有品牌
 */
export function queryAllTags(){
  return request.get('/goodsTag/all');
}

/**
 * 更新单位
 * @param id
 * @param params
 */
export function updateTag(id: string, params: any = {}) {
  return request.put(`/tags/${id}`, params)
}

/**
 * 删除单位
 * @param id
 */
export function destroyTag(id: number){
  return request.delete(`/tags/${id}`);
}



