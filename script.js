/**
 * Stichting Katimo — Cat Rescue Foundation
 * Modern, accessible JavaScript with smooth animations
 */

(function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================
    const config = {
        cursor: {
            enabled: true,
            smoothness: 0.15
        },
        reveal: {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        },
        animation: {
            duration: 0.8,
            stagger: 0.1
        }
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========================================
    // Custom Cursor
    // ========================================
    class CustomCursor {
        constructor() {
            if (prefersReducedMotion || !config.cursor.enabled) return;

            this.cursor = document.querySelector('.cursor');
            this.dot = document.querySelector('.cursor-dot');
            this.ring = document.querySelector('.cursor-ring');

            if (!this.cursor || !this.dot || !this.ring) return;

            this.mouseX = 0;
            this.mouseY = 0;
            this.dotX = 0;
            this.dotY = 0;
            this.ringX = 0;
            this.ringY = 0;

            this.init();
        }

        init() {
            // Hide default cursor
            document.body.style.cursor = 'none';

            // Track mouse position
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            // Handle cursor states
            this.setupCursorStates();

            // Start animation loop
            this.animate();
        }

        setupCursorStates() {
            const expandElements = document.querySelectorAll('[data-cursor="expand"]');
            const viewElements = document.querySelectorAll('[data-cursor="view"]');

            expandElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    document.body.classList.add('cursor-hover');
                });
                el.addEventListener('mouseleave', () => {
                    document.body.classList.remove('cursor-hover');
                });
            });

            viewElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    document.body.classList.add('cursor-view');
                });
                el.addEventListener('mouseleave', () => {
                    document.body.classList.remove('cursor-view');
                });
            });
        }

        animate() {
            // Smooth follow for dot
            this.dotX += (this.mouseX - this.dotX) * config.cursor.smoothness;
            this.dotY += (this.mouseY - this.dotY) * config.cursor.smoothness;

            // Slower follow for ring
            this.ringX += (this.mouseX - this.ringX) * (config.cursor.smoothness * 0.5);
            this.ringY += (this.mouseY - this.ringY) * (config.cursor.smoothness * 0.5);

            // Apply transforms
            this.dot.style.transform = `translate(${this.dotX}px, ${this.dotY}px) translate(-50%, -50%)`;
            this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px) translate(-50%, -50%)`;

            requestAnimationFrame(() => this.animate());
        }
    }

    // ========================================
    // Scroll Reveal Animations
    // ========================================
    class ScrollReveal {
        constructor() {
            this.elements = document.querySelectorAll('[data-reveal]');
            if (!this.elements.length) return;

            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('revealed');
                        }, parseInt(delay));
                    }
                });
            }, {
                threshold: config.reveal.threshold,
                rootMargin: config.reveal.rootMargin
            });

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ========================================
    // Navigation
    // ========================================
    class Navigation {
        constructor() {
            this.nav = document.querySelector('[data-nav]');
            this.menuToggle = document.querySelector('[data-menu-toggle]');
            this.mobileMenu = document.querySelector('[data-mobile-menu]');
            this.mobileLinks = document.querySelectorAll('[data-mobile-link]');
            this.navLinks = document.querySelectorAll('.nav-link');

            this.isScrolled = false;
            this.isMobileMenuOpen = false;

            this.init();
        }

        init() {
            // Scroll detection
            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

            // Mobile menu toggle
            if (this.menuToggle) {
                this.menuToggle.addEventListener('click', () => this.toggleMobileMenu());
            }

            // Close mobile menu on link click
            this.mobileLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Smooth scroll for nav links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleNavClick(e, link));
            });
        }

        handleScroll() {
            const scrollY = window.scrollY;

            if (scrollY > 50 && !this.isScrolled) {
                this.isScrolled = true;
                this.nav.classList.add('scrolled');
            } else if (scrollY <= 50 && this.isScrolled) {
                this.isScrolled = false;
                this.nav.classList.remove('scrolled');
            }
        }

        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;

            this.menuToggle.setAttribute('aria-expanded', this.isMobileMenuOpen);

            if (this.isMobileMenuOpen) {
                this.mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                this.mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        closeMobileMenu() {
            if (this.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }

        handleNavClick(e, link) {
            const href = link.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offset = 80; // Account for fixed nav
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            }
        }
    }

    // ========================================
    // 3D Tilt Effect
    // ========================================
    class TiltEffect {
        constructor() {
            if (prefersReducedMotion) return;

            this.elements = document.querySelectorAll('[data-tilt]');
            if (!this.elements.length) return;

            this.init();
        }

        init() {
            this.elements.forEach(el => {
                el.addEventListener('mousemove', (e) => this.handleMove(e, el));
                el.addEventListener('mouseleave', (e) => this.handleLeave(e, el));
            });
        }

        handleMove(e, el) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        }

        handleLeave(e, el) {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        }
    }

    // ========================================
    // Floating Elements
    // ========================================
    class FloatingElements {
        constructor() {
            if (prefersReducedMotion) return;

            this.elements = document.querySelectorAll('[data-float]');
            if (!this.elements.length) return;

            this.init();
        }

        init() {
            this.elements.forEach((el, index) => {
                this.float(el, index);
            });
        }

        float(el, index) {
            const amplitude = 15 + (index * 3);
            const speed = 3000 + (index * 500);

            const animate = () => {
                const time = Date.now() / speed;
                const y = Math.sin(time) * amplitude;

                el.style.transform = `translateY(${y}px)`;

                requestAnimationFrame(animate);
            };

            animate();
        }
    }

    // ========================================
    // Counter Animation
    // ========================================
    class CounterAnimation {
        constructor() {
            this.counters = document.querySelectorAll('[data-count]');
            if (!this.counters.length) return;

            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            this.counters.forEach(counter => observer.observe(counter));
        }

        animateCounter(el) {
            const target = parseInt(el.dataset.count);
            const duration = prefersReducedMotion ? 0 : 2000;
            const start = 0;
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (target - start) * easeOutQuart);

                el.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            if (duration === 0) {
                el.textContent = target;
            } else {
                requestAnimationFrame(updateCounter);
            }
        }
    }

    // ========================================
    // Magnetic Buttons
    // ========================================
    class MagneticElements {
        constructor() {
            if (prefersReducedMotion) return;

            this.elements = document.querySelectorAll('[data-magnetic]');
            if (!this.elements.length) return;

            this.init();
        }

        init() {
            this.elements.forEach(el => {
                el.addEventListener('mousemove', (e) => this.handleMove(e, el));
                el.addEventListener('mouseleave', (e) => this.handleLeave(e, el));
            });
        }

        handleMove(e, el) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = x * 0.2;
            const moveY = y * 0.2;

            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        handleLeave(e, el) {
            el.style.transform = 'translate(0, 0)';
        }
    }

    // ========================================
    // Scroll Progress
    // ========================================
    class ScrollProgress {
        constructor() {
            this.indicator = document.querySelector('[data-scroll-indicator]');
            if (!this.indicator) return;

            this.init();
        }

        init() {
            // Hide on scroll
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const opacity = Math.max(0, 1 - scrollY / 300);

                this.indicator.style.opacity = opacity;
            }, { passive: true });
        }
    }

    // ========================================
    // Hero Animation
    // ========================================
    class HeroAnimation {
        constructor() {
            if (prefersReducedMotion) return;

            this.hero = document.querySelector('[data-hero]');
            if (!this.hero) return;

            this.init();
        }

        init() {
            // Trigger initial reveal
            setTimeout(() => {
                const reveals = this.hero.querySelectorAll('[data-reveal]');
                reveals.forEach((el, index) => {
                    const delay = parseInt(el.dataset.delay) || index * 100;
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, delay + 100);
                });
            }, 300);
        }
    }

    // ========================================
    // Smooth Anchor Links
    // ========================================
    class SmoothAnchors {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;

                    e.preventDefault();
                    const target = document.querySelector(href);

                    if (target) {
                        const offset = 80;
                        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: prefersReducedMotion ? 'auto' : 'smooth'
                        });
                    }
                });
            });
        }
    }

    // ========================================
    // Paw Print Animation
    // ========================================
    class PawAnimation {
        constructor() {
            if (prefersReducedMotion) return;

            this.paws = document.querySelectorAll('.paw');
            if (!this.paws.length) return;

            this.init();
        }

        init() {
            this.paws.forEach((paw, index) => {
                const randomDelay = Math.random() * 2;
                const randomDuration = 6 + Math.random() * 4;

                paw.style.animationDelay = `${randomDelay}s`;
                paw.style.animationDuration = `${randomDuration}s`;
            });
        }
    }

    // ========================================
    // Initialize Everything
    // ========================================
    function init() {
        // Core functionality
        new Navigation();
        new SmoothAnchors();

        // Cursor (desktop only)
        if (window.innerWidth > 768) {
            new CustomCursor();
        }

        // Animations
        new HeroAnimation();
        new ScrollReveal();
        new CounterAnimation();

        // Effects
        new TiltEffect();
        new FloatingElements();
        new MagneticElements();
        new PawAnimation();

        // Add loaded class to body
        document.body.classList.add('loaded');
    }

    // ========================================
    // Start
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle window resize for cursor
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                document.body.style.cursor = 'auto';
            } else if (config.cursor.enabled) {
                document.body.style.cursor = 'none';
            }
        }, 250);
    });

})();