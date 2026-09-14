export interface MetrologyDocument {
  id: string;
  title: string;
  url: string;
  category: 'Act' | 'Rules' | 'Amendment Rules' | 'Notification' | 'Corrigendum' | 'Guidelines' | 'Advisory' | 'SoP' | 'Model Rules';
  documentType: string;
  year: string;
  dateOfIssue?: string;
  description: string;
  tags: string[];
  isCorePCR?: boolean;
}

export const OFFICIAL_METROLOGY_DOCUMENTS: MetrologyDocument[] = [
  {
    id: "act-2009",
    title: "The Legal Metrology Act, 2009",
    url: "https://indiacode.nic.in/handle/123456789/2102?view_type=search#_blank",
    category: "Act",
    documentType: "Act",
    year: "2009",
    dateOfIssue: "13/01/2010",
    description: "The primary parliamentary legislation governing standards of weights and measures, regulation of trade and commerce in pre-packaged commodities (Section 18), and enforcement penalties (Section 36).",
    tags: ["primary_act", "statute", "section_18", "section_36", "penalties"],
    isCorePCR: true
  },
  {
    id: "act-corrigendum-1",
    title: "1st Corrigendum in the Act",
    url: "http://consumeraffairs.gov.in/public/upload/files/1%28i%29_0_1732708062.pdf",
    category: "Corrigendum",
    documentType: "Corrigendum",
    year: "2010",
    dateOfIssue: "",
    description: "1st Corrigendum addressing typographical and statutory references in The Legal Metrology Act, 2009.",
    tags: ["corrigendum", "amendment"]
  },
  {
    id: "act-corrigendum-2",
    title: "2nd Corrigendum in the Act",
    url: "http://consumeraffairs.gov.in/public/upload/files/1%28ii%29_0_1732708111.pdf",
    category: "Corrigendum",
    documentType: "Corrigendum",
    year: "2010",
    dateOfIssue: "",
    description: "2nd Corrigendum in The Legal Metrology Act, 2009.",
    tags: ["corrigendum", "amendment"]
  },
  {
    id: "notif-2011-01-01",
    title: "Notification 1st January 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/1%28iii%29_0_1732708160.pdf",
    category: "Notification",
    documentType: "Notification",
    year: "2011",
    dateOfIssue: "01/01/2011",
    description: "Initial commencement notification appointing enforcement dates for statutory provisions of the Legal Metrology Act.",
    tags: ["commencement", "enforcement"]
  },
  {
    id: "notif-2011-01-31",
    title: "Notification 31st January 2011 Implemented W.e.f 1.4.2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/1%28iv%29_1_1732708202.pdf",
    category: "Notification",
    documentType: "Notification",
    year: "2011",
    dateOfIssue: "01/31/2011",
    description: "Statutory notification confirming nationwide implementation of Legal Metrology regulations with effect from 1st April 2011.",
    tags: ["commencement", "enforcement"]
  },
  {
    id: "jan-vishwas-2023",
    title: "Jan Vishwas (Amendment of Provisions) Act, 2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/Jan%20Vishwas%20%28Amendment%20of%20Provisions%29%20Act%2C%202023%20%2818%20of%202023%29_1732708241.pdf",
    category: "Act",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "11/08/2023",
    description: "Landmark parliamentary amendment decriminalizing minor technical infractions under the Legal Metrology Act, 2009 and introducing compoundable administrative penalties.",
    tags: ["jan_vishwas", "decriminalization", "penalties", "section_36", "compliance"],
    isCorePCR: true
  },
  {
    id: "notif-jan-vishwas-2023",
    title: "Notification for enforcement of provisions of The Legal Metrology Act, 2009 under the Jas Vishwas Act, 2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/Notification%20for%20enforcement%20of%20provisions%20of%20LM%20ACt%20under%20the%20Jas%20Vishwas%20Act%2C%202023_1732708333.pdf",
    category: "Notification",
    documentType: "Notification",
    year: "2023",
    dateOfIssue: "",
    description: "Enforcement notification specifying operative schedules for Legal Metrology provisions revised under the Jan Vishwas Act.",
    tags: ["jan_vishwas", "enforcement", "notification"],
    isCorePCR: true
  },
  {
    id: "jan-vishwas-2026",
    title: "The Jan Vishwas (Amendment of Provisions) Act, 2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/2026.4.8%20Jan%20Vishwas%20Act%202026_1777014384.pdf",
    category: "Act",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "08/04/2026",
    description: "Next-generation reform expanding administrative adjudication, rationalizing inspection protocols, and updating fine structures for packaging violations.",
    tags: ["jan_vishwas", "2026", "decriminalization", "penalties", "modernization"],
    isCorePCR: true
  },
  {
    id: "notif-jan-vishwas-2026",
    title: "Implementation of the provisions of Jan Vishwas (Amendment of Provisions) Act, 2026 for Legal Metrology Act, 2009",
    url: "https://consumeraffairs.gov.in/public/upload/files/2026.4.27%20JV%20Act%202026%20for%20LM%20Act_1777348318.pdf",
    category: "Notification",
    documentType: "Notification",
    year: "2026",
    dateOfIssue: "27/04/2026",
    description: "Gazette notification appointing enforcement dates for the Jan Vishwas Act 2026 across Central and State Legal Metrology Directorates.",
    tags: ["jan_vishwas", "2026", "enforcement", "gazette"],
    isCorePCR: true
  },
  {
    id: "national-standards-2011",
    title: "The Legal Metrology Act (National Standards) Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/stdrules-compressed_0_1732708966.pdf",
    category: "Rules",
    documentType: "Rules",
    year: "2011",
    dateOfIssue: "",
    description: "Specifications for primary, secondary, and working standards of length, mass, and volume maintained at the National Physical Laboratory.",
    tags: ["standards", "calibration", "national_standards"]
  },
  {
    id: "national-standards-2019",
    title: "The Legal Metrology Act (National Standards) (Amendment) Rules, 2019",
    url: "http://consumeraffairs.gov.in/public/upload/files/National_Std_Rules2019_1732709005.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2019",
    dateOfIssue: "",
    description: "Updated technical tolerances and traceability norms for secondary standards.",
    tags: ["standards", "calibration"]
  },
  {
    id: "numeration-rules-2011",
    title: "The Legal Metrology (Numeration) Rules, 2011.",
    url: "http://consumeraffairs.gov.in/public/upload/files/3_0_0_1732709063.pdf",
    category: "Rules",
    documentType: "Rules",
    year: "2011",
    dateOfIssue: "",
    description: "Statutory rules governing manner of writing numerals and expressions of numbers in metric units on commodity packages.",
    tags: ["numerals", "metric_units", "declarations"],
    isCorePCR: true
  },
  {
    id: "numeration-amendment-2011",
    title: "The Legal Metrology (Numeration) Amendment Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/3%28i%29_0_1732709154.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2011",
    dateOfIssue: "",
    description: "Refinement of decimal notation and scientific numeration rules on labels.",
    tags: ["numerals", "metric_units"],
    isCorePCR: true
  },
  {
    id: "iilm-rules-2011",
    title: "The Indian Institute of Legal Metrology Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/4_0_1732709211.pdf",
    category: "Rules",
    documentType: "Rules",
    year: "2011",
    dateOfIssue: "",
    description: "Training programs, curriculum, and qualification standards for Legal Metrology officers at IILM Ranchi.",
    tags: ["iilm", "officers", "training"]
  },
  {
    id: "approval-of-models-2011",
    title: "The Legal Metrology (Approval of Models) Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/approval_of_models_rules_0_1732709311.pdf",
    category: "Rules",
    documentType: "Rules",
    year: "2011",
    dateOfIssue: "",
    description: "Procedures and testing protocols for pattern approval of weighing and measuring instruments before manufacturing or import.",
    tags: ["model_approval", "instruments", "weighing"]
  },
  {
    id: "notif-approval-models-2011",
    title: "Notification The Legal Metrology (Approval of Models) Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/5%28i%29_0_1732709347.pdf",
    category: "Notification",
    documentType: "Notification",
    year: "2011",
    dateOfIssue: "",
    description: "Notification bringing Approval of Models Rules into legal effect.",
    tags: ["model_approval", "notification"]
  },
  {
    id: "approval-models-2019",
    title: "The Legal Metrology (Approval of Models) (Amendment) Rules, 2019",
    url: "http://consumeraffairs.gov.in/public/upload/files/2019%20Amendment%20Approval%20of%20models%20Rules_1732709395.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2019",
    dateOfIssue: "",
    description: "Expedited model approval pathways for verified international OIML certifications.",
    tags: ["model_approval", "oiml"]
  },
  {
    id: "general-rules-2011",
    title: "The Legal Metrology (General) Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/6_0_1732709495.pdf",
    category: "Rules",
    documentType: "Rules",
    year: "2011",
    dateOfIssue: "",
    description: "Comprehensive technical regulations for verification, stamping, maximum permissible errors, and verification fees for weighing & measuring instruments.",
    tags: ["general_rules", "verification", "stamping", "errors"]
  },
  {
    id: "general-corrigendum-2011",
    title: "Corrigendum- The Legal Metrology (General) Rules, 2011",
    url: "https://consumeraffairs.gov.in/public/upload/files/GeneralRule11_c_1745998483.pdf",
    category: "Corrigendum",
    documentType: "Corrigendum",
    year: "2011",
    dateOfIssue: "",
    description: "Corrigendum rectifying error limits in General Rules 2011.",
    tags: ["general_rules", "corrigendum"]
  },
  {
    id: "general-amendment-2012",
    title: "The Legal Metrology (General) Amendment Rules, 2012",
    url: "http://consumeraffairs.gov.in/public/upload/files/6%28ii%29_0_1732709637.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2012",
    dateOfIssue: "",
    description: "First amendment to General Rules clarifying fee schedules.",
    tags: ["general_rules", "fees"]
  },
  {
    id: "general-amendment-2016",
    title: "The Legal Metrology (General Rule) Amendment Rules, 2016 - Automatic instruments for weighing road vehicles in motion and measuring axle loads",
    url: "http://consumeraffairs.gov.in/public/upload/files/6%28iii%29_1732709674.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2016",
    dateOfIssue: "",
    description: "Specifications for Weigh-in-Motion (WIM) automatic weighbridges and axle load monitoring.",
    tags: ["weighbridges", "wim", "axle_load"]
  },
  {
    id: "general-amendment-2021",
    title: "The Legal Metrology (General) (Amendment) Rules, 2021",
    url: "http://consumeraffairs.gov.in/public/upload/files/LM_General_Amendment_Rules2021_1732709906.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2021",
    dateOfIssue: "",
    description: "Revision of verification cycles and digitization of e-stamping certificates.",
    tags: ["general_rules", "verification"]
  },
  {
    id: "general-amendment-2022",
    title: "The Legal Metrology (General) Amendment Rules, 2022",
    url: "http://consumeraffairs.gov.in/public/upload/files/239353_1732709948.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2022",
    dateOfIssue: "",
    description: "Modernization of laboratory verification standards.",
    tags: ["general_rules", "standards"]
  },
  {
    id: "general-amendment-radar-2025",
    title: "The Legal Metrology (General) Amendment Rules, 2025 - Radar Equipment for measuring speed of the vehicles",
    url: "https://consumeraffairs.gov.in/public/upload/files/Radar%20Equipment%20Gen%20Rules%20Amendment%20%281%29_1746001628.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "",
    description: "Standards and verification procedures for radar speed cameras and vehicle velocity measurement devices.",
    tags: ["radar", "speed_measurement", "traffic"]
  },
  {
    id: "general-second-gas-2025",
    title: "The Legal Metrology (General) Second Amendment Rules, 2025 - Gas Meters",
    url: "https://consumeraffairs.gov.in/public/upload/files/2025.4.21%20Gas%20Meter%20General%20Rules_1746001659.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "21/04/2025",
    description: "Comprehensive statutory technical standard for domestic and industrial piped natural gas (PNG) meters.",
    tags: ["gas_meters", "png", "utility"]
  },
  {
    id: "general-second-gas-corrigendum-2025",
    title: "The Legal Metrology (General) Second Amendment Rules, 2025 - Gas Meters - corrigendum",
    url: "https://consumeraffairs.gov.in/public/upload/files/Corrigendum%20Gas%20Meters_1754973853.pdf",
    category: "Corrigendum",
    documentType: "Corrigendum",
    year: "2025",
    dateOfIssue: "",
    description: "Corrigendum for Gas Meter testing specifications.",
    tags: ["gas_meters", "corrigendum"]
  },
  {
    id: "general-third-sphyg-2025",
    title: "The Legal Metrology (General) Third Amendment Rules, 2025 - sphygmomanometer",
    url: "https://consumeraffairs.gov.in/public/upload/files/Sphygmomanomneters%20General%20Rules_1754973919.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "",
    description: "Stringent clinical accuracy and calibration standards for manual and digital sphygmomanometers (blood pressure meters).",
    tags: ["medical_devices", "sphygmomanometer", "blood_pressure"]
  },
  {
    id: "general-fourth-moisture-2025",
    title: "The Legal Metrology (General) Fourth Amendment Rules, 2025 - Moisture Meters",
    url: "https://consumeraffairs.gov.in/public/upload/files/Gen%20Rule-%20Moisture%20Meters_1755669735.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "",
    description: "Specifications for electronic grain and seed moisture meters used at agricultural mandis.",
    tags: ["agriculture", "moisture_meters", "grains"]
  },
  {
    id: "general-fifth-thermo-2025",
    title: "The Legal Metrology (General) Fifth Amendment Rules, 2025 - Thermometers",
    url: "https://consumeraffairs.gov.in/public/upload/files/Gen%20Rules%205th%20Amendment%20Thermometers_1756975842.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "",
    description: "Standards for clinical infrared and digital contact thermometers.",
    tags: ["thermometers", "medical_devices"]
  },
  {
    id: "general-sixth-breath-2025",
    title: "The Legal Metrology (General) Sixth Amendment Rules, 2025. - Breath Analyser",
    url: "https://consumeraffairs.gov.in/public/upload/files/Gen%20Rules%206th%20Amendment%20Breath%20Analyser_1764862018.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "",
    description: "Statutory calibration and evidentiary tolerances for police and workplace breath alcohol analyzers.",
    tags: ["breath_analyser", "forensic", "calibration"]
  },
  {
    id: "general-seventh-2yr-2025",
    title: "The Legal Metrology (General) Seventh Amendment Rules, 2025",
    url: "https://consumeraffairs.gov.in/public/upload/files/2025.12.18%20Gen%20Rules%207th%20Amendment%202%20yr%20verification%20period_1766504014.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "18/12/2025",
    description: "Extension of re-verification interval to 2 years for non-automatic electronic weighing instruments with tamper-proof seals.",
    tags: ["verification_period", "ease_of_business", "stamping"]
  },
  {
    id: "general-amendment-2026",
    title: "The Legal Metrology (General) Amendment Rules, 2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/LM_General_Rule_Amendment_2026_1768192719.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "",
    description: "Comprehensive 2026 update to General Rules verification benchmarks.",
    tags: ["general_rules", "2026"]
  },
  {
    id: "general-second-elec-thermo-2026",
    title: "The Legal Metrology (General) Second Amendment Rules, 2026 - Continuous Electrical Thermometer",
    url: "https://consumeraffairs.gov.in/public/upload/files/Continuous_Electrical_Thermometer_1771307283.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "",
    description: "Standards for continuous electrical thermometers deployed in cold chain and pharmaceutical storage.",
    tags: ["cold_chain", "pharma", "thermometer"]
  },
  {
    id: "general-third-2026",
    title: "The Legal Metrology (General) Third Amendment Rules, 2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/GSR%20175%28E%29_1777015860.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "",
    description: "Gazette notification G.S.R. 175(E) modifying stamping schedules.",
    tags: ["stamping", "gsr"]
  },
  {
    id: "general-fourth-nawi-2026",
    title: "The Legal Metrology (General) Fourth Amendment Rules, 2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/Gen_Rules_4th_Amendment_NAWI_Fees_1783336378.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "",
    description: "Rationalized fee structure for Non-Automatic Weighing Instruments (NAWI) across retail and commercial outlets.",
    tags: ["nawi", "fees", "weighing_scales"]
  },
  {
    id: "gatc-rules-2013",
    title: "The Legal Metrology (Government Approved Test Centre) Rules, 2013",
    url: "http://consumeraffairs.gov.in/public/upload/files/gatc_1732710153.pdf",
    category: "Rules",
    documentType: "Rules",
    year: "2013",
    dateOfIssue: "",
    description: "Framework authorizing private and public Government Approved Test Centres (GATCs) to verify and stamp non-critical instruments.",
    tags: ["gatc", "test_centres", "accreditation"]
  },
  {
    id: "gatc-amendment-2016",
    title: "The Legal Metrology (Government Approved Test Centre) Amendment Rules, 2016",
    url: "http://consumeraffairs.gov.in/public/upload/files/7%28ii%29_0_1732710215.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2016",
    dateOfIssue: "",
    description: "First amendment expanding scope of test equipment eligible for GATC certification.",
    tags: ["gatc"]
  },
  {
    id: "gatc-amendment-2021",
    title: "The Legal Metrology (Government Approved Test Centre) Amendment Rules, 2021",
    url: "http://consumeraffairs.gov.in/public/upload/files/2021%20GATC%20amendment_1732710258.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2021",
    dateOfIssue: "",
    description: "Digital portal integration for GATC verification certificates.",
    tags: ["gatc", "e_verification"]
  },
  {
    id: "gatc-amendment-2025",
    title: "The Legal Metrology (Government Approved Test Centre) Amendment Rules, 2025",
    url: "https://consumeraffairs.gov.in/public/upload/files/267111_1761404639.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "",
    description: "Revised security and audit protocols for private testing laboratories.",
    tags: ["gatc", "audit"]
  },
  {
    id: "gatc-amendment-2026",
    title: "The Legal Metrology (Government Approved Test Centre) Amendment Rules, 2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/GATC_Amendment_Rules_2026_1778476324.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "",
    description: "Expanded recognition of NABL accredited laboratories as GATCs.",
    tags: ["gatc", "nabl"]
  },
  {
    id: "gatc-second-amendment-2026",
    title: "The Legal Metrology (Government Approved Test Centre) Second Amendment Rules, 2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/GATC_2nd_Amendment_1782108671.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "",
    description: "Second amendment to GATC rules for FY2026-27.",
    tags: ["gatc", "2026"]
  },
  {
    id: "pcr-master-2011",
    title: "The Legal Metrology (Packaged Commodities) Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/8_1732871406.pdf",
    category: "Rules",
    documentType: "Rules",
    year: "2011",
    dateOfIssue: "07/03/2011",
    description: "THE MASTER REGULATION FOR PACKAGED COMMODITIES: Defines Rule 6 mandatory declarations (Manufacturer, Origin, Product Name, Net Qty, Month/Year, MRP, Consumer Care), Rule 7 font size matrices, principal display panel sizing, and prohibited deceptive packaging practices.",
    tags: ["pcr", "rule_6", "rule_7", "mandatory_declarations", "mrp", "net_quantity", "manufacturer", "core_statute"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-1-2011",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28i%29_0_1732860957.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2011",
    dateOfIssue: "",
    description: "First amendment clarifying compliance timelines for pre-printed packaging inventory.",
    tags: ["pcr", "inventory", "transition"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-2-2011",
    title: "The Legal Metrology (Packaged Commodities) Second Amendment Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28ii%29_0_1732860982.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2011",
    dateOfIssue: "",
    description: "Second amendment updating standard pack size provisions in the Second Schedule.",
    tags: ["pcr", "pack_sizes", "second_schedule"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-3-2011",
    title: "The Legal Metrology (Packaged Commodities) Third Amendment Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28iii%29_0_1732861046.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2011",
    dateOfIssue: "",
    description: "Third amendment on wholesale package declarations under Chapter III.",
    tags: ["pcr", "wholesale"],
    isCorePCR: true
  },
  {
    id: "pcr-corrigendum-3-2011",
    title: "Corrigendum- The Legal Metrology (Packaged Commodities) Third Amendment Rules, 2011",
    url: "http://consumeraffairs.gov.in/public/upload/files/corrigendum_PCR_0_0_1732860695.pdf",
    category: "Corrigendum",
    documentType: "Corrigendum",
    year: "2011",
    dateOfIssue: "",
    description: "Corrigendum to Third Amendment of PCR 2011.",
    tags: ["pcr", "corrigendum"],
    isCorePCR: true
  },
  {
    id: "pcr-guidelines-apr-2011",
    title: "Guidelines For Implementation of the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011 dated 29.04.11",
    url: "http://consumeraffairs.gov.in/public/upload/files/advisory_pcr%281%29_0%20%281%29_1732860898.pdf",
    category: "Guidelines",
    documentType: "Guidelines",
    year: "2011",
    dateOfIssue: "04/29/2011",
    description: "Official implementation guideline answering industry FAQs on font legibility, placement on wrapper vs carton, and multi-piece packages.",
    tags: ["guidelines", "faq", "legibility"],
    isCorePCR: true
  },
  {
    id: "pcr-guidelines-sep-2011",
    title: "Guidelines For Implementation of the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011 dated 30.09.11",
    url: "http://consumeraffairs.gov.in/public/upload/files/guidelines%20dt%2030_9_2011%20for%20PCR%281%29_0%20%281%29_1732860774.pdf",
    category: "Guidelines",
    documentType: "Guidelines",
    year: "2011",
    dateOfIssue: "09/30/2011",
    description: "Second advisory guideline clarifying consumer care telephone helpline formats and sticker allowances for imported goods.",
    tags: ["guidelines", "consumer_care", "imported_goods"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-2012",
    title: "The Legal Metrology (Packaged Commodities) Amendment Rules, 2012",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28v%29_0_1732861119.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2012",
    dateOfIssue: "",
    description: "Amendment standardizing net quantity declarations for liquids by volume (ml/L) and solids by weight (g/kg).",
    tags: ["pcr", "net_quantity", "metric_units"],
    isCorePCR: true
  },
  {
    id: "pcr-second-amendment-2012",
    title: "The Legal Metrology (Packaged Commodities) (Second Amendment) Rules, 2012",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28vi%29_0_1732861153.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2012",
    dateOfIssue: "",
    description: "Second 2012 amendment refining wholesale package size exemptions.",
    tags: ["pcr", "wholesale"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-2013",
    title: "The Legal Metrology (Packaged Commodities) Amendment Rules, 2013",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28vii%29_0_1732861181.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2013",
    dateOfIssue: "",
    description: "Mandate requiring unambiguous date of manufacture / packing without confusing alphanumeric coding.",
    tags: ["pcr", "date_of_packing", "month_year"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-2014",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2014",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28viii%29_0%20%281%29_1732870622.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2014",
    dateOfIssue: "",
    description: "Updated exemptions for industrial and institutional consumers purchasing commodities directly from manufacturers.",
    tags: ["pcr", "institutional_consumers"],
    isCorePCR: true
  },
  {
    id: "pcr-second-amendment-2014",
    title: "The Legal Metrology (Packaged Commodities) (Second Amendment) Rules, 2014",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28ix%29_0_1732870718.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2014",
    dateOfIssue: "",
    description: "Second 2014 amendment regarding standardized sizes of soft drinks and beverages.",
    tags: ["pcr", "beverages"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-2015",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2015",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28x%29_0_1732870750.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2015",
    dateOfIssue: "",
    description: "Inclusion of email contact details alongside telephone number under mandatory consumer care declarations.",
    tags: ["pcr", "consumer_care", "email"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-2016",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2016",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28xi%29_0_1732871315.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2016",
    dateOfIssue: "",
    description: "2016 amendment governing medical and pharmaceutical packaging compliance harmonized with Drug & Cosmetics rules.",
    tags: ["pcr", "pharma"],
    isCorePCR: true
  },
  {
    id: "pcr-advisory-garments-2011",
    title: "The Legal Metrology (Packaged Commodities) Rules,2011- Advisory for enforcement of provisions of Rules for Readymade Garments/ Hosiery products",
    url: "http://consumeraffairs.gov.in/public/upload/files/LM_Advisory_for_Readymade_Garments_0_1732710356.pdf",
    category: "Advisory",
    documentType: "Advisory",
    year: "2011",
    dateOfIssue: "",
    description: "Detailed advisory for labeling readymade garments, chest/waist measurements in centimeters (cm), fabric composition, and piece count.",
    tags: ["garments", "hosiery", "textiles", "size_declaration"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-2017",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2017",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28xii%29_0_1732871346.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2017",
    dateOfIssue: "23/06/2017",
    description: "MAJOR MILESTONE AMENDMENT: Introduced mandatory e-commerce declarations (Rule 6(10)), enhanced font sizes for net quantity, banned dual MRP across airports/cinemas, and mandated Unit Sale Price (USP) display.",
    tags: ["pcr", "ecommerce", "dual_mrp", "unit_sale_price", "font_sizes", "major_amendment"],
    isCorePCR: true
  },
  {
    id: "pcr-corrigendum-2017",
    title: "Corrigendum- The Legal Metrology (Packaged Commodities) Amendment, Rules, 2017",
    url: "http://consumeraffairs.gov.in/public/upload/files/8%28xiii%29_0_1732871373.pdf",
    category: "Corrigendum",
    documentType: "Corrigendum",
    year: "2017",
    dateOfIssue: "",
    description: "Corrigendum to 2017 amendment correcting effective dates and schedule references.",
    tags: ["pcr", "corrigendum"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-2021",
    title: "The Legal Metrology (Packaged Commodities) Amendment Rule, 2021",
    url: "https://consumeraffairs.gov.in/public/upload/files/230946_1732871433.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2021",
    dateOfIssue: "02/11/2021",
    description: "Mandated Unit Sale Price (USP) (e.g. ₹ per g / ₹ per ml) on all retail packages to enable consumer comparison. Removed Second Schedule rigid pack size restrictions.",
    tags: ["unit_sale_price", "pcr", "usp", "pack_sizes"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-mar-2022",
    title: "The Legal Metrology (Packaged Commodities) Amendment Rules, 2022 dated 28.03.2022",
    url: "http://consumeraffairs.gov.in/public/upload/files/GSR226_1732871458.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2022",
    dateOfIssue: "03/28/2022",
    description: "G.S.R. 226(E): Extended Unit Sale Price implementation date to 1st October 2022 and provided illustrated format tables for USP display.",
    tags: ["pcr", "unit_sale_price", "gsr_226"],
    isCorePCR: true
  },
  {
    id: "pcr-second-qr-2022",
    title: "The Legal Metrology (Packaged Commodities) (Second Amendment) Rules, 2022",
    url: "http://consumeraffairs.gov.in/public/upload/files/Notification%20-%20%20Legal%20Metrology%20%28QR%20Code%29_1732871487.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2022",
    dateOfIssue: "14/07/2022",
    description: "PERMITTED QR CODES: Allowed electronic products to declare mandatory declarations via QR Code for 1 year, provided MRP, consumer care, and net quantity remain printed physically.",
    tags: ["qr_code", "electronic_products", "digital_declaration", "pcr"],
    isCorePCR: true
  },
  {
    id: "pcr-third-garments-2022",
    title: "The Legal Metrology (Packaged Commodities) (Third Amendment) Rules, 2022",
    url: "http://consumeraffairs.gov.in/public/upload/files/2022%203rd%20amendment%20in%20PCR%20Garments_1733228786.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2022",
    dateOfIssue: "",
    description: "Exemptions and special provisions for garment packages sold loose or on hangers in retail showrooms.",
    tags: ["garments", "textiles", "retail_showrooms"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-amendment-2022",
    title: "The Legal Metrology (Packaged Commodities) Amendment (Amendment) Rules, 2022.",
    url: "http://consumeraffairs.gov.in/public/upload/files/PCR_1732871549.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2022",
    dateOfIssue: "",
    description: "Harmonization amendment coordinating overlapping implementation schedules.",
    tags: ["pcr", "harmonization"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-nov-2022",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2022 dated 30.11.2022",
    url: "https://consumeraffairs.gov.in/public/upload/files/eGazette_30_nov_22_1732871630_1746006280.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2022",
    dateOfIssue: "11/30/2022",
    description: "Gazette notification extending compliance windows for pre-existing packaging material.",
    tags: ["pcr", "transition_period"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-jan-2023",
    title: "The Legal Metrology (Packaged Commodities) Amendment (Amendment) Rules, 2023 dated 27.01.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.01.27%20amendment%20in%20amendment%20of%202023%20PCR_1732871665.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "01/27/2023",
    description: "Extension of packaging compliance deadlines for seasonal goods and small packaging sizes.",
    tags: ["pcr", "deadlines"],
    isCorePCR: true
  },
  {
    id: "pcr-advisory-fuel-2023",
    title: "Advisory On Fuel Capacity of Car/Two Wheeler's mention in the Service Manuals by Vehicle Manufacturers dated 06.03.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.3.6%20Fuel%20capacity%20vehicle%20tank_1732871722.pdf",
    category: "Advisory",
    documentType: "Advisory",
    year: "2023",
    dateOfIssue: "03/06/2023",
    description: "Advisory regarding accurate fuel tank usable capacity declaration to prevent consumer deception at dispensing pumps.",
    tags: ["advisory", "automotive", "fuel_capacity"]
  },
  {
    id: "pcr-advisory-farm-2023",
    title: "Advisory On Packages of agriculture farm produce upto 50kg under the Legal Metrology (Packaged Commodities) Rule, 2011 dated 06.03.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.3.6%20farm%20produce%20upto%2050%20kg%20as%20per%20PCR_1732871747.pdf",
    category: "Advisory",
    documentType: "Advisory",
    year: "2023",
    dateOfIssue: "03/06/2023",
    description: "Exemption guideline clarifying that agricultural farm produce packages up to 50kg sold directly by farmers in APMC mandis are exempt from retail packaging mandates.",
    tags: ["agriculture", "farm_produce", "50kg", "exemption"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-mar-2023",
    title: "The Legal Metrology (Packaged Commodities) Amendment (Amendment) Rules, 2023 dated 24.03.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/PCR_Amendment_24March2023_1732871698.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "03/24/2023",
    description: "Second 2023 extension regarding mandatory Unit Sale Price on multi-piece packages.",
    tags: ["unit_sale_price", "multi_piece"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-jun05-2023",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2023 dated 05.06.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.06.5%20amendment%20in%20amendment%20of%20PCR%20ext%20till%2030.6.2023_1732871791.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "06/05/2023",
    description: "Extension of packaging rule compliance till 30.06.2023.",
    tags: ["pcr", "extension"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-qr-jun23-2023",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2023 dated 23.06.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.6.23%20QR%20Code%20PCR%20amendment_1732871827.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "06/23/2023",
    description: "Extension of QR Code declaration permissions for electronic and IT hardware commodities for an additional period.",
    tags: ["qr_code", "electronics", "pcr"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-jun28-2023",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2023 dated 28.06.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.6.28%20amendment%20in%20amendment%20of%20PCR%20ext%20till%2031.8.2023_1733228263.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "06/28/2023",
    description: "Extension of packaging compliance timeline till 31.08.2023.",
    tags: ["pcr", "extension"],
    isCorePCR: true
  },
  {
    id: "pcr-medical-devices-jul-2023",
    title: "Provisions of the Legal Metrology (Packaged Commodities) Rules,2011 on Medical Devices dated 10.07.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.7.10%20Medical%20Devices%20revision%20of%20prices_1733228304.pdf",
    category: "Notification",
    documentType: "Notification",
    year: "2023",
    dateOfIssue: "07/10/2023",
    description: "Mandatory guidelines on price revision declarations and MRP stickers on medical device packaging (stents, orthopedic implants, oxygen concentrators).",
    tags: ["medical_devices", "mrp", "price_revision"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-aug-2023",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2023 dated 30.08.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/248432_1732871904.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "08/30/2023",
    description: "Further extension of time for compliance with specific labeling declarations.",
    tags: ["pcr", "extension"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-sep-2023",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2023 dated 30.09.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/Amendment%20of%20PCR%20ext%20till%2031.12.2023%20%281%29_1732871950.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "09/30/2023",
    description: "Extension of packaging compliance timeline till 31.12.2023.",
    tags: ["pcr", "extension"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-oct-2023",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2023 dated 06.10.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.10.6%20amendment%20in%20PCR_1732871982.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2023",
    dateOfIssue: "10/06/2023",
    description: "Notification regarding mandatory declarations on packages containing loose commodities.",
    tags: ["pcr", "loose_commodities"],
    isCorePCR: true
  },
  {
    id: "pcr-sop-edible-oil-2023",
    title: "SoP for Determination of the Net Quantity of Commodities (Edible Oils & Fats) contained in any Package dated 29.12.2023",
    url: "http://consumeraffairs.gov.in/public/upload/files/2023.12.29%20Standard%20Operating%20Procedure%20for%20Edible%20oil%20&%20Fats%20Net%20Quantity%20Measurement%20signed%20copy_1732872010.pdf",
    category: "SoP",
    documentType: "SoP",
    year: "2023",
    dateOfIssue: "12/29/2023",
    description: "CRITICAL ENFORCEMENT SOP: Standard Operating Procedure for measuring and verifying net quantity of edible oils and vegetable fats. Mandates volume corrected to reference temperature of 30°C to prevent thermal expansion fraud.",
    tags: ["sop", "edible_oil", "vegetable_fats", "net_quantity", "temperature_correction", "enforcement_sop"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-oct-2025",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2025 dated 24.10.2025",
    url: "https://consumeraffairs.gov.in/public/upload/files/267107_1761404707.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "10/24/2025",
    description: "Refinement of Rule 6 mandatory digital and physical declarations for fast-moving consumer goods (FMCG).",
    tags: ["pcr", "2025", "fmcg", "rule_6"],
    isCorePCR: true
  },
  {
    id: "pcr-second-pan-masala-2025",
    title: "The Legal Metrology (Packaged Commodities) Second (Amendment) Rules, 2025. 02.12.2025",
    url: "https://consumeraffairs.gov.in/public/upload/files/2nd%20PCR%20Pan%20Masala_1764736734.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2025",
    dateOfIssue: "12/02/2025",
    description: "MANDATORY RESTRAINT ON SACHETS: Prohibits single-serve pouch manipulation, mandates prominent net weight declarations, and eliminates misleading oversized pouches for Pan Masala commodities.",
    tags: ["pan_masala", "sachets", "deceptive_packaging", "pcr"],
    isCorePCR: true
  },
  {
    id: "pcr-amendment-coo-feb-2026",
    title: "The Legal Metrology (Packaged Commodities) (Amendment) Rules, 2026 dated 13.02.2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/2026.02.13%20PCR%201st%20COO%20Filter%20on%20e-commerce%20websites_1771231030.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "02/13/2026",
    description: "MANDATORY E-COMMERCE COUNTRY OF ORIGIN (COO) FILTER: Mandates all e-commerce entities to incorporate a dedicated, searchable, and prominent Country of Origin filter on consumer storefronts under Rule 6(10).",
    tags: ["coo", "country_of_origin", "ecommerce", "coo_filter", "rule_6_10", "2026", "landmark"],
    isCorePCR: true
  },
  {
    id: "pcr-second-coo-apr-2026",
    title: "The Legal Metrology (Packaged Commodities) Second Amendment Rules, 2026.",
    url: "https://consumeraffairs.gov.in/public/upload/files/2026.4.27%20PCR%202nd%20COO%20from%201.7.2027_1777348487.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "27/04/2026",
    description: "Country of Origin implementation schedule specifying enforcement deadlines and multi-stage compliance dates w.e.f. 01.07.2027.",
    tags: ["coo", "country_of_origin", "ecommerce", "2026"],
    isCorePCR: true
  },
  {
    id: "pcr-third-may-2026",
    title: "The Legal Metrology (Packaged Commodities) Third Amendment Rules, 2026 -29-05-2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/PCR_3rd_29May2026_1780376045.pdf",
    category: "Amendment Rules",
    documentType: "Amendment",
    year: "2026",
    dateOfIssue: "05/29/2026",
    description: "Third 2026 Amendment modernizing barcode / QR code scanning mandates and principal display panel definitions.",
    tags: ["pcr", "barcode", "qr_code", "pdp", "2026"],
    isCorePCR: true
  },
  {
    id: "model-enforcement-rules-2010",
    title: "The Model Draft Legal Metrology (Enforcement) Rules, 2010",
    url: "http://consumeraffairs.gov.in/public/upload/files/9_1732872040.pdf",
    category: "Model Rules",
    documentType: "Model",
    year: "2010",
    dateOfIssue: "",
    description: "Model enforcement rules recommended for State Governments to adopt for licensing of manufacturers, repairers, dealers, and inspection search/seizure powers.",
    tags: ["enforcement", "licensing", "inspection", "powers"]
  },
  {
    id: "ist-rules-2026",
    title: "The Legal Metrology (Indian Standard Time) Rules, 2026",
    url: "https://consumeraffairs.gov.in/public/upload/files/2026.08.27%20IST%20Rules_1788026429.pdf",
    category: "Rules",
    documentType: "Rules",
    year: "2026",
    dateOfIssue: "27/08/2026",
    description: "Statutory rules establishing official Indian Standard Time (IST) synchronization protocols for digital clocks, telecom networks, and automated logging systems across India.",
    tags: ["ist", "time", "synchronization", "2026"]
  }
];

export function searchRegulations(query: string): MetrologyDocument[] {
  if (!query || query.trim() === '') return OFFICIAL_METROLOGY_DOCUMENTS;
  const q = query.toLowerCase().trim();
  return OFFICIAL_METROLOGY_DOCUMENTS.filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.year.includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getRegulationsByCategory(category: string): MetrologyDocument[] {
  if (category === 'ALL') return OFFICIAL_METROLOGY_DOCUMENTS;
  return OFFICIAL_METROLOGY_DOCUMENTS.filter((doc) => doc.category === category);
}

export function getCorePackagedCommoditiesRegulations(): MetrologyDocument[] {
  return OFFICIAL_METROLOGY_DOCUMENTS.filter((doc) => doc.isCorePCR);
}

export function findRegulationById(id: string): MetrologyDocument | undefined {
  return OFFICIAL_METROLOGY_DOCUMENTS.find((doc) => doc.id === id);
}

export function getCitationForField(fieldId: string): MetrologyDocument | undefined {
  switch (fieldId) {
    case 'manufacturer_name_address':
      return findRegulationById('pcr-master-2011');
    case 'country_of_origin':
      return findRegulationById('pcr-amendment-coo-feb-2026') || findRegulationById('pcr-master-2011');
    case 'product_name':
      return findRegulationById('pcr-master-2011');
    case 'net_quantity':
      return findRegulationById('pcr-sop-edible-oil-2023') || findRegulationById('pcr-amendment-2012') || findRegulationById('pcr-master-2011');
    case 'month_year':
      return findRegulationById('pcr-amendment-2013') || findRegulationById('pcr-master-2011');
    case 'mrp':
      return findRegulationById('pcr-amendment-mar-2022') || findRegulationById('pcr-amendment-2017') || findRegulationById('act-2009');
    case 'consumer_care':
      return findRegulationById('pcr-amendment-2015') || findRegulationById('pcr-guidelines-sep-2011');
    default:
      return findRegulationById('pcr-master-2011');
  }
}
