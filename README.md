# Heavora's Cravings 🍰

Static website for Heavora's Cravings, a bakery for Cakes, Snacks & Sweet Treats.

## Files
- `index.html`: page structure (hero, about, menu, gallery, order form, contact)
- `styles.css`: chocolate, gold, cream & pink theme, responsive
- `script.js`: menu data + WhatsApp ordering
- `assets/`: logo + food photos

## Customise
- **WhatsApp number:** `WHATSAPP_NUMBER` at the top of `script.js` is set to `2349068563859` (digits only). Every menu card's **Order** button is a direct `wa.me` link with a prefilled message for that item; the custom order form and floating button use the same number.
- **Menu & prices:** edit the `MENU` array in `script.js` (prices are placeholders).
- **Email/Instagram:** edit the footer links in `index.html`.

## Run
Open `index.html` in a browser, or deploy free with GitHub Pages / Vercel / Netlify.

## Deploy (Railway)
`npm start` serves the site on `$PORT` using `serve`.

## Design & animation
Dark chocolate, cream and gold theme. Playfair Display headings, Inter body, Great Vibes for the brand name. Staggered hero entrance, animated melting chocolate drip, scroll-reveal with stagger (IntersectionObserver), light parallax on food photos, card lift + image zoom, button micro-interactions. All motion is disabled under `prefers-reduced-motion`.

## Photo credits
- Unsplash (Unsplash License): hero chocolate cake, red velvet, celebration cake, cupcakes, doughnuts, parfait and all `g-*.jpg` gallery images.
- Wikimedia Commons:
  - `meat-pie.jpg`: "A Northern Nigeria snacks called meat pie 22", CC BY-SA 4.0
  - `puff-puff.jpg`: "Puff Puff", CC BY-SA 4.0
  - `chin-chin.jpg`: "Chin-chin", CC BY 3.0
  - `sausage-roll.jpg`: "Marmite & pork sausage roll - The Roastery 2024-04-05", CC0

Swap any of these for your own product photos (same filenames) whenever you're ready.

## Design Your Cake
The `#designer` section lets customers pick size, tiers, flavour, filling, frosting and colour, toppings, a message (max 30 chars), occasion and date. A live SVG preview updates as they choose.
- **Prices:** edit the `PRICING` object at the top of `script.js`. The values are placeholders, and the site labels the result as an estimate, with the final price confirmed on WhatsApp. Frosting colours are in `FROSTING_COLOURS` and occasions in `OCCASIONS`.
- **Order this cake on WhatsApp** opens `wa.me/2349068563859` with the full design summary, the estimate, and a note about sending a reference photo.
