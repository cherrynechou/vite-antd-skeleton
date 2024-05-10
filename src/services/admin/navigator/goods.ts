import request from '@/utils/request';

/**
 * 获取供应商列表
 */
export function queryGoods(params: any = {}){
  return request.get('/goods', {
    params
  });
}

export function createGoods(params: any = {}){
  return request.post('/goods', params);
}

/**
 * 获取品牌
 * @param id
 */
export function getGoods(id: number | string){
  return request.get(`/goods/${id}`);
}

/**
 * 获取所有品牌
 */
export function queryAllGoods(){
  return request.get('/goods/all');
}

/**
 * 更新单位
 * @param id
 * @param params
 */
export function updateGoods(id: number | string | undefined, params: any = {}) {
  return request.put(`/goods/${id}`, params)
}

/**
 * 删除单位
 * @param id
 */
export function destroyGoods(id: number){
  return request.delete(`/goods/${id}`);
}



