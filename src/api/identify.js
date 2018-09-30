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

export function addLbs(data) {
    return request({
        url: 'lbs/addLbs',
        method: 'post',
        data: data
    })
}

export function editLbs(data) {
    return request({
        url: 'lbs/editLbs',
        method: 'post',
        data: data
    })
}

export function findLbs(data) {
    return request({
        url: 'lbs/findLbs',
        method: 'post',
        data: data
    })
}

export function lbsList(data) {
    return request({
        url: 'lbs/lbsList',
        method: 'post',
        data: data
    })
}

export function setLbsStatus(data) {
    return request({
        url: 'lbs/setLbsStatus',
        method: 'post',
        data: data
    })
}

export function delLbs(data) {
    return request({
        url: 'lbs/delLbs',
        method: 'post',
        data: data
    })
}