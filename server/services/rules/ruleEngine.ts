import { ExtractedField, FieldCheck } from '../../models/Scan';

export interface RuleEngineResult {
  fieldChecks: FieldCheck[];
  complianceScore: number;
  complianceStatus: 'PASS' | 'PARTIAL' | 'FAIL';
  summary: string;
  missingFields: string[];
}

export function validateRule6(fields: Record<string, ExtractedField>): RuleEngineResult {
  const checks: FieldCheck[] = [];
  const missing: string[] = [];

  // Check 1: Manufacturer / Packer / Importer Name & Address
  const mfgName = fields.manufacturerName?.value;
  const mfgAddr = fields.manufacturerAddress?.value;
  if (mfgName && mfgAddr && mfgAddr.length > 10) {
    checks.push({
      id: 'manufacturer_name_address',
      label: 'Manufacturer / Packer / Importer Name and Address',
      status: 'pass',
      evidence: fields.manufacturerName.raw || `${mfgName}, ${mfgAddr}`,
      message: 'Manufacturer name and operational address successfully identified.',
    });
  } else if (mfgName) {
    checks.push({
      id: 'manufacturer_name_address',
      label: 'Manufacturer / Packer / Importer Name and Address',
      status: 'warning',
      evidence: mfgName,
      message: 'Manufacturer name detected but complete address or postal code is incomplete.',
    });
  } else {
    checks.push({
      id: 'manufacturer_name_address',
      label: 'Manufacturer / Packer / Importer Name and Address',
      status: 'fail',
      evidence: 'No manufacturer declaration found',
      message: 'Missing mandatory manufacturer, packer, or importer name and address.',
    });
    missing.push('Manufacturer name and address');
  }

  // Check 2: Country of Origin
  const origin = fields.countryOfOrigin?.value;
  if (origin && !origin.includes('Domestic address')) {
    checks.push({
      id: 'country_of_origin',
      label: 'Country of Origin',
      status: 'pass',
      evidence: fields.countryOfOrigin.raw || origin,
      message: `Country of origin clearly declared: ${origin}.`,
    });
  } else if (origin) {
    checks.push({
      id: 'country_of_origin',
      label: 'Country of Origin',
      status: 'pass',
      evidence: origin,
      message: 'Domestic Indian manufacture inferred from registered domestic address.',
    });
  } else {
    checks.push({
      id: 'country_of_origin',
      label: 'Country of Origin',
      status: 'warning',
      evidence: 'Not explicitly declared',
      message: 'Country of origin not explicitly stated (applicable if imported).',
    });
  }

  // Check 3: Common or Generic Product Name
  const prodName = fields.productName?.value;
  if (prodName && prodName.length >= 3) {
    checks.push({
      id: 'product_name',
      label: 'Common / Generic Product Name',
      status: 'pass',
      evidence: prodName,
      message: `Commodity generic/trade name detected: "${prodName}".`,
    });
  } else {
    checks.push({
      id: 'product_name',
      label: 'Common / Generic Product Name',
      status: 'warning',
      evidence: 'Unclear or missing',
      message: 'Product name unclear or not prominently placed in primary declaration.',
    });
    missing.push('Product name');
  }

  // Check 4: Net Quantity
  const netQtyVal = fields.netQuantityValue?.value;
  const netQtyUnit = fields.netQuantityUnit?.value;
  if (netQtyVal && netQtyUnit) {
    checks.push({
      id: 'net_quantity',
      label: 'Net Quantity',
      status: 'pass',
      evidence: fields.netQuantityValue.raw || `${netQtyVal} ${netQtyUnit}`,
      message: `Standard net quantity declared: ${netQtyVal} ${netQtyUnit}.`,
    });
  } else if (netQtyVal) {
    checks.push({
      id: 'net_quantity',
      label: 'Net Quantity',
      status: 'fail',
      evidence: netQtyVal,
      message: 'Net quantity declared without legal metric measurement unit.',
    });
    missing.push('Net quantity unit');
  } else {
    checks.push({
      id: 'net_quantity',
      label: 'Net Quantity',
      status: 'fail',
      evidence: 'Not detected',
      message: 'Mandatory net quantity declaration is missing.',
    });
    missing.push('Net quantity');
  }

  // Check 5: Month and Year of Manufacture / Packing / Import
  const monthYear = fields.monthYear?.value;
  if (monthYear) {
    checks.push({
      id: 'month_year',
      label: 'Month & Year of Manufacture / Packing',
      status: 'pass',
      evidence: fields.monthYear.raw || monthYear,
      message: `Date of manufacture / packaging declared: ${monthYear}.`,
    });
  } else {
    checks.push({
      id: 'month_year',
      label: 'Month & Year of Manufacture / Packing',
      status: 'fail',
      evidence: 'Not detected',
      message: 'Month and year of manufacture or packaging is missing.',
    });
    missing.push('Month/Year of manufacture');
  }

  // Check 6: Maximum Retail Price (MRP)
  const mrp = fields.mrp?.value;
  if (mrp) {
    checks.push({
      id: 'mrp',
      label: 'Maximum Retail Price (MRP)',
      status: 'pass',
      evidence: fields.mrp.raw || mrp,
      message: `Maximum Retail Price clearly declared: ${mrp} (incl. of all taxes).`,
    });
  } else {
    checks.push({
      id: 'mrp',
      label: 'Maximum Retail Price (MRP)',
      status: 'fail',
      evidence: 'Not detected',
      message: 'Mandatory MRP declaration inclusive of taxes is missing.',
    });
    missing.push('Maximum Retail Price (MRP)');
  }

  // Check 7: Consumer Care Details
  const carePhone = fields.consumerCarePhone?.value;
  const careEmail = fields.consumerCareEmail?.value;
  const careAddr = fields.consumerCareAddress?.value;
  if (carePhone || careEmail || careAddr) {
    const details = [carePhone, careEmail].filter(Boolean).join(', ');
    checks.push({
      id: 'consumer_care',
      label: 'Consumer Care Contact Details',
      status: 'pass',
      evidence: details || 'Customer care helpline declared',
      message: `Consumer complaint redressal channel declared: ${details || 'contact info present'}.`,
    });
  } else {
    checks.push({
      id: 'consumer_care',
      label: 'Consumer Care Contact Details',
      status: 'fail',
      evidence: 'Not detected',
      message: 'Mandatory consumer care helpline, email, or physical address is missing.',
    });
    missing.push('Consumer care contact details');
  }

  // Calculate score
  const passedCount = checks.filter((c) => c.status === 'pass').length;
  const totalCount = checks.length;
  const score = Math.round((passedCount / totalCount) * 100);

  // Critical checks: MRP, Net Quantity, Manufacturer, Month/Year
  const criticalFailed = checks.some(
    (c) =>
      ['mrp', 'net_quantity', 'manufacturer_name_address'].includes(c.id) &&
      c.status === 'fail'
  );

  let complianceStatus: 'PASS' | 'PARTIAL' | 'FAIL' = 'FAIL';
  if (score === 100) {
    complianceStatus = 'PASS';
  } else if (!criticalFailed && score >= 70) {
    complianceStatus = 'PARTIAL';
  } else if (score >= 50 && missing.length <= 1) {
    complianceStatus = 'PARTIAL';
  } else {
    complianceStatus = 'FAIL';
  }

  let summary = '';
  if (complianceStatus === 'PASS') {
    summary = 'All 7 mandatory Rule 6 declarations found and compliant with Legal Metrology rules.';
  } else if (complianceStatus === 'PARTIAL') {
    summary = `Partially compliant (${score}%). Missing or unclear: ${missing.join(', ')}.`;
  } else {
    summary = `Non-compliant (${score}%). Critical mandatory declarations missing: ${missing.join(', ')}.`;
  }

  return {
    fieldChecks: checks,
    complianceScore: score,
    complianceStatus,
    summary,
    missingFields: missing,
  };
}
