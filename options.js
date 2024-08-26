document.getElementById('optionsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fontColor = document.getElementById('fontColor').value;
    const borderColor = document.getElementById('borderColor').value;

    const bgImageFile = document.getElementById('bgImageFile').files[0];
    if (bgImageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const bgImageBase64 = e.target.result;
            saveOptions(bgImageBase64, fontColor, borderColor);
        };
        reader.readAsDataURL(bgImageFile);
    } else {
        saveOptions(null, fontColor, borderColor);
    }
});

function saveOptions(bgImageBase64, fontColor, borderColor) {
    chrome.storage.sync.set({
        bgImage: bgImageBase64,
        fontColor: fontColor,
        borderColor: borderColor
    }, function() {
        alert('Settings saved!');
    });
}

// Load saved options when the page is opened
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['bgImage', 'fontColor', 'borderColor'], function(result) {
        if (result.fontColor) {
            document.getElementById('fontColor').value = result.fontColor;
        }
        if (result.borderColor) {
            document.getElementById('borderColor').value = result.borderColor;
        }
    });
});
