// The Assay Index — router + rendering
(function () {
  const ASSAYS = window.ASSAYS;
  const DRUG_TYPES = window.DRUG_TYPES;

  const CATEGORIES = {
    binding: "Binding & kinetics",
    cell: "Cell-based",
    safety: "Safety pharmacology",
    bioanalysis: "Bioanalysis",
    qc: "Synthesis QC",
    adme: "ADME",
    genomics: "Genomics",
    immunology: "Immunology",
    ionchannel: "Ion channels",
    developability: "Developability",
    cgt: "Cell & gene therapy",
    peptide: "Peptide analytics"
  };

  const main = document.getElementById('main');
  const topbarMeta = document.getElementById('topbar-meta');
  if (topbarMeta) topbarMeta.textContent = `${ASSAYS.length} chapters · ${Object.keys(DRUG_TYPES).length} modalities · desk research 2026`;
  let book3d = null;
  let activeFilter = 'all';
  let activeCat = 'all';
  let query = '';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]));
  const providerNames = () => new Set(ASSAYS.flatMap((a) => a.providers || []).map((p) => p.name));

  // ---------- Views ----------
  function renderHome() {
    main.innerHTML = `
      <section class="hero">
        <div class="hero-copy">
          <h1>The marketplace for <em>every assay</em> in drug discovery.</h1>
          <p class="lede">Each chapter is an assay: what it tests, which drug types it fits, the machines and pipettes it runs on, the steps in the protocol, and the providers who run it.</p>
          <div class="hero-stats">
            <div class="stat"><b>${ASSAYS.length}</b><span>Assays</span></div>
            <div class="stat"><b>${providerNames().size}</b><span>Providers</span></div>
            <div class="stat"><b>${Object.keys(DRUG_TYPES).length}</b><span>Drug modalities</span></div>
          </div>
        </div>
        <div class="book-stage" id="book-stage" aria-hidden="false"></div>
      </section>
      <section class="catalog">
        <div class="catalog-head">
          <h2>The catalog</h2>
          <span class="count" id="count"></span>
        </div>
        <input type="search" id="search" class="search" placeholder="Search assays, tests, providers…" value="${esc(query)}" aria-label="Search assays" />
        <div class="filters" id="filters" role="group" aria-label="Filter by drug type"></div>
        <div class="filters" id="cat-filters" role="group" aria-label="Filter by category"></div>
        <div class="grid" id="grid"></div>
      </section>`;

    // drug-type filters
    const filters = document.getElementById('filters');
    const allTypes = Object.keys(DRUG_TYPES);
    const mk = (label, key, group) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.textContent = label;
      b.setAttribute('aria-pressed', String(group === key));
      b.addEventListener('click', () => {
        if (group === 'cat') { activeCat = key; }
        else { activeFilter = key; }
        renderHome();
      });
      return b;
    };
    filters.appendChild(mk('All modalities', 'all', 'type'));
    allTypes.forEach((k) => filters.appendChild(mk(DRUG_TYPES[k], k, 'type')));

    // category filters
    const catFilters = document.getElementById('cat-filters');
    catFilters.appendChild(mk('All categories', 'all', 'cat'));
    const catsInUse = [...new Set(ASSAYS.map((a) => a.category))];
    catsInUse.forEach((c) => catFilters.appendChild(mk(CATEGORIES[c] || c, c, 'cat')));

    // search
    const search = document.getElementById('search');
    search.addEventListener('input', () => { query = search.value; renderGrid(); });

    renderGrid();

    // 3D book
    const stage = document.getElementById('book-stage');
    import('./book3d.js').then((m) => {
      if (book3d) book3d.dispose();
      book3d = m.initBook3d(stage, ASSAYS, (id) => { location.hash = `#/assay/${id}`; });
      if (pendingChapter) { book3d.setOpen(true); book3d.setChapter(pendingChapter); pendingChapter = null; }
    });
  }

  function renderGrid() {
    const grid = document.getElementById('grid');
    const count = document.getElementById('count');
    if (!grid) return;
    const q = query.trim().toLowerCase();
    const visible = ASSAYS.filter((a) => {
      if (activeFilter !== 'all' && !a.drugTypes.includes(activeFilter)) return false;
      if (activeCat !== 'all' && a.category !== activeCat) return false;
      if (!q) return true;
      const hay = [
        a.name, a.tagline,
        ...(a.tests || []), ...(a.providers || []).map((p) => p.name),
        ...(a.instruments || []).map((i) => i.name + ' ' + i.vendor),
        CATEGORIES[a.category] || ''
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
    count.textContent = `${visible.length} of ${ASSAYS.length} assays`;

    grid.innerHTML = '';
    if (!visible.length) {
      grid.innerHTML = '<p class="no-results">No assays match — try a broader term or clear the filters.</p>';
      return;
    }
    // group by category
    const groups = {};
    visible.forEach((a) => {
      (groups[a.category] = groups[a.category] || []).push(a);
    });
    const order = Object.keys(CATEGORIES);
    for (const cat of order) {
      const list = groups[cat];
      if (!list) continue;
      const h = document.createElement('h3');
      h.className = 'group-head';
      h.innerHTML = `${esc(CATEGORIES[cat] || cat)} <span class="group-count">${list.length}</span>`;
      grid.appendChild(h);
      list.forEach((a) => {
        const el = document.createElement('a');
        el.className = 'card';
        el.href = `#/assay/${a.id}`;
        el.innerHTML = `
          <div class="card-top">
            <h3>${esc(a.name)}</h3>
            <span class="card-no">${String(ASSAYS.indexOf(a) + 1).padStart(2, '0')}</span>
          </div>
          <p class="tagline">${esc(a.tagline)}</p>
          <div class="types">${a.drugTypes.map((d) => `<span class="type-tag">${esc(DRUG_TYPES[d] || d)}</span>`).join('')}</div>`;
        grid.appendChild(el);
      });
    }
  }

  let pendingChapter = null;

  function renderAssay(id) {
    const idx = ASSAYS.findIndex((a) => a.id === id);
    if (idx === -1) { renderHome(); return; }
    const a = ASSAYS[idx];
    const prev = ASSAYS[(idx - 1 + ASSAYS.length) % ASSAYS.length];
    const next = ASSAYS[(idx + 1) % ASSAYS.length];
    pendingChapter = idx;

    const instruments = a.instruments || [];
    const consumables = a.consumables || [];
    const providers = a.providers || [];

    main.innerHTML = `
      <article class="assay">
        <p class="crumb"><a href="#/">Catalog</a> / Chapter ${String(idx + 1).padStart(2, '0')}</p>
        <h1>${esc(a.name)}</h1>
        <p class="tagline">${esc(a.tagline)}</p>
        <div class="badges">
          <span class="type-tag">${esc(CATEGORIES[a.category] || a.category)}</span>
          ${a.drugTypes.map((d) => `<span class="type-tag">${esc(DRUG_TYPES[d] || d)}</span>`).join('')}
        </div>

        <div class="section two-col">
          <div>
            <h2><span class="no">01</span> What it tests</h2>
            <ul class="checks">${(a.tests || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
          <div>
            <h2><span class="no">02</span> Fits these drug types</h2>
            <ul class="checks">${a.drugTypes.map((d) => `<li>${esc(DRUG_TYPES[d] || d)}</li>`).join('')}</ul>
            ${a.automation ? `<div class="note-card"><b>Protocol note</b>${esc(a.automation)}</div>` : ''}
          </div>
        </div>

        ${instruments.length ? `
        <div class="section">
          <h2><span class="no">03</span> The machines</h2>
          <table class="stack">
            <thead><tr><th>Instrument</th><th>Vendor</th><th>Role</th><th>Notes</th></tr></thead>
            <tbody>
              ${instruments.map((i) => `<tr><td><b>${esc(i.name)}</b></td><td>${esc(i.vendor)}</td><td>${esc(i.role)}</td><td class="sub">${esc(i.note)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}

        ${consumables.length ? `
        <div class="section">
          <h2><span class="no">04</span> Pipettes & consumables</h2>
          <ul class="consumables">${consumables.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        </div>` : ''}

        <div class="section">
          <h2><span class="no">05</span> Steps in the protocol</h2>
          <ol class="protocol">${(a.steps || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        </div>

        ${providers.length ? `
        <div class="section">
          <h2><span class="no">06</span> Known providers</h2>
          <table class="stack">
            <thead><tr><th>Provider</th><th>What to know</th><th>Region</th></tr></thead>
            <tbody>
              ${providers.map((p) => `<tr class="provider-row"><td>${esc(p.name)}</td><td class="sub">${esc(p.note)}</td><td class="sub">${esc(p.region || '')}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}

        <div class="section">
          <h2><span class="no">${providers.length ? '07' : '06'}</span> Market & capacity</h2>
          ${a.marketNote ? `<div class="note-card"><b>Market</b>${esc(a.marketNote)}</div>` : ''}
          ${a.capacityNote ? `<div class="note-card warn"><b>Capacity watch</b>${esc(a.capacityNote)}</div>` : ''}
        </div>

        <p class="crumb">
          <a href="#/assay/${prev.id}">← ${esc(prev.name)}</a> &nbsp;·&nbsp;
          <a href="#/assay/${next.id}">${esc(next.name)} →</a>
        </p>
      </article>`;

    if (book3d) { book3d.setOpen(true); book3d.setChapter(idx); }
    window.scrollTo({ top: 0 });
  }

  // ---------- Router ----------
  function route() {
    const h = location.hash;
    const m = h.match(/^#\/assay\/([\w-]+)$/);
    if (m) renderAssay(m[1]);
    else renderHome();
  }
  window.addEventListener('hashchange', route);
  route();
})();
