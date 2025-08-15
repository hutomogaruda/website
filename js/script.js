document.addEventListener('DOMContentLoaded', function() {

    // --- FUNGSI 1: ANIMASI SAAT SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    revealElements.forEach(el => { observer.observe(el); });

    // --- FUNGSI 2: TEKS BERPUTAR DI FINAL CTA ---
    const rotatingTexts = ["Ke kampus tanpa nebeng", "Jalan-jalan ke Puncak", "Antar keluarga dengan aman", "Pergi kerja tanpa ojek"];
    const rotatingTextElement = document.getElementById('rotating-text');
    let currentIndex = 0;
    if (rotatingTextElement) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % rotatingTexts.length;
            rotatingTextElement.classList.add('fade-out');
            setTimeout(() => {
                rotatingTextElement.textContent = rotatingTexts[currentIndex];
                rotatingTextElement.classList.remove('fade-out');
            }, 500);
        }, 2500);
    }

    // --- FUNGSI 3: FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Tutup semua item lain yang mungkin terbuka
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Buka atau tutup item yang diklik
            item.classList.toggle('active');
        });
    });

});

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
