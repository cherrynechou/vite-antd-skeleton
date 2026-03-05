import request from '@/utils/request';


/**
 * 获取配置分组列表
 */
export async function queryGroups(params: any = {}) {
    return request.get('/auth/config/groups',{
        params
    });
}

export async function createGroup(params:any = {}){
    return request.post('/auth/config/groups',params)
}

export async function getGroup(id: number){
    return request.get(`/auth/config/groups/${id}`)
}

export async function updateGroup(id: number, params:any = {}){
    return request.put(`/auth/config/groups/${id}`,params)
}

/**
 * 删除菜单
 * @param id
 */
export async function destroyGroup(id: number) {
    return request.delete(`/auth/config/groups/${id}`);
}
