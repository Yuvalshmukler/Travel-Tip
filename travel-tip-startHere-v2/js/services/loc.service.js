import { storageService } from '../services/storage-service.js'
import {mapService} from '../services/map.service.js'
import { utilService } from '../services/utils.js'


export const locService = {
    getLocs,
    addNewLoc,
    getLocName,
    getAddress,
    getAddressByPos,
    removeLoc,
    renderLocations,
}

const API_GEO_KEY = 'AIzaSyAopS6SI7oP3X0FuYHfJb_K8nEmU5jQbmI'

const STORAGE_KEY = 'SavedLocs'


const locs = storageService.load(STORAGE_KEY) || []

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}
function addNewLoc(location) {
    var currAddress = getAddressByPos({ lat: location.pos.lat, lng: location.pos.lng })
        .then(function (res) { return res })
    console.log(currAddress);
    locs.push({
        id: utilService.makeId(),
        name: location.name,
        lat: location.pos.lat,
        lng: location.pos.lng,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        address: currAddress

    })
    console.log(locs);
    storageService.save(STORAGE_KEY, locs)
}

function getLocName(name) {
    return new Promise((resolve, reject) => {
        if (name) resolve(name)
        else reject('Oops')
    })
}

function getAddress() {
    const elInput = document.querySelector('.main-nav input')
    const location = elInput.value
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_GEO_KEY}`)
        .then(res => res.data.results[0].geometry.location)
}
function getAddressByPos(pos) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${API_GEO_KEY}`)
        .then(res => {
            // console.log(res.data.results[0].formatted_address);
            return res.data.results[0].formatted_address
        })
}

function removeLoc(id) {
    console.log(id);
    console.log(locs);
    var locationIdx = locs.findIndex(loc => +loc.id === +id)
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Your location ${locs[locationIdx].name} has been deleted`,
        showConfirmButton: false,
        timer: 1500
    })
    locs.splice(locationIdx,1)
    storageService.save(STORAGE_KEY, locs)
    renderLocations()
}


function renderLocations() {
    locService.getLocs()
        .then(locs => {
            var strHtml = `<table>
                        <tbody>`
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


