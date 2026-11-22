// Expansion 13 - gaps named in replies after the v2 post (Nov 20-21 2026).
// Load after data-12. Uses P and pr() from data-2.js. Plain ASCII.

(function () {
  var add = {
    acrobio: { name: "ACROBiosystems", region: "US/CN" },
    twist: { name: "Twist Bioscience", region: "US" },
    litmus: { name: "Litmus Science", region: "US" },
    rootpath: { name: "RootPath (BinderVerse)", region: "US" },
    solvias: { name: "Solvias", region: "CH/US" },
    kbi: { name: "KBI Biopharma", region: "US" },
    phenovista: { name: "PhenoVista Biosciences", region: "US" },
    nuvisan: { name: "Nuvisan", region: "EU" },
    histowiz: { name: "HistoWiz", region: "US" },
    stagebio: { name: "StageBio", region: "US/DE" },
    iqvia: { name: "IQVIA Laboratories", region: "Global" }
  };
  Object.keys(add).forEach(function (k) { if (!P[k]) P[k] = add[k]; });

  function has(a, name) {
    return (a.providers || []).some(function (p) { return p.name === name; });
  }
  function push(id, key, note) {
    var a = ASSAYS.find(function (x) { return x.id === id; });
    if (a && !has(a, P[key].name)) a.providers.push(pr(key, note));
  }

  // @jusjosgra: ACROBiosystems SPR and BLI, Biacore 8K and Octet.
  push("spr", "acrobio", "SPR on Biacore 8K; US lab ISO/IEC 17025 accredited for SPR");
  push("bli", "acrobio", "BLI on ForteBio Octet, antibody screening and kinetics");
  // @anthonygitter: Twist SPR/BLI; Ginkgo binding and developability.
  push("spr", "twist", "Carterra LSA SPR for antibody panels, kinetics and epitope binning");
  push("bli", "twist", "Octet BLI kinetics as part of antibody characterisation");
  push("spr", "ginkgo", "Antibody binding and developability data at panel scale");
  push("bli", "ginkgo", "Binding screens at panel scale");
  // @arun_nij: Litmus quotes SPR and BLI with a published turnaround.
  push("spr", "litmus", "SPR kinetics, kon/koff/KD, quoted at 5-7 business days");
  push("bli", "litmus", "Arrayed binding by BLI, quoted at about 5 days");
  // @RootPathGx: BinderVerse, BLI plus cell binding and T cell activation.
  push("bli", "rootpath", "BinderVerse: expression plus BLI, with published per-binder pricing");

  // @DrAnneCarpenter: more than three Cell Painting providers.
  push("cellpainting", "phenovista", "Cell Painting sold as its own assay service, San Diego");
  push("cellpainting", "nuvisan", "Cell Painting service; contributed data to the JUMP-CP consortium");

  // @LizAlbertorio, second reply: IQVIA and Catalent.
  ["elisa", "msd", "ada", "lcms-pk"].forEach(function (id) {
    push(id, "iqvia", "Large-molecule immunoassay, PK and immunogenicity, discovery through clinic");
  });
  push("cgt-release-panel", "solvias", "CGT release: identity, purity, potency and viral safety");
  push("tcid50-infectious", "solvias", "Infectious titer and vector release testing");
})();

(function () {
  function A13(o) {
    o.instruments = o.inst.map(function (r) {
      return { name: r[0], vendor: r[1], role: r[2], note: r[3] || "" };
    });
    delete o.inst;
    if (!ASSAYS.some(function (x) { return x.id === o.id; })) ASSAYS.push(o);
  }

  // @LizAlbertorio: viral safety for cell and gene therapy was missing.
  A13({
    id: "viral-safety-cgt",
    name: "Viral Safety Testing (Adventitious Agents and Clearance)",
    category: "cgt",
    tagline: "Shows a cell bank, harvest or vector lot is free of viruses, and that the process removes the ones you spike in.",
    tests: [
      "In vitro adventitious virus assay on harvest or bank",
      "NGS adventitious-agent screen as an animal-test alternative",
      "Replication-competent virus (rcAAV, RCL)",
      "Viral clearance across the purification steps"
    ],
    drugTypes: ["cgt", "antibody"],
    inst: [
      ["Indicator cell panels", "various", "In vitro adventitious virus assay"],
      ["NGS viral safety assay", "Charles River / PathoQuest", "Broad adventitious-agent screen"]
    ],
    consumables: [
      "Cell bank or unprocessed bulk vials",
      "Model viruses for spiking studies",
      "Indicator cell lines",
      "NGS library reagents"
    ],
    automation: "NGS screens are automated after extraction. Cell-based virus assays and clearance studies are hands-on and scheduled.",
    steps: [
      "Pick the panel: bank characterisation, harvest test, or clearance",
      "Run the in vitro adventitious assay and a targeted PCR panel",
      "Run an NGS adventitious-agent screen where it replaces in vivo testing",
      "For clearance, spike model viruses and measure log reduction per step",
      "Test for replication-competent virus on the vector lot",
      "Report per ICH Q5A, with the method qualification stated"
    ],
    providers: [
      pr("crl", "Viral safety, clearance studies, and GMP NGS adventitious-virus testing"),
      pr("solvias", "Viral safety and biosafety within CGT release testing"),
      pr("kbi", "Phase-appropriate viral clearance studies for biologics")
    ],
    marketNote: "Required before an IND for anything grown in a cell line, and for every cell and gene therapy lot. NGS is replacing some of the animal tests.",
    capacityNote: "Clearance studies need a booked virus lab and weeks, not days. Ask which panel is qualified before you reserve the manufacturing slot."
  });

  // @sciencekelso: tissue and pathology was named as the next large gap.
  A13({
    id: "ihc-ish",
    name: "IHC and ISH Staining (Tissue Biomarkers)",
    category: "pathology",
    tagline: "Stains a protein or RNA in intact tissue, so you can see where a target or a response actually sits.",
    tests: [
      "Target expression and where it sits in the tissue",
      "Pharmacodynamic markers after dosing",
      "RNAscope-style RNA in situ hybridisation"
    ],
    drugTypes: ["antibody", "adc", "small-molecule", "cgt"],
    inst: [
      ["BOND RX or Benchmark ULTRA", "Leica / Roche Ventana", "Automated staining"],
      ["Whole-slide scanner", "various", "Digitising stained slides"]
    ],
    consumables: ["FFPE blocks or slides", "Primary antibodies", "Detection kits", "RNAscope probes"],
    automation: "Staining is automated. Scoring still needs a pathologist, unless you pay for image analysis.",
    steps: [
      "Cut sections from FFPE blocks",
      "Optimise the antibody or probe and the retrieval",
      "Stain the study slides with controls on the same run",
      "Digitise the slides",
      "Score by a pathologist or by image analysis"
    ],
    providers: [
      pr("histowiz", "Automated histology with 400+ validated antibodies, plus digitisation"),
      pr("neogenomics", "High-throughput IHC and ISH, 300+ validated assays"),
      pr("stagebio", "IHC, IF and ISH for discovery and GLP studies")
    ],
    marketNote: "The workhorse tissue assay. Most programs hit it twice: once to check the target is there, once to show the drug did something.",
    capacityNote: "A validated stain is days. Developing a new one is weeks, and the antibody usually decides that."
  });

  A13({
    id: "glp-histopath",
    name: "GLP Histopathology (Necropsy, Slides, Pathology Report)",
    category: "pathology",
    tagline: "Turns tissues from a tox study into a pathologist's report a regulator will read.",
    tests: [
      "Organ weights and gross findings at necropsy",
      "Microscopic findings by organ",
      "Peer review of the pathology report"
    ],
    drugTypes: ["small-molecule", "antibody", "peptide", "oligo", "cgt"],
    inst: [
      ["Tissue processor and microtome", "Leica", "FFPE block and slide making"],
      ["Whole-slide scanner", "various", "Digital peer review"]
    ],
    consumables: ["Fixative and cassettes", "H&E stains", "Control slides", "SEND-ready data tables"],
    automation: "Processing and staining are automated. The read and the report are a veterinary pathologist's time.",
    steps: [
      "Necropsy the study animals and fix tissues",
      "Trim, process, embed and cut",
      "Stain H&E, plus special stains where agreed",
      "Pathologist reads the slides and writes findings",
      "Peer review, then lock the report"
    ],
    providers: [
      pr("stagebio", "GLP necropsy, histology and toxicologic pathology, US and Germany"),
      pr("histowiz", "GLP and non-GLP histology, slides digitised in about 3 days"),
      pr("crl", "Histopathology inside full GLP tox programs")
    ],
    marketNote: "This is the readout of every repeat-dose tox study. It sits next to in-life tox, not inside it, because a different lab often does it.",
    capacityNote: "Slide making is the fast part. Pathologist time and peer review set the date of the report."
  });
})();
