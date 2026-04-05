'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Send, User, Trash2, Download,
  ChevronDown, ChevronUp, Zap, Sparkles,
  Search, ShieldCheck, AlertTriangle,
  CloudLightning, Route, Lightbulb, CheckCircle2, HelpCircle,
  Cpu, FlaskConical, Activity, Clock, Database, Plus, Paperclip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

// ─── Friendly response card (Minimalist ChatGPT Style) ────────────────────────
function FriendlyResponseCard({ friendly, impact, recommendations, bestRoute, alternatives }) {
  if (!friendly) return null;

  return (
    <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-foreground">
      {/* Main Situation */}
      <div className="font-medium">
        {friendly.situation}
      </div>

      {/* Impact & Analysis Grid */}
      {(friendly.impact || friendly.recommendation || friendly.bestOption) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {friendly.impact && (
            <div className="flex flex-col gap-1.5 group">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-accent opacity-70 group-hover:opacity-100 transition-opacity">
                <AlertTriangle size={12} /> Operational Impact
              </div>
              <div className="text-sm font-medium opacity-90">{friendly.impact}</div>
            </div>
          )}
          {friendly.recommendation && (
            <div className="flex flex-col gap-1.5 group">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary opacity-70 group-hover:opacity-100 transition-opacity">
                <CheckCircle2 size={12} /> Strategic Directive
              </div>
              <div className="text-sm font-medium opacity-90">{friendly.recommendation}</div>
            </div>
          )}
          {friendly.bestOption && (
            <div className="flex flex-col gap-1.5 group">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                <Route size={12} /> Optimal Path
              </div>
              <div className="text-sm font-medium opacity-90">{friendly.bestOption}</div>
            </div>
          )}
        </div>
      )}

      {/* Checklist */}
      {recommendations?.length > 0 && (
        <div className="mt-4 pt-6 border-t border-border/10">
          <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] mb-4">Tactical Response Protocol</div>
          <div className="flex flex-col gap-4">
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="flex gap-4 items-start group/rec">
                <div className="mt-1 flex items-center justify-center w-5 h-5 rounded-lg bg-surface-high border border-border/20 text-[10px] font-bold text-text-muted transition-colors group-hover/rec:text-primary group-hover/rec:border-primary/30">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">{rec.action}</div>
                  {rec.timeframe && <div className="text-[11px] text-text-muted font-medium italic opacity-60">{rec.timeframe}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Greeting / centered empty state ──────────────────────────────────────────
function EmptyState({ onSelectSuggestion }) {
  const suggestions = [
    { title: "Network Status Check", desc: "Scan global ports & routes for anomalies", icon: <Activity size={18} /> },
    { title: "Storm Route Impact", desc: "Analyze how current weather hits active shipments", icon: <CloudLightning size={18} /> },
    { title: "Optimize Cost Vectors", desc: "Find low-risk paths for freight rate reduction", icon: <Zap size={18} /> },
    { title: "High-Risk Shipment Audit", desc: "Identify cargo facing tier-1 disruption threats", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-8 pb-4">
      <div className="w-12 h-12 rounded-2xl bg-surface-high border border-primary/20 flex items-center justify-center mb-4 shadow-xl animate-in">
        <Cpu size={24} className="text-primary" />
      </div>
      <h2 className="text-3xl font-black tracking-tighter text-foreground mb-10 text-center animate-in">How can I help you, Administrator?</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl animate-in" style={{ animationDelay: '0.1s' }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectSuggestion(s.title)}
            className="flex flex-col gap-3 p-5 bg-surface-high/50 border border-border/10 rounded-2xl hover:border-primary/40 hover:bg-surface-high transition-all text-left group min-h-[140px] shadow-sm"
          >
            <div className="text-primary p-2 w-fit rounded-lg bg-primary/5 group-hover:scale-110 transition-transform">{s.icon}</div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{s.title}</div>
              <div className="text-[10px] font-medium text-text-muted mt-2 leading-relaxed opacity-60 line-clamp-2 leading-snug">{s.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Pipeline steps (Subtle inline version) ──────────────────────────────────
function PipelineSteps({ pipeline }) {
  if (!pipeline?.length) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-border/5 opacity-50 hover:opacity-80 transition-opacity">
      {pipeline.map((step, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1 bg-surface-high border border-border/10 rounded-full text-[8px] font-black text-text-muted uppercase tracking-widest">
          <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'complete' ? 'bg-primary' : 'bg-border'}`} />
          {step.agent}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdvisorPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      friendly: {
        situation: "Awaiting your directive. I am Navi AI, your conversational interface for the Terminal logistics network.",
        impact: null,
        recommendation: "You can query me for real-time status updates, cost optimization strategies, or hypothetical re-routing scenarios.",
        bestOption: null,
        why: null,
        isGreeting: true
      },
      showPipeline: false
    }
  ]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const chatEndRef                 = useRef(null);

  const chips = [
    "System Status Check",
    "Storm impact on routes?",
    "High-risk shipments",
    "Cost reduction vector",
  ];

  const handleSend = async (e, textOverride = '') => {
    if (e) e.preventDefault();
    const queryText = textOverride || input;
    if (!queryText.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let response;
      if (queryText.includes("Storm")) {
        response = await api.loadNaviDemo();
      } else {
        response = await api.queryNavi(queryText);
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        friendly: response.friendlyResponse || null,
        impact:          response.impact,
        recommendations: response.recommendations,
        bestRoute:       response.bestRoute,
        alternatives:    response.alternatives,
        pipeline:        response.pipeline,
        reasoning:       response.reasoning,
        usedLLM:         response.usedLLM,
        confidence:      response.confidence,
        rawContent: response.conversationalReply || response.situationSummary || 'Telemetry synchronization complete.',
        showPipeline: false
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        isError: true,
        rawContent: `Neural link instability detected: ${err.message}. Re-establishing connection…`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const togglePipeline = (id) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, showPipeline: !msg.showPipeline } : msg
    ));
  };

  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setShowScrollBtn(scrollHeight - scrollTop > clientHeight + 100);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] max-w-4xl mx-auto animate-in overflow-hidden relative">

      {/* Subtle Header */}
      <div className="py-4 border-b border-border/5 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-surface-high border border-primary/20 flex items-center justify-center shadow-sm">
              <Cpu size={18} className="text-primary" />
           </div>
           <div>
             <h1 className="text-sm font-bold tracking-tight text-foreground">Navi AI</h1>
             <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">System v4.0.2</span>
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
             </div>
           </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2.5 bg-surface-high/50 border border-border/10 rounded-xl hover:bg-accent/10 transition-all text-text-muted hover:text-accent group shadow-sm"
            title="Clear Chat"
          >
            <Trash2 size={16} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>

      <div 
        className={`flex-1 px-4 no-scrollbar relative scroll-smooth ${messages.length > 1 ? 'overflow-y-auto pb-32' : 'overflow-hidden'}`}
        onScroll={handleScroll}
      >
        {messages.length === 1 && messages[0].friendly?.isGreeting ? (
           <EmptyState onSelectSuggestion={(text) => handleSend(null, text)} />
        ) : (
          <div className="flex flex-col gap-10 py-8 max-w-3xl mx-auto h-full">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-5 animate-message-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar (ChatGPT Style - only for assistant) */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-surface-high border border-primary/20 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Cpu size={16} className="text-primary" />
                  </div>
                )}

                <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'max-w-[80%]' : 'flex-1'}`}>
                  {/* User Bubble */}
                  {msg.role === 'user' && (
                    <div className="p-4 px-6 rounded-[28px] bg-secondary text-white font-medium text-[15px] shadow-sm italic leading-relaxed">
                      "{msg.content}"
                    </div>
                  )}

                  {/* Assistant Response (ChatGPT Style - Clean Blocks) */}
                  {msg.role === 'assistant' && !msg.isError && (
                    <div className="w-full">
                      <FriendlyResponseCard
                        friendly={msg.friendly}
                        impact={msg.impact}
                        recommendations={msg.recommendations}
                        bestRoute={msg.bestRoute}
                        alternatives={msg.alternatives}
                      />
                      {msg.pipeline && (
                        <PipelineSteps pipeline={msg.pipeline} />
                      )}
                    </div>
                  )}

                  {/* Error Notification */}
                  {msg.isError && (
                    <div className="p-4 px-6 rounded-2xl bg-accent/5 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest leading-relaxed">
                      {msg.rawContent}
                    </div>
                  )}
                </div>

                {/* User Avatar (Optional - right side) */}
                {msg.role === 'user' && (
                   <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1 shadow-md">
                      <User size={16} className="text-white" />
                   </div>
                )}
              </motion.div>
            ))}
            <div className="h-4" />
          </div>
        )}

        {/* Scroll to Bottom Button */}
        <AnimatePresence>
          {messages.length > 1 && showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-surface border border-border/20 rounded-full shadow-2xl text-text-muted hover:text-foreground transition-all z-20"
            >
              <ChevronDown size={20} />
            </motion.button>
          )}
        </AnimatePresence>
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-4 text-primary animate-pulse py-2 px-10">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
               <Sparkles size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural link actively processing…</span>
          </div>
        )}
        <div ref={chatEndRef} className="h-6" />
      </div>

      {/* Input Experience (ChatGPT Style Pill) */}
      <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur-xl pb-4">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSend} className="relative group">
            <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="relative flex items-center bg-surface-high border border-border/50 rounded-full p-2 group-focus-within:border-primary/40 group-focus-within:bg-surface transition-all shadow-2xl overflow-hidden min-h-[64px] focus-within:input-pill-focus">
              {/* Attachment Icon */}
              <button 
                type="button" 
                className="p-3 ml-1 text-text-muted hover:text-foreground transition-colors hover:bg-white/5 rounded-full"
              >
                <Plus size={20} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-transparent border-none outline-none text-foreground text-[15px] font-medium px-4 disabled:opacity-50 placeholder:text-text-muted/40 placeholder:font-normal"
                placeholder="Message Navi AI..."
              />

              {/* Action Button Integrated */}
              <div className="flex items-center gap-2 pr-1">
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={`p-3 rounded-full transition-all flex items-center justify-center min-w-[44px] min-h-[44px] ${
                    input.trim() 
                      ? 'bg-foreground text-background scale-100 shadow-lg' 
                      : 'bg-surface border border-border/10 text-text-muted opacity-30 scale-95'
                  }`}
                >
                  {isTyping ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Footer Disclaimer */}
          <div className="mt-4 text-center">
            <span className="text-[10px] text-text-muted opacity-30 font-bold uppercase tracking-[0.3em]">
              Navi AI v4.0 · Cognitive Logistics Core
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
