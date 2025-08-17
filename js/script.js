/**
 * File: D:/project/hutomo/js/script.js
 * Deskripsi: Skrip ini mengelola semua interaktivitas di website Hutomo Driving School.
 */

document.addEventListener('DOMContentLoaded', function() {

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
        // Fallback for older browsers that don't support IntersectionObserver
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // --- FUNGSI 2: TEKS BERPUTAR DI FINAL CTA ---
    const rotatingTexts = ["Ke kampus tanpa nebeng", "Jalan-jalan ke Puncak", "Antar keluarga dengan aman", "Pergi kerja tanpa ojek"];
    const rotatingTextElement = document.getElementById('rotating-text');
    let rotatingIndex = 0;
    if (rotatingTextElement) {
        setInterval(() => {
            rotatingIndex = (rotatingIndex + 1) % rotatingTexts.length;
            rotatingTextElement.classList.add('fade-out');
            setTimeout(() => {
                rotatingTextElement.textContent = rotatingTexts[rotatingIndex];
                rotatingTextElement.classList.remove('fade-out');
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

    // --- FUNGSI 4: TESTIMONIAL SLIDER INTERAKTIF ---
    // Logika slider JavaScript telah dihapus dan digantikan oleh animasi CSS murni
    // untuk fungsionalitas auto-slide yang lebih lancar dan sesuai permintaan.
    // Pengguna dapat menghentikan slide dengan hover (desktop) atau touch-hold (mobile).

});

// --- CSS TAMBAHAN UNTUK TEKS BERPUTAR ---
const style = document.createElement('style');
style.innerHTML = `
    #rotating-text {
        transition: opacity 0.5s ease-in-out;
    }
    #rotating-text.fade-out {
        opacity: 0;
    }
`;
document.head.appendChild(style);