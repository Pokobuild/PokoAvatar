document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');

    adjustCanvasForHighDPI(canvas); // Adjust canvas for high DPI screens

    // Object to keep track of the selected parts
    const selectedParts = {
        bg: 'images/bg/bg1.png', // Ensure CORS settings if images are external
        head: 'images/head/head.png',
        eyes: 'images/eyes/eyes1.png',
        mouth: 'images/mouth/mouth1.png',
        hat: 'images/hat/hat6.png'
    };

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

    // Function to draw each part with CORS consideration
    function drawPart(partPath) {
        return new Promise(resolve => {
            const img = new Image();
            //img.crossOrigin = "anonymous"; // Enable CORS
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
                resolve();
            };
            img.src = partPath;
        });
    }

    async function updateAvatar() {
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio); // Clear canvas
        for (const part of Object.keys(selectedParts)) { // Redraw each part
            await drawPart(selectedParts[part]);
        }
    }

    // Example event listener for part change
    document.getElementById('bg').addEventListener('change', function() {
        onPartChange('bg', this.value);
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
    
    document.getElementById('hat').addEventListener('change', function() {
        onPartChange('hat', this.value);
    });
    // Add similar event listeners for other parts...

    document.getElementById('downloadBtn').addEventListener('click', function() {
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.download = 'CustomAvatar.png';
            downloadLink.href = url;
            downloadLink.click();
            URL.revokeObjectURL(url); // Clean up
        }, 'image/png');
    });

    // Handle part changes
    function onPartChange(part, fileName) {
        selectedParts[part] = 'images/' + part + '/' + fileName;
        updateAvatar();
    }

    updateAvatar(); // Initialize the avatar
});
