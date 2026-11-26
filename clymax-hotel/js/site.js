/* Clymax Signature Hotel & Suites — site behaviour */
(() => {
  const WHATSAPP_NUMBER = '2347073369981';   // Clymax front desk (WhatsApp Business)

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  const waLink = (text) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const openWhatsApp = (text) => {
    const a = document.createElement('a');
    a.href = waLink(text); a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  };

  // ── header: clear over the film, solid after scrolling (always solid on inner pages) ──
  const nav = $('#nav'), hasHero = !!$('.hero');
  const band = $('.bookband');
  if (hasHero) document.documentElement.classList.add('has-hero');
  const onScroll = () => {
    nav.classList.toggle('is-solid', !hasHero || scrollY > 40);
    if (band) document.documentElement.classList.toggle('show-wa', band.getBoundingClientRect().bottom < 0);
  };
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // ── side menu ──
  const drawer = $('#drawer'), scrim = $('.scrim'), menuBtn = $('.menu-btn');
  let lastFocus = null;
  const openMenu = () => {
    lastFocus = document.activeElement;
    drawer.classList.add('is-open'); scrim.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('drawer-open');
    setTimeout(() => $('.drawer__close', drawer).focus(), 50);
  };
  const closeMenu = () => {
    drawer.classList.remove('is-open'); scrim.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true'); menuBtn.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('drawer-open');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  menuBtn.addEventListener('click', openMenu);
  $$('[data-close]').forEach(el => el.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (!drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeMenu();
    if (e.key === 'Tab') {
      const f = $$('a, button', drawer);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ── hero film: silent; poster only under reduced motion or data saver ──
  const hero = $('.hero video');
  if (hero) {
    hero.muted = true;
    if (reduce || saveData) { hero.removeAttribute('autoplay'); hero.pause(); }
    else { const p = hero.play(); if (p) p.catch(() => {}); }
  }

  // ── room tours: load and play only while on screen, muted, no controls ──
  const tours = $$('.tour video');
  if (tours.length && !reduce && !saveData && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) { v.src = v.dataset.src; v.load(); }
        v.muted = true; const p = v.play(); if (p) p.catch(() => {});
      } else if (!v.paused) v.pause();
    }), { threshold: 0.4 });
    tours.forEach(v => io.observe(v));
  }

  // ── dates ──
  const iso = d => d.toISOString().slice(0, 10);
  const pairDates = (a, b) => {
    if (!a || !b) return;
    a.min = iso(new Date()); b.min = iso(new Date(Date.now() + 864e5));
    a.addEventListener('change', () => {
      if (!a.value) return;
      const next = new Date(a.value + 'T12:00'); next.setDate(next.getDate() + 1);
      b.min = iso(next);
      if (!b.value || b.value <= a.value) b.value = iso(next);
    });
  };
  const short = v => v ? new Date(v + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
  const nice = v => v ? new Date(v + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
  pairDates($('#b-in'), $('#b-out'));
  pairDates($('#r-in'), $('#r-out'));

  // ── booking pill under the film → straight to WhatsApp ──
  const bar = $('#bookbar');
  if (bar) {
    const pop = $('#datepop'), datesBtn = $('.bp-dates', bar), note = $('#bookbar-note');
    const inEl = $('#b-in'), outEl = $('#b-out'), guests = $('#b-guests');
    const showPop = (open) => { pop.hidden = !open; datesBtn.setAttribute('aria-expanded', String(open)); if (open) setTimeout(() => inEl.focus(), 30); };
    const refresh = () => {
      $('#bp-dates-label').textContent = inEl.value ? `${short(inEl.value)} → ${short(outEl.value) || '…'}` : 'Check in · Check out';
      $('#bp-dates-sub').textContent = inEl.value && outEl.value ? `${Math.round((new Date(outEl.value) - new Date(inEl.value)) / 864e5)} night(s)` : 'Tap to pick dates';
      $('#bp-guests-label').textContent = guests.value;
    };
    datesBtn.addEventListener('click', () => showPop(pop.hidden));
    $('#dates-done').addEventListener('click', () => { showPop(false); refresh(); datesBtn.focus(); });
    [inEl, outEl, guests].forEach(el => el.addEventListener('change', refresh));
    document.addEventListener('click', e => { if (!pop.hidden && !bar.contains(e.target)) { showPop(false); refresh(); } });
    bar.addEventListener('submit', e => {
      e.preventDefault(); refresh();
      if (!inEl.value || !outEl.value) { note.textContent = 'Pick your check-in and check-out dates first.'; showPop(true); return; }
      note.textContent = 'WhatsApp is opening with your dates. Press send there and the front desk will confirm.';
      showPop(false);
      openWhatsApp(['Hello Clymax Signature, I would like to book a room.', `Check in: ${nice(inEl.value)}`, `Check out: ${nice(outEl.value)}`, `Guests: ${guests.value}`, 'Please share availability and the rates.'].join('\n'));
      // carry the dates into the full reservation form too
      const rIn = $('#r-in'), rOut = $('#r-out');
      if (rIn) { rIn.value = inEl.value; rOut.value = outEl.value; $('#r-guests').value = guests.value; }
    });
  }

  // ── What we offer: More ──
  $$('.offer__btn').forEach(b => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', String(open));
    document.getElementById(b.getAttribute('aria-controls')).hidden = !open;
    $('span', b).textContent = open ? 'Less' : 'More';
  }));

  // ── forms → WhatsApp ──
  const validate = (form, extra) => {
    let first = null, n = 0;
    $$('[required]', form).forEach(el => {
      const bad = !el.value.trim() || (extra && extra(el));
      const err = document.getElementById(el.getAttribute('aria-describedby') || '');
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (err) err.hidden = !bad;
      if (bad) { n++; first = first || el; }
    });
    if (first) first.focus();
    return n;
  };
  $('#reserve-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget, status = $('.form__status', f);
    const n = validate(f, el => el.id === 'r-out' && f.checkin.value && el.value <= f.checkin.value);
    if (n) { status.textContent = n === 1 ? 'One detail is missing. It is marked above.' : `${n} details are missing. They are marked above.`; return; }
    const lines = ['Hello Clymax Signature, I would like to book a room.', `Room: ${f.room.value}`, `Check in: ${nice(f.checkin.value)}`, `Check out: ${nice(f.checkout.value)}`, `Guests: ${f.guests.value}`, `Name: ${f.name.value.trim()}`, `Phone: ${f.phone.value.trim()}`, `Airport pickup: ${f.pickup.checked ? 'Yes, please' : 'No'}`];
    if (f.notes.value.trim()) lines.push(`Requests: ${f.notes.value.trim()}`);
    openWhatsApp(lines.join('\n'));
    status.textContent = 'WhatsApp is opening with your request. Press send there and the front desk will confirm.';
  });
  $('#contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.currentTarget, status = $('.form__status', f);
    const n = validate(f);
    if (n) { status.textContent = n === 1 ? 'One field is empty. It is marked above.' : `${n} fields are empty. They are marked above.`; return; }
    openWhatsApp(`Hello Clymax Signature,\n${f.message.value.trim()}\n\n${f.name.value.trim()} · ${f.reply.value.trim()}`);
    status.textContent = 'WhatsApp is opening with your message. Press send there to reach the front desk.';
  });

  // ── newsletter → subscribe.php ──
  $('#news-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.currentTarget, status = $('.form__status', f), email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = 'Write an email address with an @, like name@example.com.'; f.email.focus(); return; }
    status.textContent = 'Subscribing…';
    try {
      const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error(r.status);
      status.textContent = 'You’re subscribed. Our next update will reach you by email.'; f.reset();
    } catch { status.textContent = 'We couldn’t subscribe you just now. Please try again in a minute.'; }
  });

  // ── gallery lightbox ──
  const lb = $('#lightbox'), lbImg = lb && $('img', lb);
  $$('.gallery button').forEach(b => b.addEventListener('click', () => {
    const im = $('img', b); lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt; lb.showModal();
  }));
  $('.lightbox__close')?.addEventListener('click', () => lb.close());
  lb?.addEventListener('click', e => { if (e.target === lb) lb.close(); });
})();
