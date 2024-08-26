function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('clock').textContent = time;
    document.getElementById('date').textContent = date;
}

function applySettings(settings) {
    // Apply background color
    document.body.style.backgroundColor = settings.backgroundColor || '#000';

    // Apply background image if enabled
    if (settings.enableImage && settings.backgroundImage) {
        document.body.style.backgroundImage = `url(${settings.backgroundImage})`;
        document.body.style.backgroundBlendMode = 'multiply';
    } else {
        document.body.style.backgroundImage = 'none';
    }

    // Apply font color
    document.body.style.color = settings.fontColor || '#fff';

    // Apply text stroke if enabled
    if (settings.enableStroke) {
        const textShadow = `2px 2px ${settings.strokeColor || '#fff'}`;
        document.getElementById('clock').style.textShadow = textShadow;
        document.getElementById('date').style.textShadow = textShadow;
    } else {
        document.getElementById('clock').style.textShadow = 'none';
        document.getElementById('date').style.textShadow = 'none';
    }
}

// Fetch and apply settings on new tab load
chrome.storage.local.get(['enableImage', 'backgroundImage', 'backgroundColor', 'fontColor', 'enableStroke', 'strokeColor'], function(result) {
    applySettings(result);
});

updateClock();
setInterval(updateClock, 1000);
