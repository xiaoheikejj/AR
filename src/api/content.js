import request from '@/utils/request'

export function contentList(data) {
    return request({
        url: '/ar/contentList',
        method: 'post',
        data: data
    })
}

export function addContent(data) {
    return request({
        url: '/ar/addContent',
        method: 'post',
        data: data
    })
}

export function delContent(data) {
    return request({
        url: '/ar/delContent',
        method: 'post',
        data: data
    })
}

export function editContent(data) {
    return request({
        url: '/ar/editContent',
        method: 'post',
        data: data
    })
}

export function contentStatus(data) {
    return request({
        url: '/ar/setContentStatus',
        method: 'post',
        data: data
    })
}

//修改获取
export function getContent(data) {
    return request({
        url: '/ar/getContent',
        method: 'post',
        data: data
    })
}

export function getDick(data) {
    return request({
        url: '/auth/getDick',
        method: 'post',
        data: data
    })
}
