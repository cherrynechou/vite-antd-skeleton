import request from '@/utils/request';

export function queryOperations(params: any = {}) {
    return request.get('/auth/log/operations',{
        params
    });
}


export function queryLogins(params: any = {}) {
    return request.get('/auth/log/logins',{
        params
    })
}
