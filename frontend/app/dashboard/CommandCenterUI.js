'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Activity, Globe, Package, TrendingUp, AlertTriangle, 
  Send, Zap, BarChart3, MapPin, Ship, Plane, Train,
  Clock, IndianRupee, Layers, ChevronRight, ChevronLeft, Search, RotateCcw,
  Database, Radio, Cpu, CheckCircle2, Loader2, AlertOctagon, ArrowRight,
  CloudLightning, Newspaper, Route, Target, FlaskConical
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandCenterUI({ initialSummary, initialRecommendations }) {
  const [summary, setSummary] = useState(initialSummary);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  // ── Navi state ──────────────────────────────────────────────
  const [naviQuery, setNaviQuery] = useState('');
  const [naviHistory, setNaviHistory] = useState([]);
  const [naviLoading, setNaviLoading] = useState(false);
  const [naviPipeline, setNaviPipeline] = useState([]);
  const [naviActiveTab, setNaviActiveTab] = useState('decision'); // decision | sources | signals
  const naviEndRef = useRef(null);

  const [shipmentsList, setShipmentsList] = useState([]);
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  useEffect(() => {
    naviEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [naviHistory]);

  useEffect(() => {
    api.getShipments()
      .then(data => setShipmentsList(data))
      .catch(console.error);
  }, []);

  const nextRoute = () => setActiveRouteIndex(p => (p + 1) % shipmentsList.length);
  const prevRoute = () => setActiveRouteIndex(p => (p - 1 + shipmentsList.length) % shipmentsList.length);

  // ── Navi query pipeline ────────────────────────────────────
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
      setNaviHistory(prev => prev.map(h => h.id === entry.id ? { ...h, loading: false, error: 'Navi pipeline failure. Please retry.' } : h));
      setNaviPipeline(p => p.map(s => ({ ...s, status: 'error' })));
    } finally {
      setNaviLoading(false);
    }
  };

  const loadNaviDemo = async () => {
    await handleNaviQuery(null, 'Storm detected via API — best route and immediate action?');
  };

  return (
    <div className="flex flex-col gap-10 h-full w-full py-2">
      
      {/* ─── TOP KPI ROW ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {[
           { label: "Risk Score", value: `${summary?.riskScore || 0}/100`, icon: Globe, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", trend: "Trending Nominal" },
           { label: "Active Shipments", value: summary?.totalShipments || 0, icon: Package, color: "text-foreground", bg: "bg-surface-high", border: "border-border", trend: "Active Stream" },
           { label: "High Risk Alerts", value: summary?.criticalAlerts || 0, icon: AlertTriangle, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", trend: "Urgent Action" },
           { label: "Cost Exposure", value: `₹${(summary?.totalCostImpact || 0) / 100000}L`, icon: IndianRupee, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20", trend: "Cost Vector" },
         ].map((stat, i) => (
           <motion.div 
             key={stat.label}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className={`bg-surface border ${stat.border || 'border-border'} p-8 rounded-[32px] group hover:shadow-sm transition-all duration-300`}
           >
              <div className="flex items-center justify-between mb-6">
                 <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-105`}>
                    <stat.icon size={20} />
                 </div>
                 <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em]">{stat.label}</div>
              </div>
              <div className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
              <div className="mt-4 flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${stat.color === 'text-primary' ? 'bg-primary' : stat.color === 'text-accent' ? 'bg-accent' : 'bg-muted'}`} />
                 <span className="text-[9px] text-text-muted font-black tracking-tight uppercase tracking-widest">{stat.trend}</span>
              </div>
           </motion.div>
         ))}
      </div>

      {/* ─── MAIN CONTENT GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        
        {/* Left: Global & Insights */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           
           {/* Global Logistics View */}
           <div className="bg-surface border border-border rounded-[32px] p-10 relative overflow-hidden h-[540px] shadow-sm">
              <div className="flex items-center justify-between mb-10 relative z-10">
                 <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">Global Topology</h3>
                    <p className="text-[11px] text-text-muted uppercase tracking-[0.2em] font-black">Strategic Route Surveillance</p>
                 </div>
                 <div className="flex gap-6">
                    {[
                      { color: "bg-blue-500", label: "Nominal" },
                      { color: "bg-amber-500", label: "Congested" },
                      { color: "bg-rose-500", label: "Disrupted" }
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-2.5">
                         <span className={`w-2 h-2 rounded-full ${l.color}`}></span>
                         <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{l.label}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Map Visual */}
              <div className="absolute inset-0 top-24 flex items-center justify-center">
                 <div className="relative w-full h-full max-w-4xl opacity-[0.8] transition-all duration-700">
                    <img 
                      src="/world-map.svg" 
                      alt="World Map Base" 
                      className="absolute inset-0 w-full h-full object-fill opacity-[0.06] dark:opacity-[0.15] pointer-events-none z-0 saturate-0 scale-105 invert-0 dark:invert"
                    />
                    
                    <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                       <path id="route-sha-mum" d="M 837 186 Q 768 213, 702 228" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                       <path id="route-mum-rot" d="M 702 228 Q 600 169, 512 114" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                       <path id="route-rot-la" d="M 512 114 Q 344 100, 172 176" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
                       
                       <circle r="3" fill="#f43f5e"><animateMotion dur="25s" repeatCount="indefinite"><mpath href="#route-rot-la" /></animateMotion></circle>
                       <circle r="3" fill="#3b82f6"><animateMotion dur="18s" repeatCount="indefinite"><mpath href="#route-mum-rot" /></animateMotion></circle>
                       
                       {[
                         { name: 'Mumbai', cx: 702, cy: 228, status: 'nominal' },
                         { name: 'Shanghai', cx: 837, cy: 186, status: 'congested' },
                         { name: 'Rotterdam', cx: 512, cy: 114, status: 'nominal' },
                         { name: 'Los Angeles', cx: 172, cy: 176, status: 'disrupted' },
                         { name: 'Dubai', cx: 650, cy: 215, status: 'nominal' },
                         { name: 'New York', cx: 280, cy: 160, status: 'nominal' },
                         { name: 'Sydney', cx: 880, cy: 380, status: 'nominal' },
                         { name: 'Antwerp', cx: 515, cy: 110, status: 'nominal' },
                       ].map((port) => (
                         <g key={port.name}>
                           <circle cx={port.cx} cy={port.cy} r="4" fill={port.status === 'disrupted' ? '#f43f5e' : port.status === 'congested' ? '#f59e0b' : '#3b82f6'} />
                           <text x={port.cx} y={port.cy - 12} textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--text-muted)" className="uppercase tracking-widest">{port.name}</text>
                         </g>
                       ))}
                    </svg>

                    {/* Active Shipment Panel (Minimalist) */}
                    {shipmentsList.length > 0 && (
                       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 bg-surface border border-border p-6 rounded-[24px] flex items-center gap-8 shadow-sm w-[440px]">
                          <button onClick={prevRoute} className="p-3 bg-surface-high hover:bg-surface-highest rounded-xl transition-all text-text-muted">
                             <ChevronLeft size={20} />
                          </button>
                          
                          <div className="flex-1 text-center">
                             <div className="text-[10px] uppercase font-black tracking-[0.25em] text-text-muted mb-1">Active Pipeline</div>
                             <div className="text-[15px] font-bold text-foreground truncate">
                                {shipmentsList[activeRouteIndex].origin} &rarr; {shipmentsList[activeRouteIndex].destination}
                             </div>
                             <div className="flex items-center justify-center gap-2 mt-2">
                                <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full">{shipmentsList[activeRouteIndex].cargo}</span>
                                <span className="text-[9px] font-bold px-2 py-0.5 bg-surface-high text-text-muted rounded-full">{shipmentsList[activeRouteIndex].id}</span>
                             </div>
                          </div>
                          
                          <button onClick={nextRoute} className="p-3 bg-surface-high hover:bg-surface-highest rounded-xl transition-all text-text-muted">
                             <ChevronRight size={20} />
                          </button>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Metrics & Analytics (Insights Block) */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[340px]">
              <div className="bg-surface border border-border pt-6 px-6 pb-0 rounded-[32px] shadow-sm flex flex-col h-1/2 overflow-hidden">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <Activity className="text-primary" size={16} />
                       <div className="flex items-center gap-2 group/tooltip relative">
                          <h4 className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Stress Index</h4>
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">84.2</span>
                       </div>
                    </div>
                    <div className="flex gap-1">
                       {[1,2,3].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i <= 2 ? 'bg-primary' : 'bg-border'}`}></div>)}
                    </div>
                 </div>

                 {/* Detailed Sub-metrics */}
                 <div className="grid grid-cols-3 gap-2 mb-6">
                    {[
                       { label: 'Weather', val: 'Low', color: 'text-primary' },
                       { label: 'Ports', val: 'High', color: 'text-accent' },
                       { label: 'Geo', val: 'Med', color: 'text-amber-500' }
                    ].map(m => (
                       <div key={m.label} className="bg-surface-high/50 p-2 rounded-xl border border-border/50 text-center">
                          <div className="text-[8px] font-black text-text-muted uppercase tracking-tighter mb-0.5">{m.label}</div>
                          <div className={`text-[10px] font-bold ${m.color}`}>{m.val}</div>
                       </div>
                    ))}
                 </div>

                 <div className="flex-1 min-h-[80px] -mx-6 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={summary?.trendData || []} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                             <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="risk" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="bg-surface border border-border p-6 rounded-[32px] shadow-sm flex flex-col h-1/2">
                 <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="text-text-muted" size={16} />
                    <h4 className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Regional Impact</h4>
                 </div>
                 <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
                    {['Shanghai Hub', 'Rotterdam Port', 'LA Corridor'].map((region, i) => (
                       <div key={region} className="group cursor-pointer">
                          <div className="flex justify-between text-[10px] font-bold text-foreground mb-1.5">
                             <span>{region}</span>
                             <span className="text-text-muted font-black">L{(i % 2) + 1}</span>
                          </div>
                          <div className="h-1 bg-surface-high rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${60 - (i * 15)}%` }}
                                className={`h-full ${i === 0 ? "bg-accent" : "bg-primary"}`}
                             />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Tactical Recommendations & Signals */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface border border-border p-10 rounded-[32px] shadow-sm flex flex-col gap-8">
                 <div className="flex items-center gap-3">
                    <Zap className="text-blue-500" size={18} />
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em]">Tactical Recommendations</h4>
                 </div>
                 <div className="flex flex-col gap-4">
                    {recommendations.map((action, i) => (
                       <div key={action.id} className="group p-5 bg-surface-high/50 border border-transparent rounded-2xl flex items-center gap-5 hover:bg-surface hover:border-border hover:shadow-sm transition-all cursor-pointer">
                          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 transition-transform group-hover:scale-105">
                             {action.icon === 'RotateCcw' ? <RotateCcw size={18} /> : action.icon === 'ShieldAlert' ? <ShieldAlert size={18} /> : <Clock size={18} />}
                          </div>
                          <div className="flex-1">
                             <div className="text-[13px] font-bold text-foreground mb-1">{action.title}</div>
                             <div className="text-[11px] text-text-secondary font-medium leading-relaxed">{action.desc}</div>
                          </div>
                          <ChevronRight size={14} className="text-text-muted group-hover:text-blue-500 transition-colors" />
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-surface border border-border p-10 rounded-[32px] shadow-sm flex flex-col gap-8">
                 <div className="flex items-center gap-3">
                    <AlertTriangle className="text-rose-500" size={18} />
                    <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em]">Signal Matrix</h4>
                 </div>
                 <div className="flex flex-col gap-7 overflow-y-auto max-h-[300px] no-scrollbar pr-2">
                    {[
                      { time: "2m ago", msg: "High swell detected in North Sea Corridor", color: "bg-rose-500" },
                      { time: "18m ago", msg: "Port of Singapore increases transit fee 12%", color: "bg-blue-500" },
                      { time: "1h ago", msg: "Shanghai Hub throughput exceeds 92%", color: "bg-amber-500" }
                    ].map((alert, i) => (
                       <div key={i} className="flex gap-5 items-start relative group">
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${alert.color} ring-4 ring-surface`}></div>
                          <div className="flex-1">
                             <div className="text-[14px] font-bold text-foreground leading-snug mb-1.5">{alert.msg}</div>
                             <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">{alert.time}</div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* ─── Right: Navi Intelligence Panel ─── */}
        <div className="lg:col-span-4 h-full">
           <div className="sticky top-28 flex flex-col h-[calc(100vh-140px)]">

             {/* ── Navi Header ── */}
             <div className="bg-surface border border-border rounded-[32px] p-6 mb-6 shadow-sm relative overflow-hidden">
               <div className="relative flex items-center justify-between z-10">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                     <img src="/logo.png" alt="Navi AI" className="w-7 h-7 object-contain" />
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                       <h3 className="text-lg font-bold tracking-tight text-foreground">Navi AI</h3>
                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                     </div>
                     <div className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1">Autonomous Agent</div>
                   </div>
                 </div>
                 <button
                    onClick={loadNaviDemo}
                    disabled={naviLoading}
                    className="p-3 bg-surface-high border border-border text-text-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    title="Simulate Event"
                  >
                    <CloudLightning size={18} />
                  </button>
               </div>
             </div>

             {/* ── Pipeline Status ── */}
             {naviPipeline.length > 0 && (
               <div className="bg-surface-high/50 border border-border rounded-2xl px-5 py-4 mb-6 flex items-center gap-3 overflow-x-auto no-scrollbar">
                 {naviPipeline.map((step, i) => (
                   <div key={step.agent} className="flex items-center gap-2 shrink-0">
                     <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] ${
                       step.status === 'complete' ? 'bg-blue-600 text-white' :
                       step.status === 'running' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                       'bg-surface-highest text-text-muted'
                     }`}>
                       {step.status === 'complete' ? <CheckCircle2 size={10} /> : i+1}
                     </div>
                     <span className={`text-[9px] font-bold uppercase tracking-wider ${step.status === 'complete' || step.status === 'running' ? 'text-foreground' : 'text-text-muted'}`}>{step.agent.split(' ')[0]}</span>
                   </div>
                 ))}
               </div>
             )}

             {/* ── Chat Content ── */}
             <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 pr-1 pb-4">

               {naviHistory.length === 0 && (
                 <div className="flex-1 flex flex-col items-center justify-center py-10 px-8 text-center">
                   <div className="w-20 h-20 rounded-[40px] bg-surface-high flex items-center justify-center mb-8 border border-border">
                     <img src="/logo.png" alt="Navi AI" className="w-12 h-12 object-contain opacity-30" />
                   </div>
                   <h4 className="text-lg font-bold text-foreground mb-3">Intelligence Hub</h4>
                   <p className="text-[13px] text-text-muted leading-relaxed font-medium">Navi is processing real-time logistics signals. Inquire about network stress or route efficiency.</p>
                 </div>
               )}

               {naviHistory.map((entry) => (
                 <div key={entry.id} className="flex flex-col gap-4">
                   <div className="flex justify-end">
                     <div className="max-w-[85%] bg-gray-900 dark:bg-primary text-white rounded-[24px] rounded-tr-sm px-5 py-4 text-[13px] font-medium leading-relaxed shadow-sm">
                       {entry.query}
                     </div>
                   </div>

                   {entry.loading && (
                     <div className="bg-surface border border-border rounded-[24px] rounded-tl-sm p-5 shadow-sm">
                       <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest">
                         <Loader2 size={14} className="animate-spin" />
                         Analyzing Vectors...
                       </div>
                     </div>
                   )}

                   {entry.result && !entry.loading && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-[24px] rounded-tl-sm shadow-sm overflow-hidden">
                       <div className="p-6 border-b border-border-muted flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <img src="/logo.png" alt="" className="w-3.5 h-3.5 object-contain" />
                           <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Decision Intel</span>
                         </div>
                         <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20 uppercase tracking-widest">{entry.result.impactLevel}</span>
                       </div>
                       
                       <div className="p-6">
                         <p className="text-[13px] text-text-secondary leading-relaxed font-medium">
                           {entry.result.conversationalReply || entry.result.situationSummary}
                         </p>
                         
                         {entry.result.recommendations?.length > 0 && (
                            <div className="mt-6 flex flex-col gap-3">
                               {entry.result.recommendations.slice(0, 2).map((rec, i) => (
                                  <div key={i} className="p-4 bg-surface-high rounded-2xl border border-border flex gap-4 items-start">
                                     <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                                     <div className="text-[12px] font-bold text-foreground leading-tight">{rec.action}</div>
                                  </div>
                               ))}
                            </div>
                         )}
                       </div>
                     </motion.div>
                   )}
                 </div>
               ))}
               <div ref={naviEndRef} />
             </div>

             {/* ── Input ── */}
             <div className="mt-4">
               <form onSubmit={handleNaviQuery} className="relative group">
                 <input
                   value={naviQuery}
                   onChange={e => setNaviQuery(e.target.value)}
                   placeholder="Consult Navi Intelligence..."
                   disabled={naviLoading}
                   className="w-full bg-surface border border-border rounded-[28px] pl-6 pr-14 py-5 text-[13px] text-foreground placeholder:text-text-muted focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                 />
                 <button
                   type="submit"
                   disabled={naviLoading || !naviQuery.trim()}
                   className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                 >
                   {naviLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
                 </button>
               </form>
             </div>
            </div>
         </div>
      </div>
    </div>
  );
}
