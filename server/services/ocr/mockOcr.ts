export interface OcrResult {
  text: string;
  confidence: number;
  provider: string;
  raw?: any;
}

const DEMO_TEXTS = {
  compliant: `ABC Biscuits
Net Wt: 500 g
MRP ₹120 incl. taxes
Manufactured by: ABC Foods Pvt Ltd, 12 Industrial Area, Mumbai, Maharashtra - 400001
Mfg Date: 08/2025
Consumer Care: 1800-123-4567, care@abcfoods.in
Lic. No. 11521018000342
Country of Origin: India`,

  missingMrp: `XYZ Chips
Net Wt: 200 g
Manufactured by: XYZ Snacks Ltd, Sector 4, Rohini, Delhi - 110001
Mfg Date: 07/2025
Consumer Care: care@xyzsnacks.in, 1800-999-0000
Lic. No. 10019011002233
Country of Origin: India`,

  missingNetQuantity: `Pure Olive Oil
MRP ₹450 incl. taxes
Manufactured by: ABC Oils Ltd, Plot 88, Peenya Industrial Area, Bengaluru, Karnataka - 560001
Mfg Date: 06/2025
Consumer Care: 1800-555-1111, care@abcoils.in
Lic. No. 11218333000555
Country of Origin: India`,

  missingConsumerCare: `Herbal Soap
Net Wt: 100 g
MRP ₹45 incl. taxes
Manufactured by: Green Care Products Pvt Ltd, Survey 22, Hinjewadi, Pune, Maharashtra - 411001
Mfg Date: 05/2025
Lic. No. 11520022000889
Country of Origin: India`,
};

export async function extractMockText(
  imageBuffer?: Buffer,
  filename = ''
): Promise<OcrResult> {
  const lowerName = filename.toLowerCase();

  let selectedText = DEMO_TEXTS.compliant;

  if (lowerName.includes('missing-mrp') || lowerName.includes('no-mrp')) {
    selectedText = DEMO_TEXTS.missingMrp;
  } else if (lowerName.includes('missing-net') || lowerName.includes('no-qty') || lowerName.includes('missing-quantity')) {
    selectedText = DEMO_TEXTS.missingNetQuantity;
  } else if (lowerName.includes('missing-consumer') || lowerName.includes('no-care') || lowerName.includes('missing-care')) {
    selectedText = DEMO_TEXTS.missingConsumerCare;
  }

  // Artificial short delay to emulate real OCR processing feel (e.g. 250ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    text: selectedText,
    confidence: 0.96,
    provider: 'mock',
    raw: { length: selectedText.length, lines: selectedText.split('\n').length },
  };
}
