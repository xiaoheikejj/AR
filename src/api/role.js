import request from '@/utils/request'

export function roleList(data) {
    return request({
        url: '/auth/getRoleList',
        method: 'post',
        data: data
    })
}

export function roleStatus(data) {
    return request({
        url: '/auth/setRoleStatus',
        method: 'post',
        data: data
    })
}

export function delRole(data) {
    return request({
        url: '/auth/delRole',
        method: 'post',
        data: data
    })
}

export function getResource(data) {
    return request({
        url: '/auth/getResource',
        method: 'post',
        data: data
    })
}

export function addRole(data) {
    return request({
        url: '/auth/addRole',
        method: 'post',
        data: data
    })
}

export function getRole(data) {
    return request({
        url: '/auth/getRole',
        method: 'post',
        data: data
    })
}

export function editRole(data) {
    return request({
        url: '/auth/editRole',
        method: 'post',
        data: data
    })
}

export function getCompanyInfo(data) {
    return request({
        url: '/auth/getCompanyInfo',
        method: 'post',
        data: data
    })
}

export function editCompanyInfo(data) {
    return request({
        url: '/auth/editCompanyInfo',
        method: 'post',
        data: data
    })
}