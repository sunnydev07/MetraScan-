export async function licenseLookupTool(input: { licenseNumber: string }) {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const valid = input.licenseNumber && input.licenseNumber.length === 14;

  return {
    status: 'completed',
    licenseNumber: input.licenseNumber,
    verificationStatus: valid ? 'valid' : 'invalid_format',
    expiryDate: '2027-03-31',
    entityName: 'FSSAI Registered Manufacturer / Packer Entity',
    category: 'Food Safety & Standards Authority of India (Central License)',
    source: 'mock_license_registry',
    confidence: valid ? 0.96 : 0.40,
  };
}
