export async function priceLookupTool(input: { productName: string; mrp?: number }) {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const basePrice = input.mrp || 120;
  return {
    status: 'completed',
    productName: input.productName,
    mrp: basePrice,
    marketPrices: [
      { platform: 'Blinkit / Zepto Quick Commerce', price: Math.round(basePrice * 0.95), inStock: true },
      { platform: 'Amazon India', price: Math.round(basePrice * 0.92), inStock: true },
      { platform: 'JioMart Hyperlocal', price: Math.round(basePrice * 0.90), inStock: true },
    ],
    lowestPrice: Math.round(basePrice * 0.90),
    mrpViolationDetected: false,
    notes: 'No e-commerce sellers found selling above declared label MRP.',
    source: 'mock_price_lookup',
  };
}
