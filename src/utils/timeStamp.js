export function getCorrectTime(timeStamp) {
    const date = new Date(timeStamp);
    const y = date.getFullYear(),
        m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return y + '-' + m + '-' + d + ' '  + h + ':' + min + ':' + s;
}