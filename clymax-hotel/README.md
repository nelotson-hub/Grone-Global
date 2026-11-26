# Clymax Signature Hotel & Suites website

A static, responsive one-page site: `index.html`, `privacy.html` and `terms.html`, with images in `img/` and the design kit in `assets/`. It needs no build step.

## Preview locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Still needed from the hotel

Search `index.html` for `data-assumed` to find every assumed value.

| What | Where it goes | Now |
|---|---|---|
| WhatsApp number | every `https://wa.me/` link: add the number in international format, e.g. `https://wa.me/234XXXXXXXXXX?text=...` | the links open WhatsApp with the message ready, but no contact is filled in |
| Facebook page URL | `.socials` in the footer | a Facebook search for the hotel name |
| Booking email or form service | `action` and `data-endpoint` on the booking and newsletter forms | `bookings@clymaxsignature.example` placeholder |
| Street and area | Getting here section and footer | left out |
| Room names and prices | room tiles, nav panel, booking select, closing line | assumed names and ₦ prices |
| Opening times | pool, lounges, grill, check-in and check-out | assumed |
| Photos of the pool, outside lounge, inside lounge and Climax Grill | `#house` section (replaces the entrance film) | not yet supplied |
| A sharp photo of the lit entrance sign | `img/entrance-sign.webp` | a frame from the 640x360 video |
| Domain | `<link rel="canonical">` in the head | commented out |
