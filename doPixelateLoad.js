function applyPixelation(img) {
    img.style.visibility = "hidden";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const parent = img.parentNode;

    canvas.width = img.offsetWidth;
    canvas.height = img.offsetHeight;
    ctx.imageSmoothingEnabled = false;

    canvas.style.position = "absolute";
    canvas.style.top = img.offsetTop + "px";
    canvas.style.left = img.offsetLeft + "px";

    parent.insertBefore(canvas, img);

    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.src = img.src;

    const blockSize = 10; // pixel size of each block
    const delay = 5; // ms between drawing each block

    tempImg.onload = function () {
        const offscreen = document.createElement("canvas");
        const offCtx = offscreen.getContext("2d");
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        offCtx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);

        let xBlocks = Math.ceil(canvas.width / blockSize);
        let yBlocks = Math.ceil(canvas.height / blockSize);
        let blockCount = 0;

        for (let y = 0; y < yBlocks; y++) {
            for (let x = 0; x < xBlocks; x++) {
                setTimeout(() => {
                    let imgData = offCtx.getImageData(
                        x * blockSize,
                        y * blockSize,
                        blockSize,
                        blockSize
                    );
                    ctx.putImageData(imgData, x * blockSize, y * blockSize);
                }, delay * blockCount);
                blockCount++;
            }
        }

        // Reveal the image after all blocks are drawn
        const totalDelay = delay * blockCount + 200;
        setTimeout(() => {
            canvas.remove();
            img.style.visibility = "visible";
        }, totalDelay);
    };

    tempImg.onerror = function () {
        console.error("Failed to load image: " + img.src);
        canvas.remove();
        img.style.visibility = "visible";
    };
}
