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
    peptide: "Peptide analytics",
    "disease-models": "Complex disease models",
    invivo: "In vivo pharmacology & tox",
    production: "Production & scale-up"
  };

  const V = '?v=20261119b';
  // Optional layers from other files; guard for missing ones.
  if (typeof window.applyStages === 'function') { try { window.applyStages(ASSAYS); } catch (e) { console.warn('applyStages failed', e); } }
  if (typeof window.applyValidation === 'function' && ASSAYS.some((a) => !a.validation)) { try { window.applyValidation(ASSAYS); } catch (e) { console.warn('applyValidation failed', e); } }
  const STAGES = window.STAGES || {};
  const SPECIES = window.SPECIES || {};
  const ROUTES = window.ROUTES || {};
  const stageLabel = (k) => (STAGES[k] && STAGES[k].label) || k;
  const listOf = (a, f) => (Array.isArray(a[f]) ? a[f] : []);

  const main = document.getElementById('main');
  const topbarMeta = document.getElementById('topbar-meta');
  if (topbarMeta) topbarMeta.textContent = `${ASSAYS.length} chapters · ${Object.keys(DRUG_TYPES).length} modalities · desk research 2026`;
  const footerCount = document.getElementById('footer-count');
  if (footerCount) footerCount.textContent = `${ASSAYS.length} chapters built from open desk research`;
  let book3d = null;
  let activeFilter = 'all';
  let activeCat = 'all';
  let activeTier = 'all';
  let activeStage = 'all';
  let activeSpecies = 'all';
  let activeRoute = 'all';
  let query = '';

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TIERS = window.TIERS || {};
  const tierOf = (a) => (a.validation && a.validation.tier) || '';
  const tierTag = (a) => (window.renderTierTag ? window.renderTierTag(a) : '');
  let bench = null;
  let benchToken = 0;
  function disposeBench() {
    benchToken++;
    if (bench) { try { bench.dispose(); } catch (e) { /* ignore */ } bench = null; }
  }
  const providerNames = () => new Set(ASSAYS.flatMap((a) => a.providers || []).map((p) => p.name));

  const prefer = (keys, active) => (active && active !== 'all' && keys.includes(active))
    ? [active, ...keys.filter((k) => k !== active)]
    : keys;
  const metaChips = (a, max) => {
    const out = [];
    const st = prefer(listOf(a, 'stages'), activeStage);
    if (st.length) out.push(`<span class="meta-chip meta-stage" title="Development stage">${esc(st.slice(0, max).map(stageLabel).join(' / '))}${st.length > max ? ' +' + (st.length - max) : ''}</span>`);
    const sp = prefer(listOf(a, 'species'), activeSpecies);
    if (sp.length) out.push(`<span class="meta-chip meta-species" title="Species">${esc(sp.slice(0, max).map((k) => SPECIES[k] || k).join(', '))}${sp.length > max ? ' +' + (sp.length - max) : ''}</span>`);
    const rt = prefer(listOf(a, 'routes'), activeRoute);
    if (rt.length) out.push(`<span class="meta-chip meta-route" title="Delivery routes">${esc(rt.slice(0, max).map((k) => k.toUpperCase().length <= 3 ? k.toUpperCase() : (ROUTES[k] || k)).join(', '))}${rt.length > max ? ' +' + (rt.length - max) : ''}</span>`);
    return out.length ? `<div class="meta-chips">${out.join('')}</div>` : '';
  };
  const europePmcUrl = (a) => 'https://europepmc.org/search?query=' + encodeURIComponent(`"${a.name}" AND (reproducibility OR validation)`);

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
        <div class="filters" id="tier-filters" role="group" aria-label="Filter by validation evidence tier"></div>
        <div class="filters" id="stage-filters" role="group" aria-label="Filter by drug development stage" hidden></div>
        <div class="filters filters-invivo" id="species-filters" role="group" aria-label="Filter in vivo assays by species" hidden></div>
        <div class="filters filters-invivo" id="route-filters" role="group" aria-label="Filter in vivo assays by delivery route" hidden></div>
        <div class="grid" id="grid"></div>
      </section>`;

    // drug-type filters
    const filters = document.getElementById('filters');
    const allTypes = Object.keys(DRUG_TYPES);
    const mk = (label, key, group) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = label;
      const cur = { cat: activeCat, tier: activeTier, stage: activeStage, species: activeSpecies, route: activeRoute }[group] ?? activeFilter;
      b.setAttribute('aria-pressed', String(cur === key));
      b.addEventListener('click', () => {
        if (group === 'cat') { activeCat = key; }
        else if (group === 'tier') { activeTier = key; }
        else if (group === 'stage') { activeStage = key; }
        else if (group === 'species') { activeSpecies = key; }
        else if (group === 'route') { activeRoute = key; }
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

    // validation tier filters
    const tierFilters = document.getElementById('tier-filters');
    tierFilters.appendChild(mk('All evidence tiers', 'all', 'tier'));
    ['A', 'B', 'C', 'D'].forEach((k) => {
      if (!TIERS[k]) return;
      const n = ASSAYS.filter((a) => tierOf(a) === k).length;
      const b = mk(`${TIERS[k].label}: ${TIERS[k].name} (${n})`, k, 'tier');
      b.classList.add(`tier-chip-${k.toLowerCase()}`);
      b.title = TIERS[k].desc;
      tierFilters.appendChild(b);
    });

    // development-stage filters (needs js/stages.js)
    const stageKeys = Object.keys(STAGES).filter((k) => ASSAYS.some((a) => listOf(a, 'stages').includes(k)));
    if (stageKeys.length) {
      const row = document.getElementById('stage-filters');
      row.hidden = false;
      row.appendChild(mk('All stages', 'all', 'stage'));
      stageKeys.forEach((k) => {
        const b = mk(stageLabel(k), k, 'stage');
        if (STAGES[k].desc) b.title = STAGES[k].desc;
        row.appendChild(b);
      });
    }

    // species + route filters, only when in vivo assays carry them
    const vocabRow = (id, field, vocab, allLabel, group) => {
      const keys = Object.keys(vocab).filter((k) => ASSAYS.some((a) => listOf(a, field).includes(k)));
      if (!keys.length) return;
      const row = document.getElementById(id);
      row.hidden = false;
      row.appendChild(mk(allLabel, 'all', group));
      keys.forEach((k) => row.appendChild(mk(vocab[k], k, group)));
    };
    vocabRow('species-filters', 'species', SPECIES, 'Any species (in vivo)', 'species');
    vocabRow('route-filters', 'routes', ROUTES, 'Any route (in vivo)', 'route');

    // search
    const search = document.getElementById('search');
    search.addEventListener('input', () => { query = search.value; renderGrid(); });

    renderGrid();

    // 3D book
    const stage = document.getElementById('book-stage');
    import('./book3d.js' + V).then((m) => {
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
      if (activeTier !== 'all' && tierOf(a) !== activeTier) return false;
      if (activeStage !== 'all' && !listOf(a, 'stages').includes(activeStage)) return false;
      if (activeSpecies !== 'all' && !listOf(a, 'species').includes(activeSpecies)) return false;
      if (activeRoute !== 'all' && !listOf(a, 'routes').includes(activeRoute)) return false;
      if (!q) return true;
      const t = tierOf(a);
      const tierText = t && TIERS[t] ? `tier ${t} ${TIERS[t].label} ${TIERS[t].name}` : '';
      const hay = [
        a.name, a.tagline,
        ...(a.tests || []), ...(a.providers || []).map((p) => p.name),
        ...(a.instruments || []).map((i) => i.name + ' ' + i.vendor),
        CATEGORIES[a.category] || '', tierText,
        ...listOf(a, 'stages').map(stageLabel),
        ...listOf(a, 'species').map((k) => SPECIES[k] || k),
        ...listOf(a, 'routes').map((k) => ROUTES[k] || k)
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
          <div class="types">${tierTag(a)}${a.drugTypes.map((d) => `<span class="type-tag">${esc(DRUG_TYPES[d] || d)}</span>`).join('')}</div>
          ${metaChips(a, 2)}`;
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

    let n = 0;
    const no = () => String(++n).padStart(2, '0');
    const sec = {};
    sec.bench = no();
    sec.tests = no();
    sec.fits = no();
    if (instruments.length) sec.machines = no();
    if (consumables.length) sec.consumables = no();
    sec.steps = no();
    sec.validation = no();
    if (providers.length) sec.providers = no();
    sec.market = no();

    main.innerHTML = `
      <article class="assay">
        <p class="crumb"><a href="#/">Catalog</a> / Chapter ${String(idx + 1).padStart(2, '0')}</p>
        <h1>${esc(a.name)}</h1>
        <p class="tagline">${esc(a.tagline)}</p>
        <div class="badges">
          <span class="type-tag">${esc(CATEGORIES[a.category] || a.category)}</span>
          ${tierTag(a)}
          ${a.drugTypes.map((d) => `<span class="type-tag">${esc(DRUG_TYPES[d] || d)}</span>`).join('')}
        </div>

        <dl class="assay-meta">
          ${listOf(a, 'stages').length ? `<div><dt>Development stage</dt><dd>${listOf(a, 'stages').map((k) => `<span class="meta-chip meta-stage"${STAGES[k] && STAGES[k].desc ? ` title="${esc(STAGES[k].desc)}"` : ''}>${esc(stageLabel(k))}</span>`).join('')}</dd></div>` : ''}
          ${listOf(a, 'species').length ? `<div><dt>Species</dt><dd>${listOf(a, 'species').map((k) => `<span class="meta-chip meta-species">${esc(SPECIES[k] || k)}</span>`).join('')}</dd></div>` : ''}
          ${listOf(a, 'routes').length ? `<div><dt>Delivery routes</dt><dd>${listOf(a, 'routes').map((k) => `<span class="meta-chip meta-route">${esc(ROUTES[k] || k)}</span>`).join('')}</dd></div>` : ''}
          <div><dt>Open literature</dt><dd><a class="lit-link" href="${esc(europePmcUrl(a))}" target="_blank" rel="noopener noreferrer">Search Europe PMC for reproducibility and validation studies</a></dd></div>
        </dl>

        <div class="section bench-section">
          <h2><span class="no">${sec.bench}</span> The bench, live</h2>
          <div id="bench-mount"></div>
        </div>

        <div class="section two-col">
          <div>
            <h2><span class="no">${sec.tests}</span> What it tests</h2>
            <ul class="checks">${(a.tests || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
          <div>
            <h2><span class="no">${sec.fits}</span> Fits these drug types</h2>
            <ul class="checks">${a.drugTypes.map((d) => `<li>${esc(DRUG_TYPES[d] || d)}</li>`).join('')}</ul>
            ${a.automation ? `<div class="note-card"><b>Protocol note</b>${esc(a.automation)}</div>` : ''}
          </div>
        </div>

        ${instruments.length ? `
        <div class="section">
          <h2><span class="no">${sec.machines}</span> The machines</h2>
          <table class="stack">
            <thead><tr><th>Instrument</th><th>Vendor</th><th>Role</th><th>Notes</th></tr></thead>
            <tbody>
              ${instruments.map((i) => `<tr><td><b>${esc(i.name)}</b></td><td>${esc(i.vendor)}</td><td>${esc(i.role)}</td><td class="sub">${esc(i.note)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}

        ${consumables.length ? `
        <div class="section">
          <h2><span class="no">${sec.consumables}</span> Pipettes & consumables</h2>
          <ul class="consumables">${consumables.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
        </div>` : ''}

        <div class="section">
          <h2><span class="no">${sec.steps}</span> Steps in the protocol</h2>
          <ol class="protocol">${(a.steps || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        </div>

        ${window.renderValidation ? window.renderValidation(a, { no: sec.validation }) : ''}

        ${providers.length ? `
        <div class="section">
          <h2><span class="no">${sec.providers}</span> Known providers</h2>
          <table class="stack">
            <thead><tr><th>Provider</th><th>What to know</th><th>Region</th></tr></thead>
            <tbody>
              ${providers.map((p) => `<tr class="provider-row"><td>${esc(p.name)}</td><td class="sub">${esc(p.note)}</td><td class="sub">${esc(p.region || '')}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}

        <div class="section">
          <h2><span class="no">${sec.market}</span> Market & capacity</h2>
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

    // live bench
    const mount = document.getElementById('bench-mount');
    const protocolList = main.querySelector('ol.protocol');
    const token = benchToken;
    import('./lab3d.js' + V).then((m) => {
      if (token !== benchToken || !mount.isConnected) return;
      bench = m.mountBench(mount, a, { protocolList });
    }).catch((err) => {
      if (token !== benchToken || !mount.isConnected) return;
      mount.innerHTML = '<p class="no-results">The live bench could not load. The protocol steps are listed below.</p>';
      console.warn('bench failed to load', err);
    });
  }

  function renderModelGaps() {
    main.innerHTML = `
      <article class="assay model-gaps-page">
        <p class="crumb"><a href="#/">Catalog</a> / AI model gaps</p>
        <div id="model-gaps-root"></div>
      </article>`;
    const root = document.getElementById('model-gaps-root');
    if (typeof window.renderModelGaps === 'function') {
      try {
        window.renderModelGaps(root, { assayLink: (id) => '#/assay/' + id });
      } catch (e) {
        console.warn('renderModelGaps failed', e);
        root.innerHTML = '<p class="no-results">The AI model gaps map could not be drawn. Please reload the page.</p>';
      }
    } else {
      root.innerHTML = '<h1>AI model gaps</h1><p class="no-results">The AI model gaps map is not available yet.</p>';
    }
    window.scrollTo({ top: 0 });
  }

  function setNav(h) {
    document.querySelectorAll('.topnav a').forEach((el) => {
      const href = el.getAttribute('href');
      const on = href === '#/model-gaps' ? h === '#/model-gaps' : h !== '#/model-gaps';
      if (on) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
    });
  }

  // ---------- Router ----------
  function route() {
    disposeBench();
    const h = location.hash;
    setNav(h);
    if (h === '#/model-gaps') { renderModelGaps(); return; }
    const m = h.match(/^#\/assay\/([\w-]+)$/);
    if (m) renderAssay(m[1]);
    else renderHome();
  }
  window.addEventListener('hashchange', route);
  route();
})();
