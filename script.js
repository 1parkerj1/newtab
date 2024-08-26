function updateTime() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    clockElement.textContent = `${dateString} ${timeString}`;
}

// Update time every second
setInterval(updateTime, 1000);
updateTime(); // Initial call to set the time immediately

// Load user settings from Chrome storage
chrome.storage.sync.get(['bgImage', 'fontColor', 'borderColor'], function(result) {
    if (result.bgImage) {
        document.body.style.backgroundImage = `url(${result.bgImage})`;
    }
    if (result.fontColor) {
        document.getElementById('clock').style.color = result.fontColor;
    }
    if (result.borderColor) {
        document.getElementById('container').style.borderColor = result.borderColor;
    }
});
