import axios, {
    AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig, HttpStatusCode
} from 'axios';

import {LOGIN_PATH} from '@/constants/pages';

const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    },
    // 允许携带凭证
    withCredentials: false,
});

/**
 * 获取凭证
 */
const getAccessToken = async () =>{
    const access_token =  localStorage.getItem('access_token');

    if (!access_token) {
        return '';
    }

    return `Bearer ${access_token}`;
}

const handleNetworkError = async (errStatus?: number): Promise<void> => {
    // 401 未授权 - 需要特殊处理，清除认证信息并跳转登录
    if (errStatus === 401) {
        // 清除本地存储的认证信息
        // 避免在登录页重复跳转
        if (window.location.pathname !== LOGIN_PATH) {
            window.location.href = LOGIN_PATH;
        }

        return;
    }
}


// Add a request interceptor
request.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const accessToken = await getAccessToken();

    // 自动附加国际化语言到请求头
    const currentLanguage = localStorage.getItem('i18nextLng');
    if (currentLanguage) {
        config.headers['Accept-Language'] = currentLanguage;
    }

    if(accessToken && config && config?.headers){
        config.headers.Authorization = accessToken;
    }

    //删除属性值 为空 或者 undefined
    if(config.data){
        Object.keys(config.data).forEach((val: string) => {
            if( config.data[val] === null || config.data[val] === undefined){
                delete config.data[val]
            }
        });
    }

    return config;

},  async (error: AxiosError) => {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use( (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    //console.log(response);

    if(response.status === HttpStatusCode.Ok){
        return response.data;
    }

    return Promise.reject(response.data);

},  async (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 请求被取消（去重或手动取消）

    if (axios.isCancel(error)) {
        return Promise.reject(error);
    }

    if (error.response) {
        await handleNetworkError(error.response.status);
        return Promise.reject(error.response);
    }

    return Promise.reject(error);
});



export default request;