// The Assay Index - live lab bench (Three.js 0.160)
// mountBench(el, assay, opts) -> { dispose }   full bench with controls
// buildRig(assay, opts)       -> { group, update(dt), dispose }   compact rig for the book
// Every protocol step is mapped by keyword to a phase and animated on the bench.

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ---------------------------------------------------------------------------
// Palette (mirrors css/style.css custom properties)
// ---------------------------------------------------------------------------
export const PAL = {
  paper: 0xf5f1e8, paper2: 0xfbf9f3, paperDeep: 0xece7db,
  ink: 0x2a2620, inkMuted: 0x6e6759, inkFaint: 0xa49b89,
  sage: 0x5c6f5a, sageDeep: 0x43503f, sageTint: 0xdfe4d8,
  wood: 0xb98d5a, woodDeep: 0x8a683f, amber: 0xc67b2e, rust: 0xa3502e,
  rule: 0xd8d2c4, slate: 0x4f6475, gold: 0xc9a24e
};
const CSS = {
  paper: '#f5f1e8', paper2: '#fbf9f3', paperDeep: '#ece7db', ink: '#2a2620', muted: '#6e6759',
  faint: '#a49b89', sage: '#5c6f5a', sageDeep: '#43503f', sageTint: '#dfe4d8', wood: '#b98d5a',
  woodDeep: '#8a683f', amber: '#c67b2e', rust: '#a3502e', rule: '#d8d2c4', slate: '#4f6475'
};
const FONT = "'General Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "'Boska', Georgia, serif";

export const PHASES = ['dispense', 'incubate', 'run', 'read', 'analyse'];
export const PHASE_LABEL = { dispense: 'Dispense', incubate: 'Incubate', run: 'Load / run', read: 'Read', analyse: 'Analyse' };
const PHASE_DUR = { dispense: 5.2, incubate: 3.8, run: 4.2, read: 4.8, analyse: 4.4 };

export const ARCHETYPES = {
  plate: 'Plate reader', biosensor: 'Biosensor', lcms: 'LC-MS', flow: 'Flow cytometer',
  culture: 'Cell culture and imaging', sequencing: 'Sequencing', ephys: 'Electrophysiology',
  thermal: 'Thermal and biophysics', micro: 'Microbiology',
  vivarium: 'In vivo', bioreactor: 'Production'
};

// ---------------------------------------------------------------------------
// Keyword mapping
// ---------------------------------------------------------------------------
const ARCH_RULES = [
  ['biosensor', /\b(spr|bli|gci|saw)\b|plasmon|interferometr|octet|biacore|creoptix|carterra|grating|acoustic wave|sensorgram/],
  ['ephys', /patch clamp|\bherg\b|nav1|cav1|\bmea\b|microelectrode|maestro|syncropatch|qpatch|ion[- ]channel|ligand-gated|impedance|cellkey/],
  ['micro', /\bames\b|bacteri|bioburden|steril|endotoxin|\blal\b|tcid50|microb|agar|colony|petri|bact\/alert/],
  ['sequencing', /sequenc|\bngs\b|\b(rt-|q|dd)?pcr\b|novaseq|nextseq|miseq|chromium|visium|xenium|revio|nanopore|pacbio|quantstudio|-seq\b|bioanalyzer|tapestation|genetic analyzer|guide-seq/],
  ['thermal', /\bdsf\b|\bdsc\b|nanodsf|melt|thermal|calorimetr|\bitc\b|uncle|prometheus|circular dichroism|\bdls\b|zetasizer|thermophoresis|\bauc\b|ultracentrifug|viscosity|dynapro/],
  ['flow', /flow cytometr|\bfacs|fortessa|cytoflex|navios|imagestream|cfse|receptor occupancy|basophil/],
  ['lcms', /lc-ms|ms\/ms|mass spec|orbitrap|hplc|uplc|chromatograph|\bsfc\b|gc-|qtof|qtrap|triple quad|rapidfire|icp-ms|hilic|cdms|\bnmr\b|icief|\bice3\b|\bhdx|\bsec\b|sec-|\bhic\b|\bcic\b|\bsmac\b|\bhac\b|karl fischer|\bmetid\b|\bms\b/],
  ['plate', /envision|pherastar|clariostar|spectramax|plate reader|glomax|flipr|luminescen|absorbance|\belisa\b|htrf|alphalisa|tr-fret|fluorescence polari|topcount|luminex|\bmsd\b|meso|simoa|reporter|\bbret\b/],
  ['culture', /imag|microscop|organoid|incucyte|phenix|high-content|confocal|migration|ipsc|painting|organ-on|culture|crispr-edited|nucleofect|comet|micronucleus|metaphase|seahorse|transwell|hepatocyte|cell-based|disease-models|chip/]
];

export function archetypeOf(a) {
  const inst = (a.instruments || []).map((i) => i.name + ' ' + (i.role || '')).join(' ');
  const name = [a.id, a.name].join(' ').toLowerCase();
  const first = (a.instruments && a.instruments[0] ? a.instruments[0].name : '').toLowerCase();
  const full = (name + ' ' + inst + ' ' + a.category).toLowerCase();
  if (a.category === 'invivo') return 'vivarium';
  if (a.category === 'production') return 'bioreactor';
  for (const txt of [name, first, full]) for (const [k, re] of ARCH_RULES) if (re.test(txt)) return k;
  if (a.category === 'cell' || a.category === 'disease-models') return 'culture';
  if (a.category === 'genomics') return 'sequencing';
  if (a.category === 'qc' || a.category === 'peptide' || a.category === 'adme') return 'lcms';
  return 'plate';
}

const PHASE_RULES = {
  analyse: /\b(fit|generate .*curve|convert|analy[sz]|report|calculat|normali[sz]|compar|interpret|plot|gate|gating|deconvol|align|call|scor|review|derive|determin|express|summar|rank|classif|assess|estimat|integrat|subtract|flag|export|confirm|map)/,
  read: /\b(read|measur|detect|record|acquir|imag|scan|count|monitor|quantif|captur|visuali|observ|titrat|ramp|heat)/,
  incubate: /\b(incubat|culture|grow|equilibrat|wait|overnight|anneal|hybridi|block|stimulat|treat|differentiat|expand|digest|ferment|rest|pre-?incubat|stress|store|hold|cool|freez|dialy[sz]|expos|infect|transduc)/,
  run: /\b(load|inject|run|dock|prime|insert|transfer|place|mount|start|centrifug|spin|wash|separat|elut|amplif|cycl|electrophor|regenerat|harvest|filter|flow|sort|launch|queue|calibrat|set up|setup|condition|install|equip)/,
  dispense: /\b(dispens|pipett|add|dilut|prepar|coat|seed|plate|mix|aliquot|serial|spik|label|stain|coupl|immobil|transfect|lys|extract|thaw|resuspend|reconstitut|dissolv|weigh|make|combin|fill|dose|apply|electroporat|fix|permeabili|denatur|reduc|alkylat|precipit|quench|buffer|isolat|purif|collect|obtain|design|select|choose|construct|clone|synthes)/
};

export function phaseOf(step, i, n) {
  const s = String(step || '').toLowerCase();
  // cell-line upkeep ("Culture HEK293 cells stably expressing ...; passage <30") is prep, not an incubation
  if (/^(culture|maintain|grow)\b.*\b(passag|stabl|expressing)/.test(s)) return 'dispense';
  // decision rules ("Two-fold rule: positive if ...") are analysis even when they mention dose
  if (/^[^:]{0,40}\b(rule|criteri|threshold)\b|\b(positive|negative) if\b/.test(s)) return 'analyse';
  // in vivo: acclimatisation is a hold; blood sampling / necropsy is the collection run
  if (/^(acclimat|habituat|quarantin)/.test(s)) return 'incubate';
  if (/\b(serial (blood|bleed|sampl)|blood (sampl|draw|collect)|bleed|microsampl|tail[- ]vein sampl|terminal (bleed|collect)|necrops)/.test(s) && !/^(fit|analy|report|calculat)|^[a-z ]{0,20}histopath/.test(s)) return 'run';
  // a step that leads with qPCR is the read-out; one that leads with sequencing is an instrument run
  const lead = s.replace(/^[^:]{0,30}:\s*/, '');
  if (/^(rt-)?qpcr\b/.test(lead)) return 'read';
  const seqRun = /^(deep-|sanger )?sequence\b|^rna-seq\b|\band sequence\b/.test(lead);
  let best = null, bestAt = Infinity;
  for (const ph of PHASES) {
    const m = s.match(PHASE_RULES[ph]);
    if (m && m.index < bestAt) { best = ph; bestAt = m.index; }
  }
  const f = n > 1 ? i / (n - 1) : 0;
  const ph = best || (f < 0.25 ? 'dispense' : f < 0.5 ? 'run' : f < 0.8 ? 'read' : 'analyse');
  return seqRun && ph === 'analyse' ? 'run' : ph; // sequencing is never desk analysis
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const seg = (p, a, b) => clamp((p - a) / (b - a));

function makeKit() {
  const mats = new Map();
  const K = {
    mat(color, o = {}) {
      const key = color + JSON.stringify(o);
      if (mats.has(key)) return mats.get(key);
      let m;
      if (o.glass) m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.08, metalness: 0, transparent: true, opacity: o.opacity ?? 0.28, depthWrite: false, clearcoat: 1 });
      else m = new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.6, metalness: o.metal ?? 0, emissive: o.emissive ?? 0x000000, emissiveIntensity: o.ei ?? 1, transparent: !!o.transparent, opacity: o.opacity ?? 1 });
      mats.set(key, m);
      return m;
    },
    own(color, o = {}) { // unshared, for animated emissive
      return new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? 0.5, metalness: o.metal ?? 0, emissive: o.emissive ?? 0x000000, emissiveIntensity: o.ei ?? 0, transparent: !!o.transparent, opacity: o.opacity ?? 1, depthWrite: o.depthWrite ?? true });
    }
  };
  return K;
}

const geoCache = new Map();
function rboxGeo(w, h, d, r) {
  const key = [w, h, d, r].map((v) => v.toFixed(3)).join('|');
  if (geoCache.has(key)) return geoCache.get(key);
  r = Math.min(r, w / 2 - 0.001, d / 2 - 0.001);
  const b = Math.min(r * 0.5, h * 0.25, 0.04);
  const W = w - 2 * b, D = d - 2 * b, rr = Math.max(0.001, r - b);
  const s = new THREE.Shape();
  const x0 = -W / 2, y0 = -D / 2;
  s.moveTo(x0 + rr, y0);
  s.lineTo(x0 + W - rr, y0); s.quadraticCurveTo(x0 + W, y0, x0 + W, y0 + rr);
  s.lineTo(x0 + W, y0 + D - rr); s.quadraticCurveTo(x0 + W, y0 + D, x0 + W - rr, y0 + D);
  s.lineTo(x0 + rr, y0 + D); s.quadraticCurveTo(x0, y0 + D, x0, y0 + D - rr);
  s.lineTo(x0, y0 + rr); s.quadraticCurveTo(x0, y0, x0 + rr, y0);
  const g = new THREE.ExtrudeGeometry(s, { depth: Math.max(0.001, h - 2 * b), bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 6 });
  g.rotateX(-Math.PI / 2);
  g.center();
  g.userData.shared = true;
  geoCache.set(key, g);
  return g;
}

function mesh(geo, mat, x = 0, y = 0, z = 0, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = shadow; m.receiveShadow = true;
  return m;
}
// rounded box resting on y (bottom at y)
function rb(K, w, h, d, color, x, y, z, r = 0.06, o) {
  return mesh(rboxGeo(w, h, d, r), K.mat(color, o), x, y + h / 2, z);
}
function bx(K, w, h, d, color, x, y, z, o) {
  return mesh(new THREE.BoxGeometry(w, h, d), K.mat(color, o), x, y + h / 2, z);
}
function cyl(K, rt, rbm, h, color, x, y, z, o, seg = 24) {
  return mesh(new THREE.CylinderGeometry(rt, rbm, h, seg), K.mat(color, o), x, y + h / 2, z);
}

// ---------------------------------------------------------------------------
// Bench props
// ---------------------------------------------------------------------------
function woodTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 512, 256);
  g.addColorStop(0, '#c49a66'); g.addColorStop(1, '#b4875a');
  x.fillStyle = g; x.fillRect(0, 0, 512, 256);
  const r = rng(7);
  for (let i = 0; i < 90; i++) {
    x.strokeStyle = `rgba(120,84,48,${0.03 + r() * 0.07})`;
    x.lineWidth = 0.6 + r() * 1.8;
    x.beginPath();
    const y = r() * 256;
    x.moveTo(0, y);
    x.bezierCurveTo(170, y + (r() - 0.5) * 18, 340, y + (r() - 0.5) * 18, 512, y + (r() - 0.5) * 10);
    x.stroke();
  }
  for (let i = 1; i < 4; i++) { x.fillStyle = 'rgba(90,62,34,0.22)'; x.fillRect(0, i * 64, 512, 1.5); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function makeWorkbench(K) {
  const g = new THREE.Group();
  const top = mesh(rboxGeo(9.4, 0.2, 3.6, 0.08), new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.75 }), 0, -0.1, 0);
  g.add(top);
  // apron + legs
  g.add(bx(K, 9.0, 0.28, 0.08, PAL.woodDeep, 0, -0.48, 1.62));
  for (const sx of [-4.4, 4.4]) for (const sz of [-1.5, 1.5]) g.add(bx(K, 0.16, 2.2, 0.16, PAL.woodDeep, sx, -2.4, sz));
  g.add(bx(K, 8.9, 0.08, 3.1, PAL.woodDeep, 0, -1.9, 0));
  // back upstand with shelf
  g.add(rb(K, 9.4, 2.3, 0.1, PAL.paperDeep, 0, 0, -1.78, 0.04));
  g.add(rb(K, 9.2, 0.07, 0.42, PAL.wood, 0, 1.8, -1.55, 0.03));
  for (const sx of [-4.2, 0, 4.2]) g.add(bx(K, 0.05, 0.25, 0.3, PAL.woodDeep, sx, 1.55, -1.6));
  // shelf bottles
  const r = rng(3);
  for (let i = 0; i < 9; i++) {
    const x = -4 + i * 0.55 + r() * 0.1;
    if (x > -0.6 && x < 0.9) continue;
    const h = 0.32 + r() * 0.25;
    const col = [PAL.amber, PAL.sageTint, PAL.paper2, PAL.slate][i % 4];
    g.add(cyl(K, 0.11, 0.11, h, col, x, 1.87, -1.55, { rough: 0.35, transparent: col === PAL.amber, opacity: 0.85 }));
    g.add(cyl(K, 0.06, 0.06, 0.08, PAL.ink, x, 1.87 + h, -1.55));
  }
  // a notebook on the shelf for a lab-notebook touch
  const nb = rb(K, 0.7, 0.08, 0.36, PAL.gold, 0.15, 1.87, -1.55, 0.02); g.add(nb);
  return g;
}

function makePlate(K) {
  const g = new THREE.Group();
  const base = mesh(rboxGeo(1.28, 0.14, 0.86, 0.05), K.mat(PAL.paper2, { rough: 0.45 }), 0, 0.07, 0);
  g.add(base);
  const skirt = mesh(rboxGeo(1.32, 0.03, 0.9, 0.05), K.mat(PAL.rule, { rough: 0.5 }), 0, 0.015, 0);
  g.add(skirt);
  const wellGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.012, 14);
  const wellMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });
  const wells = new THREE.InstancedMesh(wellGeo, wellMat, 96);
  const m4 = new THREE.Matrix4();
  const empty = new THREE.Color(0xe4dccb);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) {
    const i = r * 12 + c;
    m4.makeTranslation(-0.495 + c * 0.09, 0.146, -0.315 + r * 0.09);
    wells.setMatrixAt(i, m4);
    wells.setColorAt(i, empty);
  }
  wells.castShadow = false; wells.receiveShadow = false;
  g.add(wells);
  // A1 notch corner mark
  g.add(bx(K, 0.08, 0.005, 0.02, PAL.inkFaint, -0.58, 0.141, -0.39));
  // lid (shown while incubating)
  const lid = mesh(rboxGeo(1.34, 0.05, 0.92, 0.05), K.mat(0xeef2ee, { glass: true, opacity: 0.35 }), 0, 0.19, 0, false);
  lid.visible = false;
  g.add(lid);
  return { group: g, wells, lid, empty };
}

function makePipette(K) {
  // multichannel; origin at the tip ends of the 8 channels
  const g = new THREE.Group();
  const body = new THREE.Group(); g.add(body);
  body.add(mesh(rboxGeo(0.86, 0.12, 0.12, 0.04), K.mat(PAL.ink, { rough: 0.4 }), 0, 0.42, 0));
  for (let i = 0; i < 8; i++) body.add(cyl(K, 0.018, 0.012, 0.12, PAL.inkMuted, -0.315 + i * 0.09, 0.24, 0, { rough: 0.4 }, 10));
  // handle rising from manifold, tilted a touch toward user
  body.add(rb(K, 0.18, 0.95, 0.2, PAL.paper2, 0, 0.46, 0, 0.08, { rough: 0.35 }));
  body.add(rb(K, 0.19, 0.18, 0.21, PAL.sage, 0, 1.0, 0, 0.06));
  body.add(cyl(K, 0.05, 0.05, 0.22, PAL.ink, 0, 1.4, 0, { rough: 0.3 }, 16));
  body.add(cyl(K, 0.08, 0.08, 0.04, PAL.amber, 0, 1.62, 0, { rough: 0.3 }, 16));
  const disp = bx(K, 0.12, 0.08, 0.01, 0x2f3a2e, 0, 0.8, 0.105, { emissive: PAL.sageTint, ei: 0.25 }); body.add(disp);
  // tips (hidden until picked up)
  const tips = new THREE.Group();
  const liquid = new THREE.Group();
  const tipGeo = new THREE.ConeGeometry(0.022, 0.26, 12, 1, true); tipGeo.rotateX(Math.PI);
  const liqGeo = new THREE.ConeGeometry(0.014, 0.12, 10); liqGeo.rotateX(Math.PI);
  const tipMat = K.mat(0xf3efe4, { glass: true, opacity: 0.6 });
  const liqMat = K.own(PAL.amber, { rough: 0.3 });
  for (let i = 0; i < 8; i++) {
    const t = new THREE.Mesh(tipGeo, tipMat); t.position.set(-0.315 + i * 0.09, 0.13, 0); tips.add(t);
    const l = new THREE.Mesh(liqGeo, liqMat); l.position.set(-0.315 + i * 0.09, 0.07, 0); liquid.add(l);
  }
  tips.visible = false; liquid.visible = false;
  g.add(tips, liquid);
  // rotate so the 8 channels run along z (plate rows)
  g.rotation.y = Math.PI / 2;
  return { group: g, tips, liquid, liqMat };
}

function makeTipBox(K) {
  const g = new THREE.Group();
  g.add(rb(K, 1.2, 0.4, 0.82, PAL.sage, 0, 0, 0, 0.05, { rough: 0.5 }));
  g.add(rb(K, 1.14, 0.03, 0.76, PAL.paper2, 0, 0.4, 0, 0.02));
  const geo = new THREE.CylinderGeometry(0.02, 0.012, 0.12, 8);
  const tips = new THREE.InstancedMesh(geo, K.mat(0xf6f1e4, { rough: 0.3 }), 96);
  const m4 = new THREE.Matrix4();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) { m4.makeTranslation(-0.495 + c * 0.09, 0.49, -0.315 + r * 0.09); tips.setMatrixAt(r * 12 + c, m4); }
  g.add(tips);
  // hinged lid, open toward the back
  const lid = new THREE.Group(); lid.position.set(0, 0.42, -0.41);
  const lm = mesh(rboxGeo(1.2, 0.05, 0.82, 0.04), K.mat(0xd8e0d4, { glass: true, opacity: 0.45 }), 0, 0, 0.41, false);
  lid.add(lm); lid.rotation.x = -1.95;
  g.add(lid);
  return { group: g, tips };
}

function makeReservoir(K) {
  const g = new THREE.Group();
  g.add(rb(K, 0.42, 0.16, 0.86, PAL.paper2, 0, 0, 0, 0.05, { rough: 0.35 }));
  const liq = bx(K, 0.32, 0.02, 0.74, PAL.amber, 0, 0.13, 0, { rough: 0.15 });
  liq.material = K.own(PAL.amber, { rough: 0.15 });
  g.add(liq);
  return { group: g, liq };
}

function makeBeaker(K, r, h, liqColor, fill = 0.5) {
  const g = new THREE.Group();
  const glass = K.mat(0xe7eeee, { glass: true, opacity: 0.3 });
  const body = mesh(new THREE.CylinderGeometry(r, r * 0.96, h, 28, 1, true), glass, 0, h / 2, 0, false);
  const bottom = mesh(new THREE.CircleGeometry(r * 0.96, 28), glass, 0, 0.005, 0, false); bottom.rotation.x = -Math.PI / 2;
  const liq = mesh(new THREE.CylinderGeometry(r * 0.92, r * 0.9, h * fill, 28), K.mat(liqColor, { rough: 0.2, transparent: true, opacity: 0.82 }), 0, h * fill / 2 + 0.01, 0, false);
  const rim = mesh(new THREE.TorusGeometry(r, 0.012, 8, 28), glass, 0, h, 0, false); rim.rotation.x = Math.PI / 2;
  g.add(liq, body, bottom, rim);
  // graduation ticks
  for (let i = 1; i < 4; i++) {
    const t = mesh(new THREE.BoxGeometry(0.06, 0.008, 0.004), K.mat(PAL.paper2), 0, h * i / 4.4, r + 0.002, false);
    g.add(t);
  }
  return g;
}

function makeTubeRack(K) {
  const g = new THREE.Group();
  g.add(rb(K, 1.0, 0.1, 0.42, PAL.sageTint, 0, 0, 0, 0.03));
  g.add(rb(K, 1.0, 0.04, 0.42, PAL.sageTint, 0, 0.36, 0, 0.03));
  for (const sx of [-0.47, 0.47]) g.add(bx(K, 0.04, 0.3, 0.38, PAL.sageTint, sx, 0.08, 0));
  const caps = [PAL.rust, PAL.amber, PAL.sage, PAL.slate, PAL.paper2, PAL.amber];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) {
    if ((r + c) % 5 === 4) continue;
    const x = -0.38 + c * 0.152, z = -0.09 + r * 0.18;
    g.add(mesh(new THREE.CylinderGeometry(0.045, 0.03, 0.42, 12), K.mat(0xf2eee4, { glass: true, opacity: 0.55 }), x, 0.31, z, false));
    g.add(cyl(K, 0.035, 0.03, 0.14, r ? PAL.amber : PAL.sageTint, x, 0.12, z, { transparent: true, opacity: 0.85 }, 12));
    g.add(cyl(K, 0.052, 0.052, 0.06, caps[(r * 6 + c) % caps.length], x, 0.52, z, { rough: 0.4 }, 12));
  }
  return g;
}

function makeGantry(K, x0, x1) {
  // side rails along z at x0 and x1; beam along x travels in z; head travels in x
  const g = new THREE.Group();
  const H = 1.95, zb = -1.3, zf = 1.35, cz = (zb + zf) / 2, len = zf - zb;
  for (const x of [x0, x1]) {
    g.add(rb(K, 0.16, 0.14, len + 0.3, PAL.paper2, x, H, cz, 0.04));
    g.add(bx(K, 0.04, 0.02, len + 0.2, PAL.sage, x, H + 0.14, cz));
    g.add(rb(K, 0.18, H, 0.18, PAL.rule, x, 0, zb - 0.1, 0.05));
    const brace = mesh(new THREE.BoxGeometry(0.06, 0.06, 1.1), K.mat(PAL.rule), x, H - 0.38, zb + 0.38); brace.rotation.x = -0.62; g.add(brace);
  }
  const beam = new THREE.Group(); beam.position.z = zb + 0.15;
  beam.add(rb(K, x1 - x0 + 0.1, 0.13, 0.16, PAL.ink, (x0 + x1) / 2, H + 0.14, 0, 0.04, { rough: 0.4 }));
  const head = new THREE.Group(); head.position.set((x0 + x1) / 2, H + 0.05, 0);
  head.add(rb(K, 0.3, 0.42, 0.86, PAL.paper2, 0, -0.32, 0.0, 0.06));
  head.add(bx(K, 0.31, 0.05, 0.87, PAL.sage, 0, 0.06, 0));
  const ch = new THREE.Group();
  ch.add(rb(K, 0.1, 0.9, 0.7, PAL.inkMuted, 0, -0.75, 0, 0.03, { metal: 0.4, rough: 0.4 }));
  for (let i = 0; i < 8; i++) ch.add(cyl(K, 0.02, 0.016, 0.32, PAL.inkFaint, 0, -0.85, -0.315 + i * 0.09, { metal: 0.6, rough: 0.3 }, 10));
  const tips = new THREE.Group();
  for (let i = 0; i < 8; i++) tips.add(cyl(K, 0.022, 0.008, 0.22, 0xf3efe4, 0, -1.07, -0.315 + i * 0.09, { rough: 0.3 }, 10));
  tips.visible = false;
  ch.add(tips);
  head.add(ch);
  beam.add(head);
  g.add(beam);
  return { group: g, beam, head, ch, tips, H, zb, zf, x0, x1 };
}

// ---------------------------------------------------------------------------
// Instrument monitor with live readout
// ---------------------------------------------------------------------------
function makeMonitor(K, w = 1.5) {
  const g = new THREE.Group();
  const h = w * 0.625;
  const c = document.createElement('canvas'); c.width = 640; c.height = 400;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  g.add(rb(K, 0.5, 0.04, 0.34, PAL.ink, 0, 0, 0, 0.04, { rough: 0.4 }));
  g.add(rb(K, 0.08, 0.5, 0.06, PAL.ink, 0, 0.02, -0.06, 0.02, { rough: 0.4 }));
  const frame = new THREE.Group(); frame.position.set(0, 0.5 + h / 2, 0); frame.rotation.x = -0.08;
  frame.add(mesh(rboxGeo(w + 0.08, 0.06, h + 0.08, 0.04), K.mat(PAL.ink, { rough: 0.35 }), 0, 0, 0));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
  // the extruded box is oriented with depth along y; rotate frame geometry to face +z
  frame.children[0].rotation.x = Math.PI / 2;
  scr.position.z = 0.035;
  frame.add(scr);
  g.add(frame);
  return { group: g, canvas: c, tex, h };
}

function screenFrame(x, W, H, title, status) {
  x.fillStyle = CSS.paper2; x.fillRect(0, 0, W, H);
  x.fillStyle = CSS.paperDeep; x.fillRect(0, 0, W, 40);
  x.fillStyle = CSS.sage; x.fillRect(0, 38, W, 2);
  x.fillStyle = CSS.ink; x.font = `600 17px ${FONT}`; x.textAlign = 'left'; x.textBaseline = 'middle';
  let t = title; while (x.measureText(t).width > W - 190 && t.length > 4) t = t.slice(0, -2);
  if (t !== title) t = t.trim() + '...';
  x.fillText(t, 18, 20);
  x.textAlign = 'right'; x.fillStyle = CSS.muted; x.font = `500 14px ${FONT}`;
  x.fillText(status, W - 18, 20);
  x.textAlign = 'left';
}
function axes(x, L, T, R, B, xl, yl) {
  x.strokeStyle = CSS.rule; x.lineWidth = 1;
  for (let i = 1; i < 4; i++) { const y = T + (B - T) * i / 4; x.beginPath(); x.moveTo(L, y); x.lineTo(R, y); x.stroke(); }
  x.strokeStyle = CSS.muted; x.lineWidth = 1.5;
  x.beginPath(); x.moveTo(L, T); x.lineTo(L, B); x.lineTo(R, B); x.stroke();
  x.fillStyle = CSS.faint; x.font = `500 12px ${FONT}`;
  x.textAlign = 'right'; x.fillText(xl, R, B + 16);
  x.save(); x.translate(L - 12, T); x.rotate(-Math.PI / 2); x.textAlign = 'right'; x.fillText(yl, 0, 0); x.restore();
  x.textAlign = 'left';
}
function tag(x, txt, px, py, color = CSS.sageDeep) {
  x.font = `600 13px ${FONT}`;
  const w = x.measureText(txt).width + 16;
  x.fillStyle = 'rgba(251,249,243,0.92)'; x.strokeStyle = color; x.lineWidth = 1.2;
  roundRect(x, px, py - 11, w, 22, 11); x.fill(); x.stroke();
  x.fillStyle = color; x.textBaseline = 'middle'; x.fillText(txt, px + 8, py); x.textBaseline = 'alphabetic';
}
function roundRect(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
function hexLerp(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = ((pa >> 16) + ((pb >> 16) - (pa >> 16)) * t) | 0, g = (((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * t) | 0, bl = ((pa & 255) + ((pb & 255) - (pa & 255)) * t) | 0;
  return `rgb(${r},${g},${bl})`;
}

// readout drawers: (ctx, L, T, R, B, p data progress, f fit overlay, r rng-values)
const READOUTS = {
  vivarium(x, L, T, R, B, p, f, S) {
    // plasma concentration-time profile (semi-log), three animals per timepoint
    axes(x, L, T, R, B, 'time post-dose (h)', 'plasma conc (log)');
    const tp = [0.083, 0.25, 0.5, 1, 2, 4, 8, 12, 24], ka = S.pk.ka, ke = S.pk.ke;
    const conc = (h) => (Math.exp(-ke * h) - Math.exp(-ka * h)) / (Math.exp(-ke * S.pk.tmax) - Math.exp(-ka * S.pk.tmax));
    const yOf = (c) => B - (B - T) * clamp((Math.log10(Math.max(c, 0.004)) + 2.4) / 2.5);
    const xOf = (h) => L + (R - L) * (h / 24);
    x.fillStyle = CSS.faint; x.font = `500 12px ${FONT}`;
    x.textAlign = 'center';
    for (const h of [0, 6, 12]) x.fillText(String(h), xOf(h), B + 16);
    x.textAlign = 'left';
    const shown = Math.floor(p * tp.length + 0.001);
    const cols = [CSS.sage, CSS.sageDeep, CSS.amber];
    tp.forEach((h, i) => {
      if (i >= shown) return;
      for (let k = 0; k < 3; k++) {
        const c = conc(h) * (0.82 + 0.36 * S.noise[(i * 3 + k) % S.noise.length]);
        x.fillStyle = cols[k]; x.beginPath(); x.arc(xOf(h) + (k - 1) * 4, yOf(c), 4, 0, Math.PI * 2); x.fill();
      }
    });
    if (f > 0) {
      x.strokeStyle = CSS.rust; x.lineWidth = 2.4; x.beginPath();
      const n = Math.floor(120 * f);
      for (let k = 0; k <= n; k++) { const h = 0.05 + 23.95 * k / 120; const px = xOf(h), py = yOf(conc(h)); k ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
      if (f > 0.6) tag(x, 't1/2 ' + (Math.LN2 / ke).toFixed(1) + ' h   AUC ' + Math.round(S.num(400, 4200)) + ' ng.h/mL', R - 300, T + 14, CSS.rust);
    }
  },
  bioreactor(x, L, T, R, B, p, f, S) {
    // fed-batch growth (OD600) with product titer climbing after induction
    axes(x, L, T, R, B, 'process time (h)', 'OD600 / titer');
    const ind = S.bio.ind, n = Math.floor(160 * p);
    const od = (u) => 0.04 + 0.9 / (1 + Math.exp(-(u - S.bio.mid) * 11));
    const ti = (u) => u < ind ? 0 : 0.78 * (1 - Math.exp(-(u - ind) * 4.2));
    x.setLineDash([4, 5]); x.strokeStyle = CSS.faint; x.lineWidth = 1;
    if (p > ind) { const ix = L + (R - L) * ind; x.beginPath(); x.moveTo(ix, T); x.lineTo(ix, B); x.stroke(); x.fillStyle = CSS.faint; x.font = `500 12px ${FONT}`; x.fillText('induce', ix + 4, T + 12); }
    x.setLineDash([]);
    for (const [fn, col, w] of [[od, CSS.sage, 2.6], [ti, CSS.amber, 2.6]]) {
      x.strokeStyle = col; x.lineWidth = w; x.beginPath();
      for (let k = 0; k <= n; k++) { const u = k / 160; const px = L + (R - L) * u, py = B - (B - T) * (fn(u) + (S.noise[k % S.noise.length] - 0.5) * 0.012); k ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
    }
    x.font = `500 12px ${FONT}`;
    x.fillStyle = CSS.sage; x.fillRect(L + 10, T + 6, 10, 3); x.fillText('OD600', L + 26, T + 11);
    x.fillStyle = CSS.amber; x.fillRect(L + 84, T + 6, 10, 3); x.fillText('titer', L + 100, T + 11);
    if (f > 0) {
      const bw = (R - L) * 0.05, bx0 = R - bw * 6.5;
      [0.25, 0.7, 1, 0.55, 0.18].forEach((v, i) => { const h = (B - T) * 0.35 * v * f; x.fillStyle = i === 2 ? CSS.rust : CSS.sageTint; x.fillRect(bx0 + i * bw * 1.25, B - h, bw, h); });
      if (f > 0.5) tag(x, 'Titer ' + S.num(0.6, 4.8).toFixed(1) + ' g/L   purity ' + Math.round(S.num(92, 99)) + '%', R - 290, T + 34, CSS.rust);
    }
  },
  plate(x, L, T, R, B, p, f, S) {
    const gw = (R - L) * 0.58, cs = Math.min(gw / 12, (B - T) / 8);
    const shown = Math.floor(p * 96 + 0.001);
    for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) {
      const i = c * 8 + r, cx = L + cs * (c + 0.5), cy = T + cs * (r + 0.5);
      const v = S.plate[r * 12 + c];
      x.beginPath(); x.arc(cx, cy, cs * 0.4, 0, Math.PI * 2);
      x.fillStyle = i < shown ? hexLerp(CSS.sageTint, v > 0.6 ? CSS.amber : CSS.sageDeep, v) : CSS.paperDeep;
      x.fill();
    }
    const l2 = L + gw + 34;
    axes(x, l2, T, R, B, 'log [compound]', 'signal');
    const pts = S.dose;
    for (let i = 0; i < pts.length; i++) {
      if (i / pts.length > p) break;
      const px = l2 + (R - l2) * (i + 0.5) / pts.length, py = B - (B - T) * pts[i];
      x.fillStyle = CSS.sage; x.beginPath(); x.arc(px, py, 4, 0, Math.PI * 2); x.fill();
    }
    if (f > 0) {
      x.strokeStyle = CSS.rust; x.lineWidth = 2.5; x.beginPath();
      const n = Math.floor(60 * f);
      for (let k = 0; k <= n; k++) { const u = k / 60; const y = 0.08 + 0.84 / (1 + Math.exp((u - 0.5) * 11)); const px = l2 + (R - l2) * u, py = B - (B - T) * y; k ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
      if (f > 0.6) tag(x, 'IC50 ' + S.num(0.2, 2.4).toFixed(2) + ' uM', l2 + 6, T + 14, CSS.rust);
    }
  },
  biosensor(x, L, T, R, B, p, f, S) {
    axes(x, L, T, R, B, 'time (s)', 'response (RU)');
    const ka = S.num(3, 6), kd = S.num(0.4, 1.4), tOn = 0.55;
    const cols = [CSS.sageTint, '#b9c6b2', CSS.sage, CSS.sageDeep, CSS.ink];
    x.fillStyle = 'rgba(198,123,46,0.07)'; x.fillRect(L + 1, T, (R - L) * 0.08, B - T);
    for (let ci = 0; ci < 5; ci++) {
      const c = Math.pow(2, ci) / 16, req = c / (c + 0.12);
      x.strokeStyle = cols[ci]; x.lineWidth = 2.4; x.beginPath();
      const n = Math.floor(160 * p);
      for (let k = 0; k <= n; k++) {
        const u = k / 160; let y;
        if (u < 0.08) y = 0; else if (u < tOn) y = req * (1 - Math.exp(-ka * (c + 0.12) * (u - 0.08) * 4)); else { const y0 = req * (1 - Math.exp(-ka * (c + 0.12) * (tOn - 0.08) * 4)); y = y0 * Math.exp(-kd * (u - tOn) * 2.4); }
        const px = L + (R - L) * u, py = B - (B - T) * 0.9 * y;
        k ? x.lineTo(px, py) : x.moveTo(px, py);
      }
      x.stroke();
    }
    if (p > tOn) { x.setLineDash([4, 5]); x.strokeStyle = CSS.faint; x.lineWidth = 1; x.beginPath(); x.moveTo(L + (R - L) * tOn, T); x.lineTo(L + (R - L) * tOn, B); x.stroke(); x.setLineDash([]); }
    if (f > 0) {
      x.globalAlpha = f; x.setLineDash([6, 4]); x.strokeStyle = CSS.rust; x.lineWidth = 1.6;
      for (let ci = 0; ci < 5; ci++) {
        const c = Math.pow(2, ci) / 16, req = c / (c + 0.12); x.beginPath();
        for (let k = 0; k <= 80; k++) { const u = 0.08 + (tOn - 0.08) * k / 80; const y = req * (1 - Math.exp(-ka * (c + 0.12) * (u - 0.08) * 4)); const px = L + (R - L) * u, py = B - (B - T) * 0.9 * y; k ? x.lineTo(px, py) : x.moveTo(px, py); }
        x.stroke();
      }
      x.setLineDash([]); x.globalAlpha = 1;
      if (f > 0.5) tag(x, 'KD ' + S.num(0.5, 9).toFixed(1) + ' nM  1:1 fit', R - 170, T + 14, CSS.rust);
    }
  },
  lcms(x, L, T, R, B, p, f, S) {
    axes(x, L, T, R, B, 'retention time (min)', 'intensity');
    const peaks = S.peaks;
    const yAt = (u) => { let y = 0.02 + 0.01 * Math.sin(u * 80); for (const pk of peaks) y += pk.h * Math.exp(-Math.pow((u - pk.t) / pk.w, 2)); return y; };
    if (f > 0) {
      for (const pk of peaks) {
        x.fillStyle = `rgba(92,111,90,${0.22 * f})`; x.beginPath(); x.moveTo(L + (R - L) * (pk.t - 2.5 * pk.w), B);
        for (let k = 0; k <= 30; k++) { const u = pk.t - 2.5 * pk.w + 5 * pk.w * k / 30; x.lineTo(L + (R - L) * u, B - (B - T) * 0.88 * yAt(u)); }
        x.lineTo(L + (R - L) * (pk.t + 2.5 * pk.w), B); x.fill();
      }
    }
    x.strokeStyle = CSS.ink; x.lineWidth = 2; x.beginPath();
    const n = Math.floor(260 * p);
    for (let k = 0; k <= n; k++) { const u = k / 260; const px = L + (R - L) * u, py = B - (B - T) * 0.88 * yAt(u); k ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.stroke();
    if (f > 0.4) {
      peaks.forEach((pk, i) => { if (pk.h > 0.25) { x.fillStyle = CSS.sageDeep; x.font = `600 12px ${FONT}`; x.textAlign = 'center'; x.fillText((pk.t * 12).toFixed(2), L + (R - L) * pk.t, B - (B - T) * 0.88 * yAt(pk.t) - 8); x.textAlign = 'left'; } });
      tag(x, 'Main peak ' + S.num(94, 99.6).toFixed(1) + '% area', L + 10, T + 14, CSS.sageDeep);
    }
  },
  flow(x, L, T, R, B, p, f, S) {
    axes(x, L, T, R, B, 'FSC-A', 'CD3 PE');
    const n = Math.floor(S.cells.length * p);
    for (let i = 0; i < n; i++) {
      const c = S.cells[i];
      x.fillStyle = c.k === 0 ? 'rgba(92,111,90,0.55)' : c.k === 1 ? 'rgba(198,123,46,0.6)' : 'rgba(110,103,89,0.4)';
      x.fillRect(L + (R - L) * c.x, B - (B - T) * c.y, 2.4, 2.4);
    }
    if (f > 0) {
      x.globalAlpha = f; x.strokeStyle = CSS.rust; x.lineWidth = 2;
      roundRect(x, L + (R - L) * 0.48, T + (B - T) * 0.08, (R - L) * 0.42, (B - T) * 0.36, 10); x.stroke();
      x.strokeStyle = CSS.sageDeep;
      roundRect(x, L + (R - L) * 0.12, T + (B - T) * 0.5, (R - L) * 0.36, (B - T) * 0.4, 10); x.stroke();
      x.globalAlpha = 1;
      if (f > 0.5) { tag(x, 'CD3+ ' + S.num(38, 62).toFixed(1) + '%', L + (R - L) * 0.62, T + (B - T) * 0.08 + 18, CSS.rust); tag(x, 'Gate 2', L + (R - L) * 0.14, T + (B - T) * 0.5 + 18); }
    }
  },
  culture(x, L, T, R, B, p, f, S) {
    x.fillStyle = '#23211c'; roundRect(x, L - 20, T - 6, R - L + 26, B - T + 12, 10); x.fill();
    const tiles = 4, tw = (R - L + 6) / tiles, th = (B - T + 12) / 3;
    const shown = Math.floor(p * 12 + 0.001);
    for (const c of S.blobs) {
      const ti = Math.floor((c.x) * tiles) + 4 * Math.floor(c.y * 3);
      if (ti >= shown) continue;
      const cx = L - 20 + (R - L + 26) * c.x, cy = T - 6 + (B - T + 12) * c.y;
      const gr = x.createRadialGradient(cx, cy, 0, cx, cy, c.r * 1.9);
      gr.addColorStop(0, c.k ? 'rgba(198,123,46,0.85)' : 'rgba(170,196,160,0.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gr; x.beginPath(); x.arc(cx, cy, c.r * 1.9, 0, Math.PI * 2); x.fill();
      x.fillStyle = c.k ? '#f0c08a' : '#dfe8d5'; x.beginPath(); x.arc(cx, cy, c.r * 0.5, 0, Math.PI * 2); x.fill();
      if (f > 0) { x.strokeStyle = `rgba(251,249,243,${0.8 * f})`; x.lineWidth = 1.2; x.beginPath(); x.arc(cx, cy, c.r * 1.3, 0, Math.PI * 2); x.stroke(); }
    }
    if (p < 1) { const ti = shown; const tx = L - 20 + tw * (ti % 4), ty = T - 6 + th * Math.floor(ti / 4); x.strokeStyle = CSS.amber; x.lineWidth = 2; x.strokeRect(tx + 2, ty + 2, tw - 4, th - 4); }
    if (f > 0.5) tag(x, S.blobs.length * 37 + ' objects  ' + S.num(18, 46).toFixed(0) + '% positive', L - 8, T + 14, CSS.amber);
  },
  sequencing(x, L, T, R, B, p, f, S) {
    const mid = T + (B - T) * 0.55;
    x.fillStyle = '#23211c'; roundRect(x, L - 20, T - 6, R - L + 26, mid - T, 8); x.fill();
    const cyc = Math.floor(p * 150);
    const cols = ['#9fb79a', '#e0a35c', '#c97a5c', '#8ea3b4'];
    for (const c of S.clusters) {
      const k = (c.b + cyc) % 4;
      x.fillStyle = cols[k]; x.globalAlpha = p > 0 ? 0.9 : 0.15;
      x.beginPath(); x.arc(L - 20 + (R - L + 26) * c.x, T - 6 + (mid - T) * c.y, 2.6, 0, Math.PI * 2); x.fill();
    }
    x.globalAlpha = 1;
    x.fillStyle = CSS.paper2; x.font = `600 13px ${FONT}`; x.fillText('cycle ' + cyc + ' / 150', L - 8, T + 12);
    const bT = mid + 26;
    axes(x, L, bT, R, B, 'cycle', 'Q');
    const nb = 50;
    for (let i = 0; i < nb; i++) {
      if (i / nb > p) break;
      const q = S.q[i];
      x.fillStyle = q > 0.62 ? CSS.sage : CSS.amber;
      const bw = (R - L) / nb;
      x.fillRect(L + i * bw + 1, B - (B - bT) * q, bw - 2, (B - bT) * q);
    }
    if (f > 0) {
      x.setLineDash([5, 4]); x.strokeStyle = CSS.rust; x.lineWidth = 1.5; x.beginPath(); x.moveTo(L, B - (B - bT) * 0.62); x.lineTo(R, B - (B - bT) * 0.62); x.stroke(); x.setLineDash([]);
      if (f > 0.5) tag(x, 'Q30 ' + S.num(88, 96).toFixed(1) + '%  ' + S.num(380, 920).toFixed(0) + 'M reads', R - 230, bT + 6, CSS.rust);
    }
  },
  ephys(x, L, T, R, B, p, f, S) {
    const vB = T + (B - T) * 0.22;
    x.strokeStyle = CSS.faint; x.lineWidth = 1.5; x.beginPath();
    x.moveTo(L, vB); x.lineTo(L + (R - L) * 0.15, vB); x.lineTo(L + (R - L) * 0.15, T); x.lineTo(L + (R - L) * 0.5, T); x.lineTo(L + (R - L) * 0.5, T + (B - T) * 0.12); x.lineTo(L + (R - L) * 0.8, T + (B - T) * 0.12); x.lineTo(L + (R - L) * 0.8, vB); x.lineTo(R, vB); x.stroke();
    const cT = vB + 24;
    axes(x, L, cT, R, B, 'time (ms)', 'current (pA)');
    const sweeps = 5, n = Math.floor(220 * p);
    const shades = [CSS.ink, CSS.sageDeep, CSS.sage, '#9fb79a', CSS.amber];
    for (let s = 0; s < sweeps; s++) {
      const amp = 1 - s * 0.18;
      x.strokeStyle = shades[s]; x.lineWidth = 1.8; x.beginPath();
      for (let k = 0; k <= n; k++) {
        const u = k / 220; let y = 0.12;
        if (u > 0.15 && u < 0.5) y = 0.12 + 0.18 * amp * (1 - Math.exp(-(u - 0.15) * 12)) * Math.exp(-(u - 0.15) * 3);
        if (u >= 0.5 && u < 0.8) y = 0.12 + 0.75 * amp * Math.exp(-(u - 0.5) * 9) * (1 - Math.exp(-(u - 0.5) * 120));
        y += (S.noise[k % S.noise.length] - 0.5) * 0.02;
        const px = L + (R - L) * u, py = B - (B - cT) * y;
        k ? x.lineTo(px, py) : x.moveTo(px, py);
      }
      x.stroke();
    }
    if (f > 0.3) tag(x, 'Tail current  IC50 ' + S.num(1, 30).toFixed(1) + ' uM', R - 230, cT + 8, CSS.rust);
  },
  thermal(x, L, T, R, B, p, f, S) {
    const mid = f > 0 ? T + (B - T) * 0.58 : B;
    axes(x, L, T, R, mid, f > 0 ? '' : 'temperature (C)', 'ratio 350/330');
    const curves = S.tms;
    const cols = [CSS.sageDeep, CSS.sage, CSS.amber, CSS.rust];
    const n = Math.floor(160 * p);
    curves.forEach((tm, i) => {
      x.strokeStyle = cols[i % 4]; x.lineWidth = 2.2; x.beginPath();
      for (let k = 0; k <= n; k++) { const u = k / 160; const y = 0.15 + 0.7 / (1 + Math.exp(-(u - tm) * 28)); const px = L + (R - L) * u, py = mid - (mid - T) * y; k ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
    });
    if (p > 0 && p < 1) { const hx = L + (R - L) * p; x.strokeStyle = 'rgba(163,80,46,0.35)'; x.lineWidth = 6; x.beginPath(); x.moveTo(hx, T); x.lineTo(hx, mid); x.stroke(); }
    if (f > 0) {
      const dT = mid + 18;
      axes(x, L, dT, R, B, 'temperature (C)', 'd/dT');
      curves.forEach((tm, i) => {
        x.strokeStyle = cols[i % 4]; x.lineWidth = 1.8; x.globalAlpha = f; x.beginPath();
        for (let k = 0; k <= 160; k++) { const u = k / 160; const e = Math.exp(-(u - tm) * 28); const y = 0.9 * 4 * e / Math.pow(1 + e, 2); const px = L + (R - L) * u, py = B - (B - dT) * y; k ? x.lineTo(px, py) : x.moveTo(px, py); }
        x.stroke(); x.globalAlpha = 1;
      });
      if (f > 0.5) tag(x, 'Tm1 ' + (20 + 75 * curves[0]).toFixed(1) + ' C', L + 8, T + 14, CSS.rust);
    }
  },
  micro(x, L, T, R, B, p, f, S) {
    axes(x, L, T, R, B, 'dose', 'revertants / plate');
    const bars = S.counts, bw = (R - L) / bars.length;
    bars.forEach((v, i) => {
      const h = (B - T) * v * clamp(p * bars.length - i);
      x.fillStyle = i === 0 ? CSS.faint : v > 0.5 ? CSS.rust : CSS.sage;
      x.fillRect(L + i * bw + bw * 0.2, B - h, bw * 0.6, h);
    });
    if (f > 0) {
      const y2 = B - (B - T) * bars[0] * 2;
      x.setLineDash([5, 4]); x.strokeStyle = CSS.amber; x.lineWidth = 1.6; x.globalAlpha = f; x.beginPath(); x.moveTo(L, y2); x.lineTo(R, y2); x.stroke(); x.setLineDash([]); x.globalAlpha = 1;
      if (f > 0.5) tag(x, '2x background', R - 130, y2 - 14, CSS.amber);
    }
  }
};

function readoutSeed(id) {
  const r = rng(hashStr(id));
  const S = { num: (a, b) => a + (b - a) * S._n, _n: r() };
  S.plate = []; for (let rr = 0; rr < 8; rr++) for (let c = 0; c < 12; c++) S.plate.push(clamp(1 / (1 + Math.exp((c - 5.5 - (r() - 0.5)) * 0.9)) + (r() - 0.5) * 0.12) * (rr > 6 ? 0.2 : 1));
  S.dose = []; for (let i = 0; i < 10; i++) S.dose.push(clamp(0.08 + 0.84 / (1 + Math.exp(((i + 0.5) / 10 - 0.5) * 11)) + (r() - 0.5) * 0.07));
  S.peaks = []; const np = 3 + Math.floor(r() * 4);
  for (let i = 0; i < np; i++) S.peaks.push({ t: 0.12 + 0.76 * (i + r() * 0.6) / np, h: i === 1 ? 0.9 : 0.08 + r() * 0.35, w: 0.008 + r() * 0.012 });
  S.cells = []; for (let i = 0; i < 1400; i++) { const k = r() < 0.45 ? 0 : r() < 0.75 ? 1 : 2; const g = () => (r() + r() + r() - 1.5) / 1.5; const c = k === 0 ? [0.3, 0.68] : k === 1 ? [0.68, 0.26] : [0.5, 0.2]; S.cells.push({ k, x: clamp(c[0] + g() * 0.16), y: clamp(c[1] + g() * 0.16) }); }
  S.cells.sort(() => r() - 0.5);
  S.blobs = []; for (let i = 0; i < 60; i++) S.blobs.push({ x: 0.04 + r() * 0.92, y: 0.06 + r() * 0.88, r: 5 + r() * 7, k: r() < 0.3 ? 1 : 0 });
  S.clusters = []; for (let i = 0; i < 420; i++) S.clusters.push({ x: r(), y: r(), b: Math.floor(r() * 4) });
  S.q = []; for (let i = 0; i < 50; i++) S.q.push(clamp(0.9 - i * 0.006 - r() * 0.12 - (i > 44 ? 0.2 : 0)));
  S.noise = []; for (let i = 0; i < 97; i++) S.noise.push(r());
  S.tms = []; const nt = 2 + Math.floor(r() * 2); for (let i = 0; i < nt; i++) S.tms.push(0.35 + i * 0.16 + r() * 0.06);
  S.pk = { ka: 2 + r() * 3, ke: 0.12 + r() * 0.2 }; S.pk.tmax = Math.log(S.pk.ka / S.pk.ke) / (S.pk.ka - S.pk.ke);
  S.bio = { mid: 0.32 + r() * 0.1, ind: 0.42 + r() * 0.08 };
  S.counts = [0.14]; for (let i = 1; i < 7; i++) S.counts.push(clamp(0.14 + (r() < 0.5 ? i * 0.12 : r() * 0.08)));
  return S;
}

function drawScreen(mon, arch, title, st) {
  const x = mon.canvas.getContext('2d'), W = mon.canvas.width, H = mon.canvas.height;
  screenFrame(x, W, H, title, st.status);
  const L = 70, T = 66, R = W - 26, B = H - 48;
  if (st.data <= 0 && st.fit <= 0) {
    axes(x, L, T, R, B, '', '');
    x.fillStyle = CSS.faint; x.textAlign = 'center'; x.font = `italic 500 22px ${SERIF}`;
    x.fillText(st.idle || 'Awaiting samples', (L + R) / 2, (T + B) / 2);
    x.textAlign = 'left';
  } else {
    READOUTS[arch](x, L, T, R, B, st.data, st.fit, st.seed);
  }
  // footer progress
  x.fillStyle = CSS.paperDeep; x.fillRect(18, H - 22, W - 36, 6);
  x.fillStyle = CSS.sage; x.fillRect(18, H - 22, (W - 36) * clamp(st.bar), 6);
  mon.tex.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Instruments. Each returns { group, dock(), incub()?, focus, animate(s) }
// positions are in rig space (group positioned by caller via place())
// ---------------------------------------------------------------------------
function led(K, x, y, z) { const m = K.own(PAL.sage, { emissive: PAL.sage, ei: 0.3 }); const l = mesh(new THREE.SphereGeometry(0.035, 12, 10), m, x, y, z, false); return l; }
function setLed(l, color, on) { l.material.color.setHex(color); l.material.emissive.setHex(color); l.material.emissiveIntensity = on; }

function makeTray(K, w, d) {
  const t = new THREE.Group();
  t.add(rb(K, w, 0.05, d, PAL.rule, 0, 0, 0, 0.03));
  t.add(bx(K, w * 0.96, 0.03, 0.04, PAL.inkMuted, 0, 0.05, d / 2 - 0.02));
  return t;
}

function makeIncubator(K, w = 1.2, h = 1.5, d = 1.2) {
  const g = new THREE.Group();
  const shell = new THREE.Group(); g.add(shell);
  shell.add(rb(K, w, 0.08, d, PAL.paper2, 0, 0, 0, 0.05));
  shell.add(rb(K, w, 0.08, d, PAL.paper2, 0, h - 0.08, 0, 0.05));
  shell.add(rb(K, 0.07, h, d, PAL.paper2, -w / 2 + 0.035, 0, 0, 0.03));
  shell.add(rb(K, 0.07, h, d, PAL.paper2, w / 2 - 0.035, 0, 0, 0.03));
  shell.add(bx(K, w - 0.1, h - 0.1, 0.05, PAL.paperDeep, 0, 0.05, -d / 2 + 0.03));
  for (const y of [0.42, 0.82, 1.15]) shell.add(bx(K, w - 0.16, 0.025, d - 0.2, PAL.inkFaint, 0, y, 0.02, { metal: 0.5, rough: 0.35 }));
  // control strip
  shell.add(bx(K, w, 0.16, 0.05, PAL.sageDeep, 0, h, d / 2 - 0.1));
  const disp = bx(K, 0.3, 0.08, 0.01, 0x1c2a1c, -0.2, h + 0.04, d / 2 - 0.07, { emissive: PAL.amber, ei: 0.6 }); shell.add(disp);
  const l = led(K, 0.35, h + 0.08, d / 2 - 0.07); shell.add(l);
  // door hinged on the left edge
  const door = new THREE.Group(); door.position.set(-w / 2, 0, d / 2);
  const panel = new THREE.Group(); panel.position.x = w / 2;
  panel.add(mesh(rboxGeo(w, h, 0.07, 0.05), K.mat(PAL.paper2, { rough: 0.45 }), 0, h / 2, 0.035));
  panel.children[0].rotation.x = Math.PI / 2; panel.children[0].geometry = rboxGeo(w, 0.07, h, 0.05);
  panel.add(bx(K, w * 0.62, h * 0.55, 0.012, 0xdfe8e6, 0, h * 0.24, 0.075, { glass: true, opacity: 0.5 }));
  panel.add(rb(K, 0.06, 0.5, 0.06, PAL.inkMuted, w / 2 - 0.12, h * 0.3, 0.1, 0.02, { metal: 0.5, rough: 0.3 }));
  door.add(panel);
  g.add(door);
  return { group: g, door, led: l, shelfY: 0.82 };
}

function instPlateReader(K, a) {
  const g = new THREE.Group();
  g.add(rb(K, 2.0, 0.95, 1.5, PAL.paper2, 0, 0, -0.1, 0.1, { rough: 0.45 }));
  g.add(rb(K, 2.02, 0.08, 1.52, PAL.sage, 0, 0, -0.1, 0.06));
  g.add(rb(K, 1.9, 0.06, 1.4, PAL.paperDeep, 0, 0.95, -0.1, 0.06));
  g.add(bx(K, 1.5, 0.24, 0.02, PAL.ink, -0.15, 0.14, 0.66));
  const lcd = bx(K, 0.42, 0.16, 0.02, 0x1d2a1f, 0.62, 0.64, 0.66, { emissive: PAL.sageTint, ei: 0.35 }); g.add(lcd);
  for (let i = 0; i < 5; i++) g.add(bx(K, 0.02, 0.4, 0.5, PAL.rule, 1.005, 0.3, -0.5 + i * 0.12));
  const l = led(K, 0.88, 0.64, 0.67); g.add(l);
  const tray = makeTray(K, 1.4, 0.95); tray.position.set(-0.15, 0.17, 0); g.add(tray);
  const slit = bx(K, 1.46, 0.015, 0.01, PAL.amber, -0.15, 0.25, 0.67, { emissive: PAL.amber, ei: 0 }); slit.material = K.own(PAL.ink, { emissive: PAL.amber, ei: 0 }); g.add(slit);
  return {
    group: g, focus: new THREE.Vector3(0, 0.5, 0.2),
    dock: () => new THREE.Vector3(tray.position.x, tray.position.y + 0.06, tray.position.z),
    animate(s) {
      const out = s.phase === 'run' ? (s.p < 0.55 ? ease(seg(s.p, 0, 0.2)) : 1 - ease(seg(s.p, 0.55, 0.8))) : 0;
      tray.position.z = -0.2 + out * 1.35;
      const reading = s.phase === 'read';
      slit.material.emissiveIntensity = reading ? 0.6 + 0.4 * Math.sin(s.t * 9) : 0;
      setLed(l, reading ? PAL.amber : s.phase === 'run' ? PAL.sage : PAL.sageDeep, reading || s.phase === 'run' ? 0.9 : 0.25);
    }
  };
}

function instBiosensor(K, a) {
  const g = new THREE.Group();
  g.add(rb(K, 1.9, 1.1, 1.5, PAL.paper2, 0, 0, -0.15, 0.1, { rough: 0.45 }));
  const slope = mesh(rboxGeo(1.9, 0.08, 0.7, 0.05), K.mat(PAL.sageDeep, { rough: 0.5 }), 0, 1.2, 0.2); slope.rotation.x = 0.35; g.add(slope);
  g.add(rb(K, 1.92, 0.08, 1.52, PAL.sage, 0, 0, -0.15, 0.06));
  // smoked sample-hotel window
  g.add(bx(K, 0.95, 0.5, 0.02, 0x3b3a34, -0.38, 0.12, 0.61, { glass: true, opacity: 0.55 }));
  const tray = makeTray(K, 1.4, 0.95); tray.position.set(-0.3, 0.17, -0.2); g.add(tray);
  // sensor-chip port and gold chip
  g.add(bx(K, 0.42, 0.08, 0.02, PAL.ink, 0.55, 0.62, 0.61));
  const chip = new THREE.Group();
  chip.add(rb(K, 0.36, 0.03, 0.5, PAL.inkMuted, 0, 0, 0, 0.02));
  const goldM = K.own(PAL.gold, { metal: 0.8, rough: 0.25, emissive: PAL.gold, ei: 0 });
  const gold = mesh(new THREE.BoxGeometry(0.22, 0.01, 0.2), goldM, 0, 0.035, -0.08); chip.add(gold);
  chip.position.set(0.55, 0.64, 0.6); g.add(chip);
  for (let i = 0; i < 4; i++) { const f = bx(K, 0.04, 0.015, 0.04, PAL.gold, 0.47 + i * 0.055, 0.68, 0.49); g.add(f); }
  const l = led(K, 0.85, 0.95, 0.62); g.add(l);
  return {
    group: g, focus: new THREE.Vector3(0.1, 0.6, 0.2),
    dock: () => new THREE.Vector3(tray.position.x, tray.position.y + 0.06, tray.position.z),
    animate(s) {
      const out = s.phase === 'run' ? (s.p < 0.55 ? ease(seg(s.p, 0, 0.2)) : 1 - ease(seg(s.p, 0.55, 0.8))) : 0;
      tray.position.z = -0.25 + out * 1.4;
      const docked = s.phase === 'read' || s.phase === 'analyse' || (s.phase === 'run' && s.p > 0.3);
      chip.position.z += ((docked ? 0.1 : 0.6) - chip.position.z) * Math.min(1, s.dt * 4);
      goldM.emissiveIntensity = s.phase === 'read' ? 0.35 + 0.25 * Math.sin(s.t * 6) : 0;
      setLed(l, s.phase === 'read' ? PAL.amber : PAL.sage, s.phase === 'read' || s.phase === 'run' ? 0.9 : 0.25);
    }
  };
}

function instLCMS(K, a) {
  const g = new THREE.Group();
  const lx = -0.82;
  const labels = [PAL.sage, PAL.amber, PAL.sageDeep];
  for (let i = 0; i < 3; i++) {
    g.add(rb(K, 0.8, 0.44, 1.2, PAL.paper2, lx, i * 0.46, -0.2, 0.05, { rough: 0.45 }));
    g.add(bx(K, 0.8, 0.04, 0.02, labels[i], lx, i * 0.46 + 0.36, 0.41));
  }
  g.add(bx(K, 0.6, 0.18, 0.02, PAL.ink, lx, 0.56, 0.41));
  const tray = makeTray(K, 0.72, 0.5); tray.position.set(lx, 0.58, -0.25); tray.scale.set(1, 1, 1); g.add(tray);
  // solvent bottles
  for (let i = 0; i < 4; i++) {
    const bxp = lx - 0.27 + i * 0.18;
    g.add(cyl(K, 0.075, 0.075, 0.34, i % 2 ? PAL.amber : 0xe7eeee, bxp, 1.38, -0.3, { transparent: true, opacity: 0.55, rough: 0.2 }, 16));
    g.add(cyl(K, 0.04, 0.04, 0.06, PAL.ink, bxp, 1.72, -0.3, {}, 12));
  }
  // mass spec body
  g.add(rb(K, 1.45, 1.05, 1.45, PAL.paper2, 0.45, 0, -0.2, 0.1, { rough: 0.45 }));
  g.add(rb(K, 1.47, 0.22, 1.47, PAL.sageDeep, 0.45, 0, -0.2, 0.06));
  g.add(bx(K, 1.0, 0.06, 0.02, PAL.amber, 0.45, 0.88, 0.53));
  for (let i = 0; i < 6; i++) g.add(bx(K, 0.02, 0.3, 0.02, PAL.rule, 0.15 + i * 0.12, 0.42, 0.53));
  // ion source
  const src = new THREE.Group(); src.position.set(-0.32, 0.62, 0.2);
  src.add(mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.22, 24), K.mat(PAL.inkMuted, { metal: 0.6, rough: 0.3 }), 0, 0, 0));
  src.children[0].rotation.z = Math.PI / 2;
  const coneM = K.own(PAL.rust, { metal: 0.5, rough: 0.35, emissive: PAL.amber, ei: 0 });
  const cone = mesh(new THREE.ConeGeometry(0.07, 0.18, 20), coneM, -0.18, 0, 0); cone.rotation.z = Math.PI / 2; src.add(cone);
  g.add(src);
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(lx + 0.38, 0.75, 0.3), new THREE.Vector3(lx + 0.45, 0.95, 0.45), new THREE.Vector3(-0.45, 0.85, 0.35), new THREE.Vector3(-0.5, 0.64, 0.2)]);
  g.add(mesh(new THREE.TubeGeometry(curve, 30, 0.012, 6), K.mat(PAL.amber, { rough: 0.3 }), 0, 0, 0, false));
  const l = led(K, 1.0, 0.92, 0.54); g.add(l);
  return {
    group: g, focus: new THREE.Vector3(-0.1, 0.7, 0.2),
    dock: () => new THREE.Vector3(tray.position.x, tray.position.y + 0.06, tray.position.z),
    plateScale: 0.55,
    animate(s) {
      const out = s.phase === 'run' ? (s.p < 0.55 ? ease(seg(s.p, 0, 0.2)) : 1 - ease(seg(s.p, 0.55, 0.8))) : 0;
      tray.position.z = -0.25 + out * 0.95;
      coneM.emissiveIntensity = s.phase === 'read' ? 0.5 + 0.5 * Math.sin(s.t * 14) : s.phase === 'run' ? 0.2 : 0;
      setLed(l, s.phase === 'read' ? PAL.amber : PAL.sage, s.phase === 'read' || s.phase === 'run' ? 0.9 : 0.25);
    }
  };
}

function instFlow(K, a) {
  const g = new THREE.Group();
  g.add(rb(K, 1.6, 0.85, 1.3, PAL.paper2, 0, 0, -0.15, 0.1, { rough: 0.45 }));
  g.add(rb(K, 1.62, 0.07, 1.32, PAL.slate, 0, 0, -0.15, 0.05));
  const lid = mesh(rboxGeo(1.6, 0.07, 0.8, 0.05), K.mat(PAL.sageDeep), 0, 0.92, -0.25); g.add(lid);
  // optics window with lasers
  g.add(bx(K, 0.62, 0.02, 0.42, 0xe7eeee, 0.3, 0.96, -0.25, { glass: true, opacity: 0.4 }));
  const beams = [];
  [PAL.rust, PAL.sage, PAL.amber].forEach((c, i) => {
    const m = K.own(c, { emissive: c, ei: 0.2, transparent: true, opacity: 0.85 });
    const b = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6), m, 0.3, 0.98, -0.25, false);
    b.rotation.z = Math.PI / 2; b.rotation.y = (i - 1) * 0.5; beams.push(b); g.add(b);
  });
  // SIP probe and tube holder
  g.add(cyl(K, 0.012, 0.012, 0.5, PAL.inkFaint, -0.45, 0.25, 0.62, { metal: 0.7, rough: 0.2 }, 8));
  g.add(rb(K, 0.24, 0.05, 0.22, PAL.ink, -0.45, 0.22, 0.62, 0.02));
  const tube = cyl(K, 0.05, 0.035, 0.32, 0xeef2ee, -0.45, 0.27, 0.62, { glass: true, opacity: 0.6 }, 14); g.add(tube);
  // HTS plate loader on the right side
  const tray = makeTray(K, 1.38, 0.93); tray.position.set(0.0, 0.17, 0); g.add(tray);
  g.add(bx(K, 1.45, 0.2, 0.02, PAL.ink, 0.0, 0.12, 0.51));
  // fluidics
  g.add(cyl(K, 0.16, 0.16, 0.62, 0xe7eeee, 1.15, 0, 0.0, { transparent: true, opacity: 0.6, rough: 0.2 }));
  g.add(cyl(K, 0.13, 0.13, 0.5, PAL.amber, 1.15, 0, 0.42, { transparent: true, opacity: 0.6, rough: 0.2 }));
  g.add(cyl(K, 0.06, 0.06, 0.05, PAL.sage, 1.15, 0.62, 0.0)); g.add(cyl(K, 0.05, 0.05, 0.05, PAL.rust, 1.15, 0.5, 0.42));
  const l = led(K, 0.6, 0.6, 0.51); g.add(l);
  return {
    group: g, focus: new THREE.Vector3(0.2, 0.6, 0.2),
    dock: () => new THREE.Vector3(tray.position.x, tray.position.y + 0.06, tray.position.z),
    animate(s) {
      const out = s.phase === 'run' ? (s.p < 0.55 ? ease(seg(s.p, 0, 0.2)) : 1 - ease(seg(s.p, 0.55, 0.8))) : 0;
      tray.position.z = -0.25 + out * 1.4;
      const on = s.phase === 'read' ? 1 : s.phase === 'analyse' ? 0.3 : 0.08;
      beams.forEach((b, i) => { b.material.emissiveIntensity = on * (1.2 + 0.6 * Math.sin(s.t * 12 + i * 2)); });
      setLed(l, s.phase === 'read' ? PAL.amber : PAL.sage, s.phase === 'read' || s.phase === 'run' ? 0.9 : 0.25);
    }
  };
}

function makeMicroscope(K) {
  const g = new THREE.Group();
  g.add(rb(K, 0.85, 0.2, 1.0, PAL.sageDeep, 0, 0, 0, 0.08));
  g.add(rb(K, 0.24, 1.55, 0.26, PAL.paper2, 0, 0.2, -0.36, 0.06));
  g.add(rb(K, 0.24, 0.2, 0.7, PAL.paper2, 0, 1.55, -0.14, 0.06));
  const lampM = K.own(PAL.paper2, { emissive: 0xfff0c8, ei: 0 });
  g.add(mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.2, 20), lampM, 0, 1.48, 0.12));
  g.add(cyl(K, 0.06, 0.07, 0.25, PAL.ink, 0, 1.08, 0.12, {}, 18));
  const stage = rb(K, 0.82, 0.06, 0.62, PAL.ink, 0, 0.78, 0.12, 0.03, { rough: 0.4 }); g.add(stage);
  for (let i = 0; i < 3; i++) { const o = cyl(K, 0.035, 0.05, 0.2, i === 0 ? PAL.amber : PAL.inkFaint, -0.08 + i * 0.08, 0.52, 0.12, { metal: 0.6, rough: 0.3 }, 14); g.add(o); }
  g.add(cyl(K, 0.14, 0.14, 0.08, PAL.inkMuted, 0, 0.46, 0.12, { metal: 0.6 }, 20));
  // eyepieces
  for (const sx of [-0.06, 0.06]) { const e = cyl(K, 0.035, 0.035, 0.32, PAL.ink, sx, 0.0, 0, {}, 12); e.position.set(sx, 0.62, 0.48); e.rotation.x = 0.9; g.add(e); }
  g.add(rb(K, 0.3, 0.16, 0.3, PAL.paper2, 0, 0.42, 0.36, 0.05));
  // light cone
  const coneM = new THREE.MeshBasicMaterial({ color: 0xfff1cf, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.24, 24, 1, true), coneM); cone.position.set(0, 0.95, 0.12); g.add(cone);
  return { group: g, lampM, coneM, stageTop: 0.84 };
}

function instCulture(K, a) {
  const g = new THREE.Group();
  const inc = makeIncubator(K, 1.25, 1.55, 1.25); inc.group.position.set(0.85, 0, -0.45); g.add(inc.group);
  const ms = makeMicroscope(K); ms.group.position.set(-0.62, 0, 0.3); g.add(ms.group);
  return {
    group: g, focus: new THREE.Vector3(0.0, 0.8, 0.0), plateScale: 0.6,
    dock: () => new THREE.Vector3(-0.62, ms.stageTop + 0.005, 0.42),
    incub: () => new THREE.Vector3(0.85, inc.shelfY + 0.03, -0.35),
    animate(s) {
      inc.door.rotation.y += ((s.doorOpen ? -1.7 : 0) - inc.door.rotation.y) * Math.min(1, s.dt * 5);
      const on = s.phase === 'read' ? 1 : s.phase === 'analyse' ? 0.4 : 0;
      ms.lampM.emissiveIntensity = on * 1.2; ms.coneM.opacity = on * (0.35 + 0.1 * Math.sin(s.t * 5));
      setLed(inc.led, s.phase === 'incubate' ? PAL.amber : PAL.sage, s.phase === 'incubate' ? 1 : 0.4);
    }
  };
}

function instSequencing(K, a) {
  const g = new THREE.Group();
  // thermocycler
  const tc = new THREE.Group(); tc.position.set(-0.75, 0, 0.35); g.add(tc);
  tc.add(rb(K, 0.9, 0.48, 1.0, PAL.paper2, 0, 0, 0, 0.08, { rough: 0.45 }));
  tc.add(bx(K, 0.9, 0.06, 0.02, PAL.amber, 0, 0.36, 0.5));
  const tcd = bx(K, 0.32, 0.12, 0.01, 0x1d2a1f, 0, 0.18, 0.505, { emissive: PAL.sageTint, ei: 0.4 }); tc.add(tcd);
  const blockM = K.own(PAL.inkFaint, { metal: 0.7, rough: 0.3, emissive: PAL.amber, ei: 0 });
  tc.add(mesh(new THREE.BoxGeometry(0.7, 0.02, 0.5), blockM, 0, 0.49, 0));
  const lid = new THREE.Group(); lid.position.set(0, 0.6, -0.48);
  lid.add(mesh(rboxGeo(0.88, 0.14, 0.96, 0.06), K.mat(PAL.sageDeep, { rough: 0.5 }), 0, 0.07, 0.48));
  tc.add(lid);
  // sequencer
  const sq = new THREE.Group(); sq.position.set(0.62, 0, -0.25); g.add(sq);
  sq.add(rb(K, 1.35, 1.35, 1.3, PAL.paper2, 0, 0, 0, 0.12, { rough: 0.45 }));
  sq.add(rb(K, 1.37, 0.12, 1.32, PAL.ink, 0, 0, 0, 0.08));
  const touch = mesh(new THREE.BoxGeometry(0.62, 0.42, 0.03), K.mat(0x1d2a1f, { emissive: PAL.sageTint, ei: 0.35 }), 0.25, 1.0, 0.68); touch.rotation.x = -0.25; sq.add(touch);
  sq.add(bx(K, 0.7, 0.08, 0.02, PAL.ink, -0.2, 0.55, 0.655));
  const fc = new THREE.Group(); fc.position.set(-0.2, 0.6, 0.85); sq.add(fc);
  fc.add(rb(K, 0.5, 0.025, 0.3, 0xe7eeee, 0, 0, 0, 0.02, { glass: true, opacity: 0.6 }));
  const lanes = [];
  for (let i = 0; i < 4; i++) { const m = K.own(PAL.sageTint, { emissive: PAL.sage, ei: 0 }); const ln = mesh(new THREE.BoxGeometry(0.42, 0.01, 0.035), m, 0, 0.03, -0.1 + i * 0.065, false); fc.add(ln); lanes.push(ln); }
  const l = led(K, 0.55, 0.6, 0.66); sq.add(l);
  const cols = [0x9fb79a, 0xe0a35c, 0xc97a5c, 0x8ea3b4];
  return {
    group: g, focus: new THREE.Vector3(0, 0.7, 0.2), plateScale: 0.62,
    dock: () => new THREE.Vector3(-0.75, 0.5, 0.35),
    incub: () => new THREE.Vector3(-0.75, 0.5, 0.35),
    animate(s) {
      lid.rotation.x += ((s.doorOpen ? -1.6 : 0) - lid.rotation.x) * Math.min(1, s.dt * 5);
      const heat = s.phase === 'incubate' || s.phase === 'run';
      blockM.emissiveIntensity = heat ? 0.25 + 0.25 * Math.sin(s.t * 3) : 0;
      const inside = s.phase === 'read' || s.phase === 'analyse';
      fc.position.z += ((inside ? 0.55 : 0.85) - fc.position.z) * Math.min(1, s.dt * 3);
      lanes.forEach((ln, i) => { const k = (Math.floor(s.t * 3) + i) % 4; ln.material.emissive.setHex(cols[k]); ln.material.emissiveIntensity = s.phase === 'read' ? 0.9 : 0; });
      setLed(l, s.phase === 'read' ? PAL.amber : PAL.sage, s.phase === 'read' || s.phase === 'run' ? 0.9 : 0.25);
    }
  };
}

function instEphys(K, a) {
  const g = new THREE.Group();
  g.add(rb(K, 1.9, 0.8, 1.5, PAL.paper2, 0, 0, -0.15, 0.1, { rough: 0.45 }));
  g.add(rb(K, 1.92, 0.08, 1.52, PAL.sageDeep, 0, 0.72, -0.15, 0.05));
  // hood: glass with ink frame
  g.add(mesh(new THREE.BoxGeometry(1.8, 0.75, 1.4), K.mat(0xe7eeee, { glass: true, opacity: 0.16 }), 0, 0.8 + 0.375, -0.15, false));
  const fr = K.mat(PAL.ink, { rough: 0.4 });
  for (const sx of [-0.9, 0.9]) for (const sz of [-0.85, 0.55]) g.add(mesh(new THREE.BoxGeometry(0.03, 0.75, 0.03), fr, sx, 1.175, sz, false));
  for (const sz of [-0.85, 0.55]) g.add(mesh(new THREE.BoxGeometry(1.83, 0.03, 0.03), fr, 0, 1.55, sz, false));
  for (const sx of [-0.9, 0.9]) g.add(mesh(new THREE.BoxGeometry(0.03, 0.03, 1.43), fr, sx, 1.55, -0.15, false));
  // QPlate chip with 16 sites
  g.add(rb(K, 0.6, 0.05, 0.42, PAL.ink, 0.45, 0.8, -0.15, 0.03));
  const sites = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) { const m = K.own(PAL.gold, { metal: 0.7, rough: 0.3, emissive: PAL.amber, ei: 0 }); const s = mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.01, 10), m, 0.23 + c * 0.062, 0.855, -0.22 + r * 0.14, false); sites.push(s); g.add(s); }
  // arm
  const arm = new THREE.Group(); arm.position.set(0, 1.45, -0.15); g.add(arm);
  arm.add(mesh(new THREE.BoxGeometry(0.12, 0.08, 1.2), K.mat(PAL.paper2), 0, 0, 0));
  const head = new THREE.Group(); arm.add(head);
  head.add(rb(K, 0.16, 0.22, 0.16, PAL.sage, 0, -0.26, 0, 0.04));
  head.add(cyl(K, 0.008, 0.008, 0.28, PAL.inkFaint, 0, -0.52, 0, { metal: 0.7 }, 8));
  // amplifier
  g.add(rb(K, 0.5, 0.36, 0.8, PAL.ink, 1.25, 0, -0.2, 0.05, { rough: 0.45 }));
  for (let i = 0; i < 3; i++) g.add(cyl(K, 0.04, 0.04, 0.03, PAL.amber, 1.13 + i * 0.12, 0.36, 0.0, {}, 14));
  const trace = bx(K, 0.3, 0.08, 0.01, 0x1d2a1f, 1.25, 0.16, 0.205, { emissive: PAL.sageTint, ei: 0.4 }); g.add(trace);
  const l = led(K, 0.75, 0.55, 0.61); g.add(l);
  return {
    group: g, focus: new THREE.Vector3(0.1, 0.9, 0), plateScale: 0.62,
    dock: () => new THREE.Vector3(-0.45, 0.8, -0.15),
    animate(s) {
      let ax = -0.45;
      if (s.phase === 'run') ax = -0.45 + 0.9 * (0.5 - 0.5 * Math.cos(s.p * Math.PI * 4));
      else if (s.phase === 'read') ax = 0.45 + Math.sin(s.t * 1.6) * 0.2;
      arm.position.x += (ax - arm.position.x) * Math.min(1, s.dt * 4);
      head.position.y = s.phase === 'run' || s.phase === 'read' ? -0.08 * (0.5 + 0.5 * Math.sin(s.t * 4)) : 0;
      const n = s.phase === 'read' ? Math.floor(s.p * 16) + 1 : s.phase === 'analyse' ? 16 : 0;
      sites.forEach((st, i) => { st.material.emissiveIntensity = i < n ? 0.7 : 0; });
      setLed(l, s.phase === 'read' ? PAL.amber : PAL.sage, s.phase === 'read' || s.phase === 'run' ? 0.9 : 0.25);
    }
  };
}

function instThermal(K, a) {
  const g = new THREE.Group();
  g.add(rb(K, 1.7, 0.7, 1.35, PAL.paper2, 0, 0, -0.15, 0.1, { rough: 0.45 }));
  g.add(rb(K, 1.72, 0.14, 1.37, PAL.sageDeep, 0, 0.62, -0.15, 0.06));
  const tray = makeTray(K, 1.38, 0.93); tray.position.set(-0.05, 0.13, 0); g.add(tray);
  g.add(bx(K, 1.45, 0.2, 0.02, PAL.ink, -0.05, 0.08, 0.53));
  // capillary chip on top
  const chip = new THREE.Group(); chip.position.set(0.0, 0.78, 0.1); g.add(chip);
  chip.add(rb(K, 1.2, 0.04, 0.55, PAL.ink, 0, 0, 0, 0.03));
  const caps = [];
  for (let i = 0; i < 24; i++) {
    const m = K.own(PAL.sageTint, { emissive: PAL.rust, ei: 0, transparent: true, opacity: 0.9 });
    const c = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.46, 8), m, -0.55 + i * 0.048, 0.06, 0, false); c.rotation.x = Math.PI / 2; caps.push(c); chip.add(c);
  }
  const bandM = new THREE.MeshBasicMaterial({ color: PAL.rust, transparent: true, opacity: 0, depthWrite: false });
  const band = mesh(new THREE.BoxGeometry(0.06, 0.02, 0.5), bandM, -0.55, 0.09, 0, false); chip.add(band);
  const l = led(K, 0.6, 0.45, 0.53); g.add(l);
  return {
    group: g, focus: new THREE.Vector3(0, 0.6, 0.2),
    dock: () => new THREE.Vector3(tray.position.x, tray.position.y + 0.06, tray.position.z),
    animate(s) {
      const out = s.phase === 'run' ? (s.p < 0.55 ? ease(seg(s.p, 0, 0.2)) : 1 - ease(seg(s.p, 0.55, 0.8))) : 0;
      tray.position.z = -0.25 + out * 1.4;
      const temp = s.phase === 'read' ? s.p : s.phase === 'analyse' ? 1 : 0;
      caps.forEach((c) => { c.material.color.setHex(temp > 0 ? PAL.sageTint : PAL.paper2); c.material.emissiveIntensity = temp * 0.5; c.material.emissive.setHex(temp > 0.6 ? PAL.rust : PAL.amber); });
      bandM.opacity = s.phase === 'read' ? 0.7 : 0; band.position.x = -0.55 + 1.1 * (s.phase === 'read' ? (s.t * 0.6) % 1 : 0);
      setLed(l, s.phase === 'read' ? PAL.rust : PAL.sage, s.phase === 'read' || s.phase === 'run' ? 0.9 : 0.25);
    }
  };
}

function instMicro(K, a, seed) {
  const g = new THREE.Group();
  const inc = makeIncubator(K, 1.15, 1.35, 1.15); inc.group.position.set(0.95, 0, -0.5); g.add(inc.group);
  // colony counter
  const cc = new THREE.Group(); cc.position.set(-0.55, 0, 0.25); g.add(cc);
  cc.add(rb(K, 0.95, 0.3, 0.95, PAL.ink, 0, 0, 0, 0.08, { rough: 0.45 }));
  const lightM = K.own(PAL.paper2, { emissive: 0xfff4dc, ei: 0.1 });
  cc.add(mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.02, 32), lightM, 0, 0.31, 0.05));
  cc.add(rb(K, 0.08, 1.1, 0.08, PAL.paper2, 0, 0.3, -0.4, 0.03));
  cc.add(rb(K, 0.08, 0.06, 0.45, PAL.paper2, 0, 1.36, -0.2, 0.03));
  cc.add(cyl(K, 0.08, 0.1, 0.2, PAL.sageDeep, 0, 1.18, 0.02, {}, 18));
  // petri dishes in front
  const dishes = [];
  const r = rng(seed);
  const colGeo = new THREE.SphereGeometry(0.012, 6, 4);
  for (let i = 0; i < 4; i++) {
    const d = new THREE.Group(); d.position.set(-0.75 + i * 0.5, 0, 1.0); g.add(d);
    d.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 32, 1, true), K.mat(0xeef2ee, { glass: true, opacity: 0.45 }), 0, 0.025, 0, false));
    d.add(cyl(K, 0.21, 0.21, 0.03, 0xd9b77a, 0, 0, 0, { rough: 0.3, transparent: true, opacity: 0.9 }, 32));
    const n = 12 + Math.floor(r() * 50) * (i === 3 ? 2 : 1);
    const im = new THREE.InstancedMesh(colGeo, K.mat(0xf6efdc, { rough: 0.4 }), n);
    const m4 = new THREE.Matrix4();
    for (let k = 0; k < n; k++) { const ang = r() * Math.PI * 2, rad = Math.sqrt(r()) * 0.18; m4.makeTranslation(Math.cos(ang) * rad, 0.034, Math.sin(ang) * rad); im.setMatrixAt(k, m4); }
    im.count = 0; im.userData.max = n; d.add(im); dishes.push(im);
  }
  return {
    group: g, focus: new THREE.Vector3(0.0, 0.6, 0.3), plateScale: 0.62,
    dock: () => new THREE.Vector3(-0.55, 0.33, 0.3),
    incub: () => new THREE.Vector3(0.95, inc.shelfY + 0.03, -0.4),
    animate(s) {
      inc.door.rotation.y += ((s.doorOpen ? -1.7 : 0) - inc.door.rotation.y) * Math.min(1, s.dt * 5);
      const grow = s.phase === 'read' ? s.p : s.phase === 'analyse' ? 1 : s.after ? 1 : 0;
      dishes.forEach((im) => { im.count = Math.floor(im.userData.max * grow); });
      lightM.emissiveIntensity = s.phase === 'read' || s.phase === 'analyse' ? 0.9 : 0.1;
      setLed(inc.led, s.phase === 'incubate' ? PAL.amber : PAL.sage, s.phase === 'incubate' ? 1 : 0.4);
    }
  };
}

// In vivo: IVC cage rack, dosing syringe, blood microtubes, then an LC-MS/MS readout
function makeCage(K) {
  const c = new THREE.Group();
  c.add(rb(K, 0.5, 0.05, 0.7, PAL.sageTint, 0, 0, 0, 0.03, { rough: 0.5 }));
  c.add(bx(K, 0.46, 0.22, 0.66, 0xeef2ee, 0, 0.03, 0, { glass: true, opacity: 0.32 }));
  c.add(bx(K, 0.44, 0.035, 0.64, 0xe2cf9f, 0, 0.04, 0, { rough: 0.95 })); // bedding
  c.add(rb(K, 0.52, 0.05, 0.72, PAL.slate, 0, 0.25, 0, 0.03, { rough: 0.4 })); // filter lid
  c.add(cyl(K, 0.045, 0.045, 0.2, 0xe7eeee, 0.12, 0.3, -0.22, { transparent: true, opacity: 0.6, rough: 0.2 }, 14)); // water bottle
  c.add(bx(K, 0.16, 0.1, 0.01, PAL.paper2, -0.1, 0.1, 0.355)); // cage card
  c.add(bx(K, 0.12, 0.012, 0.012, PAL.inkFaint, -0.1, 0.17, 0.362));
  return c;
}
function makeFish(K) {
  const m = new THREE.Group();
  const body = mesh(new THREE.SphereGeometry(0.02, 12, 8), K.mat(PAL.amber, { rough: 0.4 }), 0, 0.09, 0, false); body.scale.set(0.7, 0.8, 2.6); m.add(body);
  const fin = mesh(new THREE.ConeGeometry(0.018, 0.03, 8), K.mat(PAL.amber, { rough: 0.4 }), 0, 0.09, -0.065, false); fin.rotation.x = -Math.PI / 2; m.add(fin);
  for (const z of [-0.02, 0.01]) m.add(mesh(new THREE.BoxGeometry(0.029, 0.006, 0.012), K.mat(PAL.slate), 0, 0.09, z, false));
  return m;
}
function makeMouse(K) {
  const m = new THREE.Group();
  const bodyM = K.mat(0xf3eee4, { rough: 0.8 });
  const body = mesh(new THREE.SphereGeometry(0.06, 16, 12), bodyM, 0, 0.055, 0); body.scale.set(1, 0.75, 1.55); m.add(body);
  const head = mesh(new THREE.SphereGeometry(0.035, 14, 10), bodyM, 0, 0.065, 0.1); head.scale.set(1, 0.9, 1.3); m.add(head);
  for (const sx of [-0.022, 0.022]) m.add(mesh(new THREE.SphereGeometry(0.014, 10, 8), K.mat(0xe7b9b0, { rough: 0.6 }), sx, 0.098, 0.085));
  for (const sx of [-0.016, 0.016]) m.add(mesh(new THREE.SphereGeometry(0.006, 8, 6), K.mat(PAL.ink), sx, 0.075, 0.13, false));
  const tail = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.04, -0.09), new THREE.Vector3(0.03, 0.025, -0.15), new THREE.Vector3(-0.02, 0.02, -0.21), new THREE.Vector3(0.02, 0.02, -0.26)]);
  m.add(mesh(new THREE.TubeGeometry(tail, 16, 0.006, 5), K.mat(0xe7b9b0, { rough: 0.6 }), 0, 0, 0, false));
  return m;
}
function makeSyringe(K) {
  // origin at the needle tip, barrel pointing up
  const s = new THREE.Group();
  s.add(cyl(K, 0.003, 0.003, 0.14, PAL.inkFaint, 0, 0, 0, { metal: 0.8, rough: 0.2 }, 6));
  s.add(cyl(K, 0.012, 0.02, 0.03, PAL.amber, 0, 0.14, 0, {}, 12));
  s.add(cyl(K, 0.032, 0.032, 0.34, 0xeef2ee, 0, 0.17, 0, { glass: true, opacity: 0.45 }, 18));
  const liqM = K.own(PAL.amber, { rough: 0.3, transparent: true, opacity: 0.85 });
  const liq = mesh(new THREE.CylinderGeometry(0.027, 0.027, 1, 16), liqM, 0, 0, 0, false);
  liq.geometry.translate(0, 0.5, 0); liq.position.y = 0.175; s.add(liq);
  const plunger = new THREE.Group(); s.add(plunger);
  plunger.add(cyl(K, 0.008, 0.008, 0.36, PAL.paper2, 0, 0, 0, {}, 8));
  plunger.add(cyl(K, 0.045, 0.045, 0.015, PAL.paper2, 0, 0.36, 0, {}, 18));
  plunger.add(cyl(K, 0.03, 0.03, 0.02, PAL.ink, 0, -0.01, 0, {}, 16));
  s.add(cyl(K, 0.055, 0.055, 0.014, PAL.paper2, 0, 0.5, 0, {}, 18));
  return { group: s, plunger, liq, top: 0.175, len: 0.31 };
}
function instVivarium(K, a, seed) {
  const g = new THREE.Group();
  // stainless IVC rack, 2 columns x 3 shelves
  const RX = -0.72, cols = [-0.29, 0.29], rows = [0.08, 0.5, 0.92];
  const steel = { metal: 0.6, rough: 0.35 };
  for (const sx of [-0.6, 0.6]) for (const sz of [-0.38, 0.38]) g.add(bx(K, 0.04, 1.36, 0.04, PAL.inkFaint, RX + sx, 0, -0.35 + sz, steel));
  for (const y of rows) g.add(bx(K, 1.24, 0.025, 0.8, PAL.inkFaint, RX, y - 0.03, -0.35, steel));
  g.add(bx(K, 1.24, 0.1, 0.12, PAL.sageDeep, RX, 1.32, -0.7)); // air plenum
  const cages = [];
  for (const y of rows) for (const cx of cols) {
    const c = makeCage(K); c.position.set(RX + cx, y, -0.35); g.add(c); cages.push(c);
  }
  const sp = (a.species || []).map(String);
  const fishOnly = sp.length > 0 && sp.every((k) => k === 'zebrafish');
  const critter = fishOnly ? makeFish : makeMouse;
  if (fishOnly) cages.forEach((c) => { c.children[2].material = K.mat(0xbcd3d6, { transparent: true, opacity: 0.7, rough: 0.1 }); c.children[2].scale.y = 5; c.children[2].position.y = 0.1275; });
  const active = cages[1]; // bottom row, right column slides out
  const activeLid = active.children[3], activeLidZ = activeLid.position.z;
  const mouse = critter(K); mouse.scale.setScalar(1.35); mouse.position.set(-0.08, 0.075, 0.04); mouse.rotation.y = 0.5; active.add(mouse);
  const sib = critter(K); sib.scale.setScalar(1.35); sib.position.set(0.1, 0.075, -0.15); sib.rotation.y = -2.2; active.add(sib);
  for (const ci of [3, 4]) { const mm = critter(K); mm.position.set(0, 0.075, -0.05); mm.rotation.y = ci * 1.3; cages[ci].add(mm); }
  const syr = makeSyringe(K); syr.group.position.set(RX + 0.6, 0.72, 0.5); syr.group.rotation.z = 0.5; g.add(syr.group);
  const synPark = new THREE.Vector3(RX + 0.75, 0.0, 0.55);
  // blood microtube rack (K2EDTA, lavender caps) on the bench
  const rack = new THREE.Group(); rack.position.set(RX - 0.05, 0, 0.62); g.add(rack);
  rack.add(rb(K, 0.9, 0.1, 0.22, PAL.paper2, 0, 0, 0, 0.03));
  const tubes = [];
  for (let i = 0; i < 8; i++) {
    const tx = -0.36 + i * 0.103;
    rack.add(cyl(K, 0.028, 0.022, 0.2, 0xeef2ee, tx, 0.06, 0, { glass: true, opacity: 0.5 }, 12));
    rack.add(cyl(K, 0.033, 0.033, 0.045, 0x9a86b5, tx, 0.26, 0, { rough: 0.5 }, 12));
    const bm = K.own(0x8e1f1a, { rough: 0.35 });
    const b = mesh(new THREE.CylinderGeometry(0.024, 0.02, 1, 12), bm, tx, 0.065, 0, false);
    b.geometry.translate(0, 0.5, 0); b.scale.y = 0.001; b.visible = false; rack.add(b); tubes.push(b);
  }
  // compact LC-MS/MS for plasma bioanalysis
  const MX = 0.62;
  g.add(rb(K, 0.95, 0.92, 1.15, PAL.paper2, MX, 0, -0.25, 0.08, { rough: 0.45 }));
  g.add(rb(K, 0.97, 0.18, 1.17, PAL.sageDeep, MX, 0, -0.25, 0.05));
  g.add(bx(K, 0.7, 0.05, 0.02, PAL.amber, MX, 0.78, 0.33));
  for (let i = 0; i < 5; i++) g.add(bx(K, 0.02, 0.24, 0.02, PAL.rule, MX - 0.2 + i * 0.1, 0.42, 0.33));
  const tray = makeTray(K, 0.72, 0.5); tray.position.set(MX, 0.94, -0.2); g.add(tray);
  const coneM = K.own(PAL.rust, { metal: 0.5, rough: 0.35, emissive: PAL.amber, ei: 0 });
  const cone = mesh(new THREE.ConeGeometry(0.06, 0.16, 18), coneM, MX - 0.52, 0.55, 0.15); cone.rotation.z = Math.PI / 2; g.add(cone);
  const l = led(K, MX + 0.36, 0.86, 0.34); g.add(l);
  const mPos = mouse.position.clone();
  return {
    group: g, focus: new THREE.Vector3(-0.2, 0.55, 0.25), plateScale: 0.55,
    dock: () => new THREE.Vector3(tray.position.x, tray.position.y + 0.06, tray.position.z),
    animate(s) {
      const ph = s.phase, p = s.p;
      // the cage slides out to dose (dispense) and to bleed (run)
      const out = (ph === 'dispense' || ph === 'run') ? Math.min(ease(seg(p, 0, 0.15)), 1 - ease(seg(p, 0.88, 1))) : 0;
      active.position.z = -0.35 + out * 0.55;
      mouse.position.x = mPos.x + Math.sin(s.t * 1.7) * 0.03;
      mouse.rotation.y = 0.5 + Math.sin(s.t * 1.1) * 0.5;
      sib.rotation.y = -2.2 + Math.sin(s.t * 0.7 + 1) * 0.3;
      // dosing syringe: travel to the cage, push the plunger, return
      activeLid.position.z = activeLidZ - out * 0.45;
      const above = new THREE.Vector3(RX + 0.29 + mPos.x, rows[0] + 0.5, active.position.z + mPos.z + 0.06);
      let pos = synPark.clone().add(new THREE.Vector3(0, 0.72, -0.05)), tilt = 0.5, push = 0;
      if (ph === 'dispense') {
        const go = ease(seg(p, 0.15, 0.3)), back = ease(seg(p, 0.8, 0.92));
        const dip = Math.sin(Math.PI * seg(p, 0.3, 0.8)) * 0.3;
        pos.lerp(above, go * (1 - back)); pos.y -= dip * (1 - back);
        tilt = 0.5 * (1 - go * (1 - back));
        push = seg(p, 0.4, 0.7);
      } else push = (s.lastDispIndex ?? -1) >= 0 ? 1 : 0;
      syr.group.position.copy(pos); syr.group.rotation.z = tilt;
      syr.plunger.position.y = syr.top + 0.02 + syr.len * (1 - push);
      syr.liq.scale.y = Math.max(0.001, syr.len * (1 - push)); syr.liq.visible = push < 0.99;
      // serial bleeds fill the tubes left to right during run; full afterwards
      const fill = ph === 'run' ? seg(p, 0.15, 0.88) * 8 : (ph === 'read' || ph === 'analyse' || s.hasRead) ? 8 : 0;
      tubes.forEach((b, i) => { const f = clamp(fill - i); b.visible = f > 0.01; b.scale.y = Math.max(0.001, f * 0.12); });
      coneM.emissiveIntensity = ph === 'read' ? 0.5 + 0.5 * Math.sin(s.t * 14) : 0;
      setLed(l, ph === 'read' ? PAL.amber : PAL.sage, ph === 'read' || ph === 'run' ? 0.9 : 0.25);
    }
  };
}

// Production: stirred-tank fermenter with feed lines, OD/titer controller, and a purification column
function instBioreactor(K, a, seed) {
  const g = new THREE.Group();
  const VX = -0.62, VZ = -0.25, R = 0.3, VH = 0.95, VY = 0.38;
  // controller base with OD / titer display
  g.add(rb(K, 0.95, VY, 0.85, PAL.paper2, VX, 0, VZ, 0.06, { rough: 0.45 }));
  g.add(rb(K, 0.97, 0.06, 0.87, PAL.sage, VX, 0, VZ, 0.04));
  const lcdM = K.own(0x1d2a1f, { emissive: PAL.sageTint, ei: 0.35 });
  g.add(mesh(new THREE.BoxGeometry(0.34, 0.14, 0.02), lcdM, VX - 0.18, 0.2, VZ + 0.43));
  const l = led(K, VX + 0.3, 0.2, VZ + 0.44); g.add(l);
  for (let i = 0; i < 3; i++) g.add(cyl(K, 0.03, 0.03, 0.03, PAL.ink, VX + 0.05 + i * 0.08, 0.17, VZ + 0.43, {}, 12).rotateX(Math.PI / 2));
  // glass vessel, jacket rings, broth
  g.add(mesh(new THREE.CylinderGeometry(R, R, VH, 40, 1, true), K.mat(0xe9f0ee, { glass: true, opacity: 0.3 }), VX, VY + VH / 2, VZ, false));
  for (const y of [VY + 0.04, VY + VH - 0.04]) g.add(mesh(new THREE.TorusGeometry(R + 0.005, 0.02, 8, 40).rotateX(Math.PI / 2), K.mat(PAL.inkFaint, { metal: 0.6, rough: 0.3 }), VX, y, VZ));
  const brothM = K.own(0xe8d9a6, { rough: 0.3, transparent: true, opacity: 0.88 });
  const broth = mesh(new THREE.CylinderGeometry(R - 0.02, R - 0.02, 1, 36), brothM, VX, VY + 0.01, VZ, false);
  broth.geometry.translate(0, 0.5, 0); g.add(broth);
  // headplate, motor, shaft and Rushton impellers
  g.add(cyl(K, R + 0.04, R + 0.04, 0.05, PAL.inkFaint, VX, VY + VH, VZ, { metal: 0.65, rough: 0.3 }, 40));
  g.add(cyl(K, 0.11, 0.11, 0.26, PAL.ink, VX, VY + VH + 0.05, VZ, { rough: 0.4 }, 24));
  g.add(cyl(K, 0.12, 0.12, 0.03, PAL.sageDeep, VX, VY + VH + 0.31, VZ, {}, 24));
  const shaft = new THREE.Group(); shaft.position.set(VX, 0, VZ); g.add(shaft);
  shaft.add(cyl(K, 0.012, 0.012, VH - 0.08, PAL.inkFaint, 0, VY + 0.08, 0, { metal: 0.8, rough: 0.2 }, 8));
  for (const y of [VY + 0.22, VY + 0.55]) {
    shaft.add(cyl(K, 0.08, 0.08, 0.008, PAL.inkFaint, 0, y, 0, { metal: 0.8, rough: 0.2 }, 18));
    for (let b = 0; b < 6; b++) { const bl = bx(K, 0.05, 0.05, 0.006, PAL.inkFaint, 0, y - 0.02, 0, { metal: 0.8, rough: 0.2 }); const an = b / 6 * Math.PI * 2; bl.position.x = Math.cos(an) * 0.095; bl.position.z = Math.sin(an) * 0.095; bl.rotation.y = -an; shaft.add(bl); }
  }
  // headplate ports + probes
  for (const [px, pz, h] of [[0.17, 0.08, 0.6], [-0.15, 0.12, 0.5], [0.05, -0.18, 0.7]]) g.add(cyl(K, 0.014, 0.014, h, PAL.ink, VX + px, VY + VH + 0.05 - h + 0.12, VZ + pz, {}, 8));
  // sparger bubbles
  const bubM = K.mat(0xffffff, { transparent: true, opacity: 0.55, rough: 0.1 });
  const bubGeo = new THREE.SphereGeometry(0.014, 8, 6);
  const r = rng(seed);
  const bubbles = [];
  for (let i = 0; i < 26; i++) { const b = mesh(bubGeo, bubM, 0, 0, 0, false); b.userData = { a: r() * Math.PI * 2, rad: 0.04 + r() * 0.2, o: r(), sp: 0.5 + r() * 0.6 }; g.add(b); bubbles.push(b); }
  // feed and base bottles with a peristaltic pump and lines to the headplate
  const BX = VX - 0.62;
  const feeds = [PAL.amber, 0xe7eeee, PAL.sageTint];
  feeds.forEach((c, i) => {
    const bz = VZ - 0.25 + i * 0.25;
    g.add(cyl(K, 0.075, 0.075, 0.3, c, BX, 0, bz, { transparent: true, opacity: 0.7, rough: 0.2 }, 16));
    g.add(cyl(K, 0.04, 0.04, 0.05, PAL.ink, BX, 0.3, bz, {}, 12));
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(BX, 0.35, bz), new THREE.Vector3(BX + 0.02, 0.7 + i * 0.05, bz), new THREE.Vector3(VX - 0.25, VY + VH + 0.25 + i * 0.03, VZ - 0.1 + i * 0.08), new THREE.Vector3(VX - 0.18 + i * 0.05, VY + VH + 0.05, VZ - 0.08 + i * 0.08)]);
    g.add(mesh(new THREE.TubeGeometry(curve, 28, 0.01, 6), K.mat(i === 0 ? PAL.amber : PAL.rule, { rough: 0.3 }), 0, 0, 0, false));
  });
  const pump = new THREE.Group(); pump.position.set(BX + 0.05, 0.42, VZ + 0.32); g.add(pump);
  pump.add(rb(K, 0.24, 0.2, 0.18, PAL.sageDeep, 0, 0, 0, 0.03));
  const rotor = new THREE.Group(); rotor.position.set(0, 0.11, 0.095); pump.add(rotor);
  rotor.add(mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.02, 20).rotateX(Math.PI / 2), K.mat(PAL.paper2), 0, 0, 0));
  for (let i = 0; i < 3; i++) { const an = i / 3 * Math.PI * 2; rotor.add(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.03, 10).rotateX(Math.PI / 2), K.mat(PAL.inkMuted, { metal: 0.5 }), Math.cos(an) * 0.04, Math.sin(an) * 0.04, 0.01)); }
  // purification: chromatography system with a column and fraction tray dock
  const CX = 0.68;
  g.add(rb(K, 1.0, 0.62, 1.05, PAL.paper2, CX, 0, -0.25, 0.08, { rough: 0.45 }));
  g.add(rb(K, 1.02, 0.1, 1.07, PAL.sageDeep, CX, 0.52, -0.25, 0.05));
  g.add(bx(K, 0.82, 0.18, 0.02, PAL.ink, CX, 0.08, 0.28));
  const tray = makeTray(K, 0.75, 0.55); tray.position.set(CX, 0.13, -0.2); g.add(tray);
  const colX = CX - 0.18, colZ = 0.05, colY = 0.62, colH = 0.78;
  g.add(rb(K, 0.06, colH + 0.12, 0.06, PAL.inkMuted, CX + 0.08, colY, colZ - 0.06, 0.02, { metal: 0.5 }));
  g.add(mesh(new THREE.CylinderGeometry(0.065, 0.065, colH, 24, 1, true), K.mat(0xe9f0ee, { glass: true, opacity: 0.4 }), colX, colY + colH / 2, colZ, false));
  g.add(cyl(K, 0.055, 0.055, colH * 0.8, 0xf1ead8, colX, colY + 0.06, colZ, { rough: 0.9 }, 20)); // resin bed
  for (const y of [colY, colY + colH - 0.04]) g.add(cyl(K, 0.075, 0.075, 0.04, PAL.ink, colX, y, colZ, {}, 20));
  const bandM = K.own(PAL.rust, { rough: 0.4, emissive: PAL.rust, ei: 0.1, transparent: true, opacity: 0.95 });
  const band = mesh(new THREE.CylinderGeometry(0.057, 0.057, 0.07, 20), bandM, colX, 0, colZ, false); g.add(band);
  const colCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(colX, colY + colH + 0.02, colZ), new THREE.Vector3(colX + 0.05, colY + colH + 0.15, colZ), new THREE.Vector3(CX + 0.3, colY + colH, colZ - 0.2), new THREE.Vector3(CX + 0.3, 0.62, colZ - 0.3)]);
  g.add(mesh(new THREE.TubeGeometry(colCurve, 20, 0.008, 6), K.mat(PAL.rule, { rough: 0.3 }), 0, 0, 0, false));
  const uv = led(K, CX + 0.35, 0.3, 0.29); g.add(uv);
  let spin = 0;
  return {
    group: g, focus: new THREE.Vector3(-0.1, 0.75, 0.1), plateScale: 0.58,
    dock: () => new THREE.Vector3(tray.position.x, tray.position.y + 0.06, tray.position.z),
    animate(s) {
      const ph = s.phase, p = s.p;
      tray.position.z = -0.2 + (ph === 'run' ? (p < 0.55 ? ease(seg(p, 0, 0.2)) : 1 - ease(seg(p, 0.55, 0.8))) : 0) * 0.85;
      const ferment = ph === 'incubate';
      const grown = ferment ? p : (ph === 'run' || ph === 'read' || ph === 'analyse' || s.hasRead) ? 1 : 0;
      spin += s.dt * (ferment ? 9 : 2.5); shaft.rotation.y = spin; rotor.rotation.z = -spin * (ferment ? 0.6 : 0.15);
      broth.scale.y = (VH - 0.18) * (0.62 + 0.18 * grown);
      brothM.color.setHex(0xe8d9a6).lerp(new THREE.Color(0xb88a3e), grown);
      const top = VY + 0.01 + broth.scale.y;
      bubbles.forEach((b) => {
        const u = ((s.t * b.userData.sp * 0.35 + b.userData.o) % 1);
        b.visible = ferment || grown > 0;
        const ang = b.userData.a + u * 2 + spin * 0.05;
        b.position.set(VX + Math.cos(ang) * b.userData.rad, VY + 0.05 + u * (top - VY - 0.08), VZ + Math.sin(ang) * b.userData.rad);
      });
      lcdM.emissiveIntensity = ferment ? 0.5 + 0.2 * Math.sin(s.t * 3) : 0.35;
      setLed(l, ferment ? PAL.amber : PAL.sage, ferment ? 1 : 0.35);
      // capture: the product band loads at the top of the column, then elutes down during read
      const bandU = ph === 'read' ? p : ph === 'analyse' ? 1 : 0;
      band.visible = ph === 'run' ? p > 0.35 : ph === 'read' || ph === 'analyse';
      band.position.y = colY + 0.06 + colH * 0.74 - bandU * colH * 0.68;
      bandM.opacity = ph === 'analyse' ? 0.3 : 0.95;
      setLed(uv, ph === 'read' ? PAL.amber : PAL.sage, ph === 'read' || ph === 'run' ? 0.9 : 0.25);
    }
  };
}

const INSTRUMENTS = { vivarium: instVivarium, bioreactor: instBioreactor, plate: instPlateReader, biosensor: instBiosensor, lcms: instLCMS, flow: instFlow, culture: instCulture, sequencing: instSequencing, ephys: instEphys, thermal: instThermal, micro: instMicro };

function makeTimerRing(K) {
  const g = new THREE.Group();
  const segs = [];
  for (let i = 0; i < 24; i++) {
    const m = K.own(PAL.rule, { emissive: PAL.amber, ei: 0 });
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.13, 0.03), m);
    const a = -i / 24 * Math.PI * 2;
    s.position.set(Math.sin(-a) * 0.3, Math.cos(a) * 0.3, 0); s.rotation.z = a;
    g.add(s); segs.push(s);
  }
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.22, 0.02), K.own(PAL.ink)); hand.geometry.translate(0, 0.11, 0); g.add(hand);
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16).rotateX(Math.PI / 2), K.own(PAL.ink)));
  return { group: g, segs, hand };
}

// ---------------------------------------------------------------------------
// Rig: instrument + plate + props, driven by (phase, p)
// ---------------------------------------------------------------------------
const REAGENTS = ['#c67b2e', '#5c6f5a', '#a3502e', '#4f6475', '#b98d5a'];

function createRig(assay, opts = {}) {
  const K = makeKit();
  const compact = !!opts.compact;
  const arch = opts.archetype || archetypeOf(assay);
  const seed = hashStr(assay.id || assay.name || 'x');
  const root = new THREE.Group();
  const title = (assay.instruments && assay.instruments[0] ? assay.instruments[0].name : ARCHETYPES[arch]);
  const auto = (assay.automation || '').toLowerCase();
  const hasGantry = !compact && (arch === 'sequencing' || (arch === 'lcms' && /liquid handler|hamilton|tecan|bravo|biomek/.test(auto)));

  const L = compact
    ? { plate: new THREE.Vector3(-1.0, 0, 0.55), inst: new THREE.Vector3(0.9, 0, -0.1), mon: new THREE.Vector3(-1.05, 0, -0.75), pipPark: new THREE.Vector3(-1.75, 0.95, 0.2), tip: null, res: new THREE.Vector3(-1.9, 0, 0.55) }
    : { plate: new THREE.Vector3(0.05, 0, 0.62), inst: new THREE.Vector3(2.75, 0, -0.05), mon: new THREE.Vector3(0.15, 0, -1.05), pipPark: new THREE.Vector3(-1.95, 0.75, -1.0), tip: new THREE.Vector3(-2.35, 0, 0.62), res: new THREE.Vector3(-1.15, 0, 0.62) };

  if (!compact) {
    root.add(makeWorkbench(K));
    const rack = makeTubeRack(K); rack.position.set(-3.75, 0, 0.75); rack.rotation.y = 0.2; root.add(rack);
    const b1 = makeBeaker(K, 0.26, 0.62, PAL.amber, 0.55); b1.position.set(-3.85, 0, -0.85); root.add(b1);
    const b2 = makeBeaker(K, 0.19, 0.46, PAL.sageTint, 0.4); b2.position.set(-3.3, 0, -1.05); root.add(b2);
    const b3 = makeBeaker(K, 0.15, 0.36, 0xd9c7a3, 0.65); b3.position.set(-3.25, 0, -0.5); root.add(b3);
    // pipette stand
    const stand = new THREE.Group(); stand.position.set(-1.95, 0, -1.0);
    stand.add(rb(K, 0.5, 0.05, 0.4, PAL.ink, 0, 0, 0, 0.03));
    stand.add(rb(K, 0.06, 1.2, 0.06, PAL.inkMuted, 0, 0.05, -0.12, 0.02, { metal: 0.5 }));
    root.add(stand);
  }
  const tipbox = L.tip ? makeTipBox(K) : null;
  if (tipbox) { tipbox.group.position.copy(L.tip); root.add(tipbox.group); }
  const res = makeReservoir(K); res.group.position.copy(L.res); root.add(res.group);

  const inst = INSTRUMENTS[arch](K, assay, seed);
  inst.group.position.copy(L.inst); root.add(inst.group);
  const toRoot = (v) => v.clone().add(inst.group.position);

  const plate = makePlate(K); plate.group.position.copy(L.plate); root.add(plate.group);
  const pip = makePipette(K); pip.group.position.copy(L.pipPark); root.add(pip.group);
  const mon = makeMonitor(K, compact ? 1.25 : 1.5); mon.group.position.copy(L.mon); mon.group.rotation.y = compact ? 0.35 : 0.08; root.add(mon.group);
  const gantry = hasGantry ? makeGantry(K, -3.0, 0.85) : null;
  if (gantry) root.add(gantry.group);
  const timer = compact ? null : makeTimerRing(K);
  if (timer) { timer.group.visible = false; root.add(timer.group); }

  root.traverse((o) => { if (o.isMesh && compact) { o.castShadow = true; } });

  // well colours for the current step
  const sd = readoutSeed(assay.id || 'x');
  const tmpC = new THREE.Color(), cA = new THREE.Color(), cB = new THREE.Color();
  let lastWellKey = '';
  function setWells(prevIdx, curIdx, cols) {
    const key = prevIdx + '|' + curIdx + '|' + cols;
    if (key === lastWellKey) return; lastWellKey = key;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 12; c++) {
      const useCur = curIdx >= 0 && c < cols;
      const idx = useCur ? curIdx : prevIdx;
      if (idx < 0) tmpC.copy(plate.empty);
      else {
        cA.set(REAGENTS[idx % REAGENTS.length]); cB.set(CSS.paper2);
        tmpC.copy(cA).lerp(cB, (c / 11) * 0.55 * (idx % 2 ? 0.6 : 1));
      }
      plate.wells.setColorAt(r * 12 + c, tmpC);
    }
    plate.wells.instanceColor.needsUpdate = true;
  }

  // plate mover with arc
  const mover = { key: 'bench', prev: 'bench', from: plate.group.position.clone(), t0: -10, dur: 1.1 };
  function plateTarget(key) {
    if (key === 'dock') return toRoot(inst.dock());
    if (key === 'incub' && inst.incub) return toRoot(inst.incub());
    return L.plate.clone();
  }
  function plateScaleFor(key) { return key === 'bench' ? 1 : (inst.plateScale || 1); }

  let screenKey = '';
  const state = { phase: 'dispense', p: 0, t: 0, dt: 0, doorOpen: false, after: false };

  function pipPath(p, out) {
    // returns world-space tip position for the hand pipette during dispense
    const up = 0.7;
    const T = L.tip ? L.tip.clone().add(new THREE.Vector3(0, 0.62, 0)) : null;
    const R = L.res.clone().add(new THREE.Vector3(0, 0.2, 0));
    const P0 = plateTarget('bench').add(new THREE.Vector3(-0.495, 0.2, 0));
    const pts = [];
    const park = L.pipPark;
    let pos;
    const lerp3 = (a, b, u) => a.clone().lerp(b, ease(u));
    const lift = (v, h) => v.clone().add(new THREE.Vector3(0, h, 0));
    if (T) {
      if (p < 0.12) pos = lerp3(park, lift(T, up), seg(p, 0, 0.12));
      else if (p < 0.2) pos = lift(T, up * (1 - Math.sin(seg(p, 0.12, 0.2) * Math.PI)));
      else if (p < 0.32) pos = lerp3(lift(T, up), lift(R, up), seg(p, 0.2, 0.32));
      else if (p < 0.4) pos = lift(R, up * (1 - Math.sin(seg(p, 0.32, 0.4) * Math.PI)));
      else if (p < 0.5) pos = lerp3(lift(R, up), lift(P0, 0.25), seg(p, 0.4, 0.5));
      else if (p < 0.95) { const u = seg(p, 0.5, 0.95) * 12; const c = Math.min(11, Math.floor(u)); const f = u - c; pos = lift(P0.clone().add(new THREE.Vector3(c * 0.09, 0, 0)), 0.25 - 0.22 * Math.sin(Math.min(1, f * 1.4) * Math.PI)); }
      else pos = lerp3(lift(P0.clone().add(new THREE.Vector3(11 * 0.09, 0, 0)), 0.25), park, seg(p, 0.95, 1));
    } else {
      if (p < 0.2) pos = lerp3(park, lift(R, up), seg(p, 0, 0.2));
      else if (p < 0.35) pos = lift(R, up * (1 - Math.sin(seg(p, 0.2, 0.35) * Math.PI)));
      else if (p < 0.5) pos = lerp3(lift(R, up), lift(P0, 0.25), seg(p, 0.35, 0.5));
      else if (p < 0.95) { const u = seg(p, 0.5, 0.95) * 12; const c = Math.min(11, Math.floor(u)); const f = u - c; pos = lift(P0.clone().add(new THREE.Vector3(c * 0.09, 0, 0)), 0.25 - 0.22 * Math.sin(Math.min(1, f * 1.4) * Math.PI)); }
      else pos = lerp3(lift(P0.clone().add(new THREE.Vector3(11 * 0.09, 0, 0)), 0.25), park, seg(p, 0.95, 1));
    }
    out.copy(pos);
    return { tips: T ? p >= 0.16 && p < 0.97 : p > 0.05 && p < 0.97, loaded: p >= (T ? 0.36 : 0.3) && p < 0.94, cols: Math.floor(seg(p, 0.5, 0.95) * 12 + (p >= 0.95 ? 1 : 0)) };
  }

  const tmpV = new THREE.Vector3();
  function update(s) {
    Object.assign(state, s);
    const { phase, p, t, dt } = state;
    // plate location
    let key = 'bench';
    if (phase === 'incubate' && inst.incub) key = 'incub';
    else if (phase === 'run' || phase === 'read' || phase === 'analyse') key = (phase === 'run' && p < 0.12 && mover.key === 'bench') ? 'bench' : 'dock';
    if (key !== mover.key) { mover.prev = mover.key; mover.from.copy(plate.group.position); mover.fromS = plate.group.scale.x; mover.key = key; mover.t0 = t; }
    if (state.instant) mover.t0 = t - mover.dur - 1;
    const u = clamp((t - mover.t0) / mover.dur);
    const tgt = plateTarget(key);
    const e = ease(u);
    plate.group.position.copy(mover.from).lerp(tgt, e);
    plate.group.position.y += Math.sin(Math.PI * u) * 0.9;
    const s1 = plateScaleFor(key), s0 = mover.fromS ?? 1;
    plate.group.scale.setScalar(s0 + (s1 - s0) * e);
    state.doorOpen = u < 1 && (mover.key === 'incub' || mover.prev === 'incub') && mover.from.distanceTo(tgt) > 0.05;
    plate.lid.visible = phase === 'incubate';

    // wells
    const dIdx = s.dispIndex ?? -1;
    let cols = 0;
    // pipette or gantry
    if (phase === 'dispense') {
      const info = pipPath(p, tmpV);
      cols = info.cols;
      if (gantry) {
        gantry.beam.position.z = tmpV.z;
        gantry.head.position.x = tmpV.x;
        gantry.ch.position.y = tmpV.y - (gantry.H + 0.05 - 1.07);
        gantry.tips.visible = info.tips;
        pip.group.position.lerp(L.pipPark, Math.min(1, dt * 4));
        pip.tips.visible = false; pip.liquid.visible = false;
      } else {
        pip.group.position.copy(tmpV);
        pip.tips.visible = info.tips; pip.liquid.visible = info.loaded;
        pip.liqMat.color.set(REAGENTS[Math.max(0, dIdx) % REAGENTS.length]);
      }
      res.liq.material.color.set(REAGENTS[Math.max(0, dIdx) % REAGENTS.length]);
      setWells(s.prevDispIndex ?? -1, dIdx, cols);
    } else {
      if (state.instant) pip.group.position.copy(L.pipPark); else pip.group.position.lerp(L.pipPark, Math.min(1, dt * 3));
      pip.tips.visible = false; pip.liquid.visible = false;
      if (gantry) { gantry.beam.position.z += (gantry.zb + 0.15 - gantry.beam.position.z) * Math.min(1, dt * 2); gantry.head.position.x += (gantry.x0 + 0.6 - gantry.head.position.x) * Math.min(1, dt * 2); gantry.ch.position.y += (0 - gantry.ch.position.y) * Math.min(1, dt * 3); gantry.tips.visible = false; }
      const li = s.lastDispIndex ?? -1;
      setWells(li >= 0 ? li : (phase === 'incubate' ? -1 : 0), -1, 0);
    }
    pip.group.rotation.z = phase === 'dispense' ? Math.sin(t * 2) * 0.02 : 0;

    // timer ring
    if (timer) {
      const show = phase === 'incubate';
      timer.group.visible = show;
      if (show) {
        const base = key === 'incub' ? toRoot(inst.incub()).add(new THREE.Vector3(0, 1.25, 0.7)) : L.plate.clone().add(new THREE.Vector3(0, 1.1, 0));
        timer.group.position.copy(base);
        const n = Math.floor(p * 24 + 0.0001);
        timer.segs.forEach((sg, i) => { sg.material.emissiveIntensity = i < n ? 0.9 : 0; sg.material.color.setHex(i < n ? PAL.amber : PAL.rule); });
        timer.hand.rotation.z = -p * Math.PI * 2;
        if (s.camera) timer.group.quaternion.copy(s.camera.quaternion);
      }
    }

    inst.animate(state);

    // screen
    const ph = phase;
    let data = 0, fit = 0, status = PHASE_LABEL[ph], idle;
    if (ph === 'read') { data = p; status = 'Reading ' + Math.round(p * 100) + '%'; }
    else if (ph === 'analyse') { data = 1; fit = clamp(p * 1.4); status = 'Analysis'; }
    else if (s.hasRead) { data = 1; fit = 0; }
    if (ph === 'dispense') idle = 'Preparing plate';
    if (ph === 'incubate') idle = 'Incubating  ' + Math.round(p * 100) + '%';
    if (ph === 'run') { idle = 'Loading and running'; status = 'Run'; }
    const q = Math.round(p * 90);
    const sk = ph + '|' + q + '|' + (s.hasRead ? 1 : 0) + '|' + Math.floor(t * 3) * (arch === 'sequencing' && ph === 'read' ? 1 : 0);
    if (sk !== screenKey) {
      screenKey = sk;
      drawScreen(mon, arch, title, { data, fit, status, idle, seed: sd, bar: s.bar ?? p });
    }
  }

  const focus = {
    dispense: L.plate.clone().lerp(L.res, 0.45).add(new THREE.Vector3(0, 0.5, 0)),
    incubate: inst.incub ? toRoot(inst.incub()).add(new THREE.Vector3(0, 0.3, 0)) : L.plate.clone().add(new THREE.Vector3(0, 0.6, 0)),
    run: toRoot(inst.focus).lerp(L.plate, 0.25),
    read: toRoot(inst.focus),
    analyse: L.mon.clone().add(new THREE.Vector3(0, 0.95, 0)).lerp(toRoot(inst.focus), 0.25)
  };

  function dispose() {
    const seen = new Set();
    root.traverse((o) => {
      if (o.geometry && !o.geometry.userData.shared && !seen.has(o.geometry)) { seen.add(o.geometry); o.geometry.dispose(); }
      const ms = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of ms) { if (seen.has(m)) continue; seen.add(m); if (m.map) m.map.dispose(); m.dispose(); }
    });
    mon.tex.dispose();
  }

  // initial screen
  drawScreen(mon, arch, title, { data: 0, fit: 0, status: 'Ready', idle: 'Awaiting samples', seed: sd, bar: 0 });

  return { group: root, arch, title, update, focus, dispose, hasGantry, L };
}

function rawPlan(assay) {
  const steps = (assay.steps && assay.steps.length) ? assay.steps : ['Prepare samples', 'Run the instrument', 'Read the signal', 'Analyse the data'];
  const n = steps.length;
  let disp = -1, hasRead = false;
  return steps.map((text, i) => {
    const phase = phaseOf(text, i, n);
    const prevDisp = disp;
    if (phase === 'dispense') disp += 1;
    const item = { text, phase, dispIndex: phase === 'dispense' ? disp : -1, prevDispIndex: prevDisp, lastDispIndex: disp, hasRead };
    if (phase === 'read') hasRead = true;
    return item;
  });
}
const READ_HINT = /record|measur|detect|signal|sensorgram|acquir|imag|scan|fluoresc|lumines|absorb|count|readout|spectr|trace|chromatogram|sequenc/;
function stepPlan(assay) {
  const plan = rawPlan(assay);
  if (!plan.some((s) => s.phase === 'read')) {
    let k = -1;
    plan.forEach((s, i) => { if (s.phase !== 'analyse' && READ_HINT.test(s.text.toLowerCase())) k = i; });
    if (k < 0) { const fa = plan.findIndex((s) => s.phase === 'analyse'); k = fa > 0 ? fa - 1 : plan.length > 1 ? plan.length - 2 : -1; }
    if (k >= 0 && plan[k].phase !== 'dispense') plan[k].phase = 'read';
    else if (k >= 0) { const r = plan.findIndex((s, i) => i > k && s.phase !== 'analyse'); if (r >= 0) plan[r].phase = 'read'; }
    // recompute dependent flags
    let disp = -1, hasRead = false;
    plan.forEach((s) => { s.prevDispIndex = disp; if (s.phase === 'dispense') { disp += 1; s.dispIndex = disp; } else s.dispIndex = -1; s.lastDispIndex = disp; s.hasRead = hasRead; if (s.phase === 'read') hasRead = true; });
  }
  return plan;
}

// ---------------------------------------------------------------------------
// Compact rig for the book (no bench, loops through phases)
// ---------------------------------------------------------------------------
export function buildRig(assay, opts = {}) {
  const rig = createRig(assay, { compact: true });
  const g = new THREE.Group();
  g.add(rig.group);
  const plan = stepPlan(assay);
  const loop = PHASES.map((ph) => plan.find((s) => s.phase === ph) || { phase: ph, dispIndex: ph === 'dispense' ? 0 : -1, prevDispIndex: -1, lastDispIndex: 0 });
  let t = 0, k = 0, pt = 0;
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  rig.group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  function update(dt) {
    t += dt;
    if (!reduce) { pt += dt; const d = PHASE_DUR[loop[k].phase] * 0.8; if (pt > d) { pt = 0; k = (k + 1) % loop.length; } }
    const st = loop[reduce ? 3 : k];
    const p = reduce ? 1 : clamp(pt / (PHASE_DUR[st.phase] * 0.8));
    rig.update({ phase: st.phase, p, t, dt, dispIndex: Math.max(0, st.dispIndex), prevDispIndex: -1, lastDispIndex: 0, hasRead: k > 3 || st.phase === 'analyse', index: k, instant: reduce });
  }
  update(0);
  return { group: g, arch: rig.arch, update, dispose: rig.dispose };
}

// ---------------------------------------------------------------------------
// Full bench
// ---------------------------------------------------------------------------
const ICON = {
  prev: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><path d="M6.5 4.2v11.6L15.8 10z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><rect x="5.5" y="4.5" width="3" height="11" rx="1" fill="currentColor"/><rect x="11.5" y="4.5" width="3" height="11" rx="1" fill="currentColor"/></svg>'
};
function escHTML(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
}

export function mountBench(el, assay, opts = {}) {
  const plan = stepPlan(assay);
  const n = plan.length;
  const reduce = opts.reducedMotion ?? (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const instName = (assay.instruments && assay.instruments[0] && assay.instruments[0].name) || 'Bench instrument';
  const vendor = (assay.instruments && assay.instruments[0] && assay.instruments[0].vendor) || '';
  const arch = archetypeOf(assay);

  const wrap = document.createElement('div');
  wrap.className = 'bench';
  wrap.dataset.archetype = arch;
  wrap.innerHTML = `
    <div class="bench-stage">
      <div class="bench-tag"><span class="bench-tag-k">${escHTML(ARCHETYPES[arch])}</span><span class="bench-tag-v">${escHTML(instName)}</span>${vendor ? `<span class="bench-tag-s">${escHTML(vendor)}</span>` : ''}</div>
      <ol class="bench-rail" aria-hidden="true">${PHASES.map((p) => `<li data-phase="${p}"><span></span>${PHASE_LABEL[p]}</li>`).join('')}</ol>
      <span class="bench-hint">Drag to orbit</span>
    </div>
    <div class="bench-bar">
      <div class="bench-controls" role="group" aria-label="Protocol playback">
        <button type="button" class="bench-btn bench-prev" aria-label="Previous step">${ICON.prev}</button>
        <button type="button" class="bench-btn bench-play" aria-label="Play">${ICON.play}</button>
        <button type="button" class="bench-btn bench-next" aria-label="Next step">${ICON.next}</button>
      </div>
      <p class="bench-caption" aria-live="polite"></p>
      <div class="bench-progress" aria-hidden="true">${plan.map(() => '<span><i></i></span>').join('')}</div>
    </div>`;
  el.appendChild(wrap);
  const stage = wrap.querySelector('.bench-stage');
  const caption = wrap.querySelector('.bench-caption');
  const playBtn = wrap.querySelector('.bench-play');
  const segs = [...wrap.querySelectorAll('.bench-progress > span')];
  const rail = [...wrap.querySelectorAll('.bench-rail li')];

  const st = { index: 0, p: 0, playing: !reduce, visible: true, t: 0, disposed: false };
  const list = opts.protocolList || null;
  const lis = list ? [...list.querySelectorAll('li')] : [];
  const cleanups = [];

  // ---- 3D ----
  let renderer = null, scene, camera, rig, raf = 0, clock;
  const gl = webglOK();
  if (gl) {
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch (e) { renderer = null; }
  }
  if (!renderer) {
    stage.classList.add('is-fallback');
    const fb = document.createElement('div');
    fb.className = 'bench-fallback';
    fb.innerHTML = `<b>The live bench needs WebGL.</b><span>Your browser has it switched off, so the steps below play as a list instead.</span>`;
    stage.appendChild(fb);
    st.playing = false;
  } else {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'bench-canvas';
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', `3D lab bench showing ${instName} running the ${assay.name} protocol`);
    stage.prepend(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight(0xfff6e8, 0xb7a68a, 1.05));
    const sun = new THREE.DirectionalLight(0xfff0dc, 2.2);
    sun.position.set(4, 9, 6); sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    Object.assign(sun.shadow.camera, { left: -6.5, right: 6.5, top: 5, bottom: -5, near: 1, far: 30 });
    sun.shadow.radius = 4; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xdfe4d8, 0.5); fill.position.set(-6, 4, 3); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.13 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2.4; floor.receiveShadow = true; scene.add(floor);

    rig = createRig(assay, {});
    scene.add(rig.group);
    clock = new THREE.Clock();
  }

  // ---- camera orbit ----
  const cam = { az: 0.18, el: 0.5, r: 10.5, target: new THREE.Vector3(0, 0.6, 0), uaz: 0, uel: 0, cur: null };
  const CAM = { dispense: [-0.14, 0.5, 9.6], incubate: [0.1, 0.46, 9.8], run: [0.26, 0.44, 9.8], read: [0.34, 0.4, 8.8], analyse: [0.04, 0.3, 7.4] };
  function camGoal() {
    const ph = plan[st.index].phase;
    const [az, elv, r] = CAM[ph];
    const aspect = stage.clientWidth / Math.max(1, stage.clientHeight);
    const k = Math.max(1, 1.35 / aspect);
    const tgt = rig ? rig.focus[ph].clone() : new THREE.Vector3();
    // pull the target back toward bench centre on narrow screens
    if (k > 1) tgt.lerp(new THREE.Vector3(0.3, 0.6, 0), 0.25);
    return { az: az + cam.uaz, el: clamp(elv + cam.uel, 0.12, 1.2), r: r * Math.min(k, 1.75), tgt };
  }
  function applyCam(goal, a) {
    cam.az += (goal.az - cam.az) * a; cam.el += (goal.el - cam.el) * a; cam.r += (goal.r - cam.r) * a;
    cam.target.lerp(goal.tgt, a);
    camera.position.set(cam.target.x + cam.r * Math.sin(cam.az) * Math.cos(cam.el), cam.target.y + cam.r * Math.sin(cam.el), cam.target.z + cam.r * Math.cos(cam.az) * Math.cos(cam.el));
    camera.lookAt(cam.target);
  }

  // drag to orbit
  if (renderer) {
    const cv = renderer.domElement;
    let drag = null;
    const down = (e) => { drag = { x: e.clientX, y: e.clientY, az: cam.uaz, el: cam.uel }; cv.setPointerCapture?.(e.pointerId); stage.classList.add('is-dragging'); wrap.classList.add('has-orbited'); };
    const move = (e) => { if (!drag) return; cam.uaz = clamp(drag.az - (e.clientX - drag.x) * 0.006, -1.1, 1.1); cam.uel = clamp(drag.el + (e.clientY - drag.y) * 0.004, -0.35, 0.6); kick(); };
    const up = () => { drag = null; stage.classList.remove('is-dragging'); };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cleanups.push(() => { cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up); });
  }

  // ---- UI state ----
  function renderUI() {
    const s = plan[st.index];
    caption.innerHTML = `<span class="bench-k">Step ${st.index + 1} of ${n}:</span> ${escHTML(s.text)}`;
    playBtn.innerHTML = st.playing ? ICON.pause : ICON.play;
    playBtn.setAttribute('aria-label', st.playing ? 'Pause' : 'Play');
    playBtn.setAttribute('aria-pressed', st.playing ? 'true' : 'false');
    rail.forEach((li) => li.classList.toggle('is-on', li.dataset.phase === s.phase));
    segs.forEach((sg, i) => { sg.classList.toggle('done', i < st.index); sg.classList.toggle('cur', i === st.index); if (i !== st.index) sg.firstChild.style.width = i < st.index ? '100%' : '0%'; });
    lis.forEach((li, i) => { li.classList.toggle('is-active', i === st.index); if (i === st.index) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
    wrap.dataset.phase = s.phase;
  }
  function go(i, fromUser) {
    st.index = ((i % n) + n) % n;
    st.p = reduce ? 1 : 0;
    stepStart = st.t;
    renderUI();
    kick();
  }
  let stepStart = 0;
  const onPrev = () => go(st.index - 1, true);
  const onNext = () => go(st.index + 1, true);
  const onPlay = () => { st.playing = !st.playing; if (st.playing && st.p >= 1) go(st.index + 1); renderUI(); kick(); };
  wrap.querySelector('.bench-prev').addEventListener('click', onPrev);
  wrap.querySelector('.bench-next').addEventListener('click', onNext);
  playBtn.addEventListener('click', onPlay);
  const onKey = (e) => { if (e.key === 'ArrowRight') { onNext(); e.preventDefault(); } else if (e.key === 'ArrowLeft') { onPrev(); e.preventDefault(); } else if (e.key === ' ' && e.target === stage) { onPlay(); e.preventDefault(); } };
  stage.tabIndex = 0; stage.setAttribute('aria-label', 'Lab bench. Use left and right arrow keys to step through the protocol.');
  stage.addEventListener('keydown', onKey);

  // protocol list linking
  if (list) {
    list.classList.add('bench-linked');
    lis.forEach((li, i) => { li.tabIndex = 0; li.dataset.benchStep = String(i); });
    const onClick = (e) => { const li = e.target.closest('li[data-bench-step]'); if (!li || !list.contains(li)) return; go(+li.dataset.benchStep, true); if (opts.scrollOnJump !== false) stage.scrollIntoView?.({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); };
    const onLiKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { const li = e.target.closest('li[data-bench-step]'); if (li) { e.preventDefault(); go(+li.dataset.benchStep, true); } } };
    list.addEventListener('click', onClick); list.addEventListener('keydown', onLiKey);
    cleanups.push(() => {
      list.removeEventListener('click', onClick); list.removeEventListener('keydown', onLiKey);
      list.classList.remove('bench-linked');
      lis.forEach((li) => { li.classList.remove('is-active'); li.removeAttribute('tabindex'); li.removeAttribute('aria-current'); delete li.dataset.benchStep; });
    });
  }

  // ---- loop ----
  function resize() {
    if (!renderer) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    kick();
  }
  const ro = new ResizeObserver(resize); ro.observe(stage);
  const io = new IntersectionObserver(([en]) => { st.visible = en.isIntersecting; if (st.visible) kick(); }, { threshold: 0.02 });
  io.observe(stage);
  const onVis = () => { if (!document.hidden) kick(); };
  document.addEventListener('visibilitychange', onVis);

  let idleFrames = 0;
  function frame() {
    raf = 0;
    if (st.disposed) return;
    if (!st.visible || document.hidden) return; // paused offscreen; kick() resumes
    const dt = clock ? Math.min(clock.getDelta(), 0.05) : 0.016;
    st.t += dt;
    const s = plan[st.index];
    if (st.p < 1) st.p = Math.min(1, st.p + dt / PHASE_DUR[s.phase]);
    if (st.playing && st.p >= 1 && st.t - stepStart > PHASE_DUR[s.phase] + 0.6) go(st.index + 1);
    const segEl = segs[st.index]; if (segEl) segEl.firstChild.style.width = (clamp(st.p) * 100).toFixed(1) + '%';
    if (renderer) {
      rig.update({ phase: s.phase, p: clamp(st.p), t: st.t, dt, dispIndex: s.dispIndex, prevDispIndex: s.prevDispIndex, lastDispIndex: s.lastDispIndex, hasRead: s.hasRead, index: st.index, bar: (st.index + clamp(st.p)) / n, camera, instant: reduce || !!st.snap });
      applyCam(camGoal(), reduce || st.snap ? 1 : Math.min(1, dt * 2.2));
      st.snap = false;
      renderer.render(scene, camera);
    }
    // keep running while playing or settling; idle otherwise
    const busy = st.playing || st.p < 1 || idleFrames < 90;
    idleFrames = (st.playing || st.p < 1) ? 0 : idleFrames + 1;
    if (busy || !renderer) { if (renderer || st.playing) raf = requestAnimationFrame(frame); }
  }
  function kick() { idleFrames = 0; if (!raf && !st.disposed) { if (clock) clock.getDelta(); raf = requestAnimationFrame(frame); } }

  if (reduce) st.p = 1;
  renderUI();
  resize();
  if (renderer) {
    // first frame immediately so the bench never flashes empty
    const goal = camGoal(); cam.az = goal.az; cam.el = goal.el; cam.r = goal.r; cam.target.copy(goal.tgt);
    rig.update({ phase: plan[0].phase, p: st.p, t: 0, dt: 0, dispIndex: plan[0].dispIndex, prevDispIndex: -1, lastDispIndex: plan[0].lastDispIndex, hasRead: false, index: 0, camera, instant: true });
    applyCam(goal, 1);
    renderer.render(scene, camera);
  }
  kick();

  function dispose() {
    if (st.disposed) return;
    st.disposed = true;
    if (raf) cancelAnimationFrame(raf);
    ro.disconnect(); io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    stage.removeEventListener('keydown', onKey);
    wrap.querySelector('.bench-prev').removeEventListener('click', onPrev);
    wrap.querySelector('.bench-next').removeEventListener('click', onNext);
    playBtn.removeEventListener('click', onPlay);
    cleanups.forEach((f) => f());
    if (rig) rig.dispose();
    if (renderer) { renderer.dispose(); renderer.forceContextLoss?.(); }
    wrap.remove();
  }
  return { dispose, archetype: arch, steps: plan.map((s) => s.phase), go: (i, p) => { go(i, true); if (p != null) { st.p = clamp(p); st.snap = true; stepStart = st.t - st.p * PHASE_DUR[plan[st.index].phase]; } }, get index() { return st.index; } };
}
