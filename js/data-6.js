// Expansion 5 — Genomics, oligo functional assays, immunology
ASSAYS.push(
  {
    id: "rnaseq-offtarget",
    name: "Transcriptome-Wide Off-Target Analysis (RNA-seq)",
    category: "genomics",
    tagline: "RNA-seq dose-response — the off-target safety net for oligo therapeutics.",
    tests: ["Transcriptome-wide off-target knockdown", "Dose-dependent unintended targets (IC50 of off-targets)", "Immune-response gene activation (TLR signature)"],
    drugTypes: ["oligo"],
    instruments: [
      { name: "NovaSeq X / NextSeq 2000", vendor: "Illumina", role: "RNA-seq readout", note: "384-sample runs" },
      { name: "3' RNA-seq kits (QuantSeq)", vendor: "Lexogen", role: "High-throughput 3' counting", note: "Cheaper per sample" }
    ],
    consumables: ["RNA extraction kits (magnetic-bead)", "RNA-seq library kits (polyA or rRNA-depletion)", "Unique dual-index primers"],
    automation: "Highly automatable — the foundry labs (OFELMË) industrialised it as a dataset product.",
    steps: [
      "Treat cells with oligo at 3–5 concentrations (sub-IC50 to IC50)",
      "Extract RNA (automated magnetic-bead)",
      "Prepare sequencing libraries (3' counting for throughput)",
      "Sequence to 5–10 M reads/sample",
      "Differential expression vs vehicle per concentration",
      "Identify unintended target knockdown (sequence-homology driven)",
      "Fit off-target dose-response → off-target IC50 list"
    ],
    providers: [pr("ofelme", "Off-target RNA-seq datasets (core product)"), pr("eurofins", "Transcriptomics services"), pr("crl", "GLP transcriptomics")],
    marketNote: "Regulatory expectation for oligo safety is rising — off-target transcriptomics is becoming standard.",
    capacityNote: "Few providers structure this as a product (not a bespoke study) — the foundry-lab whitespace."
  },

  {
    id: "ddpcr",
    name: "Droplet Digital PCR (ddPCR)",
    category: "genomics",
    tagline: "Absolute nucleic-acid quantification — no standard curves.",
    tests: ["Vector genome copies (CGT titer)", "Rare-allele detection (1:100,000)", "Residual-DNA quantification"],
    drugTypes: ["oligo", "cgt"],
    instruments: [
      { name: "QX200 / QXDx ddPCR", vendor: "Bio-Rad", role: "Droplet digital PCR", note: "20,000 droplets/well" }
    ],
    consumables: ["ddPCR supermix (no UNG for some apps)", "Droplet generation oil", "ddPCR plates + seals", "Probe-based assays (TaqMan)"],
    automation: "Automated droplet generation on QXDx; plate handling standard.",
    steps: [
      "Partition sample into 20,000 droplets (each a micro-reactor)",
      "Endpoint PCR amplification (probe-based detection)",
      "Read droplet fluorescence (positive/negative per droplet)",
      "Poisson statistics → absolute copies per µL",
      "No standard curve needed (vs qPCR)",
      "Report copies per reaction (vector genomes, rare alleles)"
    ],
    providers: [pr("lonza", "ddPCR for CGT release"), pr("catalent", "ddPCR vector titer"), pr("crl", "ddPCR services")],
    marketNote: "CGT vector quantitation made ddPCR mainstream — release-grade absolute quantification.",
    capacityNote: "Droplet consumables cost per well; adequate capacity at CGT-experienced labs."
  },

  {
    id: "splice-switch",
    name: "Splice-Switching Assay (RT-PCR)",
    category: "genomics",
    tagline: "ASO-induced exon skipping quantification — the RNA-therapy functional readout.",
    tests: ["Exon-inclusion/skipping ratio (RT-PCR)", "Dose-response of splicing correction", "Species-specific splice-variant verification"],
    drugTypes: ["oligo"],
    instruments: [
      { name: "QuantStudio 5 / Fragment Analyzer", vendor: "Thermo Fisher / Agilent", role: "RT-PCR + capillary sizing", note: "Splice-isoform quantification" }
    ],
    consumables: ["RT-PCR primers (exon-flanking)", "Fragment Analyzer kits (sizing)", "Cell culture for splice models"],
    automation: "Standard RT-PCR automation applies.",
    steps: [
      "Treat cells with splice-switching ASO series",
      "Extract RNA; reverse-transcribe",
      "PCR across the targeted exon junction",
      "Run on capillary electrophoresis (Fragment Analyzer)",
      "Quantify skipped vs unskipped isoform peaks",
      "Fit dose-response → exon-skipping EC50",
      "Confirm at protein level (Western) for lead candidates"
    ],
    providers: [pr("ofelme", "Splice-switching datasets"), pr("eurofins", "Splicing assay services"), pr("lonza", "Splice-ASO bioanalysis")],
    marketNote: "Spinraza legacy + emerging RNA-splicing programs (frontotemporal dementia, Duchenne) sustain demand.",
    capacityNote: "Specialist design knowledge (exon-flanking PCR) — moderate scarcity."
  },

  {
    id: "risc-loading",
    name: "RISC Loading Assay",
    category: "genomics",
    tagline: "siRNA guide-strand loading into Argonaute — the mechanistic oligo assay.",
    tests: ["Guide-strand loading efficiency", "Strand bias (guide vs passenger)", "Ago2-complex formation quantification"],
    drugTypes: ["oligo"],
    instruments: [
      { name: "Native gel + fluorescent oligo", vendor: "Standard", role: "Ago2-complex detection", note: "EMSA-style" },
      { name: "Biacore SPR (Ago2 binding)", vendor: "Cytiva", role: "Kinetic Ago2 interaction", note: "Optional orthogonal" }
    ],
    consumables: ["Recombinant Ago2 + Dicer", "Fluorescent siRNA duplex", "Native-PAGE gels"],
    automation: "Research-scale assay; automation limited by gel-based readout.",
    steps: [
      "Incubate siRNA duplex with Ago2 + Dicer complex",
      "Run native gel (complex shift visible)",
      "Quantify loaded Ago2-siRNA complex band",
      "Strand-specific labelling reveals guide/passenger bias",
      "Compare siRNA designs for loading efficiency",
      "Correlate loading with downstream knockdown potency"
    ],
    providers: [pr("ofelme", "Mechanistic oligo assays"), { name: "Axolabs / Axolab service", note: "siRNA mechanistic packages", region: "DE" }],
    marketNote: "Discovery-stage mechanistic work for siRNA programs — small but strategically important.",
    capacityNote: "Very few service labs offer RISC loading — mostly run in-house at siRNA companies."
  },

  {
    id: "tlr-immunostim",
    name: "TLR Immunostimulation Assay",
    category: "genomics",
    tagline: "Does the oligo activate innate immunity — the safety check for oligo programs.",
    tests: ["TLR3/7/8/9 activation (reporter + PBMC)", "Cytokine release from human PBMCs", "Sequence-motif immunostimulation flag"],
    drugTypes: ["oligo", "cgt"],
    instruments: [
      { name: "TLR reporter cell lines (HEK-Blue)", vendor: "Invivogen", role: "TLR-specific activation", note: "96-well SEAP readout" },
      { name: "Luminex cytokine readout", vendor: "Luminex", role: "PBMC cytokine panel", note: "IL-6, TNFα, IFNα" }
    ],
    consumables: ["HEK-Blue TLR cell lines", "Human donor PBMCs (fresh)", "CpG control oligos (TLR9 positive)", "Cytokine beads"],
    automation: "Reporter format automates fully; PBMC work requires donor logistics.",
    steps: [
      "Treat TLR-reporter cells with oligo concentration series",
      "Read SEAP/luminescence (TLR-specific activation)",
      "PBMC arm: treat fresh donor cells, measure cytokines (Luminex)",
      "Compare to motif-containing positive controls",
      "Flag immunostimulatory sequences for redesign (2'-O-Me masking)",
      "Confirm design changes reduce TLR activation"
    ],
    providers: [pr("ofelme", "TLR immunostim datasets"), pr("crl", "Innate-immunity packages"), pr("eurofins", "TLR assay services")],
    marketNote: "The number-one safety question for oligo programs — chemical modifications (2'-O-Me) are the mitigation.",
    capacityNote: "Fresh-PBMC capability is the constraint (same as cytokine-release assays)."
  },

  {
    id: "crispr-edit-eff",
    name: "CRISPR Editing Efficiency (TIDE/NGS)",
    category: "genomics",
    tagline: "Quantify the edit — insertion/deletion profiling for gene-editing programs.",
    tests: ["Editing efficiency (% indel)", "HDR vs NHEJ ratio", "Off-target editing at predicted sites"],
    drugTypes: ["cgt", "oligo"],
    instruments: [
      { name: "Amplicon NGS (MiSeq)", vendor: "Illumina", role: "Editing quantification", note: "CRISPR-sequencing standard" },
      { name: "TIDE analysis (Sanger)", vendor: "Software (free)", role: "Cheap indel estimate", note: "Screening tier" }
    ],
    consumables: ["PCR primers flanking edit site", "NGS library kits (amplicon)", "Guide-RNA + Cas9 RNP (for test edits)"],
    automation: "Amplicon sequencing automates; analysis pipelines are the value.",
    steps: [
      "Deliver editing machinery (RNP electroporation) to cells",
      "Allow 48–72 h for editing",
      "PCR-amplify the target locus",
      "Deep-sequence the amplicon (NGS)",
      "Deconvolute indel spectrum (CRISPResso)",
      "Quantify % edited alleles + HDR precision (if donor given)",
      "Off-target arm: sequence top predicted off-sites"
    ],
    providers: [pr("eurofins", "CRISPR editing services"), pr("aragen", "Editing assays at India cost"), pr("lonza", "CGT editing QC")],
    marketNote: "Editing efficiency QC is core to CGT manufacturing — every batch needs edit verification.",
    capacityNote: "Amplicon sequencing is abundant; delivery optimisation is the expert step."
  },

  {
    id: "mrna-integrity",
    name: "mRNA Integrity (Bioanalyzer/TapeStation)",
    category: "genomics",
    tagline: "RNA-size and integrity QC — the mRNA-therapy release gate.",
    tests: ["RNA integrity number (RIN)", "Full-length fraction (mRNA vaccines)", "Degradation kinetics (freeze-thaw)"],
    drugTypes: ["oligo", "cgt"],
    instruments: [
      { name: "Bioanalyzer 2100 / TapeStation", vendor: "Agilent", role: "Electrophoretic RNA sizing", note: "Standard RIN" }
    ],
    consumables: ["RNA Nano chips (single-use)", "Ladder + dye", "RNase-free consumables"],
    automation: "Automated chip loading; single-use chips limit scale economics.",
    steps: [
      "Run RNA sample on microfluidic chip",
      "Electrophoretic separation + fluorescence detection",
      "Software generates RIN (1–10 integrity score)",
      "Quantify full-length vs degraded fraction",
      "Compare to release specification (RIN >7 typical)",
      "Stability arm: RIN after freeze-thaw cycles"
    ],
    providers: [pr("lonza", "mRNA release testing"), pr("catalent", "mRNA analytics"), pr("wuxi", "RNA QC at scale")],
    marketNote: "mRNA-LNP pipeline (post-COVID) sustains RNA-QC demand at CDMOs.",
    capacityNote: "Abundant; single-use chips are the cost friction."
  },

  {
    id: "adcc",
    name: "ADCC Reporter Assay",
    category: "immunology",
    tagline: "Antibody-dependent cell cytotoxicity — the Fc-effector-function readout.",
    tests: ["ADCC potency (EC50) via NFAT-luciferase reporter", "FcgRIIIa (V158) engagement", "Comparability of Fc engineering"],
    drugTypes: ["antibody", "adc"],
    instruments: [
      { name: "PHERAstar / EnVision", vendor: "BMG / Revvity", role: "Luciferase readout", note: "96/384-well" },
      { name: "iLite ADCC reporter cells", vendor: "Svar Life Science", role: "Engineered effector cells", note: "GMP-compatible" }
    ],
    consumables: ["ADCC reporter effector cells (CD16-FcgRIIIa)", "Target cells (antigen-positive)", "Luciferase substrate", "Anti-CD16 control antibody"],
    automation: "Reporter-based ADCC automates fully — replaced primary-NK killing assays for screening.",
    steps: [
      "Co-culture target cells + CD16-reporter effector cells",
      "Add antibody dilution series",
      "Antigen-bound antibody cross-links CD16 → NFAT activation",
      "Incubate 6 h; lyse and read luciferase",
      "Fit dose-response → ADCC EC50 and Emax",
      "Compare Fc variants (afucosylated vs wild-type)"
    ],
    providers: [pr("bioagilytix", "ADCC specialist services"), pr("crl", "ADCC in developability"), pr("lonza", "ADCC for release"), pr("wuxi", "ADCC at scale")],
    marketNote: "Oncology antibodies need ADCC data for mechanism + comparability — reporter assays industrialised it.",
    capacityNote: "Reporter-cell supply chain is robust; primary-NK assays remain specialist (fewer labs)."
  },

  {
    id: "adcp",
    name: "ADCP (Antibody-Dependent Cellular Phagocytosis)",
    category: "immunology",
    tagline: "Macrophage phagocytosis — the Fc function beyond ADCC.",
    tests: ["Phagocytosis score (bead or tumour-cell target)", "FcgR engagement (CD64, CD32)", "Antibody candidate ranking"],
    drugTypes: ["antibody", "adc"],
    instruments: [
      { name: "ImageStream / high-content imaging", vendor: "Luminex / Revvity", role: "Phagocytosis quantification", note: "Object-based" },
      { name: "pHrodo-labelled targets", vendor: "Thermo Fisher", role: "pH-sensitive uptake probe", note: "Only engulfed targets fluoresce" }
    ],
    consumables: ["Monocyte-derived macrophages (MDM)", "pHrodo-labelled target cells", "Antibody series", "Counting beads"],
    automation: "Imaging-based quantification automates; macrophage prep is the manual step.",
    steps: [
      "Differentiate monocytes to macrophages (M1/M2 optional)",
      "Label target cells with pHrodo dye",
      "Opsonise targets with antibody series",
      "Co-culture macrophages + targets (4 h)",
      "Image; quantify pHrodo-positive macrophages (engulfment)",
      "Calculate phagocytosis score per antibody",
      "Rank candidates by ADCP potency"
    ],
    providers: [pr("bioagilytix", "ADCP services"), pr("crl", "ADCP packages"), pr("lonza", "Fc-function testing")],
    marketNote: "Growing importance as bispecifics target myeloid engagement — ADCP data increasingly expected.",
    capacityNote: "Primary-macrophage logistics limit throughput; reporter-cell alternatives emerging."
  },

  {
    id: "cdc",
    name: "CDC (Complement-Dependent Cytotoxicity)",
    category: "immunology",
    tagline: "Complement-mediated killing — the Fc function with safety implications.",
    tests: ["CDC potency (EC50) against target cells", "Complement-activation pathway (classical)", "Anti-complement liability (unwanted activation)"],
    drugTypes: ["antibody", "adc"],
    instruments: [
      { name: "LDH / luminescence plate readers", vendor: "Standard", role: "Cytotoxicity endpoint", note: "96-well" },
      { name: "Complement ELISA (C3a/C5a)", vendor: "Quidel / BD", role: "Complement activation markers", note: "Safety arm" }
    ],
    consumables: ["Normal human serum (complement source, fresh-frozen)", "Target cells (antigen-positive)", "LDH release substrate", "C3a/C5a ELISA kits"],
    automation: "Plate-based killing assay automates; serum-lot QC is the variable.",
    steps: [
      "Incubate target cells with antibody + human serum (complement)",
      "Incubate 1–2 h at 37°C",
      "Read cytotoxicity (LDH release or viability dye)",
      "Specific lysis = experimental − background",
      "Fit CDC EC50 per antibody",
      "Safety arm: measure C3a/C5a activation in serum (unwanted complement activation)"
    ],
    providers: [pr("bioagilytix", "CDC services"), pr("crl", "CDC packages"), pr("wuxi", "CDC at scale")],
    marketNote: "Rituximab-type mechanisms need CDC; complement-activation safety is the other use case.",
    capacityNote: "Serum-lot variability is the QC challenge — pooled-lot protocols fix it."
  },

  {
    id: "elispot",
    name: "ELISpot / FluoroSpot",
    category: "immunology",
    tagline: "Single-cell cytokine secretion — the immune-response gold standard.",
    tests: ["Antigen-specific T-cell frequency (IFNγ spots)", "Multi-cytokine (FluoroSpot dual/triple)", "Vaccine immunogenicity readout"],
    drugTypes: ["peptide", "antibody", "cgt"],
    instruments: [
      { name: "AID / S6 Ultra analyzers", vendor: "AID / CTL", role: "Automated spot counting", note: "GCLP-compliant" }
    ],
    consumables: ["ELISpot plates (PVDF membrane, pre-coated)", "Anti-IFNγ capture + detection", "Peptide pools (stimulus)", "Human PBMCs"],
    automation: "Automated spot readers; plate coating is batch-critical.",
    steps: [
      "Coat PVDF plates with anti-cytokine capture antibody",
      "Seed PBMCs + antigenic peptide stimulus",
      "Incubate 18–24 h (secreted cytokine captured locally)",
      "Detect with biotinylated anti-cytokine + streptavidin-HRP",
      "Develop spots (precipitating substrate)",
      "Automated spot counting → spots per 10⁶ PBMCs",
      "Antigen-specific T-cell frequency"
    ],
    providers: [pr("crl", "GCLP ELISpot for trials"), pr("bioagilytix", "ELISpot services"), pr("wuxi", "ELISpot at scale")],
    marketNote: "Vaccine and neoantigen programs rely on ELISpot — the clinical-trial immune readout.",
    capacityNote: "Spot-reader instrument + trained analysts; GCLP slots at CROs book out."
  },

  {
    id: "tcell-activation",
    name: "T-Cell Activation / Proliferation",
    category: "immunology",
    tagline: "Does the compound wake up T cells — efficacy and safety (autoimmunity).",
    tests: ["CD69/CD25 activation kinetics", "Antigen-specific proliferation (CFSE dilution)", "Cytokine polarisation (Th1/Th17)"],
    drugTypes: ["antibody", "peptide", "small-molecule"],
    instruments: [
      { name: "Fortessa flow cytometer", vendor: "BD", role: "Multi-marker immunophenotyping", note: "12+ colours" },
      { name: "CFSE proliferation tracking", vendor: "Standard", role: "Division-counting", note: "Flow-based" }
    ],
    consumables: ["Human PBMCs (fresh or cryopreserved)", "Anti-CD3/CD28 beads (polyclonal stimulus)", "CFSE dye", "Peptide pools (antigen-specific)"],
    automation: "Flow-based with plate loader; donor-to-donor variability demands panel design.",
    steps: [
      "Label PBMCs with CFSE (proliferation tracking)",
      "Stimulate with anti-CD3/CD28 or antigenic peptides + compound",
      "Incubate 3–5 days",
      "Stain activation markers (CD69, CD25, HLA-DR) + viability",
      "Flow cytometry: quantify activated subsets + CFSE dilution",
      "Measure cytokines in supernatant (polarisation)",
      "Report activation/proliferation index per condition"
    ],
    providers: [pr("crl", "T-cell activation services"), pr("eurofins", "Immunology assays"), pr("bioagilytix", "T-cell packages")],
    marketNote: "Autoimmune-safety and IO-efficacy both need it — dual demand.",
    capacityNote: "Flow-cytometry operator time is the constraint; 5-day cultures limit throughput."
  },

  {
    id: "basophil",
    name: "Basophil Activation Test (BAT)",
    category: "immunology",
    tagline: "Allergy and infusion-reaction risk — human basophil response ex vivo.",
    tests: ["CD63/CD203c basophil activation", "Drug-specific hypersensitivity flag", "Infusion-reaction prediction (pre-dose screen)"],
    drugTypes: ["antibody", "peptide", "small-molecule"],
    instruments: [
      { name: "Fortessa flow cytometer", vendor: "BD", role: "Basophil gating + activation", note: "CCR3+ CD63+" }
    ],
    consumables: ["Fresh whole blood (heparin, <24 h)", "Anti-CD63-FITC + anti-CCR3-PE", "Activators (fMLP positive control)", "Compound dilution series"],
    automation: "Whole-blood flow workflow — fresh-donor logistics limit automation.",
    steps: [
      "Obtain fresh donor blood (basophil viability time-sensitive)",
      "Incubate whole blood with compound series (15–30 min)",
      "Stain basophils (CCR3/CD123) + activation (CD63/CD203c)",
      "Flow cytometry: gate basophils, quantify activated fraction",
      "Compare to vehicle and positive control (anti-IgE)",
      "Dose-response for basophil activation"
    ],
    providers: [pr("crl", "BAT for hypersensitivity"), pr("metrion", "Human-blood immune assays"), pr("bioagilytix", "BAT services")],
    marketNote: "Carbamazepine-type hypersensitivity and biologic infusion reactions — niche but clinically critical.",
    capacityNote: "Very fresh blood requirement (<24 h) — few labs can run it; capacity scarce."
  }
);
