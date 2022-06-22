import { storageService } from '../services/storage-service.js'
import { utilService } from '../services/utils.js'


export const locService = {
    getLocs,
    addNewLoc,
}

const STORAGE_KEY = 'SavedLocs'


const locs = storageService.load(STORAGE_KEY) || []

function getLocs() {
    console.log(locs);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function addNewLoc(location) {
    locs.push({
        id: utilService.makeId(),
        name: location.name,
        lat: location.pos.lat,
        lng: location.pos.lng,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    })
    console.log(locs);
    storageService.save(STORAGE_KEY, locs)
}


