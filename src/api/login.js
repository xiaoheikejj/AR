import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/login',
        method: 'post',
        data: data
    })
}

export function loginPic() {
    return request({
        url: '/getImages',
        method: 'post'
    })
}

export function changePass(data) {
    return request({
        url: '/auth/changePassword',
        method: 'post',
        data: data
    })
}


export function logOut() {
    return request({
        url: '/auth/logout',
        method: 'post'
    })
}