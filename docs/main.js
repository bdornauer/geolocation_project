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
var uniIcon = L.icon({
    iconUrl: "./uniIcon.png",
    iconSize: [70, 50], // size of the icon
    iconAnchor: [35, 25], // point of the icon which will correspond to marker's location
});

var markerOptions = {
    title: "Uni Innsbruck",
    clickable: true,
    draggable: true,
    icon: uniIcon,
};

const marker = L.marker([47.2646390193732, 11.343621890834664], markerOptions).addTo(map);
marker.bindPopup("Hi welcome to Uni Innsbruck").openPopup();

let pointsOfInterest = [];
for (let i = 0; i < 5; i++) {
    x = Math.random() / 10;
    y = Math.random() / 10;
    const marker = L.marker([center[0] + x, center[1] + y], markerOptions).addTo(map);
    pointsOfInterest.push(marker);
    console.log(pointsOfInterest[i]);
}

//Second marker - with your position
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    var crd = pos.coords;
    const maker2 = L.marker([crd.latitude, crd.longitude]).addTo(map);
    maker2.bindPopup("Here I am").openPopup();
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

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