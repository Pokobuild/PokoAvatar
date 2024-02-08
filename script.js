const canvas = document.getElementById('avatarCanvas');
const ctx = canvas.getContext('2d');

// High DPI canvas adjustment function
function adjustCanvasSize(canvas, width, height) {
    const dpi = window.devicePixelRatio;

    // Set the 'drawing buffer' size
    canvas.width = width * dpi;
    canvas.height = height * dpi;

    // Scale the canvas back down with CSS (to the original intended size)
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // Scale the canvas drawing content to match the CSS size
    const ctx = canvas.getContext('2d');
    ctx.scale(dpi, dpi);
}

// Adjust your canvas size for high DPI screens
adjustCanvasSize(canvas, 500, 500); // Set this to your desired CSS display size

// Object to keep track of the selected parts
const selectedParts = {
    bg: 'images/bg/bg1.png',
    head: 'images/head/head.png',
    eyes: 'images/eyes/eyes1.png',
    mouth: 'images/mouth/mouth1.png'
    hat: 'images/hat/hat6.png'
};

function drawPart(partPath) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = function() {
            // Adjust drawImage to not scale the image based on DPI; it's already accounted for
            ctx.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
            resolve();
        };
        img.src = partPath;
    });
}

async function updateAvatar() {
    // Clear the canvas before redrawing everything
    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

    // Redraw each part in order
    for (const part of Object.keys(selectedParts)) {
        await drawPart(selectedParts[part]);
    }
}

// Event listeners for part changes and download function remain the same
function onPartChange(part, fileName) {
    selectedParts[part] = 'images/' + part + '/' + fileName;
    updateAvatar();
}

document.getElementById('bg').addEventListener('change', function() {
    onPartChange('bg', this.value);
});


document.getElementById('hat').addEventListener('change', function() {
    onPartChange('hat', this.value);
});

document.getElementById('head').addEventListener('change', function() {
    onPartChange('head', this.value);
});


document.getElementById('eyes').addEventListener('change', function() {
    onPartChange('eyes', this.value);
});

document.getElementById('mouth').addEventListener('change', function() {
    onPartChange('mouth', this.value);
});

// Initialize the avatar with the default selection

updateAvatar();

document.getElementById('downloadBtn').addEventListener('click', function() {
    const canvas = document.getElementById('avatarCanvas');
    const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    
    
     // Create a temporary link to trigger the download
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'Your Poko Avatar.png');
    downloadLink.setAttribute('href', image);
    downloadLink.click();
});


