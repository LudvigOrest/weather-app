//Objekt
let weatherObject = {
    location:"place",
    lat: 0,
    lon: 0,
    weather:"weather",
    timezone:"timezone",
    pressure: 0,
    humidity: 0,
    wind: 0,
};
let loadTime = 100;


//Main
setInterval(update, 3000);
setInterval(clock, 1000);

//if-sats som läser av väder-objektets väder och väljer passande animation.
animateClouds();
setInterval(animateClouds, 5000);



//Funktioner
function onResponseLatLon(data) {
    console.log(data);
    weatherObject.lat = onResponseGetLat(data);
    weatherObject.lon = onResponseGetLon(data);
    weatherObject.location = data[0].name;
}

function onResponse(data) {
    console.log(data);
    weatherObject.weather = data.weather[0].main;
    weatherObject.timezone = data.timezone;
    weatherObject.pressure = data.main.pressure;
    weatherObject.humidity = data.main.humidity;
    weatherObject.wind = data.wind.speed;
}

function onResponseGetLat(data) {
    let lat = data[0].lat;
    console.log(data[0].lat);
    return lat;
}

function onResponseGetLon(data) {
    let lon = data[0].lon;
    console.log(data[0].lon);
    return lon;
}

function fetchWeather(lat, lon) {
    lat = Math.round(lat);
    lon = Math.round(lon);
    console.log(lat + " " + lon);
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat.toString() + "&lon=" + lon.toString() + "&appid=ce9b7d88aacd197397a8ce2a5d277490")
    .then((response) => response.json())
    .then(onResponse);
}

function fetchLocation(location) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&limit=5&appid=ce9b7d88aacd197397a8ce2a5d277490")
    .then((response) => response.json())
    .then(onResponseLatLon);
}

function getUserInput() {
    let userInput =  document.getElementById("input-box");
    let userValue = userInput.value;
    console.log(userValue);
    return userValue;
}

function updateLocationTime() {
    let locationText = document.getElementById("location-h1");
    locationText.innerHTML = "";
    locationText.innerText = weatherObject.location;
}

function clock() {
    let offset = UTCOffset();
    let date = new Date();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let sec = date.getSeconds();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    let htmlClock = document.getElementById("clock");
    htmlClock.innerHTML = day + "/" + month + "/" + year + "  " + hour + ":" + minutes + ":" + sec;

    console.log(calculateUTC(28800));
    
}

function calculateUTC(utc) {
    utc = Number(utc);
    var h = Math.floor(utc / 3600);
    var m = Math.floor(utc % 3600 / 60);
    var s = Math.floor(utc % 3600 % 60);
    return h + m + s; 
}

//Klientens UTC-tidsskillnad i timmar
function UTCOffset() {
    var offset = (new Date().getTimezoneOffset()/60) * -1;
    console.log(offset);
}

// + 28800 sec BEIJING
// + 7200 sec MALMÖ
// UTC + 0 = current - malmö

function update() {
    let input = getUserInput();
    let lastInput = "";

    if (input != "" || input != lastInput) {
        console.log("new search");
        lastInput = input;

        fetchLocation(input);
        fetchWeather(weatherObject.lat, weatherObject.lon);
        console.log(weatherObject);
        setTimeout(updateLocationTime, loadTime);
        setTimeout(updateBoxValues, 500);
    }
}

function updateBoxValues() {
    let pressure = document.getElementById("pressure");
    pressure.innerHTML = weatherObject.pressure + " mbar";

    let humidity = document.getElementById("humidity");
    humidity.innerHTML = weatherObject.humidity + " %";

    let windSpeed = document.getElementById("wind-speed");
    windSpeed.innerHTML = weatherObject.wind + " m/s"
}

function rng(min, max) {
    return Math.floor((Math.random() * max) + min);
}

//Animations-funktioner
function windyClouds(x, y) {
    let main = document.getElementById("main-content")
    let cloud = document.createElement("div");
    cloud.style.right = x;
    cloud.style.top = y;
    cloud.classList.add("cloud");
    main.appendChild(cloud);
}

function createClouds() {
        let x = rng(0, 1200);
        let y = rng(30, 600);
        windyClouds(x, y);
}

function animateClouds() {

    let cloudAmount = rng(4, 7);

    for( let i = 0; i <= cloudAmount; i++) {
        let delay = rng(0, 4000);
        setTimeout(createClouds, delay);
    }
}