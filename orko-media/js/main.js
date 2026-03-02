/* ORKO MEDIA — main.js */

// Nav scroll
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Hamburger
const ham  = document.querySelector('.nav__hamburger');
const mob  = document.querySelector('.nav__mobile');
if (ham && mob) {
  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    mob.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open');
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// Active link
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

// Fade-up observer
const fades = document.querySelectorAll('.fade-up');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
  fades.forEach(el => io.observe(el));
} else {
  fades.forEach(el => el.classList.add('visible'));
}

// Counter animation
function animateCount(el) {
  const target   = parseFloat(el.dataset.target);
  const isFloat  = el.dataset.target.includes('.');
  const suffix   = el.dataset.suffix || '';
  const duration = 1600;
  const start    = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = (isFloat ? (target * e).toFixed(1) : Math.floor(target * e)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('[data-counter]');
if (counters.length && 'IntersectionObserver' in window) {
  const ci = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); ci.unobserve(e.target); } });
  }, { threshold: .5 });
  counters.forEach(el => ci.observe(el));
}

// Portfolio filter
const pfBtns  = document.querySelectorAll('.pf-btn');
const pfItems = document.querySelectorAll('.port-item');
pfBtns.forEach(btn => btn.addEventListener('click', () => {
  pfBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  pfItems.forEach(item => {
    const match = f === 'all' || item.dataset.cat === f;
    item.style.opacity         = match ? '1' : '0.18';
    item.style.pointerEvents   = match ? 'auto' : 'none';
    item.style.transition      = 'opacity .3s ease';
  });
}));

// Forms
function formHandler(id, label) {
  const form = document.querySelector(id);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Sent!';
      form.reset();
      setTimeout(() => { btn.textContent = label; btn.disabled = false; }, 3000);
    }, 1200);
  });
}
formHandler('#contactForm',  'Send Message');
formHandler('#bookingForm',  'Send Booking Request');
