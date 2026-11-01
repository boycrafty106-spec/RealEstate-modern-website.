/**
 * Team Sarvsiddhi Real Estate Services Pvt. Ltd.
 * Apple-Style Mobile-First Motion System (motion.js)
 * High-performance motion: CSS scroll-driven animations with vanilla JS fallbacks.
 * Animate ONLY transform and opacity. Zero continuous scroll listeners where possible.
 */

(function () {
  'use strict';

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------------------
  // 1. Glass Navbar: Hairline Border & Height Shrink via IntersectionObserver
  // Toggle .is-scrolled when user scrolls past 24px using #nav-sentinel
  // Zero scroll listeners needed!
  // ---------------------------------------------------------------------------
  function initGlassNavbar() {
    const navSentinel = document.getElementById('nav-sentinel');
    const siteHeader = document.getElementById('header');

    if (!navSentinel || !siteHeader || !('IntersectionObserver' in window)) return;

    const navObserver = new IntersectionObserver(
      function (entries) {
        const entry = entries[0];
        // When sentinel is above the viewport (top <= 0 and not intersecting), header is scrolled
        if (!entry.isIntersecting) {
          siteHeader.classList.add('is-scrolled');
        } else {
          siteHeader.classList.remove('is-scrolled');
        }
      },
      {
        root: null,
        threshold: 0
      }
    );

    navObserver.observe(navSentinel);
  }

  // ---------------------------------------------------------------------------
  // 2. Micro-Interactions: Section Entry Reveals (.reveal, .reveal-stagger)
  // Fade-up (translateY 24px -> 0, opacity 0 -> 1) with 60-80ms stagger
  // Triggered once via IntersectionObserver, unobserved immediately
  // ---------------------------------------------------------------------------
  function initEntryReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      // In reduced motion or no IO, ensure all items remain completely visible
      document.querySelectorAll('.reveal, .reveal-item').forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    const targets = document.querySelectorAll('.reveal, .reveal-item, .reveal-stagger');
    if (!targets.length) return;

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');

            // If it's a staggered container, also ensure immediate children reveal
            if (entry.target.classList.contains('reveal-stagger')) {
              Array.from(entry.target.children).forEach(function (child) {
                child.classList.add('is-revealed');
              });
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      }
    );

    targets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Subtle Parallax for Architectural Hero
  // Subtle vertical layer displacement with zero scroll jank
  // ---------------------------------------------------------------------------
  function initHeroParallax() {
    const heroSection = document.getElementById('home');
    const watermarkText = document.querySelector('.hero-watermark-text');
    const buildingCard = document.querySelector('.hero-building-card');

    if (!heroSection || prefersReducedMotion) return;

    let ticking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const heroHeight = heroSection.offsetHeight;
      if (scrollY <= heroHeight) {
        if (watermarkText) {
          watermarkText.style.transform = 'translateY(' + (scrollY * 0.16).toFixed(1) + 'px)';
        }
        if (buildingCard) {
          buildingCard.style.transform = 'translateZ(20px) translateY(' + (scrollY * 0.04).toFixed(1) + 'px)';
        }
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // 4. Floating Interactive Inquiry Console
  // Dynamically syncs selected options with direct WhatsApp consultation link
  // ---------------------------------------------------------------------------
  function initInquiryConsole() {
    const localitySelect = document.getElementById('inquiryLocality');
    const typeSelect = document.getElementById('inquiryType');
    const budgetSelect = document.getElementById('inquiryBudget');
    const whatsappBtn = document.getElementById('inquiryWhatsAppBtn');

    if (!whatsappBtn || !localitySelect || !typeSelect || !budgetSelect) return;

    function updateWhatsAppLink() {
      const locality = localitySelect.value;
      const type = typeSelect.value;
      const budget = budgetSelect.value;
      const message = 'Hello Team Sarvsiddhi, I am interested in a property in ' + locality + '. Property type: ' + type + '. My budget is ' + budget + '. Please share suitable options.';
      const encoded = encodeURIComponent(message);
      whatsappBtn.href = 'https://wa.me/918178728057?text=' + encoded;
    }

    localitySelect.addEventListener('change', updateWhatsAppLink);
    typeSelect.addEventListener('change', updateWhatsAppLink);
    budgetSelect.addEventListener('change', updateWhatsAppLink);

    // Initial sync
    updateWhatsAppLink();
  }

  // ---------------------------------------------------------------------------
  // 5. Desktop 3D Architectural Perspective & Tilt
  // Active ONLY on desktop devices with fine pointer (@media (pointer: fine))
  // Zero lag, 60fps via requestAnimationFrame
  // ---------------------------------------------------------------------------
  function initArchitecturalTilt() {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const tiltTargets = document.querySelectorAll('#heroBuildingStage, .bento-card');
    if (!tiltTargets.length) return;

    tiltTargets.forEach(function (card) {
      let rafId = null;

      function handleMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        // Normalize coordinates from -0.5 to 0.5
        const normX = (cardX / rect.width) - 0.5;
        const normY = (cardY / rect.height) - 0.5;

        // Subtle tilt: max 5 degrees
        const rotateY = (normX * 8).toFixed(2);
        const rotateX = (-normY * 8).toFixed(2);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(8px)';
        });
      }

      function handleMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
      }

      card.addEventListener('mousemove', handleMouseMove, { passive: true });
      card.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Scroll-Scrubbed Text Reveal (Preserving Semantic HTML tags)
  // Recursively traverses text nodes without stripping <strong>, <em>, etc.
  // Screen-reader accessible: full text kept in aria-label, spans aria-hidden
  // ---------------------------------------------------------------------------
  function initScrollScrubText() {
    const scrubContainers = document.querySelectorAll('[data-scrub-text]');
    if (!scrubContainers.length || prefersReducedMotion) return;

    function wrapTextNodesInWords(node) {
      if (node.nodeType === 3) { // TEXT_NODE
        const text = node.nodeValue;
        if (!text || !text.trim()) return;
        const fragment = document.createDocumentFragment();
        const parts = text.split(/(\s+)/);
        parts.forEach(function (part) {
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
          } else if (part.length > 0) {
            const span = document.createElement('span');
            span.className = 'scrub-word';
            span.setAttribute('aria-hidden', 'true');
            span.textContent = part;
            fragment.appendChild(span);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === 1) { // ELEMENT_NODE
        if (node.classList.contains('scrub-word')) return;
        Array.from(node.childNodes).forEach(wrapTextNodesInWords);
      }
    }

    scrubContainers.forEach(function (container) {
      // Preserve full sentence in aria-label if not already set
      if (!container.getAttribute('aria-label')) {
        container.setAttribute('aria-label', container.textContent.trim());
      }

      // Wrap text nodes while preserving existing markup (strong, em, etc.)
      wrapTextNodesInWords(container);

      const wordSpans = container.querySelectorAll('.scrub-word');
      const totalWords = wordSpans.length;

      let isObserving = false;
      let ticking = false;

      function updateScrubProgress() {
        const rect = container.getBoundingClientRect();
        const windowH = window.innerHeight;
        // Scrub starts when element is 85% down viewport, finishes when it reaches 30%
        const start = windowH * 0.85;
        const end = windowH * 0.30;
        const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
        const activeCount = Math.floor(progress * totalWords);

        wordSpans.forEach(function (span, i) {
          if (i <= activeCount) {
            span.classList.add('is-illuminated');
          } else {
            span.classList.remove('is-illuminated');
          }
        });

        ticking = false;
      }

      function onScrubScroll() {
        if (!ticking) {
          window.requestAnimationFrame(updateScrubProgress);
          ticking = true;
        }
      }

      if ('IntersectionObserver' in window) {
        const scrubObserver = new IntersectionObserver(
          function (entries) {
            const entry = entries[0];
            if (entry.isIntersecting && !isObserving) {
              window.addEventListener('scroll', onScrubScroll, { passive: true });
              isObserving = true;
              updateScrubProgress();
            } else if (!entry.isIntersecting && isObserving) {
              window.removeEventListener('scroll', onScrubScroll);
              isObserving = false;
            }
          },
          { root: null, rootMargin: '100px 0px 100px 0px', threshold: 0 }
        );
        scrubObserver.observe(container);
      } else {
        window.addEventListener('scroll', onScrubScroll, { passive: true });
        updateScrubProgress();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Horizontal Snap Carousel for Listings
  // Centered card scales to 1.0, neighbors to 0.92 and 0.6 opacity via IntersectionObserver
  // Absolutely ZERO scroll listeners!
  // ---------------------------------------------------------------------------
  function initSnapCarousel() {
    const carousel = document.getElementById('servicesBentoGrid');
    const cards = document.querySelectorAll('#servicesBentoGrid .bento-card');
    const dots = document.querySelectorAll('#servicesCarouselDots .carousel-dot');

    if (!carousel || !cards.length) return;

    // Set card 0 active initially
    cards[0].classList.add('is-active-card');

    if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              cards.forEach(function (c) { c.classList.remove('is-active-card'); });
              entry.target.classList.add('is-active-card');

              const cardIndex = parseInt(entry.target.getAttribute('data-carousel-card'), 10);
              dots.forEach(function (dot, i) {
                const isActive = (i === cardIndex);
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
              });
            }
          });
        },
        {
          root: carousel,
          threshold: 0.6 // Card is centered when >=60% in view inside carousel
        }
      );

      cards.forEach(function (card) {
        cardObserver.observe(card);
      });
    }

    // Interactive pagination dots
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-slide-index'), 10);
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      });
    });

    // Keyboard navigation (ArrowLeft / ArrowRight)
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeCard = carousel.querySelector('.bento-card.is-active-card');
        const currentIdx = activeCard ? parseInt(activeCard.getAttribute('data-carousel-card'), 10) : 0;
        const targetIdx = e.key === 'ArrowRight' ? Math.min(cards.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
        if (cards[targetIdx]) {
          cards[targetIdx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          e.preventDefault();
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Number Count-Up Stats
  // Counts from 0 to value when 40% visible over ~1.6s with ease-out cubic curve
  // Triggered once only via IntersectionObserver
  // ---------------------------------------------------------------------------
  function initCountUpStats() {
    const statElements = document.querySelectorAll('[data-stat-target]');
    if (!statElements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      // In reduced motion or legacy browsers, maintain final values immediately
      return;
    }

    // Set initial display to 0 formatted with decimals and suffix
    statElements.forEach(function (el) {
      const suffix = el.getAttribute('data-stat-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-stat-decimals') || '0', 10);
      el.textContent = (0).toFixed(decimals) + suffix;
    });

    const statsObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            observer.unobserve(el); // Trigger ONCE only!

            const targetVal = parseFloat(el.getAttribute('data-stat-target'));
            const suffix = el.getAttribute('data-stat-suffix') || '';
            const decimals = parseInt(el.getAttribute('data-stat-decimals') || '0', 10);
            const duration = 1600; // 1.6s
            const startTime = performance.now();

            // Cubic ease-out curve: 1 - (1 - t)^3
            function easeOutCubic(t) {
              return 1 - Math.pow(1 - t, 3);
            }

            function animateStat(now) {
              const elapsed = now - startTime;
              const t = Math.min(1, elapsed / duration);
              const current = targetVal * easeOutCubic(t);

              el.textContent = current.toFixed(decimals) + suffix;

              if (t < 1) {
                window.requestAnimationFrame(animateStat);
              } else {
                el.textContent = targetVal.toFixed(decimals) + suffix;
              }
            }

            window.requestAnimationFrame(animateStat);
          }
        });
      },
      {
        root: null,
        threshold: 0.4 // Trigger when 40% visible
      }
    );

    statElements.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  // ---------------------------------------------------------------------------
  // System Initialization
  // ---------------------------------------------------------------------------
  function initMotionSystem() {
    initGlassNavbar();
    initEntryReveals();
    initHeroParallax();
    initInquiryConsole();
    initArchitecturalTilt();
    initScrollScrubText();
    initSnapCarousel();
    initCountUpStats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionSystem);
  } else {
    initMotionSystem();
  }

})();
