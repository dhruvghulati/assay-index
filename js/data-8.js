// Expansion 7 — Enzyme assays, immunology extras, physchem ADME, CGT analytics, QC
ASSAYS.push(
  {
    id: "kinase-radiometric",
    name: "Radiometric Kinase Assay (33P)",
    category: "binding",
    tagline: "Gold-standard kinase phosphorylation with radiolabelled ATP.",
    tests: ["Kinase activity (phosphorylation of substrate)", "Inhibitor IC50 (ATP-competitive vs allosteric)", "Kinome selectivity panel spot-checks"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Filter-binding harvester + scintillation counter", vendor: "PerkinElmer", role: "Radiometric readout", note: "Low background" }
    ],
    consumables: ["33P-ATP radiolabel", "Kinase + peptide substrate", "Phosphocellulose filters", "Scintillation cocktail"],
    automation: "Filter-plate format automates; radioisotope licensing required.",
    steps: [
      "Incubate kinase + substrate + 33P-ATP + inhibitor series",
      "Reaction transfers 33P to substrate (phosphorylation)",
      "Bind products to phosphocellulose filters",
      "Wash away free ATP",
      "Count filter radioactivity (scintillation)",
      "Fit inhibitor IC50 vs ATP concentration",
      "Distinguish competitive vs allosteric mechanism"
    ],
    providers: [pr("eurofins", "Kinase profiling (radiometric options)"), pr("selvita", "Kinase biology"), pr("aragen", "Kinase services at India cost")],
    marketNote: "Radiometric remains the trust anchor for kinase inhibitors — orthogonal to ADP luminescence.",
    capacityNote: "Radioisotope licensing limits labs; adequate specialist capacity."
  },

  {
    id: "phosphatase-mg",
    name: "Phosphatase Assay (Malachite Green)",
    category: "binding",
    tagline: "Phosphate-release detection — the universal phosphatase and ATPase readout.",
    tests: ["Phosphatase activity (phosphate release)", "ATPase/GTPase activity (molecular motors, chaperones)", "Inhibitor dose-response"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Absorbance plate reader (620–650 nm)", vendor: "Standard", role: "Malachite-green absorbance", note: "96/384-well" }
    ],
    consumables: ["Malachite green + ammonium molybdate reagent", "Phosphate standards", "Purified phosphatase + substrate", "EGTA (low-phosphate buffers)"],
    automation: "Fully automated plate-based readout.",
    steps: [
      "Run phosphatase reaction (releases inorganic phosphate)",
      "Add malachite-green reagent (forms green complex)",
      "Incubate 15 min for colour development",
      "Read absorbance at 620–650 nm",
      "Quantify phosphate via standard curve",
      "Inhibitor arm: pre-incubate compound; fit IC50",
      "Control: no-enzyme and no-subtract blanks"
    ],
    providers: [pr("eurofins", "Phosphatase services"), pr("selvita", "Phosphatase biology"), pr("bienta", "Enzyme assay services")],
    marketNote: "Scaffold for many target classes — kinases' reverse reaction, helicases, chaperones.",
    capacityNote: "Simple and abundant."
  },

  {
    id: "hdac-assay",
    name: "HDAC / Sirtuin Assay (Fluorogenic)",
    category: "binding",
    tagline: "Epigenetic deacetylase activity — the HDAC-inhibitor screen.",
    tests: ["HDAC1–11 activity panel", "Sirtuin (SIRT1–7) activity", "Inhibitor selectivity across isoforms"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Fluorescence plate reader", vendor: "Standard", role: "Deacetylation readout", note: "360/460 nm" }
    ],
    consumables: ["Fluorogenic acetylated-peptide substrate", "Recombinant HDAC enzymes (BPS Bioscience)", "Trichostatin A (control inhibitor)", "Developer reagent (trypsin)"],
    automation: "Fully automated plate-based assay.",
    steps: [
      "Incubate HDAC enzyme + substrate + inhibitor series",
      "Deacetylation unmasks the fluorophore's lysine",
      "Add developer (trypsin releases AMC fluorophore)",
      "Read fluorescence (360/460 nm)",
      "Fit inhibitor IC50 per isoform",
      "Profile selectivity across HDAC1–11 panel"
    ],
    providers: [pr("eurofins", "HDAC profiling"), pr("selvita", "Epigenetics assays"), pr("bienta", "Enzyme panels")],
    marketNote: "Epigenetics programs (oncology, neuro) sustain HDAC-assay demand.",
    capacityNote: "Abundant; commercial kits make it accessible."
  },

  {
    id: "methyltransferase",
    name: "Methyltransferase Assay (MTase-Glo)",
    category: "binding",
    tagline: "Protein methyltransferase and DNMT activity — the epigenetic-writer screen.",
    tests: ["PRMT/SET-domain methyltransferase activity", "DNMT3A/B activity", "SAM-competitive inhibitor profiling"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Luminescence plate reader", vendor: "Standard", role: "MTase-Glo readout", note: "96/384-well" }
    ],
    consumables: ["MTase-Glo reagent (Promega)", "Recombinant methyltransferases", "SAM + peptide/protein substrates", "SAH standard curve"],
    automation: "Fully automated plate-based assay.",
    steps: [
      "Run methylation reaction (SAM → SAH conversion)",
      "MTase-Glo converts SAH to ATP (coupled enzymes)",
      "Luminescence proportional to SAH (activity)",
      "Quantify via SAH standard curve",
      "Inhibitor arm: fit IC50; test SAM-competitiveness",
      "Selectivity: run panel of PRMTs and SET-domain enzymes"
    ],
    providers: [pr("eurofins", "Methyltransferase services"), pr("selvita", "Epigenetic assays"), pr("bienta", "Enzyme panels")],
    marketNote: "PRMT inhibitors in oncology drive demand for writer-enzyme assays.",
    capacityNote: "Abundant; Promega kit standardised it."
  },

  {
    id: "gpcr-internalization",
    name: "GPCR Internalization (Imaging)",
    category: "cell",
    tagline: "Receptor trafficking readout — biased-agonism and desensitisation data.",
    tests: ["β-arrestin-mediated internalization kinetics", "Receptor recycling vs degradation", "Biased-agonist fingerprinting"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "Opera Phenix high-content imager", vendor: "Revvity", role: "Automated imaging", note: "Confocal, 96-well" },
      { name: "Tag-lite receptor labelling (LSS670)", vendor: "Cisbio", role: "Receptor tracking", note: "SNAP-tag based" }
    ],
    consumables: ["SNAP-tagged GPCR cell lines", "Fluorescent ligand (LSS670)", "Imaging plates (optical-bottom)", "Nuclei stain (Hoechst)"],
    automation: "High-content imaging automates fully; analysis pipelines (Harmony) quantify vesicle traffic.",
    steps: [
      "Express SNAP-tagged GPCR on cell surface",
      "Label surface receptor with fluorescent ligand",
      "Add agonist series; incubate (time course)",
      "Image surface vs internalised fluorescence (confocal)",
      "Quantify internalization kinetics per compound",
      "Recycling arm: washout + re-image (recovery)",
      "Compare bias fingerprint vs reference agonist"
    ],
    providers: [pr("eurofins", "GPCR profiling incl. internalization"), pr("crl", "High-content GPCR services"), pr("bienta", "Cell-based GPCR assays")],
    marketNote: "Biased agonism (G-protein vs arrestin) is a differentiator for GPCR programs — internalization data expected.",
    capacityNote: "Imaging-analysis expertise is the constraint; instruments are widely deployed."
  },

  {
    id: "chemotaxis",
    name: "Chemotaxis Assay (Transwell)",
    category: "cell",
    tagline: "Directed cell migration — inflammation and oncology mechanism readout.",
    tests: ["Chemoattractant response (dose-dependent migration)", "Inhibitor potency (anti-trafficking drugs)", "Cell-type specificity (monocytes, T cells)"],
    drugTypes: ["small-molecule", "antibody"],
    instruments: [
      { name: "Transwell plates (3–8 µm pores)", vendor: "Corning", role: "Migration chamber", note: "96-well HTS format" },
      { name: "Fluorescence plate reader / imaging", vendor: "Standard", role: "Migrated-cell quantification", note: "Dye-labelled cells" }
    ],
    consumables: ["Transwell inserts (pore-size matched)", "Chemoattractant (CCL2, CXCL12)", "Fluorescently-labelled cells", "Migration medium"],
    automation: "96-well transwell automates with plate handling; wash steps are the manual friction.",
    steps: [
      "Label cells with fluorescent dye (Calcein)",
      "Seed cells in upper chamber (insert)",
      "Add chemoattractant gradient to lower chamber",
      "Incubate 2–6 h (migration through pores)",
      "Quantify migrated cells (lower-chamber fluorescence)",
      "Inhibitor arm: pre-treat cells; fit IC50",
      "Specificity: run multiple chemoattractants (receptor selectivity)"
    ],
    providers: [pr("crl", "Chemotaxis services"), pr("eurofins", "Migration assays"), pr("aragen", "Cell-migration packages")],
    marketNote: "Anti-inflammatory and immuno-oncology (T-cell trafficking) programs use it.",
    capacityNote: "Moderate throughput; wash-step labour is the friction."
  },

  {
    id: "neutrophil-burst",
    name: "Neutrophil Oxidative Burst",
    category: "immunology",
    tagline: "Primary-neutrophil ROS response — innate-immunity function readout.",
    tests: ["Respiratory-burst activity (DHR/ROS)", "Priming and tolerance effects", "Anti-inflammatory compound potency"],
    drugTypes: ["small-molecule", "antibody"],
    instruments: [
      { name: "Fortessa flow cytometer", vendor: "BD", role: "DHR oxidation readout", note: "Per-neutrophil ROS" }
    ],
    consumables: ["Fresh human neutrophils (same-day)", "Dihydrorhodamine 123 (DHR)", "fMLP/PMA (activators)", "Histopaque density gradient"],
    automation: "Flow-based; fresh-neutrophil isolation (<6 h) limits automation.",
    steps: [
      "Isolate neutrophils from fresh blood (density gradient)",
      "Load with DHR123 (ROS-sensitive dye)",
      "Pre-treat with compound series",
      "Activate with fMLP or PMA (respiratory burst)",
      "Flow cytometry: quantify oxidised DHR per neutrophil",
      "Fit compound IC50 for burst inhibition",
      "Viability + specificity controls (monocytes excluded)"
    ],
    providers: [pr("crl", "Primary-neutrophil services"), pr("metrion", "Human-blood functional assays"), pr("bioagilytix", "Innate-immunity packages")],
    marketNote: "Innate-immunity modulators and steroid-cream alternatives need burst data.",
    capacityNote: "Fresh-cell requirement (<6 h) — very scarce capacity; same-day donor logistics."
  },

  {
    id: "platelet-aggregation",
    name: "Platelet Aggregation (Impedance)",
    category: "immunology",
    tagline: "Human platelet function — cardiovascular safety and bleeding-risk readout.",
    tests: ["Aggregation response (ADP, collagen, TRAP)", "Anti-platelet drug potency", "Bleeding-risk liability (off-target platelet activation)"],
    drugTypes: ["small-molecule", "antibody"],
    instruments: [
      { name: "Multiplate analyzer (impedance)", vendor: "Roche", role: "Whole-blood aggregation", note: "Clinical-standard" },
      { name: "Light-transmission aggregometry", vendor: "Chrono-Log", role: "PRP aggregation", note: "Gold-standard method" }
    ],
    consumables: ["Fresh human whole blood (hirudin)", "Agonists (ADP, collagen, TRAP-6)", "Impedance electrodes (single-use)", "Citrated PRP prep"],
    automation: "Semi-automated; fresh blood (<4 h) is the constraint.",
    steps: [
      "Collect fresh human blood (hirudin anticoagulant)",
      "Add compound dilution series to blood",
      "Insert impedance electrodes; establish baseline",
      "Add agonist (ADP, collagen, TRAP-6)",
      "Measure impedance change (aggregation kinetics)",
      "Fit drug IC50 for aggregation inhibition",
      "Safety arm: compound alone (off-target activation)"
    ],
    providers: [pr("metrion", "Platelet-aggregation services"), pr("crl", "Cardiovascular safety packages"), pr("eurofins", "Platelet assays")],
    marketNote: "Anti-thrombotic programs and CV-safety follow-up on any systemic drug.",
    capacityNote: "Fresh-blood (<4 h) makes this scarce — specialist haematology labs only."
  },

  {
    id: "macrophage-polarization",
    name: "Macrophage Polarization (M1/M2)",
    category: "immunology",
    tagline: "Tumor-microenvironment modulation — M1/M2 skewing readout.",
    tests: ["M1 marker induction (CD80, iNOS, IL-12)", "M2 marker suppression (CD163, Arg1, IL-10)", "Compound re-polarisation potency"],
    drugTypes: ["antibody", "small-molecule"],
    instruments: [
      { name: "Fortessa flow cytometer", vendor: "BD", role: "Surface-marker phenotyping", note: "12-colour" },
      { name: "Luminex cytokine readout", vendor: "Luminex", role: "Polarisation cytokines", note: "IL-12, IL-10" }
    ],
    consumables: ["Monocyte-derived macrophages (MDM)", "GM-CSF / M-CSF (differentiation)", "LPS + IFNγ (M1 polariser)", "Flow antibody panel"],
    automation: "Flow-based with plate loader; macrophage differentiation (7 days) is the lead time.",
    steps: [
      "Differentiate monocytes to macrophages (7 days, GM-CSF or M-CSF)",
      "Treat with compound + polarisation stimulus (LPS/IFNγ for M1)",
      "Incubate 24–48 h",
      "Stain surface markers (CD80/CD86 vs CD163/CD206)",
      "Flow cytometry: quantify M1/M2 fractions",
      "Cytokines in supernatant (Luminex: IL-12, IL-10)",
      "Report re-polarisation index per compound"
    ],
    providers: [pr("crl", "Macrophage-polarization services"), pr("bioagilytix", "Myeloid assays"), pr("eurofins", "Macrophage packages")],
    marketNote: "Solid-tumor immunotherapy (TAM reprogramming) — the myeloid-IO wave.",
    capacityNote: "7-day differentiation + flow expertise; moderate scarcity."
  },

  {
    id: "mlr",
    name: "Mixed Lymphocyte Reaction (MLR)",
    category: "immunology",
    tagline: "T-cell allo-responsiveness — the immunosuppressant and tolerogenic readout.",
    tests: ["Donor-pair T-cell proliferation (allogeneic)", "Immunosuppressant IC50 (tacrolimus-type)", "Tolerogenic-therapy efficacy (regulatory)"],
    drugTypes: ["antibody", "small-molecule", "peptide"],
    instruments: [
      { name: "CFSE flow-based proliferation", vendor: "BD Fortessa", role: "Division tracking", note: "Standard MLR readout" }
    ],
    consumables: ["Donor PBMC pairs (allogeneic, HLA-mismatched)", "CFSE dye", "Tacrolimus (control)", "96-well round-bottom plates"],
    automation: "Flow-based; donor-pair logistics (2 donors per assay) limit scale.",
    steps: [
      "Label responder PBMCs (donor A) with CFSE",
      "Irradiate stimulator PBMCs (donor B, HLA-mismatched)",
      "Co-culture A + B with compound series",
      "Incubate 5–7 days (allo-proliferation)",
      "Flow: quantify CFSE dilution (division index)",
      "Fit immunosuppressant IC50",
      "Tolerogenic arm: measure regulatory markers (FOXP3 induction)"
    ],
    providers: [pr("crl", "MLR services"), pr("bioagilytix", "Cell-based immunology"), pr("eurofins", "MLR packages")],
    marketNote: "Transplantation and autoimmune programs — tolerogenic-therapy readout.",
    capacityNote: "Donor-pair requirement + 7-day culture; moderate scarcity."
  },

  {
    id: "nk-cytotoxicity",
    name: "NK-Cell Cytotoxicity",
    category: "immunology",
    tagline: "Natural-killer function — primary-cell killing assay (ADCC's parent).",
    tests: ["NK killing of target cells (LDH/flow)", "ADCC with primary NK effectors", "NK-activation compounds (IO)"],
    drugTypes: ["antibody", "adc"],
    instruments: [
      { name: "Fortessa flow cytometer", vendor: "BD", role: "Killing + NK phenotyping", note: "CD56/CD16 gating" },
      { name: "LDH release readout", vendor: "Standard", role: "Cytotoxicity endpoint", note: "Plate-based" }
    ],
    consumables: ["Fresh NK cells (donor-derived)", "Target cells (K562 or antigen-positive)", "Anti-CD16 blocking Ab (specificity control)", "LDH substrate"],
    automation: "Flow-based; fresh-NK isolation limits throughput.",
    steps: [
      "Isolate NK cells from fresh donor blood (CD56 selection)",
      "Label target cells (CFSE or calcein)",
      "Co-culture NK + targets (E:T ratios 1:1 to 20:1)",
      "Include antibody (ADCC arm) or compound series",
      "Incubate 4 h; read killing (LDH or flow)",
      "Specific lysis = experimental − spontaneous",
      "Report NK activity + ADCC enhancement"
    ],
    providers: [pr("bioagilytix", "NK-cell assays"), pr("crl", "Primary-cell killing services"), pr("wuxi", "NK cytotoxicity at scale")],
    marketNote: "NK-cell engagers and ADCC therapeutics — the primary-cell gold standard.",
    capacityNote: "Fresh-NK logistics; reporter-cell assays replaced it for screening (primary remains for confirmation)."
  },

  {
    id: "receptor-occupancy",
    name: "Receptor Occupancy (Flow Cytometry)",
    category: "immunology",
    tagline: "In-vivo drug-target engagement — the clinical-trial PD readout.",
    tests: ["% receptor occupied by drug (ex vivo)", "Occupancy-time profile (PK/PD link)", "Dose for target occupancy (FIH design)"],
    drugTypes: ["antibody", "adc"],
    instruments: [
      { name: "Fortessa flow cytometer", vendor: "BD", role: "Occupancy readout", note: "Fluorescent anti-drug" }
    ],
    consumables: ["Fluorescent anti-drug antibody (custom)", "Whole blood (patient, time points)", "Competitive vs non-competitive detection formats", "Counting beads"],
    automation: "Flow-based; clinical-sample logistics dominate.",
    steps: [
      "Collect patient blood at PK time points (post-dose)",
      "Stain with fluorescent anti-drug (detects free receptor)",
      "Parallel arm: saturating drug (total receptor reference)",
      "Flow: quantify free vs total receptor per cell",
      "% occupancy = (total − free)/total",
      "Plot occupancy vs time + vs drug concentration (PK/PD)",
      "Report dose achieving target occupancy (e.g., 90%)"
    ],
    providers: [pr("crl", "Receptor-occupancy clinical services"), pr("bioagilytix", "RO assays for trials"), pr("wuxi", "RO at scale")],
    marketNote: "Every antibody trial needs occupancy data — FIH dosing justification.",
    capacityNote: "Clinical-lab (GCLP) requirement; CRO slots book out during trials."
  },

  {
    id: "complement-hemolytic",
    name: "Complement Hemolytic Assay (CH50)",
    category: "immunology",
    tagline: "Total complement activity — the classical-pathway function readout.",
    tests: ["CH50 (complement activity units)", "AH50 (alternative pathway)", "Complement-inhibitor potency (anti-C5 drugs)"],
    drugTypes: ["antibody", "small-molecule"],
    instruments: [
      { name: "Spectrophotometer (541 nm)", vendor: "Standard", role: "Hemolysis readout", note: "Plate-based" }
    ],
    consumables: ["Sheep RBCs (sensitised with anti-SRBC)", "Human serum (complement source)", "Veronal-buffered saline", "Anti-C5 (eculizumab control)"],
    automation: "Plate-based; RBC preparation is semi-manual.",
    steps: [
      "Sensitise sheep RBCs with anti-sheep antibody (classical activation)",
      "Mix serial serum dilutions + sensitised RBCs",
      "Incubate 30–60 min (complement lyses RBCs)",
      "Read hemolysis (541 nm supernatant)",
      "Plot % lysis vs serum dilution → CH50 (50% lysis)",
      "Inhibitor arm: pre-incubate serum with anti-complement compound; right-shift CH50",
      "AH50: rabbit RBCs (alternative pathway) parallel assay"
    ],
    providers: [pr("crl", "Complement-assay services"), pr("eurofins", "Complement packages"), pr("bioagilytix", "Complement assays")],
    marketNote: "Complement inhibitors (C5, C3) in PNH/aHUS sustain demand; complement-activation safety also uses it.",
    capacityNote: "Standard haematology capability; abundant."
  },

  {
    id: "mastcell-degranulation",
    name: "Mast-Cell Degranulation (β-Hexosaminidase)",
    category: "immunology",
    tagline: "Allergic-response readout — the anaphylaxis-risk screen.",
    tests: ["Mast-cell degranulation (β-hexosaminidase release)", "IgE-mediated activation (passive sensitisation)", "Anti-allergic compound potency"],
    drugTypes: ["small-molecule", "antibody"],
    instruments: [
      { name: "Absorbance plate reader (405 nm)", vendor: "Standard", role: "β-hexosaminidase substrate readout", note: "96-well" }
    ],
    consumables: ["RBL-2H3 or primary mast cells", "p-Nitrophenyl-N-acetyl-β-D-glucosaminide (substrate)", "Anti-DNP IgE (sensitiser)", "DNP-HSA (trigger)"],
    automation: "Fully automated plate-based assay.",
    steps: [
      "Sensitise mast cells with IgE (overnight)",
      "Add compound series (pre-treatment)",
      "Trigger degranulation with antigen (DNP-HSA)",
      "Incubate 1 h; collect supernatant",
      "Add β-hexosaminidase substrate (colour develops)",
      "Read absorbance (405 nm) = degranulation %",
      "Fit IC50 for degranulation inhibition (anti-allergic)"
    ],
    providers: [pr("eurofins", "Mast-cell assays"), pr("crl", "Allergy packages"), pr("bienta", "Cell-based allergy assays")],
    marketNote: "Allergy and anaphylaxis-risk assessment — biologics need it for infusion-reaction prediction.",
    capacityNote: "RBL-2H3 line is easy; primary mast cells (CD34-derived) are specialist."
  },

  {
    id: "hemolysis",
    name: "Hemolysis Assay (Human RBC)",
    category: "safety",
    tagline: "Red-blood-cell membrane damage — the formulation and compound safety check.",
    tests: ["Hemolysis % (RBC membrane damage)", "Complement-mediated hemolysis (biologics)", "Excipient/formulation risk"],
    drugTypes: ["small-molecule", "antibody", "peptide"],
    instruments: [
      { name: "Spectrophotometer (541 nm)", vendor: "Standard", role: "Free-hemoglobin readout", note: "Plate-based" }
    ],
    consumables: ["Fresh human RBCs (pooled donors)", "Positive control (Triton X-100)", "Negative control (PBS)", "Compound formulations"],
    automation: "Fully automated plate-based assay.",
    steps: [
      "Incubate RBCs with compound concentration series (37°C, 1 h)",
      "Include Triton (100% lysis) and PBS (0%) controls",
      "Centrifuge; collect supernatant",
      "Read absorbance at 541 nm (free hemoglobin)",
      "% hemolysis = (sample − PBS)/(Triton − PBS)",
      "Flag compounds above 5–10% hemolysis threshold",
      "Formulation arm: test excipient-induced hemolysis"
    ],
    providers: [pr("aragen", "Hemolysis services"), pr("syngene", "Hemolysis at India cost"), pr("eurofins", "Hemolysis packages")],
    marketNote: "IV formulation and peptide/oligo safety — cheap assay with outsized regulatory value.",
    capacityNote: "Abundant; fresh-RBC supply is routine."
  },

  {
    id: "nanodsf",
    name: "nanoDSF (Thermal Stability)",
    category: "binding",
    tagline: "Label-free fluorescence thermal unfolding — formulation-grade stability.",
    tests: ["Melting temperature (Tm) and Tonset", "Aggregation onset (light scattering at 350 nm)", "Excipient/formulation ranking"],
    drugTypes: ["antibody", "peptide", "cgt"],
    instruments: [
      { name: "NanoTemper Prometheus NT.48", vendor: "NanoTemper", role: "nanoDSF reader", note: "Capillary-based, 48 samples" }
    ],
    consumables: ["NanoDSF capillaries (glass, single-use)", "Protein samples (0.05–1 mg/mL)", "Formulation buffer panel"],
    automation: "Capillary loading semi-automated; analysis automated.",
    steps: [
      "Load protein samples into glass capillaries",
      "Ramp temperature 20–95°C (1°C/min)",
      "Tryptophan fluorescence shifts with unfolding (350/330 nm ratio)",
      "Derive Tm (melting) and Tonset (aggregation onset)",
      "Backscattering (350 nm) detects aggregation in same run",
      "Rank formulations by Tonset + Tm",
      "Compare to DSF plate-based results (orthogonal check)"
    ],
    providers: [pr("bienta", "nanoDSF stability services"), pr("bioagilytix", "Thermal-stability packages"), pr("eurofins", "nanoDSF")],
    marketNote: "Biologics formulation and developability — fast and label-free.",
    capacityNote: "Capillary cost per sample; 48-capacity instruments widely deployed."
  },

  {
    id: "dsc-calorimetry",
    name: "Differential Scanning Calorimetry (DSC)",
    category: "binding",
    tagline: "Direct thermodynamic stability — the higher-standard Tm measurement.",
    tests: ["Thermal transition temperatures (Tm1, Tm2)", "Unfolding enthalpy (ΔH)", "Ligand-stabilisation effects (Tm shift)"],
    drugTypes: ["antibody", "peptide", "small-molecule"],
    instruments: [
      { name: "MicroCal VP-DSC / PEAQ-DSC", vendor: "Malvern Panalytical", role: "Calorimetric unfolding", note: "Gold-standard Tm" }
    ],
    consumables: ["DSC cells (cleaned between runs)", "Protein samples (0.2–2 mg/mL)", "Matched buffer (dialysed)"],
    automation: "Automated cell loading on PEAQ-DSC; throughput ~6 samples/day.",
    steps: [
      "Dialyse protein into matched buffer (identical reference)",
      "Load sample + reference into DSC cells",
      "Ramp temperature 10–100°C (1°C/min)",
      "Measure heat-capacity difference (sample vs reference)",
      "Thermogram shows unfolding transitions (Tm per domain)",
      "Integrate peaks → unfolding enthalpy",
      "Ligand arm: add compound; quantify Tm shift (binding stabilisation)"
    ],
    providers: [pr("bioagilytix", "DSC services"), pr("crl", "Calorimetry packages"), pr("bienta", "Thermal-stability services")],
    marketNote: "Reference method for Tm when DSF/nanoDSF disagree — regulatory submissions value it.",
    capacityNote: "Low throughput (6/day) — used as confirmation, not screen."
  },

  {
    id: "kinetic-solubility",
    name: "Kinetic Solubility (LC-MS/MS)",
    category: "adme",
    tagline: "Aqueous solubility from DMSO stock — the earliest developability filter.",
    tests: ["Kinetic solubility (µg/mL, PBS pH 7.4)", "Thermodynamic solubility (shake-flask, orthogonal)", "Solubility-potency risk ratio (LiPEA)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "LC-MS/MS (rapid-injection mode)", vendor: "Waters/Thermo", role: "Saturated-concentration readout", note: "96-well" },
      { name: "Chromatography-free (UV/chemiluminescence)", vendor: "Nanostream", role: "Alternative readout", note: "Optional" }
    ],
    consumables: ["Test compounds (10 mM DMSO stocks)", "PBS buffer (pH 7.4, 6.5)", "Filtration plates (0.45 µm)", "LC-MS calibration standards"],
    automation: "Fully automated (Hamilton + LC-MS queue).",
    steps: [
      "Dilute compound stock into aqueous buffer (final 1–2% DMSO)",
      "Incubate 1–24 h (equilibration)",
      "Filter or centrifuge (remove precipitate)",
      "Quantify dissolved compound (LC-MS/MS)",
      "Report kinetic solubility (µg/mL or µM)",
      "Compare to potency (IC50) → solubility-limited flag",
      "Thermodynamic arm: shake-flask 24 h (slower, reference)"
    ],
    providers: [pr("aragen", "Solubility packages"), pr("syngene", "Solubility at India cost"), pr("enamine", "Solubility data for building blocks"), pr("eurofins", "Physchem services")],
    marketNote: "The first developability filter every small-molecule program runs — thousands of compounds weekly.",
    capacityNote: "Highly abundant; LC-MS time is the cost."
  },

  {
    id: "logd-shakeflask",
    name: "LogD / LogP (Shake-Flask)",
    category: "adme",
    tagline: "Lipophilicity measurement — the PK-property cornerstone.",
    tests: ["LogD7.4 (octanol-buffer distribution)", "LogP (neutral compound)", "pH-profile of LogD (ionisation effect)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "HPLC-UV (direct injection)", vendor: "Standard", role: "Phase-concentration quantification", note: "Shake-flask readout" }
    ],
    consumables: ["n-Octanol (pre-saturated)", "Buffer at pH 7.4 (pre-saturated with octanol)", "Centrifuge tubes (glass)", "UV-transparent cuvettes"],
    automation: "Semi-automated; phase separation is the manual step.",
    steps: [
      "Pre-saturate octanol and buffer (mutual saturation)",
      "Add compound to octanol + buffer mixture",
      "Shake 1–24 h (equilibrium partitioning)",
      "Centrifuge; separate phases cleanly",
      "Quantify compound in each phase (HPLC-UV)",
      "LogD = log([octanol]/[buffer])",
      "pH-profile arm: repeat at pH 2, 7.4, 12"
    ],
    providers: [pr("eurofins", "LogD services"), pr("aragen", "Physchem packages"), pr("syngene", "LogD at India cost")],
    marketNote: "Fundamental property for PK prediction — every candidate needs LogD.",
    capacityNote: "Abundant; HPLC-based, simple workflow."
  },

  {
    id: "pka-determination",
    name: "pKa Determination (Potentiometric)",
    category: "adme",
    tagline: "Ionisation constant measurement — the formulation and PK driver.",
    tests: ["pKa (acidic and basic sites)", "UV-metric pKa (chromophoric compounds)", "Micro-pKa (tautomeric systems)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Sirius T3 (potentiometric)", vendor: "Sirius Analytical", role: "Gold-standard pKa", note: "Specialised" },
      { name: "UV-metric pKa (D-PAS)", vendor: "Sirius", role: "High-throughput", note: "Plate-based" }
    ],
    consumables: ["Compound (mg quantities, >95% pure)", "Acid/base titrants (standardised)", "Background electrolytes (0.15 M KCl)"],
    automation: "Automated titration; throughput ~10–20 compounds/day.",
    steps: [
      "Dissolve compound (co-solvent if insoluble)",
      "Titrate acid-to-base (or reverse) with standardised titrants",
      "Measure pH continuously (potentiometric)",
      "Fit titration curve → pKa (with co-solvent extrapolation)",
      "UV-metric arm: spectrophotometric titration (chromophore pH shift)",
      "Report pKa(s) + ionisation fractions at pH 7.4",
      "Input to LogD prediction + formulation design"
    ],
    providers: [pr("eurofins", "pKa services"), pr("aragen", "Physchem packages"), pr("syngene", "pKa at India cost")],
    marketNote: "Formulation (salt selection) and PK prediction both need pKa — routine per candidate.",
    capacityNote: "Sirius instruments are specialised but standard at physchem labs."
  },

  {
    id: "solution-stability",
    name: "Chemical Stability (Solution)",
    category: "adme",
    tagline: "Compound degradation in buffer — the assay-media and dosing-solution check.",
    tests: ["Half-life in assay buffer (pH 7.4, 37°C)", "Dosing-solution stability (formulation)", "Autosampler stability (bioanalysis support)"],
    drugTypes: ["small-molecule", "peptide"],
    instruments: [
      { name: "LC-MS/MS quantification", vendor: "Waters/Thermo", role: "Parent-remaining readout", note: "Time-course" }
    ],
    consumables: ["Assay buffers (pH series)", "Compound stocks", "LC-MS standards + internal standard", "Autosampler vials"],
    automation: "Fully automated; LC-MS queue handles time-course samples.",
    steps: [
      "Dissolve compound in buffer (pH 7.4, 37°C)",
      "Sample at time points (0, 1, 4, 8, 24 h)",
      "Quench aliquots (cold acetonitrile + internal standard)",
      "LC-MS/MS: quantify remaining parent",
      "Fit first-order decay → half-life",
      "Flag unstable compounds (<2 h) for assay-design correction",
      "Peptide arm: include protease inhibitors to isolate chemical degradation"
    ],
    providers: [pr("aragen", "Stability services"), pr("syngene", "Solution-stability packages"), pr("eurofins", "Compound-stability services")],
    marketNote: "Every assay result depends on compound stability in the assay buffer — hidden but essential.",
    capacityNote: "Abundant; bundled with physchem panels."
  },

  {
    id: "brain-binding",
    name: "Brain-Tissue Binding",
    category: "adme",
    tagline: "Non-specific binding in brain homogenate — CNS PD-readout correction.",
    tests: ["Brain-tissue Kp,uu (unbound fraction)", "Brain-to-plasma ratio (total)", "CNS-drug penetration triage"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "Equilibrium dialysis (RED inserts)", vendor: "Thermo Fisher", role: "Binding measurement", note: "96-well" }
    ],
    consumables: ["Rat or human brain homogenate", "RED dialysis membranes (8 kDa)", "Compound + LC-MS/MS quantification", "Midazolam (control, high binder)"],
    automation: "RED-plate automation; brain-homogenate prep is the manual step.",
    steps: [
      "Prepare brain homogenate (species-matched to PK study)",
      "Equilibrate compound between homogenate and buffer (RED insert)",
      "Incubate 4–6 h (37°C)",
      "Measure compound in buffer side (unbound) and tissue side (total)",
      "Calculate unbound fraction (fu,brain) via mass balance",
      "Combine with brain-to-plasma ratio → unbound Kp,uu",
      "Rank CNS candidates by unbound exposure (not total)"
    ],
    providers: [pr("eurofins", "Brain-binding services"), pr("crl", "CNS-PK packages"), pr("aragen", "Tissue-binding services")],
    marketNote: "CNS programs — the unbound-brain-exposure revolution (Kp,uu) changed candidate selection.",
    capacityNote: "Homogenate prep limits scale; adequate specialist capacity."
  },

  {
    id: "cyp-phenotyping",
    name: "CYP Reaction Phenotyping",
    category: "adme",
    tagline: "Which enzyme clears the compound — the CRO workhorse for metabolite attribution.",
    tests: ["CYP1A2/2C9/2C19/2D6/3A4 contribution", "Non-CYP clearance (UGT, esterases)", "Metabolite-pathway attribution (LC-MS)"],
    drugTypes: ["small-molecule"],
    instruments: [
      { name: "LC-MS/MS (metabolite quantification)", vendor: "Waters/Thermo", role: "Pathway readout", note: "Time-course" }
    ],
    consumables: ["Recombinant CYP isoforms (Supersomes)", "Isoform-specific inhibitors (furafylline, sulfaphenazole)", "Human liver microsomes + NADPH", "LC-MS standards"],
    automation: "Automated incubation + LC-MS queue.",
    steps: [
      "Incubate compound with individual recombinant CYPs (each isoform)",
      "Parallel arm: specific-chemical-inhibitor panel in HLM",
      "Monitor parent depletion (LC-MS/MS time-course)",
      "Attribute % clearance per isoform (recombinant + inhibitor convergent)",
      "Correlate metabolite formation with isoform (LC-MS identity)",
      "Flag polymorphic enzymes (2D6, 2C19) for clinical DDI risk",
      "Report clearance-pathway pie chart"
    ],
    providers: [pr("eurofins", "Phenotyping services"), pr("crl", "Reaction phenotyping"), pr("aragen", "ADME packages"), pr("syngene", "ADME at India cost")],
    marketNote: "Regulatory expectation (ICH M12) — every NCE needs reaction phenotyping.",
    capacityNote: "Abundant; recombinant enzymes are commercial."
  },

  {
    id: "hcp-elisa",
    name: "Residual Host-Cell Protein (HCP ELISA)",
    category: "qc",
    tagline: "Process-related impurity quantification — the biologics release gate.",
    tests: ["Residual HCP (ng/mg product, ELISA)", "HCP coverage assessment (anti-HCP antibody panel)", "Process-step HCP clearance (downstream tracking)"],
    drugTypes: ["antibody", "adc", "cgt"],
    instruments: [
      { name: "ELISA plate reader (450 nm)", vendor: "Standard", role: "HCP sandwich ELISA", note: "96-well" },
      { name: "LC-MS/MS (orthogonal HCP)", vendor: "Thermo", role: "Individual-HCP identification", note: "Advanced tier" }
    ],
    consumables: ["HCP ELISA kit (cell-line specific, e.g., CHO)", "HCP standards + control antibody", "TMB substrate", "Sample dilution buffer"],
    automation: "Fully automated ELISA; LC-MS orthogonal arm is per-sample.",
    steps: [
      "Capture HCP with anti-HCP antibody (plate-coated)",
      "Add process-sample (product matrix, diluted)",
      "Detect with second anti-HCP + enzyme conjugate",
      "Read absorbance (450 nm) vs HCP standard curve",
      "Report ng HCP per mg product (spec typically <100 ng/mg)",
      "Coverage arm: assess kit's anti-HCP panel (anti-CHO coverage assays)",
      "LC-MS orthogonal: identify individual HCPs (top offenders)"
    ],
    providers: [pr("lonza", "HCP release testing"), pr("wuxi", "HCP at scale"), pr("catalent", "HCP analytics"), pr("bioagilytix", "HCP services")],
    marketNote: "Every biologics batch needs HCP — the #1 process-impurity assay.",
    capacityNote: "Cell-line-specific kits are the variable; generic CHO kits are abundant."
  },

  {
    id: "residual-proteinA",
    name: "Residual Protein A (HTRF/ELISA)",
    category: "qc",
    tagline: "Affinity-resin leachate quantification — the purification-process impurity.",
    tests: ["Residual Protein A (ppm in product)", "Leachate kinetics (column aging)", "Process-clearance verification"],
    drugTypes: ["antibody", "adc"],
    instruments: [
      { name: "HTRF reader (PHERAstar)", vendor: "BMG", role: "TR-FRET readout", note: "High sensitivity" },
      { name: "ELISA plate reader (alternative)", vendor: "Standard", role: "Sandwich ELISA", note: "Traditional" }
    ],
    consumables: ["Anti-Protein A capture/detection antibodies", "Protein A standards (recombinant)", "Product matrix (for standard-matrix match)"],
    automation: "Fully automated plate-based assay.",
    steps: [
      "Capture Protein A from product sample (anti-Protein A plate)",
      "Detect with labelled second antibody (HTRF or ELISA)",
      "Read signal vs Protein A standard curve (matrix-matched)",
      "Report ppm Protein A per mg product (spec <5 ppm typical)",
      "Process arm: track leachate across column-cycles (aging)",
      "Clearance arm: spike-and-recovery through polishing steps"
    ],
    providers: [pr("lonza", "Protein A release testing"), pr("wuxi", "Residual impurities at scale"), pr("catalent", "Process-impurity testing")],
    marketNote: "Every Protein-A-purified antibody needs this — release-grade impurity assay.",
    capacityNote: "Abundant; kits commercial (Repligen, Cygnus)."
  },

  {
    id: "aav-empty-full",
    name: "AAV Empty/Full Capsid (CDMS)",
    category: "cgt",
    tagline: "Charge-detection mass spec — the empty-vs-full capsid QC breakthrough.",
    tests: ["Empty/full capsid ratio", "Genome-packaging efficiency", "Capsid-charge heterogeneity (impurities)"],
    drugTypes: ["cgt"],
    instruments: [
      { name: "Charge-detection MS (ExD cell)", vendor: "Thermo (custom)", role: "CDMS of intact capsids", note: "Specialised" },
      { name: "SEC-MALS + UV ratio (orthogonal)", vendor: "Wyatt", role: "Alternative empty/full", note: "Standard method" }
    ],
    consumables: ["Purified AAV capsids (intact)", "Volatile buffers (ammonium acetate)", "SEC columns (large-pore)", "CDMS calibration standards"],
    automation: "Emerging — CDMS is manual-per-sample; SEC-MALS automates.",
    steps: [
      "Purify AAV (intact capsid preparation)",
      "CDMS: ionise intact capsids (native spray)",
      "Measure mass + charge per capsid (direct detection)",
      "Full capsid (higher mass) vs empty (lower mass) histogram",
      "Calculate empty/full ratio",
      "Orthogonal SEC-MALS: UV 260/280 ratio (genome-containing)",
      "Report packaging efficiency per batch (spec: >30–50% full typical)"
    ],
    providers: [pr("lonza", "AAV analytics"), pr("catalent", "AAV QC"), { name: "Vironova", note: "Specialist AAV-analytics CRO", region: "SE" }],
    marketNote: "Empty capsids are the #1 AAV-manufacturing yield problem — the assay is on every CDMO's wishlist.",
    capacityNote: "CDMS instruments are rare (research-grade) — specialist labs only; SEC-MALS alternative is more common."
  },

  {
    id: "tcid50-infectious",
    name: "Infectious Titer (TCID50)",
    category: "cgt",
    tagline: "Viral infectivity — the cell-based potency assay for gene-therapy vectors.",
    tests: ["Infectious units (TCID50/mL)", "Physical-to-infectious ratio (P:I)", "Batch-to-batch potency consistency"],
    drugTypes: ["cgt"],
    instruments: [
      { name: "Microscope + plate reader", vendor: "Standard", role: "Cytopathic-effect counting", note: "Per-cell-line" }
    ],
    consumables: ["Permissive cell line (e.g., HEK293, or target-cell for AAV)", "Serial-dilution plates", "TCID50 calculation software", "Anti-AAV rep/cap antibodies (staining arm)"],
    automation: "Semi-automated (imaging); 10-day culture for lentivirus is the lead time.",
    steps: [
      "Prepare serial dilutions of viral vector",
      "Inoculate permissive cells (96-well, 8 replicates per dilution)",
      "Incubate 5–14 days (viral replication + cytopathic effect)",
      "Score wells positive/negative (infection)",
      "Reed-Muench calculation → TCID50/mL",
      "Infectious units convert to vector genomes ratio (P:I)",
      "Batch consistency: compare to reference lot"
    ],
    providers: [pr("lonza", "Infectious-titer testing"), pr("catalent", "Viral-vector QC"), pr("crl", "TCID50 services")],
    marketNote: "Infectious titer is the functional potency spec for viral vectors — regulatory expectation.",
    capacityNote: "Long culture time (5–14 days) is the constraint; specialist virology labs only."
  },

  {
    id: "p24-titer",
    name: "Lentiviral Titer (p24 ELISA)",
    category: "cgt",
    tagline: "Lentiviral-vector quantification — p24 capsid ELISA + RT activity.",
    tests: ["p24 capsid (ng/mL → transducing units)", "Reverse-transcriptase activity (orthogonal)", "Functional titer (transduction, cell-based)"],
    drugTypes: ["cgt"],
    instruments: [
      { name: "p24 ELISA (plate reader 450 nm)", vendor: "Standard", role: "Capsid quantification", note: "Fast" },
      { name: "qPCR for integrated copies", vendor: "Standard", role: "Functional titer", note: "Transduction-based" }
    ],
    consumables: ["p24 capture ELISA kit (lentivirus-specific)", "Cell line for functional titer (HEK293T)", "qPCR primers (vector-specific)", "DNase (remove plasmid contamination)"],
    automation: "ELISA automates; functional titer needs 72-h culture.",
    steps: [
      "Run p24 sandwich ELISA on vector prep (capture + detection)",
      "Quantify p24 (ng/mL) via standard curve",
      "Convert p24 to physical particles (formula)",
      "Functional arm: transduce HEK293T with dilution series",
      "72 h; quantify integrated copies (qPCR)",
      "Calculate TU/mL (functional titer)",
      "Report physical (p24) + functional (TU) titer pair"
    ],
    providers: [pr("lonza", "Lentiviral analytics"), pr("catalent", "LV-vector QC"), pr("crl", "p24 services")],
    marketNote: "CAR-T (lentiviral) manufacturing — every batch needs p24 + functional titer.",
    capacityNote: "ELISA is simple; functional-titer cell culture adds lead time (3 days)."
  },

  {
    id: "vector-copy-number",
    name: "Vector Copy Number (VCN, qPCR)",
    category: "cgt",
    tagline: "Integrated-vector copies per cell — the insertional-mutagenesis safety gate.",
    tests: ["VCN per genome (qPCR)", "Insertion-site distribution (integration-site NGS)", "Clonal dominance (top-site fraction)"],
    drugTypes: ["cgt"],
    instruments: [
      { name: "QuantStudio qPCR", vendor: "Thermo Fisher", role: "VCN quantification", note: "ddPCR alternative" },
      { name: "Integration-site NGS (MiSeq)", vendor: "Illumina", role: "Insertion mapping", note: "LAM-PCR + NGS" }
    ],
    consumables: ["qPCR probes (vector-specific e.g., WPRE)", "Single-copy gene reference (albumin)", "Genomic DNA extraction kit", "LAM-PCR primers (integration arm)"],
    automation: "qPCR automates; integration-site NGS is bespoke-per-sample.",
    steps: [
      "Extract genomic DNA from cell product (batch)",
      "qPCR: vector-specific target (WPRE or promoter) vs single-copy gene",
      "Calculate VCN = vector copies per genome (spec <5 typical)",
      "Integration-site arm: LAM-PCR + NGS (map insertion loci)",
      "Analyse insertion-distribution (near-gene-of-interest = risk)",
      "Clonal-dominance: quantify top-site fraction (spec: no site >30%)",
      "Release report: VCN + integration-site summary"
    ],
    providers: [pr("lonza", "VCN release testing"), pr("catalent", "Insertion-site analytics"), pr("crl", "VCN services")],
    marketNote: "Insertional mutagenesis (SCID-trial legacy) — the regulatory safety gate for integrating vectors.",
    capacityNote: "qPCR is routine; integration-site NGS is specialist (few labs)."
  },

  {
    id: "crispr-offtarget-ngs",
    name: "CRISPR Off-Target NGS (GUIDE-seq)",
    category: "genomics",
    tagline: "Genome-wide off-target editing — the gene-editing safety deep-dive.",
    tests: ["Unbiased off-target site discovery (GUIDE-seq)", "Off-target editing frequency (amplicon NGS)", "Guide-RNA redesign risk assessment"],
    drugTypes: ["cgt", "oligo"],
    instruments: [
      { name: "NovaSeq (GUIDE-seq library)", vendor: "Illumina", role: "Genome-wide discovery", note: "Deep sequencing" },
      { name: "MiSeq (amplicon off-target)", vendor: "Illumina", role: "Quantification", note: "Per-site" }
    ],
    consumables: ["dsODN tag (GUIDE-seq integration probe)", "Transfection reagents", "Amplicon primers (off-target sites)", "NGS library kits"],
    automation: "Library prep automates; analysis pipelines are the value (CRISPResso, GUIDE-seq).",
    steps: [
      "Deliver dsODN tag + editing machinery to cells (tag integrates at DSBs)",
      "Allow editing (48 h)",
      "Extract DNA; sequence tag-flanking regions (GUIDE-seq library)",
      "Map off-target DSB sites genome-wide (discovery)",
      "Quantify each site's editing rate (amplicon NGS)",
      "Assess risk: near-gene off-sites, tumour-suppressor disruption",
      "Guide-redesign arm: compare guides for off-target profile"
    ],
    providers: [pr("eurofins", "Off-target NGS services"), pr("lonza", "Editing-safety analytics"), pr("crl", "Genome-editing QC")],
    marketNote: "FDA and EMA expect off-target data for editing programs — GUIDE-seq is the standard discovery method.",
    capacityNote: "Specialist capability; few labs run GUIDE-seq routinely (discovery is expert work)."
  },

  {
    id: "sterility-test",
    name: "Sterility Test (Pharmacopoeial)",
    category: "qc",
    tagline: "The 14-day direct-inoculation sterility assay — GMP batch release.",
    tests: ["Sterility (direct inoculation, USP <71>)", "Rapid sterility (BacT/ALERT, 7-day)", "Bioburden pre-screen (bioburden-trended lots)"],
    drugTypes: ["small-molecule", "antibody", "adc", "cgt", "peptide"],
    instruments: [
      { name: "BacT/ALERT microbial-detection system", vendor: "bioMérieux", role: "Rapid sterility", note: "7-day vs 14-day" },
      { name: "Incubators + thioglycollate/Sabouraud media", vendor: "Standard", role: "Direct inoculation", note: "USP <71> method" }
    ],
    consumables: ["Fluid thioglycollate medium (anaerobes)", "Soybean-casein digest medium (aerobes/fungi)", "BacT/ALERT bottles (aerobic + anaerobic)", "Membrane-filtration units (0.22 µm)"],
    automation: "BacT/ALERT automates detection; USP <71> direct inoculation is operator-driven.",
    steps: [
      "Filter or directly inoculate product into media bottles",
      "Incubate thioglycollate (30–35°C, anaerobe) + Sabouraud (20–25°C, fungi)",
      "Monitor 14 days (or 7 days for rapid method)",
      "Visual + instrumental turbidity detection (growth = fail)",
      "Any growth → identify organism (sequencing) + investigate (OOS)",
      "Rapid arm: BacT/ALERT CO₂ detection (colour change)",
      "Release report: pass/fail per lot"
    ],
    providers: [pr("lonza", "Sterility release testing"), pr("catalent", "Sterility GMP"), pr("crl", "Sterility testing")],
    marketNote: "Every sterile product batch needs sterility — non-negotiable GMP release assay.",
    capacityNote: "Abundant but scheduling (14-day incubation) adds batch-release lead time."
  },

  {
    id: "peptide-disulfide",
    name: "Peptide Disulfide Mapping",
    category: "peptide",
    tagline: "Disulfide-pairing verification — the conformational-identity assay for cysteine-rich peptides.",
    tests: ["Disulfide-bond connectivity (LC-MS/MS of fragments)", "Scrambled-disulfide impurities", "Reduction-reoxidation verification (identity)"],
    drugTypes: ["peptide", "antibody"],
    instruments: [
      { name: "LC-MS/MS (Orbitrap, high-res)", vendor: "Thermo", role: "Fragment-mass analysis", note: "Non-reduced + reduced runs" }
    ],
    consumables: ["Non-reducing + reducing digestion enzymes (trypsin, Glu-C)", "Alkylating agents (IAM)", "Peptide standards (disulfide reference)"],
    automation: "Semi-automated; LC-MS per-sample with expert analysis.",
    steps: [
      "Digest peptide under non-reducing conditions (preserve disulfides)",
      "LC-MS/MS: identify disulfide-linked fragments (mass + fragmentation)",
      "Map disulfide connectivity (which cysteines pair)",
      "Compare to intended structure (identity confirmation)",
      "Reduced-digest arm: confirm total cysteine content",
      "Quantify scrambled-disulfide impurities (mis-paired)",
      "Release specification: correct pairing + impurity limits"
    ],
    providers: [pr("lonza", "Disulfide-mapping services"), pr("wuxi", "Peptide analytics at scale"), pr("eurofins", "Disulfide mapping")],
    marketNote: "Cysteine-rich peptides (insulin-family, defensins) need disulfide verification — identity CQA.",
    capacityNote: "LC-MS/MS + expert analysis; moderate scarcity (analysis is skilled work)."
  }
);
