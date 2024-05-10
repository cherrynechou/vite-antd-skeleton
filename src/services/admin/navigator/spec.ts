import request from '@/utils/request';

/**
 * 获取供应商列表
 */
export function querySpecs(params: any = {}){
  return request.get('/specs', {
    params
  });
}

export function createSpec(params: any = {}){
  return request.post('/specs', params);
}

/**
 * 获取品牌
 * @param id
 */
export function getSpec(id: number | string){
  return request.get(`/specs/${id}`);
}

/**
 * 获取所有品牌
 */
export function queryAllSpecs(){
  return request.get('/goodsSpec/all');
}

/**
 * 更新单位
 * @param id
 * @param params
 */
export function updateSpec(id: string, params: any = {}) {
  return request.put(`/specs/${id}`, params)
}

/**
 * 删除单位
 * @param id
 */
export function destroySpec(id: number){
  return request.delete(`/specs/${id}`);
}

/******************************************************************************************************/
//属性值列表
export function getSpecValues(specId: number | string | undefined, params: any = {}){
  return request.get(`/spec/${specId}/values`,{
    params
  })
}

/**
 * 创建
 * @param specId
 * @param params
 */
export function createSpecValue(specId: number | string, params: any = {}){
  return request.post(`/spec/${specId}/values`, params);
}

/**
 * 获取
 * @param id
 */
export function getSpecValue(id: number | string){
  return request.get(`/spec/values/${id}`)
}

/**
 * 更新
 * @param id
 * @param params
 */
export function updateSpecValue(id: number, params: any = {}) {
  return request.put(`/spec/values/${id}`, params)
}


/**
 * 删除单位
 * @param id
 */
export function destroySpecValue(id: number){
  return request.delete(`/spec/values/${id}`);
}

