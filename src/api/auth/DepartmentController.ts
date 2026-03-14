import request from '@/utils/request';

/**
 * 获取菜单列表
 */
export async function queryDepartments(params: any = {}) {
    return request.get('/auth/departments',{
        params
    });
}

/**
 * 所有部门
 */
export async function queryAllDepartments(params: any = {}) {
    return request.get('/department/all',{
        params
    });
}

/**
 * 创建部门
 * @param params
 */
export async function createDepartment(params:any = {}){
    return request.post('/auth/departments',params)
}

/**
 * 获取部门
 * @param id
 */
export async function getDepartment(id: string | number){
    return request.get(`/auth/departments/${id}`)
}

/**
 * 更新部门
 * @param id
 * @param params
 */
export async function updateDepartment(id: string | number, params:any = {}){
    return request.put(`/auth/departments/${id}`,params)
}


/**
 * 删除部门
 * @param id
 */
export async function destroyDepartment(id: string | number) {
    return request.delete(`/auth/departments/${id}`);
}
