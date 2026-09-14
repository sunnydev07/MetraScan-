export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.85,
  MEDIUM: 0.60,
  LOW: 0.40,
};

export function calculateConfidence(
  matchQuality: 'direct_regex' | 'keyword_proximity' | 'weak_fuzzy' | 'missing',
  ocrConfidence = 0.95
): number {
  let baseScore = 0;
  switch (matchQuality) {
    case 'direct_regex':
      baseScore = 0.92;
      break;
    case 'keyword_proximity':
      baseScore = 0.80;
      break;
    case 'weak_fuzzy':
      baseScore = 0.50;
      break;
    case 'missing':
    default:
      return 0;
  }
  return Math.min(0.99, Math.round((baseScore * ocrConfidence) * 100) / 100);
}
