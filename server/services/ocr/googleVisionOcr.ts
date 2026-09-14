import { OcrResult } from './mockOcr';

export async function extractGoogleVisionText(
  imageBuffer: Buffer,
  filename = ''
): Promise<OcrResult> {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  if (!credentialsPath && !apiKey) {
    console.log('[OCR] Google Vision credentials not configured, falling back to mock OCR');
    const { extractMockText } = await import('./mockOcr');
    return extractMockText(imageBuffer, filename);
  }

  try {
    if (apiKey) {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [
              {
                image: { content: imageBuffer.toString('base64') },
                features: [{ type: 'TEXT_DETECTION' }],
              },
            ],
          }),
        }
      );

      const data: any = await response.json();
      const text = data.responses?.[0]?.fullTextAnnotation?.text;
      if (text) {
        return {
          text,
          confidence: 0.94,
          provider: 'google_vision',
          raw: data.responses[0],
        };
      }
    }
  } catch (err: any) {
    console.warn('[OCR] Google Vision failed:', err.message, '- falling back to mock');
  }

  const { extractMockText } = await import('./mockOcr');
  return extractMockText(imageBuffer, filename);
}
