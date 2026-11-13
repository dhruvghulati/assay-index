// Expansion 6 — Developability, CGT, peptide, remaining ADME
ASSAYS.push(
  {
    id: "developability-panel",
    name: "Developability Assessment Panel",
    category: "cell",
    tagline: "Antibody triage — sequence liabilities + stability + viscosity in one pass.",
    tests: ["Thermal stability (DSF Tm)", "Poly-specificity (BVP/AC-SINS)", "Self-aggregation (CIC)", "Viscosity screen", "Sequence-liability flags (isomerisation, deamidation)"],
    drugTypes: ["antibody", "adc"],
    instruments: [
      { name: "UNCLE / SUPR-DSF", vendor: "Unchained Labs", role: "Multi-parameter stability", note: "4-in-1 reader" },
      { name: "Optimol Kinetic Viscometer", vendor: "Unchained Labs", role: "High-concentration viscosity", note: "Screening tier" },
      { name: "Sequence-liability software (BIOVIA/abYsis)", vendor: "Dassault", role: "In-silico liability scan", note: "Bioinformatics" }
    ],
    consumables: ["Antibody panel (0.1–1 mg each)", "Black-plate DSF kits", "BVP ELISA kits", "Concentration plates (nano-potency)"],
    automation: "The panel is a standard offering at antibody CROs — Bienta and BioAgilytix industrialised it.",
    steps: [
      "In-silico: scan sequences for liabilities (Met oxidation, Asp isomerisation, deamidation)",
      "Express small-scale panel (0.1–1 mg each)",
      "DSF: measure thermal transition temperatures (Tm)",
      "Poly-specificity: BVP binding + AC-SINS aggregation propensity",
      "CIC: reversible self-association screen",
      "Viscosity: ramp to 100+ mg/mL, measure (SC formula risk)",
      "Rank candidates for developability score"
    ],
    providers: [pr("bienta", "Developability panel core service"), pr("bioagilytix", "Antibody developability"), pr("wuxi", "Developability at scale")],
    marketNote: "Therapeutic-antibody programs now run developability panels before lead selection — de-risks CMC later.",
    capacityNote: "The panel is high-throughput at specialist labs; sequence-analysis software adds value cheaply."
  },

  {
    id: "glycan-profiling",
    name: "Glycan Profiling (HILIC/MS)",
    category: "bioanalysis",
    tagline: "N-linked sugar structures — critical quality attribute for biologics.",
    tests: ["Glycoform distribution (G0F, G2F, high-mannose)", "Fucosylation index (ADCC link)", "Sialylation (PK link)", "Glycan-site occupancy"],
    drugTypes: ["antibody", "adc", "peptide"],
    instruments: [
      { name: "HILIC-FLD + LC-MS", vendor: "Waters/Thermo", role: "Labelled-glycan separation", note: "2-AB/2-AA labelling" },
      { name: "Released-glycan MS (HRMS)", vendor: "Thermo", role: "Structure confirmation", note: "Orbitrap" }
    ],
    consumables: ["PNGase F (glycan release)", "2-AB labelling reagent", "HILIC columns", "Glycan standards"],
    automation: "Released-glycan workflows automate well; site-specific analysis needs more sample.",
    steps: [
      "Release N-glycans with PNGase F (denatured antibody)",
      "Label glycans (2-AB fluorescent tag)",
      "Separate by HILIC chromatography",
      "Fluorescence detection → glycoform distribution",
      "LC-MS confirms each structure (mass)",
      "Calculate fucosylation index, sialylation, high-mannose fraction",
      "Compare batch-to-batch (CQA drift)"
    ],
    providers: [pr("lonza", "Glycan release testing"), pr("wuxi", "Glycan analysis at scale"), pr("catalent", "Glycan CQA testing")],
    marketNote: "Glycosylation drives ADCC and PK — the CQA that connectability programs monitor closely.",
    capacityNote: "HILIC columns + PNGase kits are standard; bioinformatics (structure assignment) is the expert step."
  },

  {
    id: "iCIEF",
    name: "iCIEF (Charge Heterogeneity)",
    category: "bioanalysis",
    tagline: "Charge-variant profiling — the fast CQA assay replacing conventional IEF.",
    tests: ["Acidic/basic charge variants", "Deamidation/amidation quantification", "Charge-variant comparability (biosimilar)"],
    drugTypes: ["antibody", "adc", "peptide"],
    instruments: [
      { name: "iCE3 (Maurice)", vendor: "Revvity (formerly ProteinSimple)", role: "Imaging capillary IEF", note: "50-sample/day" }
    ],
    consumables: ["iCIEF capillary cartridges", "Carrier ampholytes (pH 3–10)", "pI markers", "Anolyte/catholyte buffers"],
    automation: "Fully automated imaging — the release-grade charge-variant method.",
    steps: [
      "Mix sample with ampholytes + pI markers",
      "Load into capillary; apply electric field",
      "Focus: charge variants separate by pI",
      "Immunobilise (chemical) and image",
      "Quantify acidic/main/basic peak fractions",
      "pI assignment via markers",
      "Compare batches (charge-variant drift)"
    ],
    providers: [pr("lonza", "iCIEF release testing"), pr("wuxi", "iCIEF at scale"), pr("catalent", "iCIEF CQA")],
    marketNote: "Conventional slab IEF is obsolete — iCIEF is the release method for charge variants.",
    capacityNote: "Cartridge cost is the friction; Maurice instruments are widely deployed at CDMOs."
  },

  {
    id: "CEX-HPLC",
    name: "CEX-HPLC (Charge Variants)",
    category: "bioanalysis",
    tagline: "Ion-exchange separation of charge variants — the orthogonal CQA method.",
    tests: ["Charge-variant distribution (acidic/main/basic)", "pI estimation (via standards)", "Comparability for biosimilars"],
    drugTypes: ["antibody", "adc", "peptide"],
    instruments: [
      { name: "Ion-exchange HPLC (non-salt)", vendor: "Waters/Thermo", role: "Charge-variant separation", note: "pH-gradient methods" }
    ],
    consumables: ["Cation-exchange columns (non-porous)", "pH-gradient buffers", "Charge-variant standards"],
    automation: "Standard HPLC automation.",
    steps: [
      "Inject sample onto cation-exchange column",
      "pH or salt gradient separates charge variants",
      "UV detection at 280 nm",
      "Integrate acidic/main/basic peaks",
      "Mass-balance check (recovery >95%)",
      "Orthogonal confirmation vs iCIEF"
    ],
    providers: [pr("wuxi", "CEX at scale"), pr("lonza", "CEX release"), pr("eurofins", "CEX services")],
    marketNote: "The workhorse charge-variant method — simple, quantitative, widely deployed.",
    capacityNote: "Abundant."
  },

  {
    id: "SEC-HPLC",
    name: "SEC-HPLC (Aggregates/Monomer)",
    category: "qc",
    tagline: "Size-exclusion chromatography — monomer purity and aggregate quantification.",
    tests: ["Monomer purity (%)", "HMW aggregate fraction", "LMW fragment fraction", "Stability-indicating aggregate growth"],
    drugTypes: ["antibody", "adc", "peptide"],
    instruments: [
      { name: "SEC-HPLC (UPLC/HP-SEC)", vendor: "Waters/Thermo", role: "Size-based separation", note: "Sub-2 µm particles" },
      { name: "SEC-MALS (orthogonal)", vendor: "Wyatt", role: "Absolute MW confirmation", note: "Advanced tier" }
    ],
    consumables: ["SEC columns (TSKgel, BEH)", "Phosphate mobile phase", "Monomer/aggregate standards"],
    automation: "Standard HPLC automation.",
    steps: [
      "Inject sample onto SEC column",
      "Larger species elute first (size exclusion)",
      "UV detection (280 nm)",
      "Integrate monomer, aggregate, fragment peaks",
      "Calculate monomer purity (%)",
      "Stability arm: run after stress (heat, freeze-thaw)",
      "SEC-MALS confirms absolute MW (orthogonal)"
    ],
    providers: [pr("wuxi", "SEC at scale"), pr("lonza", "SEC release testing"), pr("eurofins", "SEC services"), pr("ofelme", "SEC in oligo QC")],
    marketNote: "Aggregate content is the number-one CQA for biologics — SEC is the release method.",
    capacityNote: "Abundant; column cost per injection is minimal."
  },

  {
    id: "icp-ms-biologics",
    name: "ICP-MS for Biologics",
    category: "bioanalysis",
    tagline: "Elemental impurities in biologics — metal catalysts and element traces.",
    tests: ["Residual metal catalysts (Pt, Pd, Ni)", "Elemental impurities (ICH Q3D)", "ADC payload-metal interaction", "Element speciation (free vs protein-bound)"],
    drugTypes: ["antibody", "adc", "small-molecule"],
    instruments: [
      { name: "ICP-MS (7900/8900)", vendor: "Agilent", role: "Elemental analysis", note: "Collision-cell MS" }
    ],
    consumables: ["Nitric acid (trace-metal grade)", "Internal standards (Rh, Ir)", "Certified reference standards"],
    automation: "Standard ICP-MS automation; sample prep (microwave digestion) is the manual step.",
    steps: [
      "Digest sample (microwave nitric acid) or dilute directly",
      "Add internal standards (Rh, Ir)",
      "Aspirate into ICP (argon plasma ionises)",
      "Mass spectrometry detects elements (Pt, Pd, Ni)",
      "Quantify vs certified standards (ppb)",
      "Assess against ICH Q3D limits",
      "Speciation arm: SEC-ICP-MS separates protein-bound vs free metal"
    ],
    providers: [pr("wuxi", "ICP-MS at scale"), pr("crl", "ICP-MS for impurities"), pr("eurofins", "Elemental analysis")],
    marketNote: "ICH Q3D made elemental-impurity testing mandatory — routine for small molecules, growing for biologics.",
    capacityNote: "ICP-MS instruments are standard; trace-metal-clean labs are the specialised requirement."
  },

  {
    id: "organ-on-chip",
    name: "Organ-on-Chip Safety/Efficacy",
    category: "safety",
    tagline: "Microphysiological systems — human-relevant safety and efficacy in vitro.",
    tests: ["Tissue-level toxicity (liver, kidney, lung chips)", "Barrier function (gut, BBB)", "Organ-organ interaction (multi-chip)", "PK/PD in microtissue"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "Emulate Organ-Chip platform", vendor: "Emulate Bio", role: "Microfluidic organ chips", note: "Liver, kidney, lung" },
      { name: "Image-based analysis (IncuCyte)", vendor: "Sartorius", role: "Live-cell chip monitoring", note: "Automated" }
    ],
    consumables: ["PDMS organ chips (single-use)", "Primary cells or iPSC-derived", "Microfluidic media (perfused)", "Molecular sensors (TEER, biomarkers)"],
    automation: "Automated imaging + perfusion; chip loading is semi-manual.",
    steps: [
      "Seed cells into chip (organ-specific configuration)",
      "Establish perfusion (media flow mimics vasculature)",
      "Confirm tissue formation (TEER, markers, 3–7 days)",
      "Dose compound via perfusion (acute and chronic)",
      "Monitor function live (barrier, secretion, imaging)",
      "Multi-chip arm: connect organs (PK recapitulation)",
      "Compare to 2D controls (predictivity gain)"
    ],
    providers: [pr("ecl", "Organ-on-chip in make+test"), pr("crl", "Organ-on-chip services"), { name: "CN Bio Innovations", note: "Liver MPS leader", region: "UK" }],
    marketNote: "FDA pilot programs accept OOC data — early-stage derisking use case growing.",
    capacityNote: "Still emerging — chip cost and cell sourcing limit scale; specialist labs only."
  },

  {
    id: "mitochondria-toxicity",
    name: "Mitochondrial Toxicity (Seahorse)",
    category: "safety",
    tagline: "Bioenergetics profiling — the liver and cardiac mitotox screen.",
    tests: ["OCR/ECAR (mitochondrial respiration)", "Fatty-acid oxidation (FAO) inhibition", "Mitochondrial membrane potential", "ATP depletion kinetics"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Seahorse XFe96 Analyzer", vendor: "Agilent", role: "Real-time respiration", note: "96-well, live-cell OCR" },
      { name: "GlucoSense / lactate plates", vendor: "Agilent", role: "ECAR readout", note: "Glycolysis" }
    ],
    consumables: ["XFe96 sensor cartridges (single-use)", "Assay media (unbuffered)", "Oligomycin/FCCP/Rotenone injection compounds", "HepG2 or primary hepatocytes"],
    automation: "Fully automated Seahorse workflow; sensor cartridges are the cost.",
    steps: [
      "Seed hepatocytes or cardiomyocytes in XFe96 plate",
      "Load sensor cartridge (hydrated overnight)",
      "Establish baseline OCR + ECAR",
      "Inject compound (test) + mitochondrial modulators (oligomycin, FCCP, rotenone)",
      "Real-time OCR/ECAR traces",
      "Calculate spare respiratory capacity + FAO-specific inhibition",
      "Flag mitochondrial toxicants early"
    ],
    providers: [pr("crl", "Mitotox packages"), pr("eurofins", "Mitochondrial toxicity"), pr("aragen", "Seahorse services at India cost")],
    marketNote: "Mitochondrial toxicity is a leading attrition cause — early screening (Seahorse) is now routine.",
    capacityNote: "Cartridge cost limits high-throughput; 96-well format is standard."
  },

  {
    id: "cardiomyocyte-mea",
    name: "Human Cardiomyocyte MEA (HiPSC)",
    category: "safety",
    tagline: "Field-potential-based cardiac safety — the CiPA 2.0 method.",
    tests: ["Field potential duration (FPD)", "Arrhythmia detection (proarrhythmia)", "Beat-rate and contractility readout", "Multi-channel ion-current integration"],
    drugTypes: ["small-molecule", "antibody"],
    instruments: [
      { name: "MEA systems (Maestro Pro)", vendor: "Axion Bio / NanoBay", role: "Microelectrode-array recording", note: "48-well simultaneous" },
      { name: "hiPSC-CMs (commercial)", vendor: "Fujifilm / CDI", role: "Human cardiomyocytes", note: "Maturation matters" }
    ],
    consumables: ["MEA plates (pre-coated, 48-well)", "hiPSC-derived cardiomyocytes", "Maintenance media", "Reference compounds (dofetilide)"],
    automation: "Automated recording; cell maturation takes 7–14 days pre-dose.",
    steps: [
      "Plate hiPSC-cardiomyocytes onto MEA electrodes",
      "Mature cells 7–14 days (beating monolayer)",
      "Record baseline field potentials (spontaneous)",
      "Dose compound (6–8 concentrations)",
      "Record post-dose (FPD, beat rate, arrhythmia events)",
      "Analyse proarrhythmia risk (FPD prolongation, EAD-like events)",
      "Integrate with ion-channel patch data (CiPA 2.0 in-silico arm)"
    ],
    providers: [pr("metrion", "MEA cardiomyocyte services"), pr("nanion", "MEA-based assays"), pr("eurofins", "hiPSC-CM MEA")],
    marketNote: "CiPA pushed hiPSC-MEA from research to regulatory — CROs invested in capability.",
    capacityNote: "Cell maturation lead time is the constraint; instrument capacity adequate."
  },

  {
    id: "adc-ccr",
    name: "ADC Cytokine-Release and MTD",
    category: "immunology",
    tagline: "Human-blood cytokine storm — the ADC-specific safety concern.",
    tests: ["Cytokine release in human whole blood (IL-6, TNFα, IFNγ)", "Non-specific Fc engagement (off-target)", "Complement activation (C3a, C5a)"],
    drugTypes: ["adc", "antibody"],
    instruments: [
      { name: "Luminex 200 / Ella", vendor: "Luminex / Bio-Techne", role: "Multi-cytokine quantification", note: "Donor-panel required" },
      { name: "Complement ELISA (C3a/C5a)", vendor: "Quidel", role: "Complement activation", note: "Safety arm" }
    ],
    consumables: ["Fresh human donor blood (8+ donors, heparin)", "Cytokine bead kits", "Complement ELISA kits", "Anti-CD3 positive control"],
    automation: "Whole-blood assay — donor logistics limit automation; readouts automate.",
    steps: [
      "Collect fresh blood from 8+ donors (HLA-diverse)",
      "Incubate whole blood with ADC concentration series",
      "Include Fc-silent control (isotype) to isolate Fc effects",
      "Incubate 4–24 h; collect plasma",
      "Measure cytokines (Luminex/Ella) per donor",
      "Measure complement activation (C3a/C5a)",
      "Compare to positive control (anti-CD3); flag storm-risk compounds"
    ],
    providers: [pr("crl", "Cytokine-release services"), pr("bioagilytix", "Whole-blood assays"), pr("eurofins", "Cytokine-release packages")],
    marketNote: "TGN1412 legacy — every Fc-containing biologic now faces cytokine-release scrutiny before FIH.",
    capacityNote: "Fresh-blood requirement makes this a scarce assay — few labs maintain donor panels."
  },

  {
    id: "cgt-release-panel",
    name: "CGT Release-Testing Panel",
    category: "cgt",
    tagline: "The lot-release checklist for cell and gene-therapy batches.",
    tests: ["Vector genome titre (ddPCR)", "Potency assay (transgene expression)", "Residual-DNA quantification", "Sterility/endotoxin (pharmacopoeial)", "Replication-competent virus (RCR/RCL)", "Identity (PCR + sequencing)"],
    drugTypes: ["cgt"],
    instruments: [
      { name: "ddPCR (QX200)", vendor: "Bio-Rad", role: "Vector-genome titre", note: "Absolute quantification" },
      { name: "Endotoxin (EndoZyme)", vendor: "bioMérieux / Charles River", role: "Endotoxin release", note: "rFC method" },
      { name: "Sanger sequencing", vendor: "Standard", role: "Identity confirmation", note: "Transgene sequence" }
    ],
    consumables: ["ddPCR probes (transgene-specific)", "Endotoxin reagent kits (rFC)", "Sterility media (direct-inoculation or membrane)", "Retroviral RCR cell lines"],
    automation: "Semi-automated — the release panel is a fixed checklist with QC gates.",
    steps: [
      "Sample batch (vector or cell product)",
      "ddPCR: quantify vector genomes per mL",
      "Potency: transgene expression in target cells (dose-response)",
      "Residual DNA: qPCR for host-cell DNA (A549)",
      "Sterility: direct-inoculation (14-day) or rapid method",
      "Endotoxin: rFC or LAL (result in EU/mL)",
      "RCR/RCL: retroviral cell-line assay (5-week culture)",
      "Identity: Sanger sequence the transgene",
      "Release report: all specs must pass"
    ],
    providers: [pr("lonza", "CGT release testing"), pr("catalent", "CGT analytics"), pr("crl", "GMP release testing")],
    marketNote: "Every CGT batch needs the panel — the release-testing market scales with CGT batches (500+ per year).",
    capacityNote: "Release slots are scarce at CDMOs — labs with the full panel (esp. RCR) are limited."
  },

  {
    id: "potency-assay-cgt",
    name: "Potency Assay (CGT Products)",
    category: "cgt",
    tagline: "The hardest release test — proving the cells work, every batch.",
    tests: ["Transgene-expression potency (CAR expression)", "Functional potency (cytotoxicity for CAR-T)", "Potency-curve slope and EC50 (release spec)", "Bioassay comparability (reference standard)"],
    drugTypes: ["cgt"],
    instruments: [
      { name: "Flow cytometry (Fortessa)", vendor: "BD", role: "CAR-surface expression", note: "Potency marker" },
      { name: "Luciferase cytotoxicity readout", vendor: "Standard", role: "CAR-T function", note: "Target-cell killing" }
    ],
    consumables: ["Target cells (CD19+ for CAR-T)", "Luciferase substrate", "Reference-standard CAR-T lot", "Counting beads"],
    automation: "Potency assays are bespoke per product — automation varies by modality.",
    steps: [
      "Define product-specific potency marker (expression or function)",
      "Develop bioassay with reference standard (bridge to clinical lot)",
      "Run each batch in the bioassay (parallel to reference)",
      "Fit dose-response; calculate relative potency (%)",
      "Release spec: potency must fall within acceptance window",
      "Validate for precision, linearity, range (ICH Q2(R2))"
    ],
    providers: [pr("lonza", "Potency assay development"), pr("catalent", "Potency release"), pr("bioagilytix", "Cell-based potency")],
    marketNote: "Potency is the #1 CGT release failure — assay development is a bottleneck service.",
    capacityNote: "Bespoke per product; few labs specialise in potency assay development + validation."
  },

  {
    id: "bioassay-neutralizing",
    name: "Neutralizing Antibody Assay (NAb)",
    category: "immunology",
    tagline: "Does the anti-drug antibody neutralise the biologic — the anti-tau, anti-oligo question.",
    tests: ["NAb titer (TC50/IC50)", "Drug-interference characterisation", "Assay cut-point (1% false-positive rate)"],
    drugTypes: ["antibody", "adc", "peptide", "cgt"],
    instruments: [
      { name: "GloMax / EnVision", vendor: "Promega / Revvity", role: "Luciferase or cell-based readout", note: "96-well" }
    ],
    consumables: ["Reporter cells (target-pathway)", "Positive-control NAb (affinity-purified)", "Patient serum samples", "Luciferase substrate"],
    automation: "Cell-based NAb assays automate with plate handling.",
    steps: [
      "Incubate patient serum with fixed drug concentration",
      "Any NAb in serum neutralises drug activity",
      "Add reporter-cell system (drug pathway readout)",
      "Measure signal recovery vs no-serum control",
      "Fit curve; report NAb titer (IC50) per sample",
      "Drug-interference: spike drug at multiple levels to assess assay robustness",
      "Set cut-point via 1% false-positive statistical analysis"
    ],
    providers: [pr("bioagilytix", "NAb assay services"), pr("crl", "NAb for trials"), pr("wuxi", "NAb at scale")],
    marketNote: "Every biologic clinical program needs NAb capability — anti-drug antibodies are the immune-safety issue.",
    capacityNote: "Assay development takes 3–6 months per product; capacity is developer-time constrained."
  },

  {
    id: "dissolution",
    name: "Dissolution Testing (Small-Molecule)",
    category: "qc",
    tagline: "USP II apparatus — the formulation-release workhorse.",
    tests: ["Dissolution profile (time-point release)", "Immediate vs extended release (IVIVC)", "Solubility-limited dissolution (BCS class II/IV)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "USP II (paddle) apparatus", vendor: "Sotax/Vankel", role: "Dissolution vessels + paddles", note: "6–8 vessels per unit" },
      { name: "UV spectrometer or HPLC", vendor: "Standard", role: "Concentration readout", note: "Automated sampling" }
    ],
    consumables: ["Dissolution media (pH 1.2, 4.5, 6.8 buffers)", "Paddle + vessels (900 mL)", "0.45 µm filters", "Standard solutions"],
    automation: "Fully automated (sampling + HPLC online); 6 vessels per run.",
    steps: [
      "Prepare media (pH series mimics GI tract)",
      "Load tablet/capsule into vessel (900 mL, 37°C)",
      "Rotate paddle at 50–100 rpm",
      "Sample at time points (5, 10, 15, 30, 45, 60 min)",
      "Filter + quantify (UV or HPLC)",
      "Plot % released vs time (dissolution profile)",
      "Compare to reference product (F2 similarity test)"
    ],
    providers: [pr("aragen", "Dissolution services"), pr("syngene", "Dissolution at India cost"), pr("eurofins", "Dissolution packages")],
    marketNote: "Every small-molecule formulation program needs dissolution — routine but continuous demand.",
    capacityNote: "Abundant; vessel-cleaning throughput is the only friction."
  },

  {
    id: "peptide-stability",
    name: "Peptide Stability (In-Vitro and Formulation)",
    category: "peptide",
    tagline: "Peptide half-life in plasma and formulation — the stability triage.",
    tests: ["Plasma half-life (human/mouse/rat)", "Proteolytic-clip identification (LC-MS)", "Formulation stability (freeze-thaw, thermal)", "Lyophilised stability (shelf-life)"],
    drugTypes: ["peptide", "oligo"],
    instruments: [
      { name: "LC-MS/MS (HRMS)", vendor: "Thermo/Waters", role: "Clip identification", note: "Peptide fragment analysis" },
      { name: "Thermal-stability readers", vendor: "Unchained Labs", role: "Formulation screen", note: "DSF + turbidity" }
    ],
    consumables: ["Species plasma (human/mouse)", "Peptide series (modified and unmodified)", "Protease inhibitors (control arm)", "Formulation buffers (pH, excipients)"],
    automation: "Plasma-stability plate format automates; LC-MS clip identification is per-sample.",
    steps: [
      "Incubate peptide in plasma at 37°C (time course 0–24 h)",
      "Quench aliquots at each time point (protein precipitation)",
      "LC-MS/MS: quantify remaining parent + identify clips",
      "Fit half-life per peptide; rank modifications (D-amino acids, N-methyl) for stability",
      "Formulation arm: stress with heat/freeze-thaw, measure turbidity + aggregation",
      "Lyophilised arm: accelerated stability (25°C/40°C) over weeks"
    ],
    providers: [pr("aragen", "Peptide stability services"), pr("syngene", "Peptide packages"), pr("eurofins", "Peptide stability"), pr("enamine", "Peptide stability library data")],
    marketNote: "Peptide-therapeutics pipeline (GLP-1 legacy) drives stability-testing demand.",
    capacityNote: "LC-MS time is the constraint; high-throughput plasma screens are standard."
  },

  {
    id: "xray-crystallography",
    name: "X-Ray Crystallography (Fragment/Co-Structure)",
    category: "binding",
    tagline: "Atomic-resolution structures — the FBDD endgame and structure-based design.",
    tests: ["Protein-ligand co-crystal structure", "Fragment-binding modes (pose validation)", "Structure-enabled design iterations"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Synchrotron beamline or in-house (Rigaku)", vendor: "Diamond / Rigaku", role: "X-ray diffraction", note: "In-house for routine" },
      { name: "Mosquito LCP crystallisation robot", vendor: "SPT Labtech", role: "Automated crystallisation", note: "Nanolitre drops" }
    ],
    consumables: ["Crystallisation screens (commercial)", "Protein (purified, >95%)", "Ligand soaks (fragment at 10–100 mM)", "Cryoprotectants"],
    automation: "Crystallisation automates (robots); diffraction collection is instrument-time.",
    steps: [
      "Purify protein to >95% (mg quantities)",
      "Screen crystallisation conditions (automated drops)",
      "Grow crystals (days to weeks)",
      "Soak with ligand or co-crystallise",
      "Collect diffraction data (synchrotron or in-house)",
      "Solve structure (molecular replacement)",
      "Iterate: design new ligands from structure"
    ],
    providers: [pr("ecl", "Structure-assisted chemistry"), pr("crl", "Crystallography services"), pr("chemify", "Structure-informed chemistry"), pr("wuxi", "Structural biology at scale")],
    marketNote: "Structure-based design is standard for kinase/GPCR programs — the fragment-to-clinical workflow.",
    capacityNote: "Crystallisation hit-rate is the bottleneck (not all proteins crystallise); cryo-EM is the alternative."
  },

  {
    id: "hdx-ms",
    name: "HDX-MS (Epitope Mapping)",
    category: "binding",
    tagline: "Hydrogen-deuterium exchange — the solution-based epitope-mapping method.",
    tests: ["Epitope mapping (antibody-antigen)", "Conformational-change mapping (ligand-induced)", "Protein-dynamics comparison (biosimilar)"],
    drugTypes: ["antibody", "small-molecule"],
    instruments: [
      { name: "HDX-MS system (LEAP robot + Orbitrap)", vendor: "Thermo + LEAP", role: "Automated exchange + LC-MS", note: "Specialised" }
    ],
    consumables: ["Deuterium oxide (D₂O)", "Protein samples (antibody + antigen)", "Pepsin column (online digestion)", "LC-MS standards"],
    automation: "LEAP robot automates exchange; data analysis is expert software (HDExaminer).",
    steps: [
      "Incubate protein in D₂O (time series: 10 s to 10⁴ s)",
      "Exchangeable hydrogens take up deuterium (structure-dependent)",
      "Quench (low pH, 0°C)",
      "Online pepsin digestion + LC-MS",
      "Compare deuterium uptake: apo vs ligand-bound",
      "Regions protected on binding = epitope",
      "Map onto structure (epitope visualisation)"
    ],
    providers: [pr("bioagilytix", "HDX-MS epitope services"), pr("crl", "HDX-MS packages"), { name: "Saromics Biostructures", note: "HDX-MS services", region: "SE" }],
    marketNote: "Regulatory epitope-mapping expectation for antibody programs — HDX-MS complements crystallography.",
    capacityNote: "Few labs run HDX-MS (specialised instrumentation); turnaround 1–2 weeks per epitope."
  },

  {
    id: "cryo-em",
    name: "Cryo-EM (Structural Biology)",
    category: "binding",
    tagline: "Electron microscopy for large complexes — membrane proteins and antibodies.",
    tests: ["Protein-complex structure (3–5 Å)", "Membrane-protein structure (GPCR, ion channel)", "Antibody-antigen complex architecture"],
    drugTypes: ["antibody", "small-molecule", "peptide"],
    instruments: [
      { name: "Krios / Glacios cryo-TEM", vendor: "Thermo Fisher", role: "Electron-microscope imaging", note: "Titan Krios = flagship" },
      { name: "Vitrobot (plunge-freezer)", vendor: "Thermo Fisher", role: "Grid preparation", note: "Vitrification" }
    ],
    consumables: ["Cryo-EM grids (gold, lacey carbon)", "Liquid nitrogen (plunge-freezing)", "Protein samples (mg quantities)", "Calibration standards"],
    automation: "Automated data collection (EPU software); grid screening is semi-manual.",
    steps: [
      "Purify protein complex (homogeneity critical)",
      "Apply to grid; plunge-freeze in liquid ethane (vitrification)",
      "Screen grids for ice thickness + particle distribution",
      "Collect micrographs (automated, thousands per day)",
      "2D classification + 3D reconstruction (RELION)",
      "Refine to 3–5 Å resolution",
      "Map ligand or antibody epitope onto structure"
    ],
    providers: [pr("ecl", "Structure-enabled chemistry"), { name: "NanoImaging Services", note: "Cryo-EM CRO", region: "US" }, pr("wuxi", "Structural biology services")],
    marketNote: "Cryo-EM replaced crystallography for membrane proteins — the GPCR and ion-channel structure wave.",
    capacityNote: "Krios access is the constraint (few instruments, €10M+); dedicated CROs exist but slots book out."
  },

  {
    id: "sp2d2",
    name: "Sialic-Acid Panel (SP2D2)",
    category: "bioanalysis",
    tagline: "Sialylation and glycan distribution — the immunogenicity and PK link.",
    tests: ["Total sialic acid (Neu5Ac/Neu5Gc)", "Glycan distribution (HILIC)", "PK impact of sialylation (clearance)"],
    drugTypes: ["antibody", "peptide"],
    instruments: [
      { name: "HILIC-FLD", vendor: "Waters/Thermo", role: "Glycan separation", note: "2-AB labelled" },
      { name: "SP2D2 kit reader", vendor: "Ludger", role: "Sialic-acid quantification", note: "DMB-labelled" }
    ],
    consumables: ["DMB labelling kit (sialic acids)", "Neu5Ac/Neu5Gc standards", "HILIC columns", "Release enzymes (sialidase)"],
    automation: "Standard LC-based automation.",
    steps: [
      "Release sialic acids (mild acid hydrolysis or sialidase)",
      "Label with DMB (fluorescent)",
      "Separate Neu5Ac vs Neu5Gc by HPLC",
      "Quantify total sialic acid per protein",
      "Correlate with PK data (sialylation delays clearance)",
      "Compare batches (consistency check)"
    ],
    providers: [pr("lonza", "Sialic-acid release testing"), pr("wuxi", "Glycan analytics at scale"), pr("eurofins", "Sialylation services")],
    marketNote: "High-sialylation biologics (longer PK) drive the assay; Neu5Gc is the immunogenicity flag.",
    capacityNote: "Standard LC workflow; Ludger kits are specialised but available."
  }
);
