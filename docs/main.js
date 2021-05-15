//set Uni Innsbruck as view
let mymap = L.map('mapid').setView([47.261423214435965, 11.344921912458144], 13);

//If satellite-world (orthofoto) data needed use: https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
let url = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
//If satellite-world (orthofoto) data needed use: Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community
let atr = "Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>'"

const postion = L.tileLayer(url, {
    attribution: atr,
    maxZoom: 18,
    minZoom: 12,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiZmhrdWZzdGVpbjIwMjEiLCJhIjoiY2tvcGc3cmw2MGtyODJycGNteWh4c3VwMyJ9.H5YrvDI6niJOPC5yhdvd1g'
}).addTo(mymap);

//send boundary for map
mymap.setMaxBounds([
    [47.271441366076125, 11.306899157102984] //north west
    ,[47.242630987769274, 11.503782759092074] //south east
])

//First set marker

var uniIcon = L.icon({
    iconUrl: './uniIcon.png',
    iconSize:     [70, 50], // size of the icon
    iconAnchor:   [35,25], // point of the icon which will correspond to marker's location
});

var markerOptions = {
    title: "Uni Innsbruck",
    clickable: true,
    draggable: true,
    icon: uniIcon
}

const marker = L.marker([47.2646390193732, 11.343621890834664], markerOptions).addTo(mymap);
marker.bindPopup('Hi welcome to Uni Innsbruck').openPopup();


//Second marker - with your position
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    var crd = pos.coords;
    const maker2 = L.marker([crd.latitude, crd.longitude]).addTo(mymap);
    maker2.bindPopup('Here I am').openPopup();
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);