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

updateClock();
updateDate();
setInterval(updateClock, 1000);

setInterval(updateDate, 1000 * 60 * 60 * 24);