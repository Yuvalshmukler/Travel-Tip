export const utilService = {
    makeId,
    setQueryStringParams,
}

function makeId(length = 4) {
    const possible = '0123456789'
    var num = ''
    for (var i = 0; i < length; i++) {
        num += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return num
}

function setQueryStringParams(location){
    const queryStringParams = `?lat=${location.lat}&lng=${location.lng}`
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

