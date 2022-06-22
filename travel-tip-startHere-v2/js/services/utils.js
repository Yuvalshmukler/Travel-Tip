export const utilService = {
    makeId,
}

function makeId(length = 4) {
    const possible = '0123456789'
    var num = ''
    for (var i = 0; i < length; i++) {
        num += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return num
}

