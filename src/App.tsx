/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScanPage } from './pages/ScanPage';
import { ReportPage } from './pages/ReportPage';
import { DashboardPage } from './pages/DashboardPage';
import { getHealth } from './api/scans';
import { ShieldCheck, Camera, LayoutDashboard, FileCheck2, Scale } from 'lucide-react';

type ViewMode = 'scan' | 'report' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewMode>('scan');
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [health, setHealth] = useState<{ status: string; demoMode: boolean; database: string } | null>(null);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((err) => console.warn('Health check error:', err));
  }, []);

  const handleScanComplete = (scanId: string) => {
    setSelectedScanId(scanId);
    setView('report');
  };

  const handleSelectDashboardScan = (scanId: string) => {
    setSelectedScanId(scanId);
    setView('report');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Ambient background glows for realistic glassmorphism refraction */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setView('scan')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-100">
                  Compliance Scanner
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-semibold">
                  SIH26034 MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Legal Metrology Rule 6 Decision-Support System
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-inner">
            <button
              id="nav-tab-scan"
              type="button"
              onClick={() => setView('scan')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === 'scan'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scanner</span>
            </button>

            {selectedScanId && (
              <button
                id="nav-tab-report"
                type="button"
                onClick={() => setView('report')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  view === 'report'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Audit Report</span>
              </button>
            )}

            <button
              id="nav-tab-dashboard"
              type="button"
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Officer Log</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {view === 'scan' && (
          <ScanPage
            onScanComplete={handleScanComplete}
            onNavigateDashboard={() => setView('dashboard')}
          />
        )}

        {view === 'report' && selectedScanId && (
          <ReportPage
            scanId={selectedScanId}
            onBackToScan={() => setView('scan')}
            onNavigateDashboard={() => setView('dashboard')}
          />
        )}

        {view === 'dashboard' && (
          <DashboardPage
            onSelectScan={handleSelectDashboardScan}
            onNavigateScan={() => setView('scan')}
          />
        )}
      </main>

      {/* Footer & Disclaimer */}
      <footer className="border-t border-white/10 bg-slate-950/70 backdrop-blur-md px-4 sm:px-6 py-4 text-xs text-slate-500 relative z-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Decision-Support Tool: Rule 6 of the Legal Metrology (Packaged Commodities) Rules, 2011.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            {health && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Database: {health.database}
              </span>
            )}
            <span>Demo Mode Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
