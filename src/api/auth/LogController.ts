import request from '@/utils/request';

export function queryOperations(params: any = {}) {
    return request.get('/auth/log/operations',{
        params
    });
}


export function queryLogin(params: any = {}) {
    return request.get('/auth/log/logins',{})
}
