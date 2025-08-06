async function fetchWeather(apiKey, latitude, longitude) {
    const weatherElement = document.getElementById('weather-value');
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(weatherApiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const temperature = Math.round(data.main.temp);
        weatherElement.textContent = `${temperature}°C`;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherElement.textContent = "Weather fetch error.";
    }
}

function getLocationAndFetchWeather(apiKey) {
    const weatherElement = document.getElementById('weather-value');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(apiKey, latitude, longitude);
            },
            () => {
                weatherElement.textContent = "Enable location for weather.";
            }
        );
    } else {
        weatherElement.textContent = "Geolocation not supported.";
    }
}

function getStoredApiKey() {
    return new Promise((resolve) => {
        chrome.storage.local.get(["weatherApiKey"], (result) => {
            resolve(result.weatherApiKey || null);
        });
    });
}

function saveApiKey(apiKey) {
    chrome.storage.local.set({ weatherApiKey: apiKey }, () => {
        console.log("API key saved.");
        initialize();
    });
}

async function initialize() {
    const apiKey = await getStoredApiKey();
    const weatherValue = document.getElementById("weather-value");
    const apiKeyPopup = document.getElementById("api-key-popup");

    weatherValue.style.display = "block";
    apiKeyPopup.style.display = "none";

    updateClock();
    updateDate();
    backgroundUploader();

    setInterval(updateClock, 1000);
    setInterval(updateDate, 1000 * 60 * 60 * 24);

    if (apiKey) {
        getLocationAndFetchWeather(apiKey);
    } else {
        weatherValue.textContent = "--";
    }
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

function showCustomConfirm(message, yesText = "Yes", noText = "Cancel") {
    return new Promise((resolve) => {
        const confirmPopup = document.getElementById("confirm-popup");
        const confirmMessage = document.getElementById("confirm-message");
        const confirmYes = document.getElementById("confirm-yes");
        const confirmNo = document.getElementById("confirm-no");
        
        confirmMessage.textContent = message;
        confirmYes.textContent = yesText;
        confirmNo.textContent = noText;
        
        confirmPopup.style.display = "flex";
        
        const handleYes = () => {
            confirmPopup.style.display = "none";
            cleanup();
            resolve(true);
        };
        
        const handleNo = () => {
            confirmPopup.style.display = "none";
            cleanup();
            resolve(false);
        };
        
        const cleanup = () => {
            confirmYes.removeEventListener("click", handleYes);
            confirmNo.removeEventListener("click", handleNo);
        };
        
        confirmYes.addEventListener("click", handleYes);
        confirmNo.addEventListener("click", handleNo);
    });
}

document.getElementById("weather").addEventListener("click", async (e) => {
    const apiKey = await getStoredApiKey();
    const apiKeyPopup = document.getElementById("api-key-popup");

    if (!apiKey) {
        apiKeyPopup.style.display = "flex";
        const apiKeyField = document.getElementById("api-key-field");
        apiKeyField.value = "";
        apiKeyField.focus();
    } else {
        const confirmRemoval = await showCustomConfirm(
            "Delete Current API Key?", 
            "Remove Key", 
            "Keep It"
        );
        
        if (confirmRemoval) {
            chrome.storage.local.remove("weatherApiKey", () => {
                console.log("API key removed.");
                document.getElementById("weather-value").textContent = "--";
                apiKeyPopup.style.display = "none";
            });
        }
    }
});

document.getElementById("save-api-key").addEventListener("click", (e) => {
    e.stopPropagation();
    const key = document.getElementById("api-key-field").value.trim();
    if (key) {
        document.getElementById("api-key-popup").style.display = "none";
        document.getElementById("weather-value").textContent = "Loading...";
        saveApiKey(key);
    } else {
        alert("Please enter a valid API key.");
    }
});

document.getElementById("api-key-field").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("save-api-key").click();
    }
});

document.addEventListener("click", (e) => {
    const popup = document.getElementById("api-key-popup");
    const weather = document.getElementById("weather");
    
    if (!weather.contains(e.target) && popup.style.display === "flex") {
        popup.style.display = "none";
    }
});

document.getElementById("api-key-popup").addEventListener("click", (e) => {
    e.stopPropagation();
});

initialize();