// WhatsApp number (international format, digits only, no +)
const WHATSAPP_NUMBER = "2349068563859";

// 🎂 DESIGN-YOUR-CAKE PRICING (PLACEHOLDER values in ₦, edit freely).
// Shown to customers as an ESTIMATE; final price is confirmed on WhatsApp.
const PRICING = {
  tierSize: { 4: 7000, 6: 12000, 8: 18000, 10: 26000, 12: 35000 }, // price of ONE tier of each diameter (inches)
  flavour: { "Chocolate": 0, "Vanilla": 0, "Red Velvet": 2000, "Strawberry": 1500, "Lemon": 1500, "Coconut": 1500, "Marble": 1000 },
  filling: { "None": 0, "Buttercream": 1000, "Chocolate Ganache": 2500, "Strawberry Jam": 1500, "Cream Cheese": 2000, "Caramel": 2000 },
  frostingPerTier: { "Buttercream": 0, "Whipped Cream": 0, "Fondant": 5000, "Ganache": 3000, "Naked": -1000 },
  toppings: { "Strawberries": 2500, "Gold Flakes": 4000, "Sprinkles": 800, "Chocolate Drip": 2000, "Macarons": 4500, "Flowers": 3500, "Candles": 500 },
  message: 500,
  rushFee: 3000,               // added when needed in under 48 hours
  roundTo: 500,
};
const SIZES = [6, 8, 10, 12];                      // selectable bottom-tier sizes (inches)
const SERVINGS = { 4: 8, 6: 14, 8: 24, 10: 38, 12: 56 }; // approx. party slices per tier
const MIN_BASE_FOR_TIERS = { 1: 6, 2: 6, 3: 8 };
const FROSTING_COLOURS = { "Cream": "#f6ead6", "Chocolate": "#5a341f", "Blush Pink": "#f2c4c8", "Gold": "#d9ad5b", "White": "#ffffff", "Lavender": "#cdbbe6", "Sky Blue": "#bcd8ef", "Mint": "#bfe3cf", "Red": "#b8283a" };
const TEXT_COLOURS = { "Chocolate": "#3a1f12", "White": "#ffffff", "Gold": "#d4a24c", "Red": "#b8283a", "Pink": "#e88ba0" };
const OCCASIONS = ["Birthday", "Wedding", "Anniversary", "Baby Shower", "Graduation", "Bridal Shower", "Just Because", "Other"];
const PAIRINGS = {
  "Chocolate": { filling: "Chocolate Ganache", frosting: "Ganache" }, "Vanilla": { filling: "Strawberry Jam", frosting: "Buttercream" },
  "Red Velvet": { filling: "Cream Cheese", frosting: "Buttercream" }, "Strawberry": { filling: "Cream Cheese", frosting: "Whipped Cream" },
  "Lemon": { filling: "Buttercream", frosting: "Whipped Cream" }, "Coconut": { filling: "Caramel", frosting: "Buttercream" }, "Marble": { filling: "Chocolate Ganache", frosting: "Buttercream" },
};
const PRESETS = {
  "Birthday": { size: 8, tiers: 2, flavour: "Chocolate", filling: "Chocolate Ganache", frosting: "Buttercream", colour: "Blush Pink", toppings: ["Chocolate Drip", "Sprinkles", "Strawberries", "Candles"], message: "Happy Birthday!", msgPlace: "Side", msgTier: 1, msgFont: "Script", msgColour: "Chocolate", occasion: "Birthday" },
  "Wedding": { size: 10, tiers: 3, flavour: "Vanilla", filling: "Buttercream", frosting: "Fondant", colour: "White", toppings: ["Flowers", "Gold Flakes"], message: "", msgPlace: "Top", msgTier: 1, msgFont: "Script", msgColour: "Gold", occasion: "Wedding" },
  "Kids": { size: 6, tiers: 1, flavour: "Vanilla", filling: "Strawberry Jam", frosting: "Whipped Cream", colour: "Sky Blue", toppings: ["Sprinkles", "Macarons", "Candles"], message: "Yay, you're 5!", msgPlace: "Side", msgTier: 1, msgFont: "Modern", msgColour: "White", occasion: "Birthday" },
  "Anniversary": { size: 8, tiers: 2, flavour: "Red Velvet", filling: "Cream Cheese", frosting: "Buttercream", colour: "Red", toppings: ["Strawberries", "Gold Flakes", "Flowers"], message: "Happy Anniversary", msgPlace: "Side", msgTier: 1, msgFont: "Script", msgColour: "Gold", occasion: "Anniversary" },
  "Graduation": { size: 8, tiers: 2, flavour: "Chocolate", filling: "Caramel", frosting: "Ganache", colour: "Chocolate", toppings: ["Gold Flakes", "Macarons"], message: "Congrats Grad!", msgPlace: "Top", msgTier: 1, msgFont: "Modern", msgColour: "Gold", occasion: "Graduation" },
};
const tierSizes = d => Array.from({ length: d.tiers }, (_, i) => Math.max(4, d.size - 2 * i));
const cakeServings = d => tierSizes(d).reduce((a, s) => a + SERVINGS[s], 0);
const hoursUntil = (date, now = new Date()) => date ? (new Date(date + "T12:00:00") - now) / 36e5 : Infinity;
const tierName = (i, n) => n === 1 ? "the cake" : ["bottom", "middle", "top"][n === 2 && i === 1 ? 2 : i] + " tier";
function suggestForGuests(g) {
  const opts = []; for (const t of [1, 2, 3]) for (const s of SIZES) { if (s < MIN_BASE_FOR_TIERS[t]) continue; const sv = cakeServings({ size: s, tiers: t }); if (sv >= g) opts.push({ size: s, tiers: t, sv }); }
  return opts.sort((a, b) => a.sv - b.sv)[0] || { size: 12, tiers: 3, sv: cakeServings({ size: 12, tiers: 3 }) };
}
function cakeBreakdown(d, now) {
  const rows = tierSizes(d).map((s, i) => [`${s}″ tier${d.tiers > 1 ? " (" + tierName(i, d.tiers) + ")" : ""}`, PRICING.tierSize[s]]);
  if (PRICING.flavour[d.flavour]) rows.push([`${d.flavour} flavour`, PRICING.flavour[d.flavour]]);
  if (PRICING.filling[d.filling]) rows.push([`${d.filling} filling`, PRICING.filling[d.filling]]);
  if (PRICING.frostingPerTier[d.frosting]) rows.push([`${d.frosting} × ${d.tiers}`, PRICING.frostingPerTier[d.frosting] * d.tiers]);
  d.toppings.forEach(t => rows.push([t, PRICING.toppings[t] || 0]));
  if (d.message) rows.push(["Custom message", PRICING.message]);
  if (hoursUntil(d.date, now) < 48) rows.push(["Rush (under 48h)", PRICING.rushFee]);
  return rows;
}
function cakeEstimate(d, now) { const t = cakeBreakdown(d, now).reduce((a, r) => a + r[1], 0); return Math.round(t / PRICING.roundTo) * PRICING.roundTo; }
function msgPlacementText(d) { return d.msgPlace === "Top" ? "on top of the cake" : `on the side of ${d.tiers > 1 ? "the " : ""}${tierName(Math.min(d.msgTier, d.tiers) - 1, d.tiers)}`; }
function cakeMessage(d, now) {
  return [
    "Hello Heavora's Cravings! 🎂 I'd like to order a custom cake:", "",
    `Size: ${d.size}″ base, ${d.tiers} tier${d.tiers > 1 ? "s" : ""} (${tierSizes(d).map(s => s + "″").join(" + ")}), serves ~${cakeServings(d)}`,
    `Flavour: ${d.flavour}`, `Filling: ${d.filling}`, `Frosting: ${d.frosting} (${d.colour})`,
    `Toppings: ${d.toppings.length ? d.toppings.join(", ") : "None"}`,
    d.message ? `Message: "${d.message}", ${msgPlacementText(d)}, ${d.msgFont} lettering in ${d.msgColour}` : "Message: None",
    `Occasion: ${d.occasion}`, `Needed by: ${d.date || "Not set"}${hoursUntil(d.date, now) < 48 ? " (rush, under 48h)" : ""}`,
    "", `Estimated price: ₦${cakeEstimate(d, now).toLocaleString("en-NG")} (estimate, please confirm final price)`,
    "", "I'll send a reference photo in this chat if I have one. Please confirm availability.",
  ].join("\n");
}

// ✏️ EDIT YOUR MENU HERE. Prices are PLACEHOLDERS in Naira (₦).
const MENU = [
  { name: "Chocolate Fudge Cake", image: "assets/hero-chocolate-cake.jpg", category: "Cakes", price: 15000, emoji: "🎂", desc: "Rich, moist chocolate layers with fudge frosting." },
  { name: "Red Velvet Cake", image: "assets/red-velvet.jpg", category: "Cakes", price: 18000, emoji: "🍰", desc: "Velvety red crumb with cream cheese frosting (also as cupcakes)." },
  { name: "Vanilla Celebration Cake", image: "assets/celebration-cake.jpg", category: "Cakes", price: 14000, emoji: "🎉", desc: "Classic vanilla sponge, custom decorated." },
  { name: "Meat Pie", image: "assets/meat-pie.jpg", category: "Snacks", price: 800, emoji: "🥧", desc: "Buttery pastry filled with seasoned minced meat." },
  { name: "Puff-Puff (pack of 10)", image: "assets/puff-puff.jpg", category: "Snacks", price: 1000, emoji: "🟤", desc: "Soft, fluffy, golden Nigerian doughballs." },
  { name: "Chin Chin (500g)", image: "assets/chin-chin.jpg", category: "Snacks", price: 2500, emoji: "🍪", desc: "Crunchy, lightly sweet fried bites." },
  { name: "Sausage Roll", image: "assets/sausage-roll.jpg", category: "Snacks", price: 700, emoji: "🌭", desc: "Flaky pastry wrapped around spiced sausage." },
  { name: "Cupcakes (box of 6)", image: "assets/cupcakes.jpg", category: "Sweet Treats", price: 6000, emoji: "🧁", desc: "Assorted flavours with swirled frosting." },
  { name: "Glazed Doughnuts (box of 6)", image: "assets/doughnuts.jpg", category: "Sweet Treats", price: 4500, emoji: "🍩", desc: "Soft doughnuts with sugar or chocolate glaze." },
  { name: "Cake Parfait", image: "assets/parfait.jpg", category: "Sweet Treats", price: 3500, emoji: "🥤", desc: "Layers of cake, cream and toppings in a cup." },
];

const naira = n => "₦" + n.toLocaleString("en-NG");
const waUrl = msg => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const itemLink = i => waUrl(`Hello Heavora's Cravings! I'd like to order: ${i.name} (${i.category}) - ${naira(i.price)}. Quantity: 1. Please confirm availability.`);
if (typeof module !== "undefined") module.exports = { MENU, itemLink, PRICING, cakeEstimate, cakeBreakdown, cakeMessage, cakeServings, suggestForGuests, tierSizes, waUrl };

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const io = ("IntersectionObserver" in window && !reduce) ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.01, rootMargin: "0px 0px -40px 0px" }) : null;
function observeStagger(root) {
  [...root.children].forEach((el, k) => { el.style.setProperty("--sd", (k % 4) * 0.1 + "s"); if (io) io.observe(el); else el.classList.add("in"); });
}
if (!io) document.documentElement.classList.add("js-off");

const grid = document.getElementById("menu-grid");
function render(cat = "all") {
  grid.innerHTML = MENU.filter(i => cat === "all" || i.category === cat).map(i => `
    <article class="card"><div class="ph"><img src="${i.image}" alt="${i.name}" loading="lazy"><span class="cat">${i.category}</span></div>
    <div class="body"><h3>${i.name}</h3><p>${i.desc}</p>
    <div class="row"><span class="price">${naira(i.price)}</span>
    <a class="order-btn" href="${itemLink(i)}" target="_blank" rel="noopener">Order →</a></div></div></article>`).join("");
  observeStagger(grid);
}
render();
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
  t.classList.add("active"); render(t.dataset.cat);
}));

const select = document.getElementById("item-select");
select.innerHTML = MENU.map(i => `<option>${i.name}</option>`).join("") + "<option>Other / Custom</option>";

document.getElementById("order-form").addEventListener("submit", e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const msg = `Hello Heavora's Cravings! 🍰\nI'd like to place an order:\n\nName: ${f.name}\nPhone: ${f.phone || "-"}\nItem: ${f.item}\nQuantity: ${f.qty}\nDate needed: ${f.date || "-"}\n${f.mode}\nDetails: ${f.notes || "-"}`;
  window.open(waUrl(msg), "_blank");
});

const hi = waUrl("Hello Heavora's Cravings! I'd like to make an enquiry.");
document.getElementById("wa-link").href = hi; document.getElementById("wa-float").href = hi;

const burger = document.querySelector(".burger"), links = document.getElementById("links");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", links.classList.toggle("open")));
links.addEventListener("click", e => e.target.tagName === "A" && links.classList.remove("open"));
document.getElementById("yr").textContent = new Date().getFullYear();


// Scroll reveal
document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));
document.querySelectorAll(".stagger").forEach(observeStagger);

// Nav background on scroll + gentle parallax
const nav = document.getElementById("nav");
const px = [...document.querySelectorAll("[data-parallax]")];
let ticking = false;
function onScroll() {
  nav.classList.toggle("scrolled", scrollY > 40);
  if (!reduce && innerWidth > 760) px.forEach(el => {
    const r = el.getBoundingClientRect(), mid = r.top + r.height / 2 - innerHeight / 2;
    el.style.translate = `0 ${(-mid * el.dataset.parallax).toFixed(1)}px`;
  });
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// ===== Design Your Cake: UI, smart helpers & 2D fallback preview =====
(() => {
  const form = document.getElementById("cake-form"); if (!form) return;
  const $ = id => document.getElementById(id);
  const attr = v => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); // escape values for HTML attributes (fixes 8" bug)
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const d = Object.assign({ guests: "", date: "" }, PRESETS.Birthday, { message: "" });
  window.cakeDesign = d;

  // --- option builders (values carried by index/JSON, never raw strings with quotes) ---
  const OPTS = {
    size: SIZES.map(s => [s, `${s}″`]), tiers: [1, 2, 3].map(t => [t, `${t} tier${t > 1 ? "s" : ""}`]),
    frosting: Object.keys(PRICING.frostingPerTier).map(f => [f, f]), toppings: Object.keys(PRICING.toppings).map(t => [t, t]),
    msgPlace: [["Top", "On top"], ["Side", "On the side"]], msgFont: [["Script", "Script"], ["Modern", "Modern"]], msgTier: [],
  };
  const pillBox = n => form.querySelector(`[data-name="${n}"]`);
  function renderPills(n) {
    const box = pillBox(n);
    box.innerHTML = OPTS[n].map(([v, l], i) => `<button type="button" class="pill" data-i="${i}" aria-pressed="false">${esc(l)}</button>`).join("");
  }
  form.addEventListener("click", e => {
    const b = e.target.closest(".pill"); if (!b) return;
    const n = b.parentElement.dataset.name, v = OPTS[n][+b.dataset.i][0];
    if (n === "toppings") d.toppings = d.toppings.includes(v) ? d.toppings.filter(x => x !== v) : [...d.toppings, v];
    else d[n] = v;
    if (n === "size" || n === "tiers") enforceTiers(n);
    update(n);
  });
  ["size", "tiers", "frosting", "toppings", "msgPlace", "msgFont"].forEach(renderPills);
  const fill = (n, opts) => { form[n].innerHTML = opts.map(o => `<option value="${attr(o)}">${esc(o)}</option>`).join(""); };
  fill("flavour", Object.keys(PRICING.flavour)); fill("filling", Object.keys(PRICING.filling)); fill("occasion", OCCASIONS);
  const swatches = (el, map, key) => {
    el.innerHTML = Object.entries(map).map(([n, c], i) => `<button type="button" class="sw" role="radio" title="${attr(n)}" aria-label="${attr(n)}" data-i="${i}" style="--c:${c}"></button>`).join("");
    el.addEventListener("click", e => { const b = e.target.closest(".sw"); if (b) { d[key] = Object.keys(map)[+b.dataset.i]; update(key); } });
  };
  const sw = form.querySelector(".swatches"); swatches(sw, FROSTING_COLOURS, "colour"); swatches($("msg-colours"), TEXT_COLOURS, "msgColour");
  form.addEventListener("input", e => {
    const n = e.target.name; if (!n) return;
    d[n] = e.target.type === "number" ? e.target.value : e.target.value; update(n);
  });

  // --- date: disable past dates ---
  const today = new Date(); const iso = x => new Date(x - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  form.date.min = iso(today);

  // --- smart rules ---
  const toastEl = $("toast"); let tt;
  const toast = m => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };
  function enforceTiers(changed) {
    const min = MIN_BASE_FOR_TIERS[d.tiers];
    if (d.size < min) { if (changed === "tiers") { d.size = min; toast(`${d.tiers} tiers need at least a ${min}″ base, so we switched to ${min}″.`); } else { d.tiers = 2; toast(`A ${d.size}″ base fits up to 2 tiers.`); } }
    if (d.msgTier > d.tiers) d.msgTier = d.tiers;
  }

  // --- wizard ---
  const STEPS = ["Size", "Flavour", "Frosting", "Decor", "Details"]; let step = 0;
  $("steps").innerHTML = STEPS.map((s, i) => `<button type="button" role="tab" class="step" data-s="${i}"><b>${i + 1}</b>${s}</button>`).join("");
  const panels = [...form.querySelectorAll(".panel")];
  function go(s) {
    step = Math.max(0, Math.min(STEPS.length - 1, s));
    panels.forEach((p, i) => { p.hidden = i !== step; if (i === step) { p.classList.remove("in-panel"); void p.offsetWidth; p.classList.add("in-panel"); } });
    form.querySelectorAll(".step").forEach((b, i) => { b.classList.toggle("on", i === step); b.classList.toggle("done", i < step); b.setAttribute("aria-selected", i === step); });
    $("progress-bar").style.width = ((step + 1) / STEPS.length * 100) + "%";
    $("prev").disabled = step === 0;
    $("next").innerHTML = step === STEPS.length - 1 ? "Order on WhatsApp <span>→</span>" : "Next <span>→</span>";
  }
  $("steps").addEventListener("click", e => { const b = e.target.closest(".step"); if (b) go(+b.dataset.s); });
  $("prev").onclick = () => go(step - 1);
  $("next").onclick = () => step === STEPS.length - 1 ? window.open($("cake-order").href, "_blank", "noopener") : go(step + 1);

  // --- presets & surprise ---
  $("presets").innerHTML = Object.keys(PRESETS).map(p => `<button type="button" class="preset" data-p="${attr(p)}">${{ Birthday: "🎉", Wedding: "💍", Kids: "🧸", Anniversary: "❤️", Graduation: "🎓" }[p]} ${esc(p)}</button>`).join("");
  $("presets").addEventListener("click", e => { const b = e.target.closest(".preset"); if (!b) return; Object.assign(d, structuredClone(PRESETS[b.dataset.p])); update("preset"); toast(`${b.dataset.p} theme applied. Tweak anything you like!`); });
  const pick = a => a[Math.floor(Math.random() * a.length)];
  $("surprise").onclick = () => {
    const tiers = pick([1, 2, 2, 3]); const flav = pick(Object.keys(PRICING.flavour)); const p = PAIRINGS[flav];
    const tops = Object.keys(PRICING.toppings).filter(() => Math.random() < .4);
    Object.assign(d, { tiers, size: pick(SIZES.filter(s => s >= MIN_BASE_FOR_TIERS[tiers])), flavour: flav, filling: p.filling, frosting: Math.random() < .7 ? p.frosting : pick(Object.keys(PRICING.frostingPerTier)), colour: pick(Object.keys(FROSTING_COLOURS)), toppings: tops.length ? tops : ["Sprinkles"], msgPlace: pick(["Top", "Side"]), msgFont: pick(["Script", "Modern"]) });
    d.msgTier = 1; update("surprise"); toast("🎲 Surprise! Here's a fresh idea.");
  };

  // --- download / share ---
  $("download").onclick = async () => {
    const url = window.Cake3D && window.Cake3D.ready ? window.Cake3D.snapshot() : await svgToPng();
    if (!url) return toast("Couldn't create the image. Please try again.");
    const a = document.createElement("a"); a.href = url; a.download = "heavoras-cake-design.png"; a.click(); toast("Design image downloaded.");
  };
  $("share").onclick = async () => {
    const text = cakeMessage(d) + "\n\nDesign yours: " + location.href.split("#")[0] + "#designer";
    try { if (navigator.share) { await navigator.share({ title: "My Heavora's Cravings cake", text }); return; } await navigator.clipboard.writeText(text); toast("Design summary copied to clipboard."); }
    catch (err) { if (err && err.name !== "AbortError") toast("Couldn't share. Try the WhatsApp button instead."); }
  };
  function svgToPng() {
    return new Promise(res => {
      const svg = $("cake-svg"), img = new Image(), c = document.createElement("canvas"); c.width = c.height = 960;
      img.onerror = () => res(null);
      img.onload = () => { const x = c.getContext("2d"); x.fillStyle = "#1e110b"; x.fillRect(0, 0, 960, 960); x.drawImage(img, 0, 0, 960, 960); res(c.toDataURL("image/png")); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent((x => x.includes("xmlns=") ? x : x.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"'))(new XMLSerializer().serializeToString(svg)).replace(/ hidden=""/, ""));
    });
  }

  // --- 2D fallback preview (fixed: numeric sizes, no NaN) ---
  const svg = $("cake-svg");
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(v * k))); return "#" + [n >> 16, n >> 8 & 255, n & 255].map(v => f(v).toString(16).padStart(2, "0")).join(""); };
  function draw2D() {
    const c = FROSTING_COLOURS[d.colour] || "#f6ead6", naked = d.frosting === "Naked", sizes = tierSizes(d);
    const W = sizes.map(s => 230 * (0.4 + 0.6 * s / 12)), H = sizes.map((_, i) => [70, 58, 48][i] * (d.tiers === 3 ? .9 : 1));
    let y = 280, out = `<ellipse cx="160" cy="288" rx="${W[0] / 2 + 34}" ry="14" fill="#00000033"/><ellipse cx="160" cy="282" rx="${W[0] / 2 + 26}" ry="11" fill="#e9dcc5"/><ellipse cx="160" cy="279" rx="${W[0] / 2 + 26}" ry="10" fill="#fbf5ec"/>`;
    const tops = [];
    for (let i = 0; i < d.tiers; i++) {
      const w = W[i], h = H[i], x = 160 - w / 2, top = y - h, body = naked ? "#c99a63" : c;
      out += `<g class="tier"><rect x="${x}" y="${top}" width="${w}" height="${h}" rx="10" fill="${body}"/><rect x="${x}" y="${top}" width="${w * .18}" height="${h}" rx="8" fill="#fff" opacity=".18"/>`;
      if (naked) for (let k = 1; k < 3; k++) out += `<rect x="${x + 3}" y="${top + h * k / 3 - 3}" width="${w - 6}" height="6" rx="3" fill="#f6ead6"/>`;
      out += `<rect x="${x}" y="${y - 7}" width="${w}" height="7" rx="3" fill="${shade(body, .82)}"/><ellipse cx="160" cy="${top}" rx="${w / 2}" ry="9" fill="${shade(body, 1.06)}"/>`;
      if (d.toppings.includes("Chocolate Drip")) { let p = `M${x},${top}`; const n = Math.round(w / 18); for (let k = 0; k < n; k++) { const sx = x + k * w / n, ex = sx + w / n, dl = 10 + ((k * 37 + i * 13) % 5) * 5; p += ` L${sx},${top + 6} Q${sx + w / n / 2},${top + 6 + dl * 2} ${ex},${top + 6}`; } out += `<path d="${p} L${x + w},${top} Z" fill="#3a1f12"/><ellipse cx="160" cy="${top}" rx="${w / 2}" ry="9" fill="#4a2a18"/>`; }
      if (d.toppings.includes("Sprinkles")) for (let k = 0; k < Math.round(w / 9); k++) { const sx = x + 8 + (k * 53 % (w - 16)), sy = top + 16 + (k * 29 % Math.max(10, h - 26)); out += `<rect x="${sx}" y="${sy}" width="6" height="2.4" rx="1.2" fill="${["#c8283c", "#d4a24c", "#fff", "#7fb7e6", "#f2c4c8"][k % 5]}" transform="rotate(${(k * 47) % 180} ${sx + 3} ${sy + 1})"/>`; }
      if (d.toppings.includes("Gold Flakes")) for (let k = 0; k < 7; k++) { const sx = x + 10 + (k * 41 % (w - 20)), sy = top + 12 + (k * 17 % Math.max(8, h - 22)); out += `<path d="M${sx},${sy} l5,-2 l2,4 l-4,3 z" fill="#e8c06a"/>`; }
      if (d.toppings.includes("Flowers") && i === 0) [.12, .88].forEach(f => { const fx = x + w * f, fy = top + h * .45; out += [0, 72, 144, 216, 288].map(a => `<ellipse cx="${fx}" cy="${fy - 7}" rx="5" ry="8" fill="#f7d9dc" transform="rotate(${a} ${fx} ${fy})"/>`).join("") + `<circle cx="${fx}" cy="${fy}" r="4" fill="#d4a24c"/>`; });
      out += `</g>`; tops.push({ top, w, h }); y = top;
    }
    const t = tops[tops.length - 1], ty = t.top - 4;
    if (d.message) {
      const font = d.msgFont === "Script" ? "Great Vibes, cursive" : "Inter, sans-serif", col = TEXT_COLOURS[d.msgColour];
      if (d.msgPlace === "Top") { out += `<text x="160" y="${t.top + 3}" text-anchor="middle" font-family="${font}" font-weight="600" font-size="${Math.max(7, Math.min(13, t.w / (d.message.length * .55)))}" fill="${col}">${esc(d.message)}</text>`; }
      else { const ti = tops[Math.min(d.msgTier, d.tiers) - 1]; out += `<text x="160" y="${ti.top + ti.h / 2 + 10}" text-anchor="middle" font-family="${font}" font-weight="600" font-size="${Math.max(8, Math.min(d.msgFont === "Script" ? 20 : 14, (ti.w - 24) / (d.message.length * .55)))}" fill="${col}">${esc(d.message)}</text>`; }
    }
    if (d.toppings.includes("Strawberries")) [-.28, 0, .28].forEach(f => { const sx = 160 + f * t.w; out += `<path d="M${sx - 9},${ty - 12} Q${sx},${ty - 18} ${sx + 9},${ty - 12} Q${sx + 7},${ty + 2} ${sx},${ty + 4} Q${sx - 7},${ty + 2} ${sx - 9},${ty - 12}Z" fill="#c8283c"/><path d="M${sx - 6},${ty - 14} l6,-6 l6,6 z" fill="#3e7a3a"/>`; });
    if (d.toppings.includes("Macarons")) [-.4, .4].forEach(f => { const sx = 160 + f * t.w * .9; out += `<ellipse cx="${sx}" cy="${ty - 4}" rx="11" ry="5" fill="#cdbbe6"/><rect x="${sx - 10}" y="${ty - 9}" width="20" height="3" fill="#fbf5ec"/><ellipse cx="${sx}" cy="${ty - 11}" rx="11" ry="5" fill="#cdbbe6"/>`; });
    if (d.toppings.includes("Candles")) [-.14, 0, .14].forEach((f, k) => { const sx = 160 + f * t.w; out += `<rect x="${sx - 2.5}" y="${ty - 34}" width="5" height="26" rx="2" fill="${["#f2c4c8", "#d4a24c", "#bcd8ef"][k]}"/><path class="flame" d="M${sx},${ty - 46} Q${sx + 5},${ty - 39} ${sx},${ty - 35} Q${sx - 5},${ty - 39} ${sx},${ty - 46}Z" fill="#ffb238"/>`; });
    svg.innerHTML = out;
  }
  let mode = "loading";
  function use2D(reason) { if (mode === "3d") return; mode = "2d"; $("cake-canvas").hidden = true; svg.hidden = false; $("stage-loading").hidden = true; $("mode-badge").textContent = "2D preview"; draw2D(); if (reason) console.info("Cake preview using 2D fallback:", reason); }
  window.addEventListener("cake:3d-ready", () => { if (mode === "2d") return; mode = "3d"; $("stage-loading").hidden = true; svg.hidden = true; });
  window.addEventListener("cake:3d-failed", e => use2D(e.detail));
  setTimeout(() => mode === "loading" && use2D("3D took too long to load"), 9000);
  if (/[?&]no3d\b/.test(location.search)) setTimeout(() => use2D("forced"), 0);

  // --- update everything ---
  function update(changed = "init") {
    form.querySelectorAll(".pills").forEach(box => { const n = box.dataset.name; box.querySelectorAll(".pill").forEach(p => { const v = OPTS[n][+p.dataset.i][0]; const on = n === "toppings" ? d.toppings.includes(v) : d[n] === v; p.classList.toggle("on", on); p.setAttribute("aria-pressed", on); }); });
    sw.querySelectorAll(".sw").forEach((b, i) => { const on = Object.keys(FROSTING_COLOURS)[i] === d.colour; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    $("msg-colours").querySelectorAll(".sw").forEach((b, i) => { const on = Object.keys(TEXT_COLOURS)[i] === d.msgColour; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    $("colour-name").textContent = d.colour; $("msgcol-name").textContent = d.msgColour;
    ["flavour", "filling", "occasion"].forEach(n => form[n].value = d[n]);
    if (changed !== "message") form.message.value = d.message; if (changed !== "date") form.date.value = d.date || ""; if (changed !== "guests") form.guests.value = d.guests || "";
    // tier choice for side message
    OPTS.msgTier = Array.from({ length: d.tiers }, (_, i) => [i + 1, d.tiers === 1 ? "Only tier" : ["Bottom", "Middle", "Top"][d.tiers === 2 && i === 1 ? 2 : i]]);
    renderPills("msgTier"); pillBox("msgTier").querySelectorAll(".pill").forEach(p => { const on = OPTS.msgTier[+p.dataset.i][0] === d.msgTier; p.classList.toggle("on", on); p.setAttribute("aria-pressed", on); });
    $("msg-tier-wrap").hidden = d.msgPlace !== "Side" || d.tiers === 1;
    $("msg-opts").classList.toggle("dim", !d.message);
    $("msg-count").textContent = `${d.message.length}/30`;
    $("serves").textContent = `Serves ~${cakeServings(d)}`;
    // guests suggestion
    const g = parseInt(d.guests, 10), gh = $("guest-hint");
    if (g > 0) { const s = suggestForGuests(g), fits = cakeServings(d) >= g; gh.innerHTML = fits ? `✅ Your ${d.size}″ ${d.tiers}-tier cake serves ~${cakeServings(d)}, enough for ${g} guests.` : `💡 For ${g} guests we suggest a <b>${s.size}″ ${s.tiers}-tier</b> cake (serves ~${s.sv}). <button type="button" class="link" id="apply-guest">Apply</button>`; const ab = $("apply-guest"); if (ab) ab.onclick = () => { d.size = s.size; d.tiers = s.tiers; update("guests-apply"); }; }
    else gh.textContent = `Tip: enter your guest count and we'll recommend the perfect size.`;
    // pairing suggestion
    const p = PAIRINGS[d.flavour], ph = $("pair-hint");
    if (p && (p.filling !== d.filling || p.frosting !== d.frosting)) { ph.innerHTML = `💡 ${esc(d.flavour)} pairs beautifully with <b>${esc(p.filling)}</b> filling and <b>${esc(p.frosting)}</b> frosting. <button type="button" class="link" id="apply-pair">Use pairing</button>`; $("apply-pair").onclick = () => { d.filling = p.filling; d.frosting = p.frosting; update("pairing"); toast("Perfect pairing applied!"); }; }
    else ph.textContent = p ? `👌 Great choice: that's our recommended pairing.` : "";
    // date
    const h = hoursUntil(d.date), dh = $("date-hint");
    dh.className = "hint" + (d.date && h < 48 ? " warn" : "");
    dh.textContent = !d.date ? "We recommend ordering at least 3 days ahead (1 week for tiered or wedding cakes)." : h < 0 ? "⚠️ That date has passed. Please choose a future date." : h < 48 ? `⚠️ Less than 48 hours' notice. We'll try our best, and a rush fee applies. Please confirm on WhatsApp first.` : (d.tiers > 1 && h < 24 * 5) ? "ℹ️ Tiered cakes are best ordered 5+ days ahead. Message us to confirm the slot." : "✅ Plenty of time. Lovely!";
    // price & breakdown
    const rows = cakeBreakdown(d), total = cakeEstimate(d), price = $("cake-price");
    if (price.textContent !== naira(total)) { price.textContent = naira(total); price.classList.remove("bump"); void price.offsetWidth; price.classList.add("bump"); }
    $("breakdown").innerHTML = rows.map(([l, v]) => `<li><span>${esc(l)}</span><b>${v < 0 ? "−" : ""}${naira(Math.abs(v))}</b></li>`).join("") + `<li class="tot"><span>Estimated total</span><b>${naira(total)}</b></li>`;
    $("summary").innerHTML = `<h4>Your cake</h4><p>${esc(cakeMessage(d).split("\n").slice(2, 11).join("\n"))}</p>`;
    $("cake-order").href = waUrl(cakeMessage(d));
    if (mode !== "3d") draw2D();
    window.dispatchEvent(new CustomEvent("cake:change", { detail: { design: structuredClone(d), changed } }));
  }
  window.cakeUpdate = update;
  go(0); update();
})();
