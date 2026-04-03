'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Send, User, Trash2, Download,
  ChevronDown, ChevronUp, Zap, Sparkles,
  Search, ShieldCheck, AlertTriangle,
  CloudLightning, Route, Lightbulb, CheckCircle2, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

// ─── Friendly response card ────────────────────────────────────────────────────
function FriendlyResponseCard({ friendly, impact, recommendations, bestRoute, alternatives }) {
  const hasFullData = friendly && (friendly.impact || friendly.recommendation || friendly.bestOption);

  if (!hasFullData) {
    return (
      <div className="mt-4 p-4 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl text-[var(--text-muted)] text-sm">
        {friendly?.situation || "I'm processing your request…"}
      </div>
    );
  }

  const blocks = [
    {
      key: 'situation',
      icon: <Lightbulb size={14} />,
      label: "What's happening",
      text: friendly.situation,
      color: 'var(--primary)'
    },
    {
      key: 'impact',
      icon: <AlertTriangle size={14} />,
      label: 'Impact',
      text: friendly.impact,
      color: impact?.level === 'Critical' ? 'var(--accent)' : impact?.level === 'High' ? '#f59e0b' : 'var(--primary)'
    },
    {
      key: 'recommendation',
      icon: <CheckCircle2 size={14} />,
      label: 'Recommendation',
      text: friendly.recommendation,
      color: '#10b981'
    },
    {
      key: 'bestOption',
      icon: <Route size={14} />,
      label: 'Best Option',
      text: friendly.bestOption,
      color: 'var(--secondary)'
    },
    {
      key: 'why',
      icon: <HelpCircle size={14} />,
      label: 'Why',
      text: friendly.why,
      color: 'var(--text-muted)'
    }
  ].filter(b => b.text);

  return (
    <div className="mt-5 flex flex-col gap-3">
      {/* Impact chips */}
      {impact && (
        <div className="flex gap-2 flex-wrap mb-1">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            impact.level === 'Critical' ? 'bg-red-500/15 border-red-500/40 text-red-400'
            : impact.level === 'High'   ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
            : impact.level === 'Medium' ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
          }`}>
            {impact.level} Risk
          </span>
          {impact.maxDelayDays > 0 && (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--border-muted)] text-[var(--text-muted)]">
              ⏱ Up to {impact.maxDelayDays}d delay
            </span>
          )}
          {impact.costFormatted && impact.costFormatted !== '₹0' && (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--border-muted)] text-[var(--text-muted)]">
              💰 {impact.costFormatted} exposure
            </span>
          )}
        </div>
      )}

      {/* Friendly structured blocks */}
      {blocks.map((block) => (
        <div
          key={block.key}
          className="flex gap-3 p-4 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl"
        >
          <div
            className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mt-0.5"
            style={{ background: `${block.color}18`, color: block.color }}
          >
            {block.icon}
          </div>
          <div className="flex flex-col gap-0.5">
            <div
              className="text-[9px] font-black uppercase tracking-[0.15em]"
              style={{ color: block.color }}
            >
              {block.label}
            </div>
            <div className="text-sm text-[var(--text-primary)] leading-relaxed">
              {block.text}
            </div>
          </div>
        </div>
      ))}

      {/* Top 2 recommendations */}
      {recommendations?.length > 0 && (
        <div className="p-4 bg-[var(--surface-high)] border border-[var(--border-muted)] rounded-2xl">
          <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] mb-3 flex items-center gap-1.5">
            <Zap size={11} /> Action Checklist
          </div>
          <div className="flex flex-col gap-2">
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className={`mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full ${
                  rec.priority === 'IMMEDIATE' ? 'bg-red-400 animate-pulse'
                  : rec.priority === 'HIGH'    ? 'bg-amber-400'
                  : 'bg-[var(--primary)]'
                }`} />
                <div>
                  <div className="text-xs font-semibold text-[var(--text-primary)] leading-tight">{rec.action}</div>
                  {rec.timeframe && (
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{rec.timeframe}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternatives */}
      {alternatives?.length > 0 && (
        <div className="p-4 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl">
          <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] mb-3">
            Other Options
          </div>
          <div className="flex flex-col gap-2">
            {alternatives.map((alt, i) => (
              <div key={i} className="flex gap-2 items-start text-xs text-[var(--text-secondary)]">
                <span className="shrink-0 text-[var(--text-muted)]">•</span>
                <div>
                  <span className="font-semibold text-[var(--text-primary)]">{alt.name}</span>
                  {' — '}{alt.description}
                  {alt.costDelta && <span className="ml-1 text-[var(--text-muted)]">({alt.costDelta})</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Greeting / status card ────────────────────────────────────────────────────
function GreetingCard({ friendly }) {
  if (!friendly) return null;
  return (
    <div className="mt-3 p-4 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl text-sm text-[var(--text-secondary)] leading-relaxed">
      {friendly.impact && (
        <div className="mt-2 text-[var(--text-muted)] text-xs">{friendly.impact}</div>
      )}
      {friendly.recommendation && (
        <div className="mt-2 text-[var(--text-primary)] text-xs font-medium">{friendly.recommendation}</div>
      )}
    </div>
  );
}

// ─── Pipeline stepper ─────────────────────────────────────────────────────────
function PipelineSteps({ pipeline }) {
  if (!pipeline?.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {pipeline.map((step, i) => (
        <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-[var(--surface)] border border-[var(--border-muted)] rounded-xl text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wide">
          <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'complete' ? 'bg-emerald-400' : 'bg-[var(--border-muted)]'}`} />
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
        situation: "Hi! I'm Navi, your supply chain assistant. I can help you track shipments, spot disruptions, and find the best routes.",
        impact: null,
        recommendation: "Ask me anything — about delays, costs, routes, or what's happening right now in your supply chain.",
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

  const DEMO_CHIP = "Storm affecting shipments — best route?";

  const chips = [
    "Check system status",
    DEMO_CHIP,
    "What shipments are delayed?",
    "How can I reduce costs?",
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
      if (queryText === DEMO_CHIP) {
        response = await api.loadNaviDemo();
      } else {
        response = await api.queryNavi(queryText);
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        // Friendly formatted response (from responseFormatter.js)
        friendly: response.friendlyResponse || null,
        // Raw data for chips / extras
        impact:          response.impact,
        recommendations: response.recommendations,
        bestRoute:       response.bestRoute,
        alternatives:    response.alternatives,
        pipeline:        response.pipeline,
        reasoning:       response.reasoning,
        usedLLM:         response.usedLLM,
        confidence:      response.confidence,
        // Legacy fallback for non-formatter responses
        rawContent: response.conversationalReply || response.situationSummary || 'Analysis complete.',
        showPipeline: false
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        isError: true,
        rawContent: `Something went wrong: ${err.message}. Please try again in a moment.`
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto animate-in">

      {/* Header */}
      <div className="pb-8 border-b border-[var(--border-muted)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface-high)] border border-[var(--primary)]/20 flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)]">
              <Image src="/logo.png" alt="Navi AI Logo" width={32} height={32} className="object-contain" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">Navi AI</h1>
          </div>
          <p className="text-[var(--text-muted)] text-xs font-bold tracking-[0.2em] uppercase">
            Your friendly supply chain assistant · 3-Agent Intelligence
          </p>
        </div>
        <div className="flex gap-4">
          <button
            className="p-3 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl hover:bg-[var(--surface-hover)] transition-all text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            title="Download Log"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-3 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl hover:bg-[var(--surface-hover)] transition-all text-[var(--text-muted)] hover:text-[var(--accent)]"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pt-8 px-2 flex flex-col gap-10 no-scrollbar">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              msg.role === 'user'
                ? 'bg-[var(--secondary)] text-white'
                : 'bg-[var(--surface-high)] border border-[var(--primary)]/20'
            }`}>
              {msg.role === 'user'
                ? <User size={20} />
                : <Image src="/logo.png" alt="Navi" width={24} height={24} className="object-contain" />
              }
            </div>

            {/* Message body */}
            <div className={`flex flex-col gap-3 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>

              {/* User bubble */}
              {msg.role === 'user' && (
                <div className="w-full p-5 rounded-3xl rounded-tr-none text-sm leading-relaxed shadow-xl bg-[var(--secondary)] text-white">
                  {msg.content}
                </div>
              )}

              {/* Error bubble */}
              {msg.isError && (
                <div className="w-full p-5 rounded-3xl rounded-tl-none text-sm leading-relaxed shadow-xl bg-rose-500/20 border border-rose-500/50 text-rose-200">
                  {msg.rawContent}
                </div>
              )}

              {/* Assistant bubble */}
              {msg.role === 'assistant' && !msg.isError && (
                <div className="w-full p-5 rounded-3xl rounded-tl-none text-sm leading-relaxed shadow-xl glass-card border border-[var(--primary)]/10">

                  {/* Situation (the main reply text) */}
                  <div className="text-[13px] text-[var(--text-primary)] leading-relaxed">
                    {msg.friendly?.situation || msg.rawContent}
                  </div>

                  {/* Greeting / status card */}
                  {(msg.friendly?.isGreeting || msg.friendly?.isStatusCheck) && (
                    <GreetingCard friendly={msg.friendly} />
                  )}

                  {/* Full operational response */}
                  {msg.friendly && !msg.friendly.isGreeting && !msg.friendly.isStatusCheck && (
                    <FriendlyResponseCard
                      friendly={msg.friendly}
                      impact={msg.impact}
                      recommendations={msg.recommendations}
                      bestRoute={msg.bestRoute}
                      alternatives={msg.alternatives}
                    />
                  )}
                </div>
              )}

              {/* Pipeline steps toggle */}
              {msg.role === 'assistant' && !msg.isError && msg.pipeline && (
                <div className="w-full">
                  <button
                    onClick={() => togglePipeline(msg.id)}
                    className="flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all uppercase tracking-widest px-1 py-1"
                  >
                    {msg.showPipeline ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {msg.showPipeline ? 'Hide' : 'Show'} agent steps
                  </button>
                  <AnimatePresence>
                    {msg.showPipeline && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <PipelineSteps pipeline={msg.pipeline} />
                        {msg.reasoning && (
                          <div className="mt-3 p-4 bg-black/30 border border-[var(--border-muted)] rounded-2xl text-xs text-[var(--text-muted)] italic leading-relaxed">
                            {msg.reasoning}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-4 text-[var(--primary)] animate-pulse">
            <Sparkles size={18} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Navi is thinking…</span>
          </div>
        )}
        <div ref={chatEndRef} className="h-4" />
      </div>

      {/* Input Section */}
      <div className="pt-8 mt-auto sticky bottom-0 bg-[var(--bg-primary)]/80 backdrop-blur-md pb-4">

        {/* Suggestion chips */}
        <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
          {chips.map(chip => (
            <button
              key={chip}
              onClick={() => handleSend(null, chip)}
              disabled={isTyping}
              className="px-4 py-2 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-all whitespace-nowrap uppercase tracking-wide disabled:opacity-50"
            >
              {chip === chips[1]
                ? <span className="flex items-center gap-1 text-[var(--text-primary)]"><CloudLightning size={12} className="text-[var(--accent)]" /> {chip}</span>
                : chip
              }
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSend} className="relative group">
          <div className="absolute inset-0 bg-[var(--primary)]/20 blur-[20px] rounded-[32px] opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-[var(--surface-high)] border border-[var(--border-muted)] rounded-[32px] p-2 focus-within:border-[var(--primary)]/50 transition-all shadow-2xl">
            <div className="p-4 mr-2 text-[var(--text-muted)]/40"><Search size={22} /></div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] text-sm font-medium py-4 disabled:opacity-50"
              placeholder="Ask Navi about your shipments, routes, or disruptions…"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-4 bg-[var(--primary)] text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-3 px-8 shadow-[0_0_20px_var(--primary-glow)]"
            >
              <span>{isTyping ? 'Thinking…' : 'Ask Navi'}</span>
              <Zap size={16} fill="currentColor" />
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <span className="text-[9px] text-[var(--text-muted)]/20 font-bold uppercase tracking-[0.3em]">
            Navi Intelligence v2.0 · Retrieval → Impact → Decision · Formatter Active
          </span>
        </div>
      </div>
    </div>
  );
}
