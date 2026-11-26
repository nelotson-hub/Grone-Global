"""Builds index.html, rooms.html and faq.html from one set of parts.
Run from the clymax-hotel folder:  python3 tools/build.py
"""
import json, os, re, time
BUILD = time.strftime('%Y%m%d%H%M')
from urllib.parse import quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND = json.load(open(os.path.join(ROOT, 'tools', 'brand-icons.json')))

WA_NUM = '2347073369981'
PHONE = '0707 336 9981'
PHONE_INTL = '+234 707 336 9981'
IG = 'https://www.instagram.com/clymaxsignature_hotel_suites'
TT = 'https://www.tiktok.com/@clymax91'
FB = 'https://www.facebook.com/share/1RbhdyBDw5/'
MAP = 'https://maps.app.goo.gl/ZTz5aGRad9eDFyc58'
ADDR = 'No 2 Clymax Drive, off Americana Road, off Redeemed Road, Okpanam Road, Asaba, Delta State'

def wa(text): return f'https://wa.me/{WA_NUM}?text={quote(text)}'

ROOMS = [
    ('Classic room', 'room-classic', '₦65,000', 'Cream upholstered king bed, lit headboard and a gold chandelier', ['2 guests', 'King bed', 'Smart TV']),
    ('Deluxe room', 'room-deluxe', '₦78,500', 'Grey padded headboard under a ring light', ['2 guests', 'King bed', 'Armchair']),
    ('Premier room', 'room-premier', '₦88,000', 'King bed against a black stone wall with a glass pendant', ['2 guests', 'King bed', 'Lounge sofa']),
    ('Executive room', 'room-executive', '₦96,000', 'Oak-slat wall lit from behind the bed', ['2 guests', 'King bed', 'Work desk']),
    ('Signature suite', 'room-suite', '₦135,000', 'Gold bench at the foot of the bed and a lounge chair', ['2 guests', 'King bed', 'Lounge corner']),
    ('Royal suite', 'room-royal', '₦160,000', 'Mood lighting, a sitting area and an amber bench', ['2 guests', 'King bed', 'Sitting area']),
]
OFFERS = [  # icon, name, meta, note, picture (None: icon panel until a real photo is supplied)
    ('wifi', 'Free Wi-Fi', '24 hours', 'Free in every room, both lounges, the restaurant and by the pool. Ask the front desk for the password at check-in.', 'g-desk'),
    ('bolt', 'Uninterrupted power', 'Day and night', 'The power stays on around the clock, so air conditioning, lights, Wi-Fi and hot water keep running.', 'g-ringlight'),
    ('pool', 'Outdoor pool', '8:00 – 20:00', 'Hotel guests swim free, one guest per room. Visitors are welcome and pay at the outside lounge. Loungers at the poolside.', None),
    ('glass', 'Outside lounge', '9:00 – late', 'Beside the pool, for drinks and evenings in the open air. Open to hotel guests and visitors.', None),
    ('sofa', 'Inside lounge & restaurant', '9:00 – late', 'An air-conditioned lounge joined to the restaurant, for meals, drinks and meeting friends or colleagues.', None),
    ('flame', 'Climax Grill', 'Breakfast daily', 'Breakfast every morning, with grills and local dishes through the day, in the restaurant or by the pool.', None),
    ('shield', 'Security & parking', 'Gated, guarded', 'Park on the gated forecourt in front of the hotel. Guards are on duty day and night.', 'exterior'),
    ('plane', 'Airport pickup', 'On request', 'Tick airport pickup when you book and send your flight number. A driver meets you at arrivals, and the front desk confirms the price with your room.', None),
]
TOURS = [('Classic room', 'classic'), ('Deluxe room', 'deluxe'), ('Premier room', 'premier'), ('Executive room', 'executive'), ('Royal suite', 'royal')]
GALLERY = [
    ('tall', 'g-art', 'Framed gold artwork in a Premier room', 800, 1000),
    ('wide', 'exterior', 'The hotel front and forecourt', 1600, 892),
    ('', 'g-armchair', 'A cream bouclé armchair', 800, 800),
    ('tall', 'g-bathroom', 'En-suite bathroom with a glass shower and a round basin', 800, 1000),
    ('', 'g-sofa', 'A grey studded loveseat by the door', 800, 800),
    ('tall', 'g-desk', 'Floating oak desk under a lit TV wall', 800, 1000),
    ('wide', 'g-executive-wide', 'Lounge chair beside a made bed under warm ceiling light', 1000, 750),
    ('', 'room-executive', 'Executive room bed against an oak-slat wall', 800, 1000),
    ('tall', 'g-ringlight', 'Ring light over a Deluxe room bed', 900, 1125),
    ('', 'room-premier', 'Premier room with a black stone wall', 800, 1000),
]
FAQ = [
    ("What time is check-in and check-out?", "Check-in is at 12:00 noon, and check-out is at 12:00 noon the next day. Early check-in and late check-out depend on the room you get, so tell us your arrival time when you book."),
    ("How does airport pickup work?", "Tick airport pickup when you book and send your flight number. A driver meets you at arrivals. The front desk confirms the price for your airport when it confirms your room."),
    ("How do I pay?", "At the front desk on arrival, by card, bank transfer or cash. Nothing is paid when you send a booking request, but bookings are confirmed on payment."),
    ("Is breakfast included?", "Breakfast is served at the Climax Grill every morning. Ask the front desk whether it is included in your rate when you book."),
    ("Can I use the pool if I'm not staying?", "Yes. Hotel guests use the pool free of charge, one guest per room. Visitors are welcome too and pay at the outside lounge."),
    ("When are the pool and lounges open?", "The outdoor pool is open from 8:00 to 20:00. The outside lounge and the inside lounge are open from 9:00 until late."),
    ("Is there parking and security?", "Yes. Parking is on the gated forecourt in front of the hotel, with guards on duty day and night."),
    ("Is the Wi-Fi free?", "Yes. Wi-Fi is free and runs 24 hours in every room, both lounges, the restaurant and by the pool."),
    ("Is there power all day?", "Yes. We have uninterrupted power supply, so air conditioning, lights, Wi-Fi and hot water keep running day and night."),
    ("How do I book a room?", f"Use the booking bar under the video on the home page, the Book this room button on any room, or message us on WhatsApp at {PHONE_INTL}. The front desk replies with availability and the rate."),
]

# ---------------- icons ----------------
def sym(i, body, vb='0 0 24 24'):
    return f'<symbol id="i-{i}" viewBox="{vb}">{body}</symbol>'
S = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'
ICONS = ''.join([
    sym('arrow', f'<path {S} d="M4 12h15M13 6l6 6-6 6"/>'),
    sym('out', f'<path {S} d="M7 17 17 7M9 7h8v8"/>'),
    sym('close', f'<path {S} d="M6 6l12 12M18 6 6 18"/>'),
    sym('menu', f'<path {S} d="M4 7h16M4 12h16M4 17h16"/>'),
    sym('cal', f'<g {S}><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/></g>'),
    sym('users', f'<g {S}><circle cx="9" cy="8" r="3.2"/><path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.5c1.6.7 2.7 2.2 3 4.5"/></g>'),
    sym('bed', f'<g {S}><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="10.5" r="1.8"/></g>'),
    sym('tv', f'<g {S}><rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M9 20h6"/></g>'),
    sym('wifi', f'<g {S}><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.5a5 5 0 0 1 6.8 0"/><circle cx="12" cy="18.6" r=".9" fill="currentColor"/></g>'),
    sym('bolt', f'<path {S} d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>'),
    sym('pool', f'<g {S}><path d="M8 15V5.5a2 2 0 0 1 4 0M16 15V5.5a2 2 0 0 1 4 0M8 8h8M8 11.5h8"/><path d="M2.5 18.5c1.6 0 1.6 1 3.2 1s1.6-1 3.2-1 1.6 1 3.2 1 1.6-1 3.2-1 1.6 1 3.2 1 1.5-1 3-1"/></g>'),
    sym('glass', f'<path {S} d="M5 4h14l-7 8zM12 12v7M8 20h8M7.5 7h9"/>'),
    sym('sofa', f'<g {S}><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v4H3z"/><path d="M5 17v2M19 17v2"/></g>'),
    sym('flame', f'<path {S} d="M12 21c3.6 0 6-2.4 6-5.8 0-3.4-2.6-5.6-3.6-8.7-.3 1.9-1.2 3-2.3 3.6.2-3-1.2-5.6-3.6-7.1.3 3-1.6 4.9-3 6.9A7.7 7.7 0 0 0 6 15.2C6 18.6 8.4 21 12 21z"/>'),
    sym('shield', f'<g {S}><path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z"/><path d="m9 12 2 2 4-4"/></g>'),
    sym('plane', f'<path {S} d="M10.5 13.5 4 12l-1 1 5 3 3 5 1-1-1.5-6.5L15 10l4.5-4.5a1.5 1.5 0 0 0-2-2L13 8l-6.5-1.5-1 1L9 10z"/>'),
    sym('info', f'<g {S}><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/></g>'),
    sym('help', f'<g {S}><circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6M12 17h.01"/></g>'),
    sym('home', f'<path {S} d="M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>'),
    sym('star', f'<path {S} d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>'),
    sym('play', f'<g {S}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m10 9.5 5 2.5-5 2.5z"/></g>'),
    sym('image', f'<g {S}><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17.5 5-4.5 4 3.5 3-2.5 4 3.5"/></g>'),
    sym('mail', f'<g {S}><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6.5L20.5 7"/></g>'),
    sym('pin', f'<g {S}><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></g>'),
    sym('phone', f'<path {S} d="M6.6 3.5h2.8l1.4 4-2 1.3a11 11 0 0 0 6.4 6.4l1.3-2 4 1.4v2.8a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>'),
    sym('clock', f'<g {S}><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></g>'),
    sym('send', f'<path {S} d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>'),
    sym('plus', f'<path {S} d="M12 5v14M5 12h14"/>'),
    sym('card', f'<g {S}><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/></g>'),
] + [f'<symbol id="b-{n}" viewBox="0 0 24 24"><path fill="currentColor" d="{p}"/></symbol>' for n, p in BRAND.items()])

def i(n, cls=''): return f'<svg{f" class=\"{cls}\"" if cls else ""} width="18" height="18" aria-hidden="true"><use href="#i-{n}"/></svg>'
def b(n): return f'<svg width="18" height="18" aria-hidden="true"><use href="#b-{n}"/></svg>'

def socials(cls='socials'):
    return f'''<div class="{cls}">
          <a class="si si--wa" href="{wa('Hello Clymax Signature')}" target="_blank" rel="noopener" aria-label="WhatsApp">{b('whatsapp')}</a>
          <a class="si si--call" href="tel:+{WA_NUM}" aria-label="Call the front desk">{i('phone')}</a>
          <a class="si si--map" href="{MAP}" target="_blank" rel="noopener" aria-label="Google Maps location">{b('googlemaps')}</a>
          <a class="si si--ig" href="{IG}" target="_blank" rel="noopener" aria-label="Instagram">{b('instagram')}</a>
          <a class="si si--tt" href="{TT}" target="_blank" rel="noopener" aria-label="TikTok">{b('tiktok')}</a>
          <a class="si si--fb" href="{FB}" target="_blank" rel="noopener" aria-label="Facebook">{b('facebook')}</a>
        </div>'''

def head(title, desc, extra=''):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#120f0b">
<meta property="og:type" content="website">
<meta property="og:title" content="Clymax Signature Hotel &amp; Suites, Asaba">
<meta property="og:description" content="Rooms and suites off Okpanam Road, Asaba, with a pool, two lounges, the Climax Grill and airport pickup.">
<meta property="og:image" content="img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.png" type="image/png">
<link rel="apple-touch-icon" href="img/mark-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500&family=Marcellus&display=swap" rel="stylesheet">
{extra}<link rel="stylesheet" href="css/site.css">
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"Hotel","name":"Clymax Signature Hotel & Suites","url":"/","image":"img/exterior.webp","logo":"img/logo.png","telephone":"+{WA_NUM}","address":{{"@type":"PostalAddress","streetAddress":"No 2 Clymax Drive, off Americana Road, off Redeemed Road, Okpanam Road","addressLocality":"Asaba","addressRegion":"Delta State","addressCountry":"NG"}},"hasMap":"{MAP}","sameAs":["{FB}","{IG}","{TT}"],"checkinTime":"12:00","checkoutTime":"12:00","amenityFeature":[{{"@type":"LocationFeatureSpecification","name":"Outdoor swimming pool","value":true}},{{"@type":"LocationFeatureSpecification","name":"Free Wi-Fi, 24 hours","value":true}},{{"@type":"LocationFeatureSpecification","name":"Uninterrupted power supply","value":true}},{{"@type":"LocationFeatureSpecification","name":"Airport pickup","value":true}},{{"@type":"LocationFeatureSpecification","name":"Restaurant and grill","value":true}},{{"@type":"LocationFeatureSpecification","name":"Security and parking","value":true}}]}}
</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{ICONS}</defs></svg>
'''

def nav(home):
    h = '' if home else 'index.html'
    return f'''
<header class="nav" id="nav">
  <div class="wrap">
    <a class="brand" href="{'#top' if home else 'index.html'}" aria-label="Clymax Signature Hotel &amp; Suites, home">
      <img src="img/mark-96.png" alt="" width="44" height="44">
      <span class="brand__name">Clymax Signature<small>Hotel &amp; Suites · Asaba</small></span>
    </a>
    <div class="nav__right">
      <a class="pill-book" href="{h}#reserve">{i('cal')}Book</a>
      <a class="circle-wa" href="{wa("Hello Clymax Signature, I'd like to book a room.")}" target="_blank" rel="noopener" aria-label="Book on WhatsApp">{b('whatsapp')}</a>
      <button class="menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">{i('menu')}</button>
    </div>
  </div>
</header>
'''

def drawer(page):
    h = '' if page == 'home' else 'index.html'
    cur = lambda p: ' aria-current="page"' if p == page else ''
    return f'''
<div class="scrim" data-close></div>
<aside class="drawer" id="drawer" aria-label="Site menu" aria-hidden="true">
  <div class="drawer__head">
    <a class="brand" href="{'#top' if page == 'home' else 'index.html'}" data-close><img src="img/mark-96.png" alt="" width="40" height="40"><span class="brand__name">Clymax Signature<small>Okpanam Road, Asaba · 24/7 front desk</small></span></a>
    <button class="drawer__close" type="button" aria-label="Close menu" data-close>{i('close')}</button>
  </div>
  <div class="drawer__body">
    <div class="drawer__cta">
      <a class="btn btn--gold" href="{h}#reserve" data-close>{i('cal')}Open booking &amp; reservations</a>
      <a class="btn btn--wa" href="{wa("Hello Clymax Signature, I'd like to book a room.")}" target="_blank" rel="noopener">{b('whatsapp')}WhatsApp reservation</a>
    </div>
    <div class="drawer__group">
      <p class="drawer__label">Explore</p>
      <ul class="drawer__links">
        <li><a href="{'#top' if page == 'home' else 'index.html'}"{cur('home')} data-close>{i('home')}Homepage</a></li>
        <li><a href="{h}#about" data-close>{i('info')}About us</a></li>
        <li><a href="rooms.html"{cur('rooms')}>{i('bed')}Rooms &amp; suites</a></li>
        <li><a href="{h}#offer" data-close>{i('star')}What we offer</a></li>
        <li><a href="faq.html"{cur('faq')}>{i('help')}FAQs</a></li>
      </ul>
    </div>
    <div class="drawer__group">
      <p class="drawer__label">Photos &amp; videos</p>
      <ul class="drawer__links">
        <li><a class="gold" href="{h}#tours" data-close>{i('play')}Walk through the rooms</a></li>
        <li><a class="gold" href="gallery.html"{cur('gallery')}>{i('image')}Hotel gallery</a></li>
      </ul>
    </div>
    <div class="drawer__group">
      <p class="drawer__label">Contact &amp; location</p>
      <ul class="drawer__links">
        <li><a href="{h}#contact" data-close>{i('mail')}Contact us &amp; message form</a></li>
        <li><a class="gold" href="{MAP}" target="_blank" rel="noopener">{i('pin')}Google Maps location{i('out', 'go')}</a></li>
        <li><a class="gold" href="tel:+{WA_NUM}">{i('phone')}Call {PHONE}</a></li>
      </ul>
    </div>
    <div class="drawer__group">
      <p class="drawer__label">Follow Clymax</p>
      <div class="tiles">
        <a class="tile" href="{TT}" target="_blank" rel="noopener">{b('tiktok')}TikTok</a>
        <a class="tile" href="{IG}" target="_blank" rel="noopener">{b('instagram')}Instagram</a>
        <a class="tile" href="{FB}" target="_blank" rel="noopener">{b('facebook')}Facebook</a>
      </div>
    </div>
  </div>
</aside>
'''

def footer(page):
    h = '' if page == 'home' else 'index.html'
    return f'''
<footer class="foot on-dark">
  <div class="wrap">
    <div class="foot__card">
      <div class="news">
        <div><h2>Newsletter</h2><p>Seasonal rates and news from the hotel. Enter your email to subscribe.</p></div>
        <form id="news-form" action="subscribe.php" method="post" novalidate>
          <label class="sr-only" for="n-email">Email address</label>
          <input id="n-email" name="email" type="email" autocomplete="email" placeholder="Enter your email address" required>
          <button class="btn btn--gold" type="submit">{i('send')}Subscribe</button>
          <p class="form__status" role="status" aria-live="polite"></p>
        </form>
      </div>
      <div class="foot__grid">
        <div class="foot__brand">
          <a class="brand" href="{'#top' if page == 'home' else 'index.html'}" aria-label="Clymax Signature Hotel &amp; Suites, home"><img src="img/mark-96.png" alt="" width="52" height="52" loading="lazy"><span class="brand__name">Clymax Signature Hotel &amp; Suites<small>Rooms, suites, pool &amp; the Climax Grill</small></span></a>
          <ul class="info">
            <li>{i('pin')}<a href="{MAP}" target="_blank" rel="noopener">{ADDR}, Nigeria</a></li>
            <li>{i('clock')}<span>Check-in 12:00 noon · Check-out 12:00 noon (next day)</span></li>
          </ul>
        </div>
        <div><h3>Explore</h3><ul class="links">
          <li><a href="{h}#about">About us</a></li><li><a href="rooms.html">Rooms &amp; suites</a></li><li><a href="{h}#offer">What we offer</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="faq.html">FAQs</a></li><li><a href="{h}#reserve">Reservations</a></li><li><a href="{h}#contact">Contact us</a></li></ul></div>
        <div><h3>Direct reservations</h3>
          <ul class="info" style="margin-top:0">
            <li>{i('phone')}<a href="tel:+{WA_NUM}">{PHONE}</a></li>
            <li>{b('whatsapp')}<a href="{wa('Hello Clymax Signature')}" target="_blank" rel="noopener">WhatsApp {PHONE}</a></li>
            <li>{i('card')}<span>Pay at the front desk: card, transfer or cash</span></li>
          </ul></div>
        <div><h3>Connect with us</h3>{socials('socials socials--sm')}</div>
      </div>
      <div class="foot__legal"><span>© 2026 Clymax Signature Hotel &amp; Suites · <a href="privacy.html">Privacy</a> · <a href="terms.html">Terms</a></span><span>Asaba, Delta State, Nigeria</span></div>
    </div>
  </div>
</footer>

<a class="wa" href="{wa("Hello Clymax Signature, I'd like to ask about a room.")}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">{b('whatsapp')}</a>
<dialog class="lightbox" id="lightbox" aria-label="Photo"><button class="lightbox__close" type="button" aria-label="Close photo">{i('close')}</button><img src="data:," alt=""></dialog>
<script src="js/site.js" defer></script>
</body>
</html>
'''

GUEST_OPTS = ''.join(f'<option{" selected" if g == "2 adults" else ""}>{g}</option>' for g in ['1 adult', '2 adults', '2 adults, 1 child', '2 adults, 2 children', '3 adults'])
ROOM_OPTS = ''.join(f'<option>{r[0]}</option>' for r in ROOMS)

def index():
    def svc_img(ic, pic, t):
        if pic:
            return f'<div class="svc__img"><img src="img/{pic}.webp" alt="{t}" width="800" height="600" loading="lazy"></div>'
        return f'<div class="svc__img svc__img--ic" aria-hidden="true">{i(ic)}</div>'
    offers = '\n'.join(f'''        <article class="svc">
          {svc_img(ic, pic, t.replace('&', '&amp;'))}
          <div class="svc__body">
            <h3>{t.replace('&', '&amp;')}</h3>
            <p class="svc__meta">{m}</p>
            <button class="svc__btn" type="button" aria-expanded="false" aria-controls="sv{k}"><span>See more</span>{i('plus')}</button>
            <p class="svc__more" id="sv{k}" hidden>{more}</p>
          </div>
        </article>''' for k, (ic, t, m, more, pic) in enumerate(OFFERS))
    tours = '\n'.join(f'''        <figure class="tour"><video muted loop playsinline preload="none" poster="media/tour-{k}-poster.webp" data-src="media/tour-{k}.mp4" aria-label="Video of the {n}" disablepictureinpicture></video><figcaption>{n}</figcaption></figure>''' for n, k in TOURS)
    _unused = '\n'.join(f'''        <button{f' class="{c}"' if c else ''} type="button"><img src="img/{f}.webp" alt="{a}" width="{w}" height="{hh}" loading="lazy"></button>''' for c, f, a, w, hh in GALLERY)
    main = f'''
<main id="main">
  <section class="hero" id="top">
    <video autoplay muted loop playsinline preload="auto" poster="media/hero-poster.webp" aria-hidden="true" tabindex="-1" disablepictureinpicture>
      <source src="media/hero-sm.mp4" type="video/mp4" media="(max-width: 720px)">
      <source src="media/hero.mp4" type="video/mp4">
    </video>
    <h1 class="sr-only">Clymax Signature Hotel &amp; Suites, Okpanam Road, Asaba</h1>
    <img class="hero__seal" id="hero-seal" src="img/mark-180.webp" alt="Clymax Signature Hotel &amp; Suites" width="180" height="180">
  </section>

  <div class="bookband">
    <form class="bookpill" id="bookbar" aria-label="Check availability" novalidate>
      <button class="bp-field bp-dates" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="datepop">{i('cal')}<span><b id="bp-dates-label">Check in · Check out</b><span id="bp-dates-sub">Tap to pick dates</span></span></button>
      <span class="bp-sep" aria-hidden="true"></span>
      <label class="bp-field bp-guests">{i('users')}<span><b id="bp-guests-label">2 adults</b></span><select id="b-guests" name="guests" aria-label="Guests">{GUEST_OPTS}</select></label>
      <button class="btn btn--gold" type="submit">Book stay</button>
      <div class="datepop" id="datepop" hidden>
        <label>Check in<input id="b-in" name="checkin" type="date"></label>
        <label>Check out<input id="b-out" name="checkout" type="date"></label>
        <button class="btn" type="button" id="dates-done">Done</button>
      </div>
    </form>
    <p class="book-note" id="bookbar-note" role="status" aria-live="polite"></p>
  </div>

  <section class="sec" id="about">
    <div class="wrap about">
      <div class="about__img"><img src="img/about.webp" alt="A Deluxe room with a grey padded headboard and a made king bed" width="1044" height="783" loading="lazy"></div>
      <div class="about__text">
        <h2>Welcome to Clymax Signature</h2>
        <p class="lead">Rooms and suites finished in marble and warm light, with a pool, two lounges and our own grill under one roof.</p>
        <p>Every room has a king bed, air conditioning, a smart TV, a work desk and its own bathroom. Wi-Fi and power run day and night, the forecourt is gated and guarded, and our driver can meet you at the airport.</p>
        <ul class="facts">
          <li>{i('bed')}<span><small>Rooms</small><b>6 room types</b></span></li>
          <li>{i('clock')}<span><small>Front desk</small><b>24 hours</b></span></li>
          <li>{i('cal')}<span><small>Check-in</small><b>12:00 noon</b></span></li>
          <li>{i('cal')}<span><small>Check-out</small><b>12:00, next day</b></span></li>
        </ul>
        <div class="about__actions">
          <a class="btn" href="rooms.html">See the rooms{i('arrow')}</a>
          <a class="textlink" href="#tours">Watch the room tours{i('arrow')}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="sec sec--night on-dark" id="tours">
    <div class="wrap">
      <div class="head head--row">
        <div style="display:grid;gap:10px"><h2>Walk through the rooms</h2><p>Short films shot in our rooms. Every room you see here is one you can book.</p></div>
      </div>
      <div class="tours">
{tours}
      </div>
      <div class="slider-nav"><span class="hint">Swipe to see more rooms</span><a class="btn btn--line" href="rooms.html">Rooms &amp; prices{i('arrow')}</a></div>
    </div>
  </section>

  <section class="sec" id="offer">
    <div class="wrap">
      <div class="head head--center"><h2>What we offer</h2><p>Everything you need without leaving the hotel.</p></div>
      <div class="offers">
{offers}
      </div>
    </div>
  </section>

  <section class="sec" id="reserve">
    <div class="wrap reserve">
      <div class="reserve__text">
        <h2>Reserve your stay</h2>
        <p>Fill in your dates and we'll confirm on WhatsApp, usually within the hour.</p>
        <ol class="steps">
          <li><b>1</b><span>Choose your dates and room.</span></li>
          <li><b>2</b><span>Press <strong>Send on WhatsApp</strong>; your request opens as a ready-made message.</span></li>
          <li><b>3</b><span>The front desk confirms your room and, if you asked, your airport pickup.</span></li>
        </ol>
      </div>
      <form class="card form" id="reserve-form" novalidate>
        <div class="row">
          <div class="field"><label for="r-in">Check in</label><input id="r-in" name="checkin" type="date" required aria-describedby="r-in-err"><p class="err" id="r-in-err" hidden>Choose your arrival date.</p></div>
          <div class="field"><label for="r-out">Check out</label><input id="r-out" name="checkout" type="date" required aria-describedby="r-out-err"><p class="err" id="r-out-err" hidden>Choose a date after check-in.</p></div>
        </div>
        <div class="row">
          <div class="field"><label for="r-room">Room</label><select id="r-room" name="room">{ROOM_OPTS}</select></div>
          <div class="field"><label for="r-guests">Guests</label><select id="r-guests" name="guests">{GUEST_OPTS}</select></div>
        </div>
        <div class="row">
          <div class="field"><label for="r-name">Full name</label><input id="r-name" name="name" type="text" autocomplete="name" required aria-describedby="r-name-err"><p class="err" id="r-name-err" hidden>Write the name for the booking.</p></div>
          <div class="field"><label for="r-phone">Phone</label><input id="r-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required aria-describedby="r-phone-err"><p class="err" id="r-phone-err" hidden>Write a number we can reach.</p></div>
        </div>
        <label class="check"><input type="checkbox" name="pickup" id="r-pickup"> I'd like an airport pickup</label>
        <div class="field"><label for="r-notes">Requests (optional)</label><textarea id="r-notes" name="notes" placeholder="Flight number, arrival time, anything else"></textarea></div>
        <button class="btn btn--wa" type="submit">{b('whatsapp')}Send on WhatsApp</button>
        <p class="form__status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>

  <section class="sec sec--night on-dark" id="contact">
    <div class="wrap contact">
      <div>
        <div class="head"><h2>Contact us</h2><p>The front desk is open 24 hours. WhatsApp is the fastest way to book or ask a question.</p></div>
        {socials()}
        <ul class="info">
          <li>{i('pin')}<a href="{MAP}" target="_blank" rel="noopener">{ADDR}</a></li>
          <li>{i('phone')}<a href="tel:+{WA_NUM}">{PHONE_INTL}</a></li>
          <li>{i('clock')}<span>Front desk open 24 hours</span></li>
        </ul>
      </div>
      <form class="card form" id="contact-form" novalidate>
        <div class="row">
          <div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" type="text" autocomplete="name" required aria-describedby="c-name-err"><p class="err" id="c-name-err" hidden>Write your name.</p></div>
          <div class="field"><label for="c-reply">Phone or email</label><input id="c-reply" name="reply" type="text" autocomplete="email" required aria-describedby="c-reply-err"><p class="err" id="c-reply-err" hidden>Write how we can reply.</p></div>
        </div>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required aria-describedby="c-msg-err"></textarea><p class="err" id="c-msg-err" hidden>Write your message.</p></div>
        <button class="btn btn--gold" type="submit">{i('send')}Send message</button>
        <p class="form__status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>
</main>
'''
    pre = '<link rel="preload" as="image" href="media/hero-poster.webp" fetchpriority="high">\n'
    return head('Clymax Signature Hotel &amp; Suites, Asaba | Rooms, pool and the Climax Grill',
                'Hotel in Okpanam, Asaba, Delta State: rooms and suites with an outdoor pool, two lounges, the Climax Grill, 24-hour Wi-Fi, uninterrupted power and airport pickup.', pre) \
        + nav(True) + drawer('home') + main + footer('home')

def rooms():
    cards = '\n'.join(f'''        <article class="room">
          <div class="room__img"><img src="img/{f}.webp" alt="{n}: {d}" width="800" height="1000" loading="lazy"><span class="room__price"><b>{p}</b> / night</span></div>
          <div class="room__body">
            <h3>{n}</h3>
            <ul class="room__facts"><li>{i('users')}{facts[0]}</li><li>{i('bed')}{facts[1]}</li><li>{i('tv')}{facts[2]}</li></ul>
            <a class="btn btn--wa" href="{wa(f'Hello Clymax Signature, I would like to book the {n}. Please share availability and the rate.')}" target="_blank" rel="noopener">{b('whatsapp')}Book this room</a>
          </div>
        </article>''' for n, f, p, d, facts in ROOMS)
    main = f'''
<main id="main">
  <section class="sec sec--ivory page-top" id="top">
    <div class="wrap">
      <div class="head"><h1 style="font-size:var(--t-h2)">Rooms &amp; Suites</h1><p>Six ways to stay, from the Classic room to the Royal suite. Every room has a king bed, air conditioning, a smart TV, free Wi-Fi and an en-suite bathroom. Check in at 12:00 noon, check out at 12:00 noon the next day.</p></div>
      <div class="rooms">
{cards}
      </div>
      <p style="margin-top:28px;display:flex;flex-wrap:wrap;gap:10px 20px;align-items:center"><a class="btn" href="index.html#reserve">Reserve with your dates{i('arrow')}</a><a class="textlink" href="index.html#tours">Watch the room tours{i('arrow')}</a></p>
    </div>
  </section>
</main>
'''
    return head('Rooms &amp; Suites | Clymax Signature Hotel &amp; Suites, Asaba',
                'Six room types at Clymax Signature Hotel & Suites, Asaba, from the Classic room to the Royal suite. Book on WhatsApp.') \
        + nav(False) + drawer('rooms') + main + footer('rooms')

def faq():
    items = '\n'.join(f'        <details{" open" if k == 0 else ""}><summary>{q}<i aria-hidden="true"></i></summary><p class="ans">{a}</p></details>' for k, (q, a) in enumerate(FAQ))
    main = f'''
<main id="main">
  <section class="sec sec--ivory page-top" id="top">
    <div class="wrap faq">
      <div class="faq__head">
        <h1>Frequently asked questions</h1>
        <p>Can't find your answer? Message the front desk on WhatsApp. Someone answers day and night.</p>
        <a class="btn btn--wa" href="{wa('Hello Clymax Signature, I have a question.')}" target="_blank" rel="noopener">{b('whatsapp')}Ask the front desk</a>
      </div>
      <div class="qa">
{items}
      </div>
    </div>
  </section>
</main>
'''
    return head('FAQs | Clymax Signature Hotel &amp; Suites, Asaba',
                'Check-in and check-out times, airport pickup, payment, breakfast, pool, parking, Wi-Fi and power at Clymax Signature Hotel & Suites, Asaba.') \
        + nav(False) + drawer('faq') + main + footer('faq')


def gallery():
    tiles = '\n'.join(f'''        <button{f' class="{c}"' if c else ''} type="button"><img src="img/{f}.webp" alt="{a}" width="{w}" height="{hh}" loading="lazy"></button>''' for c, f, a, w, hh in GALLERY)
    main = f'''
<main id="main">
  <section class="sec sec--ivory page-top" id="top">
    <div class="wrap">
      <div class="head"><h1 style="font-size:var(--t-h2)">Gallery</h1><p>Rooms and details from around the hotel. Tap any photo to see it larger.</p></div>
      <div class="gallery">
{tiles}
      </div>
      <p style="margin-top:24px;display:flex;flex-wrap:wrap;gap:10px 20px;align-items:center"><a class="btn" href="rooms.html">See the rooms{i('arrow')}</a><a class="textlink" href="index.html#tours">Watch the room tours{i('arrow')}</a></p>
    </div>
  </section>
</main>
'''
    return head('Gallery | Clymax Signature Hotel &amp; Suites, Asaba',
                'Photos of the rooms, suites and details at Clymax Signature Hotel & Suites, Asaba.') \
        + nav(False) + drawer('gallery') + main + footer('gallery')

for name, fn in [('index.html', index), ('rooms.html', rooms), ('faq.html', faq), ('gallery.html', gallery)]:
    html = re.sub(r'((?:src|href|poster|data-src|srcset)=")((?:img|media|css|js)/[^"?\s]+)"', lambda m: f'{m.group(1)}{m.group(2)}?v={BUILD}"', fn())
    open(os.path.join(ROOT, name), 'w').write(html)
    print('wrote', name)
