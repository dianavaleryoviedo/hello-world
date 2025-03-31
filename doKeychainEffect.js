document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Add class based on alt text content for image blocks
  document.querySelectorAll('.sqs-block-image img').forEach(img => {
    const altText = img.alt ? img.alt.toLowerCase() : '';
    const imageBlock = img.closest('.sqs-block-image');

    if (!imageBlock) return;

    if (altText.includes('charm')) {
      imageBlock.classList.add('charm');
    }
    if (altText.includes('tamagotchi')) {
      imageBlock.classList.add('tamagotchi');
    }
  });

  // Find reference blocks (Tamagotchi images)
  const referenceBlocks = document.querySelectorAll('#floating-image');
  const charmImages = document.querySelectorAll('.sqs-block-image.charm');

  if (!referenceBlocks.length || !charmImages.length) {
    console.warn("Tamagotchi reference images or charm images not found!");
    return;
  }

  // Pin each charm image when it reaches the top of the nearest Tamagotchi reference block
  charmImages.forEach(imageBlock => {
    ScrollTrigger.create({
      trigger: imageBlock,
      start: "top bottom-=225",
      end: "bottom top",
      pin: imageBlock,
      pinSpacing: false,
      anticipatePin: 1,
      scrub: false,
      onToggle: self => {
        // Add .pinned class when the image is pinned, remove when unpinned
        if (self.isActive) {
          imageBlock.classList.add('pinned');
        } else {
          imageBlock.classList.remove('pinned');
        }
      }
    });
  });

  // Handle floating image behavior
  const floatingImage = document.querySelector("#floating-image");
  const footer = document.querySelector("footer");
  
  if (!floatingImage || !footer) return;

  // Function to update floating image position
  function updatePosition() {
    const viewportHeight = window.innerHeight;
    const imageHeight = floatingImage.offsetHeight;
    const footerTop = footer.getBoundingClientRect().top;
    
    // If footer is close to or in the viewport
    if (footerTop < viewportHeight) {
      // Calculate absolute position to "dock" at footer top
      const absoluteTop = window.pageYOffset + footerTop - imageHeight;
      
      // Switch to absolute positioning
      floatingImage.style.position = "absolute";
      floatingImage.style.bottom = "auto";
      floatingImage.style.top = absoluteTop + "px";
    } else {
      // Switch back to fixed positioning
      floatingImage.style.position = "fixed";
      floatingImage.style.top = "auto";
      floatingImage.style.bottom = "20px";
    }
  }

  // Initial check for floating image position
  updatePosition();
  
  // Update floating image position on scroll and resize
  window.addEventListener("scroll", updatePosition);
  window.addEventListener("resize", updatePosition);

  // Refresh ScrollTriggers if necessary (e.g., on window resize)
  window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
  });
});
