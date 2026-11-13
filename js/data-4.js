// Expansion 3 — Genetic toxicology, safety in vitro, ADME/DMPK
ASSAYS.push(
  {
    id: "ames",
    name: "Ames Test (Bacterial Reverse Mutation)",
    category: "safety",
    tagline: "The regulatory genotoxicity gate — five strains, with and without S9.",
    tests: ["Mutagenicity (revertant colonies)", "Frame-shift and base-pair substitution detection", "OECD 471 compliant package"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Ames MPF / miniaturised fluctuation", vendor: "Xenometrix / Moltox", role: "Microplate Ames", note: "384-well, less compound" },
      { name: "Standard pour-plate method", vendor: "Any BSL-2 lab", role: "OECD 471 classic", note: "2-day incubation" }
    ],
    consumables: ["S. typhimurium strains TA98, TA100, TA1535, TA1537, TA102", "Rat-liver S9 fraction + cofactors", "Top agar + histidine-free minimal plates"],
    automation: "Miniaturised Ames (MPF) automates on liquid handlers; classic pour-plate remains manual.",
    steps: [
      "Grow the five tester strains overnight (genotype-check with crystal violet)",
      "Mix compound dilution series + strain + (±)S9 in top agar",
      "Pour onto minimal-glucose plates",
      "Incubate 48–72 h at 37°C",
      "Count revertant colonies; compare to vehicle control",
      "Positive controls confirm strain sensitivity (2-AA, MMS)",
      "Two-fold rule: compound is positive if revertants ≥2× control with dose response"
    ],
    providers: [pr("crl", "GLP Ames for regulatory submission"), pr("evotec", "Ames in genotox packages"), pr("pharmaron", "Ames at China cost"), pr("aragen", "Ames in India")],
    marketNote: "Mandatory for IND — every small molecule passes through. Miniaturised versions cut compound requirement 10×.",
    capacityNote: "GLP slots at major CROs book 2–4 weeks ahead; standard capacity is adequate."
  },

  {
    id: "micronucleus",
    name: "In vitro Micronucleus Assay",
    category: "safety",
    tagline: "Chromosome-damage detection — the second regulatory genotox test.",
    tests: ["Micronucleus frequency in treated cells", "Aneugenic vs clastogenic mechanism (centromere staining)", "OECD 487 compliance"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "High-content imagers (ImageXpress)", vendor: "Molecular Devices", role: "Automated MN scoring", note: "Replaces manual microscopy" },
      { name: "FACS-based MN scoring", vendor: "BD / Beckman", role: "Flow MN", note: "Laser-scoring cytometry" }
    ],
    consumables: ["TK6 lymphoblastoid or CHO cells", "Cytochalasin B (for cytokinesis-block method)", "CREST/centromere antibodies (mechanism)", "Acridine-orange staining"],
    automation: "Automated image scoring industrialised MN — manual scoring is obsolete at volume.",
    steps: [
      "Treat cells with compound for 1.5–2 cell cycles (±S9)",
      "Add cytochalasin B to block cytokinesis (CBMN method)",
      "Harvest and stain nuclei (acridine orange or DAPI)",
      "Score 2,000 binucleated cells per concentration (imaging software)",
      "Count micronuclei in binucleated cells",
      "Centromere staining separates aneuploidy (centromere+) from clastogenicity (centromere−)",
      "Compare to vehicle controls with Fisher exact statistics"
    ],
    providers: [pr("crl", "GLP in vitro MN"), pr("evotec", "Micronucleus packages"), pr("pharmaron", "MN at China cost")],
    marketNote: "Paired with Ames as the standard early-genotox package — regulatory expectation for IND.",
    capacityNote: "Automated scoring removed the throughput bottleneck; cell-line choice (TK6 vs CHO) affects regulatory acceptance."
  },

  {
    id: "comet",
    name: "Comet Assay (Single-Cell Gel Electrophoresis)",
    category: "safety",
    tagline: "DNA strand-break detection at single-cell level — sensitive genotoxicity screen.",
    tests: ["DNA strand breaks per cell", "Oxidative damage (Fpg-modified comet)", "In vivo→in vitro translation dosimetry"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Comet assay tanks + fluorescence microscopy", vendor: "Cleaver / Trevigen kits", role: "Electrophoresis + imaging", note: "20 gels/run" },
      { name: "Comet IV / ImageJ plugins", vendor: "Perceptive Instruments", role: "Automated tail scoring", note: "100 cells/gel" }
    ],
    consumables: ["Low-melting agarose", "Trevigen comet slides (pre-coated)", "Lysis solution + alkaline unwinding buffer", "SYBR Green stain"],
    automation: "Semi-automated imaging; slide handling remains manual.",
    steps: [
      "Embed treated cells in low-melting agarose on slides",
      "Lyse overnight in high-salt detergent solution",
      "Alkaline unwind (pH>13) to relax DNA",
      "Electrophorese (25 V, 30 min) — broken DNA migrates",
      "Neutralise and stain with SYBR Green",
      "Image 100 cells per slide; quantify tail moment",
      "Statistical comparison vs vehicle controls"
    ],
    providers: [pr("crl", "Comet in genotox packages"), pr("eurofins", "Comet services"), pr("evotec", "Comet + MN bundles")],
    marketNote: "Niche screen — often run as follow-up to Ames/MN positives or for environmental genotox.",
    capacityNote: "Specialist capability; inter-lab variability is a known reproducibility problem."
  },

  {
    id: "chromab",
    name: "Chromosomal Aberration Assay",
    category: "safety",
    tagline: "Metaphase-spread analysis — the classical cytogenetic damage assay.",
    tests: ["Structural aberrations (deletions, exchanges)", "Numerical aberrations (polyploidy)", "OECD 473 compliance"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Automated metaphase scanners", vendor: "MetaSystems", role: "Automated aberration scoring", note: "Karyotype imaging" }
    ],
    consumables: ["CHO or human lymphocytes", "Colcemid (metaphase arrest)", "Hypotonic KCl", "Giemsa stain"],
    automation: "MetaSystems automated scanning scores slides; confirmation remains manual cytogenetics.",
    steps: [
      "Treat lymphocytes/CHO cells with compound (±S9, 3 and 24 h)",
      "Add colcemid for last 2 h to arrest at metaphase",
      "Hypotonic KCl swelling; fix with methanol:acetic acid",
      "Drop onto slides; stain with Giemsa",
      "Score 200 metaphases per dose (automated + manual)",
      "Classify aberrations (breaks, exchanges, dicentrics)",
      "Compare to vehicle with Fisher exact"
    ],
    providers: [pr("crl", "GLP chromosomal aberration"), pr("evotec", "Cytogenetics packages"), pr("pharmaron", "ChromAb at China cost")],
    marketNote: "Declining (replaced by MN for screening) but still required in some regions' packages.",
    capacityNote: "Fewer labs maintain cytogenetics expertise — scarcity growing."
  },

  {
    id: "mla",
    name: "Mouse Lymphoma TK Assay (MLA)",
    category: "safety",
    tagline: "Gene-mutation detection at the TK locus — genotoxicity with large-mutant window.",
    tests: ["Mutant frequency at thymidine-kinase locus", "Small vs large colony detection (point vs chromosomal)", "GLP for regulatory"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "96-well cloning + TFT selection", vendor: "Standard tissue culture", role: "MLA format", note: "10–12 day culture" }
    ],
    consumables: ["L5178Y tk+/− cells", "Trifluorothymidine (TFT) selection", "Mutant-free culture medium", "Viability plating reagents"],
    automation: "Semi-automated plating; the long culture is the bottleneck.",
    steps: [
      "Treat L5178Y cells with compound (4 h ±S9, 24 h)",
      "Expression period (2 days) to fix mutations",
      "Clone in TFT selection medium (10–12 days)",
      "Count TFT-resistant colonies (mutants)",
      "Distinguish small (chromosomal) vs large (point) colonies",
      "Calculate mutant frequency vs vehicle",
      "GLP report for regulatory package"
    ],
    providers: [pr("crl", "GLP MLA"), pr("evotec", "MLA in genotox suite")],
    marketNote: "Legacy but still requested for some regulatory packages — capacity shrinking.",
    capacityNote: "Very few labs run MLA now — 4–6 week lead times."
  },

  {
    id: "mitotox",
    name: "Mitochondrial Toxicity (Seahorse / High-Content)",
    category: "safety",
    tagline: "Organellar toxicity — OCR/ECAR profiling and mitochondrial-membrane potential.",
    tests: ["Oxygen-consumption rate (OCR) dose-response", "ECAR glycolytic compensation", "Mitochondrial membrane potential (TMRE/JC-1)"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Seahorse XFe96 / XFe24", vendor: "Agilent", role: "OCR/ECAR metabolic flux", note: "96-well, real-time" },
      { name: "Cell Imaging Multi-Channel", vendor: "Revvity", role: "Mitochondrial imaging", note: "TMRE + morphology" }
    ],
    consumables: ["Seahorse XF plates (hydrophobic wells)", "Seahorse assay medium + substrates", "TMRE/JC-1 dyes", "Oligomycin/FCCF/rotenone controls"],
    automation: "Seahorse plates are low-throughput (24–96 wells); automation partial.",
    steps: [
      "Seed cells in Seahorse plates; equilibrate in assay medium",
      "Baseline OCR + ECAR measurement",
      "Inject compound dilution; measure acute metabolic change",
      "Mitochondrial stress test arm: oligomycin → FCCP → rotenone (3 injections)",
      "Quantify ATP-linked respiration, proton leak, max respiratory capacity",
      "Fit mitochondrial-toxicity IC50 (OCR decline)",
      "Confirm with TMRE membrane-potential imaging"
    ],
    providers: [pr("eurofins", "Mitochondrial toxicity services"), pr("crl", "Mitotox packages"), pr("evotec", "Seahorse-based assays")],
    marketNote: "FDA mitochondrial-toxicity emphasis (organ toxicity) drives demand — especially for nucleoside analogues and antibiotics.",
    capacityNote: "Seahorse instrument capacity is the constraint — few CROs have multiple analysers."
  },

  {
    id: "phototox",
    name: "Phototoxicity (3T3 Neutral-Red Uptake)",
    category: "safety",
    tagline: "UVA/UVB-induced toxicity — required for photosensitive chemical classes.",
    tests: ["Photo-irritation factor (PIF)", "UV-induced cytotoxicity shift", "OECD 432 compliance"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "UV-A/UV-B solar simulator", vendor: "Oriel / standard", role: "Controlled irradiation", note: "5 J/cm² UVA standard" },
      { name: "SpectraMax reader", vendor: "Molecular Devices", role: "NRU absorbance", note: "96-well" }
    ],
    consumables: ["BALB/c 3T3 fibroblasts", "Neutral-red dye", "UV-transparent plates (special)" ],
    automation: "Semi-automated; UV exposure step is manual.",
    steps: [
      "Treat 3T3 cells with compound dilution series",
      "Expose one plate to UVA (5 J/cm²), keep duplicate in dark",
      "Incubate 18–24 h post-exposure",
      "Neutral-red uptake readout (viability proxy)",
      "Compare IC50 light vs dark → photo-irritation factor (PIF)",
      "PIF >5 or negative-light-only = phototoxic candidate"
    ],
    providers: [pr("eurofins", "Phototox screening"), pr("crl", "Phototoxicity packages"), pr("evotec", "3T3 NRU service")],
    marketNote: "Required for UV-absorbing pharmacophores (fluoroquinolones, thiazides) — steady niche demand.",
    capacityNote: "Specialist UV-simulator setups limit providers."
  },

  {
    id: "skinsens",
    name: "Skin Sensitization (KeratinoSens / DPRA)",
    category: "safety",
    tagline: "In vitro alternatives to the LLNA — Nrf2 pathway and peptide reactivity.",
    tests: ["KE1 peptide reactivity (DPRA)", "KE2 keratinocyte Nrf2 activation (KeratinoSens)", "OECD 442C/D compliance"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "KeratinoSens reporter cells", vendor: "Givaudan (licensed)", role: "ARE-Nrf2 luciferase", note: "OECD 442D" },
      { name: "HPLC-UV/MS", vendor: "Waters/Agilent", role: "DPRA peptide depletion", note: "OECD 442C" }
    ],
    consumables: ["KeratinoSens cell line", "Synthetic peptides (Cys/Lys) for DPRA", "Luciferase reagents", "Positive controls (cinnamic aldehyde)"],
    automation: "Both assays are plate-based — fully automatable.",
    steps: [
      "DPRA: incubate compound with Cys and Lys peptides (24 h), quantify remaining peptide by HPLC",
      "KeratinoSens: transfect ARE-luciferase keratinocytes, dose compound 48 h",
      "Read luciferase induction (≥1.5-fold + viability = positive)",
      "Combine DPRA + KeratinoSens per OECD 2-out-of-3 strategy",
      "Classify as skin sensitizer/non-sensitizer"
    ],
    providers: [pr("eurofins", "Skin sensitisation in vitro"), pr("crl", "Sensitisation packages"), { name: "Givaudan test service", note: "Originator KeratinoSens", region: "CH" }],
    marketNote: "Animal-testing bans (EU cosmetics) pushed defined-approach testing — regulatory-driven growth.",
    capacityNote: "Well supplied; DPRA needs HPLC capacity — standard."
  },

  {
    id: "ros",
    name: "Reactive Oxygen Species (ROS) Assay",
    category: "safety",
    tagline: "Oxidative-stress quantification — mechanistic toxicity flag.",
    tests: ["Intracellular ROS (DCFDA)", "Mitochondrial superoxide (MitoSOX)", "Antioxidant-response activation (Nrf2 reporter)"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Flow cytometers (DCFDA)", vendor: "BD / Beckman", role: "ROS quantification", note: "Single-cell" },
      { name: "Plate readers (fluorescence)", vendor: "Tecan / BMG", role: "Population ROS", note: "384-wel" }
    ],
    consumables: ["DCFDA / MitoSOX Red probes", "tert-Butyl hydroperoxide (positive control)", "N-acetylcysteine (negative control)"],
    automation: "Simple add-probe-read workflow automates fully.",
    steps: [
      "Load cells with DCFDA (30 min)",
      "Treat with compound (1–24 h depending on endpoint)",
      "Read fluorescence (Ex 488/Em 530)",
      "Normalise to cell count",
      "Compare to tBHQ positive and NAC negative controls",
      "Dose-response for ROS induction"
    ],
    providers: [pr("eurofins", "ROS screening"), pr("crl", "Oxidative-stress packages"), pr("evotec", "ROS + mitotox bundles")],
    marketNote: "Supporting evidence for mechanism-of-toxicity — demand from mechanistic-tox programs.",
    capacityNote: "Commodity; no constraint."
  },

  {
    id: "microsomal",
    name: "Liver Microsomal Stability",
    category: "adme",
    tagline: "Phase-I clearance in a tube — the first ADME triage for new molecules.",
    tests: ["Intrinsic clearance (CLint)", "Half-life (t½) in NADPH-supported system", "Species comparison (human/rat/dog/mouse)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "RapidFire 400 + MS", vendor: "Agilent", role: "High-throughput incubation readout", note: "Seconds per sample" },
      { name: "Hamilton STAR", vendor: "Hamilton", role: "Incubation automation", note: "96-well timed quenches" }
    ],
    consumables: ["Pooled liver microsomes (human + preclinical species)", "NADPH regeneration system", "Quench solvent (acetonitrile + IS)", "Warfarin/verapamil controls"],
    automation: "Fully industrialised — Cyprotex-style 384-well with automated timed quenches.",
    steps: [
      "Pre-warm microsomes + NADPH at 37°C",
      "Start reaction by adding compound (1 µM final)",
      "Quench aliquots at 0/15/30/45/60 min into acetonitrile + IS",
      "Centrifuge; analyse supernatant by LC-MS/MS",
      "Plot ln(parent remaining) vs time → t½",
      "Scale to CLint (µL/min/mg) via well-stirred model",
      "Flag CLint >30 µL/min/mg for chemistry redesign"
    ],
    providers: [pr("evotec", "Microsomal stability at industrial scale"), pr("pharmaron", "Stability panels"), pr("aragen", "ADME at India cost"), pr("selvita", "EU-timezone ADME")],
    marketNote: "The highest-volume ADME assay — every small-molecule series runs it per design cycle.",
    capacityNote: "Abundant capacity; competition is price (India labs ~40% cheaper)."
  },

  {
    id: "hepatocyte",
    name: "Plated Hepatocyte Stability",
    category: "adme",
    tagline: "Whole-cell metabolism — Phase I + Phase II in one assay.",
    tests: ["Hepatocyte CLint (Phase I + II)", "Biliary-efflux contribution (sandwich cultures)", "Species comparison"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "LC-MS/MS (triple quad)", vendor: "SCIEX / Waters", role: "Parent quantification", note: "96-well batches" },
      { name: "Seeded-plate incubators", vendor: "Standard", role: "2D hepatocyte culture", note: "Overlay matrigel for biliary" }
    ],
    consumables: ["Cryopreserved plated hepatocytes (donor lots)", "Williams E medium", "Overlay matrix (sandwich format)", "Probe substrates for Phase II"],
    automation: "Semi-automated; donor-lot logistics and plating skill are the bottleneck.",
    steps: [
      "Thaw and recover cryopreserved hepatocytes",
      "Seed in collagen-coated plates; overlay for sandwich format",
      "Dose compound (1 µM) into monolayers",
      "Sample supernatant at 0/1/2/4/6 h",
      "Quantify parent by LC-MS/MS",
      "Fit first-order decay → hepatocyte t½ and CLint",
      "Compare to microsomal CLint (Phase-II contribution visible)"
    ],
    providers: [pr("evotec", "Hepatocyte stability + induction"), pr("crl", "Hepatocyte services"), pr("pharmaron", "Hepatocyte packages")],
    marketNote: "Hepatocyte assays command 3–5× microsomal pricing — the premium ADME tier.",
    capacityNote: "Hepatocyte lot quality is the industry constraint — good donor lots gate throughput."
  },

  {
    id: "plasma-stability",
    name: "Plasma Stability",
    category: "adme",
    tagline: "Esterase survival in blood — 2-hour triage for labile chemotypes.",
    tests: ["Parent remaining after plasma incubation", "Species differences (human/mouse/rat)", "Esterase-susceptibility flag"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "LC-MS/MS", vendor: "SCIEX", role: "Parent quantification", note: "96-well" }
    ],
    consumables: ["Pooled plasma (species matrix)", "EDTA or heparin tubes", "Quench solvent", "Procaine control (labile)"],
    automation: "Simple plate incubation — fully automatable.",
    steps: [
      "Incubate compound (5 µM) in plasma at 37°C",
      "Sample at 0/15/30/60/120 min",
      "Quench with acetonitrile + internal standard",
      "LC-MS/MS quantification of parent",
      "Fit decay → plasma t½",
      "Flag t½ <30 min (labile) for prodrug redesign"
    ],
    providers: [pr("evotec", "Plasma stability"), pr("pharmaron", "Plasma stability panels"), pr("aragen", "ADME screening")],
    marketNote: "Cheap, fast, universally required for ester/amide-containing series.",
    capacityNote: "No constraint — commodity."
  },

  {
    id: "cyp-inhibition",
    name: "CYP Inhibition Panel",
    category: "adme",
    tagline: "The DDI risk screen — five major CYPs, reversible IC50.",
    tests: ["CYP1A2/2C9/2C19/2D6/3A4 IC50", "DDI risk flag (IC50 <1 µM)", "Probe-substrate selectivity verification"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Cocktail LC-MS/MS (5-in-1)", vendor: "SCIEX triple quad", role: "Probe-metabolite quantification", note: "Single incubation read" },
      { name: "RapidFire MS", vendor: "Agilent", role: "High-throughput DDI screen", note: "Seconds per sample" }
    ],
    consumables: ["Recombinant CYP isoforms or HLM", "Probe substrates (phenacetin, diclofenac, omeprazole, dextromethorphan, midazolam)", "Metabolite standards", "NADPH"],
    automation: "Cocktail formats (all 5 CYPs in one incubation) industrialised the assay.",
    steps: [
      "Incubate compound dilution series with CYP isoform + probe substrate at Km",
      "Incubate 10–30 min with NADPH",
      "Quantify probe metabolite formation (LC-MS/MS)",
      "Normalise to vehicle control",
      "Fit IC50 per isoform",
      "Flag IC50 <1 µM for follow-up (Ki determination + TDI)"
    ],
    providers: [pr("evotec", "CYP panels (cocktail)"), pr("pharmaron", "CYP services"), pr("aragen", "CYP at India cost")],
    marketNote: "Mandatory pre-IND screen — steady demand tracking small-molecule INDs.",
    capacityNote: "Well supplied; cocktail innovation (5-in-1) removed throughput limits."
  },

  {
    id: "cyp-tdi",
    name: "CYP Time-Dependent Inhibition (TDI)",
    category: "adme",
    tagline: "Metabolite-activated CYP inactivation — the worse DDI surprise.",
    tests: ["kinact/KI for mechanism-based inactivators", "IC50 shift (±pre-incubation)", "Clinical-DDI prediction (static + PBPK)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "LC-MS/MS kinetic reads", vendor: "SCIEX", role: "Probe-metabolite quantification", note: "Multi-timepoint" }
    ],
    consumables: ["Recombinant CYP + probe substrate", "NADPH (pre-incubation dependent)", "Positive TDI control (mifepristone for 3A4)"],
    automation: "Time-course design (pre-incubation matrix) complicates automation — semi-manual.",
    steps: [
      "Pre-incubate compound with CYP + NADPH (30 min, inactivator accumulates)",
      "Dilute into probe-substrate assay (measure residual activity)",
      "Vary pre-incubation time and compound concentration (matrix)",
      "Fit exponential activity decay per concentration",
      "Extract kinact and KI (inactivation kinetics)",
      "Predict clinical DDI by static equation or PBPK model"
    ],
    providers: [pr("evotec", "TDI specialist services"), pr("crl", "TDI for DDI packages"), pr("pharmaron", "TDI services")],
    marketNote: "Regulatory DDI expectation for any 3A4/2D6 inhibitor candidate — premium ADME tier.",
    capacityNote: "Time-course complexity limits automation — 2–4 week turnaround typical."
  },

  {
    id: "cyp-induction",
    name: "CYP Induction (PXR reporter + mRNA)",
    category: "adme",
    tagline: "Nuclear-receptor-mediated CYP upregulation — the other DDI axis.",
    tests: ["CYP1A2/2B6/3A4 mRNA induction (fold + EC50)", "PXR/AhR reporter activation", "Human hepatocyte requirement for regulatory"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "qPCR (TaqMan)", vendor: "Thermo Fisher", role: "mRNA quantification", note: "96-well" },
      { name: "PXR reporter assay", vendor: "Indigo Biosciences", role: "Nuclear-receptor screen", note: "384-well" }
    ],
    consumables: ["Plated human hepatocytes (3 donors, regulatory)", "qPCR reagents + primers", "Positive controls (omeprazole, rifampin)", "Luciferase detection"],
    automation: "Semi-automated; 3-donor hepatocyte requirement makes it expensive.",
    steps: [
      "Treat plated human hepatocytes (3 donors) for 72 h with compound series",
      "Harvest RNA; reverse-transcribe",
      "qPCR for CYP1A2, 2B6, 3A4 mRNA (normalise to housekeeping)",
      "Fit induction curves → Emax and EC50",
      "Compare to positive controls (rifampin for 3A4)",
      "Regulatory: >2-fold induction at clinical Cmax → DDI assessment"
    ],
    providers: [pr("evotec", "CYP induction in hepatocytes"), pr("crl", "Induction packages"), pr("pharmaron", "Induction services")],
    marketNote: "Required for regulatory DDI packages — the most expensive standard ADME assay (hepatocyte donors).",
    capacityNote: "3-donor hepatocyte requirement is the capacity gate — plan 3–4 weeks."
  },

  {
    id: "ppb",
    name: "Plasma Protein Binding (Equilibrium Dialysis)",
    category: "adme",
    tagline: "Fraction unbound — the pharmacologically-active fraction.",
    tests: ["fu in plasma (human + species)", "Blood-plasma ratio", "fu for PK modelling input"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "RED (Rapid Equilibrium Dialysis) plates", vendor: "Thermo Fisher", role: "96-well dialysis", note: "4–6 h equilibration" },
      { name: "LC-MS/MS", vendor: "SCIEX", role: "Both-side quantification", note: "Matrix-matched" }
    ],
    consumables: ["RED plates (dialysis membrane 8 kDa)", "Pooled plasma", "Phosphate buffer", "DMSO vehicle (<0.5%)"],
    automation: "Fully automatable plate dialysis — commodity ADME assay.",
    steps: [
      "Load plasma + compound into RED donor chamber",
      "Buffer in receiving chamber; incubate 4–6 h at 37°C",
      "Sample both chambers",
      "LC-MS/MS quantification (matrix-matched curves)",
      "Calculate fu = receiver / (receiver + donor)",
      "Mass-balance check (recovery 70–130%)",
      "Input fu into PK modelling (free-drug hypothesis)"
    ],
    providers: [pr("evotec", "PPB at scale"), pr("pharmaron", "PPB services"), pr("aragen", "PPB at India cost")],
    marketNote: "Universal PK input — steady commodity volume.",
    capacityNote: "No constraint."
  },

  {
    id: "caco2",
    name: "CACO-2 Permeability",
    category: "adme",
    tagline: "Intestinal-permeability prediction — the oral-bioavailability gate.",
    tests: ["Papp A→B and B→A", "Efflux ratio (P-gp substrate flag)", "Oral-absorption classification"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Transwell plates + LC-MS/MS", vendor: "Corning + SCIEX", role: "Permeability readout", note: "21-day cell culture" },
      { name: "Automated Transwell handling", vendor: "Hamilton", role: "Dosing automation", note: "96-well" }
    ],
    consumables: ["CACO-2 cells (21-day differentiation)", "Transwell inserts (0.4 µm polyester)", "HBSS buffer + HEPES", "Lucifer yellow (monolayer integrity)"],
    automation: "21-day culture is the bottleneck; automated cell maintenance emerging.",
    steps: [
      "Culture CACO-2 monolayers on Transwell inserts for 21 days",
      "Verify monolayer integrity (TEER + lucifer yellow)",
      "Dose compound on apical side (A→B) and basolateral (B→A)",
      "Sample receiver side at timepoints (0–120 min)",
      "LC-MS/MS quantification; calculate Papp",
      "Efflux ratio = Papp(B→A)/Papp(A→B)",
      "Efflux ratio >2 → P-gp substrate (co-dose with elacridar to confirm)"
    ],
    providers: [pr("evotec", "CACO-2 services (Cyprotex heritage)"), pr("pharmaron", "CACO-2"), pr("aragen", "CACO-2 at India cost")],
    marketNote: "Oral-drug programs all pass through — steady demand; MDCK-MDR1 is the faster alternative.",
    capacityNote: "21-day culture limits surge capacity; MDCK (3-day) is the throughput escape."
  },

  {
    id: "mdck",
    name: "MDCK-MDR1 Permeability",
    category: "adme",
    tagline: "The fast permeability assay — 3-day culture vs CACO-2's 21.",
    tests: ["Papp A→B / B→A", "P-gp substrate identification", "Brain-penetration proxy (MDCK-MDR1 vs wild-type)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Transwell + LC-MS/MS", vendor: "Corning + SCIEX", role: "Permeability quantification", note: "96-well" }
    ],
    consumables: ["MDCK-MDR1 cells (3-day culture)", "Transwell inserts", "HBSS + buffer", "Lucifer yellow (integrity marker)"],
    automation: "Shorter culture enables higher throughput than CACO-2.",
    steps: [
      "Culture MDCK-MDR1 monolayers (3 days) on Transwell",
      "Verify integrity (TEER)",
      "Bidirectional dosing (A→B, B→A)",
      "Sample receiver at 0–90 min",
      "Calculate Papp and efflux ratio",
      "Compare MDR1 vs wild-type MDCK for brain-penetration flag"
    ],
    providers: [pr("evotec", "MDCK permeability"), pr("pharmaron", "MDCK services"), pr("aragen", "MDCK at India cost")],
    marketNote: "CNS programs run MDCK-MDR1 as the brain-exposure proxy — faster and cheaper than CACO-2.",
    capacityNote: "Abundant; the standard high-throughput permeability option."
  },

  {
    id: "pampa",
    name: "PAMPA (Parallel Artificial Membrane Permeability)",
    category: "adme",
    tagline: "Non-cell membrane mimic — 30-minute transwell screen.",
    tests: ["Passive permeability (Pe)", "Transcellular vs paracellular flag", "High-throughput ranking (100s/day)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "PAMPA plates + UV plate reader", vendor: "BD (BioCoat) / pION", role: "Sandwich assay", note: "96-wel" }
    ],
    consumables: ["PAMPA lipid membrane (hexadecane/dodecane)", "Buffer at pH 5.0–7.4 variants", "UV-transparent plates"],
    automation: "Simple sandwich format — fully automatable, 10× cheaper than cell-based.",
    steps: [
      "Prepare artificial lipid membrane in donor well",
      "Add compound solution below membrane",
      "Receiver buffer above; incubate 30 min–5 h",
      "Quantify compound in receiver (UV or LC-MS)",
      "Calculate Pe (permeability coefficient)",
      "Rank compounds for passive-permeation suitability"
    ],
    providers: [pr("evotec", "PAMPA screening"), pr("pharmaron", "PAMPA services"), pr("aragen", "PAMPA at India cost")],
    marketNote: "The cheapest permeability triage — used upstream of cell-based assays.",
    capacityNote: "No constraint — commodity."
  },

  {
    id: "transporters",
    name: "Transporter Assays (OATP, OCT, BCRP, MRP)",
    category: "adme",
    tagline: "Uptake and efflux transporter panels — DDI and organ-uptake risk.",
    tests: ["OATP1B1/1B3 uptake inhibition", "BCRP/MRP efflux substrate identification", "Renal transporters (OAT1/3, OCT2)"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Transwell/plate + LC-MS/MS", vendor: "Standard", role: "Transport quantification", note: "Cell-based" },
      { name: "Vesicular transport assay", vendor: "Corning (Solvo)", role: "Efflux ATPase", note: "Membrane vesicles" }
    ],
    consumables: ["Transporter-expressing cells (HEK-OATP etc.)", "Probe substrates (statins, metformin)", "Membrane vesicles (BCRP/MRP)", "Positive inhibitors (rifampin, probenecid)"],
    automation: "Semi-automated; vesicle assays are plate-based.",
    steps: [
      "Culture transporter-expressing cells (or prepare vesicles)",
      "Dose probe substrate + test compound series",
      "For uptake (OATP): measure intracellular accumulation",
      "For efflux (BCRP): vesicular accumulation with ATP",
      "Fit IC50 or kinetic parameters (Km, Vmax)",
      "Assess clinical-DDI risk (static models: R-value)"
    ],
    providers: [pr("evotec", "Transporter panels"), pr("crl", "Transporter services"), pr("pharmaron", "Transporter assays")],
    marketNote: "FDA/EMA DDI guidance requires transporter panels for certain candidates — premium ADME tier.",
    capacityNote: "Specialist cell lines needed (OATP/BCRP) — fewer providers than CYP assays."
  },

  {
    id: "ugt-phenotype",
    name: "UGT Phenotyping / Glucuronidation",
    category: "adme",
    tagline: "Which UGT isoform clears your drug — and the DDI risk with UGT inhibitors.",
    tests: ["Recombinant UGT panel (1A1, 1A9, 2B7 etc.)", "Glucuronide formation kinetics (Km/Vmax)", "Allosteric activation detection"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "LC-MS/MS", vendor: "SCIEX", role: "Glucuronide quantification", note: "96-wel" }
    ],
    consumables: ["Recombinant UGT isoforms", "UDP-glucuronic acid (UDPGA)", "Probe substrates (SN-38 for 1A1)", "Alamethicin (activation)"],
    automation: "Standard plate incubation — automatable.",
    steps: [
      "Incubate compound with each recombinant UGT + UDPGA",
      "Quantify glucuronide formation (LC-MS/MS)",
      "Identify principal isoform(s) for clearance",
      "Kinetics: vary compound → Km, Vmax",
      "Scale to hepatic clearance (relative-activity-factor approach)"
    ],
    providers: [pr("evotec", "UGT phenotyping"), pr("crl", "UGT services"), pr("pharmaron", "UGT packages")],
    marketNote: "Important for antibody-drug payloads (SN-38 linkers) and phenolic drugs — niche but required.",
    capacityNote: "Specialist capability; fewer labs than CYP."
  },

  {
    id: "gsh-trapping",
    name: "Reactive-Metabolite Trapping (GSH)",
    category: "adme",
    tagline: "Glutathione adduct detection — the structural-toxicity early warning.",
    tests: ["GSH adduct formation (LC-MS/MS)", "Cyanide trapping for iminium ions", "Soft-spot identification for medchem"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "QTOF / Orbitrap LC-MS", vendor: "Waters / Thermo", role: "Adduct identification", note: "Accurate mass + MS/MS" }
    ],
    consumables: ["Glutathione (excess)", "KCNaCN trapping buffer", "Human liver microsomes + NADPH", "DDT (positive control)"],
    automation: "Semi-automated; adduct-structure interpretation is expert work.",
    steps: [
      "Incubate compound with HLM + NADPH + excess GSH",
      "Parallel cyanide-trapping incubation (iminium detection)",
      "LC-MS accurate-mass scan for adducts (M + 305 Da for GSH)",
      "MS/MS fragmentation to locate the reactive site",
      "Report structural alerts for chemistry redesign",
      "Quantify relative adduct burden vs comparators"
    ],
    providers: [pr("evotec", "Reactive-metabolite packages"), pr("crl", "GSH trapping services"), pr("pharmaron", "Adduct identification")],
    marketNote: "Structural-toxicology programs run this for thiazole/furan/aniline chemotypes — premium expert service.",
    capacityNote: "Interpretation skill scarce — few labs produce actionable soft-spot reports."
  },

  {
    id: "metid",
    name: "Metabolite Identification (MetID)",
    category: "adme",
    tagline: "Full metabolite mapping — structures, pathways and abundance.",
    tests: ["Metabolite structures (MS/MS + accurate mass)", "Biotransformation pathway map", "Metabolite abundance across species"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Orbitrap Exploris + FAIMS", vendor: "Thermo Fisher", role: "High-res metabolite detection", note: "Sub-ppm mass" },
      { name: "Radiochemical detection (off-line)", vendor: "Standard", role: "Definitive mass balance", note: "For regulatory MIST" }
    ],
    consumables: ["HLM/hepatocytes", "Reference metabolite standards (where available)", "Radiolabelled compound (for definitive studies)", "LC columns (varied chemistry)"],
    automation: "Data-analysis bottleneck (metabolite prediction software) more than lab work.",
    steps: [
      "Incubate compound in HLM/hepatocytes across species",
      "Full-scan HRMS + data-dependent MS/MS acquisition",
      "Predicted-metabolite list (biotransformation rules)",
      "Identify metabolites by mass shift + fragmentation",
      "Quantify relative abundance (UV + MS response)",
      "Map metabolic pathway (soft spots for chemistry)",
      "Regulatory MIST arm: compare human vs preclinical exposure"
    ],
    providers: [pr("evotec", "MetID services"), pr("crl", "MetID packages"), pr("pharmaron", "MetID at China cost")],
    marketNote: "MIST guidance (metabolites in safety testing) drives regulatory MetID for clinical candidates.",
    capacityNote: "Expert interpretation is the constraint — quality varies widely across providers."
  },

  {
    id: "pdx-bioanalysis",
    name: "In vivo PK / Bioanalysis (Rodent)",
    category: "bioanalysis",
    tagline: "Concentration-time data from dosed animals — PK parameters and formulation check.",
    tests: ["Plasma concentration-time curve", "CL, Vd, t½, AUC, F (bioavailability)", "Tissue distribution (optional arm)"],
    drugTypes: ["small-molecule", "peptide", "oligo"],
    instruments: [
      { name: "LC-MS/MS bioanalysis", vendor: "SCIEX", role: "Plasma quantification", note: "Matrix-matched" },
      { name: "Cannulated rodents + automated sampling", vendor: "Standard vivarium", role: "Serial sampling", note: "IACUC approved" }
    ],
    consumables: ["Test compound (formulated)", "Rodent plasma (K2-EDTA)", "Internal standards", "Catheters and surgical supplies"],
    automation: "Automated blood sampling (Culex) reduces animal count and enables rich curves.",
    steps: [
      "Dose rodents (IV + oral arms for F determination)",
      "Serial blood sampling at 8–12 timepoints",
      "Harvest plasma; stabilise if needed (labile compounds)",
      "LC-MS/MS quantification against calibration curve",
      "Non-compartmental analysis → CL, Vd, t½, AUC",
      "Calculate F = (AUC_po / AUC_iv) × dose correction",
      "Compare formulation performance"
    ],
    providers: [pr("pharmaron", "Rodent PK at China cost"), pr("evotec", "In vivo PK"), pr("aragen", "PK in India"), pr("selvita", "EU PK services")],
    marketNote: "China/India labs dominate rodent PK on cost — EU/US labs win on quality-critical programs.",
    capacityNote: "Vivarium space is the constraint — book 2–4 weeks ahead for standard studies."
  }
);
