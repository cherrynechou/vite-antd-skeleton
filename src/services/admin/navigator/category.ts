import request from '@/utils/request';

/**
 * 获取供应商列表
 */
export function queryCategories(params: any = {}){
  return request.get('/goodsCategories', {
    params
  });
}

export function createCategory(params: any = {}){
  return request.post('/goodsCategories', params);
}

/**
 * 获取品牌
 * @param id
 */
export function getCategory(id: string){
  return request.get(`/goodsCategories/${id}`);
}

/**
 * 获取所有品牌
 */
export function queryAllCategories(){
  return request.get('/goodsCategory/all');
}

/**
 * 更新单位
 * @param id
 * @param params
 */
export function updateCategory(id: string, params: any = {}) {
  return request.put(`/goodsCategories/${id}`, params)
}

/**
 * 删除单位
 * @param id
 */
export function destroyCategory(id: number){
  return request.delete(`/goodsCategories/${id}`);
}



