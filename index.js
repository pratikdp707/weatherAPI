weatherCCity = 'https://api.openweathermap.org/data/2.5/weather?&appid=21e926bca5d007671affc56d1eb55605&units=metric';
weatherFCity = 'https://api.openweathermap.org/data/2.5/weather?&appid=21e926bca5d007671affc56d1eb55605&units=imperial';
forecastCCity = 'https://api.openweathermap.org/data/2.5/forecast?&appid=21e926bca5d007671affc56d1eb55605&units=metric';
forecastFCity = 'https://api.openweathermap.org/data/2.5/forecast?&appid=21e926bca5d007671affc56d1eb55605&units=imperial';

var url1 = '';
var url2 = '';
var lat = 0;
var lon = 0;
var city = 'nagpur';
var unit = 'C';

// let d= new Date();
// if(d.getHours() >= 19){
//     console.log(d.getHours());
//     //let body = document.getElementsByTagName('body')[0];
//     //body.setAttribute('background','#222831');
// }


function getUpdateTime(){
    var d = new Date();
    var time = (d.getHours().toString().length == 2 ? d.getHours() : "0"+d.getHours()) + ":" +
    (d.getMinutes().toString().length == 2 ? d.getMinutes() : "0"+d.getMinutes());
    return time;
}

function getDay(unix){
    var d= new Date(unix*1000);
    var dateArray = d.toString().split(" ");
    var date = dateArray[0] +", "+dateArray[2]+" "+dateArray[1];
    return date;
}

function capitalize(input) {
    var words = input.split(' ');
    var CapitalizedWords = [];
    words.forEach(element => {
    CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
    });
    return CapitalizedWords.join(' ');
}

getData(weatherCCity+'&q=nagpur',forecastCCity+'&q=nagpur');

async function getData(url1, url2) {
    let wData = await fetch(url1);
    let fData = await fetch(url2);
    let weatherData = await wData.json();
    let forecastData = await fData.json();
    console.log(weatherData);
    console.log(forecastData);
    display(weatherData, forecastData);
}

function UTCToIST(unix){
    var d = new Date(unix * 1000);
    var istDate = (d.getHours().toString().length == 2 ? d.getHours() : "0"+d.getHours()) + ":" +
    (d.getMinutes().toString().length == 2 ? d.getMinutes() : "0"+d.getMinutes());
    return istDate;
}

function display(weatherData, forecastData){
    document.getElementById('input-location').value = '';
    let feelsLike = document.getElementById('feels-like');
    let humidity = document.getElementById('humidity');
    let pressure = document.getElementById('pressure');
    let sunrise = document.getElementById('sunrise');
    let sunset = document.getElementById('sunset');
    let cityName = document.getElementById('city-name');
    let weatherImage = document.getElementById('climate');
    let temperature = document.getElementById('temperature');
    let weatherDesc = document.getElementById('weather-description');
    let updateTime = document.getElementById('update-time');
    let minTemp = document.getElementById('temp-min');
    let maxTemp = document.getElementById('temp-max');
    let visibility = document.getElementById('visibility');
    let cloudiness = document.getElementById('clouds');

    humidity.innerText = `${weatherData.main.humidity} %`;
    pressure.innerText = `${weatherData.main.pressure} hPa`;
    sunrise.innerText = UTCToIST(weatherData.sys.sunrise);
    sunset.innerText = UTCToIST(weatherData.sys.sunset);
    cityName.innerText = `${weatherData.name}, ${weatherData.sys.country}`;
    weatherImage.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
    weatherDesc.innerText = capitalize(weatherData.weather[0].description);
    visibility.innerText = `Visibility  -  ${weatherData.visibility / 1000} km`;
    cloudiness.innerText = `Cloudiness  -  ${weatherData.clouds.all} %`;
    updateTime.innerText = 'Updated as of ' + getUpdateTime();
    if(unit === 'C'){
        feelsLike.innerHTML = `${weatherData.main.feels_like}<span><sup>o</sup>C</span>`;
        temperature.innerHTML = `${weatherData.main.temp}<span><sup>o</sup>C</span>`
        minTemp.innerHTML = `Min. Temperature  -  ${weatherData.main.temp_min} <span><sup>o</sup>C</span`;
        maxTemp.innerHTML = `Max. Temperature  -  ${weatherData.main.temp_max} <span><sup>o</sup>C</span`;
        
    } else{
        feelsLike.innerHTML = `${weatherData.main.feels_like}<span><sup>o</sup>F</span>`;
        temperature.innerHTML = `${weatherData.main.temp}<span><sup>o</sup>F</span>`
        minTemp.innerHTML = `Min. Temperature  -  ${weatherData.main.temp_min} <span><sup>o</sup>C</span`;
        maxTemp.innerHTML = `Max. Temperature  -  ${weatherData.main.temp_max} <span><sup>o</sup>C</span`;
    }

    let counter = 0;
    for(i=7 ; i<forecastData.list.length ; i+=8){
        let date = document.getElementById('date'+counter);
        let img = document.getElementById('img'+counter);
        let temp = document.getElementById('temp'+counter);
        let desc = document.getElementById('desc'+counter);
        let humidity = document.getElementById('humidity'+counter);
        date.innerText = getDay(forecastData.list[i].dt);
        img.src = `https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png`
        if(unit === 'C'){
            temp.innerHTML = `${forecastData.list[i].main.temp}<span><sup>o</sup>C</span>`
        } else{
            temp.innerHTML = `${forecastData.list[i].main.temp}<span><sup>o</sup>F</span>`
        }   
        desc.innerText = capitalize(forecastData.list[i].weather[0].description);
        humidity.innerText = `Humidity - ${forecastData.list[i].main.humidity} %`;
        counter++;
    }
}

document.getElementById('unit-cel').addEventListener('click', event => {
    unit = 'C';
    document.getElementById('unit-fah').classList.remove('active');
    event.target.classList.add('active');
    if (city != '') {
        url1 = `${weatherCCity}&q=${city}`;
        url2 = `${forecastCCity}&q=${city}`;
    } else {
        url1 = `${weatherCCity}&lat=${lat}&lon=${lon}`;
        url2 = `${forecastCCity}&lat=${lat}&lon=${lon}`;
    }
    document.getElementById('input-location').innerText = '';
    getData(url1, url2);
})

document.getElementById('unit-fah').addEventListener('click', event => {
    unit = 'F';
    document.getElementById('unit-cel').classList.remove('active');
    event.target.classList.add('active');
    if(city != ''){
        console.log(city);
        url1 = `${weatherFCity}&q=${city}`;
        url2 = `${forecastFCity}&q=${city}`;
    }else{
        url1 = `${weatherFCity}&lat=${lat}&lon=${lon}`;
        url2 = `${forecastFCity}&lat=${lat}&lon=${lon}`;
    }
    document.getElementById('input-location').innerText = '';
    getData(url1,url2);
    
})

document.getElementById('current-location').addEventListener('click', event => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
    }
});

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log(typeof lat);
    console.log(typeof lon);
    if (unit === 'C') {
        url1 = `${weatherCCity}&lat=${lat}&lon=${lon}`;
        url2 = `${forecastCCity}&lat=${lat}&lon=${lon}`;
    }
    else {
        url1 = `${weatherFCity}&lat=${lat}&lon=${lon}`;
        url2 = `${forecastFCity}&lat=${lat}&lon=${lon}`;
    }
    city = '';
    getData(url1, url2);
}

document.getElementById('search-location').addEventListener('click', event => {
    city = document.getElementById('input-location').value;
    if (unit === 'C') {
        url1 = `${weatherCCity}&q=${city}`;
        url2 = `${forecastCCity}&q=${city}`;
    }
    else {
        url1 = `${weatherFCity}&q=${city}`;
        url2 = `${forecastFCity}&q=${city}`;
    }
    lat = 0;
    lon = 0;
    getData(url1, url2);
})

