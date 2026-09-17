import { Router, Request, Response } from 'express';
import multer from 'multer';
import { saveScan, findScanById, listScans } from '../db';
import { processScanPipeline } from '../services/orchestrator';
import { IScan } from '../models/Scan';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST /api/scans - Upload label image
router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const barcode = req.body.barcode as string | undefined;
    const demoType = req.body.demoType as string | undefined;

    // Validate uploaded file MIME type
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
    if (file && !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      res.status(400).json({ error: `Invalid file type: ${file.mimetype}. Only image files are accepted.` });
      return;
    }

    // Generate unique scanId
    const scanId = `scan_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

    // Prepare buffer
    let buffer: Buffer;
    let filename = file?.originalname || 'label.jpg';

    if (file && file.buffer) {
      buffer = file.buffer;
    } else if (demoType) {
      filename = `${demoType}.jpg`;
      buffer = Buffer.from(`Mock label image for ${demoType}`);
    } else {
      // Default sample fallback
      buffer = Buffer.from('Default packaged commodity demo label sample');
    }

    // Initialize scan record
    const isDemoScan = !!demoType && !file;
    const newScan: IScan = {
      scanId,
      status: 'queued',
      stage: 'queued',
      progress: 5,
      barcode: barcode || undefined,
      imageUrl: file ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}` : undefined,
      demo: isDemoScan,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await saveScan(newScan);

    // Return scanId immediately! Do not block on processing.
    res.status(202).json({
      scanId,
      status: 'queued',
      message: 'Scan received and queued for analysis',
    });

    // Run async orchestrator pipeline in background
    processScanPipeline(scanId, buffer, filename, barcode).catch((err) => {
      console.error(`[Scans API] Background pipeline error for ${scanId}:`, err.message);
    });
  } catch (err: any) {
    console.error('[Scans API] Error creating scan:', err);
    res.status(500).json({ error: 'Failed to initiate scan', details: err.message });
  }
});

// GET /api/scans/:scanId - Get scan details
router.get('/:scanId', async (req: Request, res: Response): Promise<void> => {
  try {
    const scan = await findScanById(req.params.scanId);
    if (!scan) {
      res.status(404).json({ error: 'Scan record not found' });
      return;
    }
    res.json(scan);
  } catch (err: any) {
    res.status(500).json({ error: 'Error fetching scan record', details: err.message });
  }
});

// GET /api/scans - List recent scans for officer dashboard
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string || '20', 10);
    const scans = await listScans(limit);

    // Format for dashboard response
    const formatted = scans.map((s) => ({
      scanId: s.scanId,
      productName: s.fields?.productName?.value || 'Packaged Commodity',
      complianceStatus: s.complianceStatus || (s.status === 'completed' ? 'PASS' : 'CHECKING'),
      complianceScore: s.complianceScore || 0,
      missing: s.fieldChecks?.filter((f) => f.status === 'fail').map((f) => f.label) || [],
      createdAt: s.createdAt,
      status: s.status,
    }));

    res.json({ scans: formatted });
  } catch (err: any) {
    res.status(500).json({ error: 'Error fetching scans list', details: err.message });
  }
});

export default router;
