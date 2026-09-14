import React from 'react';
import { Bot, CheckCircle2, Search, ShoppingBag, ShieldCheck, Cpu } from 'lucide-react';
import { AgentEvent } from '../types';

interface AgentStatusPanelProps {
  agentEvents?: AgentEvent[];
  lowConfidenceFields?: string[];
}

export const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({
  agentEvents = [],
  lowConfidenceFields = [],
}) => {
  if (agentEvents.length === 0 && lowConfidenceFields.length === 0) {
    return null;
  }

  return (
    <div id="agent-status-panel" className="w-full bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 backdrop-blur-md border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Autonomous Verification Agents
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-950/80 backdrop-blur-md text-teal-300 border border-teal-500/30">
                Non-Blocking
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Cross-referencing government gazette registries, FSSAI licenses, and retail pricing
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          {agentEvents.length} agent event{agentEvents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {agentEvents.map((evt, idx) => {
          const isResult = evt.stage === 'agent:tool_result';
          const isCall = evt.stage === 'agent:tool_call';

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border backdrop-blur-md transition-all text-xs ${
                isResult
                  ? 'bg-slate-950/60 border-white/10 text-slate-200 shadow-sm'
                  : 'bg-slate-950/40 border-white/5 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {evt.agent?.includes('License') ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : evt.agent?.includes('Price') ? (
                    <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
                  ) : (
                    <Search className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span className="font-semibold text-slate-300 font-mono">
                    {evt.agent || evt.tool || 'Autonomous Agent'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : ''}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-normal">
                {evt.message || (isCall ? `Invoking tool: ${evt.tool}` : 'Verification step completed')}
              </p>

              {/* Special rendering for pricing or license results */}
              {evt.result && evt.result.marketPrices && (
                <div className="mt-2.5 pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {evt.result.marketPrices.map((mp: any, i: number) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-900/70 backdrop-blur-md border border-white/10 shadow-sm">
                      <span className="text-[10px] text-slate-400 block truncate">{mp.platform}</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono">₹{mp.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {evt.result && evt.result.licenseNumber && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">License: <code className="text-slate-200 font-mono bg-slate-900/80 px-1.5 py-0.5 rounded border border-white/10">{evt.result.licenseNumber}</code></span>
                  <span className="text-emerald-400 font-semibold uppercase">{evt.result.verificationStatus || 'Valid'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
