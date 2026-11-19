// Expansion 12 - Production and scale-up (Nov 2026, @DVirilis / Acies Bio).
// Making the molecule, not testing it. Load after data-11, before stages.js.
// Uses P and pr() from data-2.js. Plain ASCII.

(function () {
  var add = {
    acies: { name: "Acies Bio", region: "SI (Ljubljana)" },
    biomay: { name: "Biomay", region: "AT" },
    richterhelm: { name: "Richter-Helm BioLogics", region: "DE" },
    fujidiosynth: { name: "FUJIFILM Biotechnologies (Diosynth)", region: "UK/US/DK" },
    agcbio: { name: "AGC Biologics", region: "Global" },
    samsungbio: { name: "Samsung Biologics", region: "KR" },
    genscript: { name: "GenScript ProBio", region: "Global" },
    absoluteab: { name: "Absolute Antibody", region: "UK/US" },
    atum: { name: "ATUM", region: "US" },
    tierra: { name: "Tierra Biosciences", region: "US" },
    leniobio: { name: "LenioBio", region: "DE" },
    bachem: { name: "Bachem", region: "CH/US" },
    polypeptide: { name: "PolyPeptide Group", region: "SE/US/IN" },
    cordenpharma: { name: "CordenPharma", region: "EU/US" },
    nittoavecia: { name: "Nitto Avecia", region: "US" },
    agilentnasd: { name: "Agilent Nucleic Acid Solutions", region: "US" },
    stpharm: { name: "ST Pharm", region: "KR" },
    hongene: { name: "Hongene Biotech", region: "CN/US" }
  };
  Object.keys(add).forEach(function (k) { if (!P[k]) P[k] = add[k]; });
})();

function A12(o) {
  o.instruments = o.inst.map(function (r) {
    return { name: r[0], vendor: r[1], role: r[2], note: r[3] || "" };
  });
  delete o.inst;
  o.category = "production";
  if (!ASSAYS.some(function (x) { return x.id === o.id; })) ASSAYS.push(o);
}

A12({
  id: "ecoli-expression",
  name: "E. coli Protein and Peptide Expression (mg to kg)",
  scale: "mg (shake flask) to g (10-50 L) to kg (1,000 L+)",
  tagline: "Grows recombinant proteins and peptides in bacteria, from a flask to a fermenter.",
  tests: [
    "Expression titer and soluble vs inclusion-body yield",
    "Identity and purity of the recovered product",
    "Endotoxin and host-cell protein after capture"
  ],
  drugTypes: ["peptide", "antibody"],
  inst: [
    ["Stirred-tank fermenter", "Sartorius", "Fed-batch E. coli culture"],
    ["HPLC", "Agilent", "Titer and purity"]
  ],
  consumables: [
    "Codon-optimised expression plasmid",
    "Production strain and antibiotic",
    "Defined or complex media",
    "Capture resin"
  ],
  automation: "Fed-batch feeds and dissolved-oxygen control are automated; harvest is still a manual step at small scale.",
  steps: [
    "Clone the gene and pick a host strain",
    "Screen clones in shake flasks for titer and solubility",
    "Run a fed-batch fermentation and induce expression",
    "Harvest cells and lyse, or wash inclusion bodies",
    "Capture and polish the product",
    "Confirm identity, purity and endotoxin"
  ],
  providers: [
    pr("acies", "E. coli and other microbial hosts; strain design through contract fermentation"),
    pr("biomay", "Microbial recombinant protein for research and clinical supply"),
    pr("genscript", "E. coli expression from micrograms to gram scale")
  ],
  marketNote: "Bacterial expression is the cheapest path to grams of a simple protein or peptide. It fails when the product needs human glycosylation.",
  capacityNote: "Shake-flask material is days away. A 1,000 L campaign needs a booked fermenter and weeks of process work."
});

A12({
  id: "yeast-expression",
  name: "Yeast and Pichia Protein Expression",
  scale: "mg to multi-kg (pilot to 10,000 L)",
  tagline: "Secretes proteins from yeast. Often cleaner than E. coli, and it can add some glycosylation.",
  tests: [
    "Secreted titer in supernatant",
    "Glycosylation pattern versus the intended product",
    "Protease clipping and host-protein carryover"
  ],
  drugTypes: ["peptide", "antibody"],
  inst: [
    ["Fermenter", "Sartorius", "High-cell-density Pichia culture"],
    ["CE or HPLC", "Agilent", "Product quality"]
  ],
  consumables: [
    "Integrative expression cassette",
    "Methanol or methanol-free induction media",
    "Secretion-signal variants"
  ],
  automation: "Feed and methanol control are automated. Clone screening is the slow step.",
  steps: [
    "Build an integrative expression strain",
    "Screen clones for secreted titer",
    "Run a high-cell-density fed-batch",
    "Clarify broth and capture the secreted product",
    "Check glycosylation and clipping"
  ],
  providers: [
    pr("acies", "Pichia, Bacillus and fungal hosts; lab scale to a 30 m3 fermenter"),
    pr("biomay", "Yeast expression for protein supply"),
    pr("richterhelm", "Microbial CDMO, including yeast")
  ],
  marketNote: "Chosen when E. coli makes inclusion bodies or the product needs secretion. Not a substitute for CHO when the glycan must be human.",
  capacityNote: "Acies Bio publishes contract fermentation from the bench through a demonstration plant with fermenters up to 10,000 L, and a 30 m3 site."
});

A12({
  id: "fermentation-pd",
  name: "Fermentation Process Development and Scale-up",
  scale: "2 L bench to 10,000 L demonstration",
  tagline: "Turns a working strain into a fed-batch process that still works in a bigger tank.",
  tests: [
    "Titer, yield and productivity versus scale",
    "Dissolved oxygen, pH and feed strategy",
    "Batch-to-batch consistency"
  ],
  drugTypes: ["peptide", "small-molecule", "antibody"],
  inst: [
    ["Parallel bioreactors", "Sartorius Ambr", "Small-scale process screens"],
    ["Pilot fermenter", "Sartorius or Eppendorf", "Scale-down model"]
  ],
  consumables: ["Media component library", "Feed concentrates", "Antifoam", "Offline metabolite assay kits"],
  automation: "Ambr-style parallel bioreactors automate the screen. Pilot runs still need an operator.",
  steps: [
    "Define the product spec and the target scale",
    "Screen media and feed in parallel small bioreactors",
    "Lock a fed-batch recipe on a scale-down model",
    "Run a pilot batch and compare titers",
    "Write the batch record for tech transfer"
  ],
  providers: [
    pr("acies", "Bioprocess development and scale-up, including a 30 m3 fermenter"),
    pr("richterhelm", "Microbial process development and GMP manufacturing"),
    pr("biomay", "Process development into clinical supply")
  ],
  marketNote: "This is the step between a lab strain and a kilo campaign. Most delays are oxygen transfer and media cost, not the gene.",
  capacityNote: "A first pilot batch is often 6-12 weeks after the strain exists. Book the larger tank before the pilot finishes."
});

A12({
  id: "downstream-scaleup",
  name: "Downstream Purification Scale-up",
  scale: "mg lab columns to kg process columns",
  tagline: "Scales capture, polish and formulation so the kilo batch is as clean as the milligram batch.",
  tests: [
    "Step yield and purity at each column",
    "Host-cell protein, DNA and endotoxin clearance",
    "Aggregate and fragment levels"
  ],
  drugTypes: ["antibody", "peptide", "cgt"],
  inst: [
    ["AKTA or process skid", "Cytiva", "Chromatography scale-up"],
    ["TFF system", "Repligen or Sartorius", "Concentration and buffer exchange"]
  ],
  consumables: ["Capture and polish resins", "TFF cassettes", "Process buffers", "Endotoxin reagents"],
  automation: "Process skids run the gradient. Resin packing and filter sizing are still designed by hand.",
  steps: [
    "Map the lab purification and the impurities that matter",
    "Scale column diameter and keep bed height and residence time",
    "Run a scaled capture and polish",
    "Concentrate and formulate by TFF",
    "Release on identity, purity and endotoxin"
  ],
  providers: [
    pr("acies", "Downstream processing of fermentation broth"),
    pr("agcbio", "Biologics purification development and GMP"),
    pr("fujidiosynth", "Process and purification development into clinical supply")
  ],
  marketNote: "Purification, not fermentation, often sets the cost per gram once titer is decent.",
  capacityNote: "Resin and filter lead times can be longer than the fermentation slot."
});

A12({
  id: "mammalian-transient",
  name: "Transient Mammalian Expression (mg to g)",
  scale: "mg to low grams",
  tagline: "Makes antibody or protein in HEK or CHO cells for a few weeks, without a stable cell line.",
  tests: [
    "Titer from transient transfection",
    "Binding or activity of the recovered protein",
    "Aggregation and endotoxin"
  ],
  drugTypes: ["antibody", "adc"],
  inst: [
    ["Wave or stirred bioreactor", "Cytiva or Sartorius", "Transient culture"],
    ["Protein A column", "Cytiva", "Antibody capture"]
  ],
  consumables: ["Expression plasmid", "HEK or CHO host", "Transfection reagent", "Protein A resin"],
  automation: "Transfection and feed can be scripted. Most shops still do this as a service, not a self-run assay.",
  steps: [
    "Prepare endotoxin-free plasmid",
    "Transfect HEK or CHO at litre scale",
    "Harvest supernatant at peak titer",
    "Protein A capture and polish",
    "QC: concentration, purity, endotoxin, activity"
  ],
  providers: [
    pr("absoluteab", "Recombinant antibody expression, research scale"),
    pr("genscript", "Transient antibody and protein, mg to g"),
    pr("atum", "Transient expression and codon optimisation")
  ],
  marketNote: "The default way to get the first 10-100 mg of an antibody. Too expensive per gram once you need hundreds of grams.",
  capacityNote: "Typical turnaround is 3-6 weeks for tens of milligrams."
});

A12({
  id: "cell-line-development",
  name: "Stable Cell Line Development (CHO)",
  scale: "research pools to GMP master cell bank",
  tagline: "Builds a CHO clone that can supply clinical and commercial antibody.",
  tests: [
    "Specific productivity and stability over generations",
    "Product quality versus the transient reference",
    "Clonality and cell-bank safety"
  ],
  drugTypes: ["antibody", "adc"],
  inst: [
    ["Clone picker / Beacon or FACS", "Berkeley Lights or BD", "Single-cell cloning"],
    ["Ambr 15 or 250", "Sartorius", "Fed-batch clone ranking"]
  ],
  consumables: ["CHO host licence", "Selection marker", "Single-cell cloning plates", "Banking vials"],
  automation: "Clone screening is highly automated. The cell-bank paperwork is not.",
  steps: [
    "Transfect a CHO host and select pools",
    "Single-cell clone and expand",
    "Rank clones in a small fed-batch",
    "Confirm stability and product quality",
    "Bank a research or GMP master cell bank"
  ],
  providers: [
    pr("fujidiosynth", "Cell line development into clinical and commercial supply"),
    pr("samsungbio", "CHO cell line and large-scale biologics manufacturing"),
    pr("agcbio", "Cell line development and GMP biologics")
  ],
  marketNote: "This is the gate between a research antibody and an IND-enabling tox lot.",
  capacityNote: "A research clone is months, not weeks. A GMP bank adds testing and documentation on top."
});

A12({
  id: "spps-peptide",
  name: "Solid-Phase Peptide Manufacturing (mg to kg)",
  scale: "5 mg research to multi-kg GMP",
  tagline: "Synthesises the peptide chemically. The path for most therapeutic peptides, including GLP-1s.",
  tests: [
    "Crude purity after cleavage",
    "Final purity, identity and residual solvent",
    "Counter-ion and peptide content"
  ],
  drugTypes: ["peptide"],
  inst: [
    ["SPPS reactor", "Bachem or CEM", "Solid-phase synthesis"],
    ["Prep HPLC", "various", "Purification"]
  ],
  consumables: ["Fmoc amino acids", "Resin", "Coupling reagents", "Cleavage cocktail"],
  automation: "Research synthesisers are automated. Kilo-scale SPPS is a plant process with a batch record.",
  steps: [
    "Design the sequence and protecting groups",
    "Run SPPS and cleave from the resin",
    "Purify by prep HPLC",
    "Lyophilise and test purity and identity",
    "Scale the same chemistry under GMP if needed"
  ],
  providers: [
    pr("bachem", "SPPS from research grams to GMP multi-kg and tonne scale"),
    pr("polypeptide", "Peptide API development and GMP manufacturing"),
    pr("cordenpharma", "Peptide CDMO, clinical to commercial")
  ],
  marketNote: "Bachem states research synthesis from about 5 mg and GMP production from grams toward multi-tonne commercial volumes.",
  capacityNote: "Long peptides and scarce amino acids, not the reactor, usually set the lead time."
});

A12({
  id: "oligo-manufacturing",
  name: "Oligonucleotide Manufacturing (ASO, siRNA)",
  scale: "mg research to kg GMP",
  tagline: "Makes antisense oligos and siRNA by phosphoramidite chemistry, then purifies them.",
  tests: [
    "Full-length purity and n-1 impurity",
    "Identity by mass",
    "Residual solvent and metal"
  ],
  drugTypes: ["oligo"],
  inst: [
    ["Oligo synthesiser", "Cytiva or AKTA oligopilot", "Solid-phase synthesis"],
    ["LC-MS", "Agilent or Waters", "Identity and purity"]
  ],
  consumables: ["Phosphoramidites", "Solid support", "Capping and oxidiser reagents", "Purification resin"],
  automation: "Synthesis cycles are automated. Purification and lyophilisation dominate the calendar.",
  steps: [
    "Specify sequence, chemistry and scale",
    "Synthesise on solid support",
    "Cleave, deprotect and purify",
    "Desalt and lyophilise",
    "Release on purity, identity and residuals"
  ],
  providers: [
    pr("bachem", "Oligonucleotide API as well as peptides"),
    pr("agilentnasd", "Therapeutic oligo development and GMP"),
    pr("nittoavecia", "Oligonucleotide CDMO"),
    pr("stpharm", "Oligonucleotide manufacturing")
  ],
  marketNote: "ASO and siRNA programs need this before any in vivo work beyond the first mouse study.",
  capacityNote: "GMP kilo slots are booked months ahead. Research mg batches are much faster."
});

A12({
  id: "cell-free-expression",
  name: "Cell-Free Protein Expression",
  scale: "ug to low grams",
  tagline: "Makes protein in a lysate, with no living cell. Useful for toxic proteins and fast variants.",
  tests: [
    "Yield per millilitre of lysate",
    "Solubility and activity",
    "Batch-to-batch lysate consistency"
  ],
  drugTypes: ["peptide", "antibody"],
  inst: [
    ["Thermomixer or bioreactor", "various", "Cell-free reaction"],
    ["HPLC or PAGE", "various", "Yield check"]
  ],
  consumables: ["Cell-free lysate or kit", "DNA template", "Energy mix", "Amino acids"],
  automation: "Small reactions fit a liquid handler. Scale-up is limited by lysate cost.",
  steps: [
    "Prepare a DNA template",
    "Run a small lysate reaction and check yield",
    "Scale the reaction if the yield holds",
    "Purify and confirm activity"
  ],
  providers: [
    pr("tierra", "Cell-free protein, including custom sequences"),
    pr("leniobio", "Eukaryotic cell-free expression"),
    pr("genscript", "Cell-free as a fast expression option")
  ],
  marketNote: "A screening tool more than a kilo supply route. Cost per gram stays high.",
  capacityNote: "Hours to a first microgram. Grams need a custom lysate campaign."
});

A12({
  id: "gmp-tech-transfer",
  name: "GMP Tech Transfer and Clinical Batch",
  scale: "clinical batch (grams to kg, modality-dependent)",
  tagline: "Moves a working process into a GMP plant and makes the batch for the trial.",
  tests: [
    "Process fits the receiving plant",
    "Engineering batch matches the sending site",
    "GMP batch meets the release spec"
  ],
  drugTypes: ["antibody", "peptide", "oligo", "cgt"],
  inst: [
    ["GMP fermenter or synthesis plant", "site-specific", "Clinical batch"],
    ["QC lab (HPLC, endotoxin, bioburden)", "various", "Release testing"]
  ],
  consumables: ["Tech-transfer package", "Raw materials with CoA", "Batch records", "Reference standard"],
  automation: "The plant is automated. The transfer itself is documents, gap assessments and an engineering run.",
  steps: [
    "Send the process description and analytical methods",
    "Run a gap assessment against the receiving plant",
    "Execute an engineering batch",
    "Manufacture the GMP clinical batch",
    "Release against the specification"
  ],
  providers: [
    pr("fujidiosynth", "GMP biologics tech transfer and clinical supply"),
    pr("agcbio", "GMP manufacturing and tech transfer"),
    pr("bachem", "GMP peptide and oligo clinical supply"),
    pr("samsungbio", "Large-scale GMP biologics")
  ],
  marketNote: "This is manufacturing, not an assay. It is listed because expression data is useless if the process cannot transfer.",
  capacityNote: "Slot lead times are often longer than the science. Ask for the next GMP window before the engineering batch."
});
