let playMode = false;
const grid = document.getElementById('grid');
const modeButton = document.getElementById('mode-button');

// Create grid
for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.contentEditable = 'true';
    cell.style.textAlign = 'center';
    cell.addEventListener('input', () => {
      updateURL();
    })
    grid.appendChild(cell);
}

let clickHandler = function() {
    if (playMode) {
        this.classList.toggle('checked');
    }
};

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', clickHandler);
});

modeButton.addEventListener('click', () => {
    playMode = !playMode;
    modeButton.textContent = playMode ? 'Switch to edit mode' : 'Switch to play mode';

    document.querySelectorAll('.cell').forEach(cell => {
        cell.contentEditable = playMode ? 'false' : 'true';
    });
});

// Load grid from URL hash
const hash = window.location.hash.substring(1);
if (hash) {
    const gridData = decodeURIComponent(hash).split('_');
    const cells = document.querySelectorAll('.cell');
    gridData.forEach((word, index) => {
        cells[index].innerText = word;
    });
}

function updateURL() {
    const cells = document.querySelectorAll('.cell');
    const gridData = Array.from(cells).map(cell => cell.innerText);
    window.location.hash = encodeURIComponent(gridData.join('_'));
}
