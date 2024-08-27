async function fetchWeather(apiKey, latitude, longitude) {
    const weatherElement = document.getElementById('weather');

    if (!apiKey) {
        weatherElement.textContent = "Invalid API key.";
        return;
    }

    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    console.log("Fetching weather with URL:", weatherApiUrl);  

    try {
        const response = await fetch(weatherApiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const temperature = data.main.temp;
        const description = data.weather[0].description;

        weatherElement.textContent = `${temperature}°C`;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherElement.textContent = "Unable to fetch weather data.";
    }
}

async function initialize() {
    const apiKey = "your_api_key"; 

    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    setInterval(updateDate, 1000 * 60 * 60 * 24);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            await fetchWeather(apiKey, latitude, longitude);
            setInterval(() => fetchWeather(apiKey, latitude, longitude), 1000 * 60 * 10); 
        }, async (error) => {
            console.error("Error getting location:", error);
            const weatherElement = document.getElementById('weather');
            weatherElement.textContent = "Unable to fetch your location. Using default location.";

            const defaultLatitude = 0; //your lat 
            const defaultLongitude = 0; //your long
            await fetchWeather(apiKey, defaultLatitude, defaultLongitude);
        });
    } else {
        const weatherElement = document.getElementById('weather');
        weatherElement.textContent = "Geolocation is not supported by this browser.";
    }
}

function updateClock() {
    const clockElement = document.getElementById('clock');

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;

    clockElement.textContent = timeString;
}

function updateDate() {
    const dateElement = document.getElementById('date');

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const dateString = `${day}/${month}/${year}`;

    dateElement.textContent = dateString;
}

initialize();
