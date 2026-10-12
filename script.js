// WhatsApp number (international format, digits only, no +)
const WHATSAPP_NUMBER = "2349068563859";

// 🎂 DESIGN-YOUR-CAKE PRICING (PLACEHOLDER values in ₦, edit freely).
// Shown to customers as an ESTIMATE; final price is confirmed on WhatsApp.
const PRICING = {
  size: { '6"': 12000, '8"': 18000, '10"': 26000, '12"': 35000 }, // base price for one tier
  extraTierFactor: 0.75,           // each extra tier adds this × base size price
  flavour: { "Chocolate": 0, "Vanilla": 0, "Red Velvet": 2000, "Strawberry": 1500, "Lemon": 1500, "Coconut": 1500, "Marble": 1000 },
  filling: { "None": 0, "Buttercream": 1000, "Chocolate Ganache": 2500, "Strawberry Jam": 1500, "Cream Cheese": 2000, "Caramel": 2000 },
  frosting: { "Buttercream": 0, "Whipped Cream": 0, "Fondant": 5000, "Ganache": 3000, "Naked": -1000 },
  toppings: { "Strawberries": 2500, "Gold Flakes": 4000, "Sprinkles": 800, "Chocolate Drip": 2000, "Macarons": 4500, "Flowers": 3500, "Candles": 500 },
  message: 0,
};
const FROSTING_COLOURS = { "Cream": "#f6ead6", "Chocolate": "#5a341f", "Blush Pink": "#f2c4c8", "Gold": "#d9ad5b", "White": "#ffffff", "Lavender": "#cdbbe6", "Sky Blue": "#bcd8ef", "Mint": "#bfe3cf", "Red": "#b8283a" };
const OCCASIONS = ["Birthday", "Wedding", "Anniversary", "Baby Shower", "Graduation", "Bridal Shower", "Just Because", "Other"];
const TOPPING_PRICE = n => PRICING.toppings[n] || 0;

function cakeEstimate(d) {
  const base = PRICING.size[d.size] || 0;
  let t = base * (1 + (d.tiers - 1) * PRICING.extraTierFactor);
  t += (PRICING.flavour[d.flavour] || 0) + (PRICING.filling[d.filling] || 0);
  t += (PRICING.frosting[d.frosting] || 0) * d.tiers;
  t += d.toppings.reduce((a, n) => a + TOPPING_PRICE(n), 0);
  if (d.message) t += PRICING.message;
  return Math.round(t / 500) * 500;
}
function cakeMessage(d) {
  return [
    "Hello Heavora's Cravings! 🎂 I'd like to order a custom cake:",
    "",
    `Size: ${d.size}`, `Tiers: ${d.tiers}`, `Flavour: ${d.flavour}`, `Filling: ${d.filling}`,
    `Frosting: ${d.frosting} (${d.colour})`,
    `Toppings: ${d.toppings.length ? d.toppings.join(", ") : "None"}`,
    `Message on cake: ${d.message ? '"' + d.message + '"' : "None"}`,
    `Occasion: ${d.occasion}`, `Needed by: ${d.date || "Not set"}`,
    "", `Estimated price: ${"₦" + cakeEstimate(d).toLocaleString("en-NG")} (estimate, please confirm final price)`,
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
if (typeof module !== "undefined") module.exports = { MENU, itemLink, PRICING, cakeEstimate, cakeMessage, waUrl };

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const io = ("IntersectionObserver" in window && !reduce) ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -40px 0px" }) : null;
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

// ===== Design Your Cake =====
(() => {
  const form = document.getElementById("cake-form"); if (!form) return;
  const d = { size: '8"', tiers: 1, flavour: "Chocolate", filling: "Chocolate Ganache", frosting: "Buttercream", colour: "Cream", toppings: ["Chocolate Drip", "Strawberries"], message: "", occasion: "Birthday", date: "" };
  const pills = (name, opts, multi) => {
    const box = form.querySelector(`[data-name="${name}"]`);
    box.innerHTML = opts.map(o => `<button type="button" class="pill" data-v="${o}" aria-pressed="false">${o}</button>`).join("");
    box.addEventListener("click", e => {
      const b = e.target.closest(".pill"); if (!b) return;
      let v = b.dataset.v; if (name === "tiers") v = +v;
      if (multi) d[name] = d[name].includes(v) ? d[name].filter(x => x !== v) : [...d[name], v]; else d[name] = v;
      update();
    });
  };
  pills("size", Object.keys(PRICING.size)); pills("tiers", [1, 2, 3]); pills("frosting", Object.keys(PRICING.frosting)); pills("toppings", Object.keys(PRICING.toppings), true);
  const fill = (n, opts) => { form[n].innerHTML = opts.map(o => `<option>${o}</option>`).join(""); form[n].value = d[n]; };
  fill("flavour", Object.keys(PRICING.flavour)); fill("filling", Object.keys(PRICING.filling)); fill("occasion", OCCASIONS);
  const sw = form.querySelector(".swatches");
  sw.innerHTML = Object.entries(FROSTING_COLOURS).map(([n, c]) => `<button type="button" class="sw" role="radio" title="${n}" aria-label="${n}" data-v="${n}" style="--c:${c}"></button>`).join("");
  sw.addEventListener("click", e => { const b = e.target.closest(".sw"); if (b) { d.colour = b.dataset.v; update(); } });
  form.addEventListener("input", e => { const n = e.target.name; if (n) { d[n] = e.target.value; update(n !== "message" && n !== "date"); } });

  const svg = document.getElementById("cake-svg"), esc = t => t.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.max(0, Math.min(255, Math.round(v * k))); return "#" + [n >> 16, n >> 8 & 255, n & 255].map(v => f(v).toString(16).padStart(2, "0")).join(""); };
  let last = "";
  function draw(animate) {
    const c = FROSTING_COLOURS[d.colour], naked = d.frosting === "Naked";
    const scale = { '6"': .72, '8"': .84, '10"': .94, '12"': 1 }[d.size];
    const W = [210, 160, 115].map(w => w * scale), H = [70, 58, 48].map(h => h * (d.tiers === 3 ? .9 : 1));
    let y = 280, out = `<ellipse cx="160" cy="288" rx="${W[0] / 2 + 34}" ry="14" fill="#00000033"/><ellipse cx="160" cy="282" rx="${W[0] / 2 + 26}" ry="11" fill="#e9dcc5"/><ellipse cx="160" cy="279" rx="${W[0] / 2 + 26}" ry="10" fill="#fbf5ec"/>`;
    const tops = [];
    for (let i = 0; i < d.tiers; i++) {
      const w = W[i], h = H[i], x = 160 - w / 2, top = y - h;
      const body = naked ? "#c99a63" : c;
      out += `<g class="tier" style="--i:${i}">`;
      out += `<rect x="${x}" y="${top}" width="${w}" height="${h}" rx="10" fill="${body}"/>`;
      out += `<rect x="${x}" y="${top}" width="${w * .18}" height="${h}" rx="8" fill="#ffffff" opacity=".18"/>`;
      if (naked) for (let k = 1; k < 3; k++) out += `<rect x="${x + 3}" y="${top + h * k / 3 - 3}" width="${w - 6}" height="6" rx="3" fill="#f6ead6"/>`;
      out += `<rect x="${x}" y="${y - 7}" width="${w}" height="7" rx="3" fill="${shade(body, .82)}"/>`;
      out += `<ellipse cx="160" cy="${top}" rx="${w / 2}" ry="9" fill="${shade(body, 1.06)}"/>`;
      if (d.toppings.includes("Chocolate Drip")) {
        let p = `M${x},${top}`; const n = Math.round(w / 18);
        for (let k = 0; k < n; k++) { const sx = x + k * w / n, ex = sx + w / n, dl = 10 + ((k * 37 + i * 13) % 5) * 6; p += ` L${sx},${top + 6} Q${sx + w / n / 2},${top + 6 + dl * 2} ${ex},${top + 6}`; }
        out += `<path class="drip-p" d="${p} L${x + w},${top} Z" fill="#3a1f12"/><ellipse cx="160" cy="${top}" rx="${w / 2}" ry="9" fill="#4a2a18"/>`;
      }
      if (d.toppings.includes("Sprinkles")) for (let k = 0; k < Math.round(w / 9); k++) { const sx = x + 8 + (k * 53 % (w - 16)), sy = top + 16 + (k * 29 % Math.max(10, h - 26)); out += `<rect x="${sx}" y="${sy}" width="6" height="2.4" rx="1.2" fill="${["#c8283c", "#d4a24c", "#ffffff", "#7fb7e6", "#f2c4c8"][k % 5]}" transform="rotate(${(k * 47) % 180} ${sx + 3} ${sy + 1})"/>`; }
      if (d.toppings.includes("Gold Flakes")) for (let k = 0; k < 7; k++) { const sx = x + 10 + (k * 41 % (w - 20)), sy = top + 12 + (k * 17 % Math.max(8, h - 22)); out += `<path d="M${sx},${sy} l5,-2 l2,4 l-4,3 z" fill="#e8c06a"/>`; }
      if (d.toppings.includes("Flowers") && i === 0) [.12, .88].forEach(f => { const fx = x + w * f, fy = top + h * .45; out += `<g class="pop">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${fx}" cy="${fy - 7}" rx="5" ry="8" fill="#f7d9dc" transform="rotate(${a} ${fx} ${fy})"/>`).join("")}<circle cx="${fx}" cy="${fy}" r="4" fill="#d4a24c"/></g>`; });
      out += `</g>`;
      tops.push({ top, w }); y = top;
    }
    const t = tops[tops.length - 1];
    if (d.message) { const fs = Math.min(15, (W[0] - 30) / (d.message.length * .55)); out += `<text class="msg" x="160" y="${280 - H[0] / 2 + 14}" text-anchor="middle" font-family="Great Vibes, cursive" font-size="${Math.max(9, fs * 1.4)}" fill="${d.colour === "Chocolate" || d.colour === "Red" ? "#f6ead6" : "#5a2a1a"}">${esc(d.message)}</text>`; }
    let ty = t.top - 4;
    if (d.toppings.includes("Strawberries")) [-.28, 0, .28].forEach((f, k) => { const sx = 160 + f * t.w; out += `<g class="pop" style="--k:${k}"><path d="M${sx - 9},${ty - 12} Q${sx},${ty - 18} ${sx + 9},${ty - 12} Q${sx + 7},${ty + 2} ${sx},${ty + 4} Q${sx - 7},${ty + 2} ${sx - 9},${ty - 12}Z" fill="#c8283c"/><path d="M${sx - 6},${ty - 14} l6,-6 l6,6 z" fill="#3e7a3a"/></g>`; });
    if (d.toppings.includes("Macarons")) [-.4, .4].forEach((f, k) => { const sx = 160 + f * t.w * .9; out += `<g class="pop" style="--k:${k + 3}"><ellipse cx="${sx}" cy="${ty - 4}" rx="11" ry="5" fill="#cdbbe6"/><rect x="${sx - 10}" y="${ty - 9}" width="20" height="3" fill="#fbf5ec"/><ellipse cx="${sx}" cy="${ty - 11}" rx="11" ry="5" fill="#cdbbe6"/></g>`; });
    if (d.toppings.includes("Candles")) [-.14, 0, .14].forEach((f, k) => { const sx = 160 + f * t.w; out += `<g><rect x="${sx - 2.5}" y="${ty - 34}" width="5" height="26" rx="2" fill="${["#f2c4c8", "#d4a24c", "#bcd8ef"][k]}"/><path class="flame" d="M${sx},${ty - 46} Q${sx + 5},${ty - 39} ${sx},${ty - 35} Q${sx - 5},${ty - 39} ${sx},${ty - 46}Z" fill="#ffb238"/></g>`; });
    const key = d.tiers + d.size;
    svg.innerHTML = out;
    if (animate && key !== last && io) svg.classList.remove("build"), void svg.offsetWidth, svg.classList.add("build");
    last = key;
  }
  function update(animate = true) {
    form.querySelectorAll(".pills").forEach(b => b.querySelectorAll(".pill").forEach(p => { const v = b.dataset.name === "tiers" ? +p.dataset.v : p.dataset.v; const on = b.classList.contains("multi") ? d[b.dataset.name].includes(v) : d[b.dataset.name] === v; p.classList.toggle("on", on); p.setAttribute("aria-pressed", on); }));
    sw.querySelectorAll(".sw").forEach(b => { const on = b.dataset.v === d.colour; b.classList.toggle("on", on); b.setAttribute("aria-checked", on); });
    document.getElementById("msg-count").textContent = `${d.message.length}/30`;
    draw(animate);
    const price = document.getElementById("cake-price"); price.textContent = naira(cakeEstimate(d));
    price.classList.remove("bump"); void price.offsetWidth; price.classList.add("bump");
    document.getElementById("cake-order").href = waUrl(cakeMessage(d));
  }
  update();
})();
