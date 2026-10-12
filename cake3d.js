// Real-time 3D cake preview (Three.js r160 via import map). Falls back to the 2D SVG preview if WebGL is unavailable.
const fail = reason => window.dispatchEvent(new CustomEvent("cake:3d-failed", { detail: reason }));
let THREE, OrbitControls, RoomEnvironment;
try {
  const c = document.createElement("canvas");
  if (/[?&]no3d\b/.test(location.search)) throw new Error("forced 2D");
  if (!(c.getContext("webgl2") || c.getContext("webgl"))) throw new Error("WebGL unavailable");
  THREE = await import("three");
  ({ OrbitControls } = await import("three/addons/controls/OrbitControls.js"));
  ({ RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js"));
  init();
} catch (e) { fail(e.message || String(e)); }

function init() {
  const canvas = document.getElementById("cake-canvas"), stage = document.getElementById("cake-stage");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = .55;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100); camera.position.set(0, 3.1, 7.2);
  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, { enableDamping: true, dampingFactor: .08, enablePan: false, minDistance: 4.5, maxDistance: 11, minPolarAngle: .35, maxPolarAngle: 1.45, autoRotate: !reduce, autoRotateSpeed: 1.4 });
  controls.target.set(0, 1.05, 0);
  let idle; controls.addEventListener("start", () => { controls.autoRotate = false; clearTimeout(idle); stage.classList.add("grabbing"); });
  controls.addEventListener("end", () => { stage.classList.remove("grabbing"); if (!reduce) idle = setTimeout(() => controls.autoRotate = true, 3500); });

  // lights
  scene.add(new THREE.HemisphereLight(0xfff3e0, 0x2a160d, .55));
  const key = new THREE.DirectionalLight(0xffeedd, 2.3); key.position.set(3.5, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 15 }); key.shadow.bias = -0.0005; key.shadow.radius = 4; scene.add(key);
  const rim = new THREE.DirectionalLight(0xffc98a, 1.1); rim.position.set(-4, 3, -4); scene.add(rim);
  const fillL = new THREE.PointLight(0xffe2c0, 6, 12); fillL.position.set(-3, 1.5, 3); scene.add(fillL);
  // plate + ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: .35 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.75, .09, 96), new THREE.MeshPhysicalMaterial({ color: 0xfbf7f0, roughness: .25, clearcoat: .6 })); plate.position.y = .045; plate.castShadow = plate.receiveShadow = true; scene.add(plate);
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(1.95, .025, 12, 120), new THREE.MeshStandardMaterial({ color: 0xd4a24c, metalness: 1, roughness: .25 })); rimRing.rotation.x = Math.PI / 2; rimRing.position.y = .09; scene.add(rimRing);

  let cake = null, old = null, last = null, anim = [], glowLights = [];
  const SPONGE = { "Chocolate": 0x5b3420, "Vanilla": 0xf0d9a8, "Red Velvet": 0x9b1f2c, "Strawberry": 0xf2b7bf, "Lemon": 0xf3e08a, "Coconut": 0xf7f1e3, "Marble": 0xb98e66 };
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647);
  const ease = t => 1 - Math.pow(1 - t, 3), back = t => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

  function frostMat(d) {
    const col = new THREE.Color(FROSTING_COLOURS[d.colour] || "#f6ead6");
    switch (d.frosting) {
      case "Ganache": return new THREE.MeshPhysicalMaterial({ color: col, roughness: .18, clearcoat: 1, clearcoatRoughness: .08, sheen: 0 });
      case "Fondant": return new THREE.MeshPhysicalMaterial({ color: col, roughness: .42, clearcoat: .25, clearcoatRoughness: .4 });
      case "Whipped Cream": return new THREE.MeshStandardMaterial({ color: col, roughness: .95, bumpMap: noiseTex(), bumpScale: 1.2 });
      case "Naked": return new THREE.MeshStandardMaterial({ map: nakedTex(d), roughness: .92, bumpMap: noiseTex(), bumpScale: 1.5 });
      default: return new THREE.MeshStandardMaterial({ color: col, roughness: .78, bumpMap: noiseTex(), bumpScale: .6 }); // buttercream: matte
    }
  }
  let _noise; function noiseTex() { if (_noise) return _noise; const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d"), r = rnd(7); for (let i = 0; i < 4000; i++) { x.fillStyle = `rgba(255,255,255,${r() * .5})`; x.beginPath(); x.arc(r() * 256, r() * 256, r() * 3, 0, 7); x.fill(); } _noise = new THREE.CanvasTexture(c); _noise.wrapS = _noise.wrapT = THREE.RepeatWrapping; _noise.repeat.set(3, 1); return _noise; }
  function nakedTex(d) {
    const c = document.createElement("canvas"); c.width = 512; c.height = 256; const x = c.getContext("2d"), sp = "#" + new THREE.Color(SPONGE[d.flavour] || 0xd9b07a).getHexString(), cream = FROSTING_COLOURS[d.colour] || "#f6ead6", r = rnd(3);
    x.fillStyle = sp; x.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 1800; i++) { x.fillStyle = `rgba(0,0,0,${r() * .15})`; x.fillRect(r() * 512, r() * 256, 2, 2); }
    [0, 1, 2, 3].forEach(k => { const y = k * 256 / 3; x.fillStyle = cream; x.beginPath(); x.moveTo(0, y - 14); for (let px = 0; px <= 512; px += 16) x.lineTo(px, y - 14 + Math.sin(px * .05 + k) * 5); for (let px = 512; px >= 0; px -= 16) x.lineTo(px, y + 14 + Math.cos(px * .06 + k) * 6); x.fill(); });
    x.fillStyle = "rgba(255,255,255,.35)"; for (let i = 0; i < 70; i++) x.fillRect(r() * 512, r() * 256, 18 + r() * 40, 3); // scraped frosting smears
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.x = 2; return t;
  }
  function textTex(d, w, h, curved) {
    const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
    const font = d.msgFont === "Script" ? "'Great Vibes'" : "'Inter', sans-serif", weight = d.msgFont === "Script" ? 400 : 700;
    let fs = h * (d.msgFont === "Script" ? .62 : .42); x.font = `${weight} ${fs}px ${font}`;
    const maxW = w * (curved ? .92 : .86); while (x.measureText(d.message).width > maxW && fs > 10) { fs -= 2; x.font = `${weight} ${fs}px ${font}`; }
    x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = TEXT_COLOURS[d.msgColour] || "#3a1f12";
    x.shadowColor = "rgba(0,0,0,.25)"; x.shadowBlur = 2; x.shadowOffsetY = 1; x.fillText(d.message, w / 2, h / 2 + fs * .05);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }

  function build(d, prev) {
    const g = new THREE.Group(), sizes = tierSizes(d), R = sizes.map(s => .62 + (s / 12) * 1.08), H = [.78, .66, .56].map(v => v * (d.tiers === 3 ? .92 : 1));
    const structural = !prev || prev.size !== d.size || prev.tiers !== d.tiers, newTops = prev ? d.toppings.filter(t => !prev.toppings.includes(t)) : d.toppings;
    const msgChanged = !prev || ["message", "msgPlace", "msgTier", "msgFont", "msgColour"].some(k => prev[k] !== d[k]);
    const mat = frostMat(d), r = rnd(42); let y = .09; const tiers = [];
    for (let i = 0; i < d.tiers; i++) {
      const tg = new THREE.Group(), rr = R[i], h = H[i];
      const body = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, h, 96, 1), mat); body.position.y = h / 2; body.castShadow = body.receiveShadow = true; tg.add(body);
      if (d.frosting !== "Naked") { // piped border
        const bead = new THREE.Mesh(new THREE.TorusGeometry(rr, .045, 10, 96), mat); bead.rotation.x = Math.PI / 2; bead.position.y = .03; tg.add(bead);
        const bead2 = bead.clone(); bead2.position.y = h - .01; bead2.scale.setScalar(.995); tg.add(bead2);
      }
      const y0 = y; tg.position.y = y0; tg.userData = { y: y0, r: rr, h };
      if (structural && !reduce) { const lift = 2.2 + i * .5; tg.position.y = y0 + lift; anim.push({ t0: performance.now() + i * 140, dur: 750, f: k => { tg.position.y = y0 + (1 - back(k)) * lift; } }); }
      g.add(tg); tiers.push(tg); y += h;
    }
    const topT = tiers[tiers.length - 1], topY = y, topR = R[d.tiers - 1];
    const popIn = (obj, delay = 0, force) => { if (reduce || !(force || structural)) return; obj.scale.setScalar(.001); const s0 = obj.userData.s || 1; anim.push({ t0: performance.now() + 500 * (structural ? 1 : 0) + delay, dur: 520, f: k => obj.scale.setScalar(Math.max(.001, back(k) * s0)) }); };
    const has = t => d.toppings.includes(t), isNew = t => newTops.includes(t);

    if (has("Chocolate Drip")) {
      const choc = new THREE.MeshPhysicalMaterial({ color: 0x3a1d10, roughness: .12, clearcoat: 1, clearcoatRoughness: .05 });
      tiers.forEach((tg, i) => {
        const { r: rr, h } = tg.userData, dg = new THREE.Group(); dg.position.y = h;
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(rr + .012, rr + .012, .05, 96), choc); cap.position.y = -.015; dg.add(cap);
        const n = Math.round(rr * 22);
        for (let k = 0; k < n; k++) {
          const a = k / n * Math.PI * 2 + i, len = .1 + r() * h * .5, w = .035 + r() * .025;
          const drop = new THREE.Mesh(new THREE.CapsuleGeometry(w, len, 4, 10), choc); drop.geometry.translate(0, -len / 2, 0);
          const holder = new THREE.Group(); holder.position.set(Math.cos(a) * (rr + .005), 0, Math.sin(a) * (rr + .005)); holder.add(drop); dg.add(holder); drop.castShadow = true;
          if (!reduce && (structural || isNew("Chocolate Drip"))) { holder.scale.y = .001; anim.push({ t0: performance.now() + (structural ? 600 : 0) + i * 120 + r() * 400, dur: 900 + r() * 700, f: q => holder.scale.y = Math.max(.001, ease(q)) }); }
        }
        tg.add(dg);
      });
    }
    if (has("Sprinkles")) {
      const cols = [0xc8283c, 0xd4a24c, 0xffffff, 0x7fb7e6, 0xf2c4c8, 0x9fd8a8], geo = new THREE.CapsuleGeometry(.012, .045, 2, 6), mats = cols.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .5 }));
      const sg = new THREE.Group();
      tiers.forEach(tg => { const { r: rr, h, y: ty } = tg.userData; for (let k = 0; k < rr * 120; k++) { const m = new THREE.Mesh(geo, mats[k % mats.length]); const a = r() * Math.PI * 2; if (k % 3 === 0 && tg === topT) { const rad = Math.sqrt(r()) * rr * .92; m.position.set(Math.cos(a) * rad, ty + h + .015, Math.sin(a) * rad); m.rotation.set(Math.PI / 2, 0, r() * 6); } else { m.position.set(Math.cos(a) * (rr + .01), ty + .08 + r() * (h - .16), Math.sin(a) * (rr + .01)); m.rotation.set(r() * 3, r() * 3, r() * 3); } sg.add(m); } });
      g.add(sg); popIn(sg, 0, isNew("Sprinkles"));
    }
    if (has("Gold Flakes")) {
      const gold = new THREE.MeshStandardMaterial({ color: 0xffd27a, metalness: .75, roughness: .28, emissive: 0x7a5410, emissiveIntensity: .55, side: THREE.DoubleSide }), fg = new THREE.Group();
      tiers.forEach(tg => { const { r: rr, h, y: ty } = tg.userData; for (let k = 0; k < 26; k++) { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(.06 + r() * .05, .02); s.lineTo(.04, .07 + r() * .04); s.lineTo(-.02, .04); const m = new THREE.Mesh(new THREE.ShapeGeometry(s), gold); const a = r() * Math.PI * 2, top = r() < .3 && tg === topT; if (top) { const rad = r() * rr * .85; m.position.set(Math.cos(a) * rad, ty + h + .02, Math.sin(a) * rad); m.rotation.x = -Math.PI / 2; } else { m.position.set(Math.cos(a) * (rr + .012), ty + .1 + r() * (h - .2), Math.sin(a) * (rr + .012)); m.lookAt(m.position.x * 2, m.position.y, m.position.z * 2); m.rotateZ(r() * 6); } fg.add(m); } });
      g.add(fg); popIn(fg, 100, isNew("Gold Flakes"));
    }
    const topItems = []; // ring positions on the top tier
    if (has("Strawberries")) {
      const red = new THREE.MeshPhysicalMaterial({ color: 0xc8182c, roughness: .3, clearcoat: .8 }), leaf = new THREE.MeshStandardMaterial({ color: 0x3e7a3a, roughness: .6 }), seed = new THREE.MeshStandardMaterial({ color: 0xf5d76e });
      const n = Math.max(5, Math.round(topR * 6));
      for (let k = 0; k < n; k++) {
        const s = new THREE.Group(); const body = new THREE.Mesh(new THREE.SphereGeometry(.13, 20, 16), red); body.scale.set(1, 1.25, 1); body.position.y = .13; s.add(body);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(.115, .16, 20), red); tip.rotation.x = Math.PI; tip.position.y = .02; s.add(tip);
        for (let q = 0; q < 5; q++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.04, .14, 6), leaf); l.position.set(Math.cos(q * 1.26) * .06, .29, Math.sin(q * 1.26) * .06); l.rotation.set(Math.sin(q * 1.26) * 1.2, 0, -Math.cos(q * 1.26) * 1.2); s.add(l); }
        for (let q = 0; q < 10; q++) { const sd = new THREE.Mesh(new THREE.SphereGeometry(.01, 4, 4), seed); const a = r() * 6.28, yy = r() * .22; sd.position.set(Math.cos(a) * .13 * (1 - Math.abs(yy - .1)), .04 + yy, Math.sin(a) * .13); s.add(sd); }
        const a = k / n * Math.PI * 2; s.position.set(Math.cos(a) * topR * .78, topY + .03, Math.sin(a) * topR * .78); s.rotation.set(.35 * Math.cos(a), r(), -.35 * Math.sin(a)); s.traverse(o => o.castShadow = true); g.add(s); popIn(s, k * 60, isNew("Strawberries"));
      }
    }
    if (has("Macarons")) {
      const cols = [0xcdbbe6, 0xf2c4c8, 0xbfe3cf, 0xf3d9a0], n = Math.max(3, Math.round(topR * 3.4));
      for (let k = 0; k < n; k++) {
        const m = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: cols[k % cols.length], roughness: .55 }), cream = new THREE.MeshStandardMaterial({ color: 0xfbf5ec, roughness: .8 });
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(.16, 24, 12, 0, 6.29, 0, Math.PI / 2), mat); s1.scale.y = .45; s1.position.y = .11; m.add(s1);
        const s2 = s1.clone(); s2.rotation.x = Math.PI; s2.position.y = .07; m.add(s2);
        const f = new THREE.Mesh(new THREE.CylinderGeometry(.15, .15, .04, 24), cream); f.position.y = .09; m.add(f);
        const a = k / n * Math.PI * 2 + .4; m.position.set(Math.cos(a) * topR * .45, topY, Math.sin(a) * topR * .45); m.rotation.set(0, a, 1.1); m.position.y += .14; m.traverse(o => o.castShadow = true); g.add(m); popIn(m, 200 + k * 70, isNew("Macarons"));
      }
    }
    if (has("Flowers")) {
      const petal = new THREE.MeshStandardMaterial({ color: 0xf7d9dc, roughness: .6, side: THREE.DoubleSide }), mid = new THREE.MeshStandardMaterial({ color: 0xd4a24c, metalness: .4, roughness: .4 });
      const flower = sc => { const f = new THREE.Group(); for (let q = 0; q < 6; q++) { const p = new THREE.Mesh(new THREE.SphereGeometry(.1, 12, 8), petal); p.scale.set(1, .25, .55); p.position.set(Math.cos(q * 1.047) * .1, 0, Math.sin(q * 1.047) * .1); p.rotation.y = -q * 1.047; f.add(p); } const c = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 8), mid); c.position.y = .02; f.add(c); f.scale.setScalar(sc); f.userData.s = sc; f.traverse(o => o.castShadow = true); return f; };
      // cascade on the side + a cluster on top
      tiers.forEach((tg, i) => { const { r: rr, h, y: ty } = tg.userData; [[-.5, .35], [-.75, .7], [-.95, .5]].forEach(([a, yy], q) => { const f = flower(1.05 - q * .15); f.position.set(Math.cos(a + i * .3) * (rr + .04), ty + h * yy, Math.sin(a + i * .3) * (rr + .04)); f.lookAt(f.position.x * 3, f.position.y, f.position.z * 3); f.rotateX(Math.PI / 2); g.add(f); popIn(f, 300 + (i * 3 + q) * 80, isNew("Flowers")); }); });
      const f = flower(1.3); f.position.set(-topR * .35, topY + .05, topR * .2); g.add(f); popIn(f, 450, isNew("Flowers"));
    }
    glowLights = [];
    if (has("Candles")) {
      const cols = [0xf2c4c8, 0xd4a24c, 0xbcd8ef, 0xffffff];
      [-1, 0, 1].forEach((q, k) => {
        const c = new THREE.Group(); const wax = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .5, 16), new THREE.MeshStandardMaterial({ color: cols[k], roughness: .4 })); wax.position.y = .25; wax.castShadow = true; c.add(wax);
        const wick = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, .05, 6), new THREE.MeshBasicMaterial({ color: 0x222222 })); wick.position.y = .525; c.add(wick);
        const flame = new THREE.Mesh(new THREE.SphereGeometry(.045, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffc04a })); flame.scale.set(.8, 1.7, .8); flame.position.y = .6; c.add(flame);
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0xffa83a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(.5, .5, 1); halo.position.y = .6; c.add(halo);
        const pl = new THREE.PointLight(0xffa040, 1.2, 2.2, 2); pl.position.y = .65; c.add(pl); glowLights.push({ pl, flame, halo, ph: k * 2.1 });
        c.position.set(q * topR * .32, topY, (k === 1 ? -.1 : .12) * topR); g.add(c); popIn(c, 350 + k * 90, isNew("Candles"));
      });
    }
    if (d.message) {
      let m;
      if (d.msgPlace === "Top") {
        const w = topR * 1.55, tex = textTex(d, 1024, 340, false);
        m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * 340 / 1024), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: .5, polygonOffset: true, polygonOffsetFactor: -4 }));
        m.rotation.x = -Math.PI / 2; m.position.set(0, topY + .012, has("Strawberries") ? topR * .12 : 0);
      } else {
        const ti = tiers[Math.min(d.msgTier, d.tiers) - 1].userData, arc = Math.PI * .95, tex = textTex(d, 1400, 280, true), hh = Math.min(ti.h * .62, .4);
        m = new THREE.Mesh(new THREE.CylinderGeometry(ti.r + .006, ti.r + .006, hh, 64, 1, true, -arc / 2, arc), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: .5, polygonOffset: true, polygonOffsetFactor: -4 }));
        m.position.y = ti.y + ti.h * .5;
      }
      // turn the writing toward the camera's current side
      if (d.msgPlace !== "Top") m.rotation.y = 0;
      g.add(m); popIn(m, 200, msgChanged);
    }
    return g;
  }
  let glow; function glowTex() { if (glow) return glow; const c = document.createElement("canvas"); c.width = c.height = 64; const x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(.3, "rgba(255,200,120,.6)"); gr.addColorStop(1, "rgba(255,160,60,0)"); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); glow = new THREE.CanvasTexture(c); return glow; }

  function dispose(o) { o.traverse(n => { n.geometry && n.geometry.dispose(); if (n.material) [].concat(n.material).forEach(m => { m.map && m.map !== _noise && m.map !== glow && m.map.dispose(); m.dispose(); }); }); }
  function setDesign(d) {
    anim = anim.filter(a => false);
    if (cake) { old = cake; scene.remove(old); dispose(old); }
    cake = build(d, last); scene.add(cake); last = d;
    const topH = tierSizes(d).length, z = 6.4 + d.size * .08 + d.tiers * .45; camera.userData.targetZ = z; controls.target.y = .55 + d.tiers * .32;
    // face the message toward the viewer when the message changes
    if (d.message && d.msgPlace === "Side") cake.rotation.y = Math.atan2(camera.position.x, camera.position.z);
  }
  window.addEventListener("cake:change", e => setDesign(e.detail.design));
  if (window.cakeDesign) setDesign(structuredClone(window.cakeDesign));

  function resize() { const w = stage.clientWidth, h = stage.clientHeight; if (!w) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(stage); resize();
  let visible = true; new IntersectionObserver(es => visible = es[0].isIntersecting).observe(stage);
  function frame(t) {
    requestAnimationFrame(frame); if (!visible && !window.__forceRender) return;
    anim = anim.filter(a => { const k = Math.min(1, Math.max(0, (t - a.t0) / a.dur)); a.f(k); return k < 1; });
    const tz = camera.userData.targetZ; if (tz) { const dir = camera.position.clone().sub(controls.target); const len = dir.length(); dir.setLength(len + (tz - len) * .06); camera.position.copy(controls.target).add(dir); }
    if (!reduce) glowLights.forEach(gl => { const f = 1 + Math.sin(t * .012 + gl.ph) * .08 + Math.sin(t * .031 + gl.ph) * .05; gl.flame.scale.set(.8 * f, 1.7 / f, .8 * f); gl.pl.intensity = 1.1 * f; gl.halo.material.opacity = .75 * f; });
    controls.update(); renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
  window.Cake3D = { ready: true, _debug: () => ({ anim: anim.length, ys: cake ? cake.children.filter(c => c.userData && c.userData.h).map(c => +c.position.y.toFixed(2)) : [], visible }), snapshot: () => { renderer.render(scene, camera); const c = document.createElement("canvas"); c.width = canvas.width; c.height = canvas.height; const x = c.getContext("2d"); const gr = x.createRadialGradient(c.width / 2, c.height * .4, 0, c.width / 2, c.height / 2, c.width * .7); gr.addColorStop(0, "#3a2216"); gr.addColorStop(1, "#1e110b"); x.fillStyle = gr; x.fillRect(0, 0, c.width, c.height); x.drawImage(canvas, 0, 0); x.fillStyle = "#f0c97a"; x.font = `${c.width * .045}px 'Great Vibes', cursive`; x.textAlign = "center"; x.fillText("Heavora's Cravings", c.width / 2, c.height * .95); return c.toDataURL("image/png"); } };
  document.getElementById("mode-badge").textContent = reduce ? "3D · drag to rotate" : "3D · drag to rotate";
  window.dispatchEvent(new Event("cake:3d-ready"));
}
