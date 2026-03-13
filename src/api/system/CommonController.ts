import request from '@/utils/request';

/**
 * 登录
 * @param params
 */
export async function login(params: any = {}){
    return request.post('/oauth/login',params)
}

/**
 * 退出
 */
export async function logout(){
    return request.get('/oauth/logout')
}


/**
 * 获取当前用户菜单列表
 */
export async function getMenuList() {
    return request.get('/getMenuList');
}


/**
 * 上传图片文件
 * @param params
 */
export async function uploadImageFile(params: any = {}) {
    return request.post('/upload/imageFiles', params);
}
