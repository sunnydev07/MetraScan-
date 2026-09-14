import { Router } from 'express';
import {
  OFFICIAL_METROLOGY_DOCUMENTS,
  searchRegulations,
  getRegulationsByCategory,
  getCorePackagedCommoditiesRegulations,
  findRegulationById
} from '../data/metrologyRulesDataset';

const router = Router();

// GET /api/regulations - list all regulations with optional filters
router.get('/', (req, res) => {
  try {
    const { category, year, pcrOnly, query } = req.query;

    let results = OFFICIAL_METROLOGY_DOCUMENTS;

    if (pcrOnly === 'true') {
      results = getCorePackagedCommoditiesRegulations();
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      results = results.filter((doc) => doc.category.toLowerCase() === category.toLowerCase());
    }

    if (year && typeof year === 'string' && year !== 'ALL') {
      results = results.filter((doc) => doc.year === year);
    }

    if (query && typeof query === 'string' && query.trim()) {
      const q = query.toLowerCase().trim();
      results = results.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          doc.description.toLowerCase().includes(q) ||
          doc.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.json({
      total: results.length,
      allTotal: OFFICIAL_METROLOGY_DOCUMENTS.length,
      documents: results,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve regulations', message: err.message });
  }
});

// GET /api/regulations/stats - category and year breakdown
router.get('/stats', (req, res) => {
  try {
    const categories: Record<string, number> = {};
    const years: Record<string, number> = {};
    let pcrCount = 0;

    OFFICIAL_METROLOGY_DOCUMENTS.forEach((doc) => {
      categories[doc.category] = (categories[doc.category] || 0) + 1;
      if (doc.year) {
        years[doc.year] = (years[doc.year] || 0) + 1;
      }
      if (doc.isCorePCR) pcrCount++;
    });

    res.json({
      totalDocuments: OFFICIAL_METROLOGY_DOCUMENTS.length,
      pcrCount,
      categories,
      years,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve stats', message: err.message });
  }
});

// GET /api/regulations/:id - retrieve single document
router.get('/:id', (req, res) => {
  try {
    const doc = findRegulationById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Regulation not found' });
    }
    res.json(doc);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve regulation', message: err.message });
  }
});

export default router;
