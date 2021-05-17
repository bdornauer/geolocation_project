//set FH Kufstein as view
const boundaries = [
    [47.584724, 12.171843],
    [47.583015, 12.174],
];

const center = [47.5839578, 12.1733215];

const map = L.map("map", {
    maxBounds: boundaries,
    center: center,
    minZoom: 17,
    maxZoom: 18,
}).fitBounds(boundaries);


// let url = "./maps/{z}/{y}/{x}.jpeg";

// const postion = L.tileLayer(url).addTo(map);

//If satellite-world (orthofoto) data needed use: https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
let url = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
//If satellite-world (orthofoto) data needed use: Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community
let atr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>\'';

const postion = L.tileLayer(url, {
    attribution: atr,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoiZmhrdWZzdGVpbjIwMjEiLCJhIjoiY2tvcGc3cmw2MGtyODJycGNteWh4c3VwMyJ9.H5YrvDI6niJOPC5yhdvd1g",
}).addTo(map);

//First set marker
const visitedIcon = L.icon({
    iconUrl: "./flag_green.png",
    iconSize: [16, 16], // size of the icon
    iconAnchor: [4, 15], // point of the icon which will correspond to marker's location
});

const unvisitedIcon = L.icon({
    iconUrl: "./flag_red.png",
    iconSize: [16, 16],
    iconAnchor: [4, 15]
});

const locationIcon = L.icon({
    iconUrl: "./location.png",
    iconSize: [16, 16],
    iconAnchor: [8, 15]
});

const pointsOfInterest = [
    [47.584040, 12.173309], [47.583690, 12.173462], [47.583403, 12.173129], [47.583989, 12.172339], [47.583620, 12.172893]
];

const poiMarkers = [];

function negOrPos() {
    if (Math.random() < 0.5)
        return (-1)
    return (1);
}

// for (let i = 0; i < 5; i++) {
//     x = Math.random() * negOrPos() / 1000;
//     y = Math.random() * negOrPos() / 1000;
//     const randPos = [center[0] + x, center[1] + y];
//     const marker = L.marker(randPos, {icon: unvisitedIcon}).addTo(map);
//     poiMarkers.push(marker);
// }

pointsOfInterest.map((poiPos, index) => {
    const marker = L.marker(poiPos, {icon: unvisitedIcon}).addTo(map).bindPopup('You are X meters away');
    poiMarkers.push(marker);
});

const marker2 = L.marker(center, {icon: locationIcon}).addTo(map);
marker2.bindPopup("Here I am").openPopup();

let count = 0;
const history = [];
let polyline;

function success(pos) {
    const crd = [pos.coords.latitude, pos.coords.longitude]; // my current position
    //const crd = pointsOfInterest[count]; // simulated path
    history.push(crd);
    marker2.setLatLng(crd);

    if (history.length == 1) {
        polyline = L.polyline([crd], {color: 'red'}).addTo(map);
    } else {
        polyline.addLatLng(crd);
    }

    poiMarkers.map((poiMarker) => {
        const poiPos = [poiMarker._latlng.lat, poiMarker._latlng.lng];

        let distance = distanceInMeters(crd[0], crd[1], poiPos[0], poiPos[1]);
        poiMarker._popup.setContent(`You are ${Math.round(distance)} meters away!`);

        if (distance <= 5) {
            poiMarker.setIcon(visitedIcon);
        }
    });

    // required for simulated path
    // if (count < 4) {
    //     count++;
    // } 
    // else {
    //     count = 0;
    // }
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

navigator.geolocation.watchPosition(success, error, options);


// Haversine formula for distance calculation (https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates)
//                                            (http://www.movable-type.co.uk/scripts/latlong.html)

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Haversine formula
function distanceInMeters(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000; // in m

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
}


// PWA install prompt
let pwaPrompt;
const prompt = document.querySelector("#pwa-install-prompt");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    pwaPrompt = e;
    prompt.classList.add("show");
});

prompt.addEventListener("click", function (event) {
    if (event.target.dataset.id === "pwa-install-y" && pwaPrompt) {
        pwaPrompt.prompt();
        pwaPrompt.userChoice.then(() => {
            prompt.classList.remove("show");
            pwaPrompt = null;
        });
    } else {
        prompt.classList.remove("show");
    }
});