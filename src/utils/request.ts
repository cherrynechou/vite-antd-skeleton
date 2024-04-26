import axios, { AxiosInstance,AxiosResponse ,AxiosError, AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";

const request: AxiosInstance = axios.create(<{
    baseURL: any
    timeout: number
    headers: any
}>{
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json'
    }
});



// Add a request interceptor
request.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    return config;

},  (error: AxiosError) => {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
request.interceptors.response.use( (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    if(response.status === 200){
        return response.data;
    }

    return Promise.reject(response?.data);

},  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error


    return Promise.reject(error);
});


export default request;