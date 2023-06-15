//Väderbjekt att spara fetch-värden i
let weatherObject = {
    location:"place",
    lat: 0,
    lon: 0,
    weather:"weather",
    timezone:"timezone",
    pressure: 0,
    humidity: 0,
    wind: 0,
    temperature: 0,
    timezone: 0,
};

let loadTime = 2000;


//Main
function pressEnter(event) {
    if (event.keyCode == 13) {
        update();
        setTimeout(update, loadTime);
        //updatera värden vart 30:e minut
        setInterval(update, 1800000);
    }
}
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
    weatherObject.temperature = Math.floor(data.main.temp - 273.15);
    weatherObject.timezone = data.timezone;
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
    return userValue;
}

function updateLocationTime() {
    let locationText = document.getElementById("location-h1");
    locationText.innerHTML = "";
    locationText.innerText = weatherObject.location;
}

function clock() {
    let offset = CurrentUTCOffset();
    let date = new Date();
    let hour = date.getHours() + calculateUTC(weatherObject.timezone, offset);
    let minutes = date.getMinutes();
    let sec = date.getSeconds();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();

    if (hour > 23) {hour = hour-23; day + 1;}
    else if (hour < 0) {hour = hour+24; day - 1;}

    let htmlClock = document.getElementById("clock");
    htmlClock.innerHTML = day + "/" + month + "/" + year + "  " + hour + ":" + minutes + ":" + sec;
}

function calculateUTC(locationOffset, currentOffset) {
    utc = Number(locationOffset);
    let h = (locationOffset / 3600);
    let newOffset = h - currentOffset;
    return newOffset; 
}

//Klientens UTC-tidsskillnad i timmar
function CurrentUTCOffset() {
    let offset = (new Date().getTimezoneOffset()/60) * -1;
    return offset;
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
        setTimeout(updateBoxValues, loadTime);
    }
    setTimeout(displayWeather, loadTime);
}

function displayWeather() {
    if(weatherObject.weather == "Clear") {
        showHideSun();
        setInterval(showHideSun, 3000);
    }
    if(weatherObject.weather == "Rain" || weatherObject.weather == "Snow") {
        animateRain();
        setInterval(animateRain, 4000);
    }
    if(weatherObject.weather == "Clouds" || weatherObject.weather == "Fog") {
        animateClouds();
        setInterval(animateClouds, 4000);
    }
    else {weatherObject.weather == "weather";}
}

function updateBoxValues() {
    let pressure = document.getElementById("pressure");
    pressure.innerHTML = weatherObject.pressure + " mbar";

    let humidity = document.getElementById("humidity");
    humidity.innerHTML = weatherObject.humidity + " %";

    let windSpeed = document.getElementById("wind-speed");
    windSpeed.innerHTML = weatherObject.wind + " m/s";

    let weatherType = document.getElementById("weather-type");
    weatherType.innerHTML = weatherObject.weather;

    let temperature = document.getElementById("temperature");
    temperature.innerHTML = weatherObject.temperature + " °C";
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
    setTimeout(()=> {
        cloud.remove();
    }, 4000)
}

function createClouds() {
        let x = rng(0, 1200);
        let y = rng(30, 600);
        windyClouds(x, y);
}

function animateClouds() {

    if (weatherObject.weather == "Clouds") {
        let cloudAmount = rng(0, 2);

        for( let i = 0; i <= cloudAmount; i++) {
            let delay = rng(1000, 5000);
            setTimeout(createClouds, delay);
        }
    }
}

function showHideSun() {

    if (weatherObject.weather == "Clear") {
        let main = document.getElementById("main-content");
        let sun = document.createElement("div");
        sun.classList.add("sunny");
        main.appendChild(sun);
        setTimeout(()=> {
            sun.remove();
        }, 5000)
    }
}

function createRainDiv(x, y) {
    let main = document.getElementById("main-content");
    let rain = document.createElement("div");
    rain.style.right = x;
    rain.style.top = y;
    rain.classList.add("rainy");
    main.appendChild(rain);
    setTimeout(()=> {
        rain.remove();
    }, 1000)
}

function animateRain() {

    if (weatherObject.weather == "Rain") {
        let rainAmount = rng(7, 10);

        for( let i = 0; i <= rainAmount; i++) {
            let delay = rng(0, 3000);
            setTimeout(() => {
                let x = rng(0, 1700);
                let y = rng(50, 70);
                createRainDiv(x, y);
            }, delay);
        }
    } 
}
