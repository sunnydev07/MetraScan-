export interface ExtractedField {
  value: string | null;
  raw: string | null;
  confidence: number;
  source: string | null;
  found: boolean;
}

export interface FieldCheck {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning' | 'skipped';
  evidence: string;
  message: string;
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

export interface ScanRecord {
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
    completedAt?: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface DashboardScanItem {
  scanId: string;
  productName: string;
  complianceStatus: 'PASS' | 'PARTIAL' | 'FAIL' | 'CHECKING';
  complianceScore: number;
  missing: string[];
  createdAt: string;
  status: string;
}

export interface ChatToolCall {
  tool: string;
  input: any;
  result: any;
  executionTimeMs?: number;
}

export interface GroundingSource {
  title: string;
  url: string;
  snippet?: string;
  category?: 'regulation' | 'company' | 'case_law' | 'general';
  authority?: string;
  referenceNumber?: string;
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  groundingChunks?: Array<{
    web?: {
      uri?: string;
      title?: string;
    };
  }>;
  sources?: GroundingSource[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCalls?: ChatToolCall[];
  groundingMetadata?: GroundingMetadata;
  model?: string;
}


