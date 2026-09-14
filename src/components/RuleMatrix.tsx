import React, { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';

interface RuleItem {
  clause: string;
  field: string;
  statutoryMandate: string;
  verificationCriteria: string;
  standardFormat: string;
}

const RULES: RuleItem[] = [
  {
    clause: 'Rule 6(1)(a)',
    field: 'Manufacturer / Packer / Importer',
    statutoryMandate: 'Complete legal identity and physical operational premises with pincode.',
    verificationCriteria: 'Registered corporate name, premises address, postal pincode must be fully legible.',
    standardFormat: 'Mfd by: [Company Name], [Plot/Survey], [City], [State] - [Pincode]',
  },
  {
    clause: 'Rule 6(1)(b)',
    field: 'Country of Origin',
    statutoryMandate: 'Origin nation must be explicitly declared on both domestic & imported goods.',
    verificationCriteria: 'Mandatory standalone statement or phrase like "Made in India" or "Country of Origin: [X]".',
    standardFormat: 'Country of Origin: India / Made in India',
  },
  {
    clause: 'Rule 6(1)(c)',
    field: 'Generic / Trade Commodity Name',
    statutoryMandate: 'Common or generic description prominently displayed on principal display panel.',
    verificationCriteria: 'Identifies true nature of goods without misleading consumer trade descriptors.',
    standardFormat: '[Generic Name e.g. "Biscuits", "Refined Sunflower Oil"]',
  },
  {
    clause: 'Rule 6(1)(d)',
    field: 'Net Quantity (Metric System)',
    statutoryMandate: 'Standard metric units (g, kg, ml, L, pieces). Symbols without trailing period.',
    verificationCriteria: 'Must adhere to Second Schedule standard units; prohibited non-standard symbols like "gms", "kilo".',
    standardFormat: 'Net Qty: [Number] g / kg / ml / L / N',
  },
  {
    clause: 'Rule 6(1)(e)',
    field: 'Month & Year of Manufacture / Pkg',
    statutoryMandate: 'Date of manufacturing, packaging, or import for pre-packed commodities.',
    verificationCriteria: 'Must declare Month (letters or 2 digits) and Year (4 digits or 2 digits).',
    standardFormat: 'Mfg Date: MM/YYYY or PKD: MM/YYYY',
  },
  {
    clause: 'Rule 6(1)(f)',
    field: 'Maximum Retail Price (MRP)',
    statutoryMandate: 'MRP in Indian Rupees, inclusive of all taxes. Rounded up to nearest 50 paise.',
    verificationCriteria: 'Must include phrase "incl. of all taxes" or "(incl. of taxes)" and currency sign ₹ or Rs.',
    standardFormat: 'MRP ₹ [Amount] (incl. of all taxes)',
  },
  {
    clause: 'Rule 6(1)(g)',
    field: 'Consumer Grievance Care Contact',
    statutoryMandate: 'Officer designation, postal address, operational helpline telephone, and email.',
    verificationCriteria: 'Must include reachable telephone number, email ID, and postal contact of grievance cell.',
    standardFormat: 'Consumer Care: 1800-XXX-XXXX | care@company.com | [Address]',
  },
];

export const RuleMatrix: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div id="statutory-rule-matrix" className="w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-emerald-400 shadow-sm">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100">
              Legal Metrology (Packaged Commodities) Rules, 2011
            </h3>
            <p className="text-xs text-slate-400">
              Statutory verification matrix enforced by the automated scanner
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 px-2.5 py-1 rounded-lg bg-slate-950/60 backdrop-blur-md border border-white/10 self-start sm:self-auto shadow-inner">
          7 Statutory Clauses
        </span>
      </div>

      {/* Structured Clauses Table/List */}
      <div className="mt-4 divide-y divide-white/5">
        {RULES.map((rule, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div key={rule.clause} className="py-3">
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-emerald-400 shrink-0 w-24">
                    {rule.clause}
                  </span>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {rule.field}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 hidden md:inline-block max-w-sm truncate">
                    {rule.statutoryMandate}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="mt-3 p-4 bg-slate-950/60 backdrop-blur-md rounded-xl border border-white/10 space-y-2.5 text-xs shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="font-semibold text-slate-400 sm:w-36 shrink-0">Statutory Mandate:</span>
                    <span className="text-slate-300">{rule.statutoryMandate}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="font-semibold text-slate-400 sm:w-36 shrink-0">Audit Criteria:</span>
                    <span className="text-slate-300">{rule.verificationCriteria}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 pt-2 border-t border-white/5">
                    <span className="font-semibold text-emerald-400 sm:w-36 shrink-0">Standard Format:</span>
                    <code className="text-slate-300 font-mono bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                      {rule.standardFormat}
                    </code>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
