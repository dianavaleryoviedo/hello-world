class Mosaic {
  constructor(canvas, img, blockSize = 40) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.img = img;
    this.blockSize = blockSize;
    this.blocks = [];
  }

  createBlocks() {
    const cols = Math.ceil(this.canvas.width / this.blockSize);
    const rows = Math.ceil(this.canvas.height / this.blockSize);
    this.blocks = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const sx = x * this.blockSize;
        const sy = y * this.blockSize;
        this.blocks.push({ sx, sy, delay: Math.random() * 400 });
      }
    }
  }

  animateIn() {
    this.createBlocks();

    const scaleX = this.img.naturalWidth / this.canvas.width;
    const scaleY = this.img.naturalHeight / this.canvas.height;

    this.blocks.forEach(block => {
      setTimeout(() => {
        this.ctx.drawImage(
          this.img,
          block.sx * scaleX,
          block.sy * scaleY,
          this.blockSize * scaleX,
          this.blockSize * scaleY,
          block.sx,
          block.sy,
          this.blockSize,
          this.blockSize
        );
      }, block.delay);
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".summary-thumbnail-outer-container");

  containers.forEach(container => {
    const img = container.querySelector("img.summary-thumbnail-image");
    if (!img || container.dataset.mosaicified) return;

    container.dataset.mosaicified = "true";
    container.style.position = "relative";

    const canvas = document.createElement("canvas");
    canvas.classList.add("pixelation-canvas");
    container.appendChild(canvas);

    const setCanvasSize = () => {
      const imgRect = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const width = imgRect.width;
      const height = imgRect.height;

      // Match canvas drawing size
      canvas.width = width;
      canvas.height = height;

      // Match visual size and placement exactly
      canvas.style.position = "absolute";
      canvas.style.top = (imgRect.top - containerRect.top) + "px";
      canvas.style.left = (imgRect.left - containerRect.left) + "px";
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "2";
      canvas.style.opacity = "0"; // Canvas starts hidden
      canvas.style.transition = "opacity 0.3s ease";
    };

    if (img.complete) {
      setCanvasSize();
    } else {
      img.onload = setCanvasSize;
    }

    const mosaic = new Mosaic(canvas, img, 50);
    const animationDuration = 1250; // Duration of the animation in milliseconds (2 seconds)

    // Function to trigger pixelation animation
    const triggerPixelation = () => {
      mosaic.clear();
      canvas.style.opacity = "1"; // Make canvas visible
      mosaic.animateIn();

      // Hide the canvas after the animation duration
      setTimeout(() => {
        canvas.style.opacity = "0"; // Fade out canvas
      }, animationDuration);
    };

    // Trigger pixelation on hover (mouseenter)
    container.addEventListener("mouseenter", () => {
      triggerPixelation(); // Run the pixelation animation
    });

    // Reset effect when mouse leaves the area (mouseleave)
    container.addEventListener("mouseleave", () => {
      triggerPixelation(); // Run the pixelation animation again
    });

    // Update canvas size on image load and window resize
    new ResizeObserver(setCanvasSize).observe(img);
  });
});
