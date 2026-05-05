/* ═══════════════════════════════════════════
   VELOURA SALON — script.js
   Interactions: Cursor, Loader, Scroll,
   Particles, 3D Tilt, Navbar, Form, Mobile
═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Cursor ──────────────────────────────
  const cursor    = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .service-card, .price-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '60px';
      cursor.style.height = '60px';
      cursor.style.background = 'rgba(201,169,110,0.12)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '40px';
      cursor.style.height = '40px';
      cursor.style.background = 'transparent';
    });
  });

  // ── Loader ──────────────────────────────
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // trigger hero reveal after load
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 150);
      });
    }, 1900);
  });

  // ── Navbar Scroll ───────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── Scroll Reveal ───────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => {
    // skip hero children — handled by loader
    if (!el.closest('.hero')) observer.observe(el);
  });

  // ── Mobile Menu ─────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ── Particles ───────────────────────────
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    function createParticle() {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 1;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: 0;
      `;
      particleContainer.appendChild(p);
      setTimeout(() => p.remove(), 25000);
    }

    // Create initial batch
    for (let i = 0; i < 25; i++) createParticle();
    // Keep spawning
    setInterval(createParticle, 1200);
  }

  // ── 3D Tilt Effect ───────────────────────
  function addTilt(selector, intensity = 8) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width  / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -intensity;
        const rotY = ((x - cx) / cx) *  intensity;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  addTilt('.service-card', 6);
  addTilt('.price-card', 5);
  addTilt('.testi-card', 4);

  // ── Hero Card 3D ─────────────────────────
  const heroCard = document.querySelector('.hero-card');
  if (heroCard) {
    document.addEventListener('mousemove', e => {
      const rect = heroCard.getBoundingClientRect();
      const cardCX = rect.left + rect.width / 2;
      const cardCY = rect.top  + rect.height / 2;
      const dx = (e.clientX - cardCX) / window.innerWidth;
      const dy = (e.clientY - cardCY) / window.innerHeight;
      // Subtle parallax on the hero card
      heroCard.style.transform = `
        translateY(${Math.sin(Date.now() / 2000) * -10}px)
        rotateX(${dy * -8}deg)
        rotateY(${dx * 8}deg)
      `;
    });
  }

  // ── Smooth floating animation for hero card
  if (heroCard) {
    let t = 0;
    function floatHeroCard() {
      t += 0.01;
      const y = Math.sin(t) * 12;
      const r = Math.cos(t * 0.7) * 1.5;
      if (!heroCard.matches(':hover')) {
        heroCard.style.transform = `translateY(${y}px) rotate(${r}deg)`;
      }
      requestAnimationFrame(floatHeroCard);
    }
    floatHeroCard();
  }

  // ── Smooth Scroll Active Nav ─────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  // ── Form Submit ──────────────────────────
  const bookingForm  = document.getElementById('bookingForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = bookingForm.querySelector('.btn-primary');
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';

      setTimeout(() => {
        bookingForm.style.display  = 'none';
        formSuccess.style.display  = 'flex';
        formSuccess.style.flexDirection = 'column';
        formSuccess.style.alignItems = 'center';
        formSuccess.style.justifyContent = 'center';
      }, 1400);
    });
  }

  // ── Gold Line Animate on Scroll ──────────
  const goldLines = document.querySelectorAll('.gold-line');
  const lineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'goldLineExpand 0.8s ease forwards';
      }
    });
  }, { threshold: 0.5 });

  goldLines.forEach(line => lineObserver.observe(line));

  // inject keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    .gold-line { width: 0; }
    @keyframes goldLineExpand {
      from { width: 0; opacity: 0; }
      to   { width: 60px; opacity: 1; }
    }
    .nav-link.active { color: var(--gold); }
    .nav-link.active::after { width: 100%; }
  `;
  document.head.appendChild(style);

  // ── Smooth number counter ─────────────────
  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }, 16);
  }

  const statNums = document.querySelectorAll('.stat-n');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const raw = entry.target.textContent.replace(/\D/g,'');
        const suffix = entry.target.textContent.replace(/[\d]/g,'');
        entry.target.dataset.suffix = suffix;
        animateCounter(entry.target, parseInt(raw));
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(n => counterObserver.observe(n));

  // ── Gallery hover overlay ─────────────────
  document.querySelectorAll('.g-placeholder').forEach(item => {
    item.style.transition = 'transform 0.4s ease, border-color 0.4s';
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'scale(1.02)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });

  // ── Marquee pause on hover ────────────────
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const wrap = document.querySelector('.marquee-wrap');
    wrap.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  console.log('%c✦ Veloura Salon — Crafted with precision.', 
    'color: #c9a96e; font-size: 14px; font-family: serif;');
})();

