// Expansion 10 - in vivo pharmacology & toxicology (Nov 2026 round 2).
// Feedback: Charles River missing on in vivo PK; need organism and delivery-route
// filters for in vivo work. Defines window.SPECIES and window.ROUTES vocab and
// tags every in vivo assay with a.species[] and a.routes[].
// Classic script; load after data-9.js.

(function () {
  window.SPECIES = {
    mouse: "Mouse",
    rat: "Rat",
    rabbit: "Rabbit",
    dog: "Dog",
    minipig: "Minipig",
    nhp: "Non-human primate",
    zebrafish: "Zebrafish"
  };

  window.ROUTES = {
    iv: "Intravenous (IV)",
    sc: "Subcutaneous (SC)",
    po: "Oral (PO)",
    ip: "Intraperitoneal (IP)",
    im: "Intramuscular (IM)",
    intrathecal: "Intrathecal (IT)",
    icv: "Intracerebroventricular (ICV)",
    intravitreal: "Intravitreal",
    inhaled: "Inhaled",
    topical: "Topical / dermal",
    intratumoral: "Intratumoral"
  };

  Object.assign(P, {
    labcorp: { name: "Labcorp", region: "Global" },
    inotiv: { name: "Inotiv", region: "US/EU" },
    altasciences: { name: "Altasciences", region: "US/CA" },
    nbr: { name: "Northern Biomedical Research", region: "US" },
    jax: { name: "The Jackson Laboratory (JAX)", region: "US" },
    taconic: { name: "Taconic Biosciences", region: "US/DK" },
    zeclinics: { name: "ZeClinics", region: "ES" },
    biobide: { name: "Biobide", region: "ES" },
    poweredresearch: { name: "Powered Research", region: "US" },
    hooke: { name: "Hooke Laboratories", region: "US" }
  });

  const inst = (rows) => rows.map(([name, vendor, role, note]) => ({ name, vendor, role, note: note || "" }));
  const add = (o) => {
    if (ASSAYS.some((x) => x.id === o.id)) return;
    o.instruments = inst(o.inst);
    delete o.inst;
    ASSAYS.push(o);
  };

  // ---------- Existing in vivo assay: rodent PK ----------
  const pk = ASSAYS.find((x) => x.id === "pdx-bioanalysis");
  if (pk) {
    pk.category = "invivo";
    pk.species = ["mouse", "rat"];
    pk.routes = ["iv", "po", "sc", "ip"];
    const has = (n) => pk.providers.some((p) => p.name === n);
    if (!has("Charles River")) pk.providers.unshift(pr("crl", "Global leader in rodent and non-rodent PK/TK, with in-house regulated bioanalysis"));
    if (!has("The Jackson Laboratory (JAX)")) pk.providers.push(pr("jax", "Antibody PK in FcRn-humanised mice (Tg32)"));
    if (!has("Labcorp")) pk.providers.push(pr("labcorp", "Discovery and regulated PK/TK"));
  }

  add({
    id: "nhp-pk", name: "Non-Rodent PK / TK (NHP, Dog, Minipig)", category: "invivo",
    species: ["nhp", "dog", "minipig"], routes: ["iv", "sc", "po", "im"],
    tagline: "Exposure in the species closest to human. Needed for biologics and for FIH dose projection.",
    tests: ["Plasma PK and toxicokinetics (Cmax, AUC, t1/2)", "Target-mediated drug disposition for antibodies", "Anti-drug antibody impact on exposure", "Allometric scaling input for human dose"],
    drugTypes: ["antibody", "adc", "peptide", "oligo", "small-molecule"],
    inst: [["LC-MS/MS or ligand-binding bioanalysis", "SCIEX / MSD", "Plasma quantification", "ICH M10 validated for GLP"], ["Infusion pumps and vascular access ports", "Standard vivarium", "Dosing and serial sampling"]],
    consumables: ["Formulated test article", "Species-matched blank matrix for calibrators", "K2-EDTA or serum tubes", "Critical reagents for ligand-binding assays", "ADA assay reagents"],
    automation: "Animal work is manual; bioanalysis and NCA are automated.",
    steps: [
      "Select species by target cross-reactivity and pharmacology",
      "Dose animals at low, mid and high levels by the clinical route",
      "Collect serial blood samples over the dosing interval",
      "Process to plasma or serum and freeze",
      "Quantify drug by LC-MS/MS or ligand-binding assay",
      "Run ADA assay on later timepoints",
      "Non-compartmental analysis and allometric scaling to human"
    ],
    providers: [pr("crl", "Largest non-rodent PK/TK and safety capacity worldwide"), pr("labcorp", "Non-rodent PK/TK within nonclinical programmes"), pr("altasciences", "Rodent and non-rodent studies integrated with clinical units"), pr("inotiv", "Non-rodent PK and toxicology")],
    marketNote: "NHP is often the only pharmacologically relevant species for antibodies; FDA is encouraging reduced NHP use where alternatives exist.",
    capacityNote: "NHP supply is the tightest constraint in preclinical work; book 3-6 months ahead."
  });

  add({
    id: "glp-tox", name: "GLP Repeat-Dose Toxicology (Rodent + Non-Rodent)", category: "invivo",
    species: ["rat", "mouse", "dog", "minipig", "nhp", "rabbit"], routes: ["iv", "sc", "po", "im", "inhaled", "topical"],
    tagline: "The IND-enabling safety package. Finds target organs and sets the safe starting dose.",
    tests: ["NOAEL and target-organ toxicity", "Clinical pathology (haematology, chemistry)", "Histopathology of full tissue list", "Toxicokinetics and reversibility (recovery arm)"],
    drugTypes: ["small-molecule", "antibody", "adc", "peptide", "oligo", "cgt"],
    inst: [["Haematology and clinical chemistry analysers", "Siemens / Roche", "Clinical pathology"], ["Histology processing and digital slide scanners", "Leica / Hamamatsu", "Histopathology"], ["LC-MS/MS or LBA", "SCIEX / MSD", "Toxicokinetics"]],
    consumables: ["GMP-like or GLP-characterised test article", "Dose formulations with stability and homogeneity data", "Fixatives and histology reagents", "Clinical pathology reagents"],
    automation: "Highly protocolised under GLP; data capture systems (Provantis, Pristima) record everything.",
    steps: [
      "Run a non-GLP dose-range finding study",
      "Write the GLP protocol and analyse dose formulations",
      "Dose main and recovery groups daily or weekly for 2-13 weeks",
      "Record clinical signs, body weight, food intake and ophthalmology",
      "Collect blood for clinical pathology and toxicokinetics",
      "Necropsy, weigh organs and process tissues for histopathology",
      "Pathologist peer review and NOAEL determination",
      "Write the audited GLP report"
    ],
    providers: [pr("crl", "Global leader in GLP safety assessment"), pr("labcorp", "GLP toxicology across species"), pr("inotiv", "GLP toxicology"), pr("altasciences", "GLP and non-GLP pivotal toxicology"), pr("wuxi", "GLP toxicology in China")],
    marketNote: "Required under ICH M3(R2) and S6(R1) before first-in-human; the single largest preclinical spend.",
    capacityNote: "Slots for non-rodent GLP studies book months ahead; pathology peer review sets report timelines."
  });

  add({
    id: "cns-delivery", name: "CNS Delivery & CSF PK (Intrathecal / ICV)", category: "invivo",
    species: ["rat", "nhp", "minipig", "dog"], routes: ["intrathecal", "icv"],
    tagline: "Dose straight into the CSF. Measures brain and spinal cord exposure for oligos, enzymes and AAV.",
    tests: ["CSF and plasma PK after lumbar or ICV dosing", "Brain and spinal cord tissue distribution", "Local tolerability at the catheter or injection site", "Target knockdown in CNS regions"],
    drugTypes: ["oligo", "cgt", "antibody", "peptide"],
    inst: [["Stereotaxic frame and implanted catheters/ports", "Various", "ICV and intrathecal access"], ["LC-MS/MS, hybridization ELISA or qPCR", "SCIEX / Bio-Rad", "Drug or vector quantification in CSF and tissue"], ["Fluoroscopy", "Various", "Catheter placement check", "Large animals"]],
    consumables: ["Intrathecal catheters and subcutaneous ports", "Artificial CSF vehicle", "CSF collection tubes (low binding)", "Tissue punch and homogenisation kits"],
    automation: "Surgery is specialist and manual; few CROs maintain chronically catheterised NHP or minipig colonies.",
    steps: [
      "Implant intrathecal or ICV catheter with access port, or plan bolus lumbar puncture",
      "Confirm catheter patency and placement",
      "Dose test article into the CSF",
      "Sample CSF and blood serially",
      "Collect brain regions and spinal cord at necropsy",
      "Quantify drug, vector genomes or target mRNA in each region",
      "Score neurological signs and histopathology at the dosing site"
    ],
    providers: [pr("nbr", "Specialist in surgical implants and CNS delivery: ICV, intrathecal, intraparenchymal, epidural"), pr("crl", "CNS route-of-administration and neuro toxicology"), pr("altasciences", "Intrathecal dosing in rodent and non-rodent studies")],
    marketNote: "Intrathecal ASOs (e.g. nusinersen) and CNS AAV made this a growth area; route expertise matters more than price.",
    capacityNote: "A handful of labs do chronic CNS catheterisation in large animals; expect long lead times."
  });

  add({
    id: "cdx-xenograft", name: "Cell-Line Derived Xenograft (CDX) Efficacy", category: "invivo",
    species: ["mouse"], routes: ["iv", "po", "ip", "sc", "intratumoral"],
    tagline: "Human tumour cell lines grown in immunodeficient mice. The first in vivo efficacy test.",
    tests: ["Tumour growth inhibition (TGI)", "Dose-response and schedule", "PK/PD link with tumour biomarkers", "Tolerability (body weight)"],
    drugTypes: ["small-molecule", "antibody", "adc", "oligo", "peptide"],
    inst: [["Digital calipers or 3D tumour scanner", "Various / Biopticon", "Tumour volume"], ["Bioluminescence imager (IVIS)", "Revvity", "Orthotopic or metastatic burden", "Luciferase lines"]],
    consumables: ["Authenticated tumour cell lines", "Immunodeficient mice (nude, SCID, NSG)", "Matrigel", "Vehicle and formulated test article"],
    automation: "Caliper data feeds study software (StudyLog); animal handling is manual.",
    steps: [
      "Expand authenticated tumour cells",
      "Implant cells subcutaneously or orthotopically",
      "Randomise mice when tumours reach 100-200 mm3",
      "Dose by the planned route and schedule",
      "Measure tumour volume and body weight 2-3 times a week",
      "Collect tumours and plasma for PK/PD at endpoint",
      "Calculate TGI and statistics versus vehicle"
    ],
    providers: [pr("crown", "Large CDX model collection and oncology pharmacology"), pr("crl", "Oncology efficacy studies"), pr("jax", "Oncology efficacy in immunodeficient strains")],
    marketNote: "Cheap, fast and reproducible; weak predictor of clinical response on its own.",
    capacityNote: "Plentiful capacity; studies start in 2-4 weeks."
  });

  add({
    id: "pdx-efficacy", name: "Patient-Derived Xenograft (PDX) Efficacy", category: "invivo",
    species: ["mouse"], routes: ["iv", "po", "ip", "sc"],
    tagline: "Patient tumours passaged in mice. Keeps tumour heterogeneity for translational efficacy.",
    tests: ["Response across genomically annotated tumours", "Biomarker-defined responder populations", "Mouse clinical trials (one animal per model, many models)", "Resistance mechanisms"],
    drugTypes: ["small-molecule", "antibody", "adc", "oligo", "cgt"],
    inst: [["Calipers or 3D tumour scanner", "Various", "Tumour volume"], ["NGS and RNA-seq of models", "Illumina", "Model annotation"]],
    consumables: ["Cryopreserved PDX fragments", "NSG or nude mice", "Model genomic and clinical annotation", "Formulated test article"],
    automation: "Model selection by database query; in-life work is manual.",
    steps: [
      "Select models by indication, mutation and expression from the annotated library",
      "Implant tumour fragments subcutaneously",
      "Randomise when tumours reach size",
      "Dose test article and standard-of-care arms",
      "Measure tumour volume and body weight",
      "Harvest tumours for biomarker and genomic analysis",
      "Correlate response with model genomics"
    ],
    providers: [pr("crl", "More than 1,700 PDX models across 45+ indications"), pr("champions", "Clinically annotated PDX platform"), pr("crown", "Large PDX collection and mouse clinical trials"), pr("jax", "PDX models and efficacy services")],
    marketNote: "Preferred over CDX for biomarker strategy and indication selection.",
    capacityNote: "Model take rates and growth speed vary; some models take 2-3 months to expand."
  });

  add({
    id: "syngeneic", name: "Syngeneic Tumour Models (Immuno-Oncology)", category: "invivo",
    species: ["mouse"], routes: ["ip", "iv", "sc", "po", "intratumoral"],
    tagline: "Mouse tumours in mice with a full immune system. The standard in vivo IO screen.",
    tests: ["Efficacy of checkpoint and immune agonists", "Tumour-infiltrating lymphocytes by flow", "Combination with standard of care", "Immune memory on rechallenge"],
    drugTypes: ["antibody", "small-molecule", "oligo", "cgt", "peptide"],
    inst: [["Calipers", "Various", "Tumour volume"], ["Flow cytometer", "BD / Cytek", "Tumour and spleen immunophenotyping"]],
    consumables: ["Syngeneic cell lines (CT26, MC38, B16-F10, 4T1, EMT6)", "Immunocompetent mice (BALB/c, C57BL/6)", "Mouse-reactive surrogate antibodies", "Flow panels"],
    automation: "Manual in-life work; flow analysis is the high-content step.",
    steps: [
      "Implant syngeneic tumour cells into immunocompetent mice",
      "Randomise at tumour size",
      "Dose mouse-surrogate or cross-reactive drug",
      "Track tumour volume and survival",
      "Harvest tumours and spleens for immune profiling",
      "Rechallenge cured mice to test memory"
    ],
    providers: [pr("crown", "Broad syngeneic model panel with baseline immune profiles"), pr("crl", "Syngeneic IO studies"), pr("jax", "Syngeneic and immunocompetent models")],
    marketNote: "Needs mouse-reactive drug; responses depend heavily on the model chosen.",
    capacityNote: "Plentiful capacity; studies are 3-6 weeks."
  });

  add({
    id: "humanised-mice", name: "Humanised Immune System Mice (CD34+ / PBMC)", category: "invivo",
    species: ["mouse"], routes: ["iv", "ip", "sc"],
    tagline: "Mice carrying a human immune system. Tests human-specific IO drugs, bispecifics and CAR-T.",
    tests: ["Efficacy of human-specific T-cell engagers and checkpoint antibodies", "CAR-T expansion and tumour killing", "Cytokine release risk in vivo", "Human immune reconstitution by flow"],
    drugTypes: ["antibody", "cgt", "adc"],
    inst: [["Flow cytometer", "BD / Cytek", "Human immune engraftment"], ["Bioluminescence imager", "Revvity", "Tumour burden"], ["Cytokine multiplex", "MSD / Luminex", "Human cytokines"]],
    consumables: ["Immunodeficient strains (NSG, NOG, cytokine-transgenic variants)", "Human CD34+ HSCs or PBMCs (HLA-typed donors)", "Human tumour CDX or PDX", "Human flow panels"],
    automation: "Engraftment QC by flow is the gating step; in-life work is manual.",
    steps: [
      "Engraft mice with CD34+ stem cells (12+ weeks) or PBMCs (days)",
      "Check human immune reconstitution by flow",
      "Implant human tumour",
      "Dose bispecific, antibody or CAR-T",
      "Track tumour, body weight and graft-versus-host signs",
      "Profile human immune cells and cytokines"
    ],
    providers: [pr("jax", "Humanised NSG models and in vivo services"), pr("taconic", "Humanised immune system mice (CD34+ and PBMC)"), pr("crl", "Humanised mouse tumour studies"), pr("crown", "Humanised IO models")],
    marketNote: "Only in vivo option when the drug does not cross-react with mouse targets.",
    capacityNote: "CD34+ mice take months to mature; donor-to-donor variation needs multiple donors."
  });

  add({
    id: "telemetry-cv", name: "Cardiovascular Telemetry (Safety Pharmacology)", category: "invivo",
    species: ["dog", "nhp", "minipig", "rat"], routes: ["po", "iv", "sc"],
    tagline: "Implanted telemetry records ECG and blood pressure in conscious animals. The in vivo QT study.",
    tests: ["QTc prolongation", "Heart rate and blood pressure changes", "Arrhythmia", "Respiratory and CNS core battery (companion studies)"],
    drugTypes: ["small-molecule", "peptide", "oligo", "antibody"],
    inst: [["Implantable telemetry transmitters", "DSI (Harvard Bioscience)", "ECG, pressure and temperature"], ["Jacketed external telemetry", "DSI / emka", "Non-invasive ECG in tox studies"], ["Analysis software (Ponemah)", "DSI", "Interval and arrhythmia analysis"]],
    consumables: ["Telemetry implants", "Surgical supplies", "Positive control (e.g. moxifloxacin)", "Formulated test article"],
    automation: "Data capture and interval measurement are automated; cardiologist review of arrhythmias is manual.",
    steps: [
      "Implant telemetry transmitters and allow recovery",
      "Record baseline ECG and blood pressure",
      "Dose in a Latin-square crossover design",
      "Record continuously for 24 h after each dose",
      "Correct QT for heart rate per animal",
      "Collect plasma for exposure-response",
      "Report against ICH S7A/S7B and E14/S7B Q&A"
    ],
    providers: [pr("crl", "GLP safety pharmacology telemetry"), pr("labcorp", "Cardiovascular telemetry in nonclinical safety"), pr("inotiv", "CV, respiratory and CNS safety pharmacology"), pr("altasciences", "Safety pharmacology")],
    marketNote: "Required core battery before FIH; strong in vivo QTc data can support a reduced clinical QT strategy.",
    capacityNote: "Instrumented animal colonies are shared and limited; crossover design needs washout weeks."
  });

  add({
    id: "cgt-biodistribution", name: "CGT Biodistribution & Shedding (qPCR / ddPCR)", category: "invivo",
    species: ["mouse", "rat", "nhp"], routes: ["iv", "intrathecal", "icv", "intravitreal", "im", "intratumoral"],
    tagline: "Where vector genomes and cells go, and how long they stay. A regulatory requirement for gene therapy.",
    tests: ["Vector genome copies per ug DNA in each tissue", "Transgene mRNA expression by tissue", "Germline (gonad) exposure", "Shedding in blood, urine, faeces and saliva"],
    drugTypes: ["cgt", "oligo"],
    inst: [["qPCR / ddPCR", "Bio-Rad / Thermo Fisher", "Vector genome quantification"], ["Tissue homogeniser", "Various", "DNA and RNA extraction"], ["Automated extraction", "Qiagen / Thermo Fisher", "Nucleic acid prep"]],
    consumables: ["Validated primer/probe sets", "Reference standards (plasmid)", "Naive tissue for matrix spikes", "DNA/RNA extraction kits", "Clean-room tissue collection kits to avoid cross-contamination"],
    automation: "Extraction and plate set-up automate well; necropsy contamination control is the hard part.",
    steps: [
      "Dose vector or cells by the clinical route",
      "Collect blood and excreta for shedding at set timepoints",
      "Necropsy with contamination-controlled tissue collection",
      "Extract DNA and RNA from 30+ tissues",
      "Quantify vector genomes by qPCR or ddPCR against standards",
      "Measure transgene expression by RT-qPCR",
      "Report persistence and clearance per tissue"
    ],
    providers: [pr("crl", "Gene therapy biodistribution and safety studies"), pr("labcorp", "Gene therapy in vivo models and routes of administration"), pr("bioagilytix", "Regulated qPCR/ddPCR bioanalysis for gene therapy")],
    marketNote: "Expected by FDA and EMA before gene therapy trials; often combined with the GLP tox study.",
    capacityNote: "Molecular lab throughput and contamination control limit turnaround, not animals."
  });

  add({
    id: "invivo-genotox", name: "In vivo Genotoxicity (Micronucleus OECD 474 / Comet OECD 489)", category: "invivo",
    species: ["rat", "mouse"], routes: ["po", "iv", "sc", "ip"],
    tagline: "Chromosome damage and DNA breaks in dosed animals. The in vivo arm of the ICH S2(R1) battery.",
    tests: ["Micronucleated erythrocytes in bone marrow or blood", "DNA strand breaks in liver, stomach or site of contact", "Follow-up of positive in vitro genotox results"],
    drugTypes: ["small-molecule", "peptide", "oligo"],
    inst: [["Flow cytometer with MicroFlow kit", "BD / Litron", "Automated micronucleus scoring"], ["Comet imaging system", "Instem / MetaSystems", "Tail intensity scoring"]],
    consumables: ["Positive controls (cyclophosphamide, EMS)", "MicroFlow or staining kits", "Low-melt agarose and lysis buffers", "Formulated test article"],
    automation: "Flow-based micronucleus scoring is automated; comet scoring is semi-automated.",
    steps: [
      "Run a dose-range finder to set the maximum tolerated dose",
      "Dose rats or mice, often integrated into a repeat-dose tox study",
      "Collect blood or bone marrow for micronucleus",
      "Collect liver and other tissues for comet",
      "Score micronuclei by flow and comets by imaging",
      "Confirm exposure in plasma and compare with historical controls"
    ],
    providers: [pr("crl", "In vivo micronucleus (OECD 474) and comet assays"), pr("labcorp", "Genetic toxicology"), pr("inotiv", "Genetic toxicology")],
    marketNote: "Standard part of the ICH S2(R1) battery; integration into tox studies saves animals.",
    capacityNote: "Good capacity at large CROs; comet in non-standard tissues needs validation."
  });

  add({
    id: "ocular-invivo", name: "Ocular PK & Toxicology (Intravitreal / Topical)", category: "invivo",
    species: ["rabbit", "nhp", "minipig", "dog"], routes: ["intravitreal", "topical"],
    tagline: "Dosing into or onto the eye. Measures vitreous and retinal exposure and ocular safety.",
    tests: ["Vitreous, retina and aqueous humour PK", "Intraocular pressure and inflammation", "Ophthalmic exams and retinal imaging (OCT, ERG)", "Ocular histopathology"],
    drugTypes: ["antibody", "oligo", "cgt", "small-molecule", "peptide"],
    inst: [["Slit lamp and indirect ophthalmoscope", "Various", "Ocular exams"], ["OCT and fundus imaging", "Heidelberg / Optos", "Retinal structure"], ["Electroretinography (ERG)", "Diagnosys", "Retinal function"]],
    consumables: ["Intravitreal needles (30-33G)", "Topical formulation", "Ocular tissue dissection kits", "Tonometer probes"],
    automation: "Manual, specialist technique; imaging exports are quantitative.",
    steps: [
      "Baseline ophthalmic exam, IOP and OCT",
      "Dose intravitreally or as topical drops",
      "Repeat exams and IOP at set timepoints",
      "Collect ocular tissues for PK",
      "Run ERG for retinal function",
      "Ocular histopathology at necropsy"
    ],
    providers: [pr("crl", "Ocular toxicology: intravitreal, topical and subretinal dosing"), pr("poweredresearch", "Ophthalmic pharmacology and ocular drug delivery (non-GLP)")],
    marketNote: "Anti-VEGF biologics and retinal gene therapies drive demand.",
    capacityNote: "Few labs have veterinary ophthalmologists on staff."
  });

  add({
    id: "inhalation-invivo", name: "Inhalation PK & Toxicology", category: "invivo",
    species: ["rat", "dog", "nhp", "mouse"], routes: ["inhaled"],
    tagline: "Aerosol exposure in nose-only or face-mask systems. Lung dose, PK and respiratory tract safety.",
    tests: ["Delivered and lung-deposited dose", "Plasma and lung PK", "Respiratory tract histopathology", "Repeat-dose inhalation toxicity"],
    drugTypes: ["small-molecule", "peptide", "oligo", "antibody"],
    inst: [["Nose-only inhalation towers", "CH Technologies / EMMS", "Rodent exposure"], ["Aerosol particle sizer / cascade impactor", "Various", "Aerosol characterisation"], ["Face-mask or helmet systems", "Various", "Non-rodent exposure"]],
    consumables: ["Formulation (dry powder, nebuliser or MDI)", "Aerosol filters", "Restraint tubes", "Lung lavage reagents"],
    automation: "Exposure systems are automated and monitored; aerosol characterisation is specialist work.",
    steps: [
      "Characterise aerosol particle size and concentration",
      "Acclimatise animals to restraint",
      "Expose animals nose-only or by face mask",
      "Monitor aerosol and calculate delivered dose",
      "Collect plasma and lung for PK",
      "Necropsy with respiratory tract histopathology"
    ],
    providers: [pr("crl", "Inhalation toxicology"), pr("labcorp", "Inhalation toxicology with 60+ years of experience")],
    marketNote: "Inhaled biologics and oligos are a growing niche; few labs run non-rodent inhalation.",
    capacityNote: "Specialist exposure suites limit capacity."
  });

  add({
    id: "zebrafish-invivo", name: "Zebrafish Larval Efficacy & Toxicity", category: "invivo",
    species: ["zebrafish"], routes: ["topical", "iv"],
    tagline: "Whole-vertebrate screening in 96-well plates. Early cardio, neuro and developmental toxicity.",
    tests: ["Developmental and organ toxicity", "Cardiotoxicity (heart rate, arrhythmia)", "Neurobehaviour and seizure models", "Xenograft and disease-model efficacy"],
    drugTypes: ["small-molecule", "oligo", "peptide"],
    inst: [["Automated larval imager", "Various", "Morphology and fluorescence"], ["Behaviour tracking system", "ViewPoint / Noldus", "Locomotion and seizure"]],
    consumables: ["Zebrafish embryos and larvae (wild-type or transgenic)", "96-well plates", "E3 embryo medium", "Microinjection needles"],
    automation: "Plate-based dosing and imaging; larvae under 5 dpf are not protected animals in the EU.",
    steps: [
      "Collect and stage embryos",
      "Array larvae into 96-well plates",
      "Add compound to the water, or microinject",
      "Image morphology, heart rate and fluorescent reporters",
      "Track behaviour",
      "Score toxicity endpoints and efficacy"
    ],
    providers: [pr("zeclinics", "Zebrafish CRO: toxicity, efficacy and transgenic lines"), pr("biobide", "Zebrafish toxicity and efficacy screening")],
    marketNote: "Bridges in vitro and rodent at low cost; a recognised new approach method.",
    capacityNote: "High throughput; exposure in water differs from mammalian PK."
  });

  add({
    id: "inflammation-models", name: "Rodent Inflammation & Autoimmune Models (EAE, CIA, Colitis)", category: "invivo",
    species: ["mouse", "rat"], routes: ["po", "ip", "sc", "iv"],
    tagline: "Disease models for MS, arthritis, IBD and skin inflammation. In vivo efficacy for immunology drugs.",
    tests: ["Clinical disease score over time", "Histopathology of target tissue", "Cytokine and immune cell readouts", "Dose-response versus reference drug"],
    drugTypes: ["antibody", "small-molecule", "peptide", "oligo", "cgt"],
    inst: [["Calipers and scoring sheets", "Various", "Paw swelling or clinical score"], ["Flow cytometer", "BD / Cytek", "Immune profiling"], ["Cytokine multiplex", "MSD / Luminex", "Serum cytokines"]],
    consumables: ["Disease inducers (MOG peptide, collagen, DSS)", "Adjuvants", "Reference drugs", "Histology reagents"],
    automation: "Blinded manual scoring; tight induction protocols drive reproducibility.",
    steps: [
      "Induce disease (immunisation or chemical)",
      "Randomise animals by onset or baseline",
      "Dose prophylactically or therapeutically",
      "Score clinical signs daily and blinded",
      "Collect tissue and blood at endpoint",
      "Histopathology and immune readouts"
    ],
    providers: [pr("hooke", "Specialist CRO for rodent inflammation and autoimmune models"), pr("crl", "Inflammation and autoimmune pharmacology"), pr("inotiv", "Discovery in vivo pharmacology")],
    marketNote: "Model-specific expertise and historical control data matter more than price.",
    capacityNote: "Specialist labs often start studies within 2-4 weeks."
  });

  // Tag any other in vivo assays (by category) that lack vocab fields.
  ASSAYS.forEach((a) => {
    if (a.category !== "invivo") return;
    if (!Array.isArray(a.species)) a.species = [];
    if (!Array.isArray(a.routes)) a.routes = [];
    a.species = a.species.filter((k) => window.SPECIES[k]);
    a.routes = a.routes.filter((k) => window.ROUTES[k]);
  });
})();
