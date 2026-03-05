import axios, { AxiosResponse } from 'axios';

// 扩展 AxiosResponse 接口
declare module 'axios' {
    export interface AxiosResponse<T = any> {
        data: T
        status: number
        statusText: string
        success: boolean;
    }
}