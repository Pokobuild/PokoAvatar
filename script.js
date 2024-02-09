document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');

    // Adjust canvas for high DPI displays
    function adjustCanvasForHighDPI(canvas) {
        const dpi = window.devicePixelRatio || 1;
        const style = getComputedStyle(canvas);
        const width = parseInt(style.width) * dpi;
        const height = parseInt(style.height) * dpi;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width / dpi}px`;
        canvas.style.height = `${height / dpi}px`;
        ctx.scale(dpi, dpi);
    }
    adjustCanvasForHighDPI(canvas);

    // Object to keep track of the selected parts
    const selectedParts = {
        bg: 'images/bg/bg1.png',
        head: 'images/head/head.png',
        eyes: 'images/eyes/eyes1.png',
        mouth: 'images/mouth/mouth1.png',
        hat: 'images/hat/hat6.png'
    };

    // Function to draw each part with CORS consideration
    function drawPart(partPath) {
        return new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
                resolve();
            };
            img.src = partPath;
        });
    }

    async function updateAvatar() {
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
        for (const part of Object.keys(selectedParts)) {
            await drawPart(selectedParts[part]);
        }
    }

    // Function to handle part changes
    function onPartChange(part, fileName) {
        selectedParts[part] = 'images/' + part + '/' + fileName;
        updateAvatar();
    }

    // Event listeners for part changes
    ['bg', 'head', 'eyes', 'mouth', 'hat'].forEach(part => {
        document.getElementById(part)?.addEventListener('change', function() {
            onPartChange(part, this.value);
        });
    });

    //download button
    document.querySelector('.downloadBtn').addEventListener('click', function() {
        // Assuming you have a function defined to handle the canvas download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.download = 'CustomAvatar.png';
            downloadLink.href = url;
            downloadLink.click();
            URL.revokeObjectURL(url); // Clean up
        }, 'image/png');
    });
    

    updateAvatar(); // Initialize the avatar
});
