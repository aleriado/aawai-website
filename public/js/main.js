// Header visible / invisible
document.addEventListener("DOMContentLoaded", () => {
    let lastScroll = 0;
    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 300 && currentScroll > lastScroll) {
            // scrolling down → hide
            header.classList.add("hidden");
        } else {
            // scrolling up or near top → show
            header.classList.remove("hidden");
        }

        lastScroll = currentScroll;
    });
});

/*===================== Mobile Mode Header ================== */

const burger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    mobileMenu.classList.toggle("open");
});

/*===================== Blog Slider ================== */

document.addEventListener("DOMContentLoaded", () => {
    const sliderTrack = document.getElementById("blogSliderTrack");
    const originalContainers = document.querySelectorAll(".blog-container");
    const leftBtn = document.querySelector(".blog-slider-btn-left");
    const rightBtn = document.querySelector(".blog-slider-btn-right");
    
    if (!sliderTrack || !originalContainers.length) return;
    
    const totalItems = originalContainers.length;
    
    // Clone items for infinite loop
    // Clone last 2 items at the beginning and first 2 items at the end
    const cloneCount = 2;
    
    // Clone last items at the beginning
    for (let i = totalItems - cloneCount; i < totalItems; i++) {
        const clone = originalContainers[i].cloneNode(true);
        clone.classList.add("blog-clone");
        sliderTrack.insertBefore(clone, originalContainers[0]);
    }
    
    // Clone first items at the end
    for (let i = 0; i < cloneCount; i++) {
        const clone = originalContainers[i].cloneNode(true);
        clone.classList.add("blog-clone");
        sliderTrack.appendChild(clone);
    }
    
    // Get all containers including clones
    const allContainers = sliderTrack.querySelectorAll(".blog-container");
    const totalAllItems = allContainers.length;
    
    // Start at the middle of original items (index 2 of 5 = index 2)
    // After adding clones at the beginning, this becomes index 2 + cloneCount
    const middleIndex = Math.floor(totalItems / 2); // Index 2 for 5 items
    let currentIndex = cloneCount + middleIndex; // Start at index 4 (after 2 clones)
    
    let autoAdvanceTimer = null;
    let autoAdvanceRestartTimer = null;
    const AUTO_ADVANCE_INTERVAL = 3000; // 3 seconds
    const AUTO_ADVANCE_RESTART_DELAY = 5000; // 5 seconds after last click
    
    // Calculate item width including gap
    function getItemWidth() {
        const firstItem = allContainers[0];
        if (!firstItem) return 0;
        const itemWidth = firstItem.offsetWidth;
        const trackStyle = window.getComputedStyle(sliderTrack);
        const gap = parseFloat(trackStyle.gap) || 20;
        return itemWidth + gap;
    }
    
    // Get slider container width (the visible area)
    function getSliderWidth() {
        const slider = sliderTrack.parentElement;
        return slider.offsetWidth;
    }
    
    // Update slider position and active state
    function updateSlider(disableTransition = false) {
        // Wait for next frame to ensure layout is calculated
        requestAnimationFrame(() => {
            const itemWidth = getItemWidth();
            const sliderWidth = getSliderWidth();
            
            // Calculate center position
            const centerPosition = sliderWidth / 2;
            const itemCenter = itemWidth / 2;
            
            // Calculate how much to translate to center the current item
            const translateX = centerPosition - itemCenter - (currentIndex * itemWidth);
            
            if (disableTransition) {
                sliderTrack.style.transition = "none";
                sliderTrack.style.transform = `translateX(${translateX}px)`;
                // Force reflow
                sliderTrack.offsetHeight;
                sliderTrack.style.transition = "";
            } else {
                sliderTrack.style.transform = `translateX(${translateX}px)`;
            }
            
            // Update active state
            allContainers.forEach((container, index) => {
                if (index === currentIndex) {
                    container.classList.add("active");
                } else {
                    container.classList.remove("active");
                }
            });
        });
    }
    
    let isTransitioning = false;
    let pendingLoop = false;
    
    // Handle infinite loop after transition completes
    function handleLoopAfterTransition() {
        if (!pendingLoop) return;
        
        // Check if we're in cloned items and need to jump
        if (currentIndex >= cloneCount + totalItems) {
            // We're in the cloned items at the end
            // These clones correspond to the first original items
            // Example: If cloneCount=2, totalItems=5:
            //   Index 7 (clone of original 0) -> jump to index 2 (original 0)
            //   Index 8 (clone of original 1) -> jump to index 3 (original 1)
            const offset = currentIndex - (cloneCount + totalItems);
            currentIndex = cloneCount + offset;
            updateSlider(true); // Instant jump without transition
        } else if (currentIndex < cloneCount) {
            // We're in the cloned items at the beginning
            // These clones correspond to the last original items
            // Example: If cloneCount=2, totalItems=5:
            //   Index 0 (clone of original 3) -> jump to index 5 (original 3)
            //   Index 1 (clone of original 4) -> jump to index 6 (original 4)
            const offset = currentIndex;
            currentIndex = totalItems + offset;
            updateSlider(true); // Instant jump without transition
        }
        
        isTransitioning = false;
        pendingLoop = false;
    }
    
    // Listen for transition end
    sliderTrack.addEventListener('transitionend', (e) => {
        // Only handle transform transitions, ignore other transitions
        if (e.propertyName === 'transform') {
            if (pendingLoop) {
                handleLoopAfterTransition();
            } else {
                isTransitioning = false;
            }
        }
    });
    
    // Go to next item
    function nextSlide(isAutoAdvance = false) {
        if (isTransitioning && !isAutoAdvance) return; // Prevent rapid clicks
        
        currentIndex++;
        isTransitioning = true;
        
        // Check if we'll be in cloned items after increment
        if (currentIndex >= cloneCount + totalItems) {
            // We're about to enter cloned items at the end
            // Allow smooth transition to the clone, then jump after transition
            pendingLoop = true;
            updateSlider(); // Smooth transition to clone
        } else {
            // Normal transition within original items
            updateSlider();
            if (!isAutoAdvance) {
                resetAutoAdvance();
            }
        }
    }
    
    // Go to previous item
    function prevSlide() {
        if (isTransitioning) return; // Prevent rapid clicks
        
        currentIndex--;
        isTransitioning = true;
        
        // Check if we'll be in cloned items after decrement
        if (currentIndex < cloneCount) {
            // We're about to enter cloned items at the beginning
            // Allow smooth transition to the clone, then jump after transition
            pendingLoop = true;
            updateSlider(); // Smooth transition to clone
        } else {
            // Normal transition within original items
            updateSlider();
        }
        resetAutoAdvance();
    }
    
    // Auto-advance functionality
    function startAutoAdvance() {
        // Clear any existing restart timer since we're starting now
        if (autoAdvanceRestartTimer) {
            clearTimeout(autoAdvanceRestartTimer);
            autoAdvanceRestartTimer = null;
        }
        // Clear any existing auto-advance timer
        stopAutoAdvance();
        // Start auto-advance
        autoAdvanceTimer = setInterval(() => {
            nextSlide(true); // Pass true to indicate auto-advance
        }, AUTO_ADVANCE_INTERVAL);
    }
    
    function stopAutoAdvance() {
        if (autoAdvanceTimer) {
            clearInterval(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
    }
    
    function resetAutoAdvance() {
        // Stop current auto-advance
        stopAutoAdvance();
        // Clear any existing restart timer
        if (autoAdvanceRestartTimer) {
            clearTimeout(autoAdvanceRestartTimer);
            autoAdvanceRestartTimer = null;
        }
        // Set a new timer to restart auto-advance after 5 seconds of inactivity
        // This ensures auto-advance only resumes if no button is clicked for 5 seconds
        autoAdvanceRestartTimer = setTimeout(() => {
            startAutoAdvance();
            autoAdvanceRestartTimer = null;
        }, AUTO_ADVANCE_RESTART_DELAY);
    }
    
    function disableAutoAdvance() {
        // Stop auto-advance and clear restart timer
        stopAutoAdvance();
        if (autoAdvanceRestartTimer) {
            clearTimeout(autoAdvanceRestartTimer);
            autoAdvanceRestartTimer = null;
        }
    }
    
    // Event listeners
    if (leftBtn) {
        leftBtn.addEventListener("click", () => {
            prevSlide();
        });
    }
    
    if (rightBtn) {
        rightBtn.addEventListener("click", () => {
            nextSlide();
        });
    }
    
    // Pause auto-advance on hover
    const sliderWrapper = document.querySelector(".blog-slider-wrapper");
    if (sliderWrapper) {
        sliderWrapper.addEventListener("mouseenter", () => {
            disableAutoAdvance();
        });
        sliderWrapper.addEventListener("mouseleave", () => {
            // Only restart if not already scheduled to restart
            if (!autoAdvanceRestartTimer && !autoAdvanceTimer) {
                resetAutoAdvance();
            }
        });
    }
    
    // Initialize after a short delay to ensure layout is ready
    setTimeout(() => {
        updateSlider();
        startAutoAdvance();
    }, 100);
    
    // Update on window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlider();
        }, 250);
    });
});