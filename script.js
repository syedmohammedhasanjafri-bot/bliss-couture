/* ════════════════════════════════════════════════════════════
   BLISS COUTURE — Interactive Scroll & 3D Motion Engine
   Lenis Smooth Scroll + Chapter Index + Runway Observer
   + 3D Perspective Physics + Interactive Swatches + Mobile Menu
   ════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ═══ LENIS SMOOTH SCROLL INIT ═══ */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time) {
        if (lenis) lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Lenis smooth scroll failed to initialize; falling back to native scroll:', err);
      lenis = null;
    }
  }

  // Anchor link smooth scroll via Lenis or native fallback
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(target, { offset: -72 }); // header height offset
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
          // Close mobile menu if open
          closeMobileMenu();
        }
      } catch (err) {
        // Ignore invalid CSS query selectors
      }
    });
  });

  /* ═══ SCROLL PROGRESS BAR ═══ */
  const progressBar = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    if (!progressBar) return 0;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    return progress;
  }

  /* ═══ SCROLL PERCENT COUNTER ═══ */
  const scrollPercentEl = document.getElementById('scrollPercent');

  function updateScrollPercent(progress) {
    if (!scrollPercentEl) return;
    const percent = Math.round(progress);
    scrollPercentEl.textContent = String(percent).padStart(2, '0') + '%';
  }

  /* ═══ CHAPTER INDEX ═══ */
  const chapters = document.querySelectorAll('[data-chapter]');
  const chapterItems = document.querySelectorAll('.chapter-item');
  const chapterCurrentEl = document.getElementById('chapterCurrent');

  const chapterMap = {
    overture: '01',
    atelier: '02',
    runway: '03',
    artisans: '04',
    ledger: '05',
  };

  function updateChapterIndex() {
    if (!chapters.length || !chapterCurrentEl) return;
    let currentChapter = 'overture';
    const scrollY = window.scrollY + window.innerHeight * 0.4;

    chapters.forEach((section) => {
      if (scrollY >= section.offsetTop) {
        currentChapter = section.dataset.chapter;
      }
    });

    chapterItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.chapter === currentChapter);
    });

    chapterCurrentEl.textContent = chapterMap[currentChapter] || '01';
  }

  /* ═══ HEADER HIDE/SHOW ON SCROLL ═══ */
  const header = document.getElementById('siteHeader');
  let lastScrollY = 0;
  let headerHidden = false;

  function updateHeader() {
    if (!header) return;
    const scrollY = window.scrollY;
    const threshold = 100;

    if (scrollY > lastScrollY && scrollY > threshold && !headerHidden) {
      header.classList.add('hidden');
      headerHidden = true;
    } else if (scrollY < lastScrollY && headerHidden) {
      header.classList.remove('hidden');
      headerHidden = false;
    }

    lastScrollY = scrollY;
  }

  /* ═══ MOBILE MENU ═══ */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenuBtn.classList.toggle('active', menuOpen);
      mobileMenu.classList.toggle('active', menuOpen);
      mobileMenuBtn.setAttribute('aria-expanded', String(menuOpen));

      if (menuOpen) {
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';
      } else {
        if (lenis) lenis.start();
        document.body.style.overflow = '';
      }
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) {
        closeMobileMenu();
      }
    });
  }

  function closeMobileMenu() {
    if (menuOpen && mobileMenuBtn && mobileMenu) {
      menuOpen = false;
      mobileMenuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    }
  }

  // Close menu on mobile nav link click
  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ═══ REVEAL ANIMATIONS (IntersectionObserver) ═══ */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Set line indices for staggered headline reveals
    document.querySelectorAll('.section-headline').forEach((headline) => {
      headline.querySelectorAll('.headline-line').forEach((line, i) => {
        line.style.setProperty('--line-index', i);
      });
    });

    // Observer for sections (reveals children)
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // Trigger process step line animations
            if (entry.target.classList.contains('process-step')) {
              const delayVal = parseInt(getComputedStyle(entry.target).getPropertyValue('--delay') || '0', 10);
              setTimeout(() => {
                entry.target.classList.add('animated');
              }, (isNaN(delayVal) ? 0 : delayVal) * 200 + 300);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15,
      }
    );

    // Observe all revealable elements
    document.querySelectorAll('.reveal-line, .reveal-fade, .reveal-up, .reveal-image').forEach((el) => {
      sectionObserver.observe(el);
    });

    // Observe process steps for line animation
    document.querySelectorAll('.process-step').forEach((el) => {
      sectionObserver.observe(el);
    });
  } else {
    // If IntersectionObserver is unsupported, reveal all elements immediately
    document.querySelectorAll('.reveal-line, .reveal-fade, .reveal-up, .reveal-image, .process-step').forEach((el) => {
      el.classList.add('revealed');
    });
  }

  /* ═══ RUNWAY SCROLL — Dynamic Palette & Background Transitions ═══ */
  const runwayLooks = document.querySelectorAll('.runway-look');

  if (runwayLooks.length && 'IntersectionObserver' in window) {
    const runwayObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const look = entry.target;
            const canvas = look.dataset.canvas;
            const stage = look.dataset.stage;

            // Smoothly transition page background and look stage background
            if (canvas) {
              document.body.style.backgroundColor = canvas;
              if (header) header.style.backgroundColor = canvas + 'F2'; // with 95% opacity
            }

            const frame = look.querySelector('.look-image-frame');
            if (frame && stage) {
              frame.style.backgroundColor = stage;
            }
            look.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1,
      }
    );

    runwayLooks.forEach((look) => {
      runwayObserver.observe(look);
    });

    // Reset body background when outside runway section
    const runwaySection = document.getElementById('runway');
    if (runwaySection) {
      const runwayResetObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              document.body.style.backgroundColor = '';
              if (header) header.style.backgroundColor = '';
            }
          });
        },
        { threshold: 0 }
      );
      runwayResetObserver.observe(runwaySection);
    }
  }

  /* ═══ INTERACTIVE SWATCH CONTROLLER (Issues 12 & 15) ═══ */
  document.querySelectorAll('.look-swatch-row').forEach((row) => {
    const swatches = row.querySelectorAll('.look-swatch');
    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        swatches.forEach((s) => {
          s.classList.remove('active');
          s.setAttribute('aria-checked', 'false');
        });

        swatch.classList.add('active');
        swatch.setAttribute('aria-checked', 'true');

        const look = swatch.closest('.runway-look');
        if (look) {
          const frame = look.querySelector('.look-image-frame');
          const swatchBg = swatch.style.backgroundColor;
          if (frame && swatchBg) {
            frame.style.borderColor = swatchBg;
            frame.style.boxShadow = `0 25px 50px -10px ${swatchBg}33`;
          }
        }
      });
    });
  });

  /* ═══ 3D PERSPECTIVE & TILT PHYSICS ENGINE ═══ */
  if (!prefersReducedMotion) {
    // 3D Pointer-Tracking Tilt on Lookbook Frames
    const tiltCards = document.querySelectorAll('.look-image-frame, .image-frame');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // max 5deg tilt
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });

    // 3D Scroll Parallax Depth linked to Lenis Velocity
    if (lenis) {
      lenis.on('scroll', (e) => {
        const velocity = Math.max(-8, Math.min(8, e.velocity || 0));
        const tiltAngle = (velocity * 0.35).toFixed(2);

        document.querySelectorAll('.runway-look.in-view .look-image-frame').forEach((frame) => {
          frame.style.transform = `perspective(1000px) rotateX(${tiltAngle}deg)`;
        });
      });
    }
  }

  /* ═══ FORM SUBMISSION HANDLER ═══ */
  const form = document.getElementById('ledgerForm');
  const formFeedback = document.getElementById('formFeedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const brideName = (document.getElementById('brideName')?.value || '').trim();
      const weddingDate = document.getElementById('weddingDate')?.value || '';
      const brideCity = (document.getElementById('brideCity')?.value || '').trim();
      const brideVision = (document.getElementById('brideVision')?.value || '').trim();
      const bridePhone = (document.getElementById('bridePhone')?.value || '').trim();

      if (!brideName || !bridePhone) {
        if (formFeedback) {
          formFeedback.textContent = 'Please provide both your name and WhatsApp number.';
          formFeedback.className = 'form-feedback form-feedback-error';
        }
        return;
      }

      // Display feedback
      if (formFeedback) {
        formFeedback.textContent = 'Inquiry generated. Opening WhatsApp concierge...';
        formFeedback.className = 'form-feedback form-feedback-success';
      }

      // Compose WhatsApp message
      const message = encodeURIComponent(
        `Namaste, I would like to book a private bridal consultation with Bliss Couture.\n\n` +
        `• Bride: ${brideName}\n` +
        `• Wedding Date: ${weddingDate || 'To be decided'}\n` +
        `• City/Country: ${brideCity || 'Not specified'}\n` +
        `• Vision & Traditions: ${brideVision || 'To discuss in consultation'}\n` +
        `• Contact WhatsApp: ${bridePhone}`
      );

      const targetUrl = `https://wa.me/919099773181?text=${message}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /* ═══ COMBINED SCROLL HANDLER ═══ */
  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const progress = updateScrollProgress();
          updateScrollPercent(progress);
          updateChapterIndex();
          updateHeader();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  // Initial call
  const initialProgress = updateScrollProgress();
  updateScrollPercent(initialProgress);
  updateChapterIndex();
})();
