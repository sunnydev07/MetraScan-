import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScannerHUD } from '../components/ScannerHUD';
import { ScanProgress } from '../components/ScanProgress';
import { RuleMatrix } from '../components/RuleMatrix';
import { uploadScan, triggerDemoScan } from '../api/scans';
import { getSocket, joinScanRoom } from '../socket/socketClient';
import { Shield, Sparkles, AlertCircle, ArrowUpRight, Scale } from 'lucide-react';

interface ScanPageProps {
  onScanComplete: (scanId: string) => void;
  onNavigateDashboard: () => void;
}

export const ScanPage: React.FC<ScanPageProps> = ({
  onScanComplete,
  onNavigateDashboard,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [stage, setStage] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentScanId) return;

    const socket = getSocket();
    joinScanRoom(currentScanId);

    const handleProgress = (payload: any) => {
      if (payload.scanId !== currentScanId) return;
      if (payload.stage) setStage(payload.stage);
      if (typeof payload.progress === 'number') setProgress(payload.progress);
      if (payload.message) setStatusMessage(payload.message);

      if (payload.stage === 'completed' || payload.progress === 100) {
        setIsProcessing(false);
        setTimeout(() => {
          onScanComplete(currentScanId);
        }, 500);
      } else if (payload.stage === 'failed') {
        setIsProcessing(false);
        setError(payload.message || 'Scan evaluation failed');
      }
    };

    socket.on('scan:progress', handleProgress);
    socket.on('scan:completed', handleProgress);
    socket.on('scan:error', handleProgress);

    return () => {
      socket.off('scan:progress', handleProgress);
      socket.off('scan:completed', handleProgress);
      socket.off('scan:error', handleProgress);
    };
  }, [currentScanId, onScanComplete]);

  const handleImageSelected = async (file: File | Blob, filename: string, barcode?: string) => {
    setIsProcessing(true);
    setError(null);
    setProgress(5);
    setStage('queued');
    setStatusMessage('Compressing and transmitting packaging imagery...');

    try {
      const res = await uploadScan(file, filename, barcode);
      setCurrentScanId(res.scanId);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message || 'Failed to submit packaging image');
    }
  };

  const handleDemoSelected = async (demoType: 'compliant' | 'missing-mrp' | 'missing-net-quantity' | 'missing-consumer-care') => {
    setIsProcessing(true);
    setError(null);
    setProgress(10);
    setStage('queued');
    setStatusMessage(`Mounting commodity test specimen: ${demoType}...`);

    try {
      const res = await triggerDemoScan(demoType);
      setCurrentScanId(res.scanId);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message || 'Failed to load test specimen');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-7 relative">
      {/* Subtle Scanning Line Animation Overlay (Triggers during processing state) */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            id="scan-processing-line-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-3xl"
          >
            {/* Ambient subtle green scanner tint */}
            <div className="absolute inset-0 bg-emerald-950/10 backdrop-blur-[0.5px]" />

            {/* Animated scanning line with green semi-transparent gradient */}
            <motion.div
              className="absolute left-0 right-0 w-full flex flex-col items-center pointer-events-none"
              initial={{ top: '-10%' }}
              animate={{ top: ['-10%', '110%'] }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
                ease: 'linear',
              }}
            >
              {/* Trailing green semi-transparent gradient wash */}
              <div className="w-full h-32 bg-gradient-to-t from-emerald-500/20 via-emerald-500/5 to-transparent" />

              {/* Central scanning laser beam */}
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.8),0_0_30px_rgba(16,185,129,0.35)]" />

              {/* Leading edge subtle green gradient glow */}
              <div className="w-full h-10 bg-gradient-to-b from-emerald-500/10 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Officer Command Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              Surveillance Station // Packaged Commodity Enforcement
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Legal Metrology Rule 6 Optical Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Automated compliance verification of mandatory pre-packaged commodity label declarations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="officer-log-shortcut-btn"
            type="button"
            onClick={onNavigateDashboard}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 border border-white/10 text-xs font-semibold transition-all shadow-md active:scale-95"
          >
            <span>Surveillance Log</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Live Processing Pipeline Overlay */}
      {isProcessing && (
        <ScanProgress
          stage={stage}
          progress={progress}
          message={statusMessage}
          error={error || undefined}
        />
      )}

      {/* Error Banner */}
      {error && !isProcessing && (
        <div className="p-4 rounded-xl bg-rose-950/40 backdrop-blur-md border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Optical Scanner HUD with Viewfinder & Specimen Library */}
      <ScannerHUD
        onImageSelected={handleImageSelected}
        onDemoSelected={handleDemoSelected}
        isProcessing={isProcessing}
        stage={stage}
        progress={progress}
      />

      {/* Statutory Rule Matrix */}
      <RuleMatrix />
    </div>
  );
};
