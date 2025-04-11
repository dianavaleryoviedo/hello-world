document.addEventListener("DOMContentLoaded", () => {
     // Target the parent container (.summary-thumbnail-outer-container)
     const containers = document.querySelectorAll('.summary-thumbnail-outer-container');
 
     containers.forEach(container => {
         let isAnimating = false;
 
         container.addEventListener("mouseenter", () => {
             // Target all images inside the hovered container
             const images = container.querySelectorAll('img.summary-thumbnail-image, img.summary-thumbnail-image-alternate');
             console.log("Hover triggered on container. Found images:", images.length);
 
             images.forEach(img => {
                 if (isAnimating) return;
                 isAnimating = true;
                 console.log("Hover effect triggered on image:", img.src);
 
                 const parent = img.parentNode;
                 if (!parent) {
                     console.error("Parent not found for image:", img.src);
                     return;
                 }
 
                 // Create canvas for pixelation effect
                 const canvas = document.createElement("canvas");
                 canvas.classList.add("pixelation-canvas");
                 console.log("Canvas created:", canvas);
 
                 const ctx = canvas.getContext("2d");
                 canvas.width = img.offsetWidth;
                 canvas.height = img.offsetHeight;
                 ctx.imageSmoothingEnabled = false;
 
                 parent.style.position = 'relative'; // Ensure parent is positioned
                 parent.appendChild(canvas);
                 console.log("Canvas added to parent:", parent);
 
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
    console.log("Image loaded, starting pixelation effect");
    pixelate(0.03); // Step 1: initial pixelation
    setTimeout(() => {
        pixelate(0.03); // Step 2: final pixelation
        setTimeout(() => {
            console.log("Removing canvas");
            canvas.remove();
            isAnimating = false;
        }, 300);
    }, 0);
};
 
                 tempImg.onerror = function () {
                     console.error("Failed to load image:", img.src);
                     canvas.remove();
                     isAnimating = false;
                 };
             });
         });
 
         container.addEventListener("mouseleave", () => {
             // Reset animation flag when mouse leaves the container
             isAnimating = false;
         });
     });
 });
