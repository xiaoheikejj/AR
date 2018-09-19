import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 5000,
    withCredentials: true,
    transformRequest: [function(data) {
        return qs.stringify(data)
    }]
})

service.interceptors.response.use(response => {
    //存code验证路由跳转是不是-100
    sessionStorage.setItem("code", response.data.code);
    return response.data;
}, error => {
    console.log(`err${error}`)
    Message({
        message: '请求超时，请重新登录',
        type: 'error',
        duration: 5 * 1000
    })
    sessionStorage.setItem("overtime", -100);
    return Promise.reject(error)
})


export default service