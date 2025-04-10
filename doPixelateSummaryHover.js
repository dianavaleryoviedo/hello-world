document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.summary-thumbnail.img-wrapper img').forEach(img => {
        let isAnimating = false;

        const applyPixelation = () => {
            if (isAnimating) return;
            isAnimating = true;

            const parent = img.closest('.summary-thumbnail.img-wrapper');
            if (!parent) return;

            const canvas = document.createElement("canvas");
            canvas.classList.add("pixelation-canvas");

            const ctx = canvas.getContext("2d");
            canvas.width = img.offsetWidth;
            canvas.height = img.offsetHeight;
            ctx.imageSmoothingEnabled = false;

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
