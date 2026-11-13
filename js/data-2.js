// Expansion 1 — Binding & biophysics assays
var pr = (k, note) => Object.assign({}, P[k], { note });

ASSAYS.push(
  {
    id: "fp",
    name: "Fluorescence Polarization (FP)",
    category: "binding",
    tagline: "Homogeneous affinity in solution — the kinase-inhibitor screening classic.",
    tests: ["Binding KD in solution", "Competitive displacement IC50", "Hit triage for fragment libraries"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "PHERAstar FSX", vendor: "BMG Labtech", role: "FP endpoint reader", note: "384/1536-well" },
      { name: "EnVision", vendor: "Revvity", role: "Parallel FP screening", note: "TR-FRET + FP modes" }
    ],
    consumables: ["Fluorescently labelled tracer ligand", "384-well black plates", "Competition test compounds in DMSO"],
    automation: "Single-step add-and-read: ideal for acoustic dispensing (Echo) and full automation.",
    steps: [
      "Titrate fluorescent tracer against target to establish assay window",
      "Determine tracer KD by FP anisotropy",
      "Dispense tracer + target into 384-well plates",
      "Add test compounds acoustically (DMSO back-calculated)",
      "Incubate to equilibrium (30–120 min)",
      "Read parallel/perpendicular polarisation",
      "Convert anisotropy to bound fraction; fit competition curves"
    ],
    providers: [pr("eurofins", "FP panels for epigenetic and kinase targets"), pr("rbi", "Kinase biochemical panel with FP readouts"), pr("crl", "FP in lead-optimisation suites")],
    marketNote: "FP is commodity biochemistry: cents per data point at scale, sold mostly as part of HTS campaigns.",
    capacityNote: "Universally available; differentiation is tracer quality and assay window, not capacity."
  },

  {
    id: "trfret",
    name: "TR-FRET / HTRF",
    category: "binding",
    tagline: "Time-resolved FRET — ratiometric immunoassay for biomolecular interactions.",
    tests: ["Protein-protein interaction IC50", "Kinase activity (ADP detection)", "Epigenetic reader/write assays"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "PHERAstar FSX", vendor: "BMG Labtech", role: "HTRF-certified reader", note: "Eu/Tb + d2 dye channels" },
      { name: "SpectraMax iD5", vendor: "Molecular Devices", role: "TR-FRET endpoint", note: "96–384 well" }
    ],
    consumables: ["Europium/Terbium donor antibodies", "d2/acceptor-conjugated reagents", "384-well low-volume plates"],
    automation: "Add-and-read homogeneous format — fully compatible with liquid-handler automation and 1536 miniaturisation.",
    steps: [
      "Select donor/acceptor antibody pair for the biomolecule pair",
      "Optimise donor and acceptor concentrations for FRET signal",
      "Combine donor reagent, acceptor reagent, target and compound in plate",
      "Incubate 1–4 h at room temperature",
      "Read FRET channel ratio (665/620 nm)",
      "Normalise to controls and fit dose-response"
    ],
    providers: [pr("eurofins", "HTRF-based kinase and epigenetic services"), pr("chempartner", "TR-FRET biochemical panels"), pr("crl", "HTRF in biomarker assays")],
    marketNote: "TR-FRET dominates biochemical screening for kinases and epigenetics — Revvity (Cisbio) reagents are the de-facto standard.",
    capacityNote: "Widely available; reagent licensing (Cisbio patents) is the cost constraint."
  },

  {
    id: "bret",
    name: "BRET / NanoBRET",
    category: "binding",
    tagline: "Bioluminescence resonance energy transfer — proximity in living cells.",
    tests: ["Target engagement in cells", "Protein-protein interaction in cellulo", "Kinase inhibitor occupancy"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "PHERAstar / ClarioStar", vendor: "BMG Labtech", role: "BRET dual-channel", note: "Filter-based luminescence" },
      { name: "SpectraMax L", vendor: "Molecular Devices", role: "BRET endpoint", note: "96/384-well" }
    ],
    consumables: ["NanoLuciferase-tagged target", "Fluorescent ligand/tracer", "Substrate (furimazine derivatives)"],
    automation: "Add-and-read; live-cell format requires careful incubation timing.",
    steps: [
      "Generate NanoLuc-fused target cell line or transfect transiently",
      "Add fluorescent tracer ligand and titrate for window",
      "Add test compounds across concentration range",
      "Add luciferase substrate immediately before read",
      "Read donor/acceptor channels ratiometrically",
      "Fit competitive displacement curves → cellular KD/occupancy"
    ],
    providers: [pr("eurofins", "NanoBRET target-engagement services"), pr("chempartner", "BRET-based cell assays")],
    marketNote: "NanoBRET (Promega) is the leading cellular target-engagement format — strong demand from covalent-kinase and PROTAC programs.",
    capacityNote: "Specialist capability; requires NanoLuc construct generation — 2–4 week assay-development lead times."
  },

  {
    id: "alphalisa",
    name: "AlphaLISA / AlphaPlex",
    category: "binding",
    tagline: "Bead-based proximity immunoassay — low-picomolar sensitivity, no wash.",
    tests: ["Cytokine/biomarker quantification", "Protein-protein interaction", "Enzymatic activity (protease, helicase)"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "EnVision 2105", vendor: "Revvity", role: "Alpha screen reader", note: "615/520 nm channels" },
      { name: "PHERAstar FSX", vendor: "BMG Labtech", role: "AlphaScreen mode", note: "384-well" }
    ],
    consumables: ["Donor and acceptor Alpha beads", "Biotinylated/streptavidin reagents", "384-well white plates"],
    automation: "Homogeneous, no-wash — highly automatable and miniaturisable.",
    steps: [
      "Pair donor and acceptor beads with capture antibodies",
      "Combine beads, analyte and sample in plate",
      "Incubate 1–24 h for equilibrium",
      "Excite at 680 nm; read emission at 615 nm",
      "Fit standard curve; report analyte concentration"
    ],
    providers: [pr("eurofins", "AlphaLISA biomarker services"), pr("bioagilytix", "AlphaLISA for large-molecule PK"), pr("crl", "Alpha-based immunoassays")],
    marketNote: "AlphaLISA competes with ELISA at 100× lower LOD; strong position in cytokine PK and immunogenicity.",
    capacityNote: "Available widely; bead-lot bridging between studies is the main QC concern."
  },

  {
    id: "radioligand",
    name: "Radioligand Binding Assay",
    category: "binding",
    tagline: "The classical receptor-affinity method — [3H]/[125I] tracers, filter capture.",
    tests: ["Receptor KD and Bmax", "Competitive binding Ki", "Receptor density in tissue"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Filtermate harvester + TopCount", vendor: "Revvity", role: "Filtraction and radiometric count", note: "96-well" },
      { name: "UniFilter-96 GF/B plates", vendor: "Revvity", role: "Capture filters", note: "Glass-fibre" }
    ],
    consumables: ["[3H]/[125I]-labelled ligand", "Unlabelled competitor stocks", "Scintillation cocktail", "Cell/tissue membranes expressing target"],
    automation: "Harvester automation exists but most labs run semi-manually; radioactivity licensing limits throughput.",
    steps: [
      "Prepare membranes or cells expressing the receptor",
      "Titrate radioligand for saturation binding (6–8 concentrations)",
      "Run competition binding: fixed radioligand + unlabelled competitor series",
      "Incubate to equilibrium at assay temperature",
      "Rapid vacuum filtration onto GF/B filters; wash 3× cold buffer",
      "Count retained radioactivity (cpm)",
      "Fit one-site or two-site models → Ki, Bmax"
    ],
    providers: [pr("eurofins", "Radioligand binding for GPCR/CNS targets"), pr("crl", "Classical binding assays in discovery"), pr("syngene", "Radioligand binding services")],
    marketNote: "Declining but irreplaceable for CNS/GPCR targets where fluorescent tracers distort affinity — niche premium.",
    capacityNote: "Fewer labs maintain radiochemistry each year — scarcity growing for [3H] custom tracers (6–12 month lead times)."
  },

  {
    id: "dsf",
    name: "Differential Scanning Fluorimetry (DSF)",
    category: "binding",
    tagline: "Thermal-shift screening — does your ligand stabilise the protein?",
    tests: ["Protein melting temperature (Tm)", "Ligand-stabilisation ΔTm", "Buffer/formulation screen"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "QuantStudio 12K Flex", vendor: "Thermo Fisher", role: "qPCR-based DSF", note: "384-well SYPRO orange" },
      { name: "UNit", vendor: "Unchained Labs", role: "High-throughput DSF", note: "UV + dye channels" }
    ],
    consumables: ["SYPRO Orange dye", "384-well qPCR plates", "Protein at 0.1–0.5 mg/mL"],
    automation: "Runs on standard qPCR machines — very low barrier, common in discovery labs.",
    steps: [
      "Mix protein with SYPRO Orange in 384-well plate",
      "Add test ligand at 0.5–1 mM (final DMSO <2%)",
      "Ramp temperature 20–95°C, 1°C/min, monitoring fluorescence",
      "Derive first derivative; identify Tm",
      "Compare ΔTm vs DMSO control",
      "Hits = ΔTm > +2°C (stabilisation)"
    ],
    providers: [pr("eurofins", "DSF screening in biophysics packages"), pr("selvita", "Thermal-shift services"), pr("twobind", "DSF + nanoDSF")],
    marketNote: "Cheapest binding proxy per data point; used for fragment screening and buffer optimisation everywhere.",
    capacityNote: "No constraint — any lab with a qPCR machine can run it; interpretive caution needed (dye artifacts)."
  },

  {
    id: "secmals",
    name: "SEC-MALS",
    category: "developability",
    tagline: "Size-exclusion chromatography with multi-angle light scattering — absolute molar mass and aggregation.",
    tests: ["Absolute molecular weight", "Aggregation state (monomer/oligomer)", "Complex stoichiometry"],
    drugTypes: ["antibody", "adc", "peptide", "cgt"],
    instruments: [
      { name: "DAWN MALS + Optilab RI", vendor: "Wyatt Technology", role: "SEC-MALS core", note: "Coupled to HPLC SEC" },
      { name: "µDAWN", vendor: "Wyatt", role: "Micro-volume MALS", note: "For scarce samples" }
    ],
    consumables: ["SEC columns (Superdex, WTC range)", "MALS-grade filtered buffers", "0.1 µm filters"],
    automation: "Standard HPLC automation applies; run time ~30 min per sample limits throughput.",
    steps: [
      "Equilibrate SEC column in MALS-compatible buffer (filtered, degassed)",
      "Inject sample (typically 50–100 µg)",
      "Record UV, RI and MALS signals across the elution",
      "Fit MALS angular dependence per slice → molar mass",
      "Quantify monomer, oligomer and fragment percentages",
      "Report mass homogeneity for the batch"
    ],
    providers: [pr("lonza", "SEC-MALS for biologics release"), pr("catalent", "Analytical aggregation package"), pr("eurofins", "SEC-MALS characterisation")],
    marketNote: "Standard release test for biologics; demand tracks the ~70% of clinical pipeline that is biologic.",
    capacityNote: "Well supplied; scarce-sample micro-MALS is the differentiator for early programs."
  },

  {
    id: "auc",
    name: "Analytical Ultracentrifugation (AUC)",
    category: "developability",
    tagline: "Sedimentation-velocity characterisation — the gold standard for aggregates and AAV empty/full.",
    tests: ["Sedimentation coefficient distribution", "Aggregation/oligomerisation", "AAV empty vs full capsids"],
    drugTypes: ["antibody", "adc", "cgt"],
    instruments: [
      { name: "Optima AUC", vendor: "Beckman Coulter", role: "Only modern AUC platform", note: "8-cell rotor, UV + interference" }
    ],
    consumables: ["Sedimentation velocity cells (2-channel)", "Matched reference buffer", "Rotor maintenance"],
    automation: "Not automated; 4–16 h runs make AUC the slowest aggregation method — reserved for characterisation.",
    steps: [
      "Load sample and reference buffer into AUC cells",
      "Spin at 40,000–60,000 rpm, collecting radial scans every 1–5 min",
      "Fit sedimentation boundary movement (c(s) analysis with SEDFIT)",
      "Deconvolute sedimentation-coefficient distribution",
      "Quantify species: monomer, dimer, higher-order aggregates",
      "For AAV: separate empty and full capsid populations"
    ],
    providers: [pr("lonza", "AUC for AAV empty/full"), pr("catalent", "AUC in CGT analytics"), pr("eurofins", "AUC characterisation")],
    marketNote: "AAV empty/full analysis is the killer app — CDMS and ITC compete but AUC remains regulatory-credible.",
    capacityNote: "Very scarce: few CROs maintain Optima AUC capability; 1–2 week queues typical."
  },

  {
    id: "dls",
    name: "Dynamic Light Scattering (DLS)",
    category: "developability",
    tagline: "Hydrodynamic size and polydispersity in minutes — aggregation screen.",
    tests: ["Hydrodynamic radius", "Polydispersity index (PDI)", "Colloidal stability over time/temperature"],
    drugTypes: ["antibody", "adc", "peptide", "oligo"],
    instruments: [
      { name: "Zetasizer Ultra", vendor: "Malvern Panalytical", role: "DLS + zeta potential", note: "Low-volume (2 µL)" },
      { name: "DynaPro Plate Reader", vendor: "Wyatt", role: "Plate-based high-throughput DLS", note: "384-well" }
    ],
    consumables: ["Disposable low-volume cuvettes", "Filtered buffers (0.02 µm)", "384-well glass-bottom plates"],
    automation: "Plate-based DLS enables 100s of formulations/day — the standard high-concentration screen.",
    steps: [
      "Filter sample buffer (0.02 µm) to remove dust",
      "Load sample (2–20 µL) into cuvette or plate",
      "Measure autocorrelation at 173° backscatter",
      "Fit cumulants → hydrodynamic radius and PDI",
      "Screen across pH, salt and excipient matrix",
      "Flag conditions with PDI > 0.3 (aggregation onset)"
    ],
    providers: [pr("lonza", "DLS in developability packages"), pr("selvita", "DLS screening"), pr("eurofins", "DLS characterisation")],
    marketNote: "Every formulation lab runs DLS — instrument-lab consumables market more than a service market.",
    capacityNote: "No service constraint; interpretation skill (dust vs aggregates) is the differentiator."
  },

  {
    id: "cd",
    name: "Circular Dichroism (CD)",
    category: "developability",
    tagline: "Secondary-structure fingerprint by far-UV CD — folding verification for biologics.",
    tests: ["Secondary structure content (α-helix, β-sheet)", "Thermal unfolding (CD-Tm)", "Comparability of higher-order structure"],
    drugTypes: ["antibody", "peptide", "oligo"],
    instruments: [
      { name: "Chirascan V100", vendor: "Applied Photophysics", role: "CD spectrometer", note: "Far-UV + near-UV" },
      { name: "J-1500", vendor: "Jasco", role: "CD + MCD", note: "Global standard" }
    ],
    consumables: ["Quartz CD cells (0.1–1 mm path)", "Far-UV transparent buffers (low salt, no high absorbance)", "Nitrogen supply"],
    automation: "Semi-automated with plate-feeding accessories; buffer constraints make full automation rare.",
    steps: [
      "Exchange sample into far-UV transparent buffer (phosphate, low chloride)",
      "Record far-UV spectrum 190–260 nm at 0.2 mg/mL",
      "Subtract buffer baseline",
      "Fit secondary-structure fractions (BeStSel, CDSSTR algorithms)",
      "For thermal unfolding: monitor CD at 222 nm across 20–90°C ramp",
      "Compare to reference lots for biosimilarity"
    ],
    providers: [pr("lonza", "CD for HOS comparability"), pr("eurofins", "CD spectroscopy service"), pr("selvita", "CD in biophysics suite")],
    marketNote: "Comparability (biosimilars, post-change) is the commercial driver — regulatory expectation for HOS.",
    capacityNote: "Niche; specialist labs only. Nitrogen supply and cell handling limit throughput."
  },

  {
    id: "nativems",
    name: "Native Mass Spectrometry",
    category: "binding",
    tagline: "Gas-phase complexes preserve binding — stoichiometry and even affinity by MS.",
    tests: ["Complex stoichiometry", "Binding stoichiometry in mixtures", "ADC drug-to-antibody ratio (DAR) distribution"],
    drugTypes: ["antibody", "adc", "peptide"],
    instruments: [
      { name: "Exactive UHMR", vendor: "Thermo Fisher", role: "High-mass Orbitrap", note: "m/z up to 80,000" },
      { name: "6545XT AdvanceBio", vendor: "Agilent", role: "Native LC-MS for biologics", note: "TOF platform" }
    ],
    consumables: ["Volatile buffers (ammonium acetate)", "Desalting columns (SEC or spin)", "Gold-coated emitters"],
    automation: "Semi-automated; sample prep (buffer exchange) is the manual bottleneck.",
    steps: [
      "Buffer-exchange sample into volatile electrolyte (ammonium acetate)",
      "Introduce by nano-ESI at gentle source settings",
      "Record high-mass spectrum (native spray)",
      "Deconvolute charge-state series → intact complex mass",
      "Quantify stoichiometric distribution (e.g. ADC DAR species)",
      "Optional: gas-phase unfolding (CIU) for stability fingerprint"
    ],
    providers: [pr("catalent", "Native MS for ADC characterization"), pr("lonza", "Native MS in biologics analytics"), pr("eurofins", "Intact mass analysis")],
    marketNote: "Native MS is the fastest-growing biologics characterisation method — ADC DAR-by-MS replaced UV methods.",
    capacityNote: "Specialist capability; few CROs offer Exactive UHMR access — 1–3 week queues."
  },

  {
    id: "stdnmr",
    name: "STD-NMR / WaterLOGSY",
    category: "binding",
    tagline: "Ligand-observed NMR — fragment screening without protein labelling.",
    tests: ["Fragment binding (yes/no + epitope)", "Binding-site mapping by STD amplification", "Competitive displacement in NMR tube"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "600–800 MHz NMR", vendor: "Bruker / JEOL", role: "Ligand-observed screening", note: "Cryoprobe essential" },
      { name: "Bruker SampleJet", vendor: "Bruker", role: "Automated sample changer", note: "96-tube carousels" }
    ],
    consumables: ["Deuterated buffer (D2O + phosphate)", "5 mm NMR tubes (match-quality)", "Isotope-labelled protein optional"],
    automation: "SampleJet automation enables 100+ fragments/day on one instrument.",
    steps: [
      "Prepare protein at 1–10 µM with fragment at 0.5–1 mM",
      "Acquire STD experiment (saturation on protein resonances)",
      "Acquire WaterLOGSY as orthogonal confirmation",
      "Compare ± protein spectra; binding ligands show STD enhancements",
      "Titrate to estimate KD (usually mM range for fragments)",
      "Optional: map epitope from per-proton STD amplification factors"
    ],
    providers: [pr("enamine", "Fragment screening services with NMR"), pr("eurofins", "NMR-based fragment screening"), pr("selvita", "Ligand-observed NMR")],
    marketNote: "Fragment-based discovery remains ~30% of new small molecules; NMR is one of three primary fragment methods (with SPR and X-ray).",
    capacityNote: "Requires 600 MHz+ instrument with cryoprobe — a real constraint outside big pharma and specialist CROs."
  },

  {
    id: "asms",
    name: "Affinity Selection Mass Spectrometry (AS-MS)",
    category: "binding",
    tagline: "Ultra-large library screening by mass spec — millions of compounds against soluble target.",
    tests: ["Library screening (up to 10⁶ compounds)", "Hit confirmation by competition MS", "KD estimation by titration"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "RapidFire 400 + QTRAP", vendor: "Agilent", role: "High-throughput SPE-MS", note: "Seconds per sample" },
      { name: "InfinityLab LC/MSD", vendor: "Agilent", role: "SEC-MS AS workflow", note: "Automated fraction-MS" }
    ],
    consumables: ["SEC/SPE cartridges", "Large compound libraries (Enamine REAL)", "Volatile MS buffers"],
    automation: "Fully automated SPE-MS screening: the only method that screens >100k compounds per target per week by mass.",
    steps: [
      "Incubate target protein with compound pool (100–1000 per pool)",
      "Separate protein-ligand complexes by SEC or SPE",
      "Elute bound ligands to MS; identify by mass + LC retention",
      "Deconvolute pools → individual binders",
      "Re-test hits singly for confirmation",
      "Estimate KD by protein-titration MS"
    ],
    providers: [pr("enamine", "AS-MS screening on REAL libraries"), pr("crl", "AS-MS hit-finding services"), pr("chempartner", "Mass-spec screening")],
    marketNote: "AS-MS is displacing HTS for hard targets (no assay window needed) — the fastest-growing hit-finding method.",
    capacityNote: "Requires integrated SPE-MS automation — a handful of providers (Agilent RapidFire-based) serve the market."
  },

  {
    id: "emsa",
    name: "Electrophoretic Mobility Shift Assay (EMSA)",
    category: "binding",
    tagline: "Gel-shift detection of protein–nucleic acid binding — old but definitive.",
    tests: ["Protein-DNA/RNA binding KD", "Competition specificity", "Complex stoichiometry"],
    drugTypes: ["oligo", "peptide"],
    instruments: [
      { name: "Criterion / mini-gel systems", vendor: "Bio-Rad", role: "Native PAGE", note: "6% gels standard" },
      { name: "Typhoon / Amersham Imager 680", vendor: "Cytiva", role: "Fluorescent/chemiluminescent imaging", note: "Multi-channel" }
    ],
    consumables: ["Native polyacrylamide gels", "5'-fluorescein labelled oligos", "Non-denaturing running buffer (TBE)" ],
    automation: "Manual — gels limit throughput; superseded by fluorescence polarisation for screening.",
    steps: [
      "Label DNA/RNA probe with fluorophore at 5' end",
      "Incubate protein titration series with fixed probe",
      "Run non-denaturing PAGE at 4°C",
      "Image shifted (bound) vs free probe bands",
      "Quantify fraction bound; fit KD",
      "Competition with unlabelled specific/non-specific oligos confirms specificity"
    ],
    providers: [pr("ofelme", "EMSA-style oligo-protein binding datasets"), pr("eurofins", "EMSA services"), pr("selvita", "EMSA in molecular packages")],
    marketNote: "Still the confirmatory method for transcription-factor and RBP binding despite its age.",
    capacityNote: "Commodity; throughput limited by gel electrophoresis hands-on time."
  },

  {
    id: "coip",
    name: "Co-Immunoprecipitation (Co-IP)",
    category: "binding",
    tagline: "Antibody-capture of protein complexes from cells — in-cellulo interaction evidence.",
    tests: ["Protein-protein interaction in cell lysates", "Complex composition by MS", "Interaction dynamics (stimulus/time)"],
    drugTypes: ["antibody", "small-molecule"],
    instruments: [
      { name: "Protein A/G magnetic beads + magnet", vendor: "Thermo Fisher", role: "Capture", note: "1–10 mg lysate" },
      { name: "Orbitrap LC-MS/MS", vendor: "Thermo Fisher", role: "Interactome ID", note: "For AP-MS readout" }
    ],
    consumables: ["IP-grade antibodies (target and bait)", "Protein A/G magnetic beads", "Protease/phosphatase inhibitor cocktails", "Low-binding tubes"],
    automation: "Magnetic-bead formats automate on KingFisher/Opentrons; AP-MS adds LC-MS/MS automation.",
    steps: [
      "Lyse cells under non-denaturing conditions preserving complexes",
      "Pre-clear lysate with control beads",
      "Incubate with bait antibody (2 h–overnight at 4°C)",
      "Capture complexes on protein A/G beads",
      "Wash stringently (salt/detergent balance)",
      "Elute; detect co-precipitated partners by Western or MS",
      "Reciprocal IP confirms specificity"
    ],
    providers: [pr("eurofins", "Co-IP and AP-MS services"), pr("crl", "Interactome mapping"), pr("selvita", "Co-IP packages")],
    marketNote: "Foundation of interaction-biology services; AP-MS (affinity purification MS) is the industrialised descendant.",
    capacityNote: "Antibody quality is the bottleneck — a good IP-grade antibody exists for <30% of targets."
  },

  {
    id: "peptide-array",
    name: "Peptide Array Binding (PepScan/SPOT)",
    category: "binding",
    tagline: "Thousands of overlapping peptides on a slide — linear epitope mapping.",
    tests: ["Linear epitope mapping", "Motif specificity profiling", "Binding hotspot scanning"],
    drugTypes: ["antibody", "peptide"],
    instruments: [
      { name: "PepStar peptide microarrays", vendor: "JPT Peptide Technologies", role: "Array format", note: "Thousands of spots/slide" },
      { name: "Innopsys / GenePix scanners", vendor: "Innopsys / Molecular Devices", role: "Fluorescence imaging", note: "Multi-slide" }
    ],
    consumables: ["Custom peptide arrays", "Fluorescent secondary antibodies", "Blocking buffers (casein-based)"],
    automation: "Arrays are printed centrally; the assay is a simple stain-and-scan.",
    steps: [
      "Design overlapping 12–15mer peptide library across the antigen",
      "Print library on array slides",
      "Incubate array with antibody/protein sample",
      "Wash; detect bound antibody with fluorescent anti-IgG",
      "Scan and quantify spot intensities",
      "Map epitope to contiguous binding-positive peptides"
    ],
    providers: [{ name: "JPT Peptide Technologies", note: "PepStar arrays + service", region: "DE" }, { name: "Pepscan (PerkinElmer)", note: "CLIPS constrained-peptide epitope mapping", region: "NL" }, pr("eurofins", "Peptide array services")],
    marketNote: "Epitope mapping demand rises with the antibody pipeline — conformational epitopes need complementary methods (SPR, cryo-EM).",
    capacityNote: "Array printing has 2–4 week lead time; the assay itself is fast."
  },

  {
    id: "kinase-adp",
    name: "Kinase Activity Assay (ADP-Glo / ADP Hunter)",
    category: "binding",
    tagline: "Luminescent ADP detection — the workhorse for kinase inhibitor profiling.",
    tests: ["Kinase IC50", "Compound selectivity panel profiling", "Mechanism of action (ATP-competition)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "PHERAstar FSX / EnVision", vendor: "BMG / Revvity", role: "Glow luminescence read", note: "384-well" },
      { name: "Echo 655 acoustic", vendor: "Labcyte (Sartorius)", role: "nL compound transfer", note: "Enables panel miniaturisation" }
    ],
    consumables: ["ADP-Glo reagent kit", "Kinase + substrate pairs", "ATP at Km concentration", "384-well white plates"],
    automation: "Fully automated panel profiling: 200–300 kinases per compound in a day.",
    steps: [
      "Optimise kinase/substrate/ATP at Km for linear velocity",
      "Pre-incubate kinase with test compound",
      "Start reaction with ATP/substrate; incubate 30–60 min",
      "Quench with ADP-Glo dephosphorylation reagent",
      "Add detection reagent; read luminescence",
      "Fit IC50; generate selectivity profile vs panel",
      "Determine MoA by ATP-titration (competitive Ki)"
    ],
    providers: [pr("rbi", "Kinase profiling (KINOMEscan + activity panels)"), pr("eurofins", "Kinase panels and ProfilerPro"), pr("chempartner", "Kinase biochemical services")],
    marketNote: "Kinases remain ~25% of drug targets — activity panels are commodity with premium on whole-kinome selectivity profiling.",
    capacityNote: "Highly industrialised (DiscoverX, Reaction Biology, Eurofins) — 48-h turnaround on standard panels."
  },

  {
    id: "protease-fret",
    name: "Protease Activity Assay (FRET substrate)",
    category: "binding",
    tagline: "Quenched fluorescent peptide substrates — protease inhibitor profiling.",
    tests: ["Protease IC50/Ki", "Substrate specificity (P1–P4 scanning)", "Irreversible-inhibitor kinetics (kobs/kinact)"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "PHERAstar / FLUOstar", vendor: "BMG Labtech", role: "RFU kinetic read", note: "384-well" },
      { name: "Spark", vendor: "Tecan", role: "Fluorescence kinetics", note: "Multi-mode" }
    ],
    consumables: ["FRET peptide substrates (Dabcyl/Edans)", "Recombinant protease target", "384-well black plates"],
    automation: "Continuous-read kinetics automate well; irreversible inhibitors need time-course software.",
    steps: [
      "Select quenched fluorescent substrate for target protease",
      "Establish linear initial velocity conditions",
      "Pre-incubate protease with inhibitor series",
      "Start with substrate; record RFU increase continuously",
      "Fit initial rates → IC50 or Ki",
      "For covalent inhibitors: time-dependent inhibition → kinact/KI"
    ],
    providers: [pr("eurofins", "Protease panels"), pr("rbi", "Protease biochemistry"), pr("chempartner", "Protease inhibitor profiling")],
    marketNote: "Protease targets (SARS-CoV-2 Mpro legacy, complement, coagulation) sustain steady demand.",
    capacityNote: "Commodity biochemistry; covalent-kinetics analysis is the premium skill."
  },

  {
    id: "saw",
    name: "Surface Acoustic Wave (SAW) Binding",
    category: "binding",
    tagline: "Acoustic-wave biosensor — label-free kinetics on crude samples.",
    tests: ["Binding kinetics (kon/koff/KD)", "Whole-cell binding", "Crude-matrix affinity (serum, lysate)"],
    drugTypes: ["antibody", "peptide", "small-molecule"],
    instruments: [
      { name: "sam5BLUE / WAVEsystem", vendor: "Biosensors Instruments / Creoptix", role: "SAW/Grating-coupled biosensors", note: "GCI higher sensitivity than SPR" }
    ],
    consumables: ["Gold sensor chips (COOH/NTA/streptavidin)", "Coupling reagents (EDC/NHS)", "Sample in crude matrix"],
    automation: "Bench instruments with autosamplers; throughput below BLI but above manual SPR.",
    steps: [
      "Couple ligand to SAW sensor chip",
      "Baseline in buffer; inject analyte series",
      "SAW phase shift records binding kinetics in real time",
      "Crude samples: reference-subtract matrix contribution",
      "Fit 1:1 model → kon, koff, KD",
      "Report affinity in challenging matrices (serum, cell lysate)"
    ],
    providers: [{ name: "Creoptix service lab", note: "GCI kinetics service", region: "CH" }, pr("twobind", "SAW/GCI binding studies")],
    marketNote: "GCI (Creoptix) and SAW (Biosensors AG) fill the niche between BLI's crude-tolerance and SPR's precision.",
    capacityNote: "Very few service labs — specialist providers only."
  },

  {
    id: "gratingcoupled",
    name: "Grating-Coupled Interferometry (GCI)",
    category: "binding",
    tagline: "Creoptix WAVE — SPR-class kinetics with 10× better sensitivity.",
    tests: ["Kinetics on low-immobilisation targets", "Fragment affinity (weak, fast off-rates)", "Crude-sample affinity"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "Creoptix WAVE", vendor: "Creoptix (Malvern)", role: "GCI biosensor", note: "4-channel, crude-compatible" }
    ],
    consumables: ["Creoptix WAVEchips (COOH/streptavidin/NTA)", "One-click hydrophilic chips", "Recovery-free maintenance"],
    automation: "Automated injection; channel regeneration between cycles.",
    steps: [
      "Immobilise ligand on WAVEchip (amine or tag capture)",
      "Inject analyte dilution series across channels",
      "GCI interferometry records phase shift at higher SNR than SPR",
      "Fit kinetics with high-confidence koff for weak binders",
      "Fragment mode: short injections, fast off-rate resolution",
      "Output kon/koff/KD with residuals"
    ],
    providers: [{ name: "Creoptix service", note: "WAVE kinetics service", region: "CH" }, pr("twobind", "GCI studies")],
    marketNote: "Fragment-screening labs adopt GCI when SPR sensitivity limits them — a small but premium segment.",
    capacityNote: "Rare: instrument-specific service; mostly sold as instruments with application support."
  }
);
