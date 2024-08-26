document.getElementById('background-image').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            chrome.storage.local.set({ backgroundImage: e.target.result }, function() {
                notifyTabs();
            });
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('enable-image').addEventListener('change', function(event) {
    chrome.storage.local.set({ enableImage: event.target.checked }, function() {
        notifyTabs();
    });
});

document.getElementById('background-color').addEventListener('input', function(event) {
    const color = event.target.value;
    chrome.storage.local.set({ backgroundColor: color }, function() {
        document.body.style.backgroundColor = color;
        notifyTabs();
    });
});

document.getElementById('font-color').addEventListener('input', function(event) {
    const color = event.target.value;
    chrome.storage.local.set({ fontColor: color }, function() {
        document.body.style.color = color;
        updateFontColor(color);
        notifyTabs();
    });
});

document.getElementById('enable-stroke').addEventListener('change', function(event) {
    const strokeEnabled = event.target.checked;
    document.getElementById('stroke-color').disabled = !strokeEnabled;
    chrome.storage.local.set({ enableStroke: strokeEnabled }, function() {
        updateStrokeVisibility(strokeEnabled);
        notifyTabs();
    });
});

document.getElementById('stroke-color').addEventListener('input', function(event) {
    const color = event.target.value;
    chrome.storage.local.set({ strokeColor: color }, function() {
        updateStrokeColor(color);
        notifyTabs();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['enableImage', 'backgroundColor', 'fontColor', 'enableStroke', 'strokeColor', 'backgroundImage'], function(result) {
        document.getElementById('enable-image').checked = result.enableImage || false;
        document.getElementById('background-color').value = result.backgroundColor || '#000000';
        document.getElementById('font-color').value = result.fontColor || '#ffffff';
        document.getElementById('enable-stroke').checked = result.enableStroke || false;
        document.getElementById('stroke-color').value = result.strokeColor || '#ffffff';
        document.getElementById('stroke-color').disabled = !result.enableStroke;

        // Apply initial settings
        document.body.style.backgroundColor = result.backgroundColor || '#000000';
        document.body.style.color = result.fontColor || '#ffffff';
        updateStrokeVisibility(result.enableStroke);
        updateStrokeColor(result.strokeColor);
        updateBackgroundImageVisibility(result.enableImage);
        updateBackgroundImage(result.backgroundImage);
    });
});

function updateBackgroundImage(imageUrl) {
    if (imageUrl) {
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundBlendMode = 'multiply';
    } else {
        document.body.style.backgroundImage = 'none';
    }
}

function updateBackgroundImageVisibility(isEnabled) {
    if (!isEnabled) {
        document.body.style.backgroundImage = 'none';
    }
}

function updateFontColor(color) {
    document.querySelectorAll('label, h1').forEach(element => {
        element.style.color = color;
    });
}

function updateStrokeVisibility(isEnabled) {
    if (isEnabled) {
        document.querySelectorAll('label, h1').forEach(label => {
            label.style.textShadow = `2px 2px ${document.getElementById('stroke-color').value}`;
        });
    } else {
        document.querySelectorAll('label, h1').forEach(label => {
            label.style.textShadow = 'none';
        });
    }
}

function updateStrokeColor(color) {
    if (document.getElementById('enable-stroke').checked) {
        document.querySelectorAll('label, h1').forEach(label => {
            label.style.textShadow = `2px 2px ${color}`;
        });
    }
}

// Notify all open new tab pages about the settings change
function notifyTabs() {
    chrome.tabs.query({ url: "chrome://newtab/" }, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.reload(tab.id);
        });
    });
}
