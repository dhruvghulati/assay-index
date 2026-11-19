// Expansion 9 — responses to community feedback (Nov 2026):
// more genomics assays, standard antibody developability assays (HIC, AC-SINS, ...),
// a "complex disease models" section, and Teiko in flow cytometry.

Object.assign(P, {
  teiko: { name: "Teiko", region: "US" },
  modulo: { name: "Modulo Bio", region: "US (San Diego)" },
  emulate: { name: "Emulate", region: "US" },
  cnbio: { name: "CN Bio", region: "UK" },
  hub: { name: "HUB Organoids", region: "NL" },
  crown: { name: "Crown Bioscience", region: "Global" },
  insphero: { name: "InSphero", region: "CH/US" },
  mimetas: { name: "MIMETAS", region: "NL" },
  axol: { name: "Axol Bioscience", region: "UK" },
  bitbio: { name: "bit.bio", region: "UK" },
  newcells: { name: "Newcells Biotech", region: "UK" },
  azenta: { name: "Azenta (GENEWIZ)", region: "Global" },
  novogene: { name: "Novogene", region: "Global" },
  activemotif: { name: "Active Motif", region: "US/EU" },
  cellecta: { name: "Cellecta", region: "US" },
  synthego: { name: "Synthego", region: "US" },
  adaptive: { name: "Adaptive Biotechnologies", region: "US" },
  genewerk: { name: "GeneWerk", region: "DE" },
  atcc: { name: "ATCC", region: "US" },
  ginkgo: { name: "Ginkgo Datapoints", region: "US" },
  coriolis: { name: "Coriolis Pharma", region: "DE" },
  fairjourney: { name: "FairJourney Biologics", region: "PT" },
  abzena: { name: "Abzena", region: "UK/US" },
  champions: { name: "Champions Oncology", region: "US" }
});

// Teiko — CLIA-certified cytometry lab for clinical-trial immune monitoring (teiko.bio)
(function () {
  const add = (id, note) => {
    const a = ASSAYS.find((x) => x.id === id);
    if (a && !a.providers.some((p) => p.name === "Teiko")) a.providers.push(pr("teiko", note));
  };
  add("flow", "CLIA-certified spectral and mass cytometry for clinical trials; TBNK/T-cell presets, blood stabilisation kits, MRD");
  add("receptor-occupancy", "Clinical-trial cytometry with sample stabilisation for shipped blood");
})();

// Recategorise biologics stability assays that were filed elsewhere
["developability-panel", "nanodsf", "dsc-calorimetry"].forEach((id) => {
  const a = ASSAYS.find((x) => x.id === id);
  if (a) a.category = "developability";
});

ASSAYS.push(
  // ---------------- Genomics ----------------
  {
    id: "scrnaseq", name: "Single-Cell RNA-seq (scRNA-seq)", category: "genomics",
    tagline: "Transcriptomes cell by cell. Shows which cell states a drug shifts.",
    tests: ["Cell-type composition changes after treatment", "Cell-state specific mechanism of action", "Rare responder or resistant subpopulations"],
    drugTypes: ["small-molecule", "antibody", "oligo", "cgt", "peptide"],
    instruments: [
      { name: "Chromium X (droplet single-cell)", vendor: "10x Genomics", role: "Partition cells and barcode", note: "Thousands to ~1M cells per run with Flex" },
      { name: "NovaSeq X", vendor: "Illumina", role: "Short-read sequencing", note: "Depth 20–50k reads per cell" }
    ],
    consumables: ["Single-cell chips and gel beads", "Viable single-cell suspension (>80% viability)", "Library prep kit + index plates", "SPRI beads"],
    automation: "Library prep automates on liquid handlers; dissociation and viability are the manual bottleneck.",
    steps: [
      "Dissociate tissue or harvest treated cells into a single-cell suspension",
      "Count cells and check viability",
      "Load cells, gel beads and oil onto the chip to make droplets",
      "Reverse-transcribe inside droplets to barcode each cell",
      "Break emulsion, amplify cDNA and build indexed libraries",
      "Sequence libraries on the flow cell",
      "Align reads, demultiplex barcodes and call cell types",
      "Compare cell-state proportions and differential expression across doses"
    ],
    providers: [pr("azenta", "Single-cell sequencing service"), pr("novogene", "10x single-cell libraries and analysis"), pr("crl", "Discovery genomics")],
    marketNote: "Standard readout for MoA and target discovery; Flex/fixed-RNA kits make drug-screen scale feasible.",
    capacityNote: "Sequencing capacity is plentiful; sample prep and analysis expertise limit turnaround."
  },
  {
    id: "spatial-tx", name: "Spatial Transcriptomics", category: "genomics",
    tagline: "Gene expression mapped onto tissue. Where the drug acts, not just whether.",
    tests: ["Target and pathway expression in tissue context", "Tumour–immune neighbourhoods after treatment", "Off-target tissue responses in tox sections"],
    drugTypes: ["antibody", "adc", "small-molecule", "cgt", "oligo"],
    instruments: [
      { name: "Visium HD / Xenium", vendor: "10x Genomics", role: "Sequencing- or imaging-based spatial capture", note: "Subcellular resolution on Xenium" },
      { name: "CosMx SMI / GeoMx DSP", vendor: "Bruker (NanoString)", role: "In situ imaging of RNA/protein panels", note: "Up to whole-transcriptome panels" },
      { name: "MERSCOPE", vendor: "Vizgen", role: "MERFISH imaging", note: "" }
    ],
    consumables: ["FFPE or fresh-frozen sections on capture slides", "Gene panels / probes", "Imaging reagents", "Flow-cell cassettes"],
    automation: "Instrument runs are walk-away; sectioning, pathology review and segmentation remain manual.",
    steps: [
      "Section tissue onto capture slides",
      "Stain and image H&E for morphology",
      "Hybridise probes or permeabilise to capture RNA",
      "Load slide into the imaging or sequencing instrument and run",
      "Read decoded transcripts per spot or cell",
      "Segment cells and map expression back to tissue",
      "Analyse neighbourhoods and compare treated vs control"
    ],
    providers: [pr("crl", "Spatial biology in tox and oncology studies"), pr("crown", "Spatial profiling of tumour models"), pr("azenta", "Spatial genomics service")],
    marketNote: "Fast-growing translational readout; panel choice and segmentation drive cost.",
    capacityNote: "Instrument time and pathologist review are constrained; cross-platform comparability still being established."
  },
  {}
);
ASSAYS.pop(); // placeholder closer

// Compact builder for the remaining entries
function A9(o) {
  o.instruments = o.inst.map(([name, vendor, role, note]) => ({ name, vendor, role, note: note || "" }));
  delete o.inst;
  ASSAYS.push(o);
}

A9({
  id: "crispr-pooled-screen", name: "Pooled CRISPR Screen (KO / CRISPRi / CRISPRa)", category: "genomics",
  tagline: "Perturb every gene at once and see which ones change the phenotype.",
  tests: ["Target identification and essentiality", "Drug resistance and sensitiser genes", "Mechanism of action via genetic modifiers"],
  drugTypes: ["small-molecule", "antibody", "oligo", "cgt"],
  inst: [["NextSeq 2000", "Illumina", "Guide-count sequencing"], ["Cell sorter (FACS-based screens)", "BD / Sony", "Phenotype selection", "Optional"]],
  consumables: ["Genome-wide sgRNA library (e.g. Brunello)", "Lentivirus", "Cas9 or dCas9 cell line", "Selection drug", "gDNA extraction and PCR kits"],
  automation: "Cell expansion is most of the hands-on time; guide PCR and analysis are routine.",
  steps: [
    "Transduce Cas9 cells with the pooled sgRNA lentivirus at low MOI",
    "Select transduced cells and keep over 500 cells per guide",
    "Split into drug and vehicle arms and culture for 2–3 weeks",
    "Harvest cells and extract genomic DNA",
    "PCR-amplify guide cassettes with indexed primers",
    "Sequence guide amplicons",
    "Count guides and rank genes (MAGeCK or similar)"
  ],
  providers: [pr("cellecta", "Pooled library design and screening service"), pr("synthego", "CRISPR cell engineering and screens"), pr("evotec", "Functional genomics")],
  marketNote: "Core target-discovery tool; CRISPRi/a extend to non-essential and dosage-sensitive genes.",
  capacityNote: "Cell numbers and coverage set cost; hit validation needs arrayed follow-up."
});

A9({
  id: "perturb-seq", name: "Perturb-seq (CRISPR + single-cell readout)", category: "genomics",
  tagline: "Each cell carries one perturbation and reports its whole transcriptome.",
  tests: ["Gene-function maps from transcriptional signatures", "Target-to-pathway mechanism", "Matching drug signatures to genetic knockdowns"],
  drugTypes: ["small-molecule", "antibody", "oligo", "cgt"],
  inst: [["Chromium X", "10x Genomics", "Single-cell capture with guide capture"], ["NovaSeq X", "Illumina", "Sequencing"]],
  consumables: ["Targeted or genome-scale sgRNA library with capture sequence", "Cas9/dCas9 cells", "Single-cell kits with feature barcoding"],
  automation: "Same wet workflow as scRNA-seq plus guide libraries; analysis is the specialist step.",
  steps: [
    "Transduce cells with the sgRNA library",
    "Culture to allow knockdown to take effect",
    "Load cells onto the single-cell chip",
    "Barcode transcripts and guides in droplets",
    "Build gene-expression and guide libraries",
    "Sequence both libraries",
    "Assign guides to cells and analyse signatures per perturbation"
  ],
  providers: [pr("azenta", "Single-cell and CRISPR library sequencing"), pr("cellecta", "Perturbation libraries"), pr("novogene", "Single-cell sequencing")],
  marketNote: "Moving from academic labs into target-ID platforms; scale limited by cost per cell.",
  capacityNote: "Few CROs offer end to end; most run it in-house."
});

A9({
  id: "atac-seq", name: "ATAC-seq (Chromatin Accessibility)", category: "genomics",
  tagline: "Which regulatory DNA opens or closes when a drug hits a cell.",
  tests: ["Chromatin accessibility changes", "Transcription-factor activity footprints", "Epigenetic drug mechanism"],
  drugTypes: ["small-molecule", "oligo", "cgt"],
  inst: [["NextSeq 2000", "Illumina", "Paired-end sequencing"], ["TapeStation", "Agilent", "Fragment-size QC"]],
  consumables: ["Tn5 transposase kit", "Nuclei isolation buffers", "Indexed PCR primers", "SPRI beads"],
  automation: "Fast bench protocol (hours); nuclei quality is the main variable.",
  steps: [
    "Isolate nuclei from treated and control cells",
    "Tagment accessible DNA with Tn5",
    "Purify and PCR-amplify with indexed primers",
    "Check fragment ladder on TapeStation",
    "Sequence paired-end",
    "Call peaks and compare accessibility across conditions"
  ],
  providers: [pr("activemotif", "ATAC-seq service and analysis"), pr("novogene", "Epigenomics sequencing"), pr("azenta", "ATAC-seq libraries")],
  marketNote: "Default epigenomic readout for MoA; single-cell ATAC is growing.",
  capacityNote: "Plentiful capacity."
});

A9({
  id: "cut-run", name: "CUT&RUN / CUT&Tag / ChIP-seq", category: "genomics",
  tagline: "Where a protein or histone mark sits on the genome, before and after treatment.",
  tests: ["Target occupancy of transcription factors and degrader targets", "Histone-mark changes (epigenetic drugs)", "On-target chromatin engagement"],
  drugTypes: ["small-molecule", "oligo"],
  inst: [["NextSeq 2000", "Illumina", "Sequencing"], ["Magnetic rack / KingFisher", "Thermo Fisher", "Bead handling"]],
  consumables: ["Validated antibody for the target or mark", "pA/G-MNase or pA-Tn5", "Concanavalin A beads", "Spike-in DNA"],
  automation: "CUT&RUN runs in plates and automates well; ChIP is more manual.",
  steps: [
    "Bind permeabilised cells to ConA beads",
    "Incubate with primary antibody against the target",
    "Add pA/G-MNase and activate cleavage with calcium",
    "Release and purify cut fragments",
    "Build libraries and sequence",
    "Call peaks and normalise to spike-in"
  ],
  providers: [pr("activemotif", "CUT&RUN, CUT&Tag and ChIP-seq services"), pr("crl", "Epigenetics discovery")],
  marketNote: "Antibody quality determines success; CUT&RUN needs far fewer cells than ChIP.",
  capacityNote: "Specialist providers; turnaround 3–6 weeks."
});

A9({
  id: "integration-site", name: "Vector Integration-Site Analysis (ISA)", category: "genomics",
  tagline: "Maps where lentiviral or retroviral vectors landed in the genome. Watches for clonal expansion.",
  tests: ["Integration sites near oncogenes", "Clonal dominance over time in patients", "Safety follow-up for gene-modified cells"],
  drugTypes: ["cgt"],
  inst: [["MiSeq / NextSeq", "Illumina", "Junction sequencing"], ["Covaris sonicator", "Covaris", "DNA shearing"]],
  consumables: ["Patient or product gDNA", "Linker adaptors", "LTR-specific primers", "Library prep kit"],
  automation: "Library prep is semi-automated; bioinformatics and longitudinal tracking are the specialist work.",
  steps: [
    "Extract gDNA from product or patient blood",
    "Shear DNA and ligate linker adaptors",
    "PCR-amplify vector to genome junctions (LAM-PCR or LM-PCR)",
    "Sequence junction libraries",
    "Map junctions to the genome and count clones",
    "Report clonal abundance and sites near cancer genes"
  ],
  providers: [pr("genewerk", "Integration-site analysis for gene therapy"), pr("crl", "CGT safety testing")],
  marketNote: "Expected in long-term follow-up for integrating vectors.",
  capacityNote: "Few specialist labs; long-term studies lock in one provider."
});

A9({
  id: "longread-vector", name: "Long-Read Vector Genome Integrity (PacBio / Nanopore)", category: "genomics",
  tagline: "Reads whole AAV or plasmid genomes end to end to find truncations and contaminants.",
  tests: ["Full-length vs truncated AAV genomes", "ITR integrity", "Host-cell and plasmid DNA contaminants"],
  drugTypes: ["cgt"],
  inst: [["Revio / Sequel IIe", "PacBio", "HiFi long-read sequencing"], ["PromethION", "Oxford Nanopore", "Nanopore long reads"]],
  consumables: ["Purified vector DNA", "SMRTbell or ligation library kits", "Size-selection beads"],
  automation: "Library prep is short; read analysis needs vector-aware pipelines.",
  steps: [
    "Extract encapsidated DNA from purified AAV",
    "Anneal and repair single-stranded genomes",
    "Build long-read libraries without fragmenting",
    "Load the SMRT cell or flow cell and sequence",
    "Align reads to the vector reference",
    "Classify full, partial and contaminant species"
  ],
  providers: [pr("azenta", "Long-read sequencing service"), pr("crl", "Viral vector analytics")],
  marketNote: "Increasingly requested alongside empty/full ratio for AAV release and comparability.",
  capacityNote: "Few providers run validated vector-specific pipelines."
});

A9({
  id: "tcr-bcr-seq", name: "TCR / BCR Repertoire Sequencing", category: "genomics",
  tagline: "Counts every T- or B-cell clone. Shows which ones a drug expands.",
  tests: ["Clonal expansion after immunotherapy or vaccination", "CAR-T persistence and clonality", "Minimal residual disease tracking in lymphoid cancers"],
  drugTypes: ["antibody", "cgt", "peptide"],
  inst: [["NextSeq / MiSeq", "Illumina", "Amplicon sequencing"], ["Chromium X", "10x Genomics", "Paired-chain single-cell VDJ", "Optional"]],
  consumables: ["Genomic DNA or RNA from blood, PBMC or tumour", "Multiplex V/J primer sets (e.g. immunoSEQ)", "Library and index kits", "Spike-in synthetic templates for quantitation"],
  automation: "Extraction and multiplex PCR run on liquid handlers; clone calling is a standard pipeline.",
  steps: [
    "Extract gDNA or RNA from blood, PBMC or tissue",
    "Quantify input to set the number of cells sampled",
    "Amplify CDR3 regions with multiplex V/J primers",
    "Add indexes and pool libraries",
    "Sequence amplicons",
    "Collapse reads into clonotypes and correct PCR bias",
    "Compare clonality, diversity and tracked clones across time points"
  ],
  providers: [pr("adaptive", "immunoSEQ research service and clonoSEQ MRD (FDA-cleared)"), pr("azenta", "Immune repertoire sequencing"), pr("novogene", "TCR/BCR sequencing")],
  marketNote: "Adaptive's immunoSEQ is the reference service; single-cell VDJ adds alpha/beta pairing for antigen discovery.",
  capacityNote: "Sample input limits sensitivity for rare clones; bulk methods do not pair chains."
});

A9({
  id: "methylation-seq", name: "DNA Methylation Sequencing (EM-seq / Bisulfite)", category: "genomics",
  tagline: "Maps 5-methylcytosine across the genome. Shows epigenetic drug effects.",
  tests: ["On-target effect of DNMT or epigenetic inhibitors", "Epigenetic drift in cell lines and cell therapies", "Methylation biomarkers (cfDNA)"],
  drugTypes: ["small-molecule", "oligo", "cgt"],
  inst: [["NovaSeq X", "Illumina", "Whole-genome or targeted sequencing"], ["Infinium MethylationEPIC array", "Illumina", "Array alternative", "~935k CpGs"]],
  consumables: ["Enzymatic conversion kit (NEB EM-seq) or bisulfite kit", "Methylated/unmethylated control DNA", "Library prep kit", "Targeted capture panel (optional)"],
  automation: "Conversion and library prep automate well; alignment uses Bismark or similar.",
  steps: [
    "Extract and quantify genomic DNA",
    "Fragment DNA and ligate adaptors",
    "Convert unmethylated C by bisulfite or enzymatic (TET2/APOBEC) treatment",
    "Amplify and index libraries",
    "Sequence to the required CpG coverage",
    "Align with a conversion-aware aligner and call methylation per CpG",
    "Find differentially methylated regions between conditions"
  ],
  providers: [pr("activemotif", "Methylation profiling services"), pr("novogene", "WGBS and targeted methylation sequencing"), pr("azenta", "Methylation sequencing")],
  marketNote: "EM-seq is replacing bisulfite because it damages less DNA; arrays remain cheapest for large human cohorts.",
  capacityNote: "Whole-genome depth is costly; targeted panels or arrays cut cost but miss regions."
});

A9({
  id: "cell-line-genomic-stability", name: "Cell-Line Authentication & Genomic Stability (STR, Karyotype, SNP array)", category: "genomics",
  tagline: "Confirms a cell line is what it says and has not drifted.",
  tests: ["Cell-line identity and cross-contamination (STR)", "Karyotype abnormalities in master cell banks and iPSC lines", "Copy-number changes and loss of heterozygosity (SNP array)"],
  drugTypes: ["antibody", "adc", "cgt", "peptide"],
  inst: [["Capillary electrophoresis (3500 Genetic Analyzer)", "Thermo Fisher", "STR fragment sizing"], ["Brightfield microscope + karyotyping software", "Various", "G-banding"], ["SNP microarray scanner", "Illumina", "Genome-wide CNV/LOH"]],
  consumables: ["STR multiplex kit", "Colcemid and hypotonic solution", "Giemsa stain", "SNP array chips", "Reference STR databases (ATCC, Cellosaurus)"],
  automation: "STR and arrays are routine; G-banding needs a trained cytogeneticist reading metaphases.",
  steps: [
    "Collect cells or DNA from the bank or passage to test",
    "Amplify STR loci and size fragments by capillary electrophoresis",
    "Match the STR profile against reference databases",
    "Arrest cells in metaphase and prepare chromosome spreads",
    "Stain with Giemsa and count and band 20+ metaphases",
    "Run SNP array to detect sub-microscopic CNVs and LOH",
    "Report identity, karyotype and any recurrent abnormalities"
  ],
  providers: [pr("atcc", "STR profiling and cell-line authentication"), pr("crl", "Cell bank characterisation and karyology")],
  marketNote: "Many journals and funders require STR authentication; regulators expect bank characterisation under ICH Q5D.",
  capacityNote: "G-banding resolution is ~5-10 Mb; iPSC lines often add SNP arrays to catch common 20q11.21 gains."
});

// ---------------- Developability (standard antibody panel) ----------------
// Jain et al. 2017, PNAS 114:944 - 12 biophysical assays across 137 clinical-stage antibodies;
// worst-10% values of approved antibodies are widely used as flag thresholds.
const JAIN9 = "Part of the Jain et al. 2017 PNAS panel (12 assays across 137 clinical antibodies) that set the reference flag thresholds used today.";
const DEV9 = ["antibody", "adc"];

A9({
  id: "hic", name: "Hydrophobic Interaction Chromatography (HIC)", category: "developability",
  tagline: "Measures surface hydrophobicity. Late elution flags aggregation risk.",
  tests: ["Surface hydrophobicity of antibodies", "Aggregation and poor-PK risk", "Drug-to-antibody ratio of cysteine-linked ADCs"],
  drugTypes: DEV9,
  inst: [["UHPLC with UV detection", "Agilent / Waters / Thermo", "Gradient separation"], ["HIC column (e.g. butyl or phenyl NPR)", "Tosoh / Thermo", "Stationary phase"]],
  consumables: ["Ammonium sulfate high-salt buffer", "Phosphate low-salt buffer", "Reference antibodies with known retention", "Purified protein (~10-20 ug per run)"],
  automation: "Fully automated autosampler runs; 96 samples per day per system is typical.",
  steps: [
    "Buffer-exchange or dilute antibody into high-salt mobile phase",
    "Equilibrate the HIC column in high ammonium sulfate",
    "Inject sample and reference antibodies",
    "Run a descending salt gradient",
    "Record retention time by UV 280 nm",
    "Normalise retention against reference standards",
    "Flag clones above the clinical-antibody threshold"
  ],
  providers: [pr("ginkgo", "High-throughput developability datasets"), pr("fairjourney", "Developability profiling of discovery hits"), pr("abzena", "Developability and biophysical characterisation"), pr("wuxi", "Biologics developability assessment")],
  marketNote: JAIN9 + " Also the standard DAR method for cysteine ADCs.",
  capacityNote: "Cheap and fast; salt conditions vary between labs, so compare only against in-run references."
});

A9({
  id: "ac-sins", name: "AC-SINS (Affinity-Capture Self-Interaction Nanoparticle Spectroscopy)", category: "developability",
  tagline: "Gold nanoparticles carrying the antibody cluster if it self-associates.",
  tests: ["Antibody self-association", "Viscosity and opalescence risk at high concentration", "Early ranking of hundreds of clones from crude supernatant"],
  drugTypes: DEV9,
  inst: [["UV-Vis plate reader", "BMG / Molecular Devices / Tecan", "Plasmon absorbance scan 450-650 nm"]],
  consumables: ["Gold nanoparticles (~20 nm)", "Anti-human Fc capture antibody", "PEG thiol blocker", "384-well plates", "Positive/negative control antibodies"],
  automation: "Plate-based and liquid-handler friendly; works with low-microgram amounts.",
  steps: [
    "Coat gold nanoparticles with anti-Fc capture antibody",
    "Block remaining surface with PEG thiol",
    "Mix coated particles with test antibody in buffer",
    "Incubate to let captured antibodies interact",
    "Scan absorbance spectrum across 450-650 nm",
    "Calculate plasmon wavelength shift versus buffer control",
    "Flag clones with large red-shift as self-interacting"
  ],
  providers: [pr("ginkgo", "AC-SINS in high-throughput developability panels"), pr("fairjourney", "Discovery-stage developability"), pr("coriolis", "Biophysical and colloidal characterisation")],
  marketNote: JAIN9 + " Most widely used early self-interaction screen.",
  capacityNote: "Sensitive to buffer and pH; run controls on every plate."
});

A9({
  id: "polyreactivity", name: "Polyreactivity / Polyspecificity (PSR, BVP ELISA, CHO lysate)", category: "developability",
  tagline: "Checks whether an antibody sticks to everything. Sticky clones clear fast.",
  tests: ["Non-specific binding to membrane proteins (PSR)", "Binding to baculovirus particles (BVP ELISA)", "Off-target stickiness linked to fast clearance"],
  drugTypes: DEV9,
  inst: [["Flow cytometer", "BD / Beckman / Sony", "PSR readout with yeast or beads"], ["Plate reader", "Various", "BVP / DNA / insulin ELISA"]],
  consumables: ["Biotinylated soluble membrane protein (SMP) reagent from CHO or HEK cells", "Baculovirus particle preparation", "Streptavidin detection reagents", "Reference high- and low-polyreactivity antibodies"],
  automation: "Plate- or flow-based, runs in 96/384 format on discovery hits.",
  steps: [
    "Prepare biotinylated cell-lysate SMP reagent or coat plates with BVP",
    "Display antibody on yeast or capture on beads (PSR), or add to coated wells (ELISA)",
    "Incubate with the polyspecificity reagent",
    "Wash and add fluorescent streptavidin or HRP detection",
    "Read by flow cytometry or absorbance",
    "Normalise to reference high and low controls",
    "Flag clones above the clinical-antibody threshold"
  ],
  providers: [pr("ginkgo", "Polyreactivity in developability panels"), pr("fairjourney", "Developability screening"), pr("abzena", "Developability assessment")],
  marketNote: JAIN9 + " BVP score correlates with faster clearance in humans and monkeys.",
  capacityNote: "Reagents are lab-made and vary; scores are only comparable to in-house references."
});

A9({
  id: "cic", name: "Cross-Interaction Chromatography (CIC)", category: "developability",
  tagline: "Runs an antibody over a column of polyclonal IgG. Delay means stickiness.",
  tests: ["Non-specific interaction with other antibodies", "Solubility and aggregation risk", "Ranking clones for formulation"],
  drugTypes: DEV9,
  inst: [["HPLC with UV detection", "Agilent / Waters", "Isocratic run"], ["Column with immobilised polyclonal human IgG", "Custom-coupled", "Stationary phase"]],
  consumables: ["NHS-activated resin coupled with polyclonal human IgG", "Control column without IgG", "PBS running buffer", "Reference antibodies"],
  automation: "Autosampler-driven isocratic runs; column preparation is manual.",
  steps: [
    "Couple polyclonal human IgG to an NHS-activated column",
    "Prepare a matched control column",
    "Inject antibody under isocratic PBS flow",
    "Record retention time on both columns",
    "Calculate retention factor k' versus control",
    "Flag clones with high retention"
  ],
  providers: [pr("ginkgo", "Developability datasets"), pr("abzena", "Biophysical developability")],
  marketNote: JAIN9,
  capacityNote: "Column-to-column variability is high; many labs replaced it with AC-SINS or CSI-BLI."
});

A9({
  id: "smac", name: "Standup Monolayer Adsorption Chromatography (SMAC)", category: "developability",
  tagline: "SEC-like column with a hydrophobic monolayer. Retention flags aggregation-prone clones.",
  tests: ["Colloidal stability and aggregation propensity", "Non-specific column interaction", "Clone ranking alongside HIC"],
  drugTypes: DEV9,
  inst: [["UHPLC with UV detection", "Agilent / Waters", "Isocratic run"], ["Zenix SEC-300 column", "Sepax", "Standup monolayer stationary phase"]],
  consumables: ["Phosphate running buffer", "Reference antibodies", "Purified protein (~10 ug per run)"],
  automation: "Fully automated; high throughput on standard HPLC.",
  steps: [
    "Equilibrate the SMAC column in phosphate buffer",
    "Inject purified antibody",
    "Run isocratic elution",
    "Record retention time by UV",
    "Compare against reference antibodies",
    "Flag clones with long retention"
  ],
  providers: [pr("ginkgo", "Developability datasets"), pr("abzena", "Developability assessment")],
  marketNote: JAIN9,
  capacityNote: "Simple and cheap; results depend on column lot, so keep references in every sequence."
});

A9({
  id: "csi-bli", name: "Clone Self-Interaction by Bio-Layer Interferometry (CSI-BLI)", category: "developability",
  tagline: "Captures an antibody on a biosensor and tests whether it binds itself.",
  tests: ["Self-association at low concentration", "Viscosity and solubility risk", "Ranking clones with little material"],
  drugTypes: DEV9,
  inst: [["Octet BLI system", "Sartorius", "Label-free binding readout"]],
  consumables: ["Anti-human Fc or Protein A biosensors", "Kinetics buffer", "96/384-well plates", "Reference antibodies"],
  automation: "Octet runs are automated in 96/384 format.",
  steps: [
    "Load test antibody onto Fc-capture biosensors",
    "Block remaining sites",
    "Dip sensors into the same antibody in solution",
    "Record the binding response",
    "Subtract buffer and irrelevant-antibody references",
    "Rank clones by self-interaction signal"
  ],
  providers: [pr("ginkgo", "Developability datasets"), pr("fairjourney", "Discovery-stage developability")],
  marketNote: JAIN9,
  capacityNote: "Signals are small; needs careful referencing and replicate sensors."
});

A9({
  id: "kd-dls", name: "Diffusion Interaction Parameter (kD) by DLS", category: "developability",
  tagline: "Measures how diffusion changes with concentration. Negative kD means attraction.",
  tests: ["Colloidal stability in formulation buffer", "Self-association and viscosity risk", "Buffer, pH and excipient screening"],
  drugTypes: ["antibody", "adc", "peptide"],
  inst: [["Plate-based DLS (DynaPro Plate Reader)", "Wyatt (Waters)", "High-throughput DLS"], ["Zetasizer", "Malvern Panalytical", "Cuvette DLS"]],
  consumables: ["Formulation buffers", "Low-volume 384-well plates", "Filtered protein at 1-20 mg/mL"],
  automation: "Plate DLS runs unattended; dilution series prepared by liquid handler.",
  steps: [
    "Buffer-exchange protein into the test formulation",
    "Prepare a dilution series of 1-20 mg/mL",
    "Filter or centrifuge to remove dust and aggregates",
    "Measure diffusion coefficient at each concentration",
    "Fit diffusion versus concentration linearly",
    "Report kD from the slope and compare formulations"
  ],
  providers: [pr("coriolis", "Formulation and colloidal stability studies"), pr("abzena", "Biophysical characterisation"), pr("wuxi", "Formulation development")],
  marketNote: "Standard early predictor of high-concentration behaviour, typically paired with AC-SINS.",
  capacityNote: "Needs mg quantities; dust and aggregates skew results."
});

A9({
  id: "viscosity", name: "High-Concentration Viscosity", category: "developability",
  tagline: "Measures how thick a 100+ mg/mL antibody is. Decides if it fits a syringe.",
  tests: ["Injectability for subcutaneous delivery", "Formulation excipient effects on viscosity", "Clone selection for high-dose products"],
  drugTypes: ["antibody", "adc", "peptide"],
  inst: [["VROC initium", "RheoSense", "Microfluidic viscometer, low volume"], ["Cone-and-plate rheometer", "Anton Paar / TA Instruments", "Classic viscometry"]],
  consumables: ["Concentrated protein (100-200 mg/mL)", "Centrifugal concentrators", "Formulation buffers"],
  automation: "VROC initium runs automated from well plates; concentrating samples is the hands-on step.",
  steps: [
    "Concentrate antibody to the target concentration",
    "Confirm concentration by UV",
    "Equilibrate sample to measurement temperature",
    "Measure viscosity across shear rates",
    "Repeat across excipients or pH",
    "Report viscosity against a ~20 cP subcutaneous target"
  ],
  providers: [pr("coriolis", "High-concentration formulation development"), pr("abzena", "Biophysical characterisation"), pr("wuxi", "Formulation development")],
  marketNote: "Viscosity drives the switch to subcutaneous dosing; early proxies (AC-SINS, kD) reduce protein needs.",
  capacityNote: "Needs tens of mg per clone, so it is run only on finalists."
});

A9({
  id: "forced-degradation", name: "Forced Degradation (Stress Studies)", category: "developability",
  tagline: "Stresses the molecule on purpose to find what breaks first.",
  tests: ["Degradation pathways (aggregation, fragmentation, deamidation, oxidation)", "Stability-indicating method validation", "Sequence liabilities in CDRs"],
  drugTypes: ["antibody", "adc", "peptide", "oligo"],
  inst: [["UHPLC-SEC", "Agilent / Waters", "Aggregates and fragments"], ["Capillary electrophoresis (Maurice / PA 800)", "Bio-Techne / SCIEX", "CE-SDS and icIEF"], ["Orbitrap LC-MS", "Thermo Fisher", "Peptide mapping of modifications"]],
  consumables: ["Hydrogen peroxide (oxidation)", "High/low pH buffers", "Photostability chamber (ICH Q1B)", "Trypsin for peptide mapping", "SEC and CE consumables"],
  automation: "Stress incubations are simple; analysis spans several platforms and needs expert interpretation.",
  steps: [
    "Aliquot antibody into stress conditions (heat, pH, oxidation, light, agitation, freeze-thaw)",
    "Incubate for set time points",
    "Analyse aggregates and fragments by SEC",
    "Analyse purity and charge variants by CE-SDS and icIEF",
    "Map modifications by peptide-mapping LC-MS",
    "Test binding or potency on stressed samples",
    "Report liabilities and degradation pathways"
  ],
  providers: [pr("coriolis", "Forced degradation and formulation studies"), pr("abzena", "Analytical characterisation"), pr("wuxi", "Biologics analytical services"), pr("crl", "Biologics testing")],
  marketNote: "Expected by regulators (ICH Q5C/Q1B) to show stability-indicating methods; early versions guide clone choice.",
  capacityNote: "Multi-method and data-heavy; LC-MS peptide mapping is the bottleneck."
});

A9({
  id: "hac", name: "Heparin Affinity Chromatography (HAC)", category: "developability",
  tagline: "Measures binding to heparin. Strong binders often clear fast.",
  tests: ["Positive charge patches and off-target binding", "Fast-clearance risk", "Comparing variants after charge engineering"],
  drugTypes: DEV9,
  inst: [["HPLC with UV detection", "Agilent / Waters", "Salt-gradient separation"], ["Heparin affinity column", "Tosoh / Cytiva", "Stationary phase"]],
  consumables: ["Low- and high-salt buffers", "Reference antibodies", "Purified protein (~10-20 ug per run)"],
  automation: "Fully automated autosampler runs.",
  steps: [
    "Equilibrate the heparin column in low-salt buffer",
    "Inject purified antibody",
    "Elute with an increasing salt gradient",
    "Record retention time by UV",
    "Normalise against reference antibodies",
    "Flag clones with high heparin retention"
  ],
  providers: [pr("ginkgo", "Developability datasets"), pr("abzena", "Developability assessment")],
  marketNote: "Heparin retention correlates with faster clearance (Kraft et al. 2020, mAbs); used alongside the Jain et al. 2017 panel of 12 assays across 137 clinical antibodies.",
  capacityNote: "Cheap and fast; mostly a flag for positively charged variable domains."
});

// ---------------- Complex disease models ----------------
A9({
  id: "neuroimmune-triculture", name: "iPSC Neuron-Microglia-Astrocyte Tri-culture", category: "disease-models",
  tagline: "Human neurons, microglia and astrocytes together. Tests whether shifting microglia protects neurons.",
  tests: ["Whether a drug moves microglia to a protective state", "Neuron survival in ALS, Alzheimer's and Parkinson's models", "Neuroinflammation and cytokine release", "Microglial phagocytosis of amyloid, synapses or debris"],
  drugTypes: ["small-molecule", "antibody", "oligo", "peptide"],
  inst: [["High-content imager (Opera Phenix / ImageXpress)", "Revvity / Molecular Devices", "Neuron survival and morphology imaging"], ["Live-cell imager (Incucyte)", "Sartorius", "Longitudinal survival and phagocytosis"], ["MSD or Luminex reader", "Meso Scale Discovery / Luminex", "Cytokine panels"], ["Multi-electrode array (Maestro)", "Axion BioSystems", "Neuronal network activity", "Optional"]],
  consumables: ["iPSC-derived neurons, microglia and astrocytes (patient or isogenic lines)", "Defined co-culture medium with IL-34/CSF1, TGF-b", "pHrodo-labelled substrates (amyloid, synaptosomes)", "Disease triggers (LPS, aggregated alpha-synuclein, TDP-43, amyloid-beta)", "Neuron and glia markers (MAP2, IBA1, GFAP)"],
  automation: "Plating and imaging run in 96/384-well format; differentiating the three cell types takes weeks.",
  steps: [
    "Differentiate or thaw iPSC-derived neurons and astrocytes and co-culture to mature",
    "Add iPSC-derived microglia to form the tri-culture",
    "Apply a disease trigger or use patient-mutation lines",
    "Dose test compounds over a concentration range",
    "Image neuron survival and neurite length over time",
    "Measure microglial phagocytosis with pHrodo substrates",
    "Profile cytokines in supernatant and microglial state markers",
    "Compare isogenic or patient lines with controls"
  ],
  providers: [pr("modulo", "Platform developer: patient iPSC tri-culture used in-house for ALS/FTD microglia programmes (partnering, not fee-for-service)"), pr("axol", "iPSC-derived neurons, microglia and astrocytes plus assay services"), pr("bitbio", "ioCells human iPSC-derived neurons and microglia"), pr("crl", "Neuroscience in vitro models")],
  marketNote: "Response to the lack of predictive animal models in neurodegeneration; microglial targets (TREM2, CSF1R) drive demand.",
  capacityNote: "Line-to-line and batch variability is high; maturation takes 4-8 weeks before dosing."
});

Object.assign(P, {
  scantox: { name: "Scantox (Scantox Neuro)", region: "DK/AT" },
  transpharmation: { name: "Transpharmation", region: "UK/CA" }
});

A9({
  id: "microglia-phagocytosis", name: "iPSC Microglia Phagocytosis & Activation", category: "disease-models",
  tagline: "Feeds human microglia labelled debris. Shows whether a drug changes clearance.",
  tests: ["Uptake of amyloid-beta, synaptosomes, myelin or apoptotic cells", "TREM2, CD33 and CSF1R target engagement in a functional readout", "Inflammatory activation and cytokine release"],
  drugTypes: ["small-molecule", "antibody", "oligo"],
  inst: [["Live-cell imager (Incucyte)", "Sartorius", "Kinetic pHrodo uptake"], ["High-content imager", "Revvity / Molecular Devices", "Endpoint imaging"], ["Flow cytometer", "BD / Beckman", "Per-cell uptake", "Optional"]],
  consumables: ["iPSC-derived microglia (e.g. bit.bio ioMicroglia, Axol)", "pHrodo-labelled substrates (amyloid-beta, synaptosomes, E. coli or zymosan bioparticles)", "Cytochalasin D (uptake inhibitor control)", "LPS or IFN-gamma stimulus", "Cytokine assay kits"],
  automation: "96/384-well and imaging-based; thaw-and-plate microglia make it screen-friendly.",
  steps: [
    "Thaw and plate iPSC-derived microglia and let them recover",
    "Pre-treat with test compounds or antibodies",
    "Add pHrodo-labelled substrate",
    "Image fluorescence over 2-24 h as substrate reaches acidic phagosomes",
    "Include cytochalasin D wells as no-uptake control",
    "Collect supernatant for cytokine measurement",
    "Normalise uptake to cell number and compare with vehicle"
  ],
  providers: [pr("axol", "iPSC microglia and phagocytosis assay services"), pr("bitbio", "ioMicroglia cells for in-house assays"), pr("scantox", "Phagocytosis and neuroinflammation assays")],
  marketNote: "Microglial genes (TREM2, CD33) are major Alzheimer's risk factors, so this is a standard functional assay for those programmes.",
  capacityNote: "Monoculture lacks neuron and astrocyte signals; confirm hits in tri-culture."
});

A9({
  id: "brain-organoid", name: "Human Brain Organoids (Cortical / Midbrain)", category: "disease-models",
  tagline: "3D mini-brain tissue from stem cells. Models disease and neurotoxicity in human cells.",
  tests: ["Disease phenotypes in patient lines (Parkinson's, Alzheimer's, neurodevelopmental)", "Developmental neurotoxicity", "Network activity changes after treatment"],
  drugTypes: ["small-molecule", "oligo", "cgt", "antibody"],
  inst: [["Confocal / light-sheet microscope", "Zeiss / Leica / Revvity", "Whole-organoid imaging"], ["Multi-electrode array (Maestro)", "Axion BioSystems", "Network activity"], ["Orbital shaker or spinning bioreactor", "Various", "Long-term 3D culture"]],
  consumables: ["iPSC lines (patient and isogenic controls)", "Low-attachment U-bottom plates", "Neural induction and patterning media", "Matrigel or synthetic matrix", "Clearing reagents and antibodies (MAP2, TH, SOX2)"],
  automation: "Generation and dosing work in 96-well format; maturation takes 1-3 months and variability is high.",
  steps: [
    "Aggregate iPSCs into embryoid bodies in U-bottom plates",
    "Induce neural fate and pattern to cortex or midbrain",
    "Embed in matrix and mature for 4-12 weeks with agitation",
    "Select organoids by size and marker QC",
    "Dose compounds or deliver oligos or vectors",
    "Record activity on MEA or by calcium imaging",
    "Fix, clear and image cell-type markers and pathology",
    "Quantify neuron loss, pathology load or transcriptomic change"
  ],
  providers: [pr("scantox", "Cerebral organoid models of Alzheimer's-like pathology"), pr("transpharmation", "iPSC midbrain organoids (OrganoTherapeutics acquisition)"), pr("hub", "Organoid development and preclinical services")],
  marketNote: "Pushed by FDA's 2025 roadmap to reduce animal testing; organoid-to-organoid reproducibility is the main barrier.",
  capacityNote: "Long culture time and size variability; most lack microglia and vasculature unless added."
});

A9({
  id: "tumour-organoid-pdo", name: "Patient-Derived Tumour Organoids (PDO)", category: "disease-models",
  tagline: "Tumours grown as organoids from patient samples. Tests drug response per patient.",
  tests: ["Drug sensitivity across a panel of patient tumours", "Biomarker-response links", "Combination and resistance studies"],
  drugTypes: ["small-molecule", "antibody", "adc", "oligo"],
  inst: [["High-content imager", "Revvity / Molecular Devices", "Organoid size and death"], ["Luminescence plate reader", "Various", "CellTiter-Glo 3D viability"], ["Acoustic or liquid dispenser", "Beckman Echo / Tecan", "Compound dosing"]],
  consumables: ["Biobanked PDO lines with genomic annotation", "Basement membrane extract (BME/Matrigel)", "Organoid growth media with niche factors", "384-well plates", "CellTiter-Glo 3D"],
  automation: "Banked organoids plate into 384-well screens; establishing new lines from biopsies is slow.",
  steps: [
    "Thaw and expand annotated PDO lines in matrix",
    "Dissociate and seed organoids into 384-well plates",
    "Allow organoids to reform for 2-3 days",
    "Dose compounds over a concentration range",
    "Incubate 5-7 days",
    "Read viability by ATP luminescence and imaging",
    "Fit dose-response curves and link to tumour genomics"
  ],
  providers: [pr("hub", "Original HUB organoid technology and PDO biobanks"), pr("crown", "OrganoidXplore PDO screening (HUB-licensed)"), pr("champions", "Patient-derived tumour models")],
  marketNote: "PDO response has matched patient response in several clinical studies; now standard for oncology panel screening.",
  capacityNote: "Lacks stroma and immune cells; line growth rates differ, so panels need careful timing."
});

A9({
  id: "tumour-immune-coculture", name: "3D Tumour-Immune Co-culture", category: "disease-models",
  tagline: "Tumour spheroids plus immune cells. Shows whether a drug helps immune cells kill.",
  tests: ["T-cell engager and checkpoint antibody activity", "CAR-T and NK killing in 3D", "Immune infiltration into tumour tissue"],
  drugTypes: ["antibody", "adc", "cgt", "small-molecule"],
  inst: [["High-content or live-cell imager", "Revvity / Sartorius", "Spheroid killing and infiltration"], ["Flow cytometer", "BD / Cytek", "Immune cell phenotyping"], ["MSD or Luminex reader", "Meso Scale Discovery / Luminex", "Cytokines"]],
  consumables: ["Tumour spheroids or organoids (with fibroblasts optional)", "PBMCs, T cells, NK cells or CAR-T", "Fluorescent tumour labels and dead-cell dyes", "Ultra-low-attachment or hanging-drop plates", "Cytokine kits"],
  automation: "Spheroid plates are uniform and screen-compatible; donor variability needs multiple donors.",
  steps: [
    "Form tumour spheroids with or without fibroblasts",
    "Add labelled immune cells at set effector-to-target ratios",
    "Dose antibodies, engagers or small molecules",
    "Image spheroid size and dead-cell signal over several days",
    "Collect supernatant for cytokines",
    "Dissociate and phenotype infiltrating immune cells by flow",
    "Compare killing across donors and doses"
  ],
  providers: [pr("insphero", "3D InSight tumour microtissue and immuno-oncology models"), pr("crown", "Organoid-immune co-culture services")],
  marketNote: "Bridges 2D killing assays and in vivo humanised models for immuno-oncology.",
  capacityNote: "Donor-to-donor variability is large; tumour-specific T cells are hard to source."
});

A9({
  id: "liver-mps", name: "Liver Microphysiological System (Liver-Chip / PhysioMimix)", category: "disease-models",
  tagline: "Perfused human liver tissue that lasts weeks. Catches liver injury animals miss.",
  tests: ["Drug-induced liver injury (DILI) prediction", "NASH/MASH disease modelling", "Low-clearance metabolism and repeat dosing"],
  drugTypes: ["small-molecule", "oligo", "antibody", "peptide"],
  inst: [["Zoe / Orb culture module", "Emulate", "Perfused organ-chips"], ["PhysioMimix OOC", "CN Bio", "Perfused multi-well liver MPS"], ["LC-MS and ELISA", "Various", "Albumin, urea, drug and metabolite levels"]],
  consumables: ["Primary human hepatocytes and non-parenchymal cells (Kupffer, stellate, endothelial)", "Organ-chips or MPS plates", "Perfusion media", "ALT, albumin and LDH kits"],
  automation: "Perfusion is automated; chip set-up and daily sampling are hands-on and lower-throughput than plates.",
  steps: [
    "Seed hepatocytes and non-parenchymal cells into chips or MPS wells",
    "Start perfusion and let tissue stabilise for several days",
    "Confirm function with albumin, urea and CYP activity",
    "Dose test drug repeatedly over 1-2 weeks",
    "Sample effluent for ALT, albumin, LDH and drug levels",
    "Fix tissue and image for steatosis, fibrosis or injury",
    "Compare with clinical DILI reference compounds"
  ],
  providers: [pr("emulate", "Liver-Chip and services"), pr("cnbio", "PhysioMimix liver MPS and contract studies"), pr("crl", "In vitro hepatotoxicity models")],
  marketNote: "Emulate Liver-Chip flagged 87% of hepatotoxic drugs that passed animal tests (Ewart et al. 2022); accepted into FDA ISTAND pilot.",
  capacityNote: "Primary-cell donor supply and per-chip cost limit throughput."
});

A9({
  id: "organoplate-barrier", name: "OrganoPlate Tubule Barrier Models (Gut, BBB, Kidney)", category: "disease-models",
  tagline: "Perfused cell tubes in a 96-chip plate. Measures barrier leak and inflammation.",
  tests: ["Barrier integrity (TEER and dye leakage)", "Gut inflammation (IBD) and drug effects on epithelium", "Blood-brain barrier and endothelial permeability"],
  drugTypes: ["small-molecule", "antibody", "peptide", "oligo"],
  inst: [["OrganoPlate rocker", "MIMETAS", "Gravity-driven perfusion"], ["OrganoTEER", "MIMETAS", "Barrier resistance in each chip"], ["High-content imager", "Revvity / Molecular Devices", "Dye leakage and morphology"]],
  consumables: ["OrganoPlate (40-96 chips per plate)", "Collagen ECM gel", "Epithelial, endothelial or iPSC-derived cells", "Fluorescent dextran tracers", "Cytokine triggers (TNF-alpha, IL-1beta)"],
  automation: "Plate format works with standard liquid handlers and imagers; no pumps or tubing.",
  steps: [
    "Pipette ECM gel into the gel lane",
    "Seed cells against the gel to form a perfused tubule",
    "Rock the plate to perfuse until a tight barrier forms",
    "Measure baseline TEER",
    "Add inflammatory trigger and test compounds",
    "Measure TEER and fluorescent dextran leakage over time",
    "Image tubules and measure cytokines in effluent"
  ],
  providers: [pr("mimetas", "OrganoPlate models and contract screening")],
  marketNote: "Highest-throughput perfused tissue format; widely used for IBD and BBB studies.",
  capacityNote: "Shear stress is low and bidirectional; tissues are thinner than in vivo."
});

A9({
  id: "kidney-retina-organoid", name: "iPSC Kidney & Retinal Organoids", category: "disease-models",
  tagline: "Human kidney tubules and retina from stem cells. Tests toxicity and gene therapies.",
  tests: ["Proximal tubule nephrotoxicity and transporter interactions", "Retinal toxicity", "AAV and ASO efficacy in inherited retinal disease"],
  drugTypes: ["small-molecule", "oligo", "cgt", "antibody"],
  inst: [["High-content imager", "Revvity / Molecular Devices", "Organoid imaging"], ["qPCR / ddPCR", "Bio-Rad / Thermo Fisher", "Transgene and splicing readouts"], ["LC-MS", "Various", "Transporter substrate uptake"]],
  consumables: ["iPSC-derived retinal organoids or kidney proximal tubule cells", "Transwell inserts (kidney)", "Long-term differentiation media", "Kidney injury markers (KIM-1, NGAL)", "AAV vectors or ASOs"],
  automation: "Kidney tubule cells run in 24/96-well transwells; retinal organoids need months of maturation.",
  steps: [
    "Differentiate or receive iPSC-derived kidney tubule cells or retinal organoids",
    "Confirm identity markers and transporter or photoreceptor function",
    "Dose compounds, ASOs or AAV vectors",
    "Incubate for days (toxicity) or weeks (gene therapy)",
    "Measure KIM-1, NGAL, viability or transporter uptake (kidney)",
    "Measure transgene expression, splicing correction or photoreceptor markers (retina)",
    "Compare with reference nephrotoxins or untreated organoids"
  ],
  providers: [pr("newcells", "iPSC kidney proximal tubule and retinal organoid services")],
  marketNote: "Used for nephrotoxicity of oligos and small molecules and for AAV/ASO programmes in inherited retinal disease.",
  capacityNote: "Retinal organoid maturation takes 3-6 months, which limits throughput."
});
