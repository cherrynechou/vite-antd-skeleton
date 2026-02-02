import request from '@/utils/request';


/**
 * 获取权限树型列表
 */
export function queryPermissions() {
    return request.get('/auth/permissions');
}
