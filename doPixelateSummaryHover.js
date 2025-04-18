(function () {
  console.log("Pixelation script with MutationObserver loaded!");

  const observer = new MutationObserver((mutationsList, observer) => {
    const containers = document.querySelectorAll(".summary-thumbnail-container");

    containers.forEach((container, i) => {
      const alreadyProcessed = container.getAttribute("data-pixelation-applied");
      if (alreadyProcessed) return;

      const alternateImg = container.querySelector("img.summary-thumbnail-image-alternate");
      const primaryImg = container.querySelector("img.summary-thumbnail-image");

      if (!alternateImg || !primaryImg) return;

      const imageUrl = alternateImg.src || alternateImg.getAttribute("data-src");

      if (!imageUrl) {
        console.warn(`No image URL found in container #${i}`, alternateImg);
        return;
      }

      console.log(`Setting up pixelation effect for container #${i}`);

      const wrapper = document.createElement("div");
      wrapper.classList.add("pixelation-wrapper");

      Object.assign(wrapper.style, {
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      });

      const overlay = document.createElement("div");
      overlay.classList.add("pixelation-overlay");

      // We'll explicitly size the overlay to match the primary image
      const primaryImgRect = primaryImg.getBoundingClientRect();

      Object.assign(overlay.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: `${primaryImg.offsetWidth}px`,
        height: `${primaryImg.offsetHeight}px`,
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gridTemplateRows: "repeat(5, 1fr)",
        zIndex: "2",
        pointerEvents: "none",
      });

      const tiles = [];
      const maxDelay = 400;
      const transitionTime = 200;

      for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
          const tile = document.createElement("div");

          Object.assign(tile.style, {
            backgroundImage: `url("${imageUrl}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "500% 500%",
            backgroundPosition: `${x * 25}% ${y * 25}%`,
            transition: `opacity ${transitionTime}ms ease-out`,
            opacity: "0",
            width: "100%",
            height: "100%",
          });

          tile.classList.add("tile");

          overlay.appendChild(tile);
          tiles.push(tile);
        }
      }

      wrapper.appendChild(overlay);

      container.style.position = "relative";
      container.appendChild(wrapper);
      container.setAttribute("data-pixelation-applied", "true");

      container.addEventListener("mouseenter", () => {
        tiles.forEach(tile => {
          const delay = Math.floor(Math.random() * maxDelay);
          tile.style.transition = `opacity ${transitionTime}ms ${delay}ms ease-out`;
          tile.style.opacity = "1";
        });
      });

      container.addEventListener("mouseleave", () => {
        tiles.forEach(tile => {
          const delay = Math.floor(Math.random() * maxDelay);
          tile.style.transition = `opacity ${transitionTime}ms ${delay}ms ease-out`;
          tile.style.opacity = "0";
        });
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  setTimeout(() => {
    console.log("MutationObserver disconnected (timeout).");
    observer.disconnect();
  }, 5000);
})();
