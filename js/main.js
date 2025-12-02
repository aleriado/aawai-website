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
