import { locService } from '../services/loc.service.js'
const API_KEY = 'AIzaSyAopS6SI7oP3X0FuYHfJb_K8nEmU5jQbmI';

export const mapService = {
    initMap,
    addMarker,
    panTo,

}

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap');
    getLocation(lat, lng)
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            gMap.addListener("click", (mapsMouseEvent) => {
                var locName = prompt('Name?')
                getLocName(locName)
                    .then(res => {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: `Your location ${res} has been saved`,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    })
                    .catch(
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            footer: 'You should enter a name!'
                        })
                    )
                if (!locName) return
                const placeLat = mapsMouseEvent.latLng.lat()
                const placeLng = mapsMouseEvent.latLng.lng()
                const newPlace = { pos: { lat: placeLat, lng: placeLng }, name: locName }
                locService.addNewLoc(newPlace)
            })
        })
        
}

function getLocation(lat, lng) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY }`)
    .then(res => {
        console.log('res',res.config.url);
        return res.config
    }) 
}
function getLocName(name) {
    return new Promise((resolve, reject) => {
        if (name) resolve(name)
        else reject('Oops')
    })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
