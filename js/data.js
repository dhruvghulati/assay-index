// The Assay Index — data model
// Categories: binding | ionchannel | cell | safety | bioanalysis | qc | adme | genomics | immunology | developability | cgt | peptide
// Drug types: small-molecule | antibody | adc | peptide | oligo | cgt

var DRUG_TYPES = {
  "small-molecule": "Small molecule",
  antibody: "Antibody",
  adc: "ADC",
  peptide: "Peptide",
  oligo: "Oligonucleotide",
  cgt: "Cell & gene therapy"
};

var ASSAYS = [
  {
    id: "spr",
    name: "Surface Plasmon Resonance (SPR)",
    category: "binding",
    tagline: "Label-free, real-time kinetics of molecular interactions — the affinity gold standard.",
    tests: [
      "Binding affinity (KD)",
      "Association / dissociation rates (kon, koff)",
      "Epitope binning and competition",
      "Ligand density optimisation"
    ],
    drugTypes: ["antibody", "adc", "peptide", "oligo", "small-molecule"],
    instruments: [
      { name: "Biacore 8K+ / T200", vendor: "Cytiva", role: "Gold-standard bench SPR", note: "Up to ~3,800 interactions/day on 8K+" },
      { name: "Carterra Vega", vendor: "Carterra", role: "High-throughput SPR (HT-SPR)", note: ">20,000 binding interactions/day" },
      { name: "Biacore 1K+", vendor: "Cytiva", role: "Entry-level kinetic screening" }
    ],
    consumables: [
      "Series S CM5 sensor chips (carboxymethylated dextran)",
      "Amine coupling kit (EDC/NHS)",
      "HBS-EP+ running buffer",
      "Regeneration solutions (glycine pH 1.5–3.0, MgCl2)",
      "Electronic multichannel pipettes (INTEGRA VIAFLO) for dilution series"
    ],
    automation: "Dilution series and plate filling via 8/16-channel electronic pipettes or Tecan/Hamilton liquid handlers; Biacore Bridge software for queueing.",
    steps: [
      "Couple the ligand (target protein) to a CM5 sensor chip via amine chemistry; measure immobilisation response",
      "Condition the surface and choose a regeneration buffer that fully strips the analyte without losing ligand activity",
      "Prepare a 2-fold serial dilution of the analyte (typically 0.1 nM – 10 µM) in running buffer",
      "Prime the system, dock the chip, and set flow rate (typically 30 µL/min)",
      "Inject the analyte series across the surface — association and dissociation are recorded in real time as sensorgrams",
      "Regenerate the surface between cycles and blank-subtract using a reference flow cell",
      "Fit sensorgrams globally to a 1:1 Langmuir model; check residuals and Chi²",
      "Report kon, koff and KD with confidence intervals"
    ],
    providers: [
      { name: "Adaptyv Bio", note: "SPR via Carterra Vega; from $99/protein, 0.1 nM–10 µM KD range", region: "Global (Switzerland)" },
      { name: "Eurofins Discovery", note: "Full kinetic characterisation, GLP-capable", region: "Global" },
      { name: "Charles River Laboratories", note: "Biacore platforms integrated with developability packages", region: "Global" },
      { name: "Selvita", note: "Biacore T200/8K+ as part of discovery biology", region: "EU (Poland)" },
      { name: "Aragen Life Sciences", note: "Biacore 8K+ for large-molecule programs", region: "India / US" }
    ],
    marketNote: "Instrument lock-in is high: Biacore chips and software are proprietary, which sustains premium pricing and multi-week queues at CROs.",
    capacityNote: "Bench SPR is throughput-limited (tens of interactions/day); HT-SPR closes the gap but few CROs run it — a recognised supply gap."
  },

  {
    id: "bli",
    name: "Bio-Layer Interferometry (BLI)",
    category: "binding",
    tagline: "Fibre-optic kinetics — faster and cheaper than SPR for screening-level affinity.",
    tests: [
      "Binding affinity (KD)",
      "Association / dissociation kinetics",
      "High-throughput clone ranking",
      "Protein concentration (protein A / HIS sensors)"
    ],
    drugTypes: ["antibody", "adc", "peptide", "oligo"],
    instruments: [
      { name: "Octet RH96 / R8", vendor: "Sartorius", role: "High-throughput parallel BLI (16–96 channels)", note: "96-well and 384-well plate formats" },
      { name: "Gator Bio GatorPrime", vendor: "Gator Bio", role: "Emerging BLI competitor", note: "Claimed 5× throughput of Octet RH96" },
      { name: "PALL ForteBio Octet RED", vendor: "Sartorius (ex-ForteBio)", role: "Legacy workhorse", note: "Installed base in most CROs" }
    ],
    consumables: [
      "Anti-human IgG Fc capture (AHVc) biosensors",
      "Protein A / HIS / streptavidin biosensors",
      "384-well black microplates",
      "Single-use pipette tips for multichannel heads"
    ],
    automation: "Octet plate loading is robot-compatible (Hamilton/Tecan); dip-read format tolerates crude matrices, which reduces sample prep.",
    steps: [
      "Load the analyte onto the appropriate biosensor tip chemistry (Fc capture, HIS tag, streptavidin-biotin)",
      "Establish baseline in assay buffer",
      "Dip sensors into analyte dilution series — association measured in parallel",
      "Transfer sensors to buffer-only wells — dissociation measured in parallel",
      "Fit local or global 1:1 models to the response curves",
      "Rank clones or report KD; check for mass-transport limitation (vary ligand density)",
      "Regenerate-free: sensors are single-use, eliminating regeneration scouting"
    ],
    providers: [
      { name: "Adaptyv Bio", note: "BLI via Gator Bio; from $99/protein", region: "Global (Switzerland)" },
      { name: "Arctoris", note: "Fully automated BLI in robotised facility, 24/7", region: "UK / US / APAC" },
      { name: "Eurofins Discovery", note: "Octet platforms for screening and kinetics", region: "Global" },
      { name: "Syngene", note: "Octet RED96 for antibody programs", region: "India" }
    ],
    marketNote: "BLI sensors are consumables locked per vendor (Sartorius vs Gator Bio litigation signals how valuable that razor-blade revenue is). Throughput is 10–100× bench SPR at lower cost per data point.",
    capacityNote: "BLI is widely available but crude-matrix QC and tip-lot variability are known failure modes; ask CROs about tip-lot validation data."
  },

  {
    id: "itc",
    name: "Isothermal Titration Calorimetry (ITC)",
    category: "binding",
    tagline: "Direct thermodynamics of binding — no labels, no immobilisation, low throughput.",
    tests: [
      "Binding enthalpy (ΔH), entropy (ΔS), free energy (ΔG)",
      "Stoichiometry (n)",
      "KD (typically 10 nM – 100 µM)"
    ],
    drugTypes: ["small-molecule", "peptide", "antibody"],
    instruments: [
      { name: "MicroCal PEAQ-ITC", vendor: "Malvern Panalytical", role: "De-facto standard", note: "Gold standard for thermodynamic profiling" }
    ],
    consumables: [
      "ITC sample cell and syringe (cleaned between runs)",
      "Matched buffer for dialysis",
      "High-precision pipettes for cell loading"
    ],
    automation: "Semi-automated cell filling (MicroCal PEAQ-ITC Automated); still the slowest binding method per data point.",
    steps: [
      "Dialyse ligand and analyte into matched buffer (identical buffer avoids heat-of-dilution artefacts)",
      "Load the sample cell with ligand (typically 2 mL, ~10 µM)",
      "Load the syringe with analyte (typically 300 µL, ~100 µM)",
      "Run titration: inject analyte in 20–40 aliquots while stirring, recording heat per injection",
      "Subtract the heat of dilution from a control titration into buffer",
      "Fit the integrated heats to a binding model to extract n, KD, ΔH",
      "Derive ΔS and ΔG from the fitted parameters"
    ],
    providers: [
      { name: "Eurofins Discovery", note: "Thermodynamic characterisation service", region: "Global" },
      { name: "Charles River", note: "ITC for developability packages", region: "Global" },
      { name: "Selvita", note: "Malvern ITC in biophysics suite", region: "EU (Poland)" }
    ],
    marketNote: "ITC volumes are small and falling as SPR/BLI cover screening, but it remains the only direct ΔH/ΔS measurement — niche premium work.",
    capacityNote: "Sartorius withdrew its ITC line in 2023–24 (litigation with Gator Bio), consolidating demand onto Malvern — expect queues for PEAQ-ITC time."
  },

  {
    id: "mst",
    name: "MicroScale Thermophoresis (MST) & nanoDSF",
    category: "binding",
    tagline: "Capillary-based affinity and thermal stability — minimal sample, fast turnaround.",
    tests: [
      "Binding affinity (KD) from thermophoresis",
      "Protein melting temperature (Tm) via nanoDSF",
      "Formulation and stress-degradation stability"
    ],
    drugTypes: ["antibody", "peptide", "oligo", "small-molecule"],
    instruments: [
      { name: "Monolith X / NT.Automated", vendor: "NanoTemper", role: "MST affinity", note: "Capillary format, 16-position autoloader" },
      { name: "Prometheus Panta", vendor: "NanoTemper", role: "nanoDSF thermal stability", note: "Label-free Tm and aggregation" }
    ],
    consumables: [
      "Standard/premium MST capillaries (single-use)",
      "Label-free detection requires intrinsic fluorescence-grade samples",
      "Capillary loading tray"
    ],
    automation: "NT.Automated handles 16 capillaries per run; sample consumption is in the low-µL range — the key advantage for scarce proteins.",
    steps: [
      "Label or use intrinsic tryptophan fluorescence of the target",
      "Prepare a 16-point dilution series of ligand at constant target concentration",
      "Fill capillaries by capillary action (no pipetting error at low volumes)",
      "Load capillaries into the instrument tray",
      "Record thermophoretic mobility after IR-laser heating per capillary",
      "Plot bound fraction vs concentration; fit KD",
      "For nanoDSF: ramp temperature, monitor intrinsic fluorescence ratio for Tm and aggregation onset"
    ],
    providers: [
      { name: "2bind / NanoTemper-affiliated service labs", note: "MST-specialist service providers", region: "EU (Germany)" },
      { name: "Eurofins Discovery", note: "MST as part of biophysics packages", region: "Global" },
      { name: "Arctoris", note: "Automated MST in robotics facility", region: "UK / US / APAC" }
    ],
    marketNote: "MST wins where sample is scarce (rare disease targets, hard-to-express proteins) — a direct fit with the rare-disease pipeline expansion.",
    capacityNote: "Capillary lots cause variability; specialist labs run lot-QC. Availability in India/China CROs is thinner than in EU/US."
  },

  {
    id: "herg",
    name: "hERG / Automated Patch Clamp",
    category: "ionchannel",
    tagline: "Cardiac ion-channel liability — the classic small-molecule killer, now automated.",
    tests: [
      "hERG channel inhibition (IC50)",
      "Cardiac action potential assays (CiPA panel)",
      "Other ion channels (Nav, Cav, Kv)"
    ],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "QPatch 16 / 48", vendor: "Sophion (BioAgilytix)", role: "Automated patch clamp", note: "48 parallel cells, GPCR/unstable cells supported" },
      { name: "SyncroPatch 384", vendor: "Nanion", role: "Highest-throughput APC", note: "384-well format, hERG IC50 in <1 hr" },
      { name: "Patchliner", vendor: "Nanion", role: "Mid-throughput APC", note: "8-16 channels" }
    ],
    consumables: [
      "Single-use APC recording chips with micro-fabricated apertures",
      "HEK-hERG cell culture (low-passage control)",
      "Intracellular and extracellular solutions batches"
    ],
    automation: "Fully automated chip-based patch clamping replaced manual two-electrode voltage clamp for screening; manual patch remains the confirmation gold standard.",
    steps: [
      "Culture HEK293 cells stably expressing hERG; passage-control <30",
      "Prepare cells in suspension with gentle dissociation (cell health drives seal success)",
      "Load cell suspension onto the APC chip; chip seals each cell by suction",
      "Whole-cell configuration achieved automatically; verify seal resistance and capacitance",
      "Apply voltage protocol (hERG step-pulse); perfuse test compound at 5–8 concentrations",
      "Record tail currents; fit concentration-response for IC50",
      "Confirm hits with manual patch clamp or CiPA follow-up if IC50 near efficacy concentration"
    ],
    providers: [
      { name: "Nanion Technologies", note: "SyncroPatch service and instrument provider", region: "Germany / Global" },
      { name: "Metrion", note: "Specialist ion-channel CRO (hERG + CiPA panel)", region: "UK" },
      { name: "Charles River", note: "GLP hERG for regulatory submission", region: "Global" },
      { name: "Eurofins Discovery", note: "Automated and manual electrophysiology", region: "Global" },
      { name: "Evotec / Cyprotex", note: "hERG integrated with ADME packages", region: "UK / Global" }
    ],
    marketNote: "hERG assays are mandatory for small-molecule INDs (ICH S7B), so demand tracks small-molecule pipeline volume — steady, non-cyclical.",
    capacityNote: "Specialist ion-channel capacity (Metrion, Nanion service) is the constraint; big-CRO APC queues run 2–4 weeks. Cardiac liability testing for peptides (e.g. excitable-cell action potential assays) is an emerging gap."
  },

  {
    id: "elisa",
    name: "ELISA / Ligand-Binding Assay",
    category: "bioanalysis",
    tagline: "The workhorse of immunogenicity, PK and potency — plate-based and cheap.",
    tests: [
      "Anti-drug antibodies (immunogenicity)",
      "Drug concentration (PK bridging LBA)",
      "Potency via surrogate ligand displacement",
      "Cytokine release (risk assessment)"
    ],
    drugTypes: ["antibody", "adc", "peptide", "cgt"],
    instruments: [
      { name: "SpectraMax / PHERAstar microplate readers", vendor: "Molecular Devices / BMG Labtech", role: "Absorbance + fluorescence endpoint", note: "96/384-well" },
      { name: "ELx405 / HydroSpeed plate washers", vendor: "BioTek (Agilent) / Tecan", role: "Wash steps", note: "Automated washing critical to CV" },
      { name: "Hamilton Microlab STAR", vendor: "Hamilton", role: "Automated LBA assembly", note: "GLP bioanalytical labs standard" }
    ],
    consumables: [
      "High-binding 96-well ELISA plates",
      "Biotinylated reagent + streptavidin-HRP",
      "TMB substrate, stop solution",
      "Calibration standards and QC samples in matrix"
    ],
    automation: "GLP labs automate LBA assembly with Hamilton/Tecan; CVs <20% at LLOQ are the acceptance gate.",
    steps: [
      "Coat plate with capture reagent (drug or target) overnight",
      "Block non-specific binding (BSA/casein)",
      "Add standards, QCs and unknowns — incubate for binding",
      "Wash 3–5× (automated washer, consistent aspiration)",
      "Add detection reagent (biotinylated anti-idiotypic)",
      "Add streptavidin-HRP, wash, add TMB substrate",
      "Stop reaction and read OD450/570; fit 4-PL curve",
      "Report sample concentrations and immunogenicity titres"
    ],
    providers: [
      { name: "Charles River", note: "GLP PK/immunogenicity LBA for biologics", region: "Global" },
      { name: "Eurofins Bioanalytical Services", note: "LBA method dev + validation", region: "Global" },
      { name: "WuXi AppTec", note: "LBA at scale for biologics programs", region: "China / US" },
      { name: "Lonza", note: "Potency LBA for CGT/biologics release", region: "Global" }
    ],
    marketNote: "Commoditised at the screening end; premium sits in GLP method validation for regulatory immunogenicity, where precision (CV control) is the differentiator.",
    capacityNote: "Wide availability, but GLP method-validation slots at large CROs book out 6–10 weeks ahead — a known bottleneck for IND timelines."
  },

  {
    id: "qpcr-knockdown",
    name: "qPCR / NGS Knockdown (Oligo Potency)",
    category: "genomics",
    tagline: "Dose-response functional potency for ASO/siRNA — the make-and-test loop for oligo therapeutics.",
    tests: [
      "Target mRNA knockdown (dose-response IC50)",
      "Transcriptome-wide off-target profile (RNA-seq)",
      "Durability of knockdown (time-course)"
    ],
    drugTypes: ["oligo", "peptide"],
    instruments: [
      { name: "QuantStudio 5 / 7", vendor: "Thermo Fisher", role: "qPCR endpoint", note: "384-well TaqMan" },
      { name: "NovaSeq / NextSeq", vendor: "Illumina", role: "RNA-seq off-target analysis", note: "Transcriptome-wide" },
      { name: "Opentrons OT-2 / robot arms", vendor: "Opentrons", role: "Automated dose-response plating", note: "Bangalore-style automated foundry labs" }
    ],
    consumables: [
      "TaqMan probes / SYBR master mix",
      "96/384-well qPCR plates + optical film",
      "Lipid transfection reagents (LNP for primary cells)",
      "RNA extraction kits (automatable magnetic-bead format)"
    ],
    automation: "This assay is the core of the new 'data engine' foundries (OFELMË, Creyon-style labs): make oligos → transfect at 6–10 concentrations → qPCR readout → FAIR dataset for ML. Highly automatable.",
    steps: [
      "Design and synthesise ASO/siRNA panel with chemical modification matrix",
      "Reverse-transfect cells in 384-well format with 6–10 point dilution series",
      "Incubate 24–72 h (time-course for durability)",
      "Lyse cells directly in plate; reverse-transcribe RNA",
      "qPCR for target gene + housekeeping normalisation",
      "Fit dose-response curve → knockdown IC50 and maximal effect",
      "For off-target: RNA-seq at sub-IC50 concentrations, differential-expression analysis",
      "Return structured dataset (provenance, DoE metadata) for ML training"
    ],
    providers: [
      { name: "OFELMË (PsiDagger)", note: "Purpose-built oligo/peptide make+test data engine, Bangalore", region: "India" },
      { name: "Eurofins Genomics", note: "Oligo synthesis + assay packages", region: "Global" },
      { name: "Selvita", note: "Cell-based functional assays incl. qPCR", region: "EU (Poland)" },
      { name: "Charles River", note: "GLP-grade oligo bioanalysis", region: "Global" }
    ],
    marketNote: "The oligo therapeutics market is growing ~19–23%/yr and the oligo CDMO segment ~22–24%/yr — functional potency assays are the make-and-test bottleneck for AI labs buying datasets.",
    capacityNote: "High-throughput dose-response + transcriptomics as a service is nearly unique to the new foundry labs; traditional CROs sell it per-study, not per-dataset. This is the whitespace."
  },

  {
    id: "cytotox",
    name: "Cell Viability / Cytotoxicity",
    category: "cell",
    tagline: "Does the compound kill cells — the first efficacy/toxicity gate for every modality.",
    tests: [
      "Viability IC50 (CellTiter-Glo, resazurin)",
      "Cytotoxicity reporter assays (luciferase caspase)",
      "High-content imaging (phenotypic cytotoxicity)",
      "Selectivity index (target vs non-target cell)"
    ],
    drugTypes: ["small-molecule", "antibody", "adc", "peptide", "oligo", "cgt"],
    instruments: [
      { name: "EnVision / PHERAstar multimode readers", vendor: "Revvity / BMG", role: "Luminescence + fluorescence viability", note: "384-well" },
      { name: "Operetta CLS / ImageXpress", vendor: "Revvity / Molecular Devices", role: "High-content imaging cytotoxicity", note: "Phenotypic readouts" },
      { name: "Opentrons / Hamilton + robotic arms", vendor: "Opentrons / Hamilton", role: "Automated foundry-style plating", note: "24/7 unattended runs" }
    ],
    consumables: [
      "CellTiter-Glo reagent (single-addition luminescence)",
      "384-well clear-bottom plates",
      "Cells: primary, iPSC-derived, or immortalised lines",
      "Multichannel electronic pipette tips"
    ],
    automation: "Most automatable of all assays — this is what Arctoris, Emerald Cloud Lab, Strateos and the Bangalore foundry labs have industrialised. High-content imaging adds phenotypic depth at 10× cost.",
    steps: [
      "Seed cells in 384-well plates at optimised density (24 h recovery)",
      "Prepare compound dilution series (8–10 point) via acoustic or pin transfer",
      "Compound addition (reverse transfection for oligos)",
      "Incubate 48–72 h",
      "Add viability reagent (single-step glow reagent)",
      "Read luminescence/fluorescence on multimode reader",
      "Normalise to controls (0% and 100% viability), fit curves → IC50",
      "High-content arm: fix and image cells, extract morphology features"
    ],
    providers: [
      { name: "Arctoris", note: "Fully automated cell assays, 24/7, UK/US/APAC", region: "Global" },
      { name: "Emerald Cloud Lab", note: "Remote-executed automated cell assays", region: "US" },
      { name: "Strateos", note: "Cloud lab cell-assay protocols", region: "US" },
      { name: "OFELMË", note: "High-throughput imaging + cytotox datasets for ML", region: "India" },
      { name: "Charles River", note: "GLP cytotox for regulatory packages", region: "Global" }
    ],
    marketNote: "Cell-based assays market ~$18–20B (2025) growing ~8–9%/yr; the service slice is commoditised but AI-lab dataset demand (labelled, FAIR, provenance-rich) is the new premium.",
    capacityNote: "Generic cytotox is oversupplied. Differentiators: primary-cell and iPSC-derived-cell availability, high-content imaging throughput, and dataset structure (FAIR + DoE metadata)."
  },

  {
    id: "flow",
    name: "Flow Cytometry Immunoprofiling",
    category: "immunology",
    tagline: "Immune-cell phenotyping and receptor occupancy — critical for immunology, IO and cell therapy.",
    tests: [
      "Immune-cell subset phenotyping",
      "Receptor occupancy (RO) assays",
      "Cytokine release risk (human blood)",
      "CAR-T / T-cell transduction quality"
    ],
    drugTypes: ["antibody", "adc", "cgt"],
    instruments: [
      { name: "CytoFLEX / Navios", vendor: "Beckman Coulter", role: "Clinical-grade flow", note: "Up to 13 colours" },
      { name: "Fortessa X-20", vendor: "BD Biosciences", role: "Research standard", note: "18-colour panels" },
      { name: "Attune NxT", vendor: "Thermo Fisher", role: "Acoustic focusing, high throughput", note: "96-well sampling" }
    ],
    consumables: [
      "Fluorochrome-conjugated antibody panels",
      "Compensation beads",
      "FACS tubes / 96-well plates",
      "Human donor blood (fresh, within 24 h for cytokine assays)"
    ],
    automation: "Plate-based loaders enable 96-well flow; human-blood immune-tox assays are the least automatable (donor logistics, 24 h window).",
    steps: [
      "Obtain fresh human donor blood (cytokine-release assays must run <24 h post-draw)",
      "Design multicolour panel with fluorochrome spillover matrix",
      "Stain whole blood or PBMCs with panel + test compound",
      "Incubate with drug at therapeutic and supra-therapeutic concentrations",
      "Lyse red cells (if whole blood), wash, fix",
      "Acquire events on cytometer (QC beads daily)",
      "Gate populations (FMO controls), quantify subsets and receptor occupancy",
      "Report immune-tox profile: cytokines, activation markers"
    ],
    providers: [
      { name: "Metrion", note: "Human-blood immune-tox specialist", region: "UK" },
      { name: "Charles River", note: "Flow-based immunogenicity and RO", region: "Global" },
      { name: "Lonza", note: "Flow for CGT release testing", region: "Global" },
      { name: "OFELMË", note: "Flow cytometry immunoprofiling datasets", region: "India" }
    ],
    marketNote: "Flow-based services grow with immunology pipelines; human-blood cytokine-release assays are scarce because fresh-donor logistics limit scale.",
    capacityNote: "Human-blood immune-tox is a named capacity gap — few labs can run it reproducibly at throughput. Demand driver for IO and checkpoint programs."
  },

  {
    id: "lcms",
    name: "LC-MS/MS Bioanalysis (PK)",
    category: "bioanalysis",
    tagline: "Quantify drug and metabolites in plasma — the engine of PK/PD studies.",
    tests: [
      "Plasma drug concentration (ng/mL–pg/mL)",
      "Metabolite identification",
      "PK parameters (CL, t½, AUC) from concentration-time curves",
      "Anti-drug antibody interference checks"
    ],
    drugTypes: ["small-molecule", "peptide", "adc", "oligo"],
    instruments: [
      { name: "Triple Quad 6500+ / TQ Absolute", vendor: "SCIEX", role: "Quantitation gold standard", note: "MRM sensitivity pg/mL" },
      { name: "Orbitrap Exploris / QE", vendor: "Thermo Fisher", role: "High-resolution metabolite ID", note: "Full-scan + MS/MS" },
      { name: "Xevo TQ-S / Qtof", vendor: "Waters", role: "Combined quant/qual platforms", note: "IonKey microflow for peptides" }
    ],
    consumables: [
      "UPLC columns (C18, sub-2 µm)",
      "SPE / protein-precipitation sample-prep plates",
      "Stable-isotope-labelled internal standards",
      "Matrix-matched calibration standards"
    ],
    automation: "Sample prep automated via Hamilton/Tecan (SPE, PPT); GLP labs run 96-well batches with double-curve QC per FDA/EMA bioanalytical guidance.",
    steps: [
      "Develop MRM transitions for analyte + internal standard (LC-MS/MS)",
      "Validate method per FDA/EMA guidance: selectivity, linearity, LLOQ, matrix effects",
      "Prepare calibration curve and QCs in authentic matrix",
      "Extract study samples (protein precipitation, SPE or LLE) in 96-well format",
      "Inject on UPLC-MS/MS; monitor MRM transitions",
      "Integrate peaks; back-calculate concentrations against calibration curve",
      "Accept batch only if QCs pass (±15%, ±20% at LLOQ)",
      "Fit PK model to concentration-time data → CL, t½, AUC"
    ],
    providers: [
      { name: "Charles River", note: "GLP bioanalysis, large-molecule LC-MS", region: "Global" },
      { name: "Eurofins Bioanalysis", note: "Small and large molecule PK", region: "Global" },
      { name: "WuXi AppTec", note: "High-volume LC-MS/MS bioanalysis", region: "China / US" },
      { name: "Pharmaron", note: "Bioanalysis + DMPK packages", region: "China / US" },
      { name: "Lonza", note: "Peptide/oligo bioanalysis", region: "Global" }
    ],
    marketNote: "Bioanalytical services ~$3.35B (2024) growing ~9%/yr; LC-MS/MS is the largest slice. Oligo bioanalysis (hybridisation-ELISA vs LC-MS) is an active differentiator.",
    capacityNote: "Capacity is broadly available; the premium is large-molecule and oligo LC-MS, where specialised assays (ionKey microflow, hybrid LBA-LC-MS) are scarce."
  },

  {
    id: "synthesis-qc",
    name: "Synthesis QC (LC-MS, qNMR, Chiral HPLC/SFC)",
    category: "qc",
    tagline: "Is the molecule you made actually the molecule you wanted — identity, purity, stereochemistry.",
    tests: [
      "Identity confirmation (HRMS, NMR)",
      "Purity (UPLC-UV, ELSD/CLND, LC-MS)",
      "Quantitative purity (qNMR)",
      "Chiral purity (chiral HPLC/SFC)",
      "Residual solvents and water (GC, Karl Fischer)"
    ],
    drugTypes: ["small-molecule", "peptide", "oligo"],
    instruments: [
      { name: "UPLC-UV + QDa/SQD", vendor: "Waters", role: "Routine purity + mass confirmation", note: "2-min runs in high-throughput labs" },
      { name: "600 MHz NMR (qNMR)", vendor: "Bruker / JEOL", role: "Quantitative purity without response-factor bias", note: "Ph. Eur. compliant" },
      { name: "Chiral HPLC / SFC", vendor: "Waters / Agilent", role: "Enantiomeric excess", note: "SFC is faster for discovery-scale" },
      { name: "Karl Fischer titrators + GC-HS", vendor: "Metrohm / Agilent", role: "Water + residual solvents", note: "Release-critical" }
    ],
    consumables: [
      "UPLC columns (BEH C18 etc.)",
      "Deuterated NMR solvents (DMSO-d6, CDCl3)",
      "Chiral stationary-phase columns (Chiralpak AD-H etc.)",
      "NMR tubes (single-use in HT labs)",
      "KF reagent (pyridine-free)"
    ],
    automation: "The AI-synthesis generation (Satomic, Chemify, Warp Sciences) industrialised this: 96-well UPLC-MS with 2-min cycles, plate-based NMR, and LC-MS/MS impurity trees — QC becomes the data product.",
    steps: [
      "Dissolve sample in LC-MS-compatible solvent at standard concentration",
      "UPLC-UV/MS run: retention time, UV purity, mass confirmation vs theoretical",
      "If purity <95% or mass ambiguous: HRMS (Orbitrap) exact mass",
      "qNMR: weigh internal standard (maleic acid/dimethyl sulfone), integrate diagnostic protons → absolute purity",
      "Chiral check: chiral HPLC or SFC → enantiomeric excess if stereocentres present",
      "GC headspace for residual solvents; Karl Fischer for water content",
      "Impurity profiling: LC-MS/MS fragmentation of side peaks, MSn structure assignment",
      "Issue certificate of analysis: identity, purity (qNMR + LC-UV), ee, residuals"
    ],
    providers: [
      { name: "Satomic", note: "AI-native synthesis QC, Boston", region: "US" },
      { name: "Chemify", note: "Digital chemistry synthesis + QC", region: "UK (Glasgow)" },
      { name: "Warp Sciences", note: "US chemistry CRO, launched Oct 2026", region: "US" },
      { name: "Enamine", note: "Ultra-large library synthesis + QC at scale", region: "Ukraine / EU" },
      { name: "OFELMË", note: "Oligo/peptide synthesis + purification + QC with GMP/GLP access", region: "India" }
    ],
    marketNote: "The 'QC-as-data' thesis: as AI labs generate millions of molecules, the binding/purity metadata per molecule is the training asset. Providers who structure QC output as FAIR datasets (not PDFs of CoAs) capture the premium.",
    capacityNote: "Standard QC is commodity; the gap is QC throughput matched to AI synthesis speed — 96-well parallel UPLC-MS, plate NMR, and impurity trees at foundry scale."
  },

  {
    id: "adme",
    name: "In vitro ADME",
    category: "adme",
    tagline: "Metabolic stability and drug-drug-interaction screening — the small-molecule triage stack.",
    tests: [
      "Microsomal / hepatocyte stability (t½, intrinsic clearance)",
      "CYP inhibition (major isoforms)",
      "Plasma protein binding (equilibrium dialysis)",
      "Permeability (MDCK, PAMPA) and efflux (P-gp)"
    ],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Automation-ready incubation systems (Hamilton/Tecan)", vendor: "Hamilton / Tecan", role: "Incubation setup", note: "384-well" },
      { name: "RapidFire 400", vendor: "Agilent", role: "High-throughput MS for incubations", note: "Seconds per sample, SPA-style" },
      { name: "Equilibrium dialysis devices (RED)", vendor: "Thermo Fisher", role: "Protein binding", note: "96-well RED plates" }
    ],
    consumables: [
      "Human liver microsomes / cryopreserved hepatocytes (donor lots)",
      "NADPH regeneration system",
      "RED dialysis plates",
      "CYP substrates and inhibitors (probe set)"
    ],
    automation: "Highly automatable — Cyprotex industrialised this 15 years ago; RapidFire MS enables hundreds of incubation samples/hr. The bottleneck is now hepatocyte lot quality.",
    steps: [
      "Prepare microsomal incubation (0.5 mg/mL microsomes + NADPH) with test compound at 1 µM",
      "Time-point quenching at 0/15/30/45/60 min with organic solvent",
      "LC-MS/MS quantitation of parent remaining per time point",
      "Fit first-order decay → t½ and intrinsic clearance",
      "CYP inhibition: incubate probe substrate + compound, read metabolite formation",
      "Protein binding: equilibrium dialysis vs buffer, LC-MS/MS both sides → fraction unbound",
      "Permeability: MDCK-MDR1 cell layers, A→B and B→A, efflux ratio",
      "Triage: compounds with high clearance, CYP risk or high efflux drop out"
    ],
    providers: [
      { name: "Evotec / Cyprotex", note: "Industrial-scale ADME pioneer", region: "UK / Global" },
      { name: "Charles River", note: "ADME-DMPK integrated packages", region: "Global" },
      { name: "Pharmaron", note: "ADME + bioanalysis bundles", region: "China / US" },
      { name: "Selvita", note: "ADME in EU time zone", region: "EU (Poland)" },
      { name: "Aragen", note: "ADME in India cost advantage", region: "India / US" }
    ],
    marketNote: "ADME services grow steadily with small-molecule pipelines (~30 of 46 2025 FDA approvals were small molecules); RapidFire-MS keeps throughput competitive.",
    capacityNote: "Well supplied globally — competition is on price and turnaround (EU/India labs win on both). Differentiator for peptides/oligos: dedicated stability assays are still scarce."
  }
];

// Provider registry (shared shorthand)
var P = {
  adaptyv: { name: "Adaptyv Bio", region: "Global (CH)" },
  arctoris: { name: "Arctoris", region: "UK/US/APAC" },
  ecl: { name: "Emerald Cloud Lab", region: "US" },
  strateos: { name: "Strateos", region: "US" },
  eurofins: { name: "Eurofins Discovery", region: "Global" },
  crl: { name: "Charles River", region: "Global" },
  wuxi: { name: "WuXi AppTec", region: "China/US" },
  pharmaron: { name: "Pharmaron", region: "China/US" },
  selvita: { name: "Selvita", region: "EU (PL)" },
  syngene: { name: "Syngene", region: "India" },
  aragen: { name: "Aragen", region: "India/US" },
  evotec: { name: "Evotec / Cyprotex", region: "UK/Global" },
  metrion: { name: "Metrion", region: "UK" },
  nanion: { name: "Nanion", region: "DE/Global" },
  lonza: { name: "Lonza", region: "Global" },
  catalent: { name: "Catalent", region: "Global" },
  enamine: { name: "Enamine", region: "UA/EU" },
  chemify: { name: "Chemify", region: "UK (Glasgow)" },
  satomic: { name: "Satomic", region: "US (Boston)" },
  warp: { name: "Warp Sciences", region: "US" },
  ofelme: { name: "OFELMË (PsiDagger)", region: "India" },
  chempartner: { name: "ChemPartner", region: "China/US" },
  bienta: { name: "Bienta", region: "EU" },
  rbi: { name: "Reaction Biology", region: "US/DE" },
  bioagilytix: { name: "BioAgilytix", region: "Global" },
  twobind: { name: "2bind", region: "DE" },
  cyto: { name: "CytoDyn? no—placeholder", region: "" }
};
delete P.cyto;
