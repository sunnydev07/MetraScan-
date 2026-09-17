import mongoose from 'mongoose';
import { config } from './config';
import { IScan, ScanModel } from './models/Scan';

let isConnected = false;
const inMemoryStore = new Map<string, IScan>();
const IN_MEMORY_MAX_ENTRIES = 500;

export async function connectDb(): Promise<boolean> {
  if (isConnected) return true;

  try {
    const mongoUri = config.mongoUri;
    // Set a fast serverSelectionTimeoutMS so we don't hang if MongoDB isn't running
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('[DB] Connected to MongoDB successfully');
    return true;
  } catch (err: any) {
    console.warn(`[DB] MongoDB connection failed (${err.message}). Using In-Memory Store for demo.`);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function saveScan(scanData: IScan): Promise<IScan> {
  // Always store in memory for fast retrieval & demo fallback
  if (inMemoryStore.size >= IN_MEMORY_MAX_ENTRIES) {
    const oldestKey = inMemoryStore.keys().next().value;
    if (oldestKey) inMemoryStore.delete(oldestKey);
  }
  inMemoryStore.set(scanData.scanId, { ...scanData });

  if (isDbConnected()) {
    try {
      await (ScanModel as any).findOneAndUpdate(
        { scanId: scanData.scanId },
        scanData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (err: any) {
      console.error('[DB] Error saving to MongoDB:', err.message);
    }
  }

  return scanData;
}

export async function findScanById(scanId: string): Promise<IScan | null> {
  if (isDbConnected()) {
    try {
      const doc = await (ScanModel as any).findOne({ scanId }).lean();
      if (doc) return doc as unknown as IScan;
    } catch (err: any) {
      console.warn('[DB] MongoDB query error:', err.message);
    }
  }
  return inMemoryStore.get(scanId) || null;
}

export async function updateScan(scanId: string, updates: Partial<IScan>): Promise<IScan | null> {
  const existing = inMemoryStore.get(scanId) || (await findScanById(scanId));
  if (!existing) return null;

  const merged: IScan = {
    ...existing,
    ...updates,
    updatedAt: new Date(),
  };

  inMemoryStore.set(scanId, merged);

  if (isDbConnected()) {
    try {
      await (ScanModel as any).findOneAndUpdate(
        { scanId },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
    } catch (err: any) {
      console.warn('[DB] MongoDB update error:', err.message);
    }
  }

  return merged;
}

export async function listScans(limit = 20): Promise<IScan[]> {
  if (isDbConnected()) {
    try {
      const docs = await (ScanModel as any).find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      if (docs && docs.length > 0) {
        return docs as unknown as IScan[];
      }
    } catch (err: any) {
      console.warn('[DB] MongoDB list error:', err.message);
    }
  }

  const scans = Array.from(inMemoryStore.values());
  scans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return scans.slice(0, limit);
}
