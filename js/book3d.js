// The Assay Index — 3D book hero (Three.js)
// A cloth-bound book on a sage desk mat: opens to a chapter per assay,
// pop-up lab objects rise from the page. Warm daylight, soft shadows.
// Exported for Claude Code reuse: see claude-code-handoff/SPEC.md.

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { buildRig } from './lab3d.js?v=20261122';

export function initBook3d(mount, assays, onOpenAssay) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-label', 'Interactive 3D book of assays');
  canvas.style.touchAction = 'pan-y';
  mount.appendChild(canvas);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    // WebGL unavailable — leave the CSS poster showing; return a no-op API
    canvas.remove();
    console.warn('WebGL unavailable, showing static book poster.');
    return { dispose() {}, setOpen() {}, setChapter() {}, };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 7.2, 10.4);
  camera.lookAt(0, 0.4, 0);

  // ---- Lights: warm daylight raking across the desk ----
  const sun = new THREE.DirectionalLight(0xfff2dd, 2.6);
  sun.position.set(6, 9, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -10; sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10; sun.shadow.camera.bottom = -6;
  sun.shadow.radius = 6; sun.shadow.bias = -0.0005;
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xf4ead8, 0.75));
  const bounce = new THREE.DirectionalLight(0xd8e2d0, 0.5);
  bounce.position.set(-5, 3, -6);
  scene.add(bounce);

  // ---- Desk: wood floor plane with procedural grain ----
  function woodTexture() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 1024;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 1024, 1024);
    g.addColorStop(0, '#c9a06b'); g.addColorStop(1, '#b8895a');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 140; i++) {
      x.strokeStyle = `rgba(120,84,48,${0.03 + Math.random() * 0.07})`;
      x.lineWidth = 1 + Math.random() * 2.5;
      x.beginPath();
      const y = Math.random() * 1024;
      x.moveTo(0, y);
      x.bezierCurveTo(300, y + (Math.random() - 0.5) * 60, 700, y + (Math.random() - 0.5) * 60, 1024, y + (Math.random() - 0.5) * 30);
      x.stroke();
    }
    // plank seams
    for (let i = 1; i < 5; i++) {
      x.strokeStyle = 'rgba(90,62,34,0.28)'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(0, i * 204); x.lineTo(1024, i * 204 + (Math.random() - 0.5) * 8); x.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.28;
  floor.receiveShadow = true;
  scene.add(floor);

  // ---- Sage desk mat (rounded slab) ----
  const mat = new THREE.Mesh(
    new THREE.BoxGeometry(13.2, 0.22, 9.6),
    new THREE.MeshStandardMaterial({ color: 0x9aa88f, roughness: 0.95 })
  );
  mat.position.y = -0.11;
  mat.receiveShadow = true; mat.castShadow = true;
  scene.add(mat);

  // ---- Book group ----
  const book = new THREE.Group();
  scene.add(book);

  const BW = 4.6, BD = 6.3;            // width of one board and depth of the book
  const BT = 0.12, PB = 0.5;           // board thickness, full page-block height
  const BH = BT;
  const cloth = new THREE.MeshStandardMaterial({ color: 0xc2a24e, roughness: 0.8 }); // mustard cloth
  const clothDark = new THREE.MeshStandardMaterial({ color: 0xa98a3e, roughness: 0.8 });
  const paper = new THREE.MeshStandardMaterial({ color: 0xfaf6ec, roughness: 0.95 });
  const paperSide = new THREE.MeshStandardMaterial({ color: 0xe9e2d2, roughness: 0.95 });

  // Cover canvas (title debossed)
  function coverTexture() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 1400;
    const x = c.getContext('2d');
    x.fillStyle = '#c2a24e'; x.fillRect(0, 0, 1024, 1400);
    x.strokeStyle = 'rgba(122,94,40,0.5)'; x.lineWidth = 6;
    x.strokeRect(70, 70, 884, 1260);
    x.fillStyle = '#7c5f22';
    x.textAlign = 'center';
    x.font = 'italic 700 110px Georgia';
    x.fillText('The Assay', 512, 380);
    x.font = 'italic 700 110px Georgia';
    x.fillText('Index', 512, 520);
    x.font = '44px Georgia';
    x.fillStyle = 'rgba(124,95,34,0.85)';
    x.fillText('Every assay, every machine, every step', 512, 650);
    x.fillText(`${assays.length} chapters`, 512, 730);
    // small inlay illustration: two beakers
    x.strokeStyle = '#7c5f22'; x.lineWidth = 8;
    for (const bx of [430, 594]) {
      x.beginPath(); x.moveTo(bx, 880); x.lineTo(bx, 1080); x.stroke();
      x.beginPath(); x.moveTo(bx - 16, 880); x.lineTo(bx + 16, 880); x.stroke();
      x.beginPath(); x.moveTo(bx - 16, 1080); x.lineTo(bx + 16, 1080); x.stroke();
      x.fillStyle = 'rgba(124,95,34,0.55)';
      x.fillRect(bx - 14, 1020, 28, 58);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // Layout (book space, desk mat top at y = 0). Closed: back board, page block,
  // front board, spine on the left at x = -BW/2. Opening rotates the front board
  // (carrying the left half of the pages) 180 degrees about the spine hinge, and
  // the hinge drops so the left half lies flat on the mat beside the right half.
  const HX = -BW / 2;
  const coverMat = new THREE.MeshStandardMaterial({ map: coverTexture(), roughness: 0.75 });

  // Front cover (hinged at the spine). Title sits on its +y face.
  const frontCover = new THREE.Group();
  frontCover.position.set(HX, BT + PB, 0);
  const frontCoverMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BW, BT, BD),
    [clothDark, clothDark, coverMat, cloth, clothDark, clothDark]
  );
  frontCoverMesh.castShadow = true; frontCoverMesh.receiveShadow = true;
  frontCoverMesh.position.set(BW / 2, BT / 2, 0);
  frontCover.add(frontCoverMesh);
  book.add(frontCover);

  // Back cover
  const backCover = new THREE.Mesh(new THREE.BoxGeometry(BW, BT, BD), clothDark);
  backCover.position.set(0, BT / 2, 0);
  backCover.castShadow = true; backCover.receiveShadow = true;
  book.add(backCover);

  // Spine: a cloth strip at the hinge whose height follows the hinge
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1, BD), clothDark);
  spine.position.set(HX - 0.07, 0.5, 0);
  spine.castShadow = true;
  book.add(spine);

  // Right page block; shrinks to half height when the book is open
  const pageBlock = new THREE.Mesh(new THREE.BoxGeometry(BW - 0.18, PB, BD - 0.24), [paperSide, paperSide, paper, paperSide, paperSide, paperSide]);
  pageBlock.position.set(0.05, BT + PB / 2, 0);
  pageBlock.castShadow = true; pageBlock.receiveShadow = true;
  book.add(pageBlock);

  // Left half of the pages rides on the inside of the front cover. Its -y face
  // carries the chapter page and faces up once the cover has flipped over.
  const leftPageTex = { canvas: document.createElement('canvas') };
  leftPageTex.canvas.width = 1024; leftPageTex.canvas.height = 1400;
  leftPageTex.texture = new THREE.CanvasTexture(leftPageTex.canvas);
  leftPageTex.texture.colorSpace = THREE.SRGBColorSpace;
  leftPageTex.texture.anisotropy = 4;
  leftPageTex.texture.center.set(0.5, 0.5);
  leftPageTex.texture.rotation = Math.PI; // face is turned 180 degrees after the flip
  const leftPageMat = new THREE.MeshStandardMaterial({ map: leftPageTex.texture, roughness: 0.95 });
  const leftPageMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BW - 0.18, PB / 2, BD - 0.24),
    [paperSide, paperSide, paperSide, leftPageMat, paperSide, paperSide]
  );
  leftPageMesh.position.set(BW / 2 - 0.05, -PB / 4 - 0.002, 0);
  leftPageMesh.castShadow = true; leftPageMesh.receiveShadow = true;
  frontCover.add(leftPageMesh);
  const leftPageGroup = frontCover; // kept for older references

  function drawChapter(assay, idx) {
    const x = leftPageTex.canvas.getContext('2d');
    const MAXW = 840;
    const fit = (str, w) => {            // ellipsize to the page width
      if (x.measureText(str).width <= w) return str;
      let t = str;
      while (t.length > 1 && x.measureText(t + '\u2026').width > w) t = t.slice(0, -1);
      return t.trimEnd() + '\u2026';
    };
    x.fillStyle = '#faf6ec'; x.fillRect(0, 0, 1024, 1400);
    x.fillStyle = '#b03a2e';
    x.font = 'italic 60px Georgia'; x.textAlign = 'left';
    x.fillText(`Chapter ${String(idx + 1).padStart(2, '0')}`, 90, 160);
    x.fillStyle = '#2a2620';
    x.font = '700 78px Georgia';
    const words = assay.name.split(' ');
    let line = '', y = 280;
    for (const w of words) {
      const test = line + w + ' ';
      if (x.measureText(test).width > 840 && line) { x.fillText(line, 90, y); y += 92; line = w + ' '; }
      else line = test;
    }
    x.fillText(line, 90, y);
    y += 60;
    x.font = 'italic 44px Georgia'; x.fillStyle = '#6e6759';
    { // wrap the tagline, at most 3 lines
      let ln = '', n = 0;
      for (const w of assay.tagline.split(' ')) {
        const test = ln ? ln + ' ' + w : w;
        if (x.measureText(test).width > MAXW && ln) {
          if (++n === 3) break;
          y += 58; x.fillText(ln, 90, y); ln = w;
        } else ln = test;
      }
      y += 58; x.fillText(fit(ln, MAXW), 90, y);
    }
    y += 90;
    x.fillStyle = '#43503f'; x.font = '700 40px Georgia';
    x.fillText('THE MACHINES', 90, y); y += 64;
    x.font = '38px Georgia'; x.fillStyle = '#2a2620';
    for (const inst of assay.instruments.slice(0, 4)) {
      x.fillText(fit(`\u2022 ${inst.name} \u2014 ${inst.vendor}`, MAXW), 90, y); y += 56;
    }
    y += 40;
    x.fillStyle = '#43503f'; x.font = '700 40px Georgia';
    x.fillText('STEPS IN THIS CHAPTER', 90, y); y += 58;
    x.font = '36px Georgia'; x.fillStyle = '#6e6759';
    for (const s of assay.steps.slice(0, 4)) {
      x.fillText(fit(s, MAXW - 20), 110, y); y += 54;
    }
    x.fillStyle = '#a49b89'; x.font = 'italic 34px Georgia';
    x.fillText('Open the full chapter below ↓', 90, 1330);
    leftPageTex.texture.needsUpdate = true;
  }

  // ---- Chapter rig (rises from the right page when open) ----
  // A small, chapter-specific bench rig from lab3d.js, rebuilt on setChapter.
  const popups = new THREE.Group();
  popups.position.set(0.1, BT + PB / 2 + 0.002, 0.15);
  popups.scale.setScalar(0.001);
  book.add(popups);
  let rig = null;
  function buildChapterRig(i) {
    if (rig) { popups.remove(rig.group); rig.dispose(); rig = null; }
    try {
      rig = buildRig(assays[i]);
      rig.group.scale.setScalar(0.92);
      rig.group.traverse((m) => { if (m.isMesh) m.castShadow = true; });
      rig.group.rotation.y = -0.12;
      popups.add(rig.group);
    } catch (e) { console.warn('Chapter rig failed', e); }
  }
  buildChapterRig(0);

  // ---- State ----
  const state = {
    open: false, t: 0, target: 0, // 0 closed → 1 open
    chapter: 0,
    pointerX: 0, pointerY: 0,
    popped: new Set()
  };
  drawChapter(assays[0], 0);

  function setOpen(v) {
    state.target = v ? 1 : 0;
    if (v && !state.open) state.popped.clear();
    state.open = v;
    updateDock();
  }
  function setChapter(i) {
    state.chapter = (i + assays.length) % assays.length;
    drawChapter(assays[state.chapter], state.chapter);
    buildChapterRig(state.chapter);
    state.popped.clear(); // re-rise the rig for the new chapter
    popups.scale.setScalar(0.001);
    updateDock();
  }

  // ---- Dock UI (frosted pill) ----
  const dock = document.createElement('div');
  dock.className = 'dock';
  dock.innerHTML = `
    <button class="d-prev" aria-label="Previous assay">‹</button>
    <span class="dot"></span>
    <span class="dock-label">The Assay Index</span>
    <span class="dot"></span>
    <button class="d-next" aria-label="Next assay">›</button>
    <button class="d-open" aria-label="Open book">⤢</button>`;
  mount.appendChild(dock);
  dock.querySelector('.d-prev').addEventListener('click', () => setChapter(state.chapter - 1));
  dock.querySelector('.d-next').addEventListener('click', () => setChapter(state.chapter + 1));
  dock.querySelector('.d-open').addEventListener('click', () => setOpen(!state.open));
  function updateDock() {
    const label = dock.querySelector('.dock-label');
    const dots = dock.querySelectorAll('.dot');
    if (state.open) {
      label.textContent = `${String(state.chapter + 1).padStart(2, '0')} · ${assays[state.chapter].name}`;
      label.style.cursor = 'pointer';
      dots[0].classList.add('on'); dots[1].classList.add('on');
    } else {
      label.textContent = 'Open the book';
      label.style.cursor = 'pointer';
      dots[0].classList.remove('on'); dots[1].classList.remove('on');
    }
  }
  dock.querySelector('.dock-label').addEventListener('click', () => {
    if (state.open) onOpenAssay(assays[state.chapter].id);
    else setOpen(true);
  });
  updateDock();

  // Click on book toggles open; click when open navigates
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downAt = null;
  canvas.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects([frontCoverMesh, leftPageMesh, pageBlock], false);
    if (state.open) onOpenAssay(assays[state.chapter].id);
    else if (hits.length) setOpen(true);
  });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    state.pointerX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    state.pointerY = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });

  // ---- Animation ----
  const clock = new THREE.Clock();
  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function resize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(mount);
  resize();

  let running = true;
  const io = new IntersectionObserver(([en]) => { running = en.isIntersecting; }, { threshold: 0.05 });
  io.observe(mount);

  let raf = 0, disposed = false;
  function frame() {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // ease open progress
    state.t += (state.target - state.t) * Math.min(1, dt * 2.4);
    const o = ease(Math.max(0, Math.min(1, state.t)));

    // front cover flips over the spine; hinge drops so both halves lie flat
    frontCover.rotation.z = o * Math.PI;
    frontCover.position.y = BT + PB - PB * o + Math.sin(o * Math.PI) * 0.35;
    const hy = frontCover.position.y;
    pageBlock.scale.y = 1 - 0.5 * o;
    pageBlock.position.y = BT + (PB * pageBlock.scale.y) / 2;
    spine.scale.y = hy + BT;
    spine.position.y = (hy + BT) / 2;
    // book slides right so the open spread is centred on the mat
    book.position.x = o * BW / 2;

    // chapter rig rises after open
    const want = state.target === 1 && o > 0.85 ? 1 : 0.001;
    const sc = popups.scale.x + (want - popups.scale.x) * Math.min(1, dt * 3);
    popups.scale.setScalar(Math.max(0.001, sc));
    popups.visible = sc > 0.01;
    if (rig && popups.visible) rig.update(dt);

    // gentle idle float + pointer parallax
    const px = state.pointerX, py = state.pointerY;
    camera.position.x += ((px * 0.9) - camera.position.x) * Math.min(1, dt * 2);
    camera.position.y += ((7.2 - py * 0.7) - camera.position.y) * Math.min(1, dt * 2);
    camera.lookAt(0, 0.4 + Math.sin(t * 0.4) * 0.05, 0);
    book.rotation.y = Math.sin(t * 0.25) * 0.04;

    renderer.render(scene, camera);
    if (!mount.classList.contains('is-live')) mount.classList.add('is-live'); // hide CSS poster title
  }
  frame();

  function dispose() {
    mount.classList.remove('is-live');
    disposed = true;
    cancelAnimationFrame(raf);
    io.disconnect(); ro.disconnect();
    if (rig) { rig.dispose(); rig = null; }
    renderer.dispose();
  }
  return { setOpen, setChapter, dispose };
}
