import heroPaintShowcaseImg from '../assets/images/hero_painters_grone_clean_1795526917432.webp';
import heroContractingSiteImg from '../assets/images/hero_contracting_site_1793881011097.webp';
import globalEvProcurementImg from '../assets/images/african_china_ev_procurement_1795522392960.webp';
import globalShippingDockImg from '../assets/images/dockyard_with_grone_logo_1795526824209.webp';
import chinaEvEbikePartnersImg from '../assets/images/china_ev_ebike_partners_1795525214021.webp';
import industrialSolarEquipmentImg from '../assets/images/industrial_solar_equipment_1795525212726.webp';
import gadgetsAccessoriesExportImg from '../assets/images/china_agent_with_logo_1795526824111.webp';
import buildingMaterialsWarehouseImg from '../assets/images/nigerian_warehouse_engineers_1795525866761.webp';
import paintBucketsCollectionImg from '../assets/images/paint_buckets_with_logo_1795526824577.webp';
import paintersAtWorkImg from '../assets/images/commercial_painters_clean_1795526915535.webp';
import paintLabFormulationImg from '../assets/images/paint_lab_african_team_1795515422915.webp';
import screedingPuttyProductionImg from '../assets/images/screeding_bucket_logo_1795526917500.webp';

export type SubdivisionMode = 'paints' | 'contracting';
export type NavView = 'home' | 'about' | 'services' | 'order';
export type PaintTypeKey = 'emulsion' | 'matte' | 'silk' | 'oil' | 'screeding';
export type BucketSizeKey = '4L' | '20L';

export const PAINT_ORDER_KEYS: PaintTypeKey[] = [
  'emulsion',
  'matte',
  'silk',
  'oil',
  'screeding',
];

export interface PaintFinishSpec {
  id: PaintTypeKey;
  name: string;
  subtitle: string;
  sheenLevel: string;
  coveragePerLitre: string;
  dryingTime: string;
  scrubResistance: string;
  applicationAreas: string;
  shortNote: string;
  prices: {
    '4L': number;
    '20L': number;
  };
  description: string;
}

export interface ColorSwatch {
  code: string;
  name: string;
  hex: string;
  family: string;
  recommendedFinish: string;
}

export interface ScreedingGradeOption {
  code: string;
  name: string;
  hex: string;
  usage: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  eta: string;
  fee: number;
}

export interface OrderCartItem {
  id: string;
  paintType: PaintTypeKey;
  paintTypeName: string;
  colorSpec: string;
  colorHex: string;
  bucketSize: BucketSizeKey;
  quantity: number;
  unitPrice: number;
}

export const BRAND_LOGO_URL =
  '/assets/aistudio/WhatsApp_Image_2026-11-24_at_7.20.10_AM_db21d7fa.jpeg';

export const IMAGES = {
  heroPaintShowcase: heroPaintShowcaseImg,
  heroContractingSite: heroContractingSiteImg,
  globalEvProcurement: globalEvProcurementImg,
  globalShippingDock: globalShippingDockImg,
  chinaEvEbikePartners: chinaEvEbikePartnersImg,
  industrialSolarEquipment: industrialSolarEquipmentImg,
  gadgetsAccessoriesExport: gadgetsAccessoriesExportImg,
  buildingMaterialsWarehouse: buildingMaterialsWarehouseImg,
  paintBucketsCollection: paintBucketsCollectionImg,
  paintersAtWork: paintersAtWorkImg,
  paintLabFormulation: paintLabFormulationImg,
  screedingPuttyProduction: screedingPuttyProductionImg,
};

export const PAINT_FINISHES: Record<PaintTypeKey, PaintFinishSpec> = {
  emulsion: {
    id: 'emulsion',
    name: 'Emulsion Paint',
    subtitle: 'Economical Breathable Water-Based Architectural Coating',
    sheenLevel: 'Soft Flat-Chalky Finish (5–8% Gloss)',
    coveragePerLitre: '10–12 m² per litre (2 coats)',
    dryingTime: 'Touch dry in 35 mins · Recoat in 2 hours',
    scrubResistance: '3,500+ wet scrub cycles · Anti-fungal tropical guard',
    applicationAreas: 'Interior ceilings, rental apartments, large housing estates, and general masonry walls',
    shortNote:
      'Water-based, fast-drying, low-odor wall paint suspended in acrylic emulsion resin. Breathable and cost-effective for covering large residential and estate masonry surfaces quickly.',
    prices: {
      '4L': 8500,
      '20L': 38000,
    },
    description:
      'Formulated by Grone Global Paints with high-titanium dioxide dispersion and acrylic copolymer binders for strong hiding power, easy roller flow, and reliable breathability in humid tropical climates.',
  },
  matte: {
    id: 'matte',
    name: 'Matte Paint',
    subtitle: 'Ultra-Low Sheen Dead-Flat Luxury Architectural Finish',
    sheenLevel: 'True Dead-Flat Matte (<2–3% Gloss at 60°)',
    coveragePerLitre: '12–14 m² per litre (2 coats)',
    dryingTime: 'Touch dry in 40 mins · Recoat in 2–3 hours',
    scrubResistance: '6,500+ wet scrub cycles · Non-chalking & wipeable resin',
    applicationAreas: 'Luxury living rooms, bedrooms, ceilings, galleries, and walls with slight plaster imperfections',
    shortNote:
      'High-pigment, non-reflective velvet finish that absorbs light rather than bouncing glare. Expertly hides wall undulations, screeding touch-ups, and roller marks while delivering rich, deep color saturation.',
    prices: {
      '4L': 13500,
      '20L': 58000,
    },
    description:
      'Engineered by Grone Global Paints with micro-mineral flattening extenders and dense acrylic binders so it masks minor plaster unevenness effortlessly while remaining wipeable, UV-stable, and velvety smooth.',
  },
  silk: {
    id: 'silk',
    name: 'Silk Paint',
    subtitle: 'Washable Luxury Mid-Sheen Satin Elastomeric Finish',
    sheenLevel: 'Lustrous Silk Satin (20–25% Gloss)',
    coveragePerLitre: '13–15 m² per litre (2 coats)',
    dryingTime: 'Touch dry in 45 mins · Recoat in 3 hours',
    scrubResistance: '10,000+ wet scrub cycles · Stain & moisture repellent',
    applicationAreas: 'High-traffic hallways, hotel lobbies, executive lounges, kitchens, and luxury residences',
    shortNote:
      'Smooth mid-sheen satin coating that reflects soft architectural light and forms a sealed, wipe-clean surface—ideal for busy corridors, kitchens, kids’ rooms, and commercial lobbies.',
    prices: {
      '4L': 16500,
      '20L': 72000,
    },
    description:
      'Engineered with pure cross-linking acrylic emulsion that reflects natural architectural light while allowing effortless wipe-down of stains, scuff marks, and tropical dust.',
  },
  oil: {
    id: 'oil',
    name: 'Oil Paint',
    subtitle: 'Heavy-Duty High-Gloss Alkyd Enamel & Weather Shield',
    sheenLevel: 'Mirror High-Gloss Enamel (85%+ Gloss)',
    coveragePerLitre: '14–16 m² per litre (per coat)',
    dryingTime: 'Touch dry in 3 hours · Hard cure in 12 hours',
    scrubResistance: 'Industrial solvent, UV & corrosion resistant',
    applicationAreas: 'Structural steelwork, metal gates, wooden doors, skirting boards, dado rails, and exterior facades',
    shortNote:
      'Solvent-based alkyd enamel that cures into a rock-hard, mirror-gloss protective armor. Resists rust, impact, moisture, and harsh sun on metal gates, timber doors, trim, and wet-zone walls.',
    prices: {
      '4L': 21000,
      '20L': 88000,
    },
    description:
      'Industrial-strength alkyd resin coating crafted by Grone Global Paints to form an impenetrable, mirror-smooth protective film against torrential rain, coastal salinity, and abrasion.',
  },
  screeding: {
    id: 'screeding',
    name: 'Screeding & Putty',
    subtitle: 'Ultra-White Acrylic Wall Screeding Paste & Skim-Coat Putty',
    sheenLevel: 'Smooth Paint-Ready Sandable Plaster Base (0% Gloss)',
    coveragePerLitre: '18–22 m² per 20L bucket (2 skim coats)',
    dryingTime: 'Touch dry in 45 mins · Sand & prime in 4 hours',
    scrubResistance: 'High-adhesion acrylic polymer binder · Zero flaking or chalking',
    applicationAreas: 'Raw cement plaster walls, interior/exterior masonry leveling, crack filling, and mirror-smooth wall prep before painting',
    shortNote:
      'Ready-to-use, polymer-modified ultra-white acrylic wall screeding paste & skim putty. Levels rough masonry and fills pores into a glass-smooth finish while reducing paint consumption by up to 25%.',
    prices: {
      '4L': 7500,
      '20L': 32000,
    },
    description:
      'Manufactured by Grone Global Paints in 4-Litre and 20-Litre plastic buckets, our high-density acrylic wall screeding putty bonds permanently to sand-cement plaster, eliminating pinholes and preparing walls for Emulsion, Matte, or Silk finishes.',
  },
};

export const SCREEDING_GRADES: ScreedingGradeOption[] = [
  { code: 'GP-INT', name: 'Ultra-White Interior Acrylic Screeding Putty', hex: '#F9F9F7', usage: 'Living rooms, bedrooms, ceilings & offices' },
  { code: 'GP-EXT', name: 'Weather-Shield Exterior Acrylic Putty', hex: '#F1F2EE', usage: 'Rain & UV-resistant exterior building facades' },
  { code: 'GP-CRK', name: 'Heavy-Fill Crack & Joint Skim Putty', hex: '#ECECE6', usage: 'Deep masonry pores, chases & hairline cracks' },
  { code: 'GP-PRM', name: 'Fine Mirror-Finish Satin Prep Putty', hex: '#FFFFFF', usage: 'Ultra-smooth substrate prep for Silk & Matte paint' },
];

export const CURATED_SWATCHES: ColorSwatch[] = [
  { code: 'GR-101', name: 'Warm Alabaster', hex: '#F3EFE6', family: 'Architectural Neutrals', recommendedFinish: 'Matte / Silk' },
  { code: 'GR-104', name: 'Ikoyi Travertine', hex: '#E4DACB', family: 'Architectural Neutrals', recommendedFinish: 'Matte / Silk' },
  { code: 'GR-108', name: 'Abuja Sandstone', hex: '#D2B48C', family: 'Earth & Ochre', recommendedFinish: 'Emulsion / Matte' },
  { code: 'GR-204', name: 'Sahara Terracotta', hex: '#B85D3B', family: 'Earth & Ochre', recommendedFinish: 'Matte / Silk' },
  { code: 'GR-210', name: 'Royal Burnt Amber', hex: '#8F3F24', family: 'Earth & Ochre', recommendedFinish: 'Oil / Silk' },
  { code: 'GR-302', name: 'Savannah Olive Sage', hex: '#7C8C76', family: 'Botanical & Mineral', recommendedFinish: 'Matte / Silk' },
  { code: 'GR-309', name: 'Emerald Canopy', hex: '#284E3A', family: 'Botanical & Mineral', recommendedFinish: 'Matte / Oil' },
  { code: 'GR-401', name: 'Atlantic Mist Grey', hex: '#CBD2D9', family: 'Cool Slates', recommendedFinish: 'Emulsion / Matte' },
  { code: 'GR-408', name: 'Victoria Island Slate', hex: '#4A5568', family: 'Cool Slates', recommendedFinish: 'Matte / Silk' },
  { code: 'GR-415', name: 'Deep Obsidian Navy', hex: '#1E293B', family: 'Cool Slates', recommendedFinish: 'Matte / Oil' },
  { code: 'GR-502', name: 'Sovereign Gold Ochre', hex: '#C6922C', family: 'Heritage Accents', recommendedFinish: 'Silk / Matte' },
  { code: 'GR-600', name: 'Brilliant Pure White', hex: '#FFFFFF', family: 'Architectural Neutrals', recommendedFinish: 'All Finishes' },
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  { id: 'lagos-mainland', name: 'Lagos Mainland (Ikeja, Surulere, Yaba, Festac)', eta: '24–48 Hours Dispatch', fee: 4500 },
  { id: 'lagos-island', name: 'Lagos Island (Victoria Island, Ikoyi, Lekki, Ajah)', eta: '24–48 Hours Dispatch', fee: 6000 },
  { id: 'ogun-southwest', name: 'Ogun & Southwest Corridor (Abeokuta, Ibadan, Mowe)', eta: '2–3 Working Days', fee: 7500 },
  { id: 'abuja-fct', name: 'Abuja FCT (Maitama, Wuse, Gwarinpa, Lugbe)', eta: '2–4 Working Days', fee: 9500 },
  { id: 'port-harcourt', name: 'Port Harcourt & South-South Industrial Hub', eta: '3–4 Working Days', fee: 11000 },
  { id: 'nationwide', name: 'Nationwide Heavy Haulage / Bulk Estate Delivery', eta: '3–5 Working Days', fee: 15000 },
];

export const PAINTS_SERVICES = [
  {
    index: '01',
    title: 'Contract Paint Production',
    category: 'White-Label & Bulk Estate Manufacturing',
    image: IMAGES.paintBucketsCollection,
    summary:
      'Custom chemical formulation and high-volume paint production in durable 20L and 4L plastic buckets for real estate developers, housing estates, hospitality chains, and government projects.',
    highlights: [
      'Custom color matching (RAL, Pantone, and architectural swatch replication) across Emulsion, Matte, Silk, and Oil finishes.',
      'Private-label & estate-branded heavy-duty 20L and 4L plastic packaging with batch quality certificates.',
      'Tropicalized anti-fungal, UV-stabilized, and alkali-resistant formulations tailored to Nigerian weather conditions.',
    ],
    metrics: 'Up to 45,000 Litres Weekly Output · Batch-Tested Viscosity & Opacity',
  },
  {
    index: '02',
    title: 'Screeding & Putty Production',
    category: 'Wall Screeding Material & Acrylic Putty Manufacturing',
    image: IMAGES.screedingPuttyProduction,
    summary:
      'Industrial manufacturing and bulk supply of ultra-white acrylic wall screeding paste, interior/exterior skim-coat putty, hairline crack fillers, and smooth plaster-leveling compounds.',
    highlights: [
      'Ready-to-use high-adhesion acrylic wall screeding paste and polymer-modified white putty formulated for zero peeling or flaking.',
      'Creates a glass-smooth, non-powdery substrate that reduces paint consumption by up to 25% before applying Emulsion, Matte, or Silk.',
      'Available in 20L heavy-duty plastic buckets and bulk estate developer batches with rapid drying and effortless sanding.',
    ],
    metrics: 'Interior & Weather-Resistant Exterior Putty · Mirror-Smooth Finish',
  },
  {
    index: '03',
    title: 'Contract Painting',
    category: 'Residential, Commercial & Industrial Execution',
    image: IMAGES.paintersAtWork,
    summary:
      'End-to-end wall screeding, putty skimming, priming, and precision coating application executed by certified Grone Global Paints site technicians across Nigeria.',
    highlights: [
      'Complete surface preparation: moisture assessment, Grone Global wall screeding, putty skimming, crack remediation, and priming.',
      'High-pressure airless spray systems and lint-free roller teams for residential duplexes, estates, and multi-story commercial towers.',
      'Backed by a 5-Year Peel & Flake Workmanship Warranty when paired with Grone Global Paints & Screeding Putty.',
    ],
    metrics: '180+ Estates & Commercial Buildings Coated · Zero-Mess Handover',
  },
  {
    index: '04',
    title: 'Paint & Putty Production Tutorials',
    category: 'Industrial Formulation, Paint, Screeding & Putty Training',
    image: IMAGES.paintLabFormulation,
    summary:
      'Hands-on laboratory and factory floor training programs covering full industrial chemical formulation for Emulsion, Matte, Silk, Oil paints, as well as Screeding & Putty material production.',
    highlights: [
      'Practical formulation of Emulsion, Dead-Flat Matte, Silk Satin, Textcoat, Alkyd Gloss Oil paints, plus Acrylic Screeding & Wall Putty.',
      'Raw material stoichiometry: Titanium Dioxide (TiO₂), Calcium Carbonate, Acrylic Binders, POP/Putty Modifiers, Coalescents, and Biocides.',
      'Complete factory equipment advisory, SON quality compliance guidance, and post-training technical mentorship.',
    ],
    metrics: '420+ Graduates Trained · Complete Paint & Putty Formulation Manual',
  },
];

export const CONTRACTING_SERVICES = [
  {
    index: '01',
    title: 'Global Procurement, China Sourcing & Doorstep Delivery',
    category: 'Grone Global Ltd General Contracting Subdivision',
    scope: 'Flagship China Hub — Chinese EVs, E-Bikes, Scooters, Machinery & Gadgets',
    summary:
      'Our flagship international purchasing and logistics agency with China as our major procurement hub alongside global markets. Specializing in Chinese electric vehicles (Changan, GAC, BYD & SUVs), Chinese electric bikes, scooters, industrial/solar machines, and everyday gadgets—inspected on the ground, shipped, cleared in Nigeria, and delivered to your doorstep.',
    deliverables: [
      'Direct sourcing and pre-shipment inspection of Chinese Electric Vehicles (Changan, GAC, BYD), Chinese electric bikes, and electric scooters.',
      'Factory procurement of industrial equipment (pure water machines, fabric-making machines, solar panels/inverters) and day-to-day accessories & gadgets.',
      'On-ground China agents verifying physical condition, full air/sea container shipping, Nigerian customs clearing, and secure doorstep delivery.',
    ],
    metric: 'On-Ground China Agents · EVs, E-Bikes, Clearing & Doorstep Delivery',
  },
  {
    index: '02',
    title: 'Local Procurement, Civil Works & Nigerian Building Materials',
    category: 'Grone Global Ltd General Contracting Subdivision',
    scope: 'General Contracting Civil Works & Location-Based Nigerian Supply',
    summary:
      'Integrated local procurement, bulk purchasing, quality verification, and direct site delivery of genuine building materials across Nigeria—paired seamlessly with civil service works and estate development.',
    deliverables: [
      'Bulk supply of cement, steel iron rods, granite, sharp sand, blocks, roofing sheets, plumbing, electricals, and finishing tiles.',
      'Quarry and factory-depot quality inspection before loading to guarantee authentic project-grade construction materials.',
      'Location-based haulage and direct site delivery across Lagos, Abuja, Port Harcourt, and all Nigerian states.',
    ],
    metric: 'Nationwide Nigerian Supply · Direct Depot-to-Site Delivery',
  },
  {
    index: '03',
    title: 'Turnkey Building Construction',
    category: 'Grone Global Ltd General Contracting Subdivision',
    scope: 'Substructure to Superstructure Delivery',
    summary:
      'Full-lifecycle architectural and structural construction for residential duplexes, gated housing estates, corporate office complexes, and industrial warehouses.',
    deliverables: [
      'Geotechnical soil investigation, piling, raft foundations, and reinforced concrete frame construction.',
      'Architectural blockwork, roofing trusses, mechanical & electrical (MEP) rough-ins, and structural supervision.',
      'Seamless handoff to Grone Global Paints for interior screeding and protective architectural coatings.',
    ],
    metric: '42+ Turnkey Structures Completed Across Lagos, Abuja & Port Harcourt',
  },
  {
    index: '04',
    title: 'Civil Engineering & Road Infrastructure',
    category: 'Grone Global Ltd General Contracting Subdivision',
    scope: 'Earthworks, Drainage & Estate Infrastructure',
    summary:
      'Engineered civil infrastructure for private estates, industrial parks, and municipal corridors, built for long-term load bearing and flood resilience.',
    deliverables: [
      'Reinforced concrete storm-water drainage channels, box culverts, and retention basins.',
      'Interlocking paving stone roads, rigid concrete pavements, kerbs, and thermoplastic road marking coatings.',
      'Perimeter fencing, gatehouses, water treatment plants, and solar street lighting integration.',
    ],
    metric: '28+ Kilometers of Estate Roads & Storm Drainage Channels Built',
  },
  {
    index: '05',
    title: 'Structural Renovations & Remodeling',
    category: 'Grone Global Ltd General Contracting Subdivision',
    scope: 'Adaptive Reuse & Structural Rehabilitation',
    summary:
      'Comprehensive structural retrofitting, facade modernization, spatial reconfiguration, and damp-proofing for aging residential and commercial properties.',
    deliverables: [
      'Non-destructive structural integrity audits, column jacketing, and concrete spalling remediation.',
      'Modern curtain-wall glazing, acoustic ceiling installations, porcelain tiling, and sanitary upgrades.',
      'Full exterior weatherproofing and elastomeric recoating for multi-unit complexes.',
    ],
    metric: '98.4% On-Schedule Handover Rate · 35% Average Asset Value Uplift',
  },
  {
    index: '06',
    title: 'Commercial Painting, Coating & Facility Management',
    category: 'Grone Global Ltd General Contracting Subdivision',
    scope: 'Industrial Protection & Lifecycle Maintenance',
    summary:
      'Large-scale protective coatings, epoxy floor systems, structural steel anti-corrosion treatments, and scheduled multi-site facility maintenance.',
    deliverables: [
      'Industrial epoxy floor coatings for factories, hospitals, and multi-level car parks.',
      'Intumescent fire-retardant coatings and marine-grade alkyd protection for structural steel.',
      'Annual preventative maintenance contracts for banks, hotels, schools, and residential estates.',
    ],
    metric: '250,000+ m² Industrial & Commercial Surfaces Protected',
  },
];

export interface ProcurementCategory {
  id: string;
  index: string;
  origin: string;
  title: string;
  image: string;
  imageAlt: string;
  items: string[];
  summary: string;
}

export const PROCUREMENT_CATEGORIES: ProcurementCategory[] = [
  {
    id: 'vehicles',
    index: '01',
    origin: 'China EV & Mobility Hub',
    title: 'Chinese Electric Vehicles, Electric Bikes & Scooters',
    image: IMAGES.chinaEvEbikePartners,
    imageAlt:
      'African and Chinese procurement partners in casual wear inspecting a Chinese electric SUV, electric bike, and scooter for export',
    summary:
      'Verified sourcing of Chinese electric cars and SUVs (Changan, GAC Aion, BYD), Chinese electric bikes, and electric scooters—with our on-ground China partners inspecting condition before shipping, clearing, and doorstep delivery.',
    items: [
      'Chinese Electric Vehicles (Changan, GAC, BYD & SUVs)',
      'Chinese electric bikes & commuter electric scooters',
      'On-ground condition inspection, shipping & Nigerian clearing',
    ],
  },
  {
    id: 'industrial-machinery',
    index: '02',
    origin: 'China Major Factory Hub',
    title: 'Industrial & Solar Equipment',
    image: IMAGES.industrialSolarEquipment,
    imageAlt:
      'Pure water production machinery, fabric-making textile loom, solar panels, inverters, and lithium batteries in industrial warehouse',
    summary:
      'Direct factory procurement from verified Chinese and international manufacturers with thorough machine testing before crating, container shipping, and delivery to Nigeria.',
    items: [
      'Pure water & bottled water production machines',
      'Fabric-making & textile production machinery',
      'Solar panels, hybrid inverters, lithium batteries & kits',
    ],
  },
  {
    id: 'accessories-gadgets',
    index: '03',
    origin: 'China & Online Overseas',
    title: 'Day-to-Day Accessories & Gadgets',
    image: IMAGES.gadgetsAccessoriesExport,
    imageAlt:
      'Grone Global procurement agent at a bustling Chinese wholesale accessories and electronics store stand inspecting gadgets with a vendor',
    summary:
      'Acting as your trusted on-ground buying and shipping agent across wholesale markets and online stores abroad for consumer electronics, home/office gadgets, and everyday accessories.',
    items: [
      'Electronics, smart devices & everyday gadgets',
      'Office, home & lifestyle accessories (retail or bulk)',
      'Consolidated air & sea shipping with doorstep drop-off',
    ],
  },
  {
    id: 'local-building-materials',
    index: '04',
    origin: 'Civil Works · Nigeria',
    title: 'Nigerian Building Materials & Supply',
    image: IMAGES.buildingMaterialsWarehouse,
    imageAlt:
      'African male and female engineers in full safety gear inspecting cement bags, steel iron rods, and porcelain tiles in a Nigerian building materials warehouse',
    summary:
      'Under General Contracting Civil Works: warehouse-direct local purchasing and location-based site delivery of genuine building materials anywhere in Nigeria.',
    items: [
      'Cement bags, steel reinforcement iron rods, granite & sand',
      'Porcelain floor tiles, roofing sheets, plumbing & electricals',
      'Delivered directly from warehouse to your site location',
    ],
  },
];

export const PROCUREMENT_WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Share Specs, Links or Material List',
    detail:
      'Send us the item link, factory spec, car model, machine requirement, or Nigerian building materials list plus your delivery location.',
  },
  {
    step: '02',
    title: 'On-Ground Agent Verification & Inspection',
    detail:
      'Our agents on the ground in China (and partner hubs) physically inspect the supplier and verify the real condition of your items before payment/dispatch.',
  },
  {
    step: '03',
    title: 'International Shipping & Nigerian Clearing',
    detail:
      'We handle secure export crating, air or sea freight from China/abroad, and complete customs clearing upon arrival in Nigeria.',
  },
  {
    step: '04',
    title: 'Doorstep or Construction Site Delivery',
    detail:
      'Final handoff directly to your home, warehouse, office, or construction site anywhere in Nigeria—zero middleman stress.',
  },
];

export function formatNaira(amount: number): string {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}
