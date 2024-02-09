document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('avatarCanvas');
    const ctx = canvas.getContext('2d');

    // Set fixed drawing dimensions for consistency
    canvas.width = 500;
    canvas.height = 500;

    const selectedParts = {
        bg: 'images/bg/bg1.png',
        head: 'images/head/head.png',
        eyes: 'images/eyes/eyes1.png',
        mouth: 'images/mouth/mouth1.png',
        hat: 'images/hat/hat6.png'
    };

    function drawPart(partPath) {
        return new Promise(resolve => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Enable CORS for external images
            img.onload = function() {
                // Ensure the image fits within the canvas
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width - img.width * scale) / 2;
                const y = (canvas.height - img.height * scale) / 2;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                resolve();
            };
            img.src = partPath;
        });
    }

    async function updateAvatar() {
        for (const part of Object.keys(selectedParts)) {
            await drawPart(selectedParts[part]);
        }
    }

    // Handle changes in part selection
    ['bg', 'head', 'eyes', 'mouth', 'hat'].forEach(part => {
        document.getElementById(part)?.addEventListener('change', function() {
            selectedParts[part] = 'images/' + part + '/' + this.value;
            updateAvatar();
        });
    });

    // Download button functionality
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
