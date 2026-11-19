// Development-cycle stage tags. Load after all data files, before validation.js.
// window.STAGES is an ordered map. applyStages sets a.stages on every assay.

(function () {
  window.STAGES = {
    "target-id": {
      label: "Target ID",
      desc: "Is the target real, and is it expressed where you think?"
    },
    "hit-finding": {
      label: "Hit finding",
      desc: "First binders or active molecules."
    },
    "hit-to-lead": {
      label: "Hit to lead",
      desc: "Confirm hits and drop the ones that will not progress."
    },
    "lead-opt": {
      label: "Lead optimisation",
      desc: "Improve potency, selectivity and developability."
    },
    "ind-enabling": {
      label: "IND-enabling",
      desc: "Safety, PK and tox work that supports a first-in-human filing."
    },
    cmc: {
      label: "CMC",
      desc: "Make the molecule, and show the process and the batch are controlled."
    },
    clinical: {
      label: "Clinical",
      desc: "Assays and models used on or for trial samples and patients."
    }
  };

  var BY_CAT = {
    binding: ["hit-finding", "hit-to-lead", "lead-opt"],
    cell: ["hit-finding", "hit-to-lead", "lead-opt"],
    safety: ["lead-opt", "ind-enabling"],
    bioanalysis: ["lead-opt", "ind-enabling", "clinical"],
    qc: ["hit-finding", "cmc"],
    adme: ["hit-to-lead", "lead-opt", "ind-enabling"],
    genomics: ["target-id", "clinical"],
    immunology: ["lead-opt", "ind-enabling", "clinical"],
    ionchannel: ["hit-finding", "lead-opt", "ind-enabling"],
    developability: ["hit-to-lead", "lead-opt"],
    cgt: ["lead-opt", "ind-enabling", "cmc", "clinical"],
    peptide: ["hit-finding", "lead-opt", "cmc"],
    "disease-models": ["hit-to-lead", "lead-opt"],
    invivo: ["lead-opt", "ind-enabling"],
    production: ["cmc"]
  };

  var BY_ID = {
    wgs: ["cmc", "clinical"],
    "wes-panel": ["clinical"],
    "liquid-biopsy-ctdna": ["clinical"],
    "mrd-ctdna": ["clinical"],
    "mrd-ngs-clonoseq": ["clinical"],
    "mrd-flow": ["clinical"],
    "cfdna-methylation": ["clinical"],
    "hla-typing": ["clinical"],
    "cell-line-genomic-stability": ["cmc"],
    "integration-site": ["ind-enabling", "cmc", "clinical"],
    scrnaseq: ["target-id", "lead-opt"],
    "spatial-tx": ["target-id", "lead-opt"],
    "crispr-pooled-screen": ["target-id", "hit-finding"],
    "perturb-seq": ["target-id"],
    "pdx-bioanalysis": ["lead-opt", "ind-enabling"],
    "pdx-efficacy": ["lead-opt"],
    "cdx-xenograft": ["lead-opt"],
    "glp-tox": ["ind-enabling"],
    "invivo-genotox": ["ind-enabling"],
    "cgt-biodistribution": ["ind-enabling"],
    "telemetry-cv": ["ind-enabling"],
    "nhp-pk": ["lead-opt", "ind-enabling"],
    "gmp-tech-transfer": ["cmc", "clinical"],
    "cell-line-development": ["cmc"],
    "spps-peptide": ["hit-finding", "lead-opt", "cmc"],
    "oligo-manufacturing": ["hit-finding", "lead-opt", "cmc"]
  };

  function applyStages(list) {
    var rows = list || (typeof ASSAYS !== "undefined" ? ASSAYS : []);
    rows.forEach(function (a) {
      var s = BY_ID[a.id] || BY_CAT[a.category] || ["lead-opt"];
      a.stages = s.filter(function (k) { return window.STAGES[k]; });
      if (!a.stages.length) a.stages = ["lead-opt"];
    });
    return rows;
  }

  window.applyStages = applyStages;
  if (typeof ASSAYS !== "undefined") applyStages(ASSAYS);
})();
