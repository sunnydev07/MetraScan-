import React, { useState, useEffect } from 'react';
import { listScans } from '../api/scans';
import { DashboardScanItem } from '../types';
import { ScanTable } from '../components/ScanTable';
import { getSocket, joinDashboardRoom, leaveDashboardRoom } from '../socket/socketClient';
import { Shield, Camera, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Activity } from 'lucide-react';

interface DashboardPageProps {
  onSelectScan: (scanId: string) => void;
  onNavigateScan: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onSelectScan,
  onNavigateScan,
}) => {
  const [scans, setScans] = useState<DashboardScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PASS' | 'PARTIAL' | 'FAIL'>('ALL');
  const [liveSocketActive, setLiveSocketActive] = useState(false);

  const fetchScans = async () => {
    try {
      const data = await listScans(30);
      setScans(data.scans || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard scans:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();

    const socket = getSocket();
    joinDashboardRoom();

    if (socket.connected) {
      setLiveSocketActive(true);
    }

    const onConnect = () => setLiveSocketActive(true);
    const onDisconnect = () => setLiveSocketActive(false);

    const handleNewScan = (newScan: any) => {
      setScans((prev) => {
        // Prevent duplicates
        const exists = prev.some((s) => s.scanId === newScan.scanId);
        if (exists) {
          return prev.map((s) => (s.scanId === newScan.scanId ? { ...s, ...newScan } : s));
        }
        return [newScan, ...prev];
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('dashboard:new_scan', handleNewScan);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('dashboard:new_scan', handleNewScan);
      leaveDashboardRoom();
    };
  }, []);

  const totalScans = scans.length;
  const passCount = scans.filter((s) => s.complianceStatus === 'PASS').length;
  const failCount = scans.filter((s) => s.complianceStatus === 'FAIL').length;
  const partialCount = scans.filter((s) => s.complianceStatus === 'PARTIAL').length;
  const passRate = totalScans > 0 ? Math.round((passCount / totalScans) * 100) : 0;

  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.missing && s.missing.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesStatus = filterStatus === 'ALL' || s.complianceStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-slate-100">
                Enforcement Officer Inspection Dashboard
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Socket Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Legal Metrology (Packaged Commodities) Rule 6 audit log & surveillance records
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchScans}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-300 border border-white/10 transition-all shadow-sm"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="new-scan-cta-btn"
            type="button"
            onClick={onNavigateScan}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-emerald-950/40 shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Scan New Label</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Inspected</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
            {totalScans}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Packaged commodity labels</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Compliant (Pass)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {passCount}
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-1 font-medium">{passRate}% Pass Rate</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Partially Compliant</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
            {partialCount}
          </div>
          <p className="text-[11px] text-amber-400/90 mt-1">Minor / warning declarations</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Non-Compliant (Fail)</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400">
            {failCount}
          </div>
          <p className="text-[11px] text-rose-400/90 mt-1 font-medium">Critical declarations missing</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by product name, scan ID, or missing declaration..."
          className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 flex-1 shadow-inner"
        />

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['ALL', 'PASS', 'PARTIAL', 'FAIL'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap backdrop-blur-md transition-all ${
                filterStatus === status
                  ? 'bg-emerald-600 text-white shadow-sm border border-emerald-400/30'
                  : 'bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              {status === 'ALL' ? 'All Records' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Scans Table */}
      {loading ? (
        <div className="p-12 text-center bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-300 text-xs font-medium">Loading surveillance audit log...</p>
        </div>
      ) : (
        <ScanTable scans={filteredScans} onSelectScan={onSelectScan} />
      )}
    </div>
  );
};
