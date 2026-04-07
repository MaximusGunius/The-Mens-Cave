(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Navbar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile nav
    const nav = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navBackdrop = document.getElementById('nav-backdrop');

    function setNavOpen(open) {
        if (!nav || !navToggle) return;
        nav.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const open = nav.getAttribute('aria-expanded') !== 'true';
            setNavOpen(open);
        });

        if (navBackdrop) {
            navBackdrop.addEventListener('click', () => setNavOpen(false));
        }

        document.querySelectorAll('.nav-links a').forEach((link) => {
            link.addEventListener('click', () => setNavOpen(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.getAttribute('aria-expanded') === 'true') {
                setNavOpen(false);
                navToggle.focus();
            }
        });
    }

    // Scroll reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => {
        if (prefersReducedMotion) {
            el.classList.add('active');
        } else {
            observer.observe(el);
        }
    });

    // Smooth scroll for in-page anchors
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Restaurant menu tabs
    window.showMenu = function (menuId, btn) {
        document.querySelectorAll('.menu-panel').forEach((panel) => {
            panel.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach((b) => {
            b.classList.remove('active');
        });
        const panel = document.getElementById(menuId);
        if (panel) panel.classList.add('active');
        if (btn) btn.classList.add('active');
    };

    // Floating badges parallax (respect reduced motion)
    if (!prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            document.querySelectorAll('.floating-badge').forEach((badge, index) => {
                const speed = 0.3 + index * 0.1;
                badge.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Gallery lightbox (index only)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const galleryButtons = Array.from(document.querySelectorAll('.gallery-button'));

    if (lightbox && lightboxImg && lightboxCaption && galleryButtons.length) {
        let activeIndex = 0;
        let lastFocus = null;

        function openLightbox(index) {
            activeIndex = ((index % galleryButtons.length) + galleryButtons.length) % galleryButtons.length;
            const btn = galleryButtons[activeIndex];
            const src = btn.getAttribute('data-gallery-src') || '';
            const title = btn.getAttribute('data-gallery-title') || '';
            const alt = btn.querySelector('img')?.getAttribute('alt') || title || 'Gallery image';

            lightboxImg.src = src;
            lightboxImg.alt = alt;
            lightboxCaption.textContent = title;

            lastFocus = document.activeElement;
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn?.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
        }

        function showNext(delta) {
            openLightbox(activeIndex + delta);
        }

        galleryButtons.forEach((btn, idx) => {
            btn.addEventListener('click', () => openLightbox(idx));
        });

        lightbox.querySelectorAll('[data-lightbox-close]').forEach((el) => {
            el.addEventListener('click', closeLightbox);
        });
        lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => showNext(-1));
        lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => showNext(1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
                return;
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                showNext(-1);
                return;
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                showNext(1);
            }
        });
    }
})();
