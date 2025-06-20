/*
 * script.js - Main JavaScript for Clerkenwell Website
 * Handles gallery, FAQ, sliders, forms, navigation, and animations
 * Production-ready, modular, and accessible
 */

// =====================
// CONFIGURATION CONSTANTS
// =====================
const SLIDE_INTERVAL_MS = 5000;
const HERO_SCROLL_OFFSET = 80;
const SLIDER_TOUCH_THRESHOLD = 50;
const STICKY_CTA_SCROLL_Y = 500;
const ANIMATION_THRESHOLD = 0.15;

// =====================
// GALLERY FUNCTIONALITY
// =====================
const galleryImages = [
    {
        src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
        title: 'Open Plan Workspace',
        description: 'Collaborative environment with natural light'
    },
    {
        src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop',
        title: 'Private Office',
        description: 'Quiet space for focused work'
    },
    {
        src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
        title: 'Meeting Room',
        description: 'Professional spaces for client meetings'
    },
    {
        src: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&h=600&fit=crop',
        title: 'Lounge Area',
        description: 'Comfortable space for informal meetings'
    }
];
let currentGalleryIndex = 0;
function initGallery() {
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    const mainImage = document.getElementById('mainGalleryImage');
    const mainTitle = document.getElementById('mainGalleryTitle');
    const mainDescription = document.getElementById('mainGalleryDescription');
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
            const img = thumbnail.querySelector('img');
            mainImage.src = img.src;
            mainImage.alt = img.alt;
            mainTitle.textContent = thumbnail.dataset.title || '';
            mainDescription.textContent = thumbnail.dataset.description || '';
        });
    });
}
// =====================
// FAQ FUNCTIONALITY
// =====================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.addEventListener('click', toggle);
        question.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
        function toggle() {
            const isOpen = item.classList.contains('active');
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        }
    });
}
// =====================
// MOBILE MENU FUNCTIONALITY
// =====================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
            mobileMenu.setAttribute('aria-hidden', mobileMenu.classList.contains('hidden'));
        });
    }
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
    });
    // Keyboard support: ESC to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            mobileMenu.setAttribute('aria-hidden', 'true');
        }
    });
}
// =====================
// NAVIGATION SCROLL EFFECT
// =====================
function initNavigation() {
    const nav = document.getElementById('navigation');
    function onScroll() {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
}
// =====================
// STICKY CTA FUNCTIONALITY
// =====================
function initStickyCTA() {
    const stickyCta = document.getElementById('stickyCta');
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.scrollY > STICKY_CTA_SCROLL_Y) {
            stickyCta.classList.remove('hidden');
        } else {
            stickyCta.classList.add('hidden');
        }
        if (window.scrollY > lastScrollY) {
            stickyCta.style.transform = 'translateY(100%)';
        } else {
            stickyCta.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
}
// =====================
// CONTACT FORM FUNCTIONALITY
// =====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formContent = document.getElementById('formContent');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                formContent.classList.add('hidden');
                formSuccess.classList.remove('hidden');
            } catch (error) {
                submitBtn.disabled = false;
                submitText.textContent = 'Try Again';
                alert('There was an error submitting the form. Please try again.');
            }
        });
    }
}
// =====================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// =====================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - HERO_SCROLL_OFFSET;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}
// =====================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =====================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    const animatedElements = document.querySelectorAll('.feature-card, .office-type-card, .amenity-card, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
// =====================
// HERO SLIDER FUNCTIONALITY (ABSTRACTED)
// =====================
const heroSlidesContent = [
    {
        title: 'Transform Your',
        accent: 'Workspace',
        description: 'Expert office refurbishment and fitout specialists in London. We solve your workspace challenges with flexible, scalable solutions that grow with your business.',
        btnPrimary: { text: 'View Our Services', href: '#services' },
        btnSecondary: { text: 'Get a Quote', href: '#contact' }
    },
    {
        title: 'Design. Plan. Deliver.',
        accent: 'Office Fitouts',
        description: 'From concept to completion, we create inspiring office environments tailored to your needs. Discover our seamless fitout process.',
        btnPrimary: { text: 'Our Process', href: '#process' },
        btnSecondary: { text: 'See Portfolio', href: '#portfolio' }
    },
    {
        title: 'Space That',
        accent: 'Works for You',
        description: 'Maximize productivity and comfort with our expert space planning and interior design services. Let us optimize your workspace.',
        btnPrimary: { text: 'Space Planning', href: '#services' },
        btnSecondary: { text: 'Contact Us', href: '#contact' }
    },
    {
        title: 'Seamless',
        accent: 'Project Management',
        description: 'Enjoy stress-free office transformations with our end-to-end project management. On time, on budget, every time.',
        btnPrimary: { text: 'How We Work', href: '#process' },
        btnSecondary: { text: 'Book a Call', href: '#contact' }
    }
];
function updateHeroContent(index) {
    const content = heroSlidesContent[index];
    const titleEl = document.getElementById('hero-title');
    const accentEl = document.getElementById('hero-title-accent');
    const descEl = document.getElementById('hero-description');
    const btnPrimary = document.getElementById('hero-btn-primary');
    const btnSecondary = document.getElementById('hero-btn-secondary');
    if (!titleEl || !accentEl || !descEl || !btnPrimary || !btnSecondary) {
        return;
    }
    if (titleEl.childNodes[0]) {
        titleEl.childNodes[0].nodeValue = content.title + ' ';
    } else {
        titleEl.textContent = content.title + ' ';
    }
    accentEl.textContent = content.accent;
    descEl.textContent = content.description;
    btnPrimary.textContent = content.btnPrimary.text;
    btnPrimary.setAttribute('href', content.btnPrimary.href);
    btnSecondary.textContent = content.btnSecondary.text;
    btnSecondary.setAttribute('href', content.btnSecondary.href);
}
function initSlider({
    slideSelector,
    dotSelector,
    prevBtnSelector,
    nextBtnSelector,
    onSlideChange,
    autoAdvance = true,
    interval = SLIDE_INTERVAL_MS,
    keyboard = false
}) {
    const slides = document.querySelectorAll(slideSelector);
    const dots = document.querySelectorAll(dotSelector);
    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);
    let currentSlide = 0;
    let slideInterval;
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            if (dots[i]) dots[i].classList.toggle('active', i === index);
        });
        currentSlide = index;
        if (onSlideChange) onSlideChange(index);
    }
    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }
    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideInterval();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideInterval();
        });
    }
    dots.forEach((dot, i) => {
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
            showSlide(i);
            resetSlideInterval();
        });
        dot.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                showSlide(i);
                resetSlideInterval();
            }
        });
    });
    function startSlideInterval() {
        if (autoAdvance) {
            slideInterval = setInterval(nextSlide, interval);
        }
    }
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    if (keyboard) {
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetSlideInterval();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetSlideInterval();
            }
        });
    }
    showSlide(0);
    startSlideInterval();
}
function initHeroSlider() {
    initSlider({
        slideSelector: '.hero-slide',
        dotSelector: '.hero-slider-dot',
        prevBtnSelector: '.hero-slider-prev',
        nextBtnSelector: '.hero-slider-next',
        onSlideChange: updateHeroContent,
        autoAdvance: true,
        interval: SLIDE_INTERVAL_MS,
        keyboard: true
    });
}
// =====================
// AMENITIES SLIDER FUNCTIONALITY
// =====================
function initAmenitiesSlider() {
    const slider = document.querySelector('.amenities-slider-container');
    const slides = document.querySelectorAll('.amenities-slide');
    const prevBtn = document.querySelector('.slider-btn-prev');
    const nextBtn = document.querySelector('.slider-btn-next');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isTransitioning = false;
    let slideInterval;
    function getVisibleSlides(current) {
        return {
            prev: (current - 1 + totalSlides) % totalSlides,
            current: current,
            next: (current + 1) % totalSlides
        };
    }
    function updateSlider(animate = true) {
        if (animate) {
            isTransitioning = true;
            slider.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            slider.style.transition = 'none';
        }
        const visibleSlides = getVisibleSlides(currentSlide);
        slides.forEach((slide, index) => {
            slide.style.transform = 'scale(0.7) translateX(100%)';
            slide.style.opacity = '0';
            slide.style.zIndex = '0';
            slide.classList.remove('active', 'prev', 'next');
            if (index === visibleSlides.current) {
                slide.style.transform = 'scale(1) translateX(0)';
                slide.style.opacity = '1';
                slide.style.zIndex = '2';
                slide.classList.add('active');
            } else if (index === visibleSlides.prev) {
                slide.style.transform = 'scale(0.7) translateX(-100%)';
                slide.style.opacity = '0.7';
                slide.style.zIndex = '1';
                slide.classList.add('prev');
            } else if (index === visibleSlides.next) {
                slide.style.transform = 'scale(0.7) translateX(100%)';
                slide.style.opacity = '0.7';
                slide.style.zIndex = '1';
                slide.classList.add('next');
            }
        });
    }
    function goToSlide(direction) {
        if (isTransitioning) return;
        if (direction === 'prev') {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        } else {
            currentSlide = (currentSlide + 1) % totalSlides;
        }
        updateSlider(true);
    }
    prevBtn.addEventListener('click', () => goToSlide('prev'));
    nextBtn.addEventListener('click', () => goToSlide('next'));
    slider.addEventListener('transitionend', () => {
        isTransitioning = false;
    });
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(slideInterval);
    });
    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > SLIDER_TOUCH_THRESHOLD) {
            if (diff > 0) {
                goToSlide('next');
            } else {
                goToSlide('prev');
            }
        }
        resetAutoAdvance();
    });
    function resetAutoAdvance() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            goToSlide('next');
        }, SLIDE_INTERVAL_MS);
    }
    updateSlider(false);
    resetAutoAdvance();
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    slider.addEventListener('mouseleave', () => {
        resetAutoAdvance();
    });
    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            goToSlide('prev');
            resetAutoAdvance();
        } else if (e.key === 'ArrowRight') {
            goToSlide('next');
            resetAutoAdvance();
        }
    });
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateSlider(false);
        }, 100);
    });
}
// =====================
// LEAD FORM HANDLING
// =====================
function initLeadForm() {
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = leadForm.querySelector('.form-submit');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            const formData = {
                name: leadForm.querySelector('#name').value,
                email: leadForm.querySelector('#email').value,
                phone: leadForm.querySelector('#phone').value,
                company: leadForm.querySelector('#company').value,
                teamSize: leadForm.querySelector('#size').value
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                leadForm.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <div style="color: #059669; margin-bottom: 1rem;">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h3 style="color: #059669; margin-bottom: 0.5rem;">Thank you!</h3>
                        <p style="color: #374151;">We'll be in touch within 24 hours to schedule your viewing.</p>
                    </div>
                `;
            } catch (error) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                alert('Something went wrong. Please try again.');
            }
        });
    }
}
// =====================
// SECTION ANIMATIONS
// =====================
function initSectionAnimations() {
    const animatedSections = document.querySelectorAll('.section-header, .features-grid, .office-types-content, .location-grid, .amenities-slider, .faq-list, .contact-form, .cta-banner, .footer');
    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: ANIMATION_THRESHOLD });
    animatedSections.forEach(section => observer.observe(section));
}
// =====================
// WINDOW RESIZE HANDLER
// =====================
function handleWindowResize() {
    if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuIcon = document.querySelector('.menu-icon');
        const closeIcon = document.querySelector('.close-icon');
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }
}
// =====================
// MAIN INITIALIZATION
// =====================
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initFAQ();
    initMobileMenu();
    initNavigation();
    initStickyCTA();
    initContactForm();
    initSmoothScrolling();
    initAnimations();
    initSectionAnimations();
    initHeroSlider();
    initAmenitiesSlider();
    initLeadForm();
});
window.addEventListener('resize', handleWindowResize);