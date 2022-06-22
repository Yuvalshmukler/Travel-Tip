import { storageService } from '../services/storage-service.js'
import { utilService } from '../services/utils.js'


export const locService = {
    getLocs,
    addNewLoc,
    getLocName,
    getAddress,
    getAddressByPos,
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
    .then(function(res){return res})
    console.log(currAddress);
        locs.push({
        id: utilService.makeId(),
        name: location.name,
        lat: location.pos.lat,
        lng: location.pos.lng,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        address:currAddress

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


