import request from '@/utils/request'

export function getPersonal(data) {
    return request({
        url: '/memberCenter/view',
        method: 'post',
        data: data
    })
}

export function editPersonal(data) {
    return request({
        url: '/memberCenter/edit',
        method: 'post',
        data: data
    })
}

export function changePass(data) {
    return request({
        url: '/memberCenter/changePass',
        method: 'post',
        data: data
    })
}