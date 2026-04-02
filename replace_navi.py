"""
Replace the Supply Alert AI panel with Navi in CommandCenterUI.js
"""
import re

FILE = r'frontend\app\dashboard\CommandCenterUI.js'
content = open(FILE, encoding='utf-8').read()

# ── 1. Replace old state variables + handler with Navi state ───────────────
OLD_STATE = """  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Supply Alert AI online. Full tactical visibility established. How can I assist with your supply chain logistics?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);"""

NEW_STATE = """  // ── Navi state ──────────────────────────────────────────────
  const [naviQuery, setNaviQuery] = useState('');
  const [naviHistory, setNaviHistory] = useState([]);
  const [naviLoading, setNaviLoading] = useState(false);
  const [naviPipeline, setNaviPipeline] = useState([]);
  const [naviActiveTab, setNaviActiveTab] = useState('decision'); // decision | sources | signals
  const naviEndRef = useRef(null);"""

content = content.replace(OLD_STATE, NEW_STATE)

# ── 2. Replace old useEffect (scroll) that references chatEndRef ───────────
OLD_EFFECT = """  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);"""

NEW_EFFECT = """  useEffect(() => {
    naviEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [naviHistory]);"""

content = content.replace(OLD_EFFECT, NEW_EFFECT)

# ── 3. Replace old handleSendMessage with Navi query handler + demo loader ─
OLD_HANDLER = """  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.getAIAdvisorInsights(input);
      const assistantMsg = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: response.reasoning || response.situation.summary,
        impact: { 
          risk: response.impactLevel === 'Critical' ? '+24%' : response.impactLevel === 'High' ? '+12%' : '+4%', 
          cost: response.situation.costImpact, 
          confidence: `${response.confidence}%` 
        }
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: "Unable to process strategic analysis at this time." }]);
    } finally {
      setIsTyping(false);
    }
  };"""

NEW_HANDLER = """  // ── Navi query pipeline ────────────────────────────────────
  const handleNaviQuery = async (e, overrideQuery) => {
    if (e) e.preventDefault();
    const q = overrideQuery || naviQuery;
    if (!q.trim()) return;

    const entry = { id: Date.now(), query: q, loading: true, result: null, error: null };
    setNaviHistory(prev => [...prev, entry]);
    setNaviQuery('');
    setNaviLoading(true);
    setNaviActiveTab('decision');

    // Show pipeline steps animating
    setNaviPipeline([
      { agent: 'RAG Pipeline', status: 'running' },
      { agent: 'Retrieval Agent', status: 'pending' },
      { agent: 'Signal Agent', status: 'pending' },
      { agent: 'Impact Agent', status: 'pending' },
      { agent: 'Decision Agent', status: 'pending' },
    ]);

    // Stagger pipeline status updates for visual effect
    const stepDelay = 600;
    setTimeout(() => setNaviPipeline(p => p.map((s,i) => i===1 ? {...s, status:'running'} : i===0 ? {...s, status:'complete'} : s)), stepDelay);
    setTimeout(() => setNaviPipeline(p => p.map((s,i) => i===2 ? {...s, status:'running'} : i<=1 ? {...s, status:'complete'} : s)), stepDelay*2);
    setTimeout(() => setNaviPipeline(p => p.map((s,i) => i===3 ? {...s, status:'running'} : i<=2 ? {...s, status:'complete'} : s)), stepDelay*3);
    setTimeout(() => setNaviPipeline(p => p.map((s,i) => i===4 ? {...s, status:'running'} : i<=3 ? {...s, status:'complete'} : s)), stepDelay*4);

    try {
      const result = await api.queryNavi(q);
      setNaviHistory(prev => prev.map(h => h.id === entry.id ? { ...h, loading: false, result } : h));
      setNaviPipeline(p => p.map(s => ({ ...s, status: 'complete' })));
    } catch (err) {
      setNaviHistory(prev => prev.map(h => h.id === entry.id ? { ...h, loading: false, error: 'Navi pipeline error. Please retry.' } : h));
      setNaviPipeline(p => p.map(s => ({ ...s, status: 'error' })));
    } finally {
      setNaviLoading(false);
    }
  };

  const loadNaviDemo = async () => {
    await handleNaviQuery(null, 'Storm detected via API — best route and immediate action?');
  };"""

content = content.replace(OLD_HANDLER, NEW_HANDLER)

# ── 4. Remove "Bot, User" imports that are no longer needed, add ones we need
OLD_IMPORT = """  ShieldAlert, Activity, Globe, Package, TrendingUp, AlertTriangle, 
  Send, Bot, User, Zap, BarChart3, MapPin, Ship, Plane, Train, 
  Clock, IndianRupee, Layers, ChevronRight, ChevronLeft, Maximize2, Search, RotateCcw"""

NEW_IMPORT = """  ShieldAlert, Activity, Globe, Package, TrendingUp, AlertTriangle, 
  Send, Zap, BarChart3, MapPin, Ship, Plane, Train, Navigation,
  Clock, IndianRupee, Layers, ChevronRight, ChevronLeft, Search, RotateCcw,
  Database, Radio, Cpu, CheckCircle2, Loader2, AlertOctagon, ArrowRight,
  CloudLightning, Newspaper, Route, Target, FlaskConical"""

content = content.replace(OLD_IMPORT, NEW_IMPORT)

# ── 5. Replace the old right AI panel with the full Navi panel ─────────────
OLD_PANEL_START = '        {/* Right: Sticky AI Panel */}'
OLD_PANEL_END = '      </div>\n    </div>\n  );\n}'

# Find boundaries
start = content.index(OLD_PANEL_START)
end = content.index(OLD_PANEL_END, start) + len(OLD_PANEL_END)

NAVI_PANEL = '''        {/* ─── Right: Navi Decision Intelligence Panel ─── */}
        <div className="lg:col-span-4 h-full">
           <div className="sticky top-24 flex flex-col h-[calc(100vh-160px)]">

             {/* ── Navi Header ── */}
             <div className="bg-gradient-to-r from-[var(--surface)] to-[var(--surface-high)] border border-primary/20 rounded-3xl p-5 mb-4 relative overflow-hidden shadow-[0_0_40px_rgba(0,218,243,0.08)]">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,218,243,0.06),transparent_60%)]" />
               <div className="relative flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,218,243,0.3)]">
                     <Navigation size={18} className="text-primary" />
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                       <h3 className="text-base font-black tracking-tight text-[var(--text-primary)]">Navi</h3>
                       <span className="text-[9px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">GenAI</span>
                     </div>
                     <div className="flex items-center gap-1.5 mt-0.5">
                       <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_6px_#00DAF3]"></span>
                       <span className="text-[9px] text-[var(--text-primary)]/40 font-bold uppercase tracking-[0.15em]">Multi-Agent · RAG · Live Signals</span>
                     </div>
                   </div>
                 </div>
                 <button
                   onClick={loadNaviDemo}
                   disabled={naviLoading}
                   className="px-3 py-2 bg-accent/10 border border-accent/30 text-accent text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-accent/20 transition-all flex items-center gap-1.5 disabled:opacity-40"
                 >
                   <CloudLightning size={11} />
                   Storm Demo
                 </button>
               </div>
             </div>

             {/* ── Pipeline Status Bar ── */}
             {naviPipeline.length > 0 && (
               <motion.div
                 initial={{ opacity: 0, y: -8 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl px-4 py-3 mb-4 flex items-center gap-2 overflow-x-auto no-scrollbar"
               >
                 {naviPipeline.map((step, i) => (
                   <div key={step.agent} className="flex items-center gap-1.5 shrink-0">
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                       step.status === 'complete' ? 'bg-primary/20 text-primary' :
                       step.status === 'running' ? 'bg-secondary/20 text-secondary' :
                       step.status === 'error' ? 'bg-accent/20 text-accent' :
                       'bg-white/5 text-white/20'
                     }`}>
                       {step.status === 'complete' ? <CheckCircle2 size={10} /> :
                        step.status === 'running' ? <Loader2 size={10} className="animate-spin" /> :
                        step.status === 'error' ? <AlertOctagon size={10} /> :
                        <div className="w-1 h-1 rounded-full bg-current" />}
                     </div>
                     <span className={`text-[8px] font-black uppercase tracking-wide whitespace-nowrap transition-colors ${
                       step.status === 'complete' ? 'text-primary' :
                       step.status === 'running' ? 'text-secondary' :
                       'text-[var(--text-primary)]/20'
                     }`}>{step.agent}</span>
                     {i < naviPipeline.length - 1 && <ArrowRight size={8} className="text-white/10 ml-1" />}
                   </div>
                 ))}
               </motion.div>
             )}

             {/* ── Main Content ── */}
             <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4">

               {/* Empty state */}
               {naviHistory.length === 0 && (
                 <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
                   <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,218,243,0.15)]">
                     <Navigation size={28} className="text-primary" />
                   </div>
                   <div className="text-center px-4">
                     <h4 className="text-sm font-black text-[var(--text-primary)] mb-2">Ask Navi</h4>
                     <p className="text-[11px] text-[var(--text-primary)]/40 leading-relaxed">Decision intelligence powered by RAG, multi-agent analysis, and live signals.</p>
                   </div>
                   {/* Capability chips */}
                   <div className="grid grid-cols-3 gap-2 w-full px-2">
                     {[
                       { icon: Database, label: 'RAG', desc: 'Grounded answers' },
                       { icon: Cpu, label: '4 Agents', desc: 'Multi-agent' },
                       { icon: Radio, label: 'Live Signals', desc: 'Weather + News' },
                     ].map(cap => (
                       <div key={cap.label} className="bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl p-3 text-center">
                         <cap.icon size={14} className="text-primary mx-auto mb-1" />
                         <div className="text-[9px] font-black text-[var(--text-primary)] uppercase tracking-wide">{cap.label}</div>
                         <div className="text-[8px] text-[var(--text-primary)]/30">{cap.desc}</div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}

               {/* Results history */}
               {naviHistory.map((entry) => (
                 <div key={entry.id} className="flex flex-col gap-3">
                   {/* User query bubble */}
                   <div className="flex justify-end">
                     <div className="max-w-[85%] bg-primary/15 border border-primary/20 rounded-2xl rounded-tr-sm px-4 py-3 text-[11px] font-medium text-[var(--text-primary)] leading-relaxed">
                       {entry.query}
                     </div>
                   </div>

                   {/* Loading state */}
                   {entry.loading && (
                     <div className="bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl rounded-tl-sm p-4">
                       <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                         <Loader2 size={12} className="animate-spin" />
                         Navi is analyzing...
                       </div>
                     </div>
                   )}

                   {/* Error */}
                   {entry.error && (
                     <div className="bg-accent/10 border border-accent/30 rounded-2xl p-4 text-[11px] text-accent font-bold">
                       {entry.error}
                     </div>
                   )}

                   {/* Result Card */}
                   {entry.result && !entry.loading && (() => {
                     const r = entry.result;
                     const impactColor = r.impactLevel === 'Critical' ? 'text-accent border-accent/40 bg-accent/10'
                       : r.impactLevel === 'High' ? 'text-secondary border-secondary/40 bg-secondary/10'
                       : r.impactLevel === 'Medium' ? 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10'
                       : 'text-primary border-primary/40 bg-primary/10';
                     return (
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="bg-[var(--surface)] border border-[var(--border-muted)] rounded-2xl rounded-tl-sm overflow-hidden"
                       >
                         {/* Navi badge */}
                         <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[var(--border-muted)]">
                           <div className="flex items-center gap-2">
                             <Navigation size={11} className="text-primary" />
                             <span className="text-[9px] font-black text-primary uppercase tracking-widest">Navi Decision</span>
                             {r.usedLLM && <span className="text-[8px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full font-bold">GPT-4o</span>}
                           </div>
                           <div className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${impactColor}`}>
                             {r.impactLevel}
                           </div>
                         </div>

                         {/* Tab switcher */}
                         <div className="flex border-b border-[var(--border-muted)]">
                           {[
                             { id: 'decision', label: 'Decision', icon: Target },
                             { id: 'sources', label: 'Sources', icon: Database },
                             { id: 'signals', label: 'Signals', icon: Radio },
                           ].map(tab => (
                             <button
                               key={tab.id}
                               onClick={() => setNaviActiveTab(tab.id)}
                               className={`flex-1 flex items-center justify-center gap-1 py-2 text-[9px] font-black uppercase tracking-wide transition-all ${
                                 naviActiveTab === tab.id
                                   ? 'text-primary border-b-2 border-primary bg-primary/5'
                                   : 'text-[var(--text-primary)]/30 hover:text-[var(--text-primary)]/60'
                               }`}
                             >
                               <tab.icon size={9} />
                               {tab.label}
                             </button>
                           ))}
                         </div>

                         <div className="p-4">
                           {/* Decision Tab */}
                           {naviActiveTab === 'decision' && (
                             <div className="flex flex-col gap-4">
                               {/* Situation Summary */}
                               <div>
                                 <div className="text-[9px] font-black text-[var(--text-primary)]/30 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                   <Cpu size={8} /> Situation Summary
                                 </div>
                                 <p className="text-[11px] text-[var(--text-primary)]/80 leading-relaxed">
                                   {r.situationSummary}
                                 </p>
                               </div>

                               {/* Impact metrics */}
                               {r.impact && (
                                 <div className="grid grid-cols-3 gap-2">
                                   <div className="bg-[var(--surface-high)] rounded-xl p-2 text-center">
                                     <div className="text-[8px] text-[var(--text-primary)]/30 uppercase font-bold mb-1">Score</div>
                                     <div className="text-sm font-black text-[var(--text-primary)]">{r.impact.score}<span className="text-[9px] text-[var(--text-primary)]/30">/100</span></div>
                                   </div>
                                   <div className="bg-[var(--surface-high)] rounded-xl p-2 text-center">
                                     <div className="text-[8px] text-[var(--text-primary)]/30 uppercase font-bold mb-1">Ships</div>
                                     <div className="text-sm font-black text-secondary">{r.impact.totalShipmentsAffected}</div>
                                   </div>
                                   <div className="bg-[var(--surface-high)] rounded-xl p-2 text-center">
                                     <div className="text-[8px] text-[var(--text-primary)]/30 uppercase font-bold mb-1">Exposure</div>
                                     <div className="text-[10px] font-black text-accent">{r.impact.costFormatted}</div>
                                   </div>
                                 </div>
                               )}

                               {/* Best Route */}
                               {r.bestRoute && (
                                 <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                                   <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                     <Route size={9} /> Best Route
                                   </div>
                                   <div className="text-[11px] font-bold text-[var(--text-primary)] mb-1">{r.bestRoute.name}</div>
                                   <p className="text-[10px] text-[var(--text-primary)]/60 leading-relaxed">{r.bestRoute.reason}</p>
                                   {r.bestRoute.costDelta && (
                                     <div className="flex gap-2 mt-2">
                                       <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{r.bestRoute.costDelta}</span>
                                       {r.bestRoute.confidence && <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Confidence: {r.bestRoute.confidence}</span>}
                                     </div>
                                   )}
                                 </div>
                               )}

                               {/* Recommendations */}
                               {r.recommendations?.length > 0 && (
                                 <div>
                                   <div className="text-[9px] font-black text-[var(--text-primary)]/30 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                     <Zap size={8} /> Recommended Actions
                                   </div>
                                   <div className="flex flex-col gap-2">
                                     {r.recommendations.slice(0, 3).map((rec, i) => (
                                       <div key={i} className="flex gap-2.5 items-start">
                                         <div className={`mt-0.5 shrink-0 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide ${
                                           rec.priority === 'IMMEDIATE' ? 'bg-accent/20 text-accent' :
                                           rec.priority === 'HIGH' ? 'bg-secondary/20 text-secondary' :
                                           'bg-primary/20 text-primary'
                                         }`}>{rec.priority}</div>
                                         <div>
                                           <div className="text-[10px] font-bold text-[var(--text-primary)] leading-tight">{rec.action}</div>
                                           {rec.savingsEstimate && <div className="text-[9px] text-primary/70 mt-0.5">{rec.savingsEstimate}</div>}
                                         </div>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               )}

                               {/* Reasoning */}
                               <div className="bg-[var(--surface-high)] rounded-xl p-3 border border-[var(--border-muted)]">
                                 <div className="text-[9px] font-black text-[var(--text-primary)]/30 uppercase tracking-widest mb-1.5">Reasoning</div>
                                 <p className="text-[10px] text-[var(--text-primary)]/60 leading-relaxed">{r.reasoning}</p>
                               </div>

                               {/* Confidence */}
                               {r.confidence && (
                                 <div className="flex items-center gap-2">
                                   <div className="flex-1 h-1 bg-[var(--surface-high)] rounded-full overflow-hidden">
                                     <motion.div
                                       initial={{ width: 0 }}
                                       animate={{ width: `${r.confidence}%` }}
                                       transition={{ duration: 1, ease: 'easeOut' }}
                                       className="h-full bg-primary rounded-full"
                                     />
                                   </div>
                                   <span className="text-[9px] font-black text-primary">{r.confidence}% conf.</span>
                                 </div>
                               )}
                             </div>
                           )}

                           {/* Sources Tab */}
                           {naviActiveTab === 'sources' && (
                             <div className="flex flex-col gap-3">
                               <div className="text-[9px] font-black text-[var(--text-primary)]/30 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                 <Database size={8} /> RAG Data Sources
                               </div>
                               {(r.dataSources || []).map((src, i) => (
                                 <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border-muted)] last:border-0">
                                   <div>
                                     <div className="text-[10px] font-bold text-[var(--text-primary)]">{src.source}</div>
                                     {src.event && <div className="text-[9px] text-[var(--text-primary)]/40">{src.event}</div>}
                                   </div>
                                   <div className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{src.records} rec.</div>
                                 </div>
                               ))}
                               <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mt-1">
                                 <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">RAG Stats</div>
                                 <div className="flex justify-between text-[10px]">
                                   <span className="text-[var(--text-primary)]/50">Docs retrieved</span>
                                   <span className="text-[var(--text-primary)] font-bold">{r.ragContext?.docsRetrieved || 0}</span>
                                 </div>
                                 <div className="flex justify-between text-[10px] mt-1">
                                   <span className="text-[var(--text-primary)]/50">Types</span>
                                   <span className="text-[var(--text-primary)] font-bold">{(r.ragContext?.types || []).join(', ')}</span>
                                 </div>
                                 <div className="flex justify-between text-[10px] mt-1">
                                   <span className="text-[var(--text-primary)]/50">Processing</span>
                                   <span className="text-primary font-bold">{r.processingMs}ms</span>
                                 </div>
                               </div>
                             </div>
                           )}

                           {/* Signals Tab */}
                           {naviActiveTab === 'signals' && (
                             <div className="flex flex-col gap-3">
                               <div className="text-[9px] font-black text-[var(--text-primary)]/30 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                 <Radio size={8} /> Live API Signals
                               </div>
                               {(r.signals || []).length === 0 && (
                                 <div className="text-[11px] text-[var(--text-primary)]/40 text-center py-4">No signals detected</div>
                               )}
                               {(r.signals || []).map((sig, i) => (
                                 <div key={i} className={`rounded-xl p-3 border ${
                                   sig.severity === 'critical' ? 'bg-accent/5 border-accent/30' :
                                   sig.severity === 'high' ? 'bg-secondary/5 border-secondary/30' :
                                   'bg-primary/5 border-primary/20'
                                 }`}>
                                   <div className="flex items-center justify-between mb-1.5">
                                     <div className="flex items-center gap-1.5">
                                       {sig.type === 'weather' ? <CloudLightning size={10} className="text-secondary" /> : <Newspaper size={10} className="text-primary" />}
                                       <span className="text-[9px] font-black text-[var(--text-primary)]/50 uppercase tracking-wide">{sig.source}</span>
                                     </div>
                                     <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                                       sig.severity === 'critical' ? 'text-accent bg-accent/20' : 'text-secondary bg-secondary/20'
                                     }`}>{sig.severity}</span>
                                   </div>
                                   <div className="text-[10px] font-bold text-[var(--text-primary)] leading-tight">{sig.event || sig.headline}</div>
                                   {sig.details && <p className="text-[9px] text-[var(--text-primary)]/50 mt-1 leading-relaxed">{sig.details}</p>}
                                   <div className="text-[8px] text-[var(--text-primary)]/25 mt-1.5 font-bold uppercase tracking-widest">{sig.location || sig.affectedRegion}</div>
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       </motion.div>
                     );
                   })()}
                 </div>
               ))}

               <div ref={naviEndRef} />
             </div>

             {/* ── Input Area ── */}
             <div className="mt-4 bg-[var(--surface)] border border-[var(--border-muted)] rounded-3xl p-4">
               {/* Quick prompts */}
               <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                 {[
                   'Best route right now?',
                   'Will shipments delay?',
                   'Reduce cost impact',
                   'What-if typhoon hits?',
                 ].map(p => (
                   <button
                     key={p}
                     onClick={() => handleNaviQuery(null, p)}
                     disabled={naviLoading}
                     className="px-3 py-1.5 bg-[var(--surface-high)] border border-[var(--border-muted)] rounded-full text-[9px] font-bold text-[var(--text-primary)]/50 hover:text-primary hover:border-primary/50 transition-all whitespace-nowrap disabled:opacity-30"
                   >
                     {p}
                   </button>
                 ))}
               </div>
               <form onSubmit={handleNaviQuery} className="relative">
                 <input
                   value={naviQuery}
                   onChange={e => setNaviQuery(e.target.value)}
                   placeholder="Ask Navi a supply chain question..."
                   disabled={naviLoading}
                   className="w-full bg-[var(--surface-high)] border border-[var(--border-muted)] rounded-2xl px-4 py-3.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-primary)]/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all pr-12 disabled:opacity-40"
                 />
                 <button
                   type="submit"
                   disabled={naviLoading || !naviQuery.trim()}
                   className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-30 disabled:scale-100"
                 >
                   {naviLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                 </button>
               </form>
             </div>

           </div>
        </div>
      </div>
    </div>
  );
}'''

new_content = content[:start] + NAVI_PANEL
open(FILE, 'w', encoding='utf-8').write(new_content)

lines = new_content.split('\n')
print(f"Done. File now has {len(lines)} lines.")
for i, l in enumerate(lines):
    if 'Navi Decision Intelligence' in l:
        print(f"  Navi panel found at line {i+1}")
        break
