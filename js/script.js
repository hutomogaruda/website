/**
 * File: js/script.js
 * Deskripsi: Skrip ini mengelola semua interaktivitas di website HKP Kemayoran.
 */

document.addEventListener('DOMContentLoaded', function() {

    // --- FUNGSI NAVIGASI MOBILE (HAMBURGER MENU) ---
    const nav = document.querySelector("#nav-links");
    const navToggle = document.querySelector(".mobile-nav-toggle");
    const body = document.body;

    if (navToggle && nav) {
        navToggle.addEventListener("click", () => {
            const isVisible = nav.getAttribute("data-visible") === "true";
            
            if (!isVisible) {
                nav.setAttribute("data-visible", true);
                navToggle.setAttribute("aria-expanded", true);
                body.classList.add("no-scroll");
            } else {
                nav.setAttribute("data-visible", false);
                navToggle.setAttribute("aria-expanded", false);
                body.classList.remove("no-scroll");
            }
        });
    }

    // --- FUNGSI 1: ANIMASI SAAT SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');
    if (window.IntersectionObserver) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        revealElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // --- FUNGSI 2: TEKS BERPUTAR DI FINAL CTA ---
    const rotatingTexts = ["Ke kampus tanpa nebeng", "Jalan-jalan ke Puncak", "Antar keluarga dengan aman", "Pergi kerja tanpa ojek"];
    const rotatingTextElement = document.getElementById('rotating-text');
    let rotatingIndex = 0;
    if (rotatingTextElement) {
        setInterval(() => {
            rotatingIndex = (rotatingIndex + 1) % rotatingTexts.length;
            rotatingTextElement.style.opacity = '0';
            setTimeout(() => {
                rotatingTextElement.textContent = rotatingTexts[rotatingIndex];
                rotatingTextElement.style.opacity = '1';
            }, 500);
        }, 2500);
    }

    // --- FUNGSI 3: FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            item.classList.toggle('active');
        });
    });

    // --- FUNGSI 4: SLIDER TESTIMONI INTERAKTIF ---
    const testimonialSlider = document.querySelector('.testimonial-slider-viewport');
    if (testimonialSlider) {
        const track = testimonialSlider.querySelector('.testimonial-track');
        const slides = Array.from(track.children);
        const dotsNav = document.querySelector('.testimonial-navigation');
        let slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            if (targetIndex < 0 || targetIndex >= slides.length) return;
            
            const amountToMove = targetIndex * slideWidth;
            track.style.transition = 'transform 0.5s ease-out';
            track.style.transform = `translateX(-${amountToMove}px)`;

            const dots = dotsNav.children;
            if (dots.length > 0) {
                Array.from(dots).forEach(dot => dot.classList.remove('active'));
                dots[targetIndex].classList.add('active');
            }
            
            currentIndex = targetIndex;
        };
        
        if (slides.length > 0) {
            dotsNav.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('nav-dot');
                dotsNav.appendChild(dot);
                dot.addEventListener('click', () => moveToSlide(index));
            });
            dotsNav.children[0].classList.add('active');
        }

        let isDragging = false, startPos = 0, currentTranslate = 0, prevTranslate = 0;
        const getPositionX = (event) => event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;

        const dragStart = (event) => {
            isDragging = true;
            startPos = getPositionX(event);
            const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
            prevTranslate = transformMatrix !== 'none' ? parseFloat(transformMatrix.split(',')[4]) : 0;
            track.style.transition = 'none';
        };

        const dragging = (event) => {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                const move = currentPosition - startPos;
                currentTranslate = prevTranslate + move;
                track.style.transform = `translateX(${currentTranslate}px)`;
            }
        };

        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -75 && currentIndex < slides.length - 1) currentIndex++;
            if (movedBy > 75 && currentIndex > 0) currentIndex--;

            moveToSlide(currentIndex);
        };
        
        const setupSlider = () => {
            if (slides.length === 0) return;
            slideWidth = slides[0].getBoundingClientRect().width;
            moveToSlide(currentIndex);
        };

        testimonialSlider.addEventListener('mousedown', dragStart);
        testimonialSlider.addEventListener('mouseup', dragEnd);
        testimonialSlider.addEventListener('mouseleave', dragEnd);
        testimonialSlider.addEventListener('mousemove', dragging);

        testimonialSlider.addEventListener('touchstart', dragStart, { passive: true });
        testimonialSlider.addEventListener('touchend', dragEnd);
        testimonialSlider.addEventListener('touchmove', dragging, { passive: true });
        
        window.addEventListener('resize', setupSlider);
        
        setupSlider();
    }
});
