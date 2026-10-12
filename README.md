# Heavora's Cravings 🍰

Static website for Heavora's Cravings, a bakery for Cakes, Snacks & Sweet Treats.

## Files
- `index.html`: page structure (hero, about, menu, gallery, order form, contact)
- `styles.css`: chocolate, gold, cream & pink theme, responsive
- `script.js`: menu data + WhatsApp ordering
- `assets/logo.jpg`: logo

## Customise
- **WhatsApp number:** `WHATSAPP_NUMBER` at the top of `script.js` is set to `2349068563859` (digits only). Every menu card's **Order** button is a direct `wa.me` link with a prefilled message for that item; the custom order form and floating button use the same number.
- **Menu & prices:** edit the `MENU` array in `script.js` (prices are placeholders).
- **Email/Instagram:** edit the footer links in `index.html`.

## Run
Open `index.html` in a browser, or deploy free with GitHub Pages / Vercel / Netlify.

## Deploy (Railway)
`npm start` serves the site on `$PORT` using `serve`.
