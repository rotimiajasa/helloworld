/* ===========================================================
   TROAN DIGITAL — interactions & animations (vanilla JS)
   =========================================================== */
(function () {
  'use strict';
  const D = window.TROAN;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- SVG icon set ---------- */
  const ICON = {
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    radar:  '<circle cx="12" cy="12" r="9"/><path d="M12 12 19 5M12 12v-7"/><circle cx="12" cy="12" r="3"/>',
    bug:    '<rect x="8" y="6" width="8" height="14" rx="4"/><path d="M12 6V3M5 9l2 1M19 9l-2 1M4 14h3M17 14h3M6 19l2-1M18 19l-2-1"/>',
    check:  '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    cloud:  '<path d="M17 18a4 4 0 0 0 0-8 6 6 0 0 0-11.6 1.5A3.5 3.5 0 0 0 6 18z"/>',
    lock:   '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    mail:   '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone:  '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    pin:    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    doc:    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  };
  const svg = (name, w = 24) =>
    `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON[name] || ICON.shield}</svg>`;
  const initials = (name) => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  /* =========================================================
     RENDER CONTENT
     ========================================================= */

  // trust marquee in hero (duplicated for seamless infinite loop)
  const trustNames = ['FinBridge', 'Heritage MFB', 'Accra Logistics', 'NovaPay', 'Sahel Telco', 'Zenith Cloud', 'Lagos Mutual'];
  const trustChips = [...trustNames, ...trustNames].map(n => el('span', 'chip', n));
  $('#trustLogos').append(...trustChips);

  // stats
  $('#statsGrid').classList.add('stagger');
  D.stats.forEach(s => {
    const card = el('div', 'stat');
    card.innerHTML =
      `<div class="stat-val" data-count="${s.value}" data-prefix="${s.prefix || ''}" data-suffix="${s.suffix || ''}" data-decimals="${String(s.value).includes('.') ? 2 : 0}">${s.prefix || ''}0${s.suffix || ''}</div>
       <div class="stat-lbl">${s.label}</div>`;
    $('#statsGrid').append(card);
  });

  // services
  const sg = $('#servicesGrid'); sg.classList.add('stagger');
  D.services.forEach(s => {
    const c = el('article', 'card spotlight');
    c.innerHTML =
      `${s.badge ? `<span class="card-badge">${s.badge}</span>` : ''}
       <div class="card-icon ic-${s.color}">${svg(s.icon)}</div>
       <h3>${s.title}</h3>
       <p>${s.desc}</p>
       <div class="card-tags">${s.tags.map(t => `<span>${t}</span>`).join('')}</div>`;
    sg.append(c);
  });

  // why us
  const wg = $('#whyGrid'); wg.classList.add('stagger');
  (D.whyUs || []).forEach(w => {
    const c = el('div', 'why-card spotlight');
    c.innerHTML =
      `<div class="why-icon">${svg(w.icon, 24)}</div>
       <h3>${w.title}</h3>
       <p>${w.desc}</p>`;
    wg.append(c);
  });

  // steps
  const st = $('#stepsGrid'); st.classList.add('stagger');
  D.steps.forEach(s => {
    const c = el('div', 'step');
    c.innerHTML = `<div class="step-n">${s.n}</div><h3>${s.title}</h3><p>${s.desc}</p>`;
    st.append(c);
  });

  // pricing
  const pg = $('#pricingGrid'); pg.classList.add('stagger');
  D.plans.forEach(p => {
    const c = el('div', 'plan spotlight' + (p.highlight ? ' highlight' : ''));
    c.innerHTML =
      `${p.badge ? `<span class="plan-badge">${p.badge}</span>` : ''}
       <div class="plan-name">${p.name}</div>
       <div><span class="plan-price">${p.price}</span><span class="plan-period">${p.period}</span></div>
       <p class="plan-tagline">${p.tagline}</p>
       <hr>
       <ul class="plan-features">${p.features.map(f =>
         `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${f}</li>`).join('')}</ul>
       <a href="#contact" class="btn ${p.highlight ? 'btn-primary' : 'btn-ghost'} btn-block">${p.cta}</a>`;
    pg.append(c);
  });

  // about certs
  $('#aboutCerts').append(...D.certs.map(c => el('span', 'cert', c)));

  // team
  const tg = $('#teamGrid'); tg.classList.add('stagger');
  D.team.forEach(m => {
    const c = el('div', 'team-card spotlight');
    c.innerHTML =
      `<div class="team-avatar">${initials(m.name)}</div>
       <h3>${m.name}</h3>
       <div class="team-role">${m.role}</div>
       <div class="team-certs">${m.certs.map(x => `<span>${x}</span>`).join('')}</div>`;
    tg.append(c);
  });

  // testimonials
  const tcg = $('#testimonialsGrid'); tcg.classList.add('stagger');
  D.testimonials.forEach(t => {
    const c = el('article', 't-card spotlight');
    c.innerHTML =
      `<span class="t-quote-mark" aria-hidden="true">&ldquo;</span>
       <div class="t-stars">★★★★★</div>
       <p class="t-quote">${t.quote}</p>
       <div class="t-author">
         <div class="t-avatar">${initials(t.name)}</div>
         <div><div class="t-name">${t.name}</div><div class="t-role">${t.role} · ${t.loc}</div></div>
       </div>`;
    tcg.append(c);
  });

  // insights
  const ig = $('#insightsGrid'); ig.classList.add('stagger');
  D.insights.forEach(p => {
    const c = el('article', 'post');
    c.innerHTML =
      `<div class="post-thumb ${p.hue}">${svg('doc', 48)}</div>
       <div class="post-body">
         <div class="post-meta">
           <span class="post-cat">${p.cat}</span>
           <span class="post-read">${p.read}</span>
           <span class="post-date">${p.date}</span>
         </div>
         <h3>${p.title}</h3>
         <p>${p.excerpt}</p>
         <div class="post-more">Read article <span aria-hidden="true">→</span></div>
       </div>`;
    c.addEventListener('click', () => toast('Full article coming soon to the Troan Digital blog.'));
    ig.append(c);
  });

  // faqs
  const fl = $('#faqList');
  D.faqs.forEach(f => {
    const item = el('div', 'faq-item');
    item.innerHTML =
      `<button class="faq-q" aria-expanded="false">${f.q}<span class="faq-icon"></span></button>
       <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>`;
    const btn = $('.faq-q', item), ans = $('.faq-a', item);
    btn.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : 0;
    });
    fl.append(item);
  });

  // contact list
  D.contact.forEach(c => {
    const li = el('li');
    li.innerHTML =
      `<span class="ci-icon">${svg(c.icon, 20)}</span>
       <span><span class="ci-label">${c.label}</span><br><span class="ci-value">${c.value}</span></span>`;
    $('#contactList').append(li);
  });

  // year
  $('#year').textContent = new Date().getFullYear();

  /* =========================================================
     HEADER: scroll state + active link + mobile menu
     ========================================================= */
  const header = $('#header'), nav = $('#nav'), toggle = $('#menuToggle');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  $$('.nav a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open'); toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // active nav link via scroll-spy
  const sections = $$('main section[id]');
  const navLinks = $$('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  /* =========================================================
     SCROLL REVEAL + counters
     ========================================================= */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('shown');
      $$('[data-count]', e.target).forEach(countUp);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$('.reveal, .stagger').forEach(n => revealObs.observe(n));

  // animated counters
  function countUp(node) {
    const target = parseFloat(node.dataset.count);
    const decimals = parseInt(node.dataset.decimals || '0', 10);
    const prefix = node.dataset.prefix || '';
    const suffix = node.dataset.suffix || '';
    if (reduceMotion) { node.textContent = prefix + format(target, decimals) + suffix; return; }
    const dur = 1400; const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = prefix + format(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else node.textContent = prefix + format(target, decimals) + suffix;
    }
    requestAnimationFrame(frame);
  }
  function format(n, dec) {
    if (dec > 0) return n.toFixed(dec);
    return Math.round(n).toLocaleString('en-US');
  }
  // mark stat top-border once revealed
  revealObs && $$('.stat').forEach(s => {
    new IntersectionObserver((en, o) => en.forEach(e => { if (e.isIntersecting) { e.target.classList.add('shown'); o.disconnect(); } }), { threshold: .4 }).observe(s);
  });

  /* =========================================================
     HERO live threat feed + equaliser bars
     ========================================================= */
  const feedEl = $('#socFeed');
  let feedIdx = 0;
  const feedData = D.threatFeed;
  function pushFeed() {
    const f = feedData[feedIdx % feedData.length]; feedIdx++;
    const li = el('li');
    const t = new Date();
    const ts = `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`;
    li.innerHTML = `<span class="feed-tag ${f.type}">${f.type}</span><span class="feed-text">${f.text}</span>`;
    feedEl.prepend(li);
    while (feedEl.children.length > 4) feedEl.lastChild.remove();
  }
  // seed feed
  for (let i = 0; i < 4; i++) pushFeed();
  if (!reduceMotion) setInterval(pushFeed, 2600);

  // equaliser bars
  const bars = $('#socBars');
  for (let i = 0; i < 28; i++) {
    const b = el('i');
    b.style.animationDelay = (i * 0.05) + 's';
    b.style.animationDuration = (1 + Math.random() * 0.8).toFixed(2) + 's';
    bars.append(b);
  }

  /* =========================================================
     CONTACT FORM
     ========================================================= */
  const form = $('#contactForm');
  // FormSubmit AJAX endpoint — emails contact@troandigital.net (no backend needed)
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/contact@troandigital.net';
  const submitBtn = $('button[type="submit"]', form);
  const submitLabel = submitBtn.textContent;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let ok = true;
    ['name', 'email'].forEach(id => {
      const field = $('#' + id).closest('.field');
      const val = $('#' + id).value.trim();
      const bad = !val || (id === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val));
      field.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { toast('Please add your name and a valid work email.', false); return; }

    // honeypot — silently drop bot submissions
    if (form.querySelector('[name="_honey"]').value) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name:     $('#name').value.trim(),
          company:  $('#company').value.trim(),
          email:    $('#email').value.trim(),
          interest: $('#interest').value,
          message:  $('#message').value.trim(),
          _subject: 'New enquiry from troandigital.net',
          _template: 'table',
          _captcha: 'false',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === 'true' || data.success === true)) {
        form.reset();
        toast('Thanks! Your message is on its way to our team.');
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      toast('Sorry, something went wrong. Please email contact@troandigital.net directly.', false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
    }
  });
  $$('.field input').forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('invalid')));

  /* =========================================================
     TOAST
     ========================================================= */
  let toastTimer;
  function toast(msg, success = true) {
    const t = $('#toast');
    t.style.borderColor = success ? 'var(--green)' : 'var(--rose)';
    t.innerHTML =
      `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${success ? 'var(--green)' : 'var(--rose)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${success ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>' : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'}</svg>
       <p>${msg}</p>`;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 4200);
  }

  /* =========================================================
     SPOTLIGHT GLOW — track mouse over interactive cards
     ========================================================= */
  if (!reduceMotion) {
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest('.spotlight');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* =========================================================
     SOC CARD — subtle 3D tilt on pointer
     ========================================================= */
  const socCard = $('.soc-card');
  if (socCard && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    const visual = socCard.parentElement;
    visual.addEventListener('pointermove', (e) => {
      const r = visual.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      socCard.style.transform = `rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateZ(0)`;
    });
    visual.addEventListener('pointerleave', () => { socCard.style.transform = ''; });
  }

  /* =========================================================
     SCROLL PROGRESS BAR + BACK TO TOP
     ========================================================= */
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');
  const onScrollUI = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (progress) progress.style.width = (scrolled * 100) + '%';
    if (toTop) toTop.classList.toggle('show', h.scrollTop > 600);
  };
  onScrollUI();
  window.addEventListener('scroll', onScrollUI, { passive: true });
  if (toTop) toTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* =========================================================
     ANIMATED BACKGROUND — particle / node network
     ========================================================= */
  const canvas = $('#bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles, raf;
  const COUNT = () => Math.min(70, Math.floor(window.innerWidth / 22));

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initParticles() {
    particles = Array.from({ length: COUNT() }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.6,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34,211,238,0.55)';
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(120,160,220,${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }
  if (!reduceMotion) {
    resize(); initParticles(); draw();
    let rt;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => { resize(); initParticles(); }, 200);
    });
  }
})();
