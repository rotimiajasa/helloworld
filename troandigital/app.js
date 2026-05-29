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
    t.style.borderColor = success ? '#15803d' : '#be123c';
    t.innerHTML =
      `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${success ? '#15803d' : '#be123c'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${success ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>' : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'}</svg>
       <p>${msg}</p>`;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 4200);
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
     REMOVED: WebGL neural vortex (replaced with clean light bg)
     ========================================================= */
  (function initNeuroVortex() {
    return; // disabled — Editorial Light theme uses CSS background
    const canvasEl = $('#bg-canvas');
    if (!canvasEl) return;

    const gl = canvasEl.getContext('webgl') || canvasEl.getContext('experimental-webgl');
    if (!gl) return; // fallback: dark background still shows from CSS

    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
        }
        return res.x + res.y;
      }

      void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = .5 * pow(1. - p, 2.);
        float t = .001 * u_time;
        vec3 color = vec3(0.);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.);
        noise += pow(noise, 10.);
        noise = max(.0, noise - .5);
        noise *= (1. - length(vUv - .5));
        color = vec3(0.5, 0.15, 0.65);
        color = mix(color, vec3(0.02, 0.7, 0.9), 0.32 + 0.16 * sin(2.0 * u_scroll_progress + 1.2));
        color += vec3(0.15, 0.0, 0.6) * sin(2.0 * u_scroll_progress + 1.5);
        color = color * noise;
        gl_FragColor = vec4(color, noise);
      }
    `;

    function compileShader(gl, source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime     = gl.getUniformLocation(program, 'u_time');
    const uRatio    = gl.getUniformLocation(program, 'u_ratio');
    const uPointer  = gl.getUniformLocation(program, 'u_pointer_position');
    const uScroll   = gl.getUniformLocation(program, 'u_scroll_progress');

    // smooth pointer state
    let px = 0.5, py = 0.5, tpx = 0.5, tpy = 0.5;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvasEl.width  = window.innerWidth  * dpr;
      canvasEl.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
      gl.uniform1f(uRatio, canvasEl.width / canvasEl.height);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    let rafId;
    function render() {
      px += (tpx - px) * 0.2;
      py += (tpy - py) * 0.2;
      gl.uniform1f(uTime, performance.now());
      gl.uniform2f(uPointer, px / window.innerWidth, 1 - py / window.innerHeight);
      gl.uniform1f(uScroll, window.pageYOffset / (2 * window.innerHeight));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    }

    if (reduceMotion) {
      // single static frame at centre pointer for reduced-motion users
      gl.uniform1f(uTime, 0);
      gl.uniform2f(uPointer, 0.5, 0.5);
      gl.uniform1f(uScroll, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      render();
    }

    window.addEventListener('pointermove', (e) => { tpx = e.clientX; tpy = e.clientY; }, { passive: true });
    window.addEventListener('touchmove',   (e) => {
      if (e.touches[0]) { tpx = e.touches[0].clientX; tpy = e.touches[0].clientY; }
    }, { passive: true });
  })();

})();
