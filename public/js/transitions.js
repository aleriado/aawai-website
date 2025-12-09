// =================== LOADER BYPASS (LOADING PAGE REMOVED) ===================

document.addEventListener("DOMContentLoaded", () => {
    // Immediately mark as loaded and notify listeners
    document.body.classList.add('loaded');
    const loaderCompleteEvent = new CustomEvent('loaderComplete');
    window.dispatchEvent(loaderCompleteEvent);
});

// -----------------------Hero Text-------------------------

document.addEventListener("DOMContentLoaded", () => {
    const heroText = document.querySelector(".hero-animated-text");
    const heroSubtext = document.querySelector(".hero-subtext");
    const heroButtons = document.querySelector(".hero-buttons");
    const counts = document.querySelectorAll(".count");
    if (!heroText) return;

    let animationDone = false;
    let loaderComplete = true; // loader removed, allow immediately

    // Wait for loader to complete before starting animations
    window.addEventListener('loaderComplete', () => {
        loaderComplete = true;
        // If hero text is already visible, start animation
        if (isInView(heroText) && !animationDone) {
            animationDone = true;
            runHeroAnimation(heroText);
        }
        // Trigger other hero elements if already in view
        revealExtrasIfInView();
    });

    // Create intersection observer for hero title
    const heroObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationDone && loaderComplete) {
                animationDone = true;
                heroObserver.unobserve(heroText);
                runHeroAnimation(heroText);
            }
        });
    }, { threshold: 0.1 });

    heroObserver.observe(heroText);

    // Observers for subtext, buttons, and counts so they animate only when visible and loader done
    const extras = [];
    if (heroSubtext) extras.push(heroSubtext);
    if (heroButtons) extras.push(heroButtons);

    const extrasObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting && loaderComplete) {
                if (el === heroSubtext || el === heroButtons) {
                    el.classList.add("visible");
                }
                extrasObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    extras.forEach(el => extrasObserver.observe(el));

    const countsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting && loaderComplete && el.dataset.done !== "true") {
                animateCount(el);
                countsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    counts.forEach(c => countsObserver.observe(c));

    // Helpers
    function isInView(el) {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    }

    function revealExtrasIfInView() {
        if (loaderComplete) {
            if (heroSubtext && isInView(heroSubtext)) heroSubtext.classList.add("visible");
            if (heroButtons && isInView(heroButtons)) heroButtons.classList.add("visible");
            counts.forEach(c => {
                if (isInView(c) && c.dataset.done !== "true") {
                    animateCount(c);
                    c.dataset.done = "true";
                }
            });
        }
    }

    // Animation function
    function runHeroAnimation(element) {
        const originalHTML = element.innerHTML;
        element.innerHTML = "";
        element.style.opacity = "1";

        const lines = originalHTML.split("<br>");

        lines.forEach((line, lineIndex) => {

            const lineSpan = document.createElement("span");
            lineSpan.style.display = "block";
            lineSpan.style.whiteSpace = "nowrap";

            line.split("").forEach((char, i) => {
                const span = document.createElement("span");
                span.textContent = char;
                span.style.display = "inline-block";
                span.style.opacity = "0";
                span.style.transform = "translateX(-30px) skewX(10deg)";
                span.style.filter = "blur(8px)";
                span.style.animation = "heroReveal 0.8s forwards";
                span.style.animationDelay = `${(lineIndex * 0.6) + (i * 0.02)}s`;
                lineSpan.appendChild(span);
            });

            element.appendChild(lineSpan);
        });
    }
});


// ------------------------- COUNT ANIMATION -----------------------------

function animateCount(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        const value = Math.floor(eased * target);

        el.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
            el.classList.add("active");
            el.dataset.done = "true";
        }
    }
    requestAnimationFrame(update);
}

// -------------------------Text Note Animation------------------------

document.addEventListener("DOMContentLoaded", () => {
    let loaderComplete = true; // loader removed, allow immediately

    // Wait for loader to complete
    window.addEventListener('loaderComplete', () => {
        loaderComplete = true;
    });

    const notes = document.querySelectorAll(".text-note");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && loaderComplete) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "0px 0px -100px 0px", // element must be 100px inside
        threshold: 0
    });

    notes.forEach(note => observer.observe(note));
});

// -------------------------Company Info----------------------------

document.addEventListener("DOMContentLoaded", () => {
    let loaderComplete = true; // loader removed, allow immediately

    // Wait for loader to complete
    window.addEventListener('loaderComplete', () => {
        loaderComplete = true;
    });

    const animatedSelectors = [
        ".company-info-text",
        ".btn-more",
        ".hero-subtext",
        ".hero-buttons",
        ".why-item",
        ".count"
    ];

    const allTargets = [];

    animatedSelectors.forEach(selector => {
        const found = document.querySelectorAll(selector);
        found.forEach(el => allTargets.push(el));
    });

    if (!allTargets.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.4 && loaderComplete) {

                // If it's a COUNT element → run animation
                if (entry.target.classList.contains("count")) {
                    if (entry.target.dataset.done !== "true") {
                        animateCount(entry.target);
                    }
                } else {
                    // Otherwise just add .visible like before
                    entry.target.classList.add("visible");
                }

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: [0, 0.4] });


    allTargets.forEach(el => observer.observe(el));
});

