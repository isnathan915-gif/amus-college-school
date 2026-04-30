/* ============================================================
   AMUS COLLEGE SCHOOL – main.js
   JavaScript Features:
   1. Sticky header with scroll shadow
   2. Mobile hamburger navigation
   3. Hero image slideshow with dots
   4. Animated counter (stats section)
   5. Testimonial slider
   6. Gallery filter + lightbox
   7. Tab switcher (Academics page)
   8. Form validation (registration + contact)
   9. Scroll reveal animations
============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Run all setup only after the HTML has fully loaded.

  // =========================================================
  // 0. CENTRAL BRAND CONFIG (single place for school identity)
  // =========================================================
  const SITE_BRAND = {
    name: 'Amus College School',
    tagline: 'Let there be light',
    city: 'Bukedea District, Eastern Uganda',
    email: 'info@amuscollegeschool.ac.ug',
  };

  function applyBranding() {
    // Keep header logo text consistent across all pages.
    document.querySelectorAll('.logo-name').forEach((el) => {
      el.textContent = SITE_BRAND.name;
    });
    document.querySelectorAll('.logo-tag').forEach((el) => {
      el.textContent = SITE_BRAND.tagline;
    });

    // Keep footer brand block and tagline in sync.
    document.querySelectorAll('.footer-logo').forEach((el) => {
      el.textContent = `✦ ${SITE_BRAND.name}`;
    });
    document.querySelectorAll('#main-footer .footer-col p').forEach((el) => {
      if (el.innerHTML.includes('<br')) {
        el.innerHTML = `${SITE_BRAND.tagline}<br />${SITE_BRAND.city}`;
      }
    });

    // Update visible footer email text without changing phone/address.
    document.querySelectorAll('#main-footer address').forEach((el) => {
      el.innerHTML = el.innerHTML.replace(
        /✉\s*[^<\n]+/g,
        `✉ ${SITE_BRAND.email}`
      );
    });

    // Optional per-page title: set `data-page-title` on <body>.
    const pageTitle = document.body.getAttribute('data-page-title');
    if (pageTitle) document.title = `${SITE_BRAND.name} – ${pageTitle}`;
  }

  applyBranding();

  // =========================================================
  // 1. STICKY HEADER SHADOW
  // =========================================================
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      // Add/remove a class so CSS can show header shadow after scrolling.
      header.classList.toggle('scrolled', window.scrollY > 30);
    });
  }
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
      scrollToTopBtn.style.opacity = window.scrollY > 30 ? '1' : '0';
      scrollToTopBtn.style.visibility = window.scrollY > 30 ? 'visible' : 'hidden';
    });
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // =========================================================
  // 2. MOBILE HAMBURGER MENU
  // =========================================================
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      // Toggle the mobile menu and capture whether it is now open.
      const isOpen = mainNav.classList.toggle('open');
      // Keep accessibility state in sync for screen readers.
      hamburger.setAttribute('aria-expanded', isOpen);
      // animate spans into X
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        // Turn 3 lines into an "X" icon while menu is open.
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        // Restore the original hamburger icon.
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close nav when a link is clicked
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        // Close menu after user chooses a destination.
        mainNav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // =========================================================
  // 3. HERO SLIDESHOW
  // =========================================================
  const slides    = document.querySelectorAll('.slide');
  const dotsWrap  = document.getElementById('slide-dots');

  if (slides.length > 0 && dotsWrap) {
    let currentSlide = 0;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('slide-dot');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.slide-dot');

    function goToSlide(n) {
      // Hide the current slide and dot.
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      // Wrap index so it loops from end->start and start->end.
      currentSlide = (n + slides.length) % slides.length;
      // Show the new current slide and dot.
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }

    // Auto-advance every 5 seconds
    let slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);

    // Reset timer if user clicks dot
    dotsWrap.addEventListener('click', () => {
      clearInterval(slideTimer);
      slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    });
  }

  // =========================================================
  // 4. ANIMATED COUNTERS (Stats Section)
  // =========================================================
  function animateCounter(el) {
    // Final number to count up to comes from data-target.
    const target = parseInt(el.getAttribute('data-target'), 10);
    // Total animation length in milliseconds.
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      // Update visible number for each animation frame.
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Start counting only when the stat card enters viewport.
          animateCounter(entry.target);
          // Run once per element to avoid restarting on every scroll.
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => statsObserver.observe(el));
  }

  // =========================================================
  // 5. TESTIMONIAL SLIDER
  // =========================================================
  const testiCards = document.querySelectorAll('.testi-card');
  const testiPrev  = document.getElementById('testi-prev');
  const testiNext  = document.getElementById('testi-next');

  if (testiCards.length > 0) {
    let currentTesti = 0;

    function showTesti(n) {
      // Remove active state from current testimonial.
      testiCards[currentTesti].classList.remove('active-testi');
      // Move index with wrap-around behavior.
      currentTesti = (n + testiCards.length) % testiCards.length;
      // Activate next/previous testimonial.
      testiCards[currentTesti].classList.add('active-testi');
    }

    if (testiPrev) testiPrev.addEventListener('click', () => showTesti(currentTesti - 1));
    if (testiNext) testiNext.addEventListener('click', () => showTesti(currentTesti + 1));

    // Auto-rotate testimonials
    setInterval(() => showTesti(currentTesti + 1), 7000);
  }

  // =========================================================
  // 6. GALLERY FILTER + LIGHTBOX
  // =========================================================
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Visually mark the selected filter button.
        filterBtns.forEach(b => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');

        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          const cat = item.getAttribute('data-category');
          // Show all items or only the matching category.
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // Lightbox
  const lightbox         = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxImg      = document.getElementById('lightbox-img');
  const lightboxCaption  = document.getElementById('lightbox-caption');
  const lightboxClose    = document.getElementById('lightbox-close');
  const lightboxPrev     = document.getElementById('lightbox-prev');
  const lightboxNext     = document.getElementById('lightbox-next');

  if (lightbox && galleryItems.length > 0) {
    let currentLBIndex = 0;
    // Work only with currently visible (non-filtered) items.
    const visibleItems = () => Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));

    function openLightbox(index) {
      const items = visibleItems();
      currentLBIndex = index;
      const img = items[index].querySelector('img');
      const caption = items[index].querySelector('.gallery-overlay span');
      // Copy image data into lightbox preview.
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';
      // Show modal and prevent background page scrolling.
      lightbox.classList.remove('hidden');
      lightboxBackdrop.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      // Hide modal and restore page scrolling.
      lightbox.classList.add('hidden');
      lightboxBackdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        const items = visibleItems();
        // Find clicked item's index among currently visible items.
        const visIdx = items.indexOf(item);
        openLightbox(visIdx);
      });
    });

    if (lightboxClose)    lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => {
        const items = visibleItems();
        const newIdx = (currentLBIndex - 1 + items.length) % items.length;
        openLightbox(newIdx);
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => {
        const items = visibleItems();
        const newIdx = (currentLBIndex + 1) % items.length;
        openLightbox(newIdx);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   lightboxPrev && lightboxPrev.click();
      if (e.key === 'ArrowRight')  lightboxNext && lightboxNext.click();
    });
  }

  // =========================================================
  // 7. TAB SWITCHER (Academics Page)
  // sch: same JS behavior reused after content changed to primary levels
  // =========================================================
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Clear active state from all tabs/content panels.
        tabBtns.forEach(b => b.classList.remove('active-tab'));
        tabContents.forEach(c => c.classList.remove('active-content'));

        // Activate clicked tab and its corresponding panel.
        btn.classList.add('active-tab');
        const target = document.getElementById('tab-' + btn.getAttribute('data-tab'));
        if (target) target.classList.add('active-content');
      });
    });
  }

  // =========================================================
  // 8. FORM VALIDATION
  // =========================================================

  // --- Helper functions ---
  function setError(inputId, errorId, message) {
    // Highlight input and print its validation message.
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)  input.classList.add('error');
    if (error)  error.textContent = message;
    return false;
  }
  function clearError(inputId, errorId) {
    // Remove highlight and clear message when value is valid.
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)  input.classList.remove('error');
    if (error)  error.textContent = '';
  }
  function getVal(id) {
    // Safe helper to read trimmed input values.
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhoneNumber(phone) {
    return /^[0-9\s\-]{6,15}$/.test(phone);
  }

  // --- Registration Form ---
  const regForm = document.getElementById('registration-form');
  if (regForm) {
    // Live validation on blur
    const regFields = [
      { input: 'first-name',   error: 'err-first-name',   check: v => v.length >= 2,              msg: 'Please enter a valid first name (min 2 characters).' },
      { input: 'last-name',    error: 'err-last-name',    check: v => v.length >= 2,              msg: 'Please enter a valid last name (min 2 characters).' },
      { input: 'dob',          error: 'err-dob',          check: v => v !== '',                   msg: 'Please enter date of birth.' },
      { input: 'gender',       error: 'err-gender',       check: v => v !== '',                   msg: 'Please select a gender.' },
      { input: 'grade',        error: 'err-grade',        check: v => v !== '',                   msg: 'Please select a class.' },
      { input: 'parent-name',  error: 'err-parent-name',  check: v => v.length >= 3,              msg: 'Please enter the parent/guardian name.' },
      { input: 'relationship', error: 'err-relationship', check: v => v !== '',                   msg: 'Please select a relationship.' },
      { input: 'email',        error: 'err-email',        check: v => isValidEmail(v),            msg: 'Please enter a valid email address.' },
    ];

    function validatePhoneParts() {
      const ccEl = document.getElementById('country-code');
      const pnEl = document.getElementById('phone-number');
      const cc = ccEl ? ccEl.value.trim() : '';
      const pn = pnEl ? pnEl.value.trim() : '';
      const ok = cc !== '' && isValidPhoneNumber(pn);

      if (!ok) {
        if (ccEl) ccEl.classList.add('error');
        if (pnEl) pnEl.classList.add('error');
        const err = document.getElementById('err-phone');
        if (err) err.textContent = 'Please select a country code and enter a valid phone number.';
      } else {
        if (ccEl) ccEl.classList.remove('error');
        if (pnEl) pnEl.classList.remove('error');
        const err = document.getElementById('err-phone');
        if (err) err.textContent = '';
      }

      return ok;
    }

    regFields.forEach(({ input, error, check, msg }) => {
      const el = document.getElementById(input);
      if (!el) return;
      el.addEventListener('blur', () => {
        // Validate this field when user leaves it.
        const val = el.value.trim();
        if (!check(val)) setError(input, error, msg);
        else             clearError(input, error);
      });
      // Clear old error while user is actively typing.
      el.addEventListener('input', () => clearError(input, error));
    });

    const ccEl = document.getElementById('country-code');
    const pnEl = document.getElementById('phone-number');
    if (ccEl) {
      ccEl.addEventListener('change', validatePhoneParts);
      ccEl.addEventListener('input', validatePhoneParts);
    }
    if (pnEl) {
      pnEl.addEventListener('blur', validatePhoneParts);
      pnEl.addEventListener('input', validatePhoneParts);
    }

    regForm.addEventListener('submit', (e) => {
      // Stay on page and validate before final submit behavior.
      e.preventDefault();
      let valid = true;

      // Validate all fields
      regFields.forEach(({ input, error, check, msg }) => {
        const el = document.getElementById(input);
        if (!el) return;
        const val = el.value.trim();
        if (!check(val)) { setError(input, error, msg); valid = false; }
        else              clearError(input, error);
      });

      if (!validatePhoneParts()) valid = false;

      // Checkbox agreement
      const agreeEl = document.getElementById('agree');
      if (agreeEl && !agreeEl.checked) {
        setError('agree', 'err-agree', 'You must agree to the terms to submit.');
        valid = false;
      } else if (agreeEl) {
        clearError('agree', 'err-agree');
      }

      if (valid) {
        // Swap form with success message when all checks pass.
        regForm.classList.add('hidden');
        const successEl = document.getElementById('form-success');
        if (successEl) successEl.classList.remove('hidden');
      } else {
        // Scroll to first error
        const firstError = regForm.querySelector('.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Reset button
    const resetBtn = document.getElementById('form-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        regForm.reset();
        regForm.classList.remove('hidden');
        const successEl = document.getElementById('form-success');
        if (successEl) successEl.classList.add('hidden');
        regFields.forEach(({ input, error }) => clearError(input, error));
        clearError('country-code', 'err-phone');
        clearError('phone-number', 'err-phone');
      });
    }
  }

  // --- Contact Form ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Validate contact form client-side first.
      e.preventDefault();
      let valid = true;

      function check(inputId, errorId, validator, msg) {
        const val = document.getElementById(inputId)?.value.trim() || '';
        // Shared validator for each contact field.
        if (!validator(val)) { setError(inputId, errorId, msg); valid = false; }
        else                   clearError(inputId, errorId);
      }

      check('c-name',    'err-c-name',    v => v.length >= 2,  'Please enter your name.');
      check('c-email',   'err-c-email',   isValidEmail,         'Please enter a valid email.');
      check('c-subject', 'err-c-subject', v => v.length >= 3,  'Please enter a subject.');
      check('c-message', 'err-c-message', v => v.length >= 10, 'Message must be at least 10 characters.');

      if (valid) {
        // Clear form and show temporary success notice.
        contactForm.reset();
        const successEl = document.getElementById('contact-success');
        if (successEl) {
          successEl.classList.remove('hidden');
          setTimeout(() => successEl.classList.add('hidden'), 6000);
        }
      }
    });

    // Live clear errors
    ['c-name','c-email','c-subject','c-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => clearError(id, 'err-' + id));
    });
  }

  // =========================================================
  // 9. SCROLL REVEAL ANIMATIONS
  // =========================================================
  const revealEls = document.querySelectorAll(
    '.program-card, .news-card, .value-card, .timeline-item, .stat-item, .testi-card, .gallery-item'
  );

  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate element into view once it appears on screen.
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach((el, i) => {
      // Set initial hidden/offscreen state before reveal.
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      // Stagger animations slightly for a smoother sequence.
      el.style.transition = `opacity 0.6s ease ${(i % 4) * 0.1}s, transform 0.6s ease ${(i % 4) * 0.1}s`;
      revealObserver.observe(el);
    });
  }

});
