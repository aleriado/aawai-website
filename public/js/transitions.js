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
        'AIが自己組み立て中...',
        '学習中...',
        '思考中...',
        'システム起動中...',
        '分析中...',
        'あと少しで完成...',
        'AIが完了しました!'
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
    
    // Start assembly sequence - ALL ANIMATIONS START TOGETHER
    function startAssembly() {
        
        // Activate ALL robot parts simultaneously
        if (robotParts.head) {
            robotParts.head.classList.add('assembled');
        }
        if (robotParts.torso) {
            robotParts.torso.classList.add('assembled');
        }
        if (robotParts.leftArm) {
            robotParts.leftArm.classList.add('assembled');
        }
        if (robotParts.rightArm) {
            robotParts.rightArm.classList.add('assembled');
        }
        if (robotParts.leftLeg) {
            robotParts.leftLeg.classList.add('assembled');
        }
        if (robotParts.rightLeg) {
            robotParts.rightLeg.classList.add('assembled');
        }
        
        // Activate ALL joints simultaneously
        joints.forEach(joint => {
            if (joint) joint.classList.add('active');
        });
        
        // Activate eyes immediately
        eyes.forEach(eye => eye.classList.add('active'));
        
        // Start progress bar animation - match actual loading duration
        updateProgress(0);
        updateLoadingText(0);
        
        const totalLoadingTime = 3000; // 3 seconds total
        const progressUpdateInterval = 16; // ~60fps for smooth animation
        const progressIncrement = (100 / (totalLoadingTime / progressUpdateInterval));
        
        let currentProgress = 0;
        const startTime = Date.now();
        
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            currentProgress = Math.min((elapsed / totalLoadingTime) * 100, 100);
            
            updateProgress(Math.floor(currentProgress));
            
            // Update loading text at different progress points
            if (currentProgress >= 15 && currentProgress < 30) {
                updateLoadingText(1);
            } else if (currentProgress >= 30 && currentProgress < 50) {
                updateLoadingText(2);
            } else if (currentProgress >= 50 && currentProgress < 70) {
                updateLoadingText(3);
            } else if (currentProgress >= 70 && currentProgress < 90) {
                updateLoadingText(4);
            } else if (currentProgress >= 90 && currentProgress < 98) {
                updateLoadingText(5);
            }
            
            if (currentProgress >= 100) {
                clearInterval(progressInterval);
                updateProgress(100);
            }
        }, progressUpdateInterval);
        
        // Show thumbs up at 95% progress
        setTimeout(() => {
            if (robotParts.thumb) {
                robotParts.thumb.classList.add('show');
                updateLoadingText(6);
                
                // Final blink
                setTimeout(() => {
                    eyes.forEach(eye => {
                        eye.style.animation = 'blink 0.3s ease 3';
                    });
                }, 200);
            }
        }, 2800);
        
        // Hide loader after completion
        setTimeout(() => {
            loaderWrapper.classList.add('loaded');
            document.body.classList.add('loaded');
            
            // Dispatch custom event to signal loader is complete
            const loaderCompleteEvent = new CustomEvent('loaderComplete');
            window.dispatchEvent(loaderCompleteEvent);
            
            // Remove loader from DOM after transition
            setTimeout(() => {
                loaderWrapper.style.display = 'none';
            }, 700);
        }, totalLoadingTime);
    }
    
    function updateProgress(percent) {
        if (loadingBarFill) {
            loadingBarFill.style.width = percent + '%';
        }
    }
    
    function updateLoadingText(index) {
        if (loadingText && loadingMessages[index]) {
            loadingText.style.opacity = '0';
            setTimeout(() => {
                loadingText.textContent = loadingMessages[index];
                loadingText.style.opacity = '1';
            }, 150);
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
    const heroSubtext = document.querySelector(".hero-subtext");
    const heroButtons = document.querySelector(".hero-buttons");
    const counts = document.querySelectorAll(".count");
    if (!heroText) return;

    let animationDone = false;
    let loaderComplete = false;

    // Wait for loader to complete before starting animations
    window.addEventListener('loaderComplete', () => {
        loaderComplete = true;
        // If hero text is already visible, start animation
        if (heroText.getBoundingClientRect().top < window.innerHeight) {
            if (!animationDone) {
                animationDone = true;
                runHeroAnimation(heroText);
            }
        }
    });

    // Create intersection observer
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationDone && loaderComplete) {
                animationDone = true;
                observer.unobserve(heroText);
                runHeroAnimation(heroText);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(heroText);

    // Ensure subtext, buttons, and counts become visible once loader finishes
    window.addEventListener('loaderComplete', () => {
        loaderComplete = true;
        if (heroSubtext) {
            heroSubtext.classList.add("visible");
        }
        if (heroButtons) {
            heroButtons.classList.add("visible");
        }
        counts.forEach(countEl => {
            if (countEl.dataset.done !== "true") {
                animateCount(countEl);
            }
        });
    });

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
    let loaderComplete = false;

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
    let loaderComplete = false;

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

