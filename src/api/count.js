import request from '@/utils/request'

export function getUserResourceInfo(data) {
    return request({
        url: '/getUserResourceInfo',
        method: 'post',
        data: data
    })
}

export function getCountResource(data) {
    return request({
        url: '/getCountResource',
        method: 'post',
        data: data
    })
}

export function argetCount(data) {
    return request({
        url: '/ar/getCount',
        method: 'post',
        data: data
    })
}

export function activitygetCount(data) {
    return request({
        url: '/activity/getCount',
        method: 'post',
        data: data
    })
}