import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Upload,
  Scan,
  Sparkles,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  Layers,
  Crosshair,
  RefreshCw,
  FileCheck,
  ChevronRight
} from 'lucide-react';

interface ScannerHUDProps {
  onImageSelected: (file: File | Blob, filename: string, barcode?: string) => void;
  onDemoSelected: (demoType: 'compliant' | 'missing-mrp' | 'missing-net-quantity' | 'missing-consumer-care') => void;
  isProcessing: boolean;
  stage?: string;
  progress?: number;
}

interface Specimen {
  id: 'compliant' | 'missing-mrp' | 'missing-net-quantity' | 'missing-consumer-care';
  title: string;
  brand: string;
  category: string;
  declaredQty: string;
  verdict: 'PASS' | 'FAIL';
  score: number;
  highlight: string;
  defectDesc?: string;
  gtin: string;
  labelSnippet: {
    mrp: string;
    qty: string;
    mfg: string;
    date: string;
    care: string;
  };
}

const SPECIMENS: Specimen[] = [
  {
    id: 'compliant',
    title: 'ABC Butter Cookies',
    brand: 'ABC Foods Ltd',
    category: 'Bakery Confectionery',
    declaredQty: '500 g',
    verdict: 'PASS',
    score: 100,
    highlight: 'All 7 mandatory declarations present & verified',
    gtin: '8901234567890',
    labelSnippet: {
      mrp: '₹120.00 (Incl. of all taxes)',
      qty: 'Net Wt. 500 g',
      mfg: 'ABC Foods Pvt Ltd, Mumbai, MH - 400001',
      date: 'Mfg Date: 08/2025',
      care: '1800-123-4567 | care@abcfoods.in',
    },
  },
  {
    id: 'missing-mrp',
    title: 'XYZ Spiced Potato Crisps',
    brand: 'XYZ Snacks Corp',
    category: 'Packaged Snacks',
    declaredQty: '200 g',
    verdict: 'FAIL',
    score: 71,
    highlight: 'Deficient: Maximum Retail Price (MRP) missing',
    defectDesc: 'Rule 6(1)(e) violation: Commodity packed without consumer MRP',
    gtin: '8902468135790',
    labelSnippet: {
      mrp: '[MISSING DECLARATION]',
      qty: 'Net Qty: 200 g',
      mfg: 'XYZ Snacks Corp, Pune, MH - 411001',
      date: 'PKD: 07/2025',
      care: '020-88997766 | help@xyzsnacks.com',
    },
  },
  {
    id: 'missing-net-quantity',
    title: 'Cold-Pressed Virgin Olive Oil',
    brand: 'Mediterranean Naturals',
    category: 'Edible Cooking Oil',
    declaredQty: 'Missing Metric Unit',
    verdict: 'FAIL',
    score: 71,
    highlight: 'Deficient: Net Quantity declaration missing',
    defectDesc: 'Rule 6(1)(c) violation: No metric weight or volume indicated',
    gtin: '8909876543210',
    labelSnippet: {
      mrp: '₹850.00 (Incl. of all taxes)',
      qty: '[MISSING METRIC QUANTITY]',
      mfg: 'Mediterranean Naturals, Rajkot, GJ - 360001',
      date: 'Pkg: 06/2025',
      care: 'support@mednaturals.com',
    },
  },
  {
    id: 'missing-consumer-care',
    title: 'NutriGrow Infant Cereal Formula',
    brand: 'NutriGrow Health Ltd',
    category: 'Infant Nutrition',
    declaredQty: '400 g',
    verdict: 'FAIL',
    score: 71,
    highlight: 'Deficient: Consumer Grievance Care missing',
    defectDesc: 'Rule 6(1)(g) violation: No telephone helpline or care email',
    gtin: '8901122334455',
    labelSnippet: {
      mrp: '₹340.00 (Incl. of all taxes)',
      qty: 'Net Qty: 400 g',
      mfg: 'NutriGrow Health Ltd, Baddi, HP - 173205',
      date: 'Mfg: 09/2025',
      care: '[NO GRIEVANCE CONTACT]',
    },
  },
];

export const ScannerHUD: React.FC<ScannerHUDProps> = ({
  onImageSelected,
  onDemoSelected,
  isProcessing,
  stage = 'idle',
  progress = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'specimens'>('camera');
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen>(SPECIMENS[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [barcodeValue, setBarcodeValue] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [inspectedZone, setInspectedZone] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Client-side downscaling per CLAUDE.md (<1600px, 0.82 JPEG)
  const processImageFile = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1600;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob((b) => resolve(b || file), 'image/jpeg', 0.82);
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileDrop = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    setOptimizing(true);
    try {
      const compressed = await processImageFile(file);
      setOptimizing(false);
      onImageSelected(compressed, file.name, barcodeValue.trim() || undefined);
    } catch {
      setOptimizing(false);
      onImageSelected(file, file.name, barcodeValue.trim() || undefined);
    }
  };

  const handleLaunchSpecimen = (specimen: Specimen) => {
    setSelectedSpecimen(specimen);
    onDemoSelected(specimen.id);
  };

  return (
    <div id="scanner-hud-container" className="w-full space-y-5">
      {/* Top Inspection Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl shadow-lg">
        <div className="flex items-center gap-1">
          <button
            type="button"
            id="tab-camera-capture"
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'camera'
                ? 'bg-slate-800/80 backdrop-blur-md text-slate-100 shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Optical Capture & Upload</span>
          </button>

          <button
            type="button"
            id="tab-specimens"
            onClick={() => setActiveTab('specimens')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'specimens'
                ? 'bg-slate-800/80 backdrop-blur-md text-slate-100 shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Test Commodity Library</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30">
              4 Scenarios
            </span>
          </button>
        </div>

        {/* HUD Telemetry Badges */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 px-3 py-1 bg-slate-950/60 backdrop-blur-md rounded-lg border border-white/10 self-end sm:self-auto">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            {isProcessing ? 'PROCESSING' : 'HUD READY'}
          </span>
          <span className="text-slate-600">|</span>
          <span>RULE 6-PC-2011</span>
        </div>
      </div>

      {/* Main Optical Scanner Viewport */}
      <div className="relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Subtle coordinate grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Viewfinder Target Frame */}
        <div className="relative p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
          {/* 4 Optical Corner Reticles */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-500/70" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-500/70" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-500/70" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-500/70" />

          {/* Central Laser Beam Animation (Visible when processing or hovered) */}
          {(isProcessing || dragActive) && (
            <motion.div
              className="absolute left-0 right-0 pointer-events-none z-30 flex flex-col items-center"
              initial={{ top: '6%' }}
              animate={{ top: ['6%', '92%', '6%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              {/* Trailing green semi-transparent gradient */}
              <div className="w-full h-16 bg-gradient-to-t from-emerald-500/20 via-emerald-500/5 to-transparent" />
              {/* Focus laser line */}
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_#34d399]" />
              {/* Leading green glow */}
              <div className="w-full h-6 bg-gradient-to-b from-emerald-500/10 to-transparent" />
            </motion.div>
          )}

          {/* Viewfinder Header Metadata */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>OPTICAL_TARGET_ACQUISITION // FIELD_OF_VIEW</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block">DPI: 300+</span>
              <span className="text-slate-300 font-semibold">
                {activeTab === 'camera' ? 'LIVE INPUT STREAM' : selectedSpecimen.brand}
              </span>
            </div>
          </div>

          {/* TAB 1: Camera & Image Upload Zone */}
          {activeTab === 'camera' && (
            <div
              id="camera-drop-area"
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileDrop(e.dataTransfer.files);
              }}
              className={`relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-10 rounded-xl border transition-all text-center backdrop-blur-md ${
                dragActive
                  ? 'border-emerald-500/80 bg-emerald-950/30'
                  : 'border-white/10 bg-slate-900/40 hover:bg-slate-900/60 hover:border-white/20'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileDrop(e.target.files)}
                accept="image/*"
                className="hidden"
                disabled={isProcessing}
              />
              <input
                type="file"
                ref={cameraInputRef}
                onChange={(e) => handleFileDrop(e.target.files)}
                accept="image/*"
                capture="environment"
                className="hidden"
                disabled={isProcessing}
              />

              {previewUrl ? (
                <div className="relative max-w-sm w-full">
                  <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/60 backdrop-blur-md shadow-lg p-2">
                    <img
                      src={previewUrl}
                      alt="Commodity packaging preview"
                      className="w-full h-48 sm:h-56 object-contain rounded"
                    />
                    {optimizing && (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>OPTIMIZING PIXEL DENSITY...</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>Selected for Legal Metrology audit</span>
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(null)}
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      Clear / Rescan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
                    <Scan className="w-8 h-8" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1">
                    Frame Packaging Label in Inspection Viewfinder
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Position the principal display panel or declaration box containing MRP, net quantity, batch date, and manufacturer coordinates.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      id="viewfinder-camera-btn"
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-950/40 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture with Camera</span>
                    </button>

                    <button
                      id="viewfinder-upload-btn"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 border border-white/10 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Select Packaging Photo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Interactive Specimen Library Viewport */}
          {activeTab === 'specimens' && (
            <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Left Specimen Selector List */}
              <div className="md:col-span-5 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                  Select Packaged Commodity Specimen:
                </span>
                {SPECIMENS.map((item) => {
                  const isSelected = selectedSpecimen.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedSpecimen(item)}
                      className={`w-full text-left p-3 rounded-xl border backdrop-blur-md transition-all ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500/60 text-slate-100 shadow-md'
                          : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold truncate pr-2">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            item.verdict === 'PASS'
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {item.verdict} ({item.score}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate">{item.category}</span>
                        <span className="font-mono text-slate-400">{item.declaredQty}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Interactive Label Preview Canvas with Simulated Bounding Box HUD */}
              <div className="md:col-span-7 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 font-mono">
                        {selectedSpecimen.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        GTIN / Barcode: {selectedSpecimen.gtin}
                      </p>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        selectedSpecimen.verdict === 'PASS'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {selectedSpecimen.highlight}
                    </span>
                  </div>

                  {/* Simulated Packaging Label with Target Zones */}
                  <div className="p-3.5 bg-slate-950/70 backdrop-blur-md rounded-lg border border-white/10 font-mono text-[11px] space-y-2 relative overflow-hidden">
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider pb-1 border-b border-white/5 flex justify-between">
                      <span>PACKAGING DECLARATIONS PANEL</span>
                      <span className="text-slate-400">LEGAL METROLOGY ZONE</span>
                    </div>

                    <div
                      onMouseEnter={() => setInspectedZone('mrp')}
                      onMouseLeave={() => setInspectedZone(null)}
                      className={`p-1.5 rounded transition-all border backdrop-blur-md ${
                        selectedSpecimen.labelSnippet.mrp.includes('MISSING')
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                          : inspectedZone === 'mrp'
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                          : 'bg-slate-900/60 border-white/10 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block font-semibold">Rule 6(1)(e) - MRP:</span>
                      {selectedSpecimen.labelSnippet.mrp}
                    </div>

                    <div
                      onMouseEnter={() => setInspectedZone('qty')}
                      onMouseLeave={() => setInspectedZone(null)}
                      className={`p-1.5 rounded transition-all border backdrop-blur-md ${
                        selectedSpecimen.labelSnippet.qty.includes('MISSING')
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                          : inspectedZone === 'qty'
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                          : 'bg-slate-900/60 border-white/10 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block font-semibold">Rule 6(1)(c) - Net Qty:</span>
                      {selectedSpecimen.labelSnippet.qty}
                    </div>

                    <div className="p-1.5 rounded bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-300">
                      <span className="text-[10px] text-slate-400 block font-semibold">Rule 6(1)(a) - Manufacturer:</span>
                      {selectedSpecimen.labelSnippet.mfg}
                    </div>

                    <div
                      onMouseEnter={() => setInspectedZone('care')}
                      onMouseLeave={() => setInspectedZone(null)}
                      className={`p-1.5 rounded transition-all border backdrop-blur-md ${
                        selectedSpecimen.labelSnippet.care.includes('NO GRIEVANCE')
                          ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                          : 'bg-slate-900/60 border-white/10 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block font-semibold">Rule 6(1)(g) - Consumer Care:</span>
                      {selectedSpecimen.labelSnippet.care}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Click trigger to launch full legal audit pipeline
                  </span>
                  <button
                    id="trigger-selected-specimen-btn"
                    type="button"
                    onClick={() => handleLaunchSpecimen(selectedSpecimen)}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <span>Analyze Specimen</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Viewfinder Bottom Auxiliary Bar */}
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Barcode className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                id="hud-barcode-input"
                type="text"
                value={barcodeValue}
                onChange={(e) => setBarcodeValue(e.target.value)}
                placeholder="GTIN / EAN-13 Barcode (e.g. 8901234567890)"
                className="w-full bg-slate-900/70 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono shadow-inner"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>SCANNER LATENCY: &lt; 500MS</span>
              <span className="text-slate-600">|</span>
              <span>CACHE HIT: ENABLED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
