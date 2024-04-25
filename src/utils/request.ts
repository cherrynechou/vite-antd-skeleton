import axios, {AxiosInstance,AxiosResponse ,AxiosError, InternalAxiosRequestConfig } from "axios";

const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

// Add a request interceptor
request.interceptors.request.use(function (config: InternalAxiosRequestConfig) {
    // Do something before request is sent
    return config;
}, function (error: AxiosError) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use(function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error: AxiosError) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});


export default request;