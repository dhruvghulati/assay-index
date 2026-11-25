// Assay template. Copy this file to js/data-14-<topic>.js and fill it in.
// Load it from index.html after js/data-13-gaps.js and before js/stages.js.
// pr() and P come from js/data-2.js and js/data.js. Do not redeclare them.
//
// id: lowercase, hyphenated, unique across every data file.
// category: one of binding, cell, safety, bioanalysis, qc, adme, genomics,
//   immunology, ionchannel, developability, cgt, peptide, disease-models,
//   invivo, production, pathology. A new one also needs CATEGORIES in
//   js/app.js and BY_CAT in js/stages.js.
// drugTypes: small-molecule, antibody, adc, peptide, oligo, cgt.
// providers: pr("key", "note"). The key must exist in P. Add a new provider
//   to P in this file if it is not already there, and only if their own site
//   shows they run this assay.

(function () {
  var add = {
    // exampleco: { name: "Example Co", region: "US" }
  };
  Object.keys(add).forEach(function (k) { if (!P[k]) P[k] = add[k]; });

  function A(o) {
    o.instruments = o.inst.map(function (r) {
      return { name: r[0], vendor: r[1], role: r[2], note: r[3] || "" };
    });
    delete o.inst;
    if (!ASSAYS.some(function (x) { return x.id === o.id; })) ASSAYS.push(o);
  }

  A({
    id: "example-assay",
    name: "Example Assay",
    category: "binding",
    tagline: "One sentence on what question this assay answers.",
    tests: [
      "The readout, in plain words"
    ],
    drugTypes: ["antibody"],
    inst: [
      ["Instrument name", "Vendor", "What it does here"]
    ],
    consumables: ["The things a lab consumes to run it"],
    automation: "What is hands-off, and what is not.",
    steps: [
      "First thing the lab does",
      "Last thing, which is usually the readout"
    ],
    providers: [
      // pr("exampleco", "The specific service they sell, not a slogan")
    ],
    marketNote: "When a program orders this, and what it is not a substitute for.",
    capacityNote: "What actually sets the timeline. No numbers unless a provider publishes them."
  });
})();
