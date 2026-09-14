import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Compass, Tag } from 'lucide-react';
import { FieldCheck, ExtractedField } from '../types';

interface FieldResultCardProps {
  check: FieldCheck;
  fieldData?: ExtractedField;
  index: number;
}

export const FieldResultCard: React.FC<FieldResultCardProps> = ({
  check,
  fieldData,
  index,
}) => {
  const isPass = check.status === 'pass';
  const isWarning = check.status === 'warning';
  const isFail = check.status === 'fail';

  const statusConfig = {
    pass: {
      label: 'Compliant',
      bgColor: 'bg-emerald-950/30',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
      pillBg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
    warning: {
      label: 'Warning / Unclear',
      bgColor: 'bg-amber-950/30',
      borderColor: 'border-amber-500/20',
      textColor: 'text-amber-400',
      pillBg: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
    },
    fail: {
      label: 'Missing Declaration',
      bgColor: 'bg-rose-950/30',
      borderColor: 'border-rose-500/20',
      textColor: 'text-rose-400',
      pillBg: 'bg-rose-950/60 text-rose-400 border-rose-500/30',
      icon: XCircle,
    },
    skipped: {
      label: 'Not Applicable',
      bgColor: 'bg-slate-900',
      borderColor: 'border-slate-800',
      textColor: 'text-slate-400',
      pillBg: 'bg-slate-900 text-slate-400 border-slate-700',
      icon: CheckCircle2,
    },
  }[check.status];

  const StatusIcon = statusConfig.icon;
  const confidencePercent = fieldData ? Math.round(fieldData.confidence * 100) : 0;

  return (
    <div
      id={`field-card-${check.id}`}
      className={`rounded-2xl border p-5 transition-all backdrop-blur-md ${statusConfig.bgColor} border-white/10 hover:border-white/20 bg-slate-900/60 shadow-lg`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl border border-white/10 ${statusConfig.textColor} shrink-0 bg-slate-950/60 mt-0.5 shadow-sm`}>
            <StatusIcon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                Rule 6.{index + 1}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${statusConfig.pillBg}`}>
                {statusConfig.label}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-100">
              {check.label}
            </h3>
          </div>
        </div>

        {/* Confidence & Source Badges */}
        {fieldData && fieldData.found && (
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border backdrop-blur-md ${
                confidencePercent >= 85
                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                  : confidencePercent >= 60
                  ? 'bg-amber-950/50 text-amber-400 border-amber-500/30'
                  : 'bg-rose-950/50 text-rose-400 border-rose-500/30'
              }`}
            >
              {confidencePercent}% conf
            </span>
            {fieldData.source && (
              <span className="text-[10px] text-slate-400 font-mono">
                {fieldData.source}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Evidence Quote Block */}
      <div className="mt-3 p-3.5 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-inner">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-slate-400" />
            Detected Evidence from Packaging Label:
          </span>
          {fieldData?.value && (
            <span className="text-[11px] font-semibold text-emerald-400 font-mono">
              Value: {fieldData.value}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-300 font-mono bg-slate-900/60 backdrop-blur-md p-2.5 rounded-lg border border-white/10 whitespace-pre-wrap break-words">
          {check.evidence || 'No text snippet matched for this declaration.'}
        </p>
      </div>

      {/* Legal Metrology Note */}
      <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
        <p className="leading-normal">
          <strong className="text-slate-300 font-medium">Audit Finding: </strong>
          {check.message}
        </p>
      </div>
    </div>
  );
};
