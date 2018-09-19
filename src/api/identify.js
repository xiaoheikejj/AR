import request from '@/utils/request'

export function identifyList(data) {
    return request({
        url: '/ar/identifyList',
        method: 'post',
        data: data
    })
}

export function addIdentify(data) {
    return request ({
        url: '/ar/addIdentify',
        method: 'post',
        data: data
    })
}

export function identifyStatus(data) {
    return request({
        url: '/ar/setIdentifyStatus',
        method: 'post',
        data: data
    })
}

export function delIdentify(data) {
    return request({
        url: '/ar/delIdentify',
        method: 'post',
        data: data
    })
}

export function findIdentify(data) {
    return request({
        url: '/ar/findIdentify',
        method: 'post',
        data: data
    })
}

export function getIdenfityGrade(data) {
    return request({
        url: '/ar/getIdentifyGrade',
        method: 'post',
        data: data
    })
}

export function identifySimilar(data) {
    return request({
        url: '/ar/getIdentifySimilar',
        method: 'post',
        data: data
    })
}

export function editIdentify(data) {
    return request({
        url: '/ar/editIdentify',
        method: 'post',
        data: data
    })
}