async function fetchWeather(apiKey, latitude, longitude) {
    const weatherElement = document.getElementById('weather');
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(weatherApiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const temperature = Math.round(data.main.temp);
        weatherElement.textContent = `${temperature}°C`;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherElement.textContent = "Unable to fetch weather data.";
    }
}

function getLocationAndFetchWeather(apiKey) {
    const weatherElement = document.getElementById('weather');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(apiKey, latitude, longitude);
            },
            () => {
                weatherElement.textContent = "Turn on location services to fetch weather.";
            }
        );
    } else {
        weatherElement.textContent = "Geolocation is not supported by this browser.";
    }
}

async function initialize() {
    const apiKey = ""; // Your OpenWeather API key
    updateClock();
    updateDate();
    backgroundUploader();
    
    setInterval(updateClock, 1000);
    setInterval(updateDate, 1000 * 60 * 60 * 24);

    getLocationAndFetchWeather(apiKey);
}

function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function updateDate() {
    const dateElement = document.getElementById('date');
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    dateElement.textContent = `${day}/${month}/${year}`;
}

function backgroundUploader() {
    const uploadButton = document.getElementById('upload-button');
    const fileInput = document.getElementById('file-input');

    uploadButton.addEventListener('click', (e) => {
        e.preventDefault(); 
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                chrome.storage.local.set({ 'backgroundImage': imageUrl }, () => {
                    document.body.style.backgroundImage = `url(${imageUrl})`;
                });
            };
            reader.readAsDataURL(file);
        }
    });

    chrome.storage.local.get('backgroundImage', (data) => {
        if (data.backgroundImage) {
            document.body.style.backgroundImage = `url(${data.backgroundImage})`;
        }
    });
}

initialize();
