// The Assay Index - validation evidence layer.
// Classic script. Load after data.js ... data-9.js.
// Sets a.validation = { tier, basis, refs:[{label,url}], ask:[...] } on every assay.
// Evidence describes the assay TYPE, never any individual provider.
// Exposes: window.TIERS, window.renderValidation(a, opts), window.applyValidation(list), window.validationFor(a)
(function () {
  'use strict';

  var TIERS = {
    A: { label: 'Tier A', name: 'Regulatory guideline', desc: 'A regulatory or harmonised guideline defines how this assay type is validated.' },
    B: { label: 'Tier B', name: 'Multi-site or consensus', desc: 'Multi-site reproducibility data or a published community consensus exists for this assay type.' },
    C: { label: 'Tier C', name: 'Published, site-specific', desc: 'Widely published, but validation is set up lab by lab; no shared acceptance criteria.' },
    D: { label: 'Tier D', name: 'Emerging', desc: 'Emerging assay type. Ask the provider for a full validation package.' }
  };

  // Verified references (only these URLs are used).
  var R = {
    m10: { label: 'ICH M10 Bioanalytical method validation (EMA)', url: 'https://www.ema.europa.eu/en/scientific-guidelines/ich-m10-bioanalytical-method-validation' },
    q2: { label: 'ICH Q2(R2) Validation of analytical procedures (2023)', url: 'https://database.ich.org/sites/default/files/ICH_Q2(R2)_Guideline_2023_1130.pdf' },
    ada: { label: 'FDA Immunogenicity testing: developing and validating ADA assays (2019)', url: 'https://www.fda.gov/media/119788/download' },
    seqc: { label: 'SEQC/MAQC-III RNA-seq multi-site assessment (Nat Biotechnol 2014)', url: 'https://www.nature.com/articles/nbt.2957' },
    agm: { label: 'NCATS Assay Guidance Manual', url: 'https://www.ncbi.nlm.nih.gov/books/NBK53196/' },
    tg471: { label: 'OECD Test No. 471: Bacterial reverse mutation test', url: 'https://www.oecd.org/en/publications/test-no-471-bacterial-reverse-mutation-test_9789264071247-en.html' },
    s2: { label: 'ICH S2(R1) Genotoxicity testing guideline', url: 'https://database.ich.org/sites/default/files/S2_R1_Guideline.pdf' },
    flow: { label: 'Guidelines for the use of flow cytometry, 3rd edition', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11115438/' },
    cipa: { label: 'CiPA hiPSC-CM MEA multi-site study (Blinova 2018)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6226030' },
    e14: { label: 'ICH E14/S7B Q&As (2022)', url: 'https://database.ich.org/sites/default/files/E14-S7B_QAs_Step4_2022_0221.pdf' },
    m12: { label: 'ICH M12 Drug interaction studies (2024)', url: 'https://database.ich.org/sites/default/files/ICH_M12_Step4_Guideline_2024_0521.pdf' },
    chip: { label: 'Liver-Chip predictive validation (Ewart 2022)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9727064' },
    q6b: { label: 'ICH Q6B Specifications for biotechnological products', url: 'https://database.ich.org/sites/default/files/Q6B_Guideline.pdf' },
    cgt: { label: 'FDA Potency assurance for cellular and gene therapy products', url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-potency-assurance-cellular-and-gene-therapy-products' },
    jain: { label: 'Biophysical properties of clinical-stage antibodies (Jain 2017, PNAS)', url: 'https://www.pnas.org/doi/full/10.1073/pnas.1616408114' },
    ht246: { label: 'High-throughput developability profiling of 246 IgGs', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12674332/' },
    // Round 2 (verified open access, Nov 2026)
    s7a: { label: 'ICH S7A Safety pharmacology studies', url: 'https://database.ich.org/sites/default/files/S7A_Guideline.pdf' },
    s7b: { label: 'ICH S7B Non-clinical evaluation of delayed ventricular repolarization (QT)', url: 'https://database.ich.org/sites/default/files/S7B_Guideline.pdf' },
    m3: { label: 'ICH M3(R2) Nonclinical safety studies for clinical trials', url: 'https://database.ich.org/sites/default/files/M3_R2__Guideline.pdf' },
    s6: { label: 'ICH S6(R1) Preclinical safety of biotechnology-derived pharmaceuticals', url: 'https://database.ich.org/sites/default/files/S6_R1_Guideline_0.pdf' },
    s3a: { label: 'ICH S3A Toxicokinetics', url: 'https://database.ich.org/sites/default/files/S3A_Guideline.pdf' },
    s9: { label: 'ICH S9 Nonclinical evaluation for anticancer pharmaceuticals', url: 'https://database.ich.org/sites/default/files/S9_Guideline.pdf' },
    s12: { label: 'ICH S12 Nonclinical biodistribution for gene therapy products (2023)', url: 'https://database.ich.org/sites/default/files/ICH_S12_Step4_Guideline_2023_0314.pdf' },
    tg474: { label: 'OECD Test No. 474: Mammalian erythrocyte micronucleus test', url: 'https://www.oecd.org/en/publications/test-no-474-mammalian-erythrocyte-micronucleus-test_9789264264762-en.html' },
    tg489: { label: 'OECD Test No. 489: In vivo mammalian alkaline comet assay', url: 'https://www.oecd.org/en/publications/test-no-489-in-vivo-mammalian-alkaline-comet-assay_9789264264885-en.html' },
    q11: { label: 'ICH Q11 Development and manufacture of drug substances', url: 'https://database.ich.org/sites/default/files/Q11%20Guideline.pdf' },
    q7: { label: 'ICH Q7 GMP for active pharmaceutical ingredients', url: 'https://database.ich.org/sites/default/files/Q7%20Guideline.pdf' },
    q5a: { label: 'ICH Q5A(R2) Viral safety of biotechnology products (2023)', url: 'https://database.ich.org/sites/default/files/ICH_Q5A%28R2%29_Guideline_2023_1101.pdf' },
    q5b: { label: 'ICH Q5B Analysis of the expression construct', url: 'https://database.ich.org/sites/default/files/Q5B%20Guideline.pdf' },
    q5d: { label: 'ICH Q5D Cell substrates for biotechnological products', url: 'https://database.ich.org/sites/default/files/Q5D%20Guideline.pdf' },
    q5e: { label: 'ICH Q5E Comparability after manufacturing process changes', url: 'https://database.ich.org/sites/default/files/Q5E%20Guideline.pdf' },
    mrd: { label: 'FDA Hematologic malignancies: use of MRD in drug development (2020)', url: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/hematologic-malignancies-regulatory-considerations-use-minimal-residual-disease-development-drug-and' },
    ctdna: { label: 'FDA Use of ctDNA for early-stage solid tumor drug development (2024)', url: 'https://www.fda.gov/media/183874/download' },
    giab: { label: 'Genome in a Bottle benchmark variant calls (Zook 2019)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6500473/' }
  };

  // Rule shorthand: [tier, basis, refKeys, extraAsks]
  var BASIS = {
    m10: 'ICH M10 sets validation for chromatographic and ligand-binding assays that measure drug concentrations in study samples (accuracy, precision, selectivity, stability, ISR).',
    q2: 'ICH Q2(R2) defines validation characteristics (specificity, accuracy, precision, range, LOQ, robustness) for analytical procedures used in release and stability testing.',
    q6b: 'ICH Q6B names this attribute in specifications for biotech products; the method itself is validated under ICH Q2(R2).',
    q2pep: 'Release and characterisation methods for synthetic peptides are validated under ICH Q2(R2).',
    compendial: 'Pharmacopoeial (compendial) method; Q6B lists it in biotech specifications and suitability is verified for each product matrix.',
    ada: 'FDA 2019 immunogenicity guidance sets the tiered screen-confirm-titre approach, cut-point, sensitivity and drug tolerance for anti-drug antibody assays.',
    nab: 'FDA 2019 immunogenicity guidance covers neutralising antibody assays (cell-based or competitive ligand-binding) as part of the ADA package.',
    ames: 'OECD TG 471 and ICH S2(R1) define the standard bacterial reverse mutation test (strains, S9, dose selection, acceptance criteria).',
    s2: 'ICH S2(R1) includes this test in the standard genotoxicity battery and sets acceptance and interpretation rules.',
    tg432: 'OECD Test Guideline 432 (in vitro 3T3 NRU phototoxicity) fixes the protocol, reference chemical and acceptance criteria; ICH S10 points to it.',
    tg442: 'OECD Test Guidelines 442C (DPRA) and 442D (KeratinoSens) define these key-event methods, proficiency substances and acceptance criteria.',
    herg: 'ICH E14/S7B Q&As (2022) set best practices for in vitro hERG patch-clamp studies used in integrated QT risk assessment.',
    ionB: 'ICH E14/S7B Q&As describe best-practice in vitro ion-channel studies; non-hERG channels are supportive and CiPA-style protocols are used.',
    mea: 'The CiPA multi-site MEA study (Blinova 2018) showed cross-site reproducibility of hiPSC-CM drug responses; ICH E14/S7B Q&As reference these models.',
    m12: 'ICH M12 (2024) defines in vitro DDI study design: enzyme and transporter systems, probe substrates, positive controls and cut-offs.',
    m12panel: 'The DDI elements of a standard in vitro ADME panel (CYP inhibition, induction, transporters) follow ICH M12; other read-outs are lab-specific.',
    admeC: 'Common screening assay; protocols and acceptance criteria are set by each lab. NCATS Assay Guidance Manual covers general robustness practice.',
    seqc: 'SEQC/MAQC-III ran RNA-seq across many sites and platforms, establishing reproducibility and reference-sample practice for bulk transcriptomics.',
    flow: 'Community consensus guidelines (3rd edition) define panel design, controls, compensation and gating for flow cytometry.',
    potency: 'ICH Q6B requires a validated biological activity (potency) assay for biotech products; method validation follows ICH Q2(R2).',
    fc: 'Used as Fc-effector potency or characterisation assays for antibodies under ICH Q6B; the exact format is product-specific.',
    cgtA: 'FDA potency assurance guidance for cell and gene therapies sets expectations for potency assays and release control strategy.',
    cgtQ2: 'Release-relevant CGT method with no assay-specific guideline; validation follows ICH Q2(R2) principles and is set up per product.',
    jain: 'Jain 2017 profiled 137 clinical-stage antibodies on a common panel of developability assays, giving community reference ranges; later high-throughput work extended this to 246 IgGs.',
    devC: 'Established biophysical method; used for characterisation with lab-specific acceptance criteria.',
    forced: 'Stress studies are expected under ICH Q6B for characterisation; stability-indicating methods are validated under ICH Q2(R2).',
    agm: 'Widely published plate or cell assay; NCATS Assay Guidance Manual gives shared practice (Z-prime, controls, plate uniformity) but criteria are lab-specific.',
    structC: 'Established structural or biophysical method; quality is judged by published per-dataset metrics rather than a validation guideline.',
    chip: 'Ewart 2022 tested the Emulate Liver-Chip on 27 known drugs with blinded data, showing predictive performance for drug-induced liver injury.',
    genoC: 'Widely published genomics method; pipelines and QC thresholds are lab-specific with no shared validation standard.',
    emerging: 'Emerging assay type with limited cross-site data. Treat results as exploratory unless the provider supplies a validation package.',
    str: 'Cell-line authentication by STR follows a published consensus standard (ANSI/ATCC); karyotype and SNP-array QC are lab-specific.',
    lbaBio: 'Biomarker ligand-binding assay; ICH M10 excludes biomarkers, so fit-for-purpose validation is set by each lab.',
    tk: 'Exposure in toxicology species is defined by ICH S3A and M3(R2); the bioanalysis behind it is validated under ICH M10.',
    glptox: 'ICH M3(R2) sets duration, species and dose selection for repeat-dose toxicology; ICH S6(R1) covers biologics and S9 anticancer drugs. Studies run under GLP.',
    telemetry: 'ICH S7A requires a core cardiovascular safety study and ICH S7B the in vivo QT assessment; conscious telemetry in non-rodents is the standard design.',
    s12: 'ICH S12 (2023) sets the design of nonclinical biodistribution studies for gene therapies (species, tissues, timepoints, assay sensitivity). Shedding is outside its scope.',
    invivoGenotox: 'OECD TG 474 (micronucleus) and TG 489 (comet) fix the in vivo protocols, and ICH S2(R1) places them in the standard genotoxicity battery.',
    efficacy: 'In vivo efficacy model with no validation guideline; ICH S9 frames how anticancer pharmacology supports development, but model performance is lab and model specific.',
    invivoC: 'In vivo model widely published but set up lab by lab; ICH M3(R2) frames when such studies are needed, not how the model is validated.',
    giab: 'Genome in a Bottle reference genomes give a shared truth set to benchmark sequencing and variant-calling accuracy across labs.',
    ctdna: 'FDA ctDNA guidance (2024) discusses assay standardisation, analytical validation and pre-analytics for ctDNA used in drug development; there are no shared acceptance criteria yet.',
    mrd: 'FDA MRD guidance (2020) sets expectations for MRD assays used in haematologic-malignancy trials (sensitivity, sample type, analytical validation); FDA-cleared tests exist for this assay type.',
    hla: 'High-resolution HLA typing labs are accredited against published histocompatibility standards (ASHI, EFI) with external proficiency testing.',
    prodBio: 'Production service, not an assay. For recombinant products made under GMP, ICH Q5B and Q5D cover the expression construct and cell substrate, Q5A(R2) viral safety for animal cell lines, Q11 process development and Q7 GMP; Q5E applies when scale or process changes.',
    prodChem: 'Production service, not an assay. Synthetic peptides and oligonucleotides are chemical drug substances: under GMP, ICH Q11 covers process development and Q7 manufacture.',
    prodResearch: 'Production service, not an assay. Research-grade material has no GMP framework; quality rests on the provider certificate of analysis and your own identity and purity checks. The linked ICH guidelines apply once material moves to GMP.',
    comet: 'ICH S2(R1) accepts the in vivo comet assay as a follow-up test; the in vitro format has no guideline and is lab-specific.'
  };

  function rule(tier, basisKey, refKeys, ask) { return { tier: tier, basisKey: basisKey, refs: refKeys, ask: ask || [] }; }

  var BY_ID = {
    // Bioanalysis
    lcms: rule('A', 'm10', ['m10'], ['Full ICH M10 validation report for the matrix and species', 'Incurred sample reanalysis (ISR) results']),
    'oligo-lcms': rule('A', 'm10', ['m10'], ['Full ICH M10 validation report for the matrix and species', 'Metabolite / n-1 shortmer selectivity data']),
    elisa: rule('A', 'm10', ['m10'], ['ICH M10 ligand-binding validation report', 'Selectivity in individual matrix lots, dilutional linearity, hook effect']),
    'hybridization-elisa': rule('A', 'm10', ['m10'], ['ICH M10 ligand-binding validation report', 'Cross-reactivity with metabolites']),
    luminex: rule('C', 'lbaBio', ['m10', 'agm'], ['Fit-for-purpose validation per analyte', 'Parallelism with endogenous samples']),
    simoa: rule('C', 'lbaBio', ['m10', 'agm'], ['Fit-for-purpose validation per analyte', 'Parallelism and LLOQ in your matrix']),
    ada: rule('A', 'ada', ['ada'], ['Cut-point derivation in the target population', 'Sensitivity and drug tolerance data']),
    nab: rule('A', 'nab', ['ada'], ['Cut-point, sensitivity and drug tolerance data', 'Justification of cell-based vs competitive format']),
    'bioassay-neutralizing': rule('A', 'nab', ['ada'], ['Cut-point, sensitivity and drug tolerance data', 'Justification of cell-based vs competitive format']),
    'potency-cell': rule('A', 'potency', ['q6b', 'q2'], ['ICH Q2(R2) validation report (relative potency accuracy, precision, range)', 'Reference standard qualification']),
    'biosimilar-compare': rule('A', 'q6b', ['q6b', 'q2'], ['Validation status of each orthogonal method', 'Number of reference product lots compared']),
    'glycan-profiling': rule('A', 'q6b', ['q6b', 'q2']),
    iCIEF: rule('A', 'q6b', ['q6b', 'q2']),
    'CEX-HPLC': rule('A', 'q6b', ['q6b', 'q2']),
    'icp-ms-biologics': rule('A', 'q2', ['q2']),
    sp2d2: rule('A', 'q6b', ['q6b', 'q2']),
    // QC
    'SEC-HPLC': rule('A', 'q6b', ['q6b', 'q2']),
    'hcp-elisa': rule('A', 'q6b', ['q6b', 'q2'], ['Antibody coverage data for the host-cell proteome']),
    'residual-proteinA': rule('A', 'q6b', ['q6b', 'q2']),
    endotoxin: rule('A', 'compendial', ['q6b'], ['Product-specific inhibition/enhancement (suitability) data']),
    bioburden: rule('A', 'compendial', ['q6b'], ['Method suitability for your product']),
    'sterility-test': rule('A', 'compendial', ['q6b'], ['Method suitability (bacteriostasis/fungistasis) for your product']),
    'elsd-clnd': rule('B', 'q2', ['q2'], ['Response-factor justification for universal detection']),
    // Genotox and safety
    ames: rule('A', 'ames', ['tg471', 's2'], ['GLP status and historical control data', 'Strain panel and S9 source']),
    micronucleus: rule('A', 's2', ['s2'], ['GLP status and historical control data']),
    chromab: rule('A', 's2', ['s2'], ['GLP status and historical control data']),
    mla: rule('A', 's2', ['s2'], ['GLP status and historical control data']),
    comet: rule('B', 'comet', ['s2'], ['Whether the in vivo (guideline) or in vitro format is offered']),
    phototox: rule('A', 'tg432', [], ['GLP status and proficiency with reference chemicals']),
    skinsens: rule('A', 'tg442', [], ['Proficiency substance results for each method']),
    'organ-on-chip': rule('B', 'chip', ['chip'], ['Which chip and cell source; benchmark data with known positive and negative drugs']),
    // Ion channels
    herg: rule('A', 'herg', ['e14'], ['Temperature, voltage protocol and positive-control potency vs E14/S7B best practice', 'Measured (not nominal) concentrations']),
    nav15: rule('B', 'ionB', ['e14'], ['Late vs peak current protocol and positive controls']),
    cav12: rule('B', 'ionB', ['e14'], ['Voltage protocol and positive controls']),
    'mea-cardio': rule('B', 'mea', ['cipa', 'e14'], ['Cell lot and benchmark compound data matching CiPA']),
    'cardiomyocyte-mea': rule('B', 'mea', ['cipa', 'e14'], ['Cell lot and benchmark compound data matching CiPA']),
    // ADME
    adme: rule('A', 'm12panel', ['m12', 'agm']),
    'cyp-inhibition': rule('A', 'm12', ['m12'], ['Probe substrates and positive-control IC50 vs historical range']),
    'cyp-tdi': rule('A', 'm12', ['m12'], ['kinact/KI design and positive controls']),
    'cyp-induction': rule('A', 'm12', ['m12'], ['Number of hepatocyte donors and positive-control fold-induction']),
    transporters: rule('A', 'm12', ['m12'], ['Cell system per transporter and probe substrate positive controls']),
    'cyp-phenotyping': rule('A', 'm12', ['m12']),
    'ugt-phenotype': rule('A', 'm12', ['m12']),
    ppb: rule('A', 'm12', ['m12'], ['Recovery and equilibrium time data']),
    caco2: rule('A', 'm12', ['m12', 'agm'], ['Monolayer integrity (TEER) and efflux positive controls']),
    mdck: rule('A', 'm12', ['m12', 'agm'], ['Efflux ratio of P-gp probe substrate with and without inhibitor']),
    // Flow
    flow: rule('B', 'flow', ['flow'], ['Panel validation, FMO controls and instrument standardisation']),
    'receptor-occupancy': rule('B', 'flow', ['flow'], ['Assay format (free, bound, total) and sample stability']),
    'cell-cycle': rule('B', 'flow', ['flow']),
    // Fc effector
    adcc: rule('B', 'fc', ['q6b', 'agm']),
    adcp: rule('C', 'fc', ['q6b', 'agm']),
    cdc: rule('B', 'fc', ['q6b', 'agm']),
    // Genomics
    'rnaseq-offtarget': rule('B', 'seqc', ['seqc'], ['Replicate count, depth and differential-expression thresholds']),
    'cell-line-genomic-stability': rule('B', 'str', []),
    // CGT
    'cgt-release-panel': rule('A', 'cgtA', ['cgt', 'q2'], ['Validation status of each release method']),
    'potency-assay-cgt': rule('A', 'cgtA', ['cgt', 'q2'], ['Link between potency read-out and mechanism of action']),
    'vector-copy-number': rule('C', 'cgtQ2', ['q2', 'cgt']),
    'p24-titer': rule('C', 'cgtQ2', ['q2', 'cgt']),
    'tcid50-infectious': rule('C', 'cgtQ2', ['q2', 'cgt']),
    'aav-empty-full': rule('C', 'cgtQ2', ['q2'], ['Orthogonal comparison (AUC, cryo-EM or AEX)']),
    // Developability
    'developability-panel': rule('B', 'jain', ['jain', 'ht246']),
    hic: rule('B', 'jain', ['jain', 'ht246']),
    'ac-sins': rule('B', 'jain', ['jain', 'ht246']),
    polyreactivity: rule('B', 'jain', ['jain', 'ht246']),
    cic: rule('B', 'jain', ['jain', 'ht246']),
    smac: rule('B', 'jain', ['jain', 'ht246']),
    'csi-bli': rule('B', 'jain', ['jain', 'ht246']),
    'forced-degradation': rule('B', 'forced', ['q6b', 'q2']),
    // Structure / biophysics
    'xray-crystallography': rule('C', 'structC', []),
    'cryo-em': rule('C', 'structC', []),
    'hdx-ms': rule('C', 'structC', []),
    nativems: rule('C', 'structC', []),
    stdnmr: rule('C', 'structC', []),
    itc: rule('C', 'structC', ['agm']),
    // Emerging
    asms: rule('D', 'emerging', ['agm']),
    organoid: rule('D', 'emerging', ['agm']),
    'ipsc-neuron': rule('D', 'emerging', ['agm']),
    'perturb-seq': rule('D', 'emerging', []),
    'spatial-tx': rule('D', 'emerging', []),
    'longread-vector': rule('D', 'emerging', []),
    'integration-site': rule('C', 'genoC', []),
    // In vivo (data-10)
    'pdx-bioanalysis': rule('A', 'tk', ['m10', 's3a', 'm3'], ['ICH M10 validation status (full, partial or cross-validation)', 'Stability data covering your sample handling']),
    'nhp-pk': rule('A', 'tk', ['s3a', 'm3', 'm10'], ['Bioanalytical method validation (ICH M10) for the species', 'Animal welfare accreditation (AAALAC or equivalent)']),
    'glp-tox': rule('A', 'glptox', ['m3', 's6', 's9', 's3a'], ['GLP compliance statement and QA audit', 'Historical control data for the species and strain', 'Toxicokinetic bioanalysis validation (ICH M10)']),
    'telemetry-cv': rule('A', 'telemetry', ['s7a', 's7b', 'e14'], ['Sensitivity data with a positive control (smallest detectable QTc change)', 'GLP status']),
    'cgt-biodistribution': rule('A', 's12', ['s12'], ['qPCR/ddPCR sensitivity in each tissue matrix (copies per ug DNA)', 'Tissue list and timepoints vs ICH S12']),
    'invivo-genotox': rule('A', 'invivoGenotox', ['tg474', 'tg489', 's2'], ['Historical negative and positive control data', 'Evidence of target-tissue exposure']),
    'cns-delivery': rule('C', 'invivoC', ['m3'], ['Injection accuracy data (dye or imaging)', 'CSF sampling and bioanalysis validation']),
    'ocular-invivo': rule('C', 'invivoC', ['m3'], ['Injection technique validation and ocular exam scoring scheme']),
    'inhalation-invivo': rule('C', 'invivoC', ['m3'], ['Aerosol characterisation (MMAD, GSD) and delivered-dose estimate']),
    'cdx-xenograft': rule('C', 'efficacy', ['s9'], ['Growth-curve reproducibility and take rate', 'Standard-of-care benchmark arm data']),
    'pdx-efficacy': rule('C', 'efficacy', ['s9'], ['Model genomic characterisation and passage number', 'Take rate and standard-of-care response data']),
    syngeneic: rule('C', 'efficacy', ['s9'], ['Checkpoint-inhibitor benchmark response for the model']),
    'humanised-mice': rule('D', 'emerging', [], ['Human chimerism levels per donor and batch', 'Donor-to-donor variability and GvHD onset']),
    'zebrafish-invivo': rule('D', 'emerging', [], ['Concordance with mammalian results for reference compounds']),
    'inflammation-models': rule('C', 'invivoC', ['m3'], ['Disease incidence and scoring reproducibility', 'Reference treatment benchmark (e.g. dexamethasone, anti-TNF)']),
    // Genomics (data-11)
    wgs: rule('B', 'giab', ['giab'], ['Precision and recall on GIAB reference samples', 'Coverage depth and uniformity']),
    'wes-panel': rule('B', 'giab', ['giab'], ['Precision and recall on GIAB reference samples in target regions', 'Fraction of targets at 20x or above']),
    'liquid-biopsy-ctdna': rule('B', 'ctdna', ['ctdna'], ['Limit of detection by variant allele fraction with contrived standards', 'Pre-analytical requirements (tube, time to plasma)']),
    'mrd-ctdna': rule('B', 'ctdna', ['ctdna'], ['Analytical sensitivity (LoD) and specificity in healthy-donor plasma', 'Turnaround for tumour-informed panel design']),
    'mrd-ngs-clonoseq': rule('A', 'mrd', ['mrd'], ['Sensitivity threshold achieved (e.g. 1 in 10^5 or 10^6 cells)', 'Regulatory status of the test (cleared, LDT or research use)']),
    'mrd-flow': rule('A', 'mrd', ['mrd', 'flow'], ['Sensitivity (cells acquired, LoD) and panel standardisation', 'Regulatory status of the test (cleared, LDT or research use)']),
    'cfdna-methylation': rule('D', 'emerging', ['ctdna']),
    'hla-typing': rule('B', 'hla', [], ['Accreditation (ASHI or EFI) and proficiency testing results', 'Resolution reported (fields) and ambiguity handling']),
    'liver-mps': rule('B', 'chip', ['chip'], ['Which platform and cell source; benchmark drug set and sensitivity/specificity'])
  };

  var BY_CAT = {
    binding: rule('C', 'agm', ['agm']),
    cell: rule('C', 'agm', ['agm']),
    safety: rule('C', 'agm', ['agm']),
    bioanalysis: rule('C', 'agm', ['agm']),
    qc: rule('A', 'q2', ['q2'], ['ICH Q2(R2) validation report for your compound or a method transfer plan']),
    peptide: rule('A', 'q2pep', ['q2']),
    adme: rule('C', 'admeC', ['agm']),
    genomics: rule('C', 'genoC', []),
    immunology: rule('C', 'agm', ['agm']),
    ionchannel: rule('C', 'agm', ['agm', 'e14']),
    developability: rule('C', 'devC', ['jain']),
    cgt: rule('C', 'cgtQ2', ['q2', 'cgt']),
    'disease-models': rule('D', 'emerging', []),
    invivo: rule('C', 'invivoC', ['m3']),
    production: rule('C', 'prodResearch', ['q11']),
    pathology: rule('C', 'pathC', ['m3'])
  };

  // Production & scale-up (data-12): a manufacturing service, tiered by the framework that governs it.
  var PROD_ASK = [
    'Certificate of analysis contents (identity, purity, endotoxin, concentration)',
    'Scale-up track record and batch success rate at your target scale',
    'GMP status and inspection history, if clinical material is needed'
  ];
  function productionRule(a) {
    var t = [a.id, a.name, a.tagline, a.scale, a.automation].join(' ');
    var gmp = /\bc?GMP\b/i.test(t);
    var tier = gmp ? 'A' : 'C';
    if (/peptide|oligo|SPPS|phosphoramidite|nucleotide|siRNA|ASO/i.test(t) && !/express|ferment|recombinant/i.test(t)) {
      return rule(tier, gmp ? 'prodChem' : 'prodResearch', ['q11', 'q7'], PROD_ASK);
    }
    var refs = ['q5b', 'q5d', 'q11', 'q7', 'q5e'];
    if (/CHO|HEK|mammalian|insect|baculo|AAV|lenti|vector|cell line/i.test(t)) refs = ['q5a', 'q5b', 'q5d', 'q11', 'q7', 'q5e'];
    if (/cell-free/i.test(t)) refs = ['q11', 'q7'];
    return rule(tier, gmp ? 'prodBio' : 'prodResearch', refs, PROD_ASK.concat(['Expression construct and cell bank documentation (ICH Q5B, Q5D)']));
  }

  var ASK_BY_TIER = {
    A: ['Validation report against the named guideline', 'GLP or GMP status of the facility for this assay', 'Recent run acceptance (QC pass rate)'],
    B: ['Reference compounds or samples run against the published benchmark', 'Inter-assay precision (CV) over the last 6 months', 'Instrument and reagent lot control'],
    C: ['Intra- and inter-assay precision (CV) and Z-prime or equivalent', 'Positive and negative controls with historical ranges', 'Example raw data and analysis settings'],
    D: ['Full validation package: precision, accuracy, range, robustness', 'Benchmark data with known positive and negative compounds', 'Cell or material source, lot-to-lot variability and failure rate', 'Plan for bridging to an orthogonal established assay']
  };

  function textHas(a, re) {
    var s = [a.id, a.name, a.tagline].join(' ');
    return re.test(s);
  }

  function pickRule(a) {
    if (BY_ID[a.id]) return BY_ID[a.id];
    if (a.category === 'production') return productionRule(a);
    if (a.category === 'invivo') {
      if (textHas(a, /genotox|micronucleus|comet/i)) return BY_ID['invivo-genotox'];
      if (textHas(a, /telemetry|safety pharmacology|cardiovascular/i)) return BY_ID['telemetry-cv'];
      if (textHas(a, /biodistribution/i)) return BY_ID['cgt-biodistribution'];
      if (textHas(a, /GLP|toxicolog/i)) return BY_ID['glp-tox'];
      if (textHas(a, /\bPK\b|TK|pharmacokinetic/i)) return BY_ID['nhp-pk'];
      if (textHas(a, /xenograft|tumou?r|PDX|syngeneic|oncolog/i)) return BY_ID['cdx-xenograft'];
      return BY_CAT.invivo;
    }
    if (textHas(a, /\bMRD\b|residual disease/i)) return textHas(a, /ctDNA|plasma/i) ? BY_ID['mrd-ctdna'] : BY_ID['mrd-ngs-clonoseq'];
    if (textHas(a, /ctDNA|liquid biopsy/i)) return BY_ID['liquid-biopsy-ctdna'];
    // keyword fallbacks for new chapters
    if (a.category === 'disease-models') {
      if (textHas(a, /liver|hepat/i) && textHas(a, /chip|mps|microphysiolog/i)) return BY_ID['liver-mps'];
      return BY_CAT['disease-models'];
    }
    if (textHas(a, /organoid|organ-on|chip|iPSC|microphysiolog/i)) return rule('D', 'emerging', []);
    if (textHas(a, /flow cytometr/i)) return rule('B', 'flow', ['flow']);
    return BY_CAT[a.category] || rule('D', 'emerging', []);
  }

  function uniq(arr) {
    var seen = {}; var out = [];
    arr.forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  function validationFor(a) {
    var r = pickRule(a);
    return {
      tier: r.tier,
      basis: BASIS[r.basisKey] || BASIS.emerging,
      refs: (r.refs || []).map(function (k) { return { label: R[k].label, url: R[k].url }; }),
      ask: uniq((r.ask || []).concat(ASK_BY_TIER[r.tier] || []))
    };
  }

  function applyValidation(list) {
    (list || []).forEach(function (a) { if (a && a.id) a.validation = validationFor(a); });
    return list;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Returns HTML for an assay-page section. opts.no = section number string, e.g. "07".
  function renderValidation(a, opts) {
    opts = opts || {};
    var v = (a && a.validation) || (a ? validationFor(a) : null);
    if (!v) return '';
    var t = TIERS[v.tier] || TIERS.D;
    var no = opts.no ? '<span class="no">' + esc(opts.no) + '</span> ' : '';
    var refs = v.refs.length
      ? '<ul class="val-refs">' + v.refs.map(function (r) {
        return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.label) + '</a></li>';
      }).join('') + '</ul>'
      : '<p class="val-none">' + ((v.tier === 'A' || v.tier === 'B') ? 'The guideline or standard is named above; no link is listed here.' : 'No assay-type guideline or multi-site study is linked here.') + '</p>';
    var scale = ['A', 'B', 'C', 'D'].map(function (k) {
      return '<li class="val-step val-' + k.toLowerCase() + (k === v.tier ? ' is-current' : '') + '" title="' + esc(TIERS[k].name) + '"' +
        (k === v.tier ? ' aria-current="true"' : '') + '><b>' + k + '</b><span>' + esc(TIERS[k].name) + '</span></li>';
    }).join('');
    return '' +
      '<div class="section validation" id="validation">' +
        '<h2>' + no + 'Validation evidence</h2>' +
        '<div class="val-head">' +
          '<span class="tier-tag tier-' + v.tier.toLowerCase() + '">' + esc(t.label) + ' &middot; ' + esc(t.name) + '</span>' +
          '<ol class="val-scale" aria-label="Evidence tier scale">' + scale + '</ol>' +
        '</div>' +
        '<p class="val-basis">' + esc(v.basis) + '</p>' +
        '<p class="val-scope">Evidence describes the assay type, not any provider listed below.</p>' +
        '<div class="val-cols">' +
          '<div><h3>Guidelines and studies</h3>' + refs + '</div>' +
          '<div><h3>Ask the provider for</h3><ul class="val-ask">' + v.ask.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul></div>' +
        '</div>' +
      '</div>';
  }

  // Small inline tag for cards.
  function renderTierTag(a) {
    var v = (a && a.validation) || (a ? validationFor(a) : null);
    if (!v) return '';
    var t = TIERS[v.tier];
    return '<span class="tier-tag tier-' + v.tier.toLowerCase() + '" title="' + esc(t.desc) + '">' + esc(t.label) + '</span>';
  }

  if (typeof ASSAYS !== 'undefined') applyValidation(ASSAYS);

  window.TIERS = TIERS;
  window.VALIDATION_REFS = R;
  window.validationFor = validationFor;
  window.applyValidation = applyValidation;
  window.renderValidation = renderValidation;
  window.renderTierTag = renderTierTag;
})();
