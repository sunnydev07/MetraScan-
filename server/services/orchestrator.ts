import { emitScanProgress, emitDashboardUpdate } from '../socket';
import { updateScan, findScanById } from '../db';
import { extractTextFromImage } from './ocr';
import { extractFields } from './extraction/fieldExtractor';
import { validateRule6 } from './rules/ruleEngine';
import { cacheService } from './cache/cacheService';
import { createImageHash } from './utils/imageHash';
import { processAgentOrchestration } from './agents/agentManager';
import { IScan } from '../models/Scan';

export const STAGES = {
  QUEUED: 'queued',
  CACHE_CHECK: 'cache_check',
  OCR_STARTED: 'ocr_started',
  FIELDS_EXTRACTED: 'fields_extracted',
  RULES_CHECKED: 'rules_checked',
  AI_CHECK: 'ai_check',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export async function processScanPipeline(
  scanId: string,
  imageBuffer: Buffer,
  filename = '',
  barcode?: string
): Promise<IScan> {
  try {
    // 1. Queued
    emitScanProgress(scanId, {
      scanId,
      stage: STAGES.QUEUED,
      progress: 5,
      message: 'Scan task queued for verification.',
    });
    await updateScan(scanId, { stage: STAGES.QUEUED, progress: 5 });

    // 2. Cache check
    const imgHash = createImageHash(imageBuffer);
    emitScanProgress(scanId, {
      scanId,
      stage: STAGES.CACHE_CHECK,
      progress: 15,
      message: 'Checking local and demo compliance cache...',
    });
    await updateScan(scanId, { stage: STAGES.CACHE_CHECK, progress: 15, imageHash: imgHash });

    const cacheKey = barcode ? `barcode:${barcode}` : `imagehash:${imgHash}`;
    const cached = cacheService.get(cacheKey);

    if (cached) {
      console.log(`[Orchestrator] Cache hit for ${cacheKey}`);
      const cachedResult: IScan = {
        ...cached,
        scanId, // preserve new scanId
        cacheHit: true,
        progress: 100,
        status: 'completed',
        stage: STAGES.COMPLETED,
        updatedAt: new Date(),
      };
      await updateScan(scanId, cachedResult);

      emitScanProgress(scanId, {
        scanId,
        stage: STAGES.COMPLETED,
        progress: 100,
        status: 'completed',
        complianceStatus: cachedResult.complianceStatus,
        complianceScore: cachedResult.complianceScore,
        summary: `${cachedResult.summary} (Instant Cached Result)`,
        fields: cachedResult.fields,
        fieldChecks: cachedResult.fieldChecks,
        message: 'Compliance scan loaded instantly from cache.',
      });

      emitDashboardUpdate({
        scanId,
        productName: cachedResult.fields?.productName?.value || 'Packaged Commodity',
        complianceStatus: cachedResult.complianceStatus || 'PASS',
        complianceScore: cachedResult.complianceScore || 100,
        missing: cachedResult.fieldChecks?.filter(f => f.status === 'fail').map(f => f.label) || [],
        createdAt: new Date().toISOString(),
      });

      return cachedResult;
    }

    // 3. OCR extraction
    emitScanProgress(scanId, {
      scanId,
      stage: STAGES.OCR_STARTED,
      progress: 35,
      message: 'Reading packaging label text via OCR engine...',
    });
    await updateScan(scanId, { stage: STAGES.OCR_STARTED, progress: 35 });

    const ocrResult = await extractTextFromImage(imageBuffer, filename);

    // 4. Structured Field Extraction
    emitScanProgress(scanId, {
      scanId,
      stage: STAGES.FIELDS_EXTRACTED,
      progress: 60,
      message: 'Extracting Legal Metrology declarations via regex heuristics...',
    });
    await updateScan(scanId, {
      stage: STAGES.FIELDS_EXTRACTED,
      progress: 60,
      ocr: {
        provider: ocrResult.provider,
        rawText: ocrResult.text,
        confidence: ocrResult.confidence,
        completedAt: new Date(),
      },
    });

    const fields = extractFields(ocrResult.text, ocrResult.confidence);

    // 5. Rule Engine Evaluation
    emitScanProgress(scanId, {
      scanId,
      stage: STAGES.RULES_CHECKED,
      progress: 85,
      message: 'Auditing declarations against Rule 6 Legal Metrology guidelines...',
    });

    const ruleResults = validateRule6(fields);

    // 6. Finalizing
    emitScanProgress(scanId, {
      scanId,
      stage: STAGES.AI_CHECK,
      progress: 92,
      message: 'Synthesizing compliance verdict and audit summary...',
    });

    const finalScan: Partial<IScan> = {
      status: 'completed',
      stage: STAGES.COMPLETED,
      progress: 100,
      fields,
      fieldChecks: ruleResults.fieldChecks,
      complianceScore: ruleResults.complianceScore,
      complianceStatus: ruleResults.complianceStatus,
      summary: ruleResults.summary,
      demo: true,
      cacheHit: false,
    };

    const saved = (await updateScan(scanId, finalScan)) || (await findScanById(scanId))!;

    // Populate in cache for fast sub-second future hits
    cacheService.set(cacheKey, saved);

    // Emit final completed event
    emitScanProgress(scanId, {
      scanId,
      stage: STAGES.COMPLETED,
      progress: 100,
      status: 'completed',
      complianceStatus: ruleResults.complianceStatus,
      complianceScore: ruleResults.complianceScore,
      summary: ruleResults.summary,
      fields,
      fieldChecks: ruleResults.fieldChecks,
      missing: ruleResults.missingFields,
      message: 'Compliance evaluation complete.',
    });

    // Emit dashboard update
    emitDashboardUpdate({
      scanId,
      productName: fields.productName?.value || 'Packaged Commodity',
      complianceStatus: ruleResults.complianceStatus,
      complianceScore: ruleResults.complianceScore,
      missing: ruleResults.missingFields,
      createdAt: new Date().toISOString(),
    });

    // Trigger AI orchestration in the background (does not block result!)
    const numericMrp = fields.mrp?.value
      ? parseFloat(fields.mrp.value.replace(/[^0-9.]/g, ''))
      : undefined;

    processAgentOrchestration(scanId, fields, numericMrp).catch((err) => {
      console.error('[Orchestrator] Agent background orchestration error:', err.message);
    });

    return saved;
  } catch (err: any) {
    console.error(`[Orchestrator] Error processing scan ${scanId}:`, err);
    const failUpdate: Partial<IScan> = {
      status: 'failed',
      stage: STAGES.FAILED,
      progress: 100,
      summary: `Scan processing failed: ${err.message || 'Unknown processing error'}`,
    };
    await updateScan(scanId, failUpdate);

    emitScanProgress(scanId, {
      scanId,
      stage: STAGES.FAILED,
      progress: 100,
      status: 'failed',
      message: err.message || 'Error occurred during scan analysis',
    });

    throw err;
  }
}
