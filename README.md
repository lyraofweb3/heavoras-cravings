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

## Design Your Cake (3D)
Section `#designer`: a 5-step wizard (Size → Flavour → Frosting → Decor → Details) with a progress bar and a real-time 3D cake.
- **3D preview** (`cake3d.js`): Three.js r160, loaded from unpkg through the import map in `index.html` (pinned version). It includes:
  - stacked tiers scaled by size, with matte buttercream, glossy ganache, smooth fondant, whipped and naked-sponge finishes
  - an animated chocolate drip
  - strawberries, macarons, gold flakes, sprinkles and flowers
  - candles with a flickering glow
  - the message drawn on top or around the side of a chosen tier
  - studio lighting with soft shadows, drag/touch to rotate, auto-rotate when idle, and animated transitions
  If WebGL or the CDN is unavailable, it falls back to the 2D SVG preview (`?no3d` forces it).
- **Smart helpers:**
  - "serves ~N" from size and tiers
  - size suggestion from guest count
  - flavour pairing tips
  - date checks: past dates are disabled, under 48h shows a warning and adds a rush fee
  - 3 tiers need at least an 8″ base
  - theme presets, "Surprise me", live price breakdown, PNG download of the design, Share (native share or copy to clipboard)
- **Editable config** at the top of `script.js`: `PRICING` (placeholder ₦ values; the site labels the result an estimate, final price on WhatsApp), `SERVINGS`, `FROSTING_COLOURS`, `TEXT_COLOURS`, `PAIRINGS`, `PRESETS`, `OCCASIONS`.
- **Order this cake on WhatsApp** sends the full summary to `wa.me/2349068563859`: tiers and servings, flavour, filling, frosting and colour, toppings, the message with its placement, font and colour, the occasion and date, the estimate, and a note about sending a reference photo.
