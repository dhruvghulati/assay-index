// Expansion 2 — Cell-based functional assays + ion channels
ASSAYS.push(
  {
    id: "reporter-luc",
    name: "Reporter Gene Assay (Luciferase)",
    category: "cell",
    tagline: "Promoter-response element fused to luciferase — pathway activity in a plate.",
    tests: ["Pathway activation/inhibition (NF-κB, CRE, HRE, ARE)", "Nuclear receptor agonism/antagonism", "Gene-regulatory dose-response EC50"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "EnVision / PHERAstar", vendor: "Revvity / BMG", role: "Bright-Glo luminescence", note: "384-well" },
      { name: "Tecan Spark", vendor: "Tecan", role: "Dual-luciferase normalisation", note: "Firefly/Renilla" }
    ],
    consumables: ["Stable reporter cell line (SRE-luc, NF-κB-luc etc.)", "Luciferase substrate (Bright-Glo/One-Glo)", "384-well white plates", "Coelenterazine for Renilla"],
    automation: "Add-and-read after stimulation — fully compatible with automated 384-well handling.",
    steps: [
      "Seed reporter cell line in 384-well plates (24 h)",
      "Treat with compound ± pathway stimulus",
      "Incubate 4–24 h depending on pathway kinetics",
      "Lyse and add luciferase substrate (single-step reagent)",
      "Read steady-state luminescence",
      "Normalise to cell number or Renilla control",
      "Fit dose-response → EC50/IC50 and efficacy (Emax)"
    ],
    providers: [pr("eurofins", "Reporter assay panels for signalling pathways"), pr("chempartner", "Custom reporter cell lines + assays"), pr("crl", "Reporter assays in toxicology")],
    marketNote: "Reporter assays are the entry-level cell assay — commodity pricing, high volume.",
    capacityNote: "Universally available; the premium is validated stable lines for orphan pathways."
  },

  {
    id: "camp-htrf",
    name: "cAMP Accumulation (HTRF)",
    category: "cell",
    tagline: "Second-messenger quantification for GPCR agonism and antagonism.",
    tests: ["GPCR agonist EC50 / antagonist IC50", "Intrinsic efficacy comparison", "Bias factor (Gs vs β-arrestin)"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "PHERAstar FSX", vendor: "BMG Labtech", role: "TR-FRET 665/620 read", note: "cAMP HiRange kits" }
    ],
    consumables: ["cAMP-d2 tracer + anti-cAMP cryptate (Cisbio)", "Cells expressing GPCR (CHO/HEK)", "IBMX to block phosphodiesterases", "384-well white plates"],
    automation: "Homogeneous add-and-read — 96 targets per day feasible in 384-well.",
    steps: [
      "Seed GPCR-expressing cells (or use membrane prep for Gi with prior coupling)",
      "Pre-incubate with antagonist (if testing inhibition)",
      "Add agonist + compound; incubate 30 min with IBMX",
      "Lyse with d2-cAMP + cryptate reagents",
      "Read HTRF ratio (665/620)",
      "Fit cAMP standard curve; convert to concentration",
      "Generate agonist EC50 / antagonist IC50 curves"
    ],
    providers: [pr("eurofins", "GPCR cAMP panels (Chem GPCR library)"), pr("chempartner", "GPCR functional assays"), pr("syngene", "GPCR cAMP services")],
    marketNote: "GPCRs remain ~35% of approved-drug targets — cAMP assays are core to GPCR programs.",
    capacityNote: "Well industrialised; Gi-coupled receptors need more care (cAMP inhibition mode) — a known assay-quality gap."
  },

  {
    id: "calcium-flux",
    name: "Calcium Flux (FLIPR / Aequorin)",
    category: "cell",
    tagline: "Real-time intracellular Ca²⁺ — fast Gq-coupled GPCR kinetics.",
    tests: ["Gq-GPCR agonism/antagonism", "Kinetics of calcium release", "Store-operated calcium entry (SOCE)"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "FLIPR Penta", vendor: "Molecular Devices", role: "Kinetic fluorescence plate reader", note: "384-well, 70 Hz" },
      { name: "FDSS/μCELL", vendor: "Hamamatsu", role: "Kinetic luminescence imaging", note: "Aequorin format" }
    ],
    consumables: ["Fluo-4 / Cal-520 AM dye", "Probenecid (dye retention)", "384-well black clear-bottom plates", "Aequorin cells + coelenterazine (alternative)"],
    automation: "FLIPR reads whole plate every ~1 s — the standard for kinetic GPCR screens.",
    steps: [
      "Seed cells in 384-well plates (24 h)",
      "Load with Ca²⁺ dye (Fluo-4 AM + probenecid, 1 h)",
      "Baseline fluorescence for 30 s",
      "Inject compound; record fluorescence spike for 2–3 min",
      "Normalise to baseline (ΔF/F0)",
      "Quantify peak, AUC and decay kinetics",
      "Fit concentration-response → EC50/IC50"
    ],
    providers: [pr("eurofins", "FLIPR calcium flux panels"), pr("chempartner", "Ca²⁺ flux GPCR assays"), pr("crl", "Calcium flux in ion-channel packages")],
    marketNote: "Commodity GPCR functional assay; FLIPR instruments are shared across most discovery CROs.",
    capacityNote: "Abundant; differentiator is receptor desensitisation handling for slow agonists."
  },

  {
    id: "betaarrestin",
    name: "β-Arrestin Recruitment (PathHunter / Tango)",
    category: "cell",
    tagline: "Complementation-based GPCR β-arrestin recruitment — bias profiling.",
    tests: ["β-arrestin recruitment EC50", "Balanced vs biased agonism (Gs vs arrestin)", "Antagonist blockade of arrestin pathway"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "EnVision / PHERAstar", vendor: "Revvity / BMG", role: "Chemiluminescent complementation read", note: "384-well" },
      { name: "PathHunter cell lines", vendor: "Eurofins DiscoverX", role: "Enzyme-complementation cells", note: "400+ GPCRs available" }
    ],
    consumables: ["PathHunter detection reagents", "EA-fragment fusion cells", "384-well white plates"],
    automation: "Add-and-read after overnight incubation — standard automated workflow.",
    steps: [
      "Seed PathHunter (β-arrestin-enzyme-complementation) cells",
      "Treat with agonist/compound series (90 min–overnight)",
      "Lyse and add detection substrate",
      "Read chemiluminescence",
      "Fit recruitment curves → EC50 and Emax",
      "Compare arrestin EC50 vs cAMP EC50 → bias factor"
    ],
    providers: [pr("eurofins", "DiscoverX PathHunter GPCR panel"), pr("chempartner", "Arrestin recruitment assays"), pr("syngene", "β-arrestin services")],
    marketNote: "Bias agonism is a primary GPCR differentiator (G-protein vs arrestin) — demand tracks biased-ligand programs.",
    capacityNote: "DiscoverX dominates the cell-line supply; assay itself is commodity."
  },

  {
    id: "gtpgs",
    name: "[35S]GTPγS Binding",
    category: "binding",
    tagline: "Direct G-protein activation measurement in membranes — GPCR efficacy sans cells.",
    tests: ["Agonist efficacy (Emax) at Gi/o-coupled GPCRs", "Inverse agonism detection", "Allosteric modulator cooperativity"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "FilterMate + TopCount NXT", vendor: "Revvity", role: "Radiometric filtration", note: "96-well" }
    ],
    consumables: ["[35S]GTPγS radioligand", "GDP (to reduce basal binding)", "Membrane prep expressing GPCR + Gi", "WGA-SP filtration plates"],
    automation: "Semi-automated harvesters; radiochemistry handling restricts full automation.",
    steps: [
      "Prepare membranes from GPCR-expressing cells",
      "Incubate membranes with GDP and [35S]GTPγS",
      "Add agonist/modulator dilution series",
      "Incubate 30–60 min at 30°C",
      "Filter rapidly; wash 3× with cold buffer",
      "Count filter-bound radioactivity",
      "Fit curves → agonist EC50/Emax and Schild analysis for antagonists"
    ],
    providers: [pr("eurofins", "GTPγS for CNS GPCR targets"), pr("crl", "GTPγS in GPCR packages"), pr("syngene", "Radioligand GTPγS services")],
    marketNote: "The definitive Gi-GPCR efficacy assay — CNS programs rely on it for allosteric modulators.",
    capacityNote: "Radioisotope licensing limits providers — fewer labs each year, queues lengthening."
  },

  {
    id: "impedance",
    name: "Label-Free Whole-Cell Impedance (CellKey / ECIS)",
    category: "cell",
    tagline: "Morphology-driven impedance — pathway-agnostic live-cell kinetics.",
    tests: ["Integrated GPCR/RTK response kinetics", "Cytotoxicity time-course", "Phenotypic signature without reporter"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "CellKey HT", vendor: "Molecular Devices", role: "Impedance plate reader", note: "96/384-well microelectrode plates" },
      { name: "ECIS ZΘ", vendor: "Applied BioPhysics", role: "Gold-electrode impedance", note: "Reference platform" }
    ],
    consumables: ["Electrode-coated assay plates (single-use)", "Cells in serum-reduced media", "Impedance-compatible buffer"],
    automation: "Continuous kinetic reads without labels; robotic compatible.",
    steps: [
      "Seed cells on microelectrode plates to confluence",
      "Baseline impedance recording",
      "Inject compound; record impedance every 10 s for 1–2 h",
      "Extract kinetic features (peak, plateau, oscillation patterns)",
      "Compare response fingerprints across compounds",
      "Fit pharmacology where signature maps to a known pathway"
    ],
    providers: [pr("eurofins", "CellKey phenotypic GPCR assays"), pr("chempartner", "Impedance-based assays")],
    marketNote: "Label-free phenotypic screening carved a niche in GPCR orphan-pathway work — stable but small.",
    capacityNote: "Limited provider base; plate cost is high (single-use electrodes)."
  },

  {
    id: "proliferation",
    name: "Cell Proliferation (BrdU / EdU)",
    category: "cell",
    tagline: "DNA-synthesis incorporation — true proliferation vs viability.",
    tests: ["Proliferation IC50 (cytostatic vs cytotoxic)", "Mitogen response curves", "Cell-cycle entry (G0→S)"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "Click-iT EdU + flow/imaging", vendor: "Thermo Fisher", role: "Proliferation readout", note: "Alexa dye detection" },
      { name: "Fortessa flow cytometer", vendor: "BD", role: "DNA content + EdU", note: "7-AAD co-stain" }
    ],
    consumables: ["EdU (thymidine analogue)", "Click reaction cocktail (CuSO₄, buffer)", "DNAse-free buffers", "7-AAD or DAPI"],
    automation: "Plate-based EdU imaging automates on high-content platforms.",
    steps: [
      "Synchronise cells (serum starvation or thymidine block)",
      "Pulse with EdU (1–2 h) after compound treatment",
      "Fix and permeabilise",
      "Click reaction conjugates fluorophore to EdU",
      "Read by flow cytometry or imaging",
      "Quantify %EdU+ cells and DNA content (G1/S/G2M)",
      "Fit proliferation IC50"
    ],
    providers: [pr("eurofins", "Proliferation assay services"), pr("crl", "Proliferation in oncology packages"), pr("arctoris", "Automated proliferation panels")],
    marketNote: "Every oncology program needs cytostatic/cytotoxic differentiation — stable demand.",
    capacityNote: "Commodity; flow-based readout limits throughput vs imaging (high-content platforms 10× faster)."
  },

  {
    id: "migration",
    name: "Cell Migration (Scratch / Transwell)",
    category: "cell",
    tagline: "Wound-heal and chemotaxis — motility readouts for oncology and fibrosis.",
    tests: ["Migration IC50", "Chemotaxis dose-response (chemokine gradients)", "Invasion through ECM (Matrigel)"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "IncuCyte ZOOM", vendor: "Sartorius", role: "Live-cell wound imaging", note: "Scratch assay in-plate" },
      { name: "Transwell inserts", vendor: "Corning", role: "Chemotaxis chambers", note: "3–8 µm pores" }
    ],
    consumables: ["96-well wound-maker (IncuCyte)", "Transwell inserts", "Matrigel/collagen coating", "Calcein-AM for migrated-cell staining"],
    automation: "IncuCyte automates scratch+imaging fully; Transwell is still semi-manual.",
    steps: [
      "Grow cells to confluent monolayer in 96-well plate",
      "Scratch uniform wound (wound-maker pin tool)",
      "Wash debris; add compound in low-serum media",
      "Image every 2 h for 24–72 h (IncuCyte inside incubator)",
      "Quantify wound-closure rate (mask-based metrics)",
      "Transwell arm: seed cells on insert; chemoattractant below; count migrated cells after 4–24 h",
      "Fit migration IC50"
    ],
    providers: [pr("eurofins", "Migration and invasion services"), pr("crl", "Oncology migration packages"), pr("syngene", "Migration assays at India cost")],
    marketNote: "Fibrosis and immuno-oncology drive demand; IncuCyte adoption industrialised the scratch assay.",
    capacityNote: "Imaging throughput is the constraint — 96-well plates limit studies to moderate scale."
  },

  {
    id: "organoid",
    name: "3D Organoid Viability / Penetration",
    category: "cell",
    tagline: "Patient-derived organoids — the translational bridge before in vivo.",
    tests: ["Organoid viability IC50", "Drug penetration into 3D structure", "Co-culture response (immune-organoid)"],
    drugTypes: ["small-molecule", "antibody", "adc", "peptide"],
    instruments: [
      { name: "ImageXpress Micro Confocal", vendor: "Molecular Devices", role: "3D organoid imaging", note: "Spinning-disk confocal" },
      { name: "CellTiter-Glo 3D reagent", vendor: "Promega", role: "Organoid viability", note: "Tougher lysis formulation" }
    ],
    consumables: ["Patient-derived organoids (PDXO)", "Matrigel/BME domes", "3D culture plates (U-bottom, low-attach)", "Dispase for passaging"],
    automation: "Semi-automated (liquid handling + imaging); organoid handling remains the skilled bottleneck.",
    steps: [
      "Establish patient-derived organoid cultures in BME domes",
      "Plating in 384-well U-bottom plates (1–10 organoids/well)",
      "Treat with compound dilution series (5–7 days)",
      "Read viability (CellTiter-Glo 3D) or image morphology",
      "Confocal arm: fluorescent drug penetration depth quantification",
      "Fit 3D-IC50 (often 10× higher than 2D — stromal barrier)",
      "Compare 3D/2D ratio as resistance indicator"
    ],
    providers: [pr("crl", "PDXO platform (Oncogramme)"), pr("eurofins", "Organoid services"), { name: "HUB Organoids (service)", note: "Foundation organoid lines + assays", region: "NL" }],
    marketNote: "Organoids are the fastest-growing cell model — regulatory-friendly alternatives to PDX for oncology.",
    capacityNote: "PDXO library access and organoid culture skill are scarce — 4–8 week assay-development timelines."
  },

  {
    id: "ipsc-neuron",
    name: "iPSC-Derived Neuron Assays",
    category: "cell",
    tagline: "Human pluripotent neurons for neurotoxicity and efficacy — the neuro assay frontier.",
    tests: ["Neurite outgrowth / synaptogenesis", "Neuroinflammation (microglia co-culture)", "Electrophysiology maturation (MEA)"],
    drugTypes: ["small-molecule", "antibody", "peptide", "cgt"],
    instruments: [
      { name: "Maestro Pro MEA", vendor: "Axion BioSystems", role: "Neural network activity", note: "Non-invasive electrophysiology" },
      { name: "Incucyte / Opera Phenix", vendor: "Sartorius / Revvity", role: "Neurite imaging", note: "AI neurite tracing" }
    ],
    consumables: ["iPSC-derived neurons (commercial: Axol, CDI)", "BrainPhys medium + supplements", "Matrigel/laminin coating", "Astrocyte co-culture supplements"],
    automation: "Imaging automates; MEA plates are fixed-format (6–48 wells), limiting scale.",
    steps: [
      "Differentiate or purchase iPSC-neurons (2–4 week maturation)",
      "Plate on laminin-coated MEA electrodes or imaging plates",
      "Record baseline spontaneous activity (MEA spikes/network bursts)",
      "Treat with compound (acute + chronic dosing)",
      "Record activity changes + neurite morphology over time",
      "Quantify spike rate, burst frequency, synchrony metrics",
      "Flag neuroactive/neurotoxic concentrations"
    ],
    providers: [pr("eurofins", "iPSC neuronal assay services"), pr("crl", "Neurotox iPSC packages"), { name: "StemoniX (FUJIFILM)", note: "iPSC neural screening platforms", region: "US" }],
    marketNote: "FDA neurotoxicity focus + CNS pipeline revival drive demand; iPSC neurons beat rodent primary cultures for translation.",
    capacityNote: "Scarce: maturation times (weeks) and cell sourcing limit CRO capacity — book 4–8 weeks ahead."
  },

  {
    id: "crispr-knockin",
    name: "CRISPR-Edited Functional Cell Lines",
    category: "cell",
    tagline: "Endogenous-level target expression — the assay-quality upgrade for functional work.",
    tests: ["Endogenous target function (no overexpression artifact)", "Drug-response in edited clones", "Resistance-mutation scanning"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "Nucleofector / Lonza 4D", vendor: "Lonza", role: "CRISPR RNP delivery", note: "96-well electroporation" },
      { name: "Illumina MiSeq / NGS", vendor: "Illumina", role: "Clone genotyping", note: "Amplicon sequencing" }
    ],
    consumables: ["Cas9 RNP + guide RNAs", "ssODN donor templates", "Puromycin/enrichment markers", "Single-cell cloning plates"],
    automation: "Edit → enrich → single-cell clone → genotype: 8–16 week pipeline, partially automated.",
    steps: [
      "Design guides flanking the target locus",
      "Electroporate Cas9 RNP + donor/ssODN into cells",
      "Enrich edited population (FACS or antibiotic)",
      "Single-cell clone by limiting dilution",
      "Genotype clones by amplicon NGS",
      "Validate target expression at endogenous level",
      "Run functional assay in the edited line"
    ],
    providers: [pr("eurofins", "Custom cell-line engineering"), pr("chempartner", "CRISPR cell-line services"), pr("aragen", "Cell-line engineering at India cost")],
    marketNote: "Assay-quality pressure (endogenous expression) is pushing CRISPR lines to replace transfected lines — strong growth.",
    capacityNote: "8–16 week timelines are the rule; capacity exists but lead time is the pain point."
  },

  {
    id: "adc-kill",
    name: "Antibody-Drug Conjugate Cytotoxicity (ADC Cell Kill)",
    category: "cell",
    tagline: "Antigen-specific cell killing — the ADC functional assay.",
    tests: ["ADC potency IC50 (antigen-positive cells)", "Bystander effect (antigen-negative co-culture)", "Linker-payload stability in culture"],
    drugTypes: ["adc", "antibody"],
    instruments: [
      { name: "EnVision (CellTiter-Glo)", vendor: "Revvity", role: "Viability read", note: "384-well" },
      { name: "Opera Phenix HCS", vendor: "Revvity", role: "Imaging cytotoxicity", note: "Bystander quantification" }
    ],
    consumables: ["Antigen-positive and -negative cell pair", "CellTiter-Glo reagent", "Human plasma stability QC samples"],
    automation: "Standard automated cell-assay formats apply.",
    steps: [
      "Confirm antigen expression on target and control cell lines",
      "Treat with ADC dilution series (5–7 days)",
      "Read viability (luminescence or imaging)",
      "Fit IC50 on antigen-positive cells",
      "Co-culture arm: mix antigen-negative cells, quantify bystander killing",
      "Compare potency to unconjugated payload (specificity index)",
      "Include plasma-pre-incubated ADC to test linker stability"
    ],
    providers: [pr("crl", "ADC cell-killing packages"), pr("eurofins", "ADC functional assays"), pr("lonza", "ADC potency testing")],
    marketNote: "2,334 clinical-stage ADCs (Jan 2026) — ADC functional potency is a named capacity-constrained service.",
    capacityNote: "Antigen-matched cell pairs are the bottleneck; generic panels miss rare targets."
  },

  {
    id: "autophagy",
    name: "Autophagy Assay (LC3 Puncta / LC3-II)",
    category: "cell",
    tagline: "Autophagic-flux readouts — growing target class in neuro and oncology.",
    tests: ["Autophagy induction/inhibition", "Autophagic flux (LC3-II turnover with bafilomycin)", "p62/SQSTM1 degradation kinetics"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Opera Phenix / ImageXpress", vendor: "Revvity / MD", role: "LC3 puncta imaging", note: "High-content" },
      { name: "Western blot (LC3-I/II)", vendor: "Standard", role: "Orthogonal confirmation", note: "Densitometry" }
    ],
    consumables: ["GFP-LC3 reporter cells", "Bafilomycin A1 (lysosomal inhibitor)", "Anti-LC3B antibody", "Counting beads for normalisation"],
    automation: "High-content imaging automates puncta counting fully.",
    steps: [
      "Seed GFP-LC3 reporter cells in 384-well plates",
      "Treat with compound ± bafilomycin (to trap autophagosomes)",
      "Fix and image (or image live)",
      "Count LC3 puncta per cell (image analysis pipeline)",
      "Calculate autophagic flux: puncta(+bafilomycin) − puncta(−bafilomycin)",
      "Confirm by LC3-II Western blot",
      "Report inducers/inhibitors with flux-based IC50"
    ],
    providers: [pr("eurofins", "Autophagy assay services"), pr("crl", "Autophagy in neuro packages"), pr("chempartner", "Autophagy screening")],
    marketNote: "mTOR-adjacent programs and protein-aggregation diseases sustain steady demand.",
    capacityNote: "Image-analysis pipeline quality (puncta segmentation) differentiates providers."
  },

  {
    id: "cell-cycle",
    name: "Cell-Cycle Analysis (Flow Cytometry)",
    category: "cell",
    tagline: "DNA-content phases — where in the cycle the compound acts.",
    tests: ["G1/S/G2M distribution", "Sub-G1 apoptosis fraction", "Synchronisation-release kinetics"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "FACSCanto / Fortessa", vendor: "BD Biosciences", role: "DNA-content flow", note: "PI/DAPI readout" },
      { name: "NucleoCounter NC-3000", vendor: "ChemoMetec", role: "Automated cell cycle", note: "Cassette-based" }
    ],
    consumables: ["Propidium iodide + RNase A", "Ethanol (fixation)", "EDTA-free trypsin", "Counting beads"],
    automation: "NC-3000 cassettes automate; standard flow requires operator time.",
    steps: [
      "Treat cells with compound (12–48 h)",
      "Harvest cells gently (retain sub-G1 apoptotic bodies)",
      "Fix in 70% ethanol overnight",
      "Stain with PI/RNase solution (30 min)",
      "Run on flow cytometer; collect FL2-A DNA histogram",
      "Model phases (Watson/Dean-Jett-Fox)",
      "Quantify G1/S/G2M and sub-G1 fractions"
    ],
    providers: [pr("eurofins", "Cell-cycle services"), pr("crl", "Cell-cycle in oncology packages"), pr("syngene", "Flow-based cell cycle")],
    marketNote: "Mature assay; new demand from CDK and Aurora-kinase inhibitor programs.",
    capacityNote: "Commodity flow service — no constraint."
  },

  {
    id: "cellpainting",
    name: "Cell Painting (High-Content Morphological Profiling)",
    category: "cell",
    tagline: "Eight-dye morphological fingerprint — mechanism-of-action prediction at scale.",
    tests: ["Morphological profiling (1,500+ features)", "MoA clustering vs reference compounds", "Phenotypic hit triage"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Opera Phenix Plus", vendor: "Revvity", role: "Confocal HCS imaging", note: "5-channel 20×" },
      { name: "CellProfiler pipelines", vendor: "Open-source", role: "Feature extraction", note: "Standard profiles" }
    ],
    consumables: ["8-dye staining cocktail (MitoTracker, Phalloidin, WGA, DAPI etc.)", "384-well plates", "Reference compound sets (MOA libraries)"],
    automation: "The most industrialised phenotypic assay: JUMP-CP style pipelines run 10k compounds/week.",
    steps: [
      "Seed cells in 384-well plates (U2OS standard)",
      "Treat with compounds (48 h)",
      "Fix and stain with 8-organelle dye cocktail",
      "Image 5 channels per well (confocal 20×)",
      "Segment cells; extract 1,500+ morphology features",
      "Normalise vs DMSO controls; compute profiles",
      "Cluster by similarity → MoA prediction vs reference set"
    ],
    providers: [pr("eurofins", "Cell-painting profiling service"), pr("arctoris", "Automated phenotypic profiling"), pr("crl", "Morphological profiling")],
    marketNote: "Cell Painting is the reference phenotypic method — JUMP-CP public data made it mainstream.",
    capacityNote: "Image-storage and analysis pipelines (not lab work) are the constraint — few CROs industrialised it."
  },

  {
    id: "apoptosis",
    name: "Apoptosis Assay (Caspase 3/7 + Annexin V)",
    category: "cell",
    tagline: "Programmed-cell-death readouts — mechanism of the kill.",
    tests: ["Caspase 3/7 activation kinetics", "Annexin V / PI apoptosis staging", "BCL-2 family dependency (BH3 profiling)"],
    drugTypes: ["small-molecule", "antibody", "adc"],
    instruments: [
      { name: "IncuCyte (live caspase)", vendor: "Sartorius", role: "Real-time apoptosis imaging", note: "In-incubator" },
      { name: "Fortessa flow", vendor: "BD", role: "Annexin V/PI", note: "Quad gating" }
    ],
    consumables: ["Caspase 3/7 green reagent (IncuCyte)", "Annexin V-FITC + PI", "Caspase inhibitors (controls)", "Time-course plates"],
    automation: "IncuCyte fully automates kinetic apoptosis; flow endpoint requires hands-on.",
    steps: [
      "Treat cells with compound dilution series",
      "Add live-cell caspase 3/7 reagent at dosing",
      "Image every 2–4 h for 48–72 h (IncuCyte)",
      "Endpoint: stain with Annexin V-FITC + PI",
      "Flow cytometry quad gates: live, early, late apoptotic, necrotic",
      "Fit caspase-activation EC50 and time-to-commitment"
    ],
    providers: [pr("eurofins", "Apoptosis panels"), pr("crl", "Apoptosis in oncology"), pr("chempartner", "BH3 and apoptosis services")],
    marketNote: "BH3 profiling (predicting BCL-2 dependencies) is the premium segment for haematology programs.",
    capacityNote: "Commodity; BH3 profiling is specialist (few labs run it reproducibly)."
  },

  {
    id: "nav15",
    name: "Nav1.5 Sodium-Channel Assay",
    category: "ionchannel",
    tagline: "Cardiac sodium-channel liability — arrhythmia risk beyond hERG.",
    tests: ["Nav1.5 inhibition IC50 (late vs peak current)", "Use-dependence kinetics", "Inactivated-state block (EC50 shift)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "SyncroPatch 384", vendor: "Nanion", role: "APC Nav1.5", note: "384-well automated" },
      { name: "QPatch 48", vendor: "Sophion (BioAgilytix)", role: "Nav1.5 screening", note: "48 channels" }
    ],
    consumables: ["Nav1.5-expressing HEK cells", "APC recording chips", "Tetrodotoxin-resistant controls", "External/internal solutions"],
    automation: "Fully automated patch clamp — the CiPA core-panel method.",
    steps: [
      "Culture Nav1.5-HEK cells (passage <30)",
      "Load onto APC chip; achieve whole-cell config",
      "Apply step-depolarisation protocol; measure peak and late current",
      "Perfuse compound at 5–8 concentrations",
      "Fit IC50 for peak and late current separately",
      "Test use-dependence with 10 Hz train stimulation",
      "Flag compounds with late-current block (arrhythmia risk)"
    ],
    providers: [pr("nanion", "Nav1.5 services (SyncroPatch)"), pr("metrion", "CiPA ion-channel panel"), pr("crl", "Nav1.5 for regulatory")],
    marketNote: "CiPA (Comprehensive in vitro Proarrhythmia Assay) institutionalised Nav1.5 + hERG + Cav1.2 as the cardiac-safety triad.",
    capacityNote: "Same specialist-ion-channel constraint as hERG — Metrion/Nanion slots book out."
  },

  {
    id: "cav12",
    name: "Cav1.2 L-type Calcium-Channel Assay",
    category: "ionchannel",
    tagline: "The third CiPA panel member — vascular and cardiac Ca²⁺ channel block.",
    tests: ["Cav1.2 inhibition IC50", "Voltage-dependence of block", "Interaction with hERG+Nav data in CiPA model"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "SyncroPatch 384", vendor: "Nanion", role: "Cav1.2 APC", note: "Automated, high throughput" },
      { name: "QPatch", vendor: "Sophion", role: "Cav1.2 confirmation", note: "Pharmacology-grade data" }
    ],
    consumables: ["Cav1.2 + β2a subunit cells", "APC chips", "Calcium-channel activator controls (Bay K8644)"],
    automation: "APC-automated; runs as part of CiPA triad.",
    steps: [
      "Culture Cav1.2-expressing cells (co-expression improves gating fidelity)",
      "Whole-cell APC configuration",
      "Apply depolarising step train; record Ba²⁺ current (standard substitute)",
      "Perfuse compound series",
      "Fit IC50 and voltage-dependence",
      "Feed into CiPA in-silico pro-arrhythmia model with hERG/Nav data"
    ],
    providers: [pr("nanion", "Cav1.2 services"), pr("metrion", "CiPA panel specialist"), pr("eurofins", "Ion-channel services")],
    marketNote: "Demand tracks CiPA adoption for small molecules — steady with new regulatory emphasis.",
    capacityNote: "Ion-channel specialist scarcity applies."
  },

  {
    id: "mea-cardio",
    name: "hiPSC-CM Microelectrode Array (MEA)",
    category: "ionchannel",
    tagline: "Human stem-cell cardiomyocytes on electrodes — the pro-arrhythmia end-assay.",
    tests: ["Field-potential duration (FPD) and arrhythmia events", "Contractility proxies (impedance)", "Multi-channel integration in CiPA phase 2"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Maestro Pro (CardioExcyte)", vendor: "Axion BioSystems", role: "MEA + contractility", note: "6–48 well MEA plates" },
      { name: "CardioExcyte 96", vendor: "Nanion", role: "Impedance + MEA", note: "Combined readout" }
    ],
    consumables: ["hiPSC-derived cardiomyocytes (MatTek, CDI)", "MEA plates (single-use)", "Cardiac maintenance medium"],
    automation: "Semi-automated; MEA plates have fixed footprints limiting throughput.",
    steps: [
      "Plate hiPSC-CMs onto MEA arrays; mature 7–14 days",
      "Record baseline spontaneous field potentials",
      "Dose compound cumulatively (4–6 concentrations)",
      "Record field-potential morphology post-dose",
      "Quantify FP duration, beat rate, arrhythmogenic events (ectopic beats)",
      "Combine with ion-channel IC50s → in-silico pro-arrhythmia prediction",
      "Flag torsadogenic risk"
    ],
    providers: [pr("nanion", "hiPSC-CM MEA services"), pr("metrion", "CiPA phase-2 assays"), { name: "AnaBios", note: "Human cardiomyocyte assays", region: "US" }],
    marketNote: "CiPA phase 2/3 pushes MEA demand up — the human-cell end-assay for pro-arrhythmia.",
    capacityNote: "hiPSC-CM maturation times and cell-lot consistency are the constraint; specialist labs only."
  },

  {
    id: "ligandgated",
    name: "Ligand-Gated Ion-Channel Assays (nAChR, GABA-A, 5-HT3)",
    category: "ionchannel",
    tagline: "Neurotransmitter-gated channels — patch clamp with agonist application.",
    tests: ["Agonist/antagonist potency at ligand-gated channels", "Allosteric modulation", "Desensitisation kinetics"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "QPatch 48", vendor: "Sophion", role: "Ligand-gated APC", note: "Fast perfusion required" },
      { name: "Patchliner", vendor: "Nanion", role: "Ligand-gated workflow", note: "Rapid solution exchange" }
    ],
    consumables: ["nAChR/GABA-A expressing cells", "APC chips with fast perfusion heads", "Acetylcholine/GABA agonist stocks"],
    automation: "Ligand-gated channels are the hardest APC class — fast desensitisation demands precise perfusion.",
    steps: [
      "Culture receptor-expressing cells (e.g. α7 nAChR)",
      "Whole-cell APC configuration",
      "Apply agonist pulse to establish reference response",
      "Pre-incubate with test compound; re-apply agonist",
      "Quantify inhibition or potentiation of agonist response",
      "Fit modulator EC50/IC50",
      "Desensitisation arm: repeated agonist pulses + compound"
    ],
    providers: [pr("metrion", "Ligand-gated specialist assays"), pr("nanion", "Ligand-gated APC services"), pr("crl", "Neuro ion-channel packages")],
    marketNote: "Neuro-psychiatric pipeline revival (nAChR agonists for cognition) sustains demand.",
    capacityNote: "The scarcest ion-channel capability — fast-perfusion APC expertise exists in <5 labs globally."
  }
);
