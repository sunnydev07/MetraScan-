import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Send,
  Globe,
  Terminal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
  Clock,
  ArrowRight,
  Search,
  Building2,
  BookOpen,
  FileCheck
} from 'lucide-react';
import { ChatMessage, ChatToolCall, ScanRecord } from '../types';
import { sendChatMessage } from '../api/chat';

interface ProductAiAgentChatProps {
  scan: ScanRecord;
  embedded?: boolean;
}

export const ProductAiAgentChat: React.FC<ProductAiAgentChatProps> = ({ scan, embedded = true }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [expandedToolIndex, setExpandedToolIndex] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<{ [msgId: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const productName = scan.fields?.productName?.value || 'Packaged Commodity';
  const mrp = scan.fields?.mrp?.value || 'N/A';
  const manufacturer = scan.fields?.manufacturerName?.value || 'Registered Entity';
  const complianceScore = scan.complianceScore || 0;

  // Initialize contextual multi-turn conversation on mount or scan change
  useEffect(() => {
    const initialGreeting: ChatMessage = {
      id: `msg_init_${Date.now()}`,
      role: 'assistant',
      content: `Hello Inspector. I am your **Product Intelligence & Legal Metrology AI Agent** powered by Gemini with Google Search Grounding.

I have loaded the optical scan context for **${productName}** (Compliance Score: **${complianceScore}%** | Declared MRP: **${mrp}**).

I am equipped with live tools:
- 🔍 **Google Search Grounding**: Cross-references specific Legal Metrology (Packaged Commodities) circulars, Rule 6 & 7 font size standards, FSSAI gazette mandates, and verified MCA21 / GSTIN corporate master records.
- 🛠️ **Chrome DevTools Inspector**: Headless DOM element auditing, HTTP/2 network latency, and schema.org Product markup verification.
- 🌐 **Market Intelligence Surveillance**: Quick-commerce price benchmarking and consumer grievance checks.

How can I assist your investigation?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
    };

    setMessages([initialGreeting]);
  }, [scan.scanId]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputPrompt('');
    setLoading(true);

    try {
      // Build conversation history for the API
      const conversationHistory = nextMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const productContext = {
        productName,
        brand: scan.fields?.productName?.value || '',
        mrp,
        netQuantity: scan.fields?.netQuantityValue?.value
          ? `${scan.fields.netQuantityValue.value} ${scan.fields?.netQuantityUnit?.value || ''}`
          : '',
        manufacturer,
        countryOfOrigin: scan.fields?.countryOfOrigin?.value || 'India',
        monthYear: scan.fields?.monthYear?.value || '',
        consumerCare: scan.fields?.consumerCarePhone?.value || scan.fields?.consumerCareEmail?.value || '',
        complianceScore,
        complianceStatus: scan.complianceStatus || 'PARTIAL',
        missingFields: scan.fieldChecks?.filter((f) => f.status === 'fail').map((f) => f.label) || [],
      };

      const res = await sendChatMessage({
        messages: conversationHistory,
        scanId: scan.scanId,
        productContext,
        model: selectedModel,
      });

      const assistantMessage: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls: res.toolCalls,
        groundingMetadata: res.groundingMetadata,
        model: res.model,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Agent Error**: ${err.message || 'Failed to complete query with Gemini agent.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    const resetGreeting: ChatMessage = {
      id: `msg_reset_${Date.now()}`,
      role: 'assistant',
      content: `Conversation thread reset. Ready to inspect **${productName}** with Google Search Grounding or Chrome DevTools.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
    };
    setMessages([resetGreeting]);
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const quickPrompts = [
    {
      label: 'Google Search Regulations',
      query: `Search Google for specific Legal Metrology Rule 6 mandatory declarations and Rule 7 font size requirements applicable to ${productName}.`,
      icon: Search,
    },
    {
      label: 'Google Search Company Info',
      query: `Search Google for official corporate details of manufacturer "${manufacturer}" including MCA21 registration status, CIN, and registered office.`,
      icon: Building2,
    },
    {
      label: 'Chrome DevTools Web Audit',
      query: `Run a Chrome DevTools audit on the manufacturer portal of ${productName} to inspect DOM elements, SSL validity, and schema.org product metadata.`,
      icon: Terminal,
    },
    {
      label: 'Market Price & MRP Inflation',
      query: `Search the web for current retail marketplace prices of ${productName} and verify whether the declared MRP of ${mrp} is inflated.`,
      icon: Globe,
    },
    {
      label: 'Rule 6 Compliance Review',
      query: `Analyze why ${productName} received a compliance score of ${complianceScore}%. What statutory declaration requirements under Rule 6 need correction?`,
      icon: Shield,
    },
  ];

  return (
    <div
      id="product-ai-agent-console"
      className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[640px] max-h-[85vh] transition-all"
    >
      {/* Header Bar */}
      <div className="p-4 border-b border-white/10 bg-slate-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 flex items-center justify-center shadow-md shadow-emerald-950/40">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span>Product Intelligence Officer Agent</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-mono font-medium">
                  Active
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-turn conversational investigator with Chrome DevTools & Web Search
            </p>
          </div>
        </div>

        {/* Model Selector & Reset Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
            <Cpu className="w-3 h-3 text-emerald-400 ml-1.5" />
            <select
              id="gemini-model-selector"
              aria-label="Select Gemini Model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-transparent text-slate-300 text-[11px] font-mono px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="gemini-3.5-flash" className="bg-slate-900 text-slate-200">
                gemini-3.5-flash (General)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-slate-900 text-slate-200">
                gemini-3.1-flash-lite (Fast)
              </option>
              <option value="gemini-3.1-pro-preview" className="bg-slate-900 text-slate-200">
                gemini-3.1-pro-preview (Complex)
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            title="Reset conversation thread"
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Specimen Context Strip */}
      <div className="px-4 py-2 bg-slate-950/40 border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-300 truncate max-w-[200px]">
            Target: {productName}
          </span>
          <span className="text-slate-600">|</span>
          <span>MRP: <strong className="text-slate-200">{mrp}</strong></span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">Score: <strong className={complianceScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}>{complianceScore}%</strong></span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-mono">
            <Search className="w-3 h-3 text-blue-400" /> Google Search Ready
          </span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/90 font-mono">
            <Terminal className="w-3 h-3 text-emerald-400" /> DevTools Ready
          </span>
        </div>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || index}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
            >
              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 max-w-[85%] sm:max-w-[78%] leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/30 rounded-tr-sm'
                    : 'bg-slate-800/80 backdrop-blur-md border border-white/10 text-slate-200 shadow-xl rounded-tl-sm'
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-2 font-mono">
                  <span className="flex items-center gap-1 font-semibold">
                    {isUser ? 'You (Inspector)' : 'AI Intelligence Officer'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Markdown Content */}
                <div className="prose prose-invert prose-xs max-w-none space-y-2 leading-relaxed">
                  <Markdown>{msg.content}</Markdown>
                </div>

                {/* Google Search Grounding & Verified Statutory Sources */}
                {msg.groundingMetadata && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 font-semibold text-blue-400 uppercase">
                        <Search className="w-3 h-3 text-blue-400" />
                        Google Search Grounding
                      </span>
                      {msg.groundingMetadata.sources && msg.groundingMetadata.sources.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleSources(msg.id)}
                          className="hover:text-blue-300 transition-colors flex items-center gap-1"
                        >
                          <span>{msg.groundingMetadata.sources.length} Verified Sources</span>
                          {expandedSources[msg.id] ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Grounding Search Queries */}
                    {msg.groundingMetadata.webSearchQueries && msg.groundingMetadata.webSearchQueries.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {msg.groundingMetadata.webSearchQueries.map((query, qIdx) => (
                          <span
                            key={qIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono text-[10px]"
                          >
                            <Search className="w-2.5 h-2.5 text-blue-400" />
                            <span className="truncate max-w-[240px]">{query}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Verified Grounding Sources Cards */}
                    {expandedSources[msg.id] && msg.groundingMetadata.sources && (
                      <div className="space-y-1.5 pt-1">
                        {msg.groundingMetadata.sources.map((src, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2.5 rounded-xl border border-blue-500/20 bg-slate-950/70 hover:bg-slate-950 text-[11px] space-y-1 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                {src.category === 'company' ? (
                                  <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                ) : (
                                  <FileCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                )}
                                <span className="font-semibold text-slate-200 line-clamp-1">
                                  {src.title}
                                </span>
                              </div>
                              {src.url && (
                                <a
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 transition-colors p-0.5 shrink-0"
                                  title="View official statutory source"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            {src.snippet && (
                              <p className="text-[10px] text-slate-400 leading-snug">
                                {src.snippet}
                              </p>
                            )}
                            <div className="flex items-center gap-2 pt-0.5 text-[9px] font-mono text-slate-500">
                              {src.authority && (
                                <span className="text-slate-400 font-medium">
                                  {src.authority}
                                </span>
                              )}
                              {src.referenceNumber && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400/90">{src.referenceNumber}</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tool Invocations Badge / Drawer */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 uppercase font-semibold">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Executed Live Agent Tools ({msg.toolCalls.length})</span>
                    </div>

                    {msg.toolCalls.map((tc, tIdx) => {
                      const toolKey = `${msg.id}_tool_${tIdx}`;
                      const isExpanded = expandedToolIndex === toolKey;
                      const isGoogleSearch = tc.tool === 'googleSearch';
                      const isDevTools = tc.tool === 'chromeDevToolsInspect' || tc.tool === 'browser';

                      return (
                        <div
                          key={tIdx}
                          className="rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden text-[11px]"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedToolIndex(isExpanded ? null : toolKey)}
                            className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {isGoogleSearch ? (
                                <Search className="w-3.5 h-3.5 text-blue-400" />
                              ) : isDevTools ? (
                                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Globe className="w-3.5 h-3.5 text-teal-400" />
                              )}
                              <span className="font-mono font-semibold text-slate-200">
                                {isGoogleSearch
                                  ? 'Google Search Grounding'
                                  : isDevTools
                                  ? 'Chrome DevTools Headless Audit'
                                  : 'Live Web Search Grounding'}
                              </span>
                              {tc.executionTimeMs && (
                                <span className="text-[10px] font-mono text-slate-400">
                                  ({tc.executionTimeMs}ms)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-slate-400">
                              <span className="text-[10px] font-mono">Inspect</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-3 border-t border-white/10 bg-slate-950/90 text-slate-300 font-mono text-[11px] space-y-2 overflow-x-auto">
                              <div>
                                <span className="text-slate-500 font-bold block mb-0.5">Parameters:</span>
                                <pre className="p-2 rounded-lg bg-slate-900 border border-white/5 whitespace-pre-wrap text-[10px] text-emerald-300">
                                  {JSON.stringify(tc.input, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <span className="text-slate-500 font-bold block mb-0.5">Telemetry & Output:</span>
                                <pre className="p-2 rounded-lg bg-slate-900 border border-white/5 whitespace-pre-wrap text-[10px] text-slate-300 max-h-48 overflow-y-auto">
                                  {JSON.stringify(tc.result, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex flex-col items-start max-w-full">
            <div className="rounded-2xl p-4 bg-slate-800/80 backdrop-blur-md border border-white/10 text-slate-300 rounded-tl-sm shadow-xl flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-slate-200 block">
                  Agent Investigating...
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Evaluating Rule 6 statutes, Chrome DevTools audit & web search records
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-2.5 px-4 bg-slate-950/40 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold shrink-0 mr-1">
            Quick Inquiries:
          </span>
          {quickPrompts.map((qp, i) => {
            const Icon = qp.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(qp.query)}
                disabled={loading}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 text-slate-300 hover:text-white border border-white/10 transition-all font-medium disabled:opacity-50"
              >
                <Icon className="w-3 h-3 text-emerald-400" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-950/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ai-agent-chat-input"
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={loading}
            placeholder={`Ask AI Agent about ${productName} (e.g. "Run DevTools inspection" or "Search web for price")...`}
            className="flex-1 bg-slate-900/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500/50 transition-all"
          />

          <button
            id="ai-agent-send-btn"
            type="submit"
            disabled={!inputPrompt.trim() || loading}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white disabled:text-slate-600 transition-all shadow-md shadow-emerald-950/40 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
