import request from '@/utils/request';

/**
 * 获取菜单列表
 */
export async function queryDepartments(params: any = {}) {
    return request.get('/auth/departments',{
        params
    });
}


export async function createDepartment(params:any = {}){
    return request.post('/auth/departments',params)
}

export async function getDepartment(id: number){
    return request.get(`/auth/departments/${id}`)
}

export async function updateDepartment(id: number, params:any = {}){
    return request.put(`/auth/departments/${id}`,params)
}


/**
 * 删除菜单
 * @param id
 */
export async function destroyDepartment(id: number) {
    return request.delete(`/auth/departments/${id}`);
}

/**
 * 所有部门
 */
export async function queryAllDepartments() {
    return request.get('/department/all');
}