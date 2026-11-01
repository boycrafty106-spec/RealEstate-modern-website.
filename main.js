/**
 * Team Sarvsiddhi Real Estate Services Pvt. Ltd.
 * Apple-Inspired Digital Experience Engine
 * Lightweight, accessible vanilla JavaScript
 * Zero external libraries or runtime dependencies
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Centralized Business Configuration
  // Easily update official numbers without touching HTML templates
  // -------------------------------------------------------------------------
  const BUSINESS_CONFIG = {
    primaryWhatsAppNumber: '918178728057',
    primaryCallNumber: '+918178728057',
    officeName: 'Sarvsiddhi Real Estate Services Pvt. Ltd.',
    brandName: 'Team Sarvsiddhi',
    city: 'Patna'
  };

  // -------------------------------------------------------------------------
  // 2. Mark JavaScript as Ready for Progressive Enhancements
  // -------------------------------------------------------------------------
  document.documentElement.classList.add('js-ready');

  // -------------------------------------------------------------------------
  // 3. Dynamic Footer Year
  // -------------------------------------------------------------------------
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 4. Accessible Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileMenuBtn || !mobileMenuDrawer) return;
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileMenuDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuDrawer.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileMenu() {
    if (!mobileMenuBtn || !mobileMenuDrawer) return;
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuDrawer.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', function () {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when tapping any navigation link inside drawer
    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
        closeMobileMenu();
        mobileMenuBtn.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. Smooth Scroll with Sticky Header Offset
  // -------------------------------------------------------------------------
  const internalNavLinks = document.querySelectorAll('a[href^="#"]');
  const header = document.getElementById('header');

  internalNavLinks.forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#main-content') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus to the target element for screen reader accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. Progressive Scroll Motion & Reveals
  // Handled by specialized motion.js engine with zero-conflict fallbacks
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // 7. Mobile Sticky Conversion Bar Behavior
  // Appears smoothly once the user scrolls past the primary hero actions
  // -------------------------------------------------------------------------
  const mobileStickyBar = document.getElementById('mobileStickyBar');
  const heroSection = document.getElementById('home');

  if (mobileStickyBar && heroSection) {
    function handleStickyBarVisibility() {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollPosition > 240) {
        mobileStickyBar.style.transform = 'translateY(0)';
        mobileStickyBar.style.opacity = '1';
        mobileStickyBar.style.visibility = 'visible';
      } else {
        mobileStickyBar.style.transform = 'translateY(100%)';
        mobileStickyBar.style.opacity = '0';
        mobileStickyBar.style.visibility = 'hidden';
      }
    }

    mobileStickyBar.style.transition = 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, visibility 280ms';
    mobileStickyBar.style.transform = 'translateY(100%)';
    mobileStickyBar.style.opacity = '0';
    mobileStickyBar.style.visibility = 'hidden';

    window.addEventListener('scroll', handleStickyBarVisibility, { passive: true });
    handleStickyBarVisibility();
  }

})();
