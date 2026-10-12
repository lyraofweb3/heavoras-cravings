// WhatsApp number (international format, digits only, no +)
const WHATSAPP_NUMBER = "2349068563859";

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
if (typeof module !== "undefined") module.exports = { MENU, itemLink };

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
