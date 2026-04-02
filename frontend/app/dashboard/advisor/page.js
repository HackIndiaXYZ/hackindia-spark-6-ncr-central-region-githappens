'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  Send, User, Trash2, Download, 
  ChevronDown, ChevronUp, Zap, Sparkles,
  Search, ShieldCheck, AlertTriangle,
  Activity, CloudLightning, Route, Database, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function AdvisorPage() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'assistant', 
      content: 'Navi Decision Intelligence online. I am connected to global logistics telemetry, local RAG databases, and live News/Weather signals. How can I assist with your supply chain strategy?', 
      showReasoning: false 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const chips = [
    "Check System Status",
    "Storm detected via API — best route and immediate action?",
    "Predict delays this week",
    "Reduce cost exposure",
  ];

  const handleSendMessage = async (e, textOverride = '') => {
    if (e) e.preventDefault();
    const queryText = textOverride || input;
    if (!queryText.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Use the Navi Multi-Agent Intelligence API
      let response;
      if (queryText === "Storm detected via API — best route and immediate action?") {
        response = await api.loadNaviDemo();
      } else {
        response = await api.queryNavi(queryText);
      }
      
      const assistantMsg = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response.situationSummary || "Analysis complete.",
        conversationalReply: response.conversationalReply,
        showReasoning: false,
        reasoning: response.reasoning,
        impact: response.impact,
        recommendations: response.recommendations,
        bestRoute: response.bestRoute,
        pipeline: response.pipeline,
        usedLLM: response.usedLLM,
        confidence: response.confidence
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        isError: true,
        content: `LOGISTICS PIPELINE CRITICAL FAILURE: ${err.message}. If this is a 404, the Vercel-to-Express bridge is broken.` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleReasoning = (id) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, showReasoning: !msg.showReasoning } : msg
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
             <p className="text-[var(--text-muted)] text-xs font-bold tracking-[0.2em] uppercase">Multi-Agent Intelligence Matrix Active</p>
          </div>
          <div className="flex gap-4">
             <button className="p-3 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl hover:bg-[var(--surface-hover)] transition-all text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Download Log">
                <Download size={18} />
             </button>
             <button onClick={() => setMessages([messages[0]])} className="p-3 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl hover:bg-[var(--surface-hover)] transition-all text-[var(--text-muted)] hover:text-[var(--accent)]" title="Clear Chat">
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
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-[var(--secondary)] text-white' : 'bg-[var(--surface-high)] border border-[var(--primary)]/20'}`}>
               {msg.role === 'user' ? <User size={20} /> : <Image src="/logo.png" alt="Navi" width={24} height={24} className="object-contain" />}
            </div>
            
            <div className={`flex flex-col gap-4 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`w-full p-5 rounded-3xl text-sm leading-relaxed shadow-xl ${msg.role === 'user' ? 'bg-[var(--secondary)] text-white rounded-tr-none' : msg.isError ? 'bg-rose-500/20 border border-rose-500/50 text-rose-200 rounded-tl-none' : 'glass-card border border-[var(--primary)]/10 text-[var(--text-secondary)] rounded-tl-none'}`}>
                 <div className={msg.role === 'user' ? '' : msg.isError ? 'font-bold' : 'text-[13px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap'}>
                   {msg.conversationalReply || msg.content}
                 </div>

                 {/* Navi Rich Data Block */}
                 {msg.role === 'assistant' && msg.impact && !msg.conversationalReply && (
                    <div className="mt-6 flex flex-col gap-4">
                       
                       {/* Impact Metrics */}
                       <div className="grid grid-cols-3 gap-3">
                          <div className={`p-4 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl ${msg.impact.level === 'Critical' ? 'border-[var(--accent)]/50 bg-[var(--accent)]/5' : ''}`}>
                             <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">Impact Risk</div>
                             <div className={`flex items-center gap-2 font-black text-lg ${msg.impact.level === 'Critical' ? 'text-[var(--accent)]' : msg.impact.level === 'High' ? 'text-[var(--secondary)]' : 'text-[var(--primary)]'}`}>
                                {msg.impact.level === 'Critical' ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
                                <span>{msg.impact.score}/100</span>
                             </div>
                          </div>
                          <div className="p-4 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl">
                             <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">Exposure</div>
                             <div className="font-black text-lg text-[var(--text-primary)]">{msg.impact.costFormatted}</div>
                          </div>
                          <div className="p-4 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl">
                             <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">Ships Affected</div>
                             <div className="font-black text-lg text-[var(--text-primary)]">{msg.impact.totalShipmentsAffected}</div>
                          </div>
                       </div>

                       {/* Best Route & Recommended Actions */}
                       <div className="grid grid-cols-2 gap-3 mt-2">
                         {msg.bestRoute && (
                           <div className="p-4 bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-2xl flex flex-col justify-between">
                             <div>
                               <div className="flex items-center gap-1.5 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                                 <Route size={12} /> Best Strategy
                               </div>
                               <div className="text-sm font-bold text-[var(--text-primary)] mb-1">{msg.bestRoute.name}</div>
                               <p className="text-xs text-[var(--text-muted)]">{msg.bestRoute.reason}</p>
                             </div>
                             {msg.bestRoute.costDelta && (
                               <div className="inline-block mt-3 px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold rounded-lg self-start">
                                 Est: {msg.bestRoute.costDelta}
                               </div>
                             )}
                           </div>
                         )}

                         {msg.recommendations?.length > 0 && (
                           <div className="p-4 bg-[var(--surface-high)] border border-[var(--border-muted)] rounded-2xl">
                             <div className="flex items-center gap-1.5 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">
                               <Zap size={12} /> Key Actions
                             </div>
                             <div className="flex flex-col gap-3">
                               {msg.recommendations.slice(0, 2).map((rec, i) => (
                                 <div key={i} className="flex gap-2 items-start">
                                   <div className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full ${rec.priority === 'IMMEDIATE' ? 'bg-[var(--accent)] animate-pulse' : 'bg-[var(--primary)]'}`} />
                                   <div className="text-xs font-medium text-[var(--text-primary)] leading-tight">{rec.action}</div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>

                    </div>
                 )}
              </div>

              {/* reasoning Toggle */}
              {msg.role === 'assistant' && msg.reasoning && (
                <div className="w-full">
                  <button 
                    onClick={() => toggleReasoning(msg.id)}
                    className="flex items-center gap-2 text-[10px] font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all uppercase tracking-widest px-4 py-2"
                  >
                    {msg.showReasoning ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    Show Neural Pipeline & Reasoning
                  </button>
                  <AnimatePresence>
                    {msg.showReasoning && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-2"
                      >
                         <div className="p-5 bg-black/40 border border-[var(--border-muted)] rounded-3xl text-sm text-[var(--text-muted)] italic leading-relaxed shadow-inner">
                            <div className="mb-4 flex items-center gap-2">
                              {msg.usedLLM ? (
                                <span className="bg-[var(--secondary)]/20 text-[var(--secondary)] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">GPT-4o Synthesized</span>
                              ) : (
                                <span className="bg-white/10 text-white/50 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Rule-Based Fallback</span>
                              )}
                              {msg.confidence && <span className="text-[10px] font-black text-[var(--primary)]">{msg.confidence}% Confidence</span>}
                            </div>
                            {msg.reasoning}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && (
           <div className="flex items-center gap-4 text-[var(--primary)] animate-pulse">
              <Sparkles size={18} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Navi Agents Processing...</span>
           </div>
        )}
        <div ref={chatEndRef} className="h-4" />
      </div>

       {/* Input Section */}
       <div className="pt-8 mt-auto sticky bottom-0 bg-[var(--bg-primary)]/80 backdrop-blur-md pb-4">
          {/* suggestions chips */}
          <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
            {chips.map(chip => (
               <button 
                 key={chip}
                 onClick={() => handleSendMessage(null, chip)}
                 disabled={isTyping}
                 className="px-4 py-2 bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 transition-all whitespace-nowrap uppercase tracking-wide disabled:opacity-50"
               >
                  {chip === chips[0] ? <span className="flex items-center gap-1 text-[var(--text-primary)]"><CloudLightning size={12} className="text-[var(--accent)]" /> {chip}</span> : chip}
               </button>
            ))}
         </div>
         
          <form onSubmit={handleSendMessage} className="relative group">
             <div className="absolute inset-0 bg-[var(--primary)]/20 blur-[20px] rounded-[32px] opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
             <div className="relative flex items-center bg-[var(--surface-high)] border border-[var(--border-muted)] rounded-[32px] p-2 focus-within:border-[var(--primary)]/50 transition-all shadow-2xl">
                <div className="p-4 mr-2 text-[var(--text-muted)]/40"><Search size={22} /></div>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                  className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] text-sm font-medium py-4 disabled:opacity-50"
                  placeholder="Ask Navi a strategic supply chain query..."
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-4 bg-[var(--primary)] text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center gap-3 px-8 shadow-[0_0_20px_var(--primary-glow)]"
                >
                   <span>{isTyping ? 'Synthesizing...' : 'Execute Analysis'}</span>
                   <Zap size={16} fill="currentColor" />
                </button>
             </div>
          </form>
          <div className="mt-4 text-center">
             <span className="text-[9px] text-[var(--text-muted)]/20 font-bold uppercase tracking-[0.3em]">Navi Intelligence v1.2 (Debug-01) • Multi-Agent RAG Active</span>
          </div>
      </div>
    </div>
  );
}
