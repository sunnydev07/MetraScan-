import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File | Blob, filename: string, barcode?: string) => void;
  onDemoSelected: (demoType: 'compliant' | 'missing-mrp' | 'missing-net-quantity' | 'missing-consumer-care') => void;
  isProcessing: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onDemoSelected,
  isProcessing,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Compress image client-side before upload (CLAUDE.md Section 18.1: max 1600px, JPEG 0.8)
  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            'image/jpeg',
            0.82
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setCompressing(true);
    try {
      const compressedBlob = await compressImage(file);
      setCompressing(false);
      onImageSelected(compressedBlob, file.name, barcodeInput.trim() || undefined);
    } catch (err) {
      setCompressing(false);
      onImageSelected(file, file.name, barcodeInput.trim() || undefined);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  return (
    <div id="image-uploader-card" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      {/* Upload Zone */}
      <div
        id="drop-zone"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-10 text-center transition-all cursor-pointer ${
          dragOver
            ? 'border-emerald-500 bg-emerald-950/20'
            : 'border-slate-700 hover:border-slate-600 bg-slate-950/50'
        }`}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files)}
          accept="image/*"
          className="hidden"
          disabled={isProcessing}
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={(e) => handleFileChange(e.target.files)}
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={isProcessing}
        />

        {preview ? (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-slate-700 mb-4 shadow-lg bg-black">
              <img
                src={preview}
                alt="Label preview"
                className="w-full h-full object-contain"
              />
              {compressing && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-emerald-400 font-medium">
                  Optimizing image...
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-slate-300">Image selected for compliance audit</p>
            <p className="text-xs text-slate-500 mt-1">Tap to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100">
              Upload or Snap Product Packaging Label
            </h3>
            <p className="text-sm text-slate-400 max-w-md mt-1 mb-6">
              Drag & drop a clear photo of the commodity label, or use your smartphone camera to capture mandatory Rule 6 declarations.
            </p>

            <div className="flex flex-wrap gap-3 justify-center" onClick={(e) => e.stopPropagation()}>
              <button
                id="camera-capture-btn"
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-950/40 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                Capture with Camera
              </button>
              <button
                id="browse-files-btn"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Browse Device Files
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Optional Barcode Entry */}
      <div className="mt-5 flex items-center gap-3">
        <label htmlFor="barcode-input" className="text-xs font-medium text-slate-400 whitespace-nowrap">
          Barcode / GTIN (Optional):
        </label>
        <input
          id="barcode-input"
          type="text"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          placeholder="e.g. 8901234567890 for instant cache lookup"
          disabled={isProcessing}
          className="flex-1 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Demo Presets Section (CLAUDE.md Section 21) */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Demo Presets (1-Click Test Scenarios)
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-medium">Instant Evaluation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Preset 1 */}
          <button
            id="demo-preset-compliant"
            type="button"
            onClick={() => onDemoSelected('compliant')}
            disabled={isProcessing}
            className="flex flex-col text-left p-3.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                ABC Biscuits (500g)
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-2.5 h-2.5" />
                PASS (100%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              All 7 Legal Metrology Rule 6 declarations present & compliant.
            </p>
          </button>

          {/* Preset 2 */}
          <button
            id="demo-preset-missing-mrp"
            type="button"
            onClick={() => onDemoSelected('missing-mrp')}
            disabled={isProcessing}
            className="flex flex-col text-left p-3.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-rose-400 transition-colors">
                XYZ Chips (200g)
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-2.5 h-2.5" />
                FAIL (71%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              Missing mandatory Maximum Retail Price (MRP) declaration.
            </p>
          </button>

          {/* Preset 3 */}
          <button
            id="demo-preset-missing-net-qty"
            type="button"
            onClick={() => onDemoSelected('missing-net-quantity')}
            disabled={isProcessing}
            className="flex flex-col text-left p-3.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/40 transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-rose-400 transition-colors">
                Pure Olive Oil (₹450)
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-400 border border-rose-500/30">
                <ShieldAlert className="w-2.5 h-2.5" />
                FAIL (71%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              Missing mandatory metric Net Quantity declaration.
            </p>
          </button>

          {/* Preset 4 */}
          <button
            id="demo-preset-missing-consumer-care"
            type="button"
            onClick={() => onDemoSelected('missing-consumer-care')}
            disabled={isProcessing}
            className="flex flex-col text-left p-3.5 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 transition-all group disabled:opacity-50"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                Herbal Soap (100g)
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/70 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-2.5 h-2.5" />
                PARTIAL (86%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2">
              Missing mandatory consumer grievance redressal contact.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
