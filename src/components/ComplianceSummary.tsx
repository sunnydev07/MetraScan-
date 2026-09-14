import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, ShieldCheck } from 'lucide-react';
import { FieldCheck } from '../types';

interface ComplianceSummaryProps {
  complianceStatus: 'PASS' | 'PARTIAL' | 'FAIL';
  complianceScore: number;
  summary: string;
  fieldChecks: FieldCheck[];
  cacheHit?: boolean;
}

export const ComplianceSummary: React.FC<ComplianceSummaryProps> = ({
  complianceStatus,
  complianceScore,
  summary,
  fieldChecks,
  cacheHit,
}) => {
  const passedCount = fieldChecks.filter((c) => c.status === 'pass').length;
  const warningCount = fieldChecks.filter((c) => c.status === 'warning').length;
  const failCount = fieldChecks.filter((c) => c.status === 'fail').length;

  const isPass = complianceStatus === 'PASS';
  const isPartial = complianceStatus === 'PARTIAL';

  const badgeConfig = {
    PASS: {
      label: 'Compliant',
      bgColor: 'bg-emerald-950/60',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      icon: CheckCircle2,
      accent: 'from-emerald-500/20 to-transparent',
    },
    PARTIAL: {
      label: 'Partially Compliant',
      bgColor: 'bg-amber-950/60',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      icon: AlertTriangle,
      accent: 'from-amber-500/20 to-transparent',
    },
    FAIL: {
      label: 'Non-compliant',
      bgColor: 'bg-rose-950/60',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
      icon: XCircle,
      accent: 'from-rose-500/20 to-transparent',
    },
  }[complianceStatus] || {
    label: 'Checking',
    bgColor: 'bg-slate-900',
    borderColor: 'border-slate-800',
    textColor: 'text-slate-400',
    icon: Info,
    accent: 'from-slate-800/20 to-transparent',
  };

  const StatusIcon = badgeConfig.icon;

  return (
    <div id="compliance-summary-card" className="w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${badgeConfig.accent} rounded-full blur-3xl pointer-events-none -mr-20 -mt-20`} />

      <div className="relative z-10">
        {/* Header row with Status Badge & Score Gauge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${badgeConfig.bgColor} backdrop-blur-md border ${badgeConfig.borderColor} flex items-center justify-center ${badgeConfig.textColor} shadow-lg shrink-0`}>
              <StatusIcon className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeConfig.bgColor} backdrop-blur-md ${badgeConfig.textColor} border ${badgeConfig.borderColor}`}>
                  {badgeConfig.label}
                </span>
                {cacheHit && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-teal-950/80 backdrop-blur-md text-teal-300 border border-teal-500/20">
                    Sub-second Cache Hit
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Legal Metrology (Packaged Commodities) Rules, 2011
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1.5">
                Rule 6 Mandatory Declarations Audit
              </h2>
            </div>
          </div>

          {/* Score Counter Box */}
          <div className="flex items-center gap-4 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:px-6 shrink-0 shadow-inner">
            <div className="text-right">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block">
                Compliance Index
              </span>
              <span className="text-xs text-slate-400">
                {passedCount} of {fieldChecks.length} Declarations Verified
              </span>
            </div>
            <div className="flex items-baseline">
              <span className={`text-4xl font-extrabold font-mono tracking-tight ${badgeConfig.textColor}`}>
                {complianceScore}
              </span>
              <span className="text-lg font-bold text-slate-400 font-mono">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Plain Language Summary */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10 shadow-inner">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Plain-Language Audit Summary
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {summary}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill Row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-slate-950/50 backdrop-blur-md border border-white/10 text-center shadow-sm">
            <span className="text-xs text-slate-400 block mb-0.5">Compliant Fields</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{passedCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 backdrop-blur-md border border-white/10 text-center shadow-sm">
            <span className="text-xs text-slate-400 block mb-0.5">Warnings / Unclear</span>
            <span className="text-base font-bold text-amber-400 font-mono">{warningCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/50 backdrop-blur-md border border-white/10 text-center shadow-sm">
            <span className="text-xs text-slate-400 block mb-0.5">Missing Required</span>
            <span className="text-base font-bold text-rose-400 font-mono">{failCount}</span>
          </div>
        </div>

        {/* Guardrail Disclaimer (CLAUDE.md Section 3 & 23) */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Decision-Support Notice:</strong> This scanner assists officers by identifying mandatory declarations. It provides automated decision support and is not a substitute for official legal verification or statutory penalty issuance.
          </span>
        </div>
      </div>
    </div>
  );
};
