// The Assay Index — 3D book hero (Three.js)
// A cloth-bound book on a sage desk mat: opens to a chapter per assay,
// pop-up lab objects rise from the page. Warm daylight, soft shadows.
// Exported for Claude Code reuse: see claude-code-handoff/SPEC.md.

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

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

  const BW = 5.4, BH = 0.34, BD = 7.4; // half-width, thickness, depth of book block
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
    x.fillText('Every assay, every machine, every step', 512, 620);
    x.fillText(`${assays.length} chapters`, 512, 700);
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

  // Front cover (hinged on left)
  const frontCover = new THREE.Group();
  frontCover.position.set(-BW, BH / 2, 0);
  const frontCoverMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BW, BH, BD),
    [clothDark, clothDark, clothDark, clothDark, new THREE.MeshStandardMaterial({ map: coverTexture(), roughness: 0.75 }), clothDark]
  );
  frontCoverMesh.castShadow = true;
  frontCoverMesh.position.x = BW / 2;
  frontCover.add(frontCoverMesh);
  book.add(frontCover);

  // Back cover
  const backCover = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, BD), clothDark);
  backCover.position.set(0, -BH / 2 - 0.02, 0);
  backCover.castShadow = true; backCover.receiveShadow = true;
  book.add(backCover);

  // Spine
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.36, BH + 0.06, BD), clothDark);
  spine.position.set(-BW - 0.16, -0.02, 0);
  book.add(spine);

  // Page block (right side when closed)
  const pageBlock = new THREE.Mesh(new THREE.BoxGeometry(BW - 0.25, 0.5, BD - 0.5), paperSide);
  pageBlock.position.set(0.05, 0.26, 0);
  pageBlock.castShadow = true;
  book.add(pageBlock);

  // Left page (revealed when open): canvas texture with chapter content
  const leftPageGroup = new THREE.Group();
  const leftPageTex = { canvas: document.createElement('canvas') };
  leftPageTex.canvas.width = 1024; leftPageTex.canvas.height = 1400;
  leftPageTex.texture = new THREE.CanvasTexture(leftPageTex.canvas);
  leftPageTex.texture.colorSpace = THREE.SRGBColorSpace;
  const leftPageMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BW - 0.3, 0.06, BD - 0.6),
    [paperSide, paperSide, paperSide, paperSide, new THREE.MeshStandardMaterial({ map: leftPageTex.texture, roughness: 0.95 }), paperSide]
  );
  leftPageMesh.position.set(BW / 2 - 0.05, 0.03, 0);
  leftPageMesh.receiveShadow = true;
  leftPageGroup.add(leftPageMesh);
  leftPageGroup.position.set(-BW + 0.12, BH, 0);
  book.add(leftPageGroup);

  function drawChapter(assay, idx) {
    const x = leftPageTex.canvas.getContext('2d');
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
    for (const t of assay.tagline.match(/[^.]+\./g) || [assay.tagline]) {
      y += 62; x.fillText(t.trim(), 90, y);
    }
    y += 90;
    x.fillStyle = '#43503f'; x.font = '700 40px Georgia';
    x.fillText('THE MACHINES', 90, y); y += 64;
    x.font = '38px Georgia'; x.fillStyle = '#2a2620';
    for (const inst of assay.instruments.slice(0, 4)) {
      x.fillText(`• ${inst.name} — ${inst.vendor}`, 90, y); y += 56;
    }
    y += 40;
    x.fillStyle = '#43503f'; x.font = '700 40px Georgia';
    x.fillText('STEPS IN THIS CHAPTER', 90, y); y += 58;
    x.font = '36px Georgia'; x.fillStyle = '#6e6759';
    for (const s of assay.steps.slice(0, 4)) {
      const short = s.length > 72 ? s.slice(0, 70) + '…' : s;
      x.fillText(`${short}`, 110, y); y += 54;
    }
    x.fillStyle = '#a49b89'; x.font = 'italic 34px Georgia';
    x.fillText('Open the full chapter below ↓', 90, 1330);
    leftPageTex.texture.needsUpdate = true;
  }

  // ---- Pop-up objects (rise from right page when open) ----
  const popups = new THREE.Group();
  book.add(popups);

  function makeBeaker() {
    const g = new THREE.Group();
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xdfe8ea, transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.48, 1.5, 32), glass);
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.43, 0.7, 32), new THREE.MeshStandardMaterial({ color: 0xd07a3a, roughness: 0.25 }));
    liquid.position.y = -0.3;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 12, 32), glass);
    rim.rotation.x = Math.PI / 2; rim.position.y = 0.75;
    body.castShadow = true;
    g.add(body, liquid, rim);
    return g;
  }
  function makePipette() {
    const g = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 2.6, 24), new THREE.MeshStandardMaterial({ color: 0x3f4a5a, roughness: 0.4 }));
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.9, 24), new THREE.MeshStandardMaterial({ color: 0xc8c2b2, roughness: 0.6 }));
    grip.position.y = 1.2;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.8, 24), new THREE.MeshStandardMaterial({ color: 0xfaf6ec, roughness: 0.3 }));
    tip.position.y = -1.7;
    shaft.castShadow = true;
    g.add(shaft, grip, tip);
    return g;
  }
  function makePlate() {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 1.6), new THREE.MeshStandardMaterial({ color: 0xf2ede0, roughness: 0.5 }));
    base.castShadow = true; base.receiveShadow = true;
    g.add(base);
    const wellMat = new THREE.MeshStandardMaterial({ color: 0x9fb4a6, roughness: 0.3 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
      const well = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16), wellMat);
      well.position.set(-0.95 + c * 0.475, 0.16, -0.45 + r * 0.45);
      g.add(well);
    }
    return g;
  }
  function makeChip() {
    const g = new THREE.Group();
    const chip = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.1), new THREE.MeshStandardMaterial({ color: 0x2e3a4a, roughness: 0.35 }));
    const gold = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.7), new THREE.MeshStandardMaterial({ color: 0xc9a24e, roughness: 0.3, metalness: 0.6 }));
    gold.position.y = 0.06;
    chip.castShadow = true;
    g.add(chip, gold);
    return g;
  }

  const beaker = makeBeaker(); beaker.position.set(-1.15, 0.8, 1.5); beaker.scale.setScalar(0.001);
  const pipette = makePipette(); pipette.position.set(0.1, 1.35, -0.6); pipette.rotation.z = -0.18; pipette.scale.setScalar(0.001);
  const plate = makePlate(); plate.position.set(1.3, 0.35, 1.2); plate.scale.setScalar(0.001);
  const chip = makeChip(); chip.position.set(0.9, 0.3, -1.7); chip.scale.setScalar(0.001);
  popups.add(beaker, pipette, plate, chip);

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
    state.popped.clear(); // re-rise pop-ups for the new chapter
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
  new ResizeObserver(resize).observe(mount);
  resize();

  const popTargets = [beaker, pipette, plate, chip];
  let running = true;
  const io = new IntersectionObserver(([en]) => { running = en.isIntersecting; }, { threshold: 0.05 });
  io.observe(mount);

  function frame() {
    requestAnimationFrame(frame);
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // ease open progress
    state.t += (state.target - state.t) * Math.min(1, dt * 2.4);
    const o = ease(Math.max(0, Math.min(1, state.t)));

    // front cover rotates open around its left hinge
    frontCover.rotation.z = -o * Math.PI * 0.94;

    // left page settles up from the block as cover opens
    leftPageGroup.position.y = BH + (1 - Math.abs(o - 0.7) / 0.7) * 0.001 + o * 0.30;
    leftPageGroup.rotation.z = -Math.max(0, o - 0.75) * 0.12;
    leftPageMesh.visible = o > 0.25;
    pageBlock.visible = o < 0.98;

    // pop-ups rise after open, staggered per chapter visit
    if (state.target === 1) {
      popTargets.forEach((p, i) => {
        if (!state.popped.has(i) && o > 0.85) state.popped.add(i);
        const want = state.popped.has(i) ? 1 : 0.001;
        const s = p.scale.x + (want - p.scale.x) * Math.min(1, dt * (2.2 + i * 0.5));
        p.scale.setScalar(Math.max(0.001, s));
        p.rotation.y = Math.sin(t * 0.5 + i * 1.7) * 0.08;
        p.position.y = p.userData.baseY ?? (p.userData.baseY = p.position.y);
      });
    } else {
      popTargets.forEach((p) => { p.scale.x = Math.max(0.001, p.scale.x * (1 - dt * 4)); p.scale.y = p.scale.x; p.scale.z = p.scale.x; });
    }

    // gentle idle float + pointer parallax
    const px = state.pointerX, py = state.pointerY;
    camera.position.x += ((px * 0.9) - camera.position.x) * Math.min(1, dt * 2);
    camera.position.y += ((7.2 - py * 0.7) - camera.position.y) * Math.min(1, dt * 2);
    camera.lookAt(0, 0.4 + Math.sin(t * 0.4) * 0.05, 0);
    book.rotation.y = Math.sin(t * 0.25) * 0.04;

    renderer.render(scene, camera);
  }
  frame();

  return { setOpen, setChapter, dispose: () => { renderer.dispose(); io.disconnect(); } };
}
