document.addEventListener('DOMContentLoaded', () => {
  const brand = { name: 'Amus College School', tagline: 'Let there be light', city: 'Bukedea District, Eastern Uganda', email: 'info@amuscollegeschool.ac.ug' };

  const setHamburgerIcon = (btn, isOpen) => {
    const spans = btn.querySelectorAll('span');
    if (spans.length < 3) return;
    const [a, b, c] = spans;
    if (isOpen) {
      a.style.transform = 'rotate(45deg) translate(5px, 5px)';
      b.style.opacity = '0';
      c.style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      a.style.transform = '';
      b.style.opacity = '';
      c.style.transform = '';
    }
  };

  const setError = (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
    return false;
  };

  const clearError = (inputId, errorId) => {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^[0-9\s\-]{6,15}$/.test(value);

  document.querySelectorAll('.logo-name').forEach((el) => el.textContent = brand.name);
  document.querySelectorAll('.logo-tag').forEach((el) => el.textContent = brand.tagline);
  document.querySelectorAll('.footer-logo').forEach((el) => el.textContent = `✦ ${brand.name}`);
  document.querySelectorAll('#main-footer .footer-col p').forEach((el) => {
    if (el.innerHTML.includes('<br')) el.innerHTML = `${brand.tagline}<br>${brand.city}`;
  });
  document.querySelectorAll('#main-footer address').forEach((el) => {
    el.innerHTML = el.innerHTML.replace(/✉\s*[^<\n]+/g, `✉ ${brand.email}`);
  });

  const pageTitle = document.body.getAttribute('data-page-title');
  if (pageTitle) document.title = `${brand.name} – ${pageTitle}`;

  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('main-nav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      setHamburgerIcon(hamburger, isOpen);
    });
    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => { mainNav.classList.remove('open'); setHamburgerIcon(hamburger, false); });
    });
  }

  const slides = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('slide-dots');
  if (slides.length && dotsWrap) {
    let current = 0;
    const dots = [];
    const goTo = (n) => {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
    };
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot';
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
    setInterval(() => goTo(current + 1), 5000);
  }

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const duration = 1800;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    statNums.forEach((el) => statsObserver.observe(el));
  }

  const testiCards = document.querySelectorAll('.testi-card');
  if (testiCards.length) {
    let current = 0;
    const show = (n) => {
      testiCards[current].classList.remove('active-testi');
      current = (n + testiCards.length) % testiCards.length;
      testiCards[current].classList.add('active-testi');
    };
    document.getElementById('testi-prev')?.addEventListener('click', () => show(current - 1));
    document.getElementById('testi-next')?.addEventListener('click', () => show(current + 1));
    setInterval(() => show(current + 1), 7000);
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active-filter'));
        btn.classList.add('active-filter');
        const filter = btn.getAttribute('data-filter');
        galleryItems.forEach((item) => {
          const cat = item.getAttribute('data-category');
          item.classList.toggle('hidden', filter !== 'all' && cat !== filter);
        });
      });
    });
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  if (lightbox && galleryItems.length) {
    let current = 0;
    const visibleItems = () => Array.from(galleryItems).filter((i) => !i.classList.contains('hidden'));
    const open = (index) => {
      const items = visibleItems();
      if (!items.length || !lightboxImg) return;
      current = index;
      const img = items[index].querySelector('img');
      const caption = items[index].querySelector('.gallery-overlay span');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : '';
      lightbox.classList.remove('hidden');
      lightboxBackdrop?.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.classList.add('hidden');
      lightboxBackdrop?.classList.add('hidden');
      document.body.style.overflow = '';
    };
    galleryItems.forEach((item) => item.addEventListener('click', () => open(visibleItems().indexOf(item))));
    lightboxClose?.addEventListener('click', close);
    lightboxBackdrop?.addEventListener('click', close);
    lightboxPrev?.addEventListener('click', () => { const items = visibleItems(); open((current - 1 + items.length) % items.length); });
    lightboxNext?.addEventListener('click', () => { const items = visibleItems(); open((current + 1) % items.length); });
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') lightboxPrev?.click();
      if (e.key === 'ArrowRight') lightboxNext?.click();
    });
  }

  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  if (tabBtns.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active-tab'));
        tabContents.forEach((c) => c.classList.remove('active-content'));
        btn.classList.add('active-tab');
        const tabId = `tab-${btn.getAttribute('data-tab')}`;
        document.getElementById(tabId)?.classList.add('active-content');
      });
    });
  }

  const regForm = document.getElementById('registration-form');
  if (regForm) {
    const regFields = [
      { input: 'first-name', error: 'err-first-name', check: (v) => v.length >= 2, msg: 'Please enter a valid first name (min 2 characters).' },
      { input: 'last-name', error: 'err-last-name', check: (v) => v.length >= 2, msg: 'Please enter a valid last name (min 2 characters).' },
      { input: 'dob', error: 'err-dob', check: (v) => v !== '', msg: 'Please enter date of birth.' },
      { input: 'gender', error: 'err-gender', check: (v) => v !== '', msg: 'Please select a gender.' },
      { input: 'grade', error: 'err-grade', check: (v) => v !== '', msg: 'Please select a class.' },
      { input: 'parent-name', error: 'err-parent-name', check: (v) => v.length >= 3, msg: 'Please enter the parent/guardian name.' },
      { input: 'relationship', error: 'err-relationship', check: (v) => v !== '', msg: 'Please select a relationship.' },
      { input: 'email', error: 'err-email', check: (v) => isValidEmail(v), msg: 'Please enter a valid email address.' },
    ];

    const validatePhoneParts = () => {
      const ccEl = document.getElementById('country-code');
      const pnEl = document.getElementById('phone-number');
      const cc = ccEl?.value.trim() || '';
      const pn = pnEl?.value.trim() || '';
      const ok = cc !== '' && isValidPhone(pn);
      if (ccEl) ccEl.classList.toggle('error', !ok);
      if (pnEl) pnEl.classList.toggle('error', !ok);
      const err = document.getElementById('err-phone');
      if (err) err.textContent = ok ? '' : 'Please select a country code and enter a valid phone number.';
      return ok;
    };

    regFields.forEach(({ input, error, check, msg }) => {
      const el = document.getElementById(input);
      if (!el) return;
      el.addEventListener('blur', () => check(el.value.trim()) ? clearError(input, error) : setError(input, error, msg));
      el.addEventListener('input', () => clearError(input, error));
    });
    document.getElementById('country-code')?.addEventListener('change', validatePhoneParts);
    document.getElementById('phone-number')?.addEventListener('blur', validatePhoneParts);
    document.getElementById('phone-number')?.addEventListener('input', validatePhoneParts);

    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      regFields.forEach(({ input, error, check, msg }) => {
        const el = document.getElementById(input);
        if (!el) return;
        const ok = check(el.value.trim());
        if (!ok) valid = false;
        ok ? clearError(input, error) : setError(input, error, msg);
      });
      if (!validatePhoneParts()) valid = false;
      const agreeEl = document.getElementById('agree');
      if (agreeEl && !agreeEl.checked) { setError('agree', 'err-agree', 'You must agree to the terms to submit.'); valid = false; }
      else clearError('agree', 'err-agree');

      if (valid) {
        regForm.classList.add('hidden');
        document.getElementById('form-success')?.classList.remove('hidden');
      } else {
        regForm.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    document.getElementById('form-reset-btn')?.addEventListener('click', () => {
      regForm.reset();
      regForm.classList.remove('hidden');
      document.getElementById('form-success')?.classList.add('hidden');
      regFields.forEach(({ input, error }) => clearError(input, error));
      clearError('country-code', 'err-phone');
      clearError('phone-number', 'err-phone');
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const check = (inputId, errorId, validator, msg) => {
        const value = document.getElementById(inputId)?.value.trim() || '';
        const ok = validator(value);
        if (!ok) valid = false;
        ok ? clearError(inputId, errorId) : setError(inputId, errorId, msg);
      };
      check('c-name', 'err-c-name', (v) => v.length >= 2, 'Please enter your name.');
      check('c-email', 'err-c-email', isValidEmail, 'Please enter a valid email.');
      check('c-subject', 'err-c-subject', (v) => v.length >= 3, 'Please enter a subject.');
      check('c-message', 'err-c-message', (v) => v.length >= 10, 'Message must be at least 10 characters.');
      if (!valid) return;
      contactForm.reset();
      const successEl = document.getElementById('contact-success');
      if (successEl) { successEl.classList.remove('hidden'); setTimeout(() => successEl.classList.add('hidden'), 6000); }
    });
    ['c-name', 'c-email', 'c-subject', 'c-message'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', () => clearError(id, `err-${id}`));
    });
  }

  const revealEls = document.querySelectorAll('.program-card, .news-card, .value-card, .timeline-item, .stat-item, .testi-card, .gallery-item');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      revealObserver.observe(el);
    });
  }
});
