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
    const blogContainers = document.querySelectorAll(".blog-container");
    const leftBtn = document.querySelector(".blog-slider-btn-left");
    const rightBtn = document.querySelector(".blog-slider-btn-right");
    
    if (!sliderTrack || !blogContainers.length) return;
    
    let currentIndex = 0;
    const totalItems = blogContainers.length;
    
    // Calculate item width including gap
    function getItemWidth() {
        const firstItem = blogContainers[0];
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
    function updateSlider() {
        // Wait for next frame to ensure layout is calculated
        requestAnimationFrame(() => {
            const itemWidth = getItemWidth();
            const sliderWidth = getSliderWidth();
            
            // Calculate center position
            // We want the active item to be centered in the slider
            const centerPosition = sliderWidth / 2;
            const itemCenter = itemWidth / 2;
            
            // Calculate how much to translate to center the current item
            const translateX = centerPosition - itemCenter - (currentIndex * itemWidth);
            
            sliderTrack.style.transform = `translateX(${translateX}px)`;
            
            // Update active state
            blogContainers.forEach((container, index) => {
                if (index === currentIndex) {
                    container.classList.add("active");
                } else {
                    container.classList.remove("active");
                }
            });
        });
    }
    
    // Go to next item
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateSlider();
    }
    
    // Go to previous item
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateSlider();
    }
    
    // Event listeners
    if (leftBtn) {
        leftBtn.addEventListener("click", prevSlide);
    }
    
    if (rightBtn) {
        rightBtn.addEventListener("click", nextSlide);
    }
    
    // Initialize after a short delay to ensure layout is ready
    setTimeout(() => {
        updateSlider();
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