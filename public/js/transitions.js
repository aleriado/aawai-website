// -----------------------Hero Text-------------------------

document.addEventListener("DOMContentLoaded", () => {
    const heroText = document.querySelector(".hero-animated-text");
    if (!heroText) return;

    let animationDone = false;

    // Create intersection observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationDone) {
                animationDone = true;
                observer.unobserve(heroText);
                runHeroAnimation(heroText);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(heroText);

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

    const notes = document.querySelectorAll(".text-note");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
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
            if (entry.intersectionRatio >= 0.4) {

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

