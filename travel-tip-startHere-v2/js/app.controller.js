import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onGetAddress = onGetAddress;



function onInit() {
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
    locService.getLocs()
        .then(locs => {
            var strHtml = `<table>
                        <tbody>`
            console.log(locs);
            console.log('Locations:', locs)
            locs.map(loc =>
                strHtml += `
                <tr>
                    <td class="location-name">${loc.name}</td>
                    <td class="location-Address">${loc.address}  </td>
                    <td><button onclick="onPanTo(${loc.lat},${loc.lng})" class="btn-pan">Go</button></td>
                    <td><button class="delete-place" onclick="onRemoveLoc(${loc.id})">X</button></td>
                    </td>
                </tr>
                `
            )
            strHtml += `</tbody>
            </table>`

            locs.forEach(loc => mapService.addMarker({ lat: loc.lat, lng: loc.lng }))
            document.querySelector('.location-list').innerHTML = strHtml
        })
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
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function onGetAddress(ev) {
    ev.preventDefault()
    locService.getAddress()
        .then(res => {
            // console.log(res);
            mapService.initMap(res.lat, res.lng)
        })
}