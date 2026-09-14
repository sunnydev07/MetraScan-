import React from 'react';
import { Loader2, CheckCircle2, Clock, Sparkles, AlertTriangle } from 'lucide-react';

interface ScanProgressProps {
  stage: string;
  progress: number;
  message?: string;
  error?: string;
}

const STAGE_STEPS = [
  { id: 'queued', label: 'Queued', target: 5 },
  { id: 'cache_check', label: 'Cache Lookup', target: 15 },
  { id: 'ocr_started', label: 'OCR Label Parsing', target: 35 },
  { id: 'fields_extracted', label: 'Regex Extraction', target: 60 },
  { id: 'rules_checked', label: 'Rule 6 Audit', target: 85 },
  { id: 'completed', label: 'Report Generated', target: 100 },
];

export const ScanProgress: React.FC<ScanProgressProps> = ({
  stage,
  progress,
  message,
  error,
}) => {
  return (
    <div id="scan-progress-card" className="w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {error ? (
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          ) : progress < 100 ? (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}

          <div>
            <h4 className="text-base font-semibold text-slate-100">
              {error ? 'Inspection Pipeline Interrupted' : progress < 100 ? 'Analyzing Label Compliance...' : 'Compliance Analysis Complete'}
            </h4>
            <p className="text-xs text-slate-400">
              {message || 'Extracting mandatory Legal Metrology Rule 6 declarations'}
            </p>
          </div>
        </div>

        <span className="text-xl font-bold font-mono text-emerald-400">
          {Math.min(100, Math.round(progress))}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950/70 backdrop-blur-md rounded-full h-2.5 overflow-hidden border border-white/10 mb-6">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            error
              ? 'bg-rose-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
          }`}
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Stage Flow Indicator */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {STAGE_STEPS.map((step, idx) => {
          const isDone = progress >= step.target;
          const isCurrent = progress < step.target && (idx === 0 || progress >= STAGE_STEPS[idx - 1].target);

          return (
            <div
              key={step.id}
              className={`p-2.5 rounded-xl border text-center backdrop-blur-md transition-all ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-slate-800/80 border-white/20 text-slate-200 shadow-md'
                  : 'bg-slate-950/40 border-white/5 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>
              <p className="text-[11px] font-medium leading-tight truncate">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
