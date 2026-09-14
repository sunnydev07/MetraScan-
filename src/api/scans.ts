import { ScanRecord, DashboardScanItem } from '../types';

export async function uploadScan(file: File | Blob, filename = 'label.jpg', barcode?: string): Promise<{ scanId: string; status: string; message: string }> {
  const formData = new FormData();
  formData.append('image', file, filename);
  if (barcode) {
    formData.append('barcode', barcode);
  }

  const res = await fetch('/api/scans', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(errorData.error || `Server returned ${res.status}`);
  }

  return res.json();
}

export async function triggerDemoScan(demoType: 'compliant' | 'missing-mrp' | 'missing-net-quantity' | 'missing-consumer-care'): Promise<{ scanId: string; status: string }> {
  const formData = new FormData();
  formData.append('demoType', demoType);

  const res = await fetch('/api/scans', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to start demo scan');
  }

  return res.json();
}

export async function getScan(scanId: string): Promise<ScanRecord> {
  const res = await fetch(`/api/scans/${scanId}`);
  if (!res.ok) {
    throw new Error(`Scan not found (${res.status})`);
  }
  return res.json();
}

export async function listScans(limit = 20): Promise<{ scans: DashboardScanItem[] }> {
  const res = await fetch(`/api/scans?limit=${limit}`);
  if (!res.ok) {
    throw new Error('Failed to fetch scans list');
  }
  return res.json();
}

export async function getHealth(): Promise<{ status: string; demoMode: boolean; ocrProvider: string; database: string }> {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error('Failed to fetch health check');
  }
  return res.json();
}
