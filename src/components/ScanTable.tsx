import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { DashboardScanItem } from '../types';

interface ScanTableProps {
  scans: DashboardScanItem[];
  onSelectScan: (scanId: string) => void;
}

export const ScanTable: React.FC<ScanTableProps> = ({ scans, onSelectScan }) => {
  const getBadge = (status: string, score: number) => {
    if (status === 'PASS' || score === 100) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          Compliant
        </span>
      );
    }
    if (status === 'PARTIAL' || score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950/70 backdrop-blur-md text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" />
          Partially Compliant
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950/70 backdrop-blur-md text-rose-400 border border-rose-500/30">
        <XCircle className="w-3 h-3" />
        Non-compliant
      </span>
    );
  };

  if (scans.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
        <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h4 className="text-slate-200 font-semibold">No Inspection Records</h4>
        <p className="text-xs text-slate-400 mt-1">
          Perform a label scan or select a demo preset to generate inspection history.
        </p>
      </div>
    );
  }

  return (
    <div id="scan-history-table-container" className="w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Scan Ref / Time</th>
              <th className="py-3.5 px-4">Commodity / Trade Name</th>
              <th className="py-3.5 px-4">Rule 6 Status</th>
              <th className="py-3.5 px-4">Score</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Missing / Deficient Declarations</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs">
            {scans.map((scan) => {
              const timeFormatted = new Date(scan.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <tr
                  key={scan.scanId}
                  className="hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={() => onSelectScan(scan.scanId)}
                >
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-mono text-slate-300 font-medium block truncate max-w-[120px]">
                      {scan.scanId}
                    </span>
                    <span className="text-[11px] text-slate-400">{timeFormatted}</span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-200 max-w-[180px] truncate">
                    {scan.productName}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {getBadge(scan.complianceStatus, scan.complianceScore)}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`font-mono font-bold text-sm ${
                        scan.complianceScore >= 90
                          ? 'text-emerald-400'
                          : scan.complianceScore >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {scan.complianceScore}%
                    </span>
                  </td>

                  <td className="py-4 px-4 hidden md:table-cell max-w-[240px]">
                    {scan.missing && scan.missing.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {scan.missing.map((item, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-rose-950/40 backdrop-blur-md text-rose-300 border border-rose-500/20"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-medium">
                        All mandatory fields present
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      id={`inspect-btn-${scan.scanId}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScan(scan.scanId);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/10 group-hover:bg-emerald-600 group-hover:border-emerald-500/30 text-slate-200 group-hover:text-white text-xs font-medium transition-all shadow-sm"
                    >
                      <span>Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
