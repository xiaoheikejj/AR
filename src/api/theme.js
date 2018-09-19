import request from '@/utils/request'

export function themeList(data) {
    return request({
        url: '/ar/themeList',
        method: 'post',
        data: data
    })
}

export function newTheme(data) {
    return request({
        url: '/ar/addTheme',
        method: 'post',
        data: data
    })
}

export function getTheme(data) {
    return request({
        url: '/ar/getTheme',
        method: 'post',
        data: data
    })
}

export function editTheme(data) {
    return request({
        url: '/ar/editTheme',
        method: 'post',
        data: data
    })
}

export function deleteTheme(data) {
    return request({
        url: '/ar/delTheme',
        method: 'post',
        data: data
    })
}

export function themeStatus(data) {
    return request({
        url: '/ar/setThemeStatus',
        method: 'post',
        data: data
    })
}

// 预览
export function previewTheme(data) {
    return request({
        url: '/ar/previewTheme',
        method: 'post',
        data: data
    })
}

export function getFinalUrl(data) {
    return request({
        url: '/ar/getFinalUrl',
        method: 'post',
        data: data
    })
}
