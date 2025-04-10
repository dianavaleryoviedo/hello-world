document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(
        'img.summary-thumbnail-image.loaded, img.summary-thumbnail-image.summary-thumbnail-image-alternate.loaded'
    ).forEach(img => {
        let isAnimating = false;

        const applyPixelation = () => {
            if (isAnimating) return;
            isAnimating = true;

            const parent = img.parentNode;
            if (!parent) return;

            const canvas = document.createElement("canvas");
            canvas.classList.add("pixelation-canvas");

            const ctx = canvas.getContext("2d");
            canvas.width = img.offsetWidth;
            canvas.height = img.offsetHeight;
            ctx.imageSmoothingEnabled = false;

            // Position canvas absolutely over the image
            canvas.style.width = img.offsetWidth + "px";
            canvas.style.height = img.offsetHeight + "px";

            parent.style.position = 'relative'; // make sure parent is positioned
            parent.appendChild(canvas);

            const tempImg = new Image();
            tempImg.crossOrigin = "anonymous";
            tempImg.src = img.src;

            const pixelate = (factor) => {
                const w = canvas.width * factor;
                const h = canvas.height * factor;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(tempImg, 0, 0, w, h);
                ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
            };

            tempImg.onload = function () {
                pixelate(0.08);
                setTimeout(() => {
                    pixelate(0.1);
                    setTimeout(() => {
                        pixelate(0.05);
                        setTimeout(() => {
                            canvas.remove();
                            isAnimating = false;
                        }, 300);
                    }, 100);
                }, 150);
            };

            tempImg.onerror = function () {
                console.error("Failed to load image: " + img.src);
                canvas.remove();
                isAnimating = false;
            };
        };

        img.addEventListener("mouseenter", applyPixelation);
    });
});
