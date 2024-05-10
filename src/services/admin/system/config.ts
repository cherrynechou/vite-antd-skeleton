import request from "@/utils/request";

/**
 * 获取配置组
 * @param name
 */
export function getConfigByGroup(name: string) {
  return request.get(`/config/groups/${name}`);
}

/**
 * 保存数据
 */
export function updateConfigValues(name: string,params: any = {}) {
  return request.post(`/config/update/${name}`,params)
}
