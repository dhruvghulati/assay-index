// Expansion 4 — Bioanalysis, synthesis QC, analytical chemistry
ASSAYS.push(
  {
    id: "hybridization-elisa",
    name: "Hybridization ELISA (Oligo Quantification)",
    category: "bioanalysis",
    tagline: "Ligand-based oligo quantification in plasma — the oligo-PK standard.",
    tests: ["ASO/siRNA concentration in plasma (ng/mL)", "Metabolite (n-1) detection", "Bioanalytical method validation per FDA"],
    drugTypes: ["oligo"],
    instruments: [
      { name: "SpectraMax / PHERAstar", vendor: "MD / BMG", role: "ELISA endpoint", note: "96/384-well" },
      { name: "Automated plate handling", vendor: "Hamilton", role: "Assay assembly", note: "GLP labs standard" }
    ],
    consumables: ["Capture probe (complementary, biotinylated)", "Detection probe (dual-hybridisation)", "Streptavidin-HRP", "Magnetic-bead or plate formats"],
    automation: "Fully automatable plate assay — the oligo equivalent of ELISA.",
    steps: [
      "Denature sample oligo (heat + snap-cool)",
      "Hybridise to capture probe on plate/beads",
      "Hybridise detection probe (sandwich)",
      "Wash stringently (only full-length oligo detected)",
      "Add streptavidin-HRP + TMB substrate",
      "Read OD450; fit standard curve",
      "Validate per FDA bioanalytical guidance (LLOQ, matrix effects)"
    ],
    providers: [pr("crl", "Oligo bioanalysis"), pr("pharmaron", "Oligo PK services"), pr("wuxi", "Hybridization ELISA at China scale"), pr("lonza", "Oligo bioanalysis")],
    marketNote: "The oligo-therapeutics boom (~20% CAGR) drives demand; LC-MS competes but hybridisation ELISA remains the sensitivity leader.",
    capacityNote: "Probe design per sequence (2–3 week lead) is the entry cost — few labs have validated oligo LBA."
  },

  {
    id: "oligo-lcms",
    name: "Oligo LC-MS/MS Quantification",
    category: "bioanalysis",
    tagline: "Mass-spec oligo PK — metabolite resolution that hybridisation ELISA misses.",
    tests: ["Parent oligo + chain-shortened metabolites", "Tissue distribution (liver, kidney)", "Sensitive quantification with chromatographic separation"],
    drugTypes: ["oligo"],
    instruments: [
      { name: "QTRAP 6500+ with ion-pairing LC", vendor: "SCIEX", role: "Oligo quantification", note: "TEA/HFIP mobile phases" },
      { name: "High-res LC-MS", vendor: "Thermo Orbitrap", role: "Metabolite confirmation", note: "Full characterization" }
    ],
    consumables: ["Ion-pairing reagents (TEA + HFIP)", "Specialised oligo LC columns", "Stable-isotope or surrogate IS", "Synthetic metabolite standards"],
    automation: "Standard bioanalysis automation; ion-pairing LC is slower per injection.",
    steps: [
      "Extract oligo from plasma (solid-phase extraction)",
      "Ion-pairing LC separation (TEA/HFIP mobile phase)",
      "MRM detection of parent + metabolites",
      "Matrix-matched calibration (synthetic standards)",
      "Fit concentration-time curves for each species",
      "Report parent + n-1, n-2 metabolite kinetics"
    ],
    providers: [pr("crl", "Oligo LC-MS"), pr("pharmaron", "Oligo bioanalysis"), pr("wuxi", "Oligo LC-MS/MS at scale")],
    marketNote: "LC-MS oligo bioanalysis is the differentiator vs hybridisation ELISA — metabolite resolution for regulatory MIST.",
    capacityNote: "Ion-pairing chromatography expertise is scarce — a handful of labs do it well."
  },

  {
    id: "ada",
    name: "Anti-Drug Antibody (ADA) Assay",
    category: "bioanalysis",
    tagline: "Immunogenicity detection — multi-tier for biologics regulatory packages.",
    tests: ["ADA screening assay (positive/negative cut point)", "Confirmation (specificity) tier", "Titre and neutralisation (NAb) handoff"],
    drugTypes: ["antibody", "adc", "peptide", "cgt"],
    instruments: [
      { name: "Meso QuickPlex / PHERAstar", vendor: "MSD / BMG", role: "ECL or ELISA readout", note: "GLP-capable" },
      { name: "Gyrolab xP", vendor: "Gyros Protein Technologies", role: "Microfluidic immunoassay", note: "Low volume, automation" }
    ],
    consumables: ["Drug-coated plates (bridging format)", "Biotinylated + sulfo-tagged drug", "Positive control ADA (rabbit/mouse)", "Acid-dissociation buffers"],
    automation: "Multi-tier workflow automates on Hamilton + Gyrolab platforms.",
    steps: [
      "Develop bridging ADA assay (drug as capture + detection)",
      "Determine screening cut point (5% false positive, 50–100 matrix lots)",
      "Screen samples (above cut point = potential positive)",
      "Confirm by competitive inhibition with excess drug",
      "Titre serial dilution to quantify response",
      "Characterise isotype (IgE vs IgG) if clinically relevant",
      "NAb tier (cell-based) for neutralising potential"
    ],
    providers: [pr("crl", "GLP ADA for biologics"), pr("wuxi", "ADA at China scale"), pr("bioagilytix", "Immunogenicity specialist"), pr("lonza", "ADA for CGT")],
    marketNote: "Mandatory for biologics IND/NDA — the immunogenicity market grows with the ~70% biologic pipeline.",
    capacityNote: "Multi-tier development is long (8–12 weeks per assay) — the bottleneck is assay development, not capacity."
  },

  {
    id: "nab",
    name: "Neutralising Antibody (NAb) Assay",
    category: "bioanalysis",
    tagline: "Do the ADAs actually block the drug — the functional immunogenicity test.",
    tests: ["NAb detection (cell-based or competitive ligand)", "NAb titre", "Assay sensitivity verification (positive control)"],
    drugTypes: ["antibody", "adc", "peptide", "cgt"],
    instruments: [
      { name: "Cell-based NAb platforms", vendor: "Standard tissue culture", role: "Functional neutralisation", note: "Reporter or proliferation readout" },
      { name: "Gyrolab / MSD", vendor: "Gyros / MSD", role: "Non-cell NAb alternative", note: "Competitive format" }
    ],
    consumables: ["Reporter cells responsive to drug", "Positive-control NAb (affinity-purified)", "Drug + target reagents", "Assay medium (low-fusion)"],
    automation: "Cell-based NAbs are semi-automated (live-cell handling); Gyrolab automates fully.",
    steps: [
      "Select cell-based (functional) or competitive-ligand format",
      "Establish drug-response curve (EC80 for competitive format)",
      "Incubate samples with drug at fixed concentration",
      "Apply to cells; read reporter/proliferation response",
      "Neutralisation = reduced response vs drug alone",
      "Confirm with positive-control NAb (sensitivity)",
      "Report NAb+ samples with titre"
    ],
    providers: [pr("crl", "GLP NAb assays"), pr("bioagilytix", "NAb specialist"), pr("wuxi", "NAb services")],
    marketNote: "Cell-based NAbs for CGT and cytokine drugs are the hardest format — premium pricing.",
    capacityNote: "Live-cell assay development is the rate limiter; 12–16 week timelines typical."
  },

  {
    id: "luminex",
    name: "Cytokine Multiplex (Luminex / MSD)",
    category: "bioanalysis",
    tagline: "Dozens of cytokines from one small sample — immune-response profiling.",
    tests: ["Multi-cytokine panels (10–80 analytes)", "Th1/Th2/Th17 polarisation", "Cytokine-release syndrome monitoring"],
    drugTypes: ["antibody", "adc", "cgt", "peptide"],
    instruments: [
      { name: "Luminex 200 / FLEXMAP 3D", vendor: "Luminex (Thermo/Diasorin)", role: "Bead-based multiplex", note: "80-plex capability" },
      { name: "MSD V-PLEX", vendor: "Meso Scale Discovery", role: "ECL multiplex", note: "10-plex, high sensitivity" }
    ],
    consumables: ["Cytokine antibody bead sets (custom or pre-configured)", "ECL multi-spot plates (MSD)", "Calibrator standards", "Human serum/plasma samples"],
    automation: "Bead-based and ECL assays automate on liquid handlers.",
    steps: [
      "Select panel (pre-configured or custom bead set)",
      "Incubate sample with antibody-coated beads/plates",
      "Wash; add detection antibody cocktail",
      "Read (Luminex: dual-laser bead ID + reporter; MSD: ECL)",
      "Fit standard curves per analyte",
      "Report concentrations + QC (spike recovery in matrix)"
    ],
    providers: [pr("bioagilytix", "Cytokine multiplex services"), pr("crl", "Cytokine release panels"), pr("eurofins", "Biomarker multiplex")],
    marketNote: "Cytokine-release assays (CRS risk) for IO are the growth driver — multiplex replaces single ELISAs.",
    capacityNote: "Matrix interference in serum is a known quality gap — ask for spike-recovery QC data."
  },

  {
    id: "simoa",
    name: "Simoa Ultrasensitive Protein Detection",
    category: "bioanalysis",
    tagline: "femtogram detection — 1000× ELISA sensitivity in a digital format.",
    tests: ["Ultra-low biomarkers (IL-6, p-tau, NfL)", "PK at late clearance phases", "Minimal-residual-disease markers"],
    drugTypes: ["antibody", "adc", "peptide", "cgt"],
    instruments: [
      { name: "HD-X / SR-X", vendor: "Quanterix", role: "Digital ELISA", note: "Single-molecule arrays" }
    ],
    consumables: ["Simoa assay kits (or custom bead development)", "8-well strips", "Calibrators + controls"],
    automation: "Instrument-automated; custom-assay development is the lead time.",
    steps: [
      "Select kit or develop custom Simoa assay (2–3 months custom)",
      "Load samples + capture beads",
      "Digital readout: single-molecule counting (AEB)",
      "Convert to concentration via digital standard curve",
      "Report fg/mL-level concentrations with QC"
    ],
    providers: [pr("bioagilytix", "Simoa services"), { name: "Quanterix service labs", note: "Custom Simoa development", region: "US/Global" }, pr("crl", "Simoa biomarker packages")],
    marketNote: "Neurodegeneration biomarkers (NfL, p-tau217) drive Simoa growth — no other method reaches fg/mL.",
    capacityNote: "Instrument cost limits providers; custom development lead times are 2–3 months."
  },

  {
    id: "potency-cell",
    name: "Cell-Based Potency Assay (Biologics)",
    category: "bioanalysis",
    tagline: "The release-relevant biological activity — MOA-reflecting potency.",
    tests: ["Relative potency (ED50 shift) vs reference standard", "Batch-to-batch comparability", "Mechanism-reflecting bioactivity"],
    drugTypes: ["antibody", "adc", "peptide", "cgt"],
    instruments: [
      { name: "Reporter-gene potency cells", vendor: "Eurofins DiscoverX / custom", role: "MOA-reflecting assay", note: "GMP-release grade" },
      { name: "PHERAstar / EnVision", vendor: "BMG / Revvity", role: "Readout", note: "384-well" }
    ],
    consumables: ["Potency assay cells (GMP-qualified)", "Reference standard (qualified lot)", "Serum-free assay medium"],
    automation: "Automated for GMP release (plate handling + analysis pipelines).",
    steps: [
      "Develop MOA-reflecting assay (reporter, proliferation, or signal transduction)",
      "Qualify reference standard and assign potency units",
      "Run sample + reference in parallel dilution curves",
      "Fit 4-PL curves; calculate relative potency (parallelism test)",
      "Acceptance: fit statistics (parallelism, R²) per pharmacopoeia",
      "Report ED50 ratio vs reference"
    ],
    providers: [pr("lonza", "GMP potency release assays"), pr("catalent", "Potency for biologics release"), pr("eurofins", "Potency assay development"), pr("wuxi", "Potency at China scale")],
    marketNote: "GMP release testing is the highest-margin assay service — MOA-reflecting potency is mandatory for biologics batches.",
    capacityNote: "GMP slots are the tightest in the industry — 4–8 week queues at big CDMOs for release assays."
  },

  {
    id: "biosimilar-compare",
    name: "Biosimilarity / Comparability Package",
    category: "bioanalysis",
    tagline: "Head-to-head analytical comparison — the biosimilar value proposition.",
    tests: ["Structural comparability (peptide map, glycan, charge)", "Functional comparability (potency, Fc function)", "Forced-degradation comparability"],
    drugTypes: ["antibody", "adc"],
    instruments: [
      { name: "Orbitrap LC-MS (peptide mapping)", vendor: "Thermo Fisher", role: "Primary structure", note: "100% sequence coverage" },
      { name: "HILIC-UPLC (glycans)", vendor: "Waters", role: "Glycan comparability", note: "Labeled glycans" },
      { name: "CEX / icIEF", vendor: "Agilent / ProteinSimple", role: "Charge variants", note: "Regulatory expectation" }
    ],
    consumables: ["Reference product (multi-lot)", "Trypsin + deglycosylation enzymes", "2-AB glycan labelling kit", "icIEF cartridges"],
    automation: "Analytical automation standard; data analysis is the expert component.",
    steps: [
      "Acquire 3–6 lots of reference product (multi-lot analysis)",
      "Peptide mapping: digest + LC-MS/MS → sequence + PTM coverage",
      "Glycan profiling (released glycans, HILIC)",
      "Charge variants (CEX, icIEF) comparison",
      "Potency + Fc function (ADCC/CDC) comparability",
      "Forced degradation (thermal, oxidative, photolytic) side-by-side",
      "Statistical comparability assessment (equivalence testing)"
    ],
    providers: [pr("lonza", "Comparability packages"), pr("catalent", "Biosimilar analytical services"), pr("eurofins", "Comparability studies"), pr("wuxi", "Biosimilar analytics at scale")],
    marketNote: "Biosimilar pipeline (post-patent biologics wave) sustains multi-million analytical packages per program.",
    capacityNote: "Full packages are 3–6 months of lab time — CDMO analytical slots are the constraint."
  },

  {
    id: "hrms-id",
    name: "HRMS Identity Confirmation",
    category: "qc",
    tagline: "Exact-mass proof of molecular identity — the QC gate for every new molecule.",
    tests: ["Accurate mass (within 3 ppm of theoretical)", "Isotope-pattern match", "MS/MS fragmentation confirmation"],
    drugTypes: ["small-molecule", "peptide", "oligo"],
    instruments: [
      { name: "Orbitrap Exploris 120", vendor: "Thermo Fisher", role: "Entry HRMS", note: "Sub-ppm mass accuracy" },
      { name: "Waters Xevo G2-XS QTof", vendor: "Waters", role: "QTof HRMS", note: "MSE fragmentation" }
    ],
    consumables: ["LC columns (C18)", "Calibration solution (lock mass)", "Purity-certified reference standard"],
    automation: "Standard in automated QC lines (UPLC-HRMS) at AI-synthesis foundries.",
    steps: [
      "Inject sample; acquire full-scan HRMS",
      "Compare measured vs theoretical exact mass (≤3 ppm)",
      "Verify isotope pattern (M+1, M+2 ratios)",
      "Acquire MS/MS fragmentation; match to predicted fragments",
      "Confirm retention time vs standard (where available)",
      "Issue identity statement for CoA"
    ],
    providers: [pr("satomic", "AI-native HRMS QC"), pr("chemify", "Synthesis + HRMS QC"), pr("warp", "US chemistry CRO QC"), pr("enamine", "HRMS at library scale")],
    marketNote: "Every molecule from every AI foundry passes HRMS — QC throughput is the foundry bottleneck.",
    capacityNote: "HRMS instrument time is the constraint at million-molecule scale; queueing is the target of automation."
  },

  {
    id: "uplc-purity",
    name: "UPLC-UV Purity (LC-MS)",
    category: "qc",
    tagline: "Chromatographic purity — the 2-minute QC cycle at foundry scale.",
    tests: ["UV purity % (254/214 nm)", "Mass confirmation (single quad in-line)", "Retention-time consistency"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "ACQUITY UPLC + QDa", vendor: "Waters", role: "Purity + mass in one run", note: "2-min cycles at scale" },
      { name: "Agilent 1290 Infinity II", vendor: "Agilent", role: "High-throughput QC", note: "Stacked injections" }
    ],
    consumables: ["BEH C18 columns (2.1 mm)", "Volatile mobile phases (MeCN + FA)", "96-well autosampler plates"],
    automation: "The industrialised QC backbone: plate-stacker UPLC-MS running 24/7 at AI foundries.",
    steps: [
      "Inject 0.5–2 µL sample (plate-format)",
      "2–3 min gradient (C18, volatile buffer)",
      "UV diode-array (214/254 nm) purity integration",
      "In-line mass confirmation (QDa/SQD)",
      "Flag purity <90% or unexpected mass",
      "Queue results to foundry database (FAIR structure)"
    ],
    providers: [pr("satomic", "Foundry-scale UPLC-MS QC"), pr("chemify", "Automated QC pipeline"), pr("warp", "US QC at synthesis speed"), pr("enamine", "Purity at library scale")],
    marketNote: "Commodity per-run but strategically critical — QC cycle time defines AI-foundry throughput.",
    capacityNote: "Column lifetime and MS duty cycle are the physical limits; queueing algorithms are the frontier."
  },

  {
    id: "qnmr",
    name: "Quantitative NMR (qNMR)",
    category: "qc",
    tagline: "Response-factor-free purity — absolute purity by proton counting.",
    tests: ["Absolute purity (weight %) without reference compound", "Residual-solvent quantification", "Peptide/oligo content assay"],
    drugTypes: ["small-molecule", "peptide", "oligo"],
    instruments: [
      { name: "400–600 MHz NMR", vendor: "Bruker / JEOL", role: "Quantitative proton assay", note: "Internal standard calibrated" }
    ],
    consumables: ["Deuterated solvent (DMSO-d6)", "Certified internal standard (maleic acid, dimethyl sulfone)", "Precision NMR tubes (match-grade)"],
    automation: "Flow-NMR or plate-fed autosamplers industrialise qNMR at foundries.",
    steps: [
      "Weigh sample + certified internal standard precisely",
      "Dissolve in deuterated solvent",
      "Acquire quantitative ¹H spectrum (long relaxation delay ≥5×T1)",
      "Integrate diagnostic signals (sample + standard)",
      "Calculate purity = (I_sample/N_sample)/(I_std/N_std) × (MW ratio)",
      "Report absolute purity (typically ±1%)"
    ],
    providers: [pr("satomic", "qNMR in QC stack"), pr("chemify", "qNMR alongside synthesis"), pr("enamine", "qNMR for library compounds")],
    marketNote: "qNMR beats HPLC-UV for response-factor bias (UV-invisible impurities) — pharmacopoeia-recognised.",
    capacityNote: "NMR instrument time is scarce and expensive; flow-NMR automation is the foundry answer."
  },

  {
    id: "chiral-hplc",
    name: "Chiral HPLC",
    category: "qc",
    tagline: "Enantiomeric-excess determination by chiral stationary phase.",
    tests: ["Enantiomeric excess (ee %)", "Diastereomer ratio", "Chiral-switch QC (single-enantiomer approval)"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Chiralpak/Chiralcel columns + HPLC", vendor: "Daicel (Chiral Technologies)", role: "The chiral standard", note: "Polysaccharide phases" },
      { name: "Agilent 1260 HPLC + UV/MS", vendor: "Agilent", role: "Standard HPLC platform", note: "40+ chiral column screen" }
    ],
    consumables: ["Chiral columns (AD-H, OD-H etc.)", "Hexane/IPA mobile phases", "Chiral reference standards"],
    automation: "Column-screening automates; method development per compound is expert work.",
    steps: [
      "Screen chiral column library (AD-H, OD-H, IA etc.)",
      "Optimise mobile phase for baseline separation",
      "Inject sample + racemic reference",
      "Integrate both enantiomer peaks",
      "Calculate ee % = (A_major − A_minor)/(A_total)",
      "Confirm with opposite-configuration column (orthogonal)"
    ],
    providers: [pr("satomic", "Chiral QC in synthesis packages"), pr("chemify", "Chiral analysis"), pr("enamine", "Chiral purity at scale"), pr("pharmaron", "Chiral HPLC services")],
    marketNote: "Chiral switches (escitalopram model) and stereochemically-rich AI outputs drive steady demand.",
    capacityNote: "Method development (1–2 weeks per scaffold) is the bottleneck — screens don't always hit separation."
  },

  {
    id: "chiral-sfc",
    name: "Chiral SFC (Supercritical Fluid Chromatography)",
    category: "qc",
    tagline: "The fast chiral method — CO₂ mobile phase, 3× HPLC speed.",
    tests: ["Enantiomeric excess (ee %)", "Preparative chiral isolation", "Stereochemical stability (epimerisation)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Waters Prep-100 SFC/QDa", vendor: "Waters", role: "Analytical + prep SFC", note: "CO₂ + modifier" },
      { name: "Agilent 1260 Infinity II SFC", vendor: "Agilent", role: "Analytical chiral SFC", note: "Column screening" }
    ],
    consumables: ["Chiral SFC columns", "Liquid CO₂ supply + co-solvent (MeOH/EtOH)", "Back-pressure regulator parts"],
    automation: "SFC screening automates on column selectors; prep SFC scales to grams.",
    steps: [
      "Screen chiral SFC column set (3–5 phases)",
      "Optimise CO₂ + modifier composition",
      "Analytical run: integrate enantiomer peaks",
      "Calculate ee %",
      "Prep arm: scale to isolated enantiomers (mg–g)",
      "Re-analyse isolated fractions for final ee"
    ],
    providers: [pr("satomic", "SFC in QC stack"), pr("chemify", "SFC chiral services"), pr("enamine", "SFC at library scale")],
    marketNote: "SFC displaced chiral HPLC for discovery-scale work — speed advantage compounds across libraries.",
    capacityNote: "CO₂ handling infrastructure limits providers — standard at modern foundries only."
  },

  {
    id: "gc-residual",
    name: "GC-FID / GC-MS Residual Solvents",
    category: "qc",
    tagline: "Head-space solvent detection — ICH Q3C compliance for release.",
    tests: ["Residual-solvent panel (Class 1–3 solvents)", "DMSO + DMF carryover quantification", "ICH Q3C limit compliance"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "HS-20 headspace + GC-FID", vendor: "Shimadzu", role: "Residual-solvent standard", note: "USP <467>" },
      { name: "Agilent 7890B GC-MS", vendor: "Agilent", role: "Solvent ID + quantification", note: "Headspace injection" }
    ],
    consumables: ["Headspace vials + crimp caps", "Class-matched solvent standards", "Static-HS buffer (if needed)"],
    automation: "Headspace autosamplers automate fully — 40 vials per run unattended.",
    steps: [
      "Weigh sample into headspace vial; add diluent",
      "Equilibrate at 80–100°C (30 min headspace)",
      "Inject headspace gas onto GC column",
      "Separate solvents (DB-624 column)",
      "Quantify vs external standards (FID) or MS confirmation",
      "Compare to ICH Q3C limits (Class 1: benzene 2 ppm etc.)",
      "Report compliance for release"
    ],
    providers: [pr("satomic", "Residual-solvent QC"), pr("pharmaron", "GC services"), pr("evotec", "Residual-solvent packages"), pr("chempartner", "GC at China cost")],
    marketNote: "Mandatory release test — demand tracks synthesis volume (rising with AI foundries).",
    capacityNote: "Standard capacity; headspace equilibration time is the throughput limit."
  },

  {
    id: "kf",
    name: "Karl Fischer Water Determination",
    category: "qc",
    tagline: "Coulometric/titrimetric water — hygroscopicity and stability QC.",
    tests: ["Water content (ppm to %)", "Hygroscopicity classification", "Deliquescence threshold"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "C30 Coulometric KF", vendor: "Mettler-Toledo", role: "Trace water (ppm)", note: "For anhydrous QC" },
      { name: "V30 Volumetric KF", vendor: "Mettler-Toledo", role: "% water", note: "For lyophilisates" }
    ],
    consumables: ["KF reagent (pyridine-free)", "Methanol solvent", "Water standards for calibration"],
    automation: "Automated sample changers exist; small volumes per test.",
    steps: [
      "Calibrate KF cell with water standard",
      "Introduce sample (direct or oven-evaporation for insolubles)",
      "Titrate to endpoint (bivoltametric detection)",
      "Calculate water content (coulometric: µg count)",
      "Report ppm or % water vs specification",
      "Oven method for samples that react with reagent"
    ],
    providers: [pr("satomic", "KF in QC"), pr("pharmaron", "KF services"), pr("evotec", "Water determination")],
    marketNote: "Commodity but mandatory — water drives degradation kinetics for peptides especially.",
    capacityNote: "No constraint — every QC lab has KF."
  },

  {
    id: "elsd-clnd",
    name: "ELSD / CLND Universal Detection",
    category: "qc",
    tagline: "UV-independent detection — purity for chromophore-free molecules.",
    tests: ["Universal purity (no UV response needed)", "Peptide/oligo quantification without standards", "Balanced LC-MS workflows"],
    drugTypes: ["small-molecule", "peptide", "oligo"],
    instruments: [
      { name: "ELSD (Sedex / Alltech)", vendor: "Sedere", role: "Evaporative light scattering", note: "Universal response" },
      { name: "CLND (Corona / CAD)", vendor: "Thermo (ESA)", role: "Charged-aerosol detection", note: "Better linearity than ELSD" }
    ],
    consumables: ["Nitrogen supply (evaporation)", "Volatile mobile phases only", "CAD standards"],
    automation: "Standard LC automation; complements UV for non-chromophoric impurities.",
    steps: [
      "Run LC with volatile mobile phase (no salts)",
      "Nebulise + evaporate column effluent",
      "Detect particles (light scattering) or charge (CAD)",
      "Quantify without compound-specific response factors",
      "Pair with MS channel for identity",
      "Report mass-balance purity (UV-blind impurities included)"
    ],
    providers: [pr("satomic", "Universal-detection QC"), pr("chemify", "ELSD/CAD workflows"), pr("enamine", "Universal detection at scale")],
    marketNote: "Critical for peptide/oligo QC where UV response varies per sequence — CAD is the modern standard.",
    capacityNote: "Commodity; nitrogen supply is the infrastructure cost."
  },

  {
    id: "ic-counterion",
    name: "Ion Chromatography (Counterions)",
    category: "qc",
    tagline: "Salt-form counterion quantification — the forgotten QC dimension.",
    tests: ["Counterion content (Cl⁻, tosylate, mesylate)", "Stoichiometry verification", "Elemental-anion purity"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "ICS-6000 IC", vendor: "Thermo Fisher / Dionex", role: "Anion + cation IC", note: "Suppressed conductivity" }
    ],
    consumables: ["IC columns (anion/cation exchange)", "Suppressor cartridges", "Eluent (KOH gradient for anions)"],
    automation: "Automated injection standard; suppressor maintenance is the skilled part.",
    steps: [
      "Dissolve salt-form sample in water/acetonitrile",
      "Inject onto anion (or cation) exchange column",
      "KOH-gradient elution; suppressed conductivity detection",
      "Quantify counterion vs external standard",
      "Verify stoichiometry (counterion:API molar ratio)",
      "Flag salt-form inconsistency"
    ],
    providers: [pr("pharmaron", "IC services"), pr("evotec", "Counterion QC"), pr("chempartner", "IC at China cost")],
    marketNote: "Salt-form screening (API developability) drives demand — often skipped by AI foundries at their QC risk.",
    capacityNote: "Standard capacity; often the afterthought in QC stacks."
  },

  {
    id: "icpms",
    name: "ICP-MS Elemental Impurities",
    category: "qc",
    tagline: "Heavy-metal impurity panel — ICH Q3D compliance for release.",
    tests: ["Elemental impurity panel (Class 1–3 elements)", "PDE-limit compliance (ICH Q3D)", "Catalyst residue (Pd, Pt) quantification"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "NexION 5000 ICP-MS", vendor: "PerkinElmer", role: "Trace elemental analysis", note: "Single-particle capability" },
      { name: "Agilent 7900 ICP-MS", vendor: "Agilent", role: "Elemental impurities", note: "Pharma standard" }
    ],
    consumables: ["Trace-metal-grade acids (HNO₃)", "Multi-element calibration standards", "Argon supply", "Clean-lab consumables"],
    automation: "Autosamplers standard; clean-lab discipline is the quality gate.",
    steps: [
      "Digest sample in trace-metal-grade acid (microwave)",
      "Dilute to ICP-compatible matrix",
      "Run elemental panel (As, Cd, Hg, Pb, Pd, Pt etc.)",
      "Quantify vs multi-element standards",
      "Convert to µg/day exposure (per ICH Q3D PDE)",
      "Report compliance for release",
      "Flag catalyst residues >30% PDE"
    ],
    providers: [pr("pharmaron", "ICP-MS services"), pr("evotec", "Elemental packages"), pr("catalent", "ICP-MS for release"), pr("wuxi", "ICP-MS at scale")],
    marketNote: "Catalyst residues (Pd/Suzuki coupling) make ICP-MS essential for modern small molecules — AI-synthesis catalysts too.",
    capacityNote: "Clean-lab infrastructure limits providers; standard at GMP CDMOs."
  },

  {
    id: "aaa-peptide",
    name: "Amino-Acid Analysis (Peptide Content)",
    category: "peptide",
    tagline: "Hydrolysis + HPLC — absolute peptide content for release.",
    tests: ["Peptide content (weight %)", "Amino-acid composition verification", "Counterbalance to UV/HPLC purity"],
    drugTypes: ["peptide"],
    instruments: [
      { name: "AccQ-Tag HPLC system", vendor: "Waters", role: "Derivatised-AA quantification", note: "6-aminoquinoline derivatisation" }
    ],
    consumables: ["6 N HCl (vapour-phase hydrolysis)", "AccQ-Tag derivatisation kit", "Amino-acid standards", "Norleucine internal standard"],
    automation: "Automated derivatisation + LC — commodity release assay.",
    steps: [
      "Hydrolyse peptide (6 N HCl, 110°C, 24 h vapour phase)",
      "Derivatise free amino acids (AccQ-Tag)",
      "Reverse-phase HPLC separation of derivatives",
      "Quantify each amino acid vs standards",
      "Verify composition matches theoretical sequence",
      "Calculate absolute peptide content (sum of AAs minus water)"
    ],
    providers: [pr("catalent", "Peptide release testing"), pr("lonza", "Peptide analytics"), pr("pharmaron", "AAA services"), pr("ofelme", "Peptide QC with content assay")],
    marketNote: "GLP-1 peptide wave drives peptide-release capacity — content assay is part of every CoA.",
    capacityNote: "Peptide-release slots at big CDMOs are tight — the GLP-1 boom consumed capacity."
  },

  {
    id: "peptide-impurities",
    name: "Peptide Impurity Profiling (LC-MS/MS)",
    category: "peptide",
    tagline: "Side-product trees — deletion, addition and epimerisation impurities.",
    tests: ["Related substances (deletion sequences, oxidised variants)", "Epimerisation detection (D-amino acids)", "Truncation tree mapping"],
    drugTypes: ["peptide"],
    instruments: [
      { name: "UPLC + Orbitrap (peptide mapping)", vendor: "Waters + Thermo", role: "Impurity ID", note: "Sub-ppm fragments" },
      { name: "QTRAP LC-MS/MS", vendor: "SCIEX", role: "Targeted impurity quantification", note: "MRM per impurity" }
    ],
    consumables: ["Synthetic impurity standards (where available)", "Trypsin + enzymes for mapping", "Chiral AA analysis reagents (for epimers)"],
    automation: "Foundry-style impurity trees automate; interpretation is expert.",
    steps: [
      "Run full LC-MS/MS of crude + purified peptide",
      "Detect side peaks; accurate-mass assignment",
      "Map impurities to likely species (deletion, oxidation, epimer)",
      "Synthesise or isolate reference impurities for confirmation",
      "Quantify each impurity (MRM or UV response factor)",
      "Report impurity tree with structural assignments"
    ],
    providers: [pr("catalent", "Peptide impurity packages"), pr("ofelme", "Peptide impurity datasets"), pr("lonza", "Peptide analytics"), pr("wuxi", "Peptide QC at scale")],
    marketNote: "The QC-as-data thesis in action: impurity trees are the training data for predictive synthesis models.",
    capacityNote: "Expert annotation is scarce — few labs do full structural assignment vs just % purity."
  },

  {
    id: "endotoxin",
    name: "Bacterial Endotoxin (LAL)",
    category: "qc",
    tagline: "Pyrogen testing — every parenteral batch passes through LAL.",
    tests: ["Endotoxin units (EU/mL)", "Kinetic + gel-clot formats", "USP <85> compliance"],
    drugTypes: ["antibody", "peptide", "oligo", "cgt"],
    instruments: [
      { name: "Endosafe Nexgen-MCS", vendor: "Charles River", role: "Recombinant + LAL testing", note: "Piggyback cartridges" }
    ],
    consumables: ["LAL reagent (from horseshoe crab)", "Control standard endotoxin (CSE)", "Depyrogenated glassware", "Recombinant Factor C alternative"],
    automation: "Cartridge-based systems automate fully — 15-min results.",
    steps: [
      "Prepare sample in pyrogen-free diluent (pH 6–8)",
      "Add LAL reagent + sample in depyrogenated tubes",
      "Incubate 37°C for gel-clot (or kinetic turbidimetric)",
      "Read gel formation (or kinetic curve)",
      "Calculate EU/mL vs CSE standard curve",
      "Compare to product-specific endotoxin limit (K/M formula)"
    ],
    providers: [pr("crl", "LAL testing (originator Endosafe)"), pr("lonza", "Endotoxin release assays"), pr("catalent", "Endotoxin QC"), pr("wuxi", "LAL at scale")],
    marketNote: "Parenteral-growth (biologics, CGT) sustains LAL demand; recombinant Factor C is the animal-free future.",
    capacityNote: "Abundant; horseshoe-crab reagent supply is the sustainability question."
  },

  {
    id: "bioburden",
    name: "Bioburden Testing",
    category: "qc",
    tagline: "Microbial-load enumeration — the pre-sterility release gate.",
    tests: ["Total aerobic microbial count (TAMC)", "Total yeast/mould count (TYMC)", "Objectionable-organism screen"],
    drugTypes: ["antibody", "peptide", "cgt"],
    instruments: [
      { name: "Milliflex Quantum + TSB agar plates", vendor: "Merck", role: "Rapid bioburden", note: "Flow cytometric detection" }
    ],
    consumables: ["Membrane filters (0.45 µm)", "Soybean-casein digest agar (TAMC)", "Sabouraud dextrose agar (TYMC)"],
    automation: "Rapid methods (Milliflex) cut time-to-result vs 14-day compendial.",
    steps: [
      "Filter sample through sterile membrane",
      "Transfer membrane to growth medium",
      "Incubate (3–5 days rapid, 14 days compendial)",
      "Count colony-forming units (CFU)",
      "Identify objectionable organisms (16S or MALDI-TOF)",
      "Compare to acceptance criteria (e.g. <10 CFU for sterile precursors)"
    ],
    providers: [pr("lonza", "Bioburden release testing"), pr("catalent", "Microbiology QC"), pr("crl", "Rapid bioburden")],
    marketNote: "Steady parenteral-release demand; rapid methods are the growth (time-to-result matters).",
    capacityNote: "Abundant; incubation time is the physics limit."
  }
);
