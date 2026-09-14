import { config } from '../../config';
import { extractMockText, OcrResult } from './mockOcr';
import { extractGoogleVisionText } from './googleVisionOcr';

export async function extractTextFromImage(
  imageBuffer: Buffer,
  filename = ''
): Promise<OcrResult> {
  if (config.ocrProvider === 'google_vision' && !config.demoMode) {
    try {
      return await extractGoogleVisionText(imageBuffer, filename);
    } catch (err: any) {
      console.warn('[OCR] Error in Google Vision, using mock fallback:', err.message);
      return extractMockText(imageBuffer, filename);
    }
  }

  return extractMockText(imageBuffer, filename);
}
