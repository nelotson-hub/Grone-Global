# Clymax Signature Hotel & Suites website

Static site: `index.html`, `rooms.html`, `gallery.html`, `faq.html`, `privacy.html`, `terms.html`, with `css/`, `js/`, `img/` (WebP) and `media/` (silent MP4 clips). `subscribe.php` saves newsletter signups to `data/subscribers.csv` (blocked from the web).

Live (temporary Hostinger address): https://rhythmic-bisque-mongoose-69.hostingersite.com

## Preview locally

```bash
python3 -m http.server 8080
```

## Contact details

WhatsApp number and Facebook URL are set at the top of `js/site.js` and written into `index.html` and `faq.html`. Every booking path (booking bar, Book this room, Book now, reservation form, contact form, floating button) opens WhatsApp to +234 707 336 9981 with a ready-made message.

## Still to supply

- Real room names and prices (the ₦65,000–₦160,000 rates are stand-ins)
- Photos of the pool, the outside and inside lounges, the restaurant and the Climax Grill
- The original, full-resolution header video (the current one is upscaled from 640×360)
- A custom domain, if wanted

## Editing

The three main pages share one header, menu and footer. Edit `tools/build.py` (rooms, prices, offers, FAQ answers, contact details) and run `python3 tools/build.py` from this folder to rebuild `index.html`, `rooms.html`, `gallery.html` and `faq.html`. Each build tags every local file with `?v=`, so browsers always load the matching styles and photos.
