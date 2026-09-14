import mongoose, { Schema, Document } from 'mongoose';

export interface ExtractedField {
  value: string | null;
  raw: string | null;
  confidence: number;
  source: string | null;
  found: boolean;
}

export interface StatutoryCitation {
  title: string;
  url: string;
  category?: string;
  year?: string;
  dateOfIssue?: string;
  ruleClause?: string;
  description?: string;
}

export interface FieldCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning' | 'skipped';
  evidence: string;
  message: string;
  statutoryCitation?: StatutoryCitation;
}

export interface AgentEvent {
  stage: string;
  agent?: string;
  tool?: string;
  message?: string;
  input?: any;
  result?: any;
  status?: string;
  timestamp: string;
}

export interface IScan {
  scanId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  stage: string;
  progress: number;
  imageUrl?: string;
  imageHash?: string;
  barcode?: string;
  ocr?: {
    provider: string;
    rawText: string;
    confidence: number;
    completedAt?: Date;
  };
  fields?: Record<string, ExtractedField>;
  fieldChecks?: FieldCheck[];
  complianceScore?: number;
  complianceStatus?: 'PASS' | 'PARTIAL' | 'FAIL';
  summary?: string;
  ai?: {
    needed: boolean;
    lowConfidenceFields: string[];
    agentEvents: AgentEvent[];
  };
  cacheHit?: boolean;
  demo?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScanDocument extends IScan, Document {}

const ExtractedFieldSchema = new Schema<ExtractedField>({
  value: { type: String, default: null },
  raw: { type: String, default: null },
  confidence: { type: Number, default: 0 },
  source: { type: String, default: null },
  found: { type: Boolean, default: false },
}, { _id: false });

const FieldCheckSchema = new Schema<FieldCheck>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  status: { type: String, enum: ['pass', 'fail', 'warning', 'skipped'], required: true },
  evidence: { type: String, default: '' },
  message: { type: String, default: '' },
}, { _id: false });

const AgentEventSchema = new Schema<AgentEvent>({
  stage: { type: String, required: true },
  agent: { type: String },
  tool: { type: String },
  message: { type: String },
  input: { type: Schema.Types.Mixed },
  result: { type: Schema.Types.Mixed },
  status: { type: String },
  timestamp: { type: String, required: true },
}, { _id: false });

export const ScanSchema = new Schema<ScanDocument>({
  scanId: { type: String, required: true, unique: true, index: true },
  status: { type: String, enum: ['queued', 'processing', 'completed', 'failed'], default: 'queued' },
  stage: { type: String, default: 'queued' },
  progress: { type: Number, default: 0 },
  imageUrl: { type: String },
  imageHash: { type: String, index: true },
  barcode: { type: String, index: true },
  ocr: {
    provider: { type: String },
    rawText: { type: String },
    confidence: { type: Number },
    completedAt: { type: Date },
  },
  fields: {
    type: Map,
    of: ExtractedFieldSchema,
    default: {},
  },
  fieldChecks: [FieldCheckSchema],
  complianceScore: { type: Number, default: 0 },
  complianceStatus: { type: String, enum: ['PASS', 'PARTIAL', 'FAIL'], default: 'FAIL' },
  summary: { type: String, default: '' },
  ai: {
    needed: { type: Boolean, default: false },
    lowConfidenceFields: [{ type: String }],
    agentEvents: [AgentEventSchema],
  },
  cacheHit: { type: Boolean, default: false },
  demo: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const ScanModel = mongoose.models.Scan || mongoose.model<IScan>('Scan', ScanSchema);
