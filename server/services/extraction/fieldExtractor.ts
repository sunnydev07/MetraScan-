import { ExtractedField } from '../../models/Scan';
import {
  MRP_REGEX,
  NET_QUANTITY_REGEX,
  MONTH_YEAR_NUMERIC_REGEX,
  MONTH_YEAR_TEXT_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX,
  PINCODE_REGEX,
  FSSAI_REGEX,
  COUNTRY_OF_ORIGIN_REGEX,
  MANUFACTURER_KEYWORDS,
  CONSUMER_CARE_KEYWORDS,
} from '../utils/regexPatterns';
import { calculateConfidence } from '../utils/confidence';

export function extractFields(rawText: string, ocrConfidence = 0.95): Record<string, ExtractedField> {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const fullText = rawText;

  const createField = (
    value: string | null,
    raw: string | null,
    matchQuality: 'direct_regex' | 'keyword_proximity' | 'weak_fuzzy' | 'missing',
    source: string | null
  ): ExtractedField => {
    const found = !!value;
    return {
      value,
      raw,
      confidence: found ? calculateConfidence(matchQuality, ocrConfidence) : 0,
      source: found ? source : null,
      found,
    };
  };

  // 1. MRP
  let mrpValue: string | null = null;
  let mrpRaw: string | null = null;
  const mrpMatch = fullText.match(MRP_REGEX);
  if (mrpMatch) {
    mrpValue = `₹${mrpMatch[1]}`;
    mrpRaw = mrpMatch[0].trim();
  }

  // 2. Net Quantity Value & Unit
  let netQtyVal: string | null = null;
  let netQtyUnit: string | null = null;
  let netQtyRaw: string | null = null;
  const qtyMatch = fullText.match(NET_QUANTITY_REGEX);
  if (qtyMatch) {
    netQtyVal = qtyMatch[1];
    netQtyUnit = qtyMatch[2];
    netQtyRaw = qtyMatch[0].trim();
  }

  // 3. Month & Year
  let monthYearVal: string | null = null;
  let monthYearRaw: string | null = null;
  const myNumMatch = fullText.match(MONTH_YEAR_NUMERIC_REGEX);
  if (myNumMatch) {
    monthYearVal = `${myNumMatch[1]}/${myNumMatch[2]}`;
    monthYearRaw = myNumMatch[0].trim();
  } else {
    const myTextMatch = fullText.match(MONTH_YEAR_TEXT_REGEX);
    if (myTextMatch) {
      monthYearVal = `${myTextMatch[1]} ${myTextMatch[2]}`;
      monthYearRaw = myTextMatch[0].trim();
    }
  }

  // 4. Manufacturer Name and Address
  let mfgName: string | null = null;
  let mfgAddress: string | null = null;
  let mfgRaw: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    const hasMfgKeyword = MANUFACTURER_KEYWORDS.some((kw) => lowerLine.includes(kw));

    if (hasMfgKeyword) {
      mfgRaw = line;
      // Extract what's after the colon or keyword
      const parts = line.split(/:\s*/);
      const content = parts.length > 1 ? parts.slice(1).join(': ') : line;

      // Check if this line or next line contains address/pincode
      const nextLine = lines[i + 1] || '';
      const combined = `${content} ${nextLine}`.trim();
      const pinMatch = combined.match(PINCODE_REGEX);

      // Name is usually the first phrase
      const nameMatch = content.split(/,|\n/)[0];
      mfgName = nameMatch.trim();
      mfgAddress = combined;
      if (nextLine && nextLine.length > 5) {
        mfgRaw = `${line}\n${nextLine}`;
      }
      break;
    }
  }

  // 5. Country of origin
  let countryVal: string | null = null;
  let countryRaw: string | null = null;
  const countryMatch = fullText.match(COUNTRY_OF_ORIGIN_REGEX);
  if (countryMatch) {
    countryVal = countryMatch[1].trim();
    countryRaw = countryMatch[0].trim();
  } else if (/Made\s*in\s*India|Product\s*of\s*India/i.test(fullText)) {
    countryVal = 'India';
    countryRaw = 'Made in India';
  } else if (mfgAddress && PINCODE_REGEX.test(mfgAddress)) {
    // In India, 6 digit pincode in address implies domestic production
    countryVal = 'India (Domestic address detected)';
    countryRaw = mfgAddress;
  }

  // 6. Consumer Care Phone & Email & Address
  let carePhone: string | null = null;
  let careEmail: string | null = null;
  let careAddress: string | null = null;
  let careRaw: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    if (CONSUMER_CARE_KEYWORDS.some((kw) => lower.includes(kw))) {
      careRaw = line;
      const emailMatch = line.match(EMAIL_REGEX);
      if (emailMatch) careEmail = emailMatch[0];

      const phoneMatch = line.match(PHONE_REGEX);
      if (phoneMatch) carePhone = phoneMatch[0];

      // Next line might have more info
      if (lines[i + 1]) {
        careRaw += `\n${lines[i + 1]}`;
        if (!careEmail) {
          const nextEmail = lines[i + 1].match(EMAIL_REGEX);
          if (nextEmail) careEmail = nextEmail[0];
        }
        if (!carePhone) {
          const nextPhone = lines[i + 1].match(PHONE_REGEX);
          if (nextPhone) carePhone = nextPhone[0];
        }
      }
      careAddress = careRaw;
      break;
    }
  }

  // Fallback standalone phone and email matches if not found near consumer care keyword
  if (!careEmail) {
    const emailMatch = fullText.match(EMAIL_REGEX);
    if (emailMatch) careEmail = emailMatch[0];
  }
  if (!carePhone) {
    const phoneMatch = fullText.match(PHONE_REGEX);
    if (phoneMatch) carePhone = phoneMatch[0];
  }

  // 7. FSSAI License
  let fssaiVal: string | null = null;
  let fssaiRaw: string | null = null;
  const fssaiMatch = fullText.match(FSSAI_REGEX);
  if (fssaiMatch) {
    fssaiVal = fssaiMatch[2];
    fssaiRaw = fssaiMatch[0].trim();
  }

  // 8. Product Name
  let prodName: string | null = null;
  // Usually the first line or line before "Net Wt" / "MRP"
  if (lines.length > 0) {
    // Avoid lines that look like numbers or small words
    const candidate = lines[0];
    if (candidate.length >= 3 && !candidate.toLowerCase().startsWith('mrp') && !candidate.toLowerCase().startsWith('net')) {
      prodName = candidate;
    } else if (lines[1]) {
      prodName = lines[1];
    }
  }

  return {
    productName: createField(prodName, prodName, prodName ? 'keyword_proximity' : 'missing', 'header_heuristic'),
    manufacturerName: createField(mfgName, mfgRaw, mfgName ? 'keyword_proximity' : 'missing', 'keyword_anchor'),
    manufacturerAddress: createField(mfgAddress, mfgRaw, mfgAddress ? 'keyword_proximity' : 'missing', 'address_pincode'),
    countryOfOrigin: createField(countryVal, countryRaw, countryVal ? 'direct_regex' : 'missing', 'origin_heuristic'),
    netQuantityValue: createField(netQtyVal, netQtyRaw, netQtyVal ? 'direct_regex' : 'missing', 'regex'),
    netQuantityUnit: createField(netQtyUnit, netQtyRaw, netQtyUnit ? 'direct_regex' : 'missing', 'regex'),
    monthYear: createField(monthYearVal, monthYearRaw, monthYearVal ? 'direct_regex' : 'missing', 'regex'),
    mrp: createField(mrpValue, mrpRaw, mrpValue ? 'direct_regex' : 'missing', 'regex'),
    consumerCarePhone: createField(carePhone, careRaw, carePhone ? 'direct_regex' : 'missing', 'regex'),
    consumerCareEmail: createField(careEmail, careRaw, careEmail ? 'direct_regex' : 'missing', 'regex'),
    consumerCareAddress: createField(careAddress, careRaw, careAddress ? 'keyword_proximity' : 'missing', 'keyword_anchor'),
    fssaiLicense: createField(fssaiVal, fssaiRaw, fssaiVal ? 'direct_regex' : 'missing', 'regex'),
    genericText: createField(fullText.slice(0, 300), fullText.slice(0, 300), 'direct_regex', 'ocr_raw'),
  };
}
