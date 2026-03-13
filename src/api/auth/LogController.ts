import request from '@/utils/request';

export async function queryOperations(params: any = {}) {
    return request.get('/auth/log/operations',{
        params
    });
}


export async function queryLogins(params: any = {}) {
    return request.get('/auth/log/logins',{
        params
    })
}
