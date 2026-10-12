// WhatsApp number (international format, digits only, no +)
const WHATSAPP_NUMBER = "2349068563859";

// ✏️ EDIT YOUR MENU HERE. Prices are PLACEHOLDERS in Naira (₦).
const MENU = [
  { name: "Chocolate Fudge Cake", category: "Cakes", price: 15000, emoji: "🎂", desc: "Rich, moist chocolate layers with fudge frosting." },
  { name: "Red Velvet Cake", category: "Cakes", price: 18000, emoji: "🍰", desc: "Velvety crumb with cream cheese frosting." },
  { name: "Vanilla Celebration Cake", category: "Cakes", price: 14000, emoji: "🎉", desc: "Classic vanilla sponge, custom decorated." },
  { name: "Meat Pie", category: "Snacks", price: 800, emoji: "🥧", desc: "Buttery pastry filled with seasoned minced meat." },
  { name: "Puff-Puff (pack of 10)", category: "Snacks", price: 1000, emoji: "🟤", desc: "Soft, fluffy, golden Nigerian doughballs." },
  { name: "Chin Chin (500g)", category: "Snacks", price: 2500, emoji: "🍪", desc: "Crunchy, lightly sweet fried bites." },
  { name: "Sausage Roll", category: "Snacks", price: 700, emoji: "🌭", desc: "Flaky pastry wrapped around spiced sausage." },
  { name: "Cupcakes (box of 6)", category: "Sweet Treats", price: 6000, emoji: "🧁", desc: "Assorted flavours with swirled frosting." },
  { name: "Glazed Doughnuts (box of 6)", category: "Sweet Treats", price: 4500, emoji: "🍩", desc: "Soft doughnuts with sugar or chocolate glaze." },
  { name: "Cake Parfait", category: "Sweet Treats", price: 3500, emoji: "🥤", desc: "Layers of cake, cream and toppings in a cup." },
];

const naira = n => "₦" + n.toLocaleString("en-NG");
const waUrl = msg => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const itemLink = i => waUrl(`Hello Heavora's Cravings! I'd like to order: ${i.name} (${i.category}) - ${naira(i.price)}. Quantity: 1. Please confirm availability.`);
if (typeof module !== "undefined") module.exports = { MENU, itemLink };

const grid = document.getElementById("menu-grid");
function render(cat = "all") {
  grid.innerHTML = MENU.filter(i => cat === "all" || i.category === cat).map(i => `
    <div class="card"><div class="e">${i.emoji}</div><h3>${i.name}</h3><p>${i.desc}</p>
    <div class="row"><span class="price">${naira(i.price)}</span>
    <a class="order-btn" href="${itemLink(i)}" target="_blank" rel="noopener">Order</a></div></div>`).join("");
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
const revealEls = document.querySelectorAll("h2, .lead, .feats div, .gallery .g, .form");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .15 });
  revealEls.forEach(el => { el.classList.add("reveal"); io.observe(el); });
}
