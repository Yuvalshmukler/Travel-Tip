import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGetAddress = onGetAddress;
window.onRemoveLoc = onRemoveLoc;
window.onCopyLocation = onCopyLocation;
window.renderByStringParam = renderByStringParams;
window.copyToClipboard = copyToClipboard;



function onInit() {
    renderByStringParams()
    onGetLocs()
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onCopyLocation() {

}

function onAddMarker() {
    locService.getAddress()
        .then(res => mapService.addMarker(res))
        .catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: 'You should look for a Place!'
            })
        })
}

function onGetLocs() {
    locService.renderLocations()
}

function renderByStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)


    const locationBy = {
        lat: +queryStringParams.get('lat') || 0,
        lng: +queryStringParams.get('lng') || 0,
    }
    mapService.initMap(locationBy.lat, locationBy.lng)
    // copyToClipboard(`https://yuvalshmukler.github.io/Travel-tip?lat=${locationBy.lat}&lng=${locationBy.lng}`)

}

function copyToClipboard(text) {
    console.log(text);
    if (window.clipboardData) { // Internet Explorer
        window.clipboardData.setData("Text", text);
    } else {
        unsafeWindow.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
        clipboardHelper.copyString(text);
    }
}


function onGetUserPos() {
    getPosition()
        .then(pos => {
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            mapService.initMap(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo(lat, lng) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}

function onRemoveLoc(id) {
    console.log(id);
    locService.removeLoc(id)
}

function onGetAddress(ev) {
    ev.preventDefault()
    locService.getAddress()
        .then(res => {
            // console.log(res);
            mapService.initMap(res.lat, res.lng)
        })
}