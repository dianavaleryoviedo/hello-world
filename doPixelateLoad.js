document.addEventListener("DOMContentLoaded", () => {
     const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
             if (entry.isIntersecting) {
                 applyPixelation(entry.target);
             }
         });
     }, { root: null, rootMargin: "0px", threshold: 0 });
 
     function applyPixelation(img) {
         img.style.visibility = "hidden";
 
         const canvas = document.createElement("canvas");
         const ctx = canvas.getContext("2d");
         const parent = img.parentNode;
 
         canvas.width = img.offsetWidth;
         canvas.height = img.offsetHeight;
         ctx.imageSmoothingEnabled = false;
 
         // Position canvas over the image
         canvas.style.position = "absolute";
         canvas.style.top = img.offsetTop + "px";
         canvas.style.left = img.offsetLeft + "px";
 
         parent.insertBefore(canvas, img);
 
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
    pixelate(0.02); // very pixelated
    setTimeout(() => {
        pixelate(0.02); // less pixelated
        setTimeout(() => {
            canvas.remove();
            img.style.visibility = "visible";
        }, 150);
    }, 150);
};
 
         tempImg.onerror = function () {
             console.error("Failed to load image: " + img.src);
             canvas.remove();
             img.style.visibility = "visible";
         };
     }
 
     // Function to observe all matching images
     const observeImages = () => {
         document.querySelectorAll('.homepage .sqs-block-image img[alt*="pixelate"]').forEach(img => {
             if (!img.classList.contains("pixelated")) {
                 img.classList.add("pixelated");
                 observer.observe(img);
             }
         });
     };
 
     observeImages(); // Initial observation
 
     // MutationObserver to detect dynamically added images
     const mutationObserver = new MutationObserver(() => {
         observeImages();
     });
 
     mutationObserver.observe(document.body, { childList: true, subtree: true });
 });
