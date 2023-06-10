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
    }
}

//Animations-funktioner
function windyClouds() {
    let main = document.getElementbyID("main-content");
    let cloud = document.createElement("div");

    cloud.classList.add("cloud");
    main.appendChild(cloud);
}