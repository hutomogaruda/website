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
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const isVisible = nav.getAttribute("data-visible") === "true";
            if (isVisible && !nav.contains(e.target) && !navToggle.contains(e.target)) {
                nav.setAttribute("data-visible", false);
                navToggle.setAttribute("aria-expanded", false);
                body.classList.remove("no-scroll");
            }
        });
        
        // Ensure AI chat widget stays visible when sidebar is open
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-visible') {
                    const aiWidget = document.getElementById('ai-chat-widget');
                    if (aiWidget) {
                        const isSidebarVisible = nav.getAttribute("data-visible") === "true";
                        if (isSidebarVisible) {
                            aiWidget.style.zIndex = '10000';
                        } else {
                            aiWidget.style.zIndex = '1002';
                        }
                    }
                }
            });
        });
        
        observer.observe(nav, { attributes: true });
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

    // --- FUNGSI 5: AI CHAT WIDGET ---
    const AI_WEBHOOK_URL = 'https://nerra.id/api/webhook/faeb4013-709b-451c-babb-eac5d8cc177d';
    
    // Create AI chat widget
    function createAIChatWidget() {
        // Check if widget already exists
        if (document.getElementById('ai-chat-widget')) {
            return;
        }
        
        const chatWidget = document.createElement('div');
        chatWidget.id = 'ai-chat-widget';
        chatWidget.innerHTML = `
            <div class="ai-chat-toggle" id="ai-chat-toggle">
                <span class="ai-icon">🤖</span>
                <span class="ai-text">Tanya AI</span>
            </div>
            <div class="ai-chat-container" id="ai-chat-container">
                <div class="ai-chat-header">
                    <h4>AI Assistant HKP</h4>
                    <button class="ai-chat-close" id="ai-chat-close">×</button>
                </div>
                <div class="ai-chat-messages" id="ai-chat-messages">
                    <div class="ai-message">
                        <div class="ai-avatar">🤖</div>
                        <div class="ai-text-content">
                            Halo! Saya AI Assistant HKP. Ada yang bisa saya bantu tentang kursus mengemudi?
                        </div>
                    </div>
                </div>
                <div class="ai-chat-input-container">
                    <input type="text" id="ai-chat-input" placeholder="Tulis pertanyaan Anda..." />
                    <button id="ai-chat-send">Kirim</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatWidget);
        
        // Force visibility for mobile devices
        setTimeout(() => {
            const widget = document.getElementById('ai-chat-widget');
            if (widget) {
                widget.style.display = 'block';
                widget.style.visibility = 'visible';
                widget.style.opacity = '1';
                widget.style.zIndex = '1002';
            }
        }, 100);
        
        // Add event listeners with mobile support
        const toggle = document.getElementById('ai-chat-toggle');
        const container = document.getElementById('ai-chat-container');
        const closeBtn = document.getElementById('ai-chat-close');
        
        // Ensure elements exist before adding listeners
        if (!toggle || !container || !closeBtn) {
            console.error('AI Chat Widget elements not found');
            return;
        }
        const input = document.getElementById('ai-chat-input');
        const sendBtn = document.getElementById('ai-chat-send');
        const messages = document.getElementById('ai-chat-messages');
        
        let isOpen = false;
        
        // Add both click and touch events for better mobile support
        const toggleChat = () => {
            isOpen = !isOpen;
            if (isOpen) {
                container.classList.add('show');
                input.focus();
                // Scroll to bottom when chat opens
                setTimeout(() => {
                    messages.scrollTop = messages.scrollHeight;
                }, 100);
            } else {
                container.classList.remove('show');
            }
        };
        
        toggle.addEventListener('click', toggleChat);
        toggle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            toggleChat();
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isOpen = false;
            container.classList.remove('show');
        });
        
        closeBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            isOpen = false;
            container.classList.remove('show');
        });
        
        const sendMessage = async () => {
            const message = input.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            input.value = '';
            
            // Show typing indicator
            const typingId = addTypingIndicator();
            
             try {
                 // Send to webhook
                 const response = await fetch(AI_WEBHOOK_URL, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ message: message, metadata: { source: 'website' } })
                 });
                
                 // Remove typing indicator
                 removeTypingIndicator(typingId);
                 
                 if (response.ok) {
                     const data = await response.json();
                     // Check if response contains error
                     if (data.status === 'error') {
                         addMessage('Maaf, AI Agent sedang mengalami gangguan. Silakan hubungi kami langsung via WhatsApp untuk bantuan lebih lanjut.', 'ai');
                     } else {
                         // Add AI response
                         addMessage(data.ai_response || data.message || 'Terima kasih atas pertanyaan Anda! Tim kami akan segera menghubungi Anda.', 'ai');
                     }
                 } else {
                     addMessage('Maaf, terjadi kesalahan. Silakan hubungi kami langsung via WhatsApp.', 'ai');
                 }
            } catch (error) {
                removeTypingIndicator(typingId);
                addMessage('Maaf, terjadi kesalahan. Silakan hubungi kami langsung via WhatsApp.', 'ai');
            }
        };
        
        sendBtn.addEventListener('click', sendMessage);
        sendBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            sendMessage();
        });
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `${sender}-message`;
            
            if (sender === 'user') {
                messageDiv.innerHTML = `
                    <div class="user-text-content">${text}</div>
                `;
            } else {
                messageDiv.innerHTML = `
                    <div class="ai-avatar">🤖</div>
                    <div class="ai-text-content">${text}</div>
                `;
            }
            
            messages.appendChild(messageDiv);
            // Scroll to bottom with slight delay to ensure DOM is updated
            setTimeout(() => {
                messages.scrollTop = messages.scrollHeight;
            }, 10);
        }
        
        function addTypingIndicator() {
            const typingId = 'typing-' + Date.now();
            const typingDiv = document.createElement('div');
            typingDiv.id = typingId;
            typingDiv.className = 'ai-message typing';
            typingDiv.innerHTML = `
                <div class="ai-avatar">🤖</div>
                <div class="ai-text-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            messages.appendChild(typingDiv);
            // Scroll to bottom with slight delay to ensure DOM is updated
            setTimeout(() => {
                messages.scrollTop = messages.scrollHeight;
            }, 10);
            return typingId;
        }
        
        function removeTypingIndicator(id) {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
            }
        }
    }
    
    // Initialize AI chat widget with delay to ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createAIChatWidget);
    } else {
        createAIChatWidget();
    }
    
    // Also try to initialize after a short delay for mobile devices
    setTimeout(createAIChatWidget, 500);
    
    // --- FUNGSI 6: AI CHAT POPUP NOTIFICATION ---
    function createAIPopupNotification() {
        // Check if user has already seen the popup in this session
        if (sessionStorage.getItem('ai-popup-shown')) {
            return;
        }
        
        // Check if mobile device
        const isMobile = window.innerWidth <= 768;
        
        // Show popup immediately when page loads
        const popup = document.createElement('div');
        popup.id = 'ai-popup-notification';
        
        // Different content for mobile vs desktop
        const popupContent = isMobile ? `
            <div class="ai-popup-content">
                <div class="ai-popup-close" id="ai-popup-close">×</div>
                <div class="ai-popup-icon">🤖</div>
                <div class="ai-popup-text">
                    <h4>Butuh Bantuan?</h4>
                    <p>AI Assistant siap membantu! Tanya langsung di pojok kanan bawah.</p>
                </div>
                <div class="ai-popup-arrow"></div>
            </div>
        ` : `
            <div class="ai-popup-content">
                <div class="ai-popup-close" id="ai-popup-close">×</div>
                <div class="ai-popup-icon">🤖</div>
                <div class="ai-popup-text">
                    <h4>Butuh Bantuan?</h4>
                    <p>AI Assistant kami siap membantu menjawab pertanyaan seputar kursus mengemudi, paket, dan jadwal. Tanya langsung sekarang!</p>
                </div>
                <div class="ai-popup-arrow"></div>
            </div>
        `;
        
        popup.innerHTML = popupContent;
        
        document.body.appendChild(popup);
        
        // Add event listeners
        const closeBtn = document.getElementById('ai-popup-close');
        const popupElement = document.getElementById('ai-popup-notification');
        
        // Function to close popup
        function closePopup() {
            popupElement.classList.remove('show');
            setTimeout(() => {
                if (popupElement && popupElement.parentNode) {
                    popupElement.remove();
                }
            }, 300);
            sessionStorage.setItem('ai-popup-shown', 'true');
        }
        
        // Close button event listener
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closePopup();
        });
        
        // Also close when clicking outside the popup
        popupElement.addEventListener('click', (e) => {
            if (e.target === popupElement) {
                closePopup();
            }
        });
        
        // Auto close after 10 seconds
        setTimeout(() => {
            if (popupElement && popupElement.parentNode) {
                closePopup();
            }
        }, 10000);
        
        // Show popup with animation after a short delay to ensure DOM is ready
        setTimeout(() => {
            popupElement.classList.add('show');
            
            // Auto-hide popup after 8 seconds on mobile for better UX
            if (isMobile) {
                setTimeout(() => {
                    closePopup();
                }, 8000);
            }
        }, 500);
    }
    
    // Initialize popup notification
    createAIPopupNotification();
});
