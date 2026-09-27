/* ==========================================================================
   Protocol: Doom — Script
   Hero section: countdown, headline reveal, sigil eye-tracking
   ========================================================================== */

(function () {
  'use strict';

  // --- Countdown Timer (target: October 24, 2026 00:00 IST) ---
  const EVENT_DATE = new Date('2026-10-24T00:00:00+05:30').getTime();

  const $days  = document.getElementById('countdown-days');
  const $hours = document.getElementById('countdown-hours');
  const $mins  = document.getElementById('countdown-mins');
  const $secs  = document.getElementById('countdown-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now  = Date.now();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      $days.textContent  = '00';
      $hours.textContent = '00';
      $mins.textContent  = '00';
      $secs.textContent  = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    $days.textContent  = pad(d);
    $hours.textContent = pad(h);
    $mins.textContent  = pad(m);
    $secs.textContent  = pad(s);
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

    if (!isTouchDevice) {
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
    function expandTrial(targetPanel) {
      if (!targetPanel || targetPanel.classList.contains('is-expanded')) return;

      trialPanels.forEach(panel => {
        const isTarget = panel === targetPanel;
        panel.classList.toggle('is-expanded', isTarget);
        panel.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
        panel.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });
    }

    trialPanels.forEach(panel => {
      // Click expansion (works for desktop, tablet, and mobile tap)
      panel.addEventListener('click', () => {
        expandTrial(panel);
      });

      // Hover expansion on devices with fine pointer (desktop mouse)
      panel.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') {
          expandTrial(panel);
        }
      });

      // Keyboard navigation (Enter / Space)
      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          expandTrial(panel);
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
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    if (sealButton) sealButton.focus();
  }

  if (sealButton) {
    sealButton.addEventListener('click', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        openModal();
        return;
      }

      // Step 1: Press down (scale 0.92, ~150ms)
      sealButton.classList.add('is-pressed');

      setTimeout(() => {
        // Step 2: Snap back to full scale with bright flash (~300ms)
        sealButton.classList.remove('is-pressed');
        sealButton.classList.add('is-flashing');

        setTimeout(() => {
          // Step 3: Remove flash and open modal
          sealButton.classList.remove('is-flashing');
          openModal();
        }, 280);
      }, 150);
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

})();

