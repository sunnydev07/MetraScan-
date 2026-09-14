import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getScan } from '../api/scans';
import { ScanRecord } from '../types';
import { ComplianceSummary } from '../components/ComplianceSummary';
import { FieldResultCard } from '../components/FieldResultCard';
import { AgentStatusPanel } from '../components/AgentStatusPanel';
import { ProductAiAgentChat } from '../components/ProductAiAgentChat';
import { RegulationsModal } from '../components/RegulationsModal';
import { ArrowLeft, RefreshCw, FileText, ChevronDown, ChevronUp, Printer, LayoutDashboard, Bot, Sparkles, MessageSquare, BookOpen } from 'lucide-react';
import { getSocket, joinScanRoom } from '../socket/socketClient';

interface ReportPageProps {
  scanId: string;
  onBackToScan: () => void;
  onNavigateDashboard: () => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  scanId,
  onBackToScan,
  onNavigateDashboard,
}) => {
  const [scan, setScan] = useState<ScanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawOcr, setShowRawOcr] = useState(false);
  const [showRegulationsModal, setShowRegulationsModal] = useState(false);

  const fetchScanData = async () => {
    try {
      const data = await getScan(scanId);
      setScan(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load scan report');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScanData();

    // Subscribe to live agent updates or late events via socket
    const socket = getSocket();
    joinScanRoom(scanId);

    const handleProgress = (payload: any) => {
      if (payload.scanId === scanId) {
        setScan((prev) => (prev ? { ...prev, ...payload } : payload));
      }
    };

    const handleAgentUpdate = (agentEvt: any) => {
      setScan((prev) => {
        if (!prev) return prev;
        const currentEvents = prev.ai?.agentEvents || [];
        return {
          ...prev,
          ai: {
            needed: true,
            lowConfidenceFields: prev.ai?.lowConfidenceFields || [],
            agentEvents: [...currentEvents, agentEvt],
          },
        };
      });
    };

    socket.on('scan:progress', handleProgress);
    socket.on('scan:completed', handleProgress);
    socket.on('agent:started', handleAgentUpdate);
    socket.on('agent:tool_call', handleAgentUpdate);
    socket.on('agent:tool_result', handleAgentUpdate);

    return () => {
      socket.off('scan:progress', handleProgress);
      socket.off('scan:completed', handleProgress);
      socket.off('agent:started', handleAgentUpdate);
      socket.off('agent:tool_call', handleAgentUpdate);
      socket.off('agent:tool_result', handleAgentUpdate);
    };
  }, [scanId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
        <p className="text-slate-300 font-medium">Retrieving Compliance Audit Report...</p>
        <p className="text-xs text-slate-400 mt-1 font-mono">{scanId}</p>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
        <p className="text-rose-400 font-medium">{error || 'Report not found'}</p>
        <button
          onClick={onBackToScan}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/10 text-slate-200 text-xs font-semibold hover:bg-slate-700/80 transition-all"
        >
          Return to Scanner
        </button>
      </div>
    );
  }

  const checks = scan.fieldChecks || [];
  const fields = scan.fields || {};

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.12,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Navigation and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
        <button
          id="back-to-scan-btn"
          type="button"
          onClick={onBackToScan}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Label Scan</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="print-report-btn"
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 border border-white/10 text-xs font-semibold transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            id="officer-dashboard-nav-btn"
            type="button"
            onClick={onNavigateDashboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-emerald-950/30"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Officer Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Compliance Summary Header Card */}
      <ComplianceSummary
        complianceStatus={scan.complianceStatus || 'FAIL'}
        complianceScore={scan.complianceScore || 0}
        summary={scan.summary || 'Compliance evaluation completed.'}
        fieldChecks={checks}
        cacheHit={scan.cacheHit}
      />

      {/* Interactive Gemini AI Product Intelligence Agent */}
      <motion.div
        id="product-ai-agent-section"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span>Interactive Product AI Agent</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono font-normal">
                Gemini Multi-Turn
              </span>
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Equipped with Chrome DevTools web audits & live regulatory search
          </span>
        </div>

        <ProductAiAgentChat scan={scan} />
      </motion.div>

      {/* 7 Rule 6 Declaration Verification Cards with Subtle Fading-In Transition */}
      <motion.div
        id="scan-results-list"
        initial="hidden"
        animate="visible"
        variants={listContainerVariants}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Rule 6 Mandatory Declarations Breakdown ({checks.length} Items)
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Legal Metrology (Packaged Commodities) Rules, 2011
            </span>
            <button
              type="button"
              onClick={() => setShowRegulationsModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-[11px] font-semibold text-blue-300 transition-colors"
            >
              <BookOpen className="w-3 h-3 text-blue-400" />
              <span>Browse All 82 Regulations</span>
            </button>
          </div>
        </div>

        <motion.div
          id="scan-results-grid"
          variants={listContainerVariants}
          className="grid grid-cols-1 gap-3.5"
        >
          {checks.map((check, idx) => {
            // Find corresponding extracted field
            const fieldKeyMap: Record<string, string> = {
              manufacturer_name_address: 'manufacturerName',
              country_of_origin: 'countryOfOrigin',
              product_name: 'productName',
              net_quantity: 'netQuantityValue',
              month_year: 'monthYear',
              mrp: 'mrp',
              consumer_care: 'consumerCarePhone',
            };
            const fieldKey = fieldKeyMap[check.id] || check.id;
            const fieldData = fields[fieldKey];

            return (
              <motion.div
                key={check.id}
                variants={listItemVariants}
              >
                <FieldResultCard
                  check={check}
                  fieldData={fieldData}
                  index={idx}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Autonomous AI Agent Verification Panel */}
      {scan.ai && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <AgentStatusPanel
            agentEvents={scan.ai.agentEvents}
            lowConfidenceFields={scan.ai.lowConfidenceFields}
          />
        </motion.div>
      )}

      {/* Raw Extracted OCR Text Expander */}
      {scan.ocr?.rawText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg"
        >
          <button
            type="button"
            onClick={() => setShowRawOcr(!showRawOcr)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">
                Raw Packaging OCR Transcription ({scan.ocr.provider.toUpperCase()})
              </span>
            </div>
            {showRawOcr ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showRawOcr && (
            <div className="p-4 pt-0 border-t border-white/10 bg-slate-950/40">
              <pre className="text-xs font-mono text-slate-300 p-3 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/10 overflow-x-auto whitespace-pre-wrap shadow-inner">
                {scan.ocr.rawText}
              </pre>
              <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                <span>OCR Confidence: {Math.round(scan.ocr.confidence * 100)}%</span>
                <span>Scan ID: {scan.scanId}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Floating Ask AI Agent Shortcut */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-ask-ai-agent-btn"
          type="button"
          onClick={() => {
            const el = document.getElementById('product-ai-agent-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              const input = document.getElementById('ai-agent-chat-input');
              if (input) input.focus();
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-2xl shadow-emerald-950/80 border border-emerald-400/30 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
        >
          <Bot className="w-4 h-4 text-emerald-200" />
          <span>Ask AI Agent</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
        </button>
      </div>

      {/* Official Legal Metrology Regulations Modal */}
      <RegulationsModal
        isOpen={showRegulationsModal}
        onClose={() => setShowRegulationsModal(false)}
      />
    </motion.div>
  );
};
