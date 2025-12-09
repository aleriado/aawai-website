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
    const originalContainers = Array.from(document.querySelectorAll(".blog-container"));
    const leftBtn = document.querySelector(".blog-slider-btn-left");
    const rightBtn = document.querySelector(".blog-slider-btn-right");
    
    if (!sliderTrack || !originalContainers.length) return;
    
    const totalItems = originalContainers.length;
    
    // Convert NodeList to Array for easier manipulation
    let blogItems = [...originalContainers];
    
    // Start at the middle item (index 2 for 5 items)
    const middleIndex = Math.floor(totalItems / 2);
    let currentIndex = middleIndex; // Always the center index
    
    let autoAdvanceTimer = null;
    let autoAdvanceRestartTimer = null;
    const AUTO_ADVANCE_INTERVAL = 3000; // 3 seconds
    
    // Calculate item width including gap
    function getItemWidth() {
        const firstItem = blogItems[0];
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
    
    // Reorder DOM elements to match blogItems array
    function reorderDOM() {
        blogItems.forEach(item => {
            sliderTrack.appendChild(item);
        });
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
            
            // Calculate how much to translate to center the current item (always at middleIndex)
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
            
            // Update active state - currentIndex is always the center (middleIndex)
            blogItems.forEach((container, index) => {
                if (index === currentIndex) {
                    container.classList.add("active");
                } else {
                    container.classList.remove("active");
                }
            });
        });
    }
    
    let isTransitioning = false;
    let slideOffset = 0; // Track cumulative slide offset
    
    // Listen for transition end
    sliderTrack.addEventListener('transitionend', (e) => {
        // Only handle transform transitions, ignore other transitions
        if (e.propertyName === 'transform') {
            // After slide completes, reorder items and reset position invisibly
            const itemWidth = getItemWidth();
            
            if (slideOffset !== 0) {
                // Reorder based on slide direction
                if (slideOffset < 0) {
                    // Slid left - move first item to end
                    const firstItem = blogItems.shift();
                    blogItems.push(firstItem);
                } else {
                    // Slid right - move last item to beginning
                    const lastItem = blogItems.pop();
                    blogItems.unshift(lastItem);
                }
                
                // Reorder DOM
                reorderDOM();
                
                // Reset transform position invisibly (no transition)
                const sliderWidth = getSliderWidth();
                const centerPosition = sliderWidth / 2;
                const itemCenter = itemWidth / 2;
                const targetX = centerPosition - itemCenter - (currentIndex * itemWidth);
                
                sliderTrack.style.transition = "none";
                sliderTrack.style.transform = `translateX(${targetX}px)`;
                sliderTrack.offsetHeight; // Force reflow
                sliderTrack.style.transition = "";
                
                // Reset offset
                slideOffset = 0;
                
                // Active state is already correct (was set before slide started)
                // Just ensure it's still correct after reordering
                blogItems.forEach((container, index) => {
                    if (index === currentIndex) {
                        container.classList.add("active");
                    } else {
                        container.classList.remove("active");
                    }
                });
            }
            
            // Re-enable buttons after transition completes
            isTransitioning = false;
            setButtonsEnabled(true);
        }
    });
    
    // Update button states
    function setButtonsEnabled(enabled) {
        if (leftBtn) {
            leftBtn.disabled = !enabled;
            leftBtn.style.pointerEvents = enabled ? 'auto' : 'none';
            leftBtn.style.opacity = enabled ? '1' : '0.5';
        }
        if (rightBtn) {
            rightBtn.disabled = !enabled;
            rightBtn.style.pointerEvents = enabled ? 'auto' : 'none';
            rightBtn.style.opacity = enabled ? '1' : '0.5';
        }
    }
    
    // Go to next item (slide left - items flow to the left)
    function nextSlide(isAutoAdvance = false) {
        if (isTransitioning) return; // Prevent all clicks during transition
        
        isTransitioning = true;
        setButtonsEnabled(false); // Disable buttons during transition
        
        // Get current transform
        const currentTransform = sliderTrack.style.transform;
        let currentX = 0;
        if (currentTransform) {
            const match = currentTransform.match(/translateX\(([^)]+)\)/);
            if (match) {
                currentX = parseFloat(match[1]);
            }
        }
        
        // Calculate item width
        const itemWidth = getItemWidth();
        
        // Determine which item will become active after the slide
        // When sliding left, the next item (currentIndex + 1) will be at center
        const nextActiveIndex = (currentIndex + 1) % totalItems;
        
        // Update active state IMMEDIATELY so zoom happens simultaneously with slide
        blogItems.forEach((container, index) => {
            if (index === nextActiveIndex) {
                container.classList.add("active");
            } else {
                container.classList.remove("active");
            }
        });
        
        // Slide left by one item width (negative direction)
        const targetX = currentX - itemWidth;
        slideOffset = -itemWidth;
        
        // Animate the slide - this creates the flowing effect
        // The zoom will happen simultaneously because active class is already applied
        sliderTrack.style.transform = `translateX(${targetX}px)`;
        
        if (!isAutoAdvance) {
            resetAutoAdvance();
        }
    }
    
    // Go to previous item (slide right - items flow to the right)
    function prevSlide() {
        if (isTransitioning) return; // Prevent all clicks during transition
        
        isTransitioning = true;
        setButtonsEnabled(false); // Disable buttons during transition
        
        // Get current transform
        const currentTransform = sliderTrack.style.transform;
        let currentX = 0;
        if (currentTransform) {
            const match = currentTransform.match(/translateX\(([^)]+)\)/);
            if (match) {
                currentX = parseFloat(match[1]);
            }
        }
        
        // Calculate item width
        const itemWidth = getItemWidth();
        
        // Determine which item will become active after the slide
        // When sliding right, the previous item (currentIndex - 1) will be at center
        const prevActiveIndex = (currentIndex - 1 + totalItems) % totalItems;
        
        // Update active state IMMEDIATELY so zoom happens simultaneously with slide
        blogItems.forEach((container, index) => {
            if (index === prevActiveIndex) {
                container.classList.add("active");
            } else {
                container.classList.remove("active");
            }
        });
        
        // Slide right by one item width (positive direction)
        const targetX = currentX + itemWidth;
        slideOffset = itemWidth;
        
        // Animate the slide - this creates the flowing effect
        // The zoom will happen simultaneously because active class is already applied
        sliderTrack.style.transform = `translateX(${targetX}px)`;
        
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
        // Set a new timer to restart auto-advance after 3 seconds
        autoAdvanceRestartTimer = setTimeout(() => {
            startAutoAdvance();
            autoAdvanceRestartTimer = null;
        }, AUTO_ADVANCE_INTERVAL);
    }
    
    // Event listeners for navigation buttons
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
    
    // Event listeners for blog item clicks - clicking a blog advances to next
    blogItems.forEach((blogItem) => {
        blogItem.addEventListener("click", () => {
            if (!isTransitioning) {
                nextSlide();
            }
        });
        // Add cursor pointer style
        blogItem.style.cursor = "pointer";
    });
    
    // Wait for loader to complete before initializing
    function initializeBlogSlider() {
        // Set initial active state
        blogItems.forEach((container, index) => {
            if (index === currentIndex) {
                container.classList.add("active");
            } else {
                container.classList.remove("active");
            }
        });
        updateSlider();
        setButtonsEnabled(true); // Ensure buttons are enabled
        startAutoAdvance();
    }
    
    // Listen for loader completion
    window.addEventListener('loaderComplete', () => {
        // Initialize after a short delay to ensure layout is ready
        setTimeout(() => {
            initializeBlogSlider();
        }, 100);
    });
    
    // Fallback: if loader already completed, initialize immediately
    if (document.body.classList.contains('loaded')) {
        setTimeout(() => {
            initializeBlogSlider();
        }, 100);
    }
    
    // Update on window resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlider();
        }, 250);
    });
});

/*===================== Business Item Animation ================== */

document.addEventListener("DOMContentLoaded", () => {
    let loaderComplete = true; // loader removed, allow immediately

    // Wait for loader to complete
    window.addEventListener('loaderComplete', () => {
        loaderComplete = true;
    });

    // Observer for business-item containers
    const businessItems = document.querySelectorAll(".business-item");
    const businessItemsArray = Array.prototype.slice.call(businessItems);
    
    const businessOptions = {
        root: null,
        rootMargin: "0% 0% -10% 0%",
        threshold: 0.1,
    };
    
    const businessObserver = new IntersectionObserver(businessCallback, businessOptions);
    businessItemsArray.forEach((item) => {
        businessObserver.observe(item);
    });
    
    function businessCallback(entries) {
        entries.forEach(function (entry, i) {
            const target = entry.target;
            if (entry.isIntersecting && !target.classList.contains("_show") && loaderComplete) {
                const delay = i * 100;
                setTimeout(function () {
                    target.classList.add("_show");
                }, delay);
            }
        });
    }
    
    // Observer for images with unfolding animation
    const target = document.querySelectorAll(".js-io");
    const targetArray = Array.prototype.slice.call(target);
    
    const imageOptions = {
        root: null,
        rootMargin: "0% 0% -10% 0%",
        threshold: 0.5, // wait until half visible to unfold
    };
    
    const imageObserver = new IntersectionObserver(imageCallback, imageOptions);
    targetArray.forEach((tgt) => {
        imageObserver.observe(tgt);
    });

    // Reveal images already in view on load
    revealVisibleImages();
    window.addEventListener('scroll', revealVisibleImages, { passive: true });
    window.addEventListener('resize', revealVisibleImages);
    
    function imageCallback(entries) {
        entries.forEach(function (entry, i) {
            const target = entry.target;
            if (entry.isIntersecting && !target.classList.contains("_show") && loaderComplete) {
                // Ensure parent card is already revealed
                const parent = target.closest(".business-item");
                if (parent && !parent.classList.contains("_show")) {
                    return;
                }
                const delay = i * 100;
                setTimeout(function () {
                    target.classList.add("_show");
                }, delay);
            }
        });
    }

    function isInView(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
    }

    function revealVisibleImages() {
        targetArray.forEach((tgt) => {
            if (!tgt.classList.contains("_show") && loaderComplete && isInView(tgt)) {
                tgt.classList.add("_show");
            }
        });
    }
});

/*===================== Privacy Policy Scroll Animations ================== */

// Wait for page to fully load before starting animations
window.addEventListener('load', () => {
    // Only run on privacy policy page
    const privacyContent = document.querySelector('.privacypolicy-content');
    if (!privacyContent) return;

    const animatedElements = document.querySelectorAll('.pp-animate');
    
    if (animatedElements.length === 0) return;

    // Small delay to ensure page is fully rendered
    setTimeout(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0% 0% -10% 0%',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
                    // Stagger animations for smooth reveal
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach((el) => {
            observer.observe(el);
        });

        // If elements are already visible on load, trigger them immediately
        animatedElements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
            if (isVisible && !el.classList.contains('visible')) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 100);
            }
        });
    }, 300);
});