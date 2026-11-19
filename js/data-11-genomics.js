// Expansion 11 - genomics round 2 (Nov 2026): WGS, WES/panels, liquid biopsy, MRD, cfDNA methylation, HLA typing.
// Classic script; needs P, pr (data-2.js) and A9 (data-9.js).

Object.assign(P, {
  guardant: { name: "Guardant Health", region: "US" },
  natera: { name: "Natera", region: "US" },
  foundation: { name: "Foundation Medicine", region: "US" },
  personalis: { name: "Personalis", region: "US" },
  neogenomics: { name: "NeoGenomics", region: "US" },
  bgi: { name: "BGI Genomics", region: "Global" },
  histogenetics: { name: "Histogenetics", region: "US" }
});

A9({
  id: "wgs", name: "Whole Genome Sequencing (WGS, short- and long-read)", category: "genomics",
  tagline: "Reads the whole genome. Finds every variant, from SNVs to large rearrangements.",
  tests: ["Germline and somatic variants genome-wide", "Structural variants and copy-number changes", "Off-target edits and vector integration in engineered cells", "Genetic drift of cell banks"],
  drugTypes: ["small-molecule", "antibody", "oligo", "cgt"],
  inst: [["NovaSeq X", "Illumina", "Short-read 30-100x WGS"], ["Revio", "PacBio", "HiFi long reads for SVs and phasing", "Optional"], ["PromethION", "Oxford Nanopore", "Ultra-long reads", "Optional"]],
  consumables: ["High-molecular-weight genomic DNA", "PCR-free library prep kit", "Flow cells", "Reference standards (e.g. GIAB NA12878)"],
  automation: "Library prep is automated; secondary analysis (alignment, variant calling) runs on standard pipelines such as DRAGEN or GATK.",
  steps: [
    "Extract and QC genomic DNA (integrity and quantity)",
    "Fragment DNA and build PCR-free libraries",
    "Sequence to 30x (germline) or 60-100x tumour / matched normal",
    "Align reads to the reference genome",
    "Call SNVs, indels, CNVs and structural variants",
    "Annotate and filter variants against databases",
    "Report findings and compare with controls or parental lines"
  ],
  providers: [pr("novogene", "Human and model-organism WGS"), pr("azenta", "Short- and long-read WGS"), pr("bgi", "DNBSEQ WGS service"), pr("personalis", "Clinical-grade tumour/normal WGS for trials")],
  marketNote: "Sequencing cost per 30x genome has dropped below a few hundred dollars, making WGS the default over arrays for many projects.",
  capacityNote: "Data storage and interpretation dominate cost; long reads still cost several times more than short reads."
});

A9({
  id: "wes-panel", name: "Whole Exome & Targeted Gene Panels", category: "genomics",
  tagline: "Sequences only the coding genes or a chosen panel, deeper and cheaper than WGS.",
  tests: ["Tumour mutation profiling and tumour mutational burden", "Biomarker selection for trial enrolment", "Germline variants in coding regions"],
  drugTypes: ["small-molecule", "antibody", "adc", "cgt", "oligo"],
  inst: [["NovaSeq / NextSeq", "Illumina", "Hybrid-capture sequencing"], ["Ion Torrent Genexus", "Thermo Fisher", "Amplicon panels", "Optional"]],
  consumables: ["FFPE or fresh tumour DNA plus matched normal", "Hybrid-capture exome or panel probes", "Library prep kits with UMIs", "Reference DNA controls"],
  automation: "Capture and library prep run on liquid handlers; FFPE DNA quality is the usual failure point.",
  steps: [
    "Extract DNA from tumour tissue and matched normal",
    "Fragment and build indexed libraries with UMIs",
    "Hybridise to exome or panel capture probes",
    "Sequence captured libraries to 100-500x (panels deeper)",
    "Call somatic variants against the matched normal",
    "Calculate TMB and microsatellite instability",
    "Report actionable variants and biomarker status"
  ],
  providers: [pr("foundation", "FoundationOne CDx tissue profiling for biopharma trials"), pr("personalis", "ImmunoID NeXT exome-scale tumour profiling"), pr("novogene", "WES service"), pr("azenta", "Exome and targeted sequencing")],
  marketNote: "Panels like FoundationOne CDx are FDA-approved companion diagnostics; WES is common in translational research.",
  capacityNote: "Turnaround is 1-3 weeks; FFPE artefacts and low tumour purity limit sensitivity."
});

A9({
  id: "liquid-biopsy-ctdna", name: "Liquid Biopsy (ctDNA Genomic Profiling)", category: "genomics",
  tagline: "Reads tumour DNA shed into blood. Profiles cancer without a tissue biopsy.",
  tests: ["Actionable mutations from plasma for trial enrolment", "Emerging resistance mutations on treatment", "Early treatment response from ctDNA changes"],
  drugTypes: ["small-molecule", "antibody", "adc"],
  inst: [["NovaSeq", "Illumina", "Deep targeted sequencing"], ["ddPCR (QX600)", "Bio-Rad", "Tracking known mutations", "Optional"]],
  consumables: ["Cell-free DNA blood collection tubes (Streck or similar)", "cfDNA extraction kits", "UMI library prep and capture panels", "Contrived ctDNA reference standards"],
  automation: "Central-lab workflow is automated; pre-analytics (tube type, time to plasma) drive quality.",
  steps: [
    "Collect blood into cfDNA-stabilising tubes",
    "Separate plasma by double centrifugation",
    "Extract cfDNA and check fragment size",
    "Build UMI-tagged libraries and capture a cancer gene panel",
    "Sequence deeply (often >10,000x raw)",
    "Collapse UMI families and call low-frequency variants",
    "Filter clonal haematopoiesis (CHIP) variants and report"
  ],
  providers: [pr("guardant", "Guardant360 CDx and GuardantOMNI for biopharma studies"), pr("foundation", "FoundationOne Liquid CDx"), pr("natera", "Liquid comprehensive genomic profiling")],
  marketNote: "Guardant360 CDx was the first FDA-approved comprehensive liquid biopsy; plasma-first testing speeds trial enrolment.",
  capacityNote: "Low tumour shedding gives false negatives; CHIP variants cause false positives without matched white-cell sequencing."
});

A9({
  id: "mrd-ctdna", name: "Molecular Residual Disease (MRD) by ctDNA", category: "genomics",
  tagline: "Detects traces of cancer left after surgery or treatment, months before imaging.",
  tests: ["Residual disease after curative-intent surgery", "Early recurrence during surveillance", "MRD-guided enrolment and response endpoints in trials"],
  drugTypes: ["small-molecule", "antibody", "adc", "cgt"],
  inst: [["NovaSeq", "Illumina", "Ultra-deep sequencing"], ["Tumour WES/WGS pipeline", "Provider-specific", "Variant selection for tumour-informed assays"]],
  consumables: ["Tumour tissue plus matched normal (tumour-informed)", "Serial plasma in cfDNA tubes", "Patient-specific multiplex PCR or capture panels", "Methylation panels (tissue-free assays)"],
  automation: "Fully centralised service; bespoke assay design adds 2-4 weeks for tumour-informed tests.",
  steps: [
    "Sequence tumour and matched normal by WES or WGS (tumour-informed)",
    "Select clonal tumour variants and design a patient-specific panel",
    "Collect serial plasma at landmark and surveillance time points",
    "Extract cfDNA and amplify or capture the tracked variants",
    "Sequence to very high depth",
    "Call ctDNA detected / not detected and estimate tumour fraction",
    "Report trends across time points for the trial"
  ],
  providers: [pr("natera", "Signatera and Signatera Genome tumour-informed MRD; Latitude tissue-free"), pr("guardant", "Guardant Reveal tissue-free methylation MRD"), pr("personalis", "NeXT Personal tumour-informed MRD")],
  marketNote: "Tumour-informed assays reach about 1 part per million; IMvigor011 was the first phase 3 showing MRD-guided adjuvant therapy improved survival.",
  capacityNote: "Tumour-informed tests need tissue and design time; tissue-free tests are faster but less sensitive."
});

A9({
  id: "mrd-ngs-clonoseq", name: "Haematologic MRD by NGS (clonoSEQ)", category: "genomics",
  tagline: "Tracks the patient's own cancer clone sequence to 1 in a million cells.",
  tests: ["MRD in multiple myeloma, ALL and CLL", "Depth of response as a trial endpoint", "Relapse monitoring"],
  drugTypes: ["antibody", "cgt", "small-molecule"],
  inst: [["NovaSeq / NextSeq", "Illumina", "Immunoglobulin rearrangement sequencing"]],
  consumables: ["Diagnostic bone marrow or blood (clone identification)", "Follow-up bone marrow or blood", "Multiplex Ig/TCR primer sets", "Spike-in quantitation controls"],
  automation: "Centralised FDA-cleared service.",
  steps: [
    "Sequence the diagnostic sample to identify the dominant malignant clonotypes",
    "Collect follow-up marrow or blood after treatment",
    "Extract DNA from up to millions of cells",
    "Amplify Ig/TCR rearrangements with multiplex primers",
    "Sequence and count the tracked clonotype sequences",
    "Report MRD as malignant cells per million nucleated cells"
  ],
  providers: [pr("adaptive", "clonoSEQ, FDA-cleared for MRD in myeloma, ALL and CLL")],
  marketNote: "FDA's 2024 ODAC backed MRD as an accelerated-approval endpoint in multiple myeloma, raising demand.",
  capacityNote: "Sensitivity depends on how many cells are sampled; needs a diagnostic sample to find the clone."
});

A9({
  id: "mrd-flow", name: "Flow Cytometry MRD (Multiparameter / Spectral)", category: "immunology",
  tagline: "Finds leukaemia cells with abnormal marker patterns down to 1 in 10,000.",
  tests: ["MRD in AML, ALL and myeloma bone marrow", "Response to induction and consolidation", "Blast and immune changes in the same tube"],
  drugTypes: ["small-molecule", "antibody", "cgt"],
  inst: [["Spectral flow cytometer (Aurora)", "Cytek", "High-parameter MRD panels"], ["FACSLyric / Navios", "BD / Beckman Coulter", "EuroFlow-style 8-10 colour panels"]],
  consumables: ["Fresh or stabilised bone marrow aspirate", "Validated MRD antibody panels", "Lyse/wash reagents", "Bead and cell-line controls"],
  automation: "Staining can be automated; gating needs expert review and must acquire 500,000-1,000,000+ CD45+ events.",
  steps: [
    "Collect bone marrow and stabilise or process within the allowed window",
    "Lyse red cells and count cells",
    "Stain with the MRD antibody panel",
    "Acquire at least 500,000-1,000,000 CD45+ events",
    "Gate for leukaemia-associated or different-from-normal phenotypes",
    "Report MRD percentage with limit of detection"
  ],
  providers: [pr("neogenomics", "Flow cytometry MRD for haematologic malignancies"), pr("teiko", "Spectral flow MRD on stabilised bone marrow (AML, in development with Univ. of Utah)")],
  marketNote: "Used in over 60% of AML MRD assessments; ELN guidelines define panels and thresholds.",
  capacityNote: "Sample age limits shipping; stabilisation kits extend the window but must be validated per panel."
});

A9({
  id: "cfdna-methylation", name: "cfDNA Methylation Profiling", category: "genomics",
  tagline: "Reads methylation in blood DNA. Detects and tracks cancer without tissue.",
  tests: ["Tissue-free tumour fraction and response monitoring", "Tissue of origin", "Patient segmentation when no genomic biomarker exists"],
  drugTypes: ["small-molecule", "antibody", "adc"],
  inst: [["NovaSeq", "Illumina", "Targeted methylation sequencing"]],
  consumables: ["cfDNA blood collection tubes", "Methylation partitioning or enzymatic conversion reagents", "Targeted methylation panels", "Methylated/unmethylated controls"],
  automation: "Central-lab service; extraction and partitioning are automated.",
  steps: [
    "Collect blood and isolate plasma",
    "Extract cfDNA",
    "Partition or convert DNA by methylation state",
    "Build libraries and enrich tumour-associated methylated regions",
    "Sequence enriched libraries",
    "Score methylation signals against normal controls",
    "Report ctDNA detected and tumour fraction over time"
  ],
  providers: [pr("guardant", "Guardant Infinity / Reveal methylation platform for biopharma"), pr("natera", "Latitude tissue-free methylation assay")],
  marketNote: "Methylation avoids the need for tissue and is less affected by CHIP than mutation-based assays.",
  capacityNote: "Less sensitive than tumour-informed MRD at very low tumour fraction."
});

A9({
  id: "hla-typing", name: "High-Resolution HLA Typing", category: "genomics",
  tagline: "Determines HLA alleles. Needed for T-cell therapies, vaccines and immunogenicity.",
  tests: ["Patient eligibility for HLA-restricted TCR therapies", "Donor matching for allogeneic cell therapy", "HLA-linked immunogenicity and neoantigen prediction"],
  drugTypes: ["cgt", "peptide", "antibody"],
  inst: [["MiSeq / NextSeq", "Illumina", "NGS HLA typing"], ["Sequel / Revio", "PacBio", "Full-length allele phasing", "Optional"]],
  consumables: ["Blood, buccal swab or DNA", "Long-range HLA PCR or capture kits", "Allele reference database (IPD-IMGT/HLA)"],
  automation: "High-throughput NGS workflow; typing software assigns alleles automatically.",
  steps: [
    "Extract genomic DNA",
    "Amplify or capture HLA class I and II genes",
    "Build indexed libraries",
    "Sequence the HLA loci",
    "Assign alleles against IPD-IMGT/HLA",
    "Report 2-field or higher resolution genotypes"
  ],
  providers: [pr("histogenetics", "High-throughput HLA typing for registries and trials"), pr("novogene", "HLA typing by sequencing")],
  marketNote: "TCR-T products such as afami-cel are restricted to HLA-A*02 patients, making typing a screening step.",
  capacityNote: "Routine and fast; ambiguities need long-read or extra exons."
});
