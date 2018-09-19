import request from '@/utils/request'

export function staffList(data) {
    return request({
        url: '/auth/getEmployeeList',
        method: 'post',
        data: data
    })
}

export function staffStatus(data) {
    return request({
        url: '/auth/setEmployeeStatus',
        method: 'post',
        data: data
    })
}

export function delStaff(data) {
    return request({
        url: '/auth/delEmployee',
        method: 'post',
        data: data
    })
}

export function addStaff(data) {
    return request({
        url: '/auth/addEmployee',
        method: 'post',
        data: data
    })
}

export function editStaff(data) {
    return request({
        url: '/auth/editEmployee',
        method: 'post',
        data: data
    })
}

export function getStaff(data) {
    return request({
        url: '/auth/getEmployee',
        method: 'post',
        data: data
    })
}

export function reset(data) {
    return request({
        url: '/auth/resetPassword',
        method: 'post',
        data: data
    })
}