export const MRP_REGEX = /(?:MRP|M\.R\.P\.|Max\.?\s*Retail\s*Price|Price)[^\d₹Rs]{0,20}(?:₹|Rs\.?|INR)?\s*([0-9]+(?:\.[0-9]{1,2})?)/i;

export const NET_QUANTITY_REGEX = /(?:Net\s*Wt\.?|Net\s*Qty\.?|Net\s*Weight|Net\s*Contents?|Quantity|Qty)[^\d]{0,20}([0-9]+(?:\.[0-9]+)?)\s*(g|kg|gm|grams|ml|l|litre|liter|units|pcs|pieces)\b/i;

export const MONTH_YEAR_NUMERIC_REGEX = /\b(0[1-9]|1[0-2])\s*[\/\-]\s*(20\d{2})\b/;
export const MONTH_YEAR_TEXT_REGEX = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\-]+(20\d{2})\b/i;

export const PHONE_REGEX = /(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}|1800[\s-]?\d{3}[\s-]?\d{4}|0\d{2,4}[\s-]?\d{6,8}/;

export const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export const PINCODE_REGEX = /\b[1-9][0-9]{5}\b/;

export const FSSAI_REGEX = /(?:FSSAI|Lic\.?\s*No\.?|License\s*No\.?)\D{0,10}(\d{14})/i;

export const COUNTRY_OF_ORIGIN_REGEX = /(?:Country\s*of\s*Origin|Made\s*in|Product\s*of|Imported\s*from)[:\s]+([a-zA-Z\s]{3,25})/i;

export const MANUFACTURER_KEYWORDS = [
  'manufactured by',
  'mfg by',
  'packed by',
  'pkg by',
  'marketed by',
  'mkt by',
  'importer',
  'imported by',
  'produced by',
];

export const CONSUMER_CARE_KEYWORDS = [
  'consumer care',
  'customer care',
  'consumer helpline',
  'customer support',
  'care cell',
  'feedback',
  'complaints',
  'reach us at',
  'contact us',
];
