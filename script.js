document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');
    let dpi = window.devicePixelRatio;

    // Adjust canvas size for high DPI displays without scaling drawing operations
    function adjustCanvasForHighDPI() {
        const style = getComputedStyle(canvas);
        const width = parseInt(style.width) * dpi;
        const height = parseInt(style.height) * dpi;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${parseInt(style.width)}px`;
        canvas.style.height = `${parseInt(style.height)}px`;
    }
    adjustCanvasForHighDPI();

    const selectedParts = {
        bg: 'images/bg/bg1.png',
        head: 'images/head/head1.png',
        eyes: 'images/eyes/eyes1.png',
        mouth: 'images/mouth/mouth1.png',
        hat: 'images/hat/hat6.png'
    };

    function drawPart(partPath) {
        return new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Enable CORS for external images
            img.onload = function() {
                // Calculate the scale to fit the image within the canvas, considering DPI
                const scale = Math.min((canvas.width / dpi) / img.width, (canvas.height / dpi) / img.height);
                const x = ((canvas.width / dpi) - img.width * scale) / 2;
                const y = ((canvas.height / dpi) - img.height * scale) / 2;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                resolve();
            };
            img.src = partPath;
        });
    }

    async function updateAvatar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for redrawing
        for (const part of Object.keys(selectedParts)) {
            await drawPart(selectedParts[part]);
        }
    }

    function onPartChange(part, fileName) {
        selectedParts[part] = 'images/' + part + '/' + fileName;
        updateAvatar();
    }

    ['bg', 'head', 'eyes', 'mouth', 'hat'].forEach(part => {
        document.getElementById(part)?.addEventListener('change', function() {
            onPartChange(part, this.value);
        });
    });

    document.querySelector('.downloadBtn').addEventListener('click', function() {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.download = 'MyPokoAvatar.png';
            downloadLink.href = url;
            downloadLink.click();
            URL.revokeObjectURL(url); // Clean up
        }, 'image/png');
    });

    updateAvatar(); // Initialize the avatar with default selections
});
