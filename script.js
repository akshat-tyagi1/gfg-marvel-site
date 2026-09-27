/* ==========================================================================
   Protocol: Doom — Script
   Hero section: countdown, headline reveal, sigil eye-tracking
   ========================================================================== */

(function () {
  'use strict';

  // --- Countdown Timer (target: October 24, 2026 00:00 IST) ---
  const EVENT_DATE = new Date('2026-10-24T00:00:00+05:30').getTime();

  const $countdown = document.getElementById('countdown');
  const $days  = document.getElementById('countdown-days');
  const $hours = document.getElementById('countdown-hours');
  const $mins  = document.getElementById('countdown-mins');
  const $secs  = document.getElementById('countdown-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now  = Date.now();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      if ($countdown && !$countdown.classList.contains('is-finished')) {
        $countdown.classList.add('is-finished');
        $countdown.innerHTML = '<div class="countdown__finished label-mono">THE TRIAL HAS BEGUN</div>';
      }
      return;
    }

    if ($days && $hours && $mins && $secs) {
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      $days.textContent  = pad(d);
      $hours.textContent = pad(h);
      $mins.textContent  = pad(m);
      $secs.textContent  = pad(s);
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // --- Headline word-by-word reveal (clip-path wipe, ~600ms/word) ---
  const headline = document.getElementById('hero-headline');

  if (headline) {
    const text = headline.textContent.trim();
    const words = text.split(/\s+/);

    headline.innerHTML = words
      .map(w => `<span class="word">${w}</span>`)
      .join(' ');

    const wordEls = headline.querySelectorAll('.word');

    // Check for reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    wordEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, prefersReducedMotion ? i * 100 : i * 600);
    });
  }


  // --- Sigil eye-tracking (desktop/tablet only — no cursor on touch) ---
  const sigil = document.getElementById('doom-sigil');
  const eyes  = document.getElementById('sigil-eyes');

  if (sigil && eyes) {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isTouchDevice && !prefersReducedMotion) {
      const MAX_ROTATION = 4; // degrees — subtle, as specified

      document.addEventListener('mousemove', (e) => {
        const rect = sigil.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;

        // Normalize to ±1 range based on viewport
        const nx = dx / (window.innerWidth / 2);
        const ny = dy / (window.innerHeight / 2);

        // Clamp to MAX_ROTATION degrees
        const rotX = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, ny * MAX_ROTATION));
        const rotY = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, nx * MAX_ROTATION));

        // Apply a gentle translate to the eyes group
        const tx = rotY * 0.6;
        const ty = rotX * 0.6;

        eyes.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    }
  }


  // --- Fixed Navbar Scroll Controller ---
  const siteNav = document.getElementById('site-nav');
  const heroSection = document.getElementById('hero');

  if (siteNav && heroSection) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // When hero is NOT intersecting (scrolled past hero), condense the navbar
        if (!entry.isIntersecting) {
          siteNav.classList.add('is-scrolled');
        } else {
          siteNav.classList.remove('is-scrolled');
        }
      });
    }, { threshold: 0.1 });

    navObserver.observe(heroSection);
  }


  // --- IntersectionObserver for Section Reveals (Decree, Trials, Prizes, CTA) ---
  const revealSections = document.querySelectorAll('#decree, #trials, #prizes, #cta');
  if (revealSections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealSections.forEach(sec => observer.observe(sec));
  }


  // --- Trials of Doom Accordion Interaction ---
  const trialPanels = document.querySelectorAll('.trial-panel');
  if (trialPanels.length > 0) {
    function expandTrial(target) {
      const targetPanel = target ? target.closest('.trial-panel') : null;
      if (!targetPanel) return;

      trialPanels.forEach(panel => {
        const isTarget = (panel === targetPanel);
        if (isTarget) {
          panel.classList.add('is-expanded');
        } else {
          panel.classList.remove('is-expanded');
        }
        const headerBtn = panel.querySelector('.trial-panel__collapsed');
        if (headerBtn) {
          headerBtn.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
        }
      });
    }

    trialPanels.forEach(panel => {
      panel.addEventListener('click', (e) => {
        expandTrial(e.target);
      });

      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.tagName === 'A') return;
          e.preventDefault();
          expandTrial(e.target);
        }
      });
    });
  }


  // --- Prize Cards Interactive Flash on Tap / Click ---
  const prizeCards = document.querySelectorAll('.prize-card');
  prizeCards.forEach(card => {
    card.addEventListener('click', () => {
      const rect = card.querySelector('.prize-card__border rect');
      if (rect) {
        rect.style.animation = 'none';
        void rect.offsetHeight; // force reflow
        rect.style.animation = 'prize-border-flash 600ms ease-out forwards';
      }
    });
  });


  // --- Registration / Seal Button & Modal Controller ---
  const sealButton = document.getElementById('seal-button');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalAckBtn = document.getElementById('modal-ack-btn');

  function openModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (sealButton) sealButton.focus();
  }

  if (sealButton) {
    const preDim = document.getElementById('seal-pre-dim');

    /** Helper: remove .is-cracking and .is-glowing, reset crack paths to hidden */
    function cleanSealState() {
      sealButton.classList.remove('is-pressed', 'is-flashing', 'is-cracking', 'is-glowing');
    }

    /** Fade out and hide the pre-dim overlay */
    function hideDim() {
      if (!preDim) return;
      preDim.classList.remove('is-active');
    }

    sealButton.addEventListener('click', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        openModal();
        return;
      }

      // Guard against double-clicks mid-sequence
      sealButton.style.pointerEvents = 'none';

      // --- STEP 1: Press down (scale 0.92, 150ms) ---
      cleanSealState();
      sealButton.classList.add('is-pressed');

      setTimeout(() => {
        // --- STEP 2: Snap back + brightness flash + screen dim ---
        sealButton.classList.remove('is-pressed');
        sealButton.classList.add('is-flashing');

        // Pre-modal dim fades in fast (180ms transition per CSS)
        if (preDim) preDim.classList.add('is-active');

        setTimeout(() => {
          // Remove flash class after it completes
          sealButton.classList.remove('is-flashing');

          // --- STEP 3: Crack draw animation (~160ms + 90ms stagger = ~250ms total) ---
          sealButton.classList.add('is-cracking');

          setTimeout(() => {
            // --- STEP 4: Brass glow burst spreads outward (~380ms) ---
            sealButton.classList.remove('is-cracking');
            sealButton.classList.add('is-glowing');

            setTimeout(() => {
              // --- STEP 5: Glow fades, modal opens ---
              sealButton.classList.remove('is-glowing');
              hideDim();
              sealButton.style.pointerEvents = '';
              openModal();
            }, 300); // wait for glow to peak and begin fading before modal opens

          }, 260); // crack animation duration (160ms draw + 90ms last stagger + ~10ms buffer)

        }, 280); // existing flash duration, unchanged

      }, 150); // existing press duration, unchanged
    });
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalAckBtn) modalAckBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Keydown handler: Escape to close + Tab focus trap
  document.addEventListener('keydown', (e) => {
    if (!modalBackdrop || !modalBackdrop.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = Array.from(
        modalBackdrop.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl || !modalBackdrop.contains(document.activeElement)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl || !modalBackdrop.contains(document.activeElement)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  });

})();

