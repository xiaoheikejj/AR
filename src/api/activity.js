import request from '@/utils/request'

export function activityList(data) {
    return request({
        url: '/activity/activityList',
        method: 'post',
        data: data
    })
}

export function getActivity(data) {
    return request({
        url: '/activity/getActivity',
        method: 'post',
        data: data
    })
}

export function setActivityStatus(data) {
    return request({
        url: '/activity/setActivityStatus',
        method: 'post',
        data: data
    })
}

export function delActivity(data) {
    return request({
        url: '/activity/delActivity',
        method: 'post',
        data: data
    })
}

export function addActivity(data) {
    return request({
        url: '/activity/addActivity',
        method: 'post',
        data: data
    })
}

//九宫格配置列表
export function activityIdentifyList(data) {
    return request({
        url: '/activity/activityIdentifyList',
        method: 'post',
        data: data
    })
}

export function getActivityIdentify(data) {
    return request({
        url: '/activity/getActivityIdentify',
        method: 'post',
        data: data
    })
}

export function editActivityIdentify(data) {
    return request({
        url: '/activity/editActivityIdentify',
        method: 'post',
        data: data
    })
}

export function previewActivity(data) {
    return request({
        url: '/activity/previewActivity',
        method: 'post',
        data: data
    })
}

export function getFinalUrl(data) {
    return request({
        url: '/activity/getFinalUrl',
        method: 'post',
        data: data
    })
}

export function editActivity(data) {
    return request({
        url: '/activity/editActivity',
        method: 'post',
        data: data
    })
}