/* Clymax Signature Hotel & Suites — site behaviour */
(() => {
  // ── Hotel details: fill these in and every WhatsApp / Facebook link updates ──
  const WHATSAPP_NUMBER = '2347073369981';   // Clymax front desk (WhatsApp Business), digits only
  const FACEBOOK_URL = 'https://www.facebook.com/share/1RbhdyBDw5/';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;

  const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); });
  $$('[data-fb]').forEach(a => { a.href = FACEBOOK_URL || 'https://www.facebook.com/search/top?q=' + encodeURIComponent('Clymax Signature Hotel & Suites'); });

  // ── header: transparent over the film, solid once you scroll ──
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('is-solid', scrollY > 40);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // ── full-screen menu ──
  const menu = $('#menu'), burger = $('.burger');
  let lastFocus = null;
  const openMenu = () => {
    lastFocus = document.activeElement;
    menu.classList.add('is-open'); burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('.menu__close', menu).focus(), 60);
  };
  const closeMenu = () => {
    menu.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  burger.addEventListener('click', openMenu);
  $$('[data-close]', menu).forEach(el => el.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    if (e.key === 'Tab' && menu.classList.contains('is-open')) {
      const f = $$('a, button', menu).filter(x => x.offsetParent !== null);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ── hero film: plays silently; still poster under reduced motion or data saver ──
  const hero = $('.hero video');
  if (hero) {
    hero.muted = true;
    if (reduce || saveData) { hero.removeAttribute('autoplay'); hero.pause(); }
    else { const p = hero.play(); if (p) p.catch(() => {}); }
  }

  // ── room tours: load and play only while on screen, always muted, no controls ──
  const tours = $$('.tour video');
  if (!reduce && !saveData && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; v.load(); }
        v.muted = true; const p = v.play(); if (p) p.catch(() => {});
      } else if (!v.paused) v.pause();
    }), { threshold: 0.35 });
    tours.forEach(v => io.observe(v));
  }

  // ── dates: no past days; check-out after check-in ──
  const iso = d => d.toISOString().slice(0, 10);
  const today = new Date(); const tomorrow = new Date(Date.now() + 864e5);
  const pairDates = (a, b) => {
    a.min = iso(today); b.min = iso(tomorrow);
    a.addEventListener('change', () => {
      if (!a.value) return;
      const next = new Date(a.value); next.setDate(next.getDate() + 1);
      b.min = iso(next);
      if (!b.value || b.value <= a.value) b.value = iso(next);
    });
  };
  pairDates($('#b-in'), $('#b-out'));
  pairDates($('#r-in'), $('#r-out'));
  const nice = v => v ? new Date(v + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';

  const openWhatsApp = (text) => {
    const a = document.createElement('a');
    a.href = waLink(text); a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  };

  // ── booking bar → straight to the front desk on WhatsApp ──
  $('#bookbar').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget, note = $('#bookbar-note');
    if (!f.checkin.value || !f.checkout.value) {
      note.textContent = !f.checkin.value ? 'Choose your check-in date first.' : 'Choose your check-out date.';
      (f.checkin.value ? f.checkout : f.checkin).focus(); return;
    }
    openWhatsApp([
      'Hello Clymax Signature, I would like to book a room.',
      `Room: ${f.room.value}`,
      `Check in: ${nice(f.checkin.value)}`,
      `Check out: ${nice(f.checkout.value)}`,
      `Guests: ${f.guests.value}`,
      'Please confirm availability and the rate.'
    ].join('\n'));
    note.textContent = 'WhatsApp is opening with your dates. Press send there and the front desk will confirm.';
  });

  // ── a room card pre-selects its room ──
  $$('[data-room]').forEach(a => a.addEventListener('click', () => { $('#r-room').value = a.dataset.room; }));

  // ── form helpers ──
  const validate = (form, extra) => {
    let first = null, n = 0;
    $$('[required]', form).forEach(el => {
      const bad = !el.value.trim() || (extra && extra(el));
      const err = el.getAttribute('aria-describedby') && document.getElementById(el.getAttribute('aria-describedby'));
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (err) err.hidden = !bad;
      if (bad) { n++; first = first || el; }
    });
    if (first) first.focus();
    return n;
  };
  $('#reserve-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget, status = $('.form__status', f);
    const n = validate(f, el => el.id === 'r-out' && f.checkin.value && el.value <= f.checkin.value);
    if (n) { status.textContent = n === 1 ? 'One detail is missing. It is marked above.' : `${n} details are missing. They are marked above.`; return; }
    const lines = [
      'Hello Clymax Signature, I would like to book a room.',
      `Room: ${f.room.value}`,
      `Check in: ${nice(f.checkin.value)}`,
      `Check out: ${nice(f.checkout.value)}`,
      `Guests: ${f.guests.value}`,
      `Name: ${f.name.value.trim()}`,
      `Phone: ${f.phone.value.trim()}`,
      `Airport pickup: ${f.pickup.checked ? 'Yes, please' : 'No'}`,
    ];
    if (f.notes.value.trim()) lines.push(`Requests: ${f.notes.value.trim()}`);
    openWhatsApp(lines.join('\n'));
    status.textContent = 'WhatsApp is opening with your request. Press send there and the front desk will confirm.';
  });

  $('#contact-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget, status = $('.form__status', f);
    const n = validate(f);
    if (n) { status.textContent = n === 1 ? 'One field is empty. It is marked above.' : `${n} fields are empty. They are marked above.`; return; }
    openWhatsApp(`Hello Clymax Signature,\n${f.message.value.trim()}\n\n${f.name.value.trim()} · ${f.reply.value.trim()}`);
    status.textContent = 'WhatsApp is opening with your message. Press send there to reach the front desk.';
  });

  // ── newsletter: posts to subscribe.php on the hotel's hosting ──
  $('#news-form').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.currentTarget, status = $('.form__status', f), email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = 'Write an email address with an @, like name@example.com.'; f.email.focus(); return; }
    status.textContent = 'Subscribing…';
    try {
      const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(r.status);
      status.textContent = 'You’re subscribed. Our next offer will reach you by email.'; f.reset();
    } catch {
      status.textContent = 'We couldn’t subscribe you just now. Please try again in a minute.';
    }
  });

  // ── gallery lightbox ──
  const lb = $('#lightbox'), lbImg = $('img', lb);
  $$('.gallery button').forEach(b => b.addEventListener('click', () => {
    const i = $('img', b); lbImg.src = i.currentSrc || i.src; lbImg.alt = i.alt;
    lb.showModal();
  }));
  $('.lightbox__close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  // ── gentle lift for room cards below the fold (visible by default) ──
  if (!reduce && 'IntersectionObserver' in window) {
    const rv = $$('.rv').filter(el => el.getBoundingClientRect().top > innerHeight);
    rv.forEach(el => el.classList.add('pre'));
    const io2 = new IntersectionObserver(es => es.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { target.classList.remove('pre'); io2.unobserve(target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 90 + 'ms'; io2.observe(el); });
  }
})();
