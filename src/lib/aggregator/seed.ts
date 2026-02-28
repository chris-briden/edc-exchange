// Seed data for the product aggregator
// Run via: npx tsx src/lib/aggregator/seed.ts
// Or call the seed API endpoint

export const SEED_RETAILERS = [
  {
    name: 'eBay',
    slug: 'ebay',
    website_url: 'https://www.ebay.com',
    type: 'secondary',
    affiliate_url_template: null,
    logo_url: null,
  },
  {
    name: 'BladeHQ',
    slug: 'bladehq',
    website_url: 'https://www.bladehq.com',
    type: 'retail',
    affiliate_url_template: null,
    logo_url: null,
  },
  {
    name: 'KnifeCenter',
    slug: 'knifecenter',
    website_url: 'https://www.knifecenter.com',
    type: 'retail',
    affiliate_url_template: null,
    logo_url: null,
  },
  {
    name: 'DLT Trading',
    slug: 'dlt-trading',
    website_url: 'https://www.dlttrading.com',
    type: 'retail',
    affiliate_url_template: null,
    logo_url: null,
  },
  {
    name: 'KnivesShipFree',
    slug: 'knivesshipfree',
    website_url: 'https://www.knivesshipfree.com',
    type: 'retail',
    affiliate_url_template: null,
    logo_url: null,
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type ProductSeed = {
  name: string;
  brand: string;
  slug: string;
  category: string;
  msrp: number | null;
  specs: Record<string, string | number>;
  tags: string[];
};

function knife(
  brand: string,
  name: string,
  msrp: number | null = null,
  specs: Record<string, string | number> = {},
  extraTags: string[] = []
): ProductSeed {
  const fullName = `${brand} ${name}`;
  return {
    name: fullName,
    brand,
    slug: slugify(fullName),
    category: 'knives',
    msrp,
    specs,
    tags: [brand.toLowerCase(), ...name.toLowerCase().split(' '), ...extraTags],
  };
}

function multiTool(
  brand: string,
  name: string,
  msrp: number | null = null,
  specs: Record<string, string | number> = {},
  extraTags: string[] = []
): ProductSeed {
  const fullName = `${brand} ${name}`;
  return {
    name: fullName,
    brand,
    slug: slugify(fullName),
    category: 'multi-tools',
    msrp,
    specs,
    tags: [brand.toLowerCase(), ...name.toLowerCase().split(' '), 'multi-tool', ...extraTags],
  };
}

export const SEED_PRODUCTS: ProductSeed[] = [
  // ── Chris Reeve Knives ──
  knife('Chris Reeve Knives', 'Large Sebenza 31', 475, { blade_length: '3.625"', steel: 'S45VN', weight: '3.0 oz' }, ['crk', 'sebenza']),
  knife('Chris Reeve Knives', 'Small Sebenza 31', 425, { blade_length: '2.94"', steel: 'S45VN', weight: '2.5 oz' }, ['crk', 'sebenza']),
  knife('Chris Reeve Knives', 'Large Inkosi', 475, { blade_length: '3.625"', steel: 'S45VN', weight: '3.3 oz' }, ['crk', 'inkosi']),
  knife('Chris Reeve Knives', 'Small Inkosi', 425, { blade_length: '2.94"', steel: 'S45VN', weight: '2.7 oz' }, ['crk', 'inkosi']),
  knife('Chris Reeve Knives', 'Umnumzaan', 500, { blade_length: '3.675"', steel: 'S45VN', weight: '4.5 oz' }, ['crk', 'zaan']),
  knife('Chris Reeve Knives', 'Nyala', 350, { blade_length: '3.75"', steel: 'S35VN', weight: '3.2 oz' }, ['crk']),

  // ── Benchmade ──
  knife('Benchmade', 'Bugout 535', 165, { blade_length: '3.24"', steel: 'S30V', weight: '1.85 oz' }, ['bugout']),
  knife('Benchmade', 'Mini Bugout 533', 155, { blade_length: '2.82"', steel: 'S30V', weight: '1.5 oz' }, ['mini bugout']),
  knife('Benchmade', 'Griptilian 551', 145, { blade_length: '3.45"', steel: 'S30V', weight: '3.82 oz' }, ['grip']),
  knife('Benchmade', 'Osborne 940', 225, { blade_length: '3.4"', steel: 'S30V', weight: '2.9 oz' }, ['osborne']),
  knife('Benchmade', 'Bailout 537', 195, { blade_length: '3.38"', steel: 'M4', weight: '2.7 oz' }, ['bailout']),
  knife('Benchmade', 'Mini Adamas 273', 210, { blade_length: '3.25"', steel: 'CruWear', weight: '5.2 oz' }, ['adamas']),
  knife('Benchmade', 'Redoubt 430', 175, { blade_length: '3.55"', steel: 'D2', weight: '4.0 oz' }, ['redoubt']),

  // ── Spyderco ──
  knife('Spyderco', 'Para Military 2', 175, { blade_length: '3.44"', steel: 'S45VN', weight: '3.75 oz' }, ['pm2', 'paramilitary']),
  knife('Spyderco', 'Para 3', 165, { blade_length: '2.95"', steel: 'S45VN', weight: '3.4 oz' }, ['para3']),
  knife('Spyderco', 'Manix 2', 175, { blade_length: '3.37"', steel: 'S30V', weight: '3.9 oz' }, ['manix']),
  knife('Spyderco', 'Delica 4', 100, { blade_length: '2.9"', steel: 'VG-10', weight: '2.5 oz' }, ['delica']),
  knife('Spyderco', 'Endura 4', 105, { blade_length: '3.75"', steel: 'VG-10', weight: '3.5 oz' }, ['endura']),
  knife('Spyderco', 'Yojimbo 2', 175, { blade_length: '3.12"', steel: 'S30V', weight: '3.1 oz' }, ['yojimbo']),
  knife('Spyderco', 'Native 5', 155, { blade_length: '3.1"', steel: 'S30V', weight: '2.5 oz' }, ['native']),
  knife('Spyderco', 'Shaman', 225, { blade_length: '3.58"', steel: 'S30V', weight: '4.8 oz' }, ['shaman']),

  // ── Zero Tolerance ──
  knife('Zero Tolerance', '0350', 195, { blade_length: '3.25"', steel: 'S30V', weight: '6.2 oz' }, ['zt']),
  knife('Zero Tolerance', '0452CF', 300, { blade_length: '4.1"', steel: 'S35VN', weight: '5.4 oz' }, ['zt']),
  knife('Zero Tolerance', '0562', 280, { blade_length: '3.5"', steel: '20CV', weight: '6.0 oz' }, ['zt']),
  knife('Zero Tolerance', '0609', 260, { blade_length: '3.4"', steel: '20CV', weight: '3.5 oz' }, ['zt']),

  // ── Microtech ──
  knife('Microtech', 'Ultratech', 300, { blade_length: '3.46"', steel: 'M390', weight: '3.4 oz' }, ['otf']),
  knife('Microtech', 'UTX-85', 275, { blade_length: '3.0"', steel: 'M390', weight: '2.9 oz' }, ['otf']),
  knife('Microtech', 'Troodon', 400, { blade_length: '3.0"', steel: 'M390', weight: '3.3 oz' }, ['otf']),
  knife('Microtech', 'Combat Troodon', 500, { blade_length: '3.81"', steel: 'M390', weight: '5.2 oz' }, ['otf']),

  // ── Hinderer ──
  knife('Hinderer', 'XM-18 3.5"', 500, { blade_length: '3.5"', steel: '20CV', weight: '5.6 oz' }, ['xm18', 'xm-18']),
  knife('Hinderer', 'XM-24', 625, { blade_length: '4.0"', steel: '20CV', weight: '7.6 oz' }, ['xm24', 'xm-24']),
  knife('Hinderer', 'Eklipse 3.5"', 500, { blade_length: '3.5"', steel: '20CV', weight: '5.4 oz' }, ['eklipse']),

  // ── Protech ──
  knife('ProTech', 'Malibu', 250, { blade_length: '3.25"', steel: '20CV', weight: '3.3 oz' }, ['malibu']),
  knife('ProTech', 'Godson', 200, { blade_length: '3.15"', steel: '154CM', weight: '2.8 oz' }, ['godson']),

  // ── Hogue ──
  knife('Hogue', 'Deka', 150, { blade_length: '3.25"', steel: '20CV', weight: '2.9 oz' }, ['deka']),

  // ── WE Knife ──
  knife('WE Knife', 'Banter', 120, { blade_length: '2.9"', steel: 'S35VN', weight: '2.0 oz' }, ['banter', 'civivi']),
  knife('WE Knife', 'Elementum', 55, { blade_length: '3.47"', steel: 'D2', weight: '4.08 oz' }, ['elementum', 'civivi']),

  // ── Emerson ──
  knife('Emerson', 'CQC-7BW', 260, { blade_length: '3.3"', steel: '154CM', weight: '4.3 oz' }, ['cqc']),

  // ── Kershaw ──
  knife('Kershaw', 'Leek 1660', 80, { blade_length: '3.0"', steel: '14C28N', weight: '3.0 oz' }, ['leek']),
  knife('Kershaw', 'Launch 4', 120, { blade_length: '1.9"', steel: 'CPM 154', weight: '2.2 oz' }, ['launch']),

  // ── GiantMouse ──
  knife('GiantMouse', 'Ace Biblio', 175, { blade_length: '3.0"', steel: 'M390', weight: '2.6 oz' }, ['biblio', 'ace']),

  // ── Multi-Tools ──
  multiTool('Leatherman', 'Wave+', 110, { tools: 18, weight: '8.5 oz' }, ['wave', 'pliers']),
  multiTool('Leatherman', 'Charge+ TTi', 175, { tools: 19, weight: '8.5 oz', steel: 'S30V' }, ['charge']),
  multiTool('Leatherman', 'Surge', 130, { tools: 21, weight: '12.5 oz' }, ['surge', 'pliers']),
  multiTool('Leatherman', 'Free P4', 140, { tools: 21, weight: '8.6 oz' }, ['free']),
  multiTool('Leatherman', 'Skeletool', 70, { tools: 7, weight: '5.0 oz' }, ['skeletool']),
  multiTool('Victorinox', 'Swiss Army Huntsman', 40, { tools: 15, weight: '3.6 oz' }, ['sak', 'swiss army']),
  multiTool('Victorinox', 'Swiss Army Cadet Alox', 35, { tools: 9, weight: '1.5 oz' }, ['sak', 'alox', 'cadet']),
  multiTool('Victorinox', 'SwissTool Spirit X', 100, { tools: 26, weight: '7.4 oz' }, ['sak', 'swisstool']),
];
