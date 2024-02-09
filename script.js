document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');
    adjustCanvasForHighDPI(canvas);

    const selectedParts = {
        bg: 'images/bg/bg1.png',
        head: 'images/head/head.png',
        eyes: 'images/eyes/eyes1.png',
        mouth: 'images/mouth/mouth1.png',
        hat: 'images/hat/hat6.png'
    };

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

    function drawPart(partPath) {
        return new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Enable CORS
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
            downloadLink.download = 'MyPoko.png';
            downloadLink.href = url;
            downloadLink.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    });

    updateAvatar(); // Initialize the avatar with default parts
});
