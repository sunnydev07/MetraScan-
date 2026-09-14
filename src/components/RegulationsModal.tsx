import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, BookOpen, ExternalLink, Filter, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_METROLOGY_DOCUMENTS, MetrologyDocument } from '../data/metrologyRulesDataset';

interface RegulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  initialQuery?: string;
}

export const RegulationsModal: React.FC<RegulationsModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'ALL',
  initialQuery = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [pcrOnly, setPcrOnly] = useState<boolean>(false);

  const categories = [
    { id: 'ALL', label: 'All Documents' },
    { id: 'CORE_PCR', label: 'PCR Rules (2011)' },
    { id: 'AMENDMENT', label: 'Gazette Amendments' },
    { id: 'NOTIFICATION', label: 'Notifications' },
    { id: 'SOP', label: 'Standard Operating Procedures' },
    { id: 'CIRCULAR', label: 'Advisories & Circulars' },
    { id: 'ACT', label: 'Parent Act (2009)' },
    { id: 'GENERAL_RULES', label: 'General Rules' },
  ];

  const filteredDocs = useMemo(() => {
    return OFFICIAL_METROLOGY_DOCUMENTS.filter((doc) => {
      if (pcrOnly && !doc.isCorePCR) return false;
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesDesc = doc.description.toLowerCase().includes(q);
        const matchesTags = doc.tags.some((t) => t.toLowerCase().includes(q));
        const matchesYear = doc.year?.includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesYear) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, pcrOnly]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                  Official Legal Metrology Department Statutory Repository
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30 font-mono">
                    {OFFICIAL_METROLOGY_DOCUMENTS.length} Official Acts & Rules
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Direct Gazette notifications & SoPs from the Ministry of Consumer Affairs, Government of India
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 sm:px-6 bg-slate-950/40 border-b border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rules, amendments, SoPs, topics (e.g., 'font', 'MRP', 'edible oil', 'Jan Vishwas')..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setPcrOnly(!pcrOnly)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  pcrOnly
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950/60 text-slate-400 border-white/10 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Core PCR (Rule 6) Only</span>
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium">No regulations match your search criteria</p>
                <p className="text-xs text-slate-500 mt-1">Try broadening your search term or select "All Documents"</p>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-white/10 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30">
                        {doc.category}
                      </span>
                      {doc.year && (
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {doc.year}
                        </span>
                      )}
                      {doc.dateOfIssue && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Issued: {doc.dateOfIssue}
                        </span>
                      )}
                      {doc.isCorePCR && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          PCR Mandatory
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                      {doc.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {doc.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-950/70 text-blue-300 hover:bg-blue-900/80 border border-blue-500/40 text-xs font-semibold transition-all hover:scale-[1.02]"
                    >
                      <span>Official PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filteredDocs.length} of {OFFICIAL_METROLOGY_DOCUMENTS.length} official documents</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
