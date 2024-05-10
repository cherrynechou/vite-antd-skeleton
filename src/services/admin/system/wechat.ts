import request from "@/utils/request";

//微信自定义菜单
export function queryDiyMenus() {
  return request.get('/wechat/diyMenus');
}

/**
 * 创建菜单
 * @param params
 */
export function createDiyMenu(params: any = {}) {
  return request.post('/wechat/diyMenus', params);
}

/**
 * 获取当前菜单
 * @param id
 */
export function getDiyMenu(id: number) {
  return request.get(`/wechat/diyMenus/${id}`);
}

/**
 * 删除菜单
 * @param id
 */
export function destroyDiyMenu(id: number) {
  return request.delete(`/wechat/diyMenus/${id}`);
}

/**
 * 更新
 * @param id
 * @param params
 */
export function updateDiyMenu(id: string, params: any = {}) {
  return request.put(`/wechat/diyMenus/${id}`, params)
}


/**
 * 更新菜单是否显示
 * @param id
 */
export function switchDiyDisplayMenu(id: number){
  return request.patch(`/wechat/diyMenu/${id}/switchDisplay`);
}

/**
 * 重新发布微信菜单
 */
export function menuPublishing(){
  return request.post('/wechat/menuPublishing');
}

/************************************************************************************************/
//关键词查询
export function queryKeyword(params: any = {}) {
  return request.get('/wechat/replyKeywords',{
    params
  });
}

/**
 * 创建菜单
 * @param params
 */
export function createKeyword(params: any = {}) {
  return request.post('/wechat/replyKeywords', params);
}

/**
 * 获取当前菜单
 * @param id
 */
export function getKeyword(id: number) {
  return request.get(`/wechat/replyKeywords/${id}`);
}

/**
 * 删除菜单
 * @param id
 */
export function destroyKeyword(id: number) {
  return request.delete(`/wechat/replyKeywords/${id}`);
}

/**
 * 更新
 * @param id
 * @param params
 */
export function updateKeyword(id: string, params: any = {}) {
  return request.put(`/wechat/replyKeywords/${id}`, params)
}

/*******************************************************************/
export function queryCarousels(params: any = {}) {
  return request.get('/miniprogram/carousels',{
    params
  });
}

/**
 * 创建菜单
 * @param params
 */
export function createCarousel(params: any = {}) {
  return request.post('/miniprogram/carousels', params);
}

/**
 * 获取当前菜单
 * @param id
 */
export function getCarousel(id: number) {
  return request.get(`/miniprogram/carousels/${id}`);
}

/**
 * 删除菜单
 * @param id
 */
export function destroyCarousel(id: number) {
  return request.delete(`/miniprogram/carousels/${id}`);
}

/**
 * 更新
 * @param id
 * @param params
 */
export function updateCarousel(id: string, params: any = {}) {
  return request.put(`/miniprogram/carousels/${id}`, params)
}
