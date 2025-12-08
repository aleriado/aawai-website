// =================== AI ROBOT ASSEMBLY LOADER ===================

document.addEventListener("DOMContentLoaded", () => {
    const loaderWrapper = document.getElementById("loader-wrapper");
    if (!loaderWrapper) return;
    
    const robotParts = {
        head: document.querySelector('.robot-part.head'),
        torso: document.querySelector('.robot-part.torso'),
        leftArm: document.querySelector('.robot-part.left-arm'),
        rightArm: document.querySelector('.robot-part.right-arm'),
        leftLeg: document.querySelector('.robot-part.left-leg'),
        rightLeg: document.querySelector('.robot-part.right-leg'),
        thumb: document.querySelector('.robot-thumb')
    };
    
    const eyes = document.querySelectorAll('.robot-eye');
    const joints = document.querySelectorAll('.robot-joint');
    const loadingBarFill = document.getElementById('loadingBarFill');
    const loadingText = document.getElementById('loadingText');
    
    const loadingMessages = [
        'Initializing AI...',
        'Loading neural networks...',
        'Assembling components...',
        'Calibrating systems...',
        'Almost ready...',
        'Complete!'
    ];
    
    let currentProgress = 0;
    const totalDuration = 3000; // 3 seconds total
    const partDelays = {
        head: 200,
        torso: 600,
        leftArm: 1000,
        rightArm: 1200,
        leftLeg: 1400,
        rightLeg: 1600,
        thumb: 2400
    };
    
    // Start assembly sequence
    function startAssembly() {
        // Assemble head
        setTimeout(() => {
            if (robotParts.head) {
                robotParts.head.classList.add('assembled');
                updateProgress(15);
                updateLoadingText(0);
            }
        }, partDelays.head);
        
        // Activate eyes and blink
        setTimeout(() => {
            eyes.forEach(eye => eye.classList.add('active'));
            updateProgress(25);
        }, partDelays.head + 400);
        
        // Assemble torso
        setTimeout(() => {
            if (robotParts.torso) {
                robotParts.torso.classList.add('assembled');
                // Activate joints on torso
                joints[0]?.classList.add('active');
                joints[1]?.classList.add('active');
                updateProgress(35);
                updateLoadingText(1);
            }
        }, partDelays.torso);
        
        // Assemble left arm
        setTimeout(() => {
            if (robotParts.leftArm) {
                robotParts.leftArm.classList.add('assembled');
                joints[2]?.classList.add('active');
                updateProgress(50);
                updateLoadingText(2);
            }
        }, partDelays.leftArm);
        
        // Assemble right arm
        setTimeout(() => {
            if (robotParts.rightArm) {
                robotParts.rightArm.classList.add('assembled');
                joints[3]?.classList.add('active');
                updateProgress(65);
            }
        }, partDelays.rightArm);
        
        // Assemble left leg
        setTimeout(() => {
            if (robotParts.leftLeg) {
                robotParts.leftLeg.classList.add('assembled');
                joints[4]?.classList.add('active');
                updateProgress(80);
                updateLoadingText(3);
            }
        }, partDelays.leftLeg);
        
        // Assemble right leg
        setTimeout(() => {
            if (robotParts.rightLeg) {
                robotParts.rightLeg.classList.add('assembled');
                joints[5]?.classList.add('active');
                updateProgress(95);
                updateLoadingText(4);
            }
        }, partDelays.rightLeg);
        
        // Show thumbs up
        setTimeout(() => {
            if (robotParts.thumb) {
                robotParts.thumb.classList.add('show');
                updateProgress(100);
                updateLoadingText(5);
                
                // Final blink
                setTimeout(() => {
                    eyes.forEach(eye => {
                        eye.style.animation = 'blink 0.3s ease 3';
                    });
                }, 200);
            }
        }, partDelays.thumb);
        
        // Hide loader after completion
        setTimeout(() => {
            loaderWrapper.classList.add('loaded');
            document.body.classList.add('loaded');
            
            // Remove loader from DOM after transition
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
            }, 700);
        }, partDelays.thumb + 800);
    }
    
    function updateProgress(percent) {
        if (loadingBarFill) {
            loadingBarFill.style.width = percent + '%';
        }
    }
    
    function updateLoadingText(index) {
        if (loadingText && loadingMessages[index]) {
            loadingText.textContent = loadingMessages[index];
        }
    }
    
    // Start animation when page loads
    window.addEventListener('load', () => {
        startAssembly();
    });
    
    // Fallback: start after a short delay if load event already fired
    setTimeout(() => {
        if (!loaderWrapper.classList.contains('loaded')) {
            startAssembly();
        }
    }, 100);
});

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

