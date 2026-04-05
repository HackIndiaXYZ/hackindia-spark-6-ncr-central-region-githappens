'use client';
import { useState } from 'react';
import { 
  Zap, MapPin, Ship, Plane, Train, 
  Search, ShieldAlert, BarChart3, ChevronRight, 
  AlertTriangle, Check, IndianRupee, Clock, Layers, Bot
} from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function SimulationPage() {
  const [params, setParams] = useState({
    origin: 'Shanghai Hub',
    destination: 'Long Beach Terminal',
    transport: 'sea',
    budget: 65,
    risk: 30,
    time: 80
  });
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const runSimulation = async () => {
    setSimulating(true);
    setResults(null);
    
    try {
      // Map frontend params to backend expected fields
      const data = await api.runSimulation({
        supplierLocation: params.origin,
        destination: params.destination,
        transportType: params.transport,
        budgetMode: params.budget,
        riskTolerance: params.risk,
        timeSensitivity: params.time
      });
      
      const formatCurrency = (val) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
        return `₹${val.toLocaleString('en-IN')}`;
      };

      // Transform backend results to UI format
      const formattedResults = [
        {
          id: 'A',
          name: 'Primary Path (Calculated)',
          desc: `Direct ${params.transport} route from ${params.origin} to ${params.destination}.`,
          cost: formatCurrency(data.results.costEstimate),
          time: `${data.results.estimatedTransitDays} Days`,
          risk: data.results.delayProbability,
          severity: data.results.riskLevel.toLowerCase() === 'high' ? 'high' : 'low',
          recommended: data.results.riskLevel.toLowerCase() !== 'high',
          details: {
            delayDays: data.results.estimatedDelayDays,
            disruptionCost: formatCurrency(data.results.costWithDisruption),
            impactPercent: data.results.costImpactPercent,
            riskLevel: data.results.riskLevel
          }
        },
        ...data.alternatives.map((alt, i) => ({
          id: String.fromCharCode(66 + i),
          name: alt.description,
          desc: `Alternative mode identified by AI to mitigate detected ${data.results.riskLevel} risk nodes.`,
          cost: formatCurrency(alt.cost),
          time: `${alt.transitDays} Days`,
          risk: alt.delayProbability,
          severity: parseInt(alt.delayProbability) > 30 ? 'high' : 'minimal',
          recommended: i === 0 && data.results.riskLevel.toLowerCase() === 'high',
          details: {
            delayDays: Math.floor(parseInt(alt.transitDays) * 0.1),
            disruptionCost: formatCurrency(alt.cost * 1.1),
            impactPercent: '10%',
            riskLevel: parseInt(alt.delayProbability) > 30 ? 'High' : 'Low'
          }
        }))
      ];
      
      setResults(formattedResults);
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] animate-in overflow-hidden relative">
       <div className="pb-4 border-b border-[var(--border-muted)] flex items-center justify-between px-2">
          <div>
             <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)] mb-2">Simulation Engine</h1>
             <p className="text-[var(--text-muted)] text-[10px] font-black tracking-[0.3em] uppercase opacity-60">What-If Logistic Modeling Matrix</p>
          </div>
          <div className="flex items-center gap-4 text-[var(--text-muted)] font-black text-[9px] uppercase tracking-widest bg-[var(--surface-high)] border border-[var(--border-muted)] px-5 py-2.5 rounded-2xl group shadow-sm">
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] animate-pulse shadow-[0_0_10px_rgba(var(--secondary-rgb),0.5)]"></span>
             <span className="opacity-70">Simulation Node: ACTIVE</span>
          </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full mt-6 min-h-0 overflow-hidden pb-4">
        
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-4 flex flex-col gap-4">
           <div className="bg-surface-high/50 backdrop-blur-xl border border-border p-6 rounded-3xl flex flex-col gap-5 shadow-sm relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
              
              <div className="grid grid-cols-1 gap-6">
                 <div>
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block pl-1 opacity-60">Origin Node</label>
                    <div className="flex items-center bg-surface border border-border rounded-xl p-3 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
                       <MapPin size={16} className="text-primary mr-3 opacity-80" />
                       <input 
                         type="text" 
                         value={params.origin} 
                         onChange={(e) => setParams({...params, origin: e.target.value})}
                         className="bg-transparent border-none outline-none text-foreground text-xs font-bold w-full" 
                       />
                    </div>
                 </div>
                 <div>
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block pl-1 opacity-60">Destination Node</label>
                    <div className="flex items-center bg-surface border border-border rounded-xl p-3 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
                       <MapPin size={16} className="text-secondary mr-3 opacity-80" />
                       <input 
                         type="text" 
                         value={params.destination} 
                         onChange={(e) => setParams({...params, destination: e.target.value})}
                         className="bg-transparent border-none outline-none text-foreground text-xs font-bold w-full" 
                       />
                    </div>
                 </div>
                 <div>
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 block pl-1 opacity-60">Transport Vector</label>
                    <div className="grid grid-cols-3 gap-2">
                       {[
                         { id: 'sea', icon: Ship, label: 'Sea' },
                         { id: 'air', icon: Plane, label: 'Air' },
                         { id: 'road', icon: Train, label: 'Road' }
                       ].map(mode => (
                         <button 
                           key={mode.id}
                           onClick={() => setParams({...params, transport: mode.id})}
                           className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all shadow-sm ${params.transport === mode.id ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-text-muted hover:text-foreground hover:border-primary/20'}`}
                         >
                            <mode.icon size={16} />
                            <span className="text-[8px] font-black uppercase tracking-widest">{mode.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-5 mt-auto">
                 {[
                   { label: 'Budget Ceiling', key: 'budget', value: `${params.budget}%` },
                   { label: 'Risk Tolerance', key: 'risk', value: `${params.risk}%` },
                   { label: 'Time Sensitivity', key: 'time', value: `${params.time}%` }
                 ].map(slider => (
                   <div key={slider.key}>
                      <div className="flex justify-between text-[9px] font-black text-foreground mb-2 px-1">
                         <span className="uppercase tracking-[0.15em] opacity-60">{slider.label}</span>
                         <span className="text-primary">{slider.value}</span>
                      </div>
                      <div className="relative h-1 bg-border rounded-full shadow-inner">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={params[slider.key]} 
                          onChange={(e) => setParams({...params, [slider.key]: parseInt(e.target.value)})}
                          className="absolute inset-0 w-full h-full bg-transparent appearance-none accent-primary cursor-pointer z-10" 
                        />
                        <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: slider.value }}></div>
                      </div>
                   </div>
                 ))}
              </div>

              <button 
                onClick={runSimulation}
                disabled={simulating}
                className="w-full py-4 bg-primary text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40 mt-2 shadow-[0_10px_20px_rgba(0,218,243,0.2)] flex items-center justify-center gap-3 group"
              >
                 {simulating ? (
                    <>
                       <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                       <span>Synthesizing Model...</span>
                    </>
                 ) : (
                    <>
                       <Zap size={18} fill="currentColor" className="group-hover:rotate-12 transition-transform" />
                       <span>Initialize Matrix</span>
                    </>
                 )}
              </button>
           </div>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-8 overflow-y-auto no-scrollbar scroll-smooth">
           <AnimatePresence mode="wait">
              {simulating ? (
                 <motion.div 
                   key="loading"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.05 }}
                   className="h-full bg-surface border border-border rounded-[40px] flex flex-col items-center justify-center p-12 overflow-hidden relative shadow-inner"
                 >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,218,243,0.03)_0%,transparent_70%)] animate-pulse"></div>
                    <Bot size={64} className="text-primary mb-8 animate-bounce opacity-40" />
                    <h3 className="text-2xl font-black tracking-tighter text-foreground mb-4">Neural Signal Synthesis</h3>
                    <div className="flex flex-col gap-3 w-full max-w-sm px-4">
                       <div className="h-1.5 bg-surface-high border border-border rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "100%" }}
                             transition={{ duration: 2, repeat: Infinity }}
                             className="h-full bg-primary"
                          ></motion.div>
                       </div>
                       <div className="flex justify-between text-[10px] font-black text-text-muted uppercase tracking-[0.3em] pt-1 opacity-40">
                          <span>Modeling Port Congestion</span>
                          <span className="animate-pulse">Active Subroutine</span>
                       </div>
                    </div>
                 </motion.div>
              ) : results ? (
                 <motion.div 
                   key="results"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex flex-col gap-4 pb-6"
                 >
                    <div className="grid grid-cols-1 gap-4">
                       {results.map((route, i) => (
                          <motion.div 
                            key={route.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group bg-surface p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden shadow-sm ${route.recommended ? 'border-primary ring-1 ring-primary/20 shadow-[0_10px_50px_rgba(0,218,243,0.05)]' : 'border-border hover:border-primary/20 hover:shadow-md'}`}
                          >
                             {route.recommended && (
                                <div className="absolute top-0 right-0 px-6 py-2.5 bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-3xl shadow-sm">
                                   Recommended Vector
                                </div>
                             )}

                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 relative z-10">
                                <div className="max-w-md">
                                   <div className="flex items-center gap-2 mb-2">
                                      {route.severity === 'high' ? <AlertTriangle size={18} className="text-secondary" /> : <Layers size={18} className={route.recommended ? 'text-primary' : 'text-text-muted'} />}
                                      <h3 className="text-xl font-black tracking-tighter text-foreground">{route.name}</h3>
                                   </div>
                                   <p className="text-text-muted text-xs font-medium leading-relaxed opacity-80">{route.desc}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                   <button 
                                     onClick={() => setSelectedRoute(route)}
                                     className={`px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-sm ${route.recommended ? 'bg-primary text-black hover:scale-105 active:scale-95' : 'bg-surface-high text-text-muted border border-border hover:text-foreground hover:bg-surface'}`}
                                   >
                                      {route.recommended ? 'Deep Analysis' : 'Details'}
                                   </button>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
                                {[
                                   { label: 'Estimated Cost', value: route.cost, icon: IndianRupee, color: 'text-secondary' },
                                   { label: 'Transit Time', value: route.time, icon: Clock, color: 'text-primary' },
                                   { label: 'Disruption Risk', value: route.risk, icon: AlertTriangle, color: route.severity === 'high' ? 'text-accent' : 'text-text-muted' },
                                   { label: 'Confidence Score', value: '94.2%', icon: BarChart3, color: 'text-text-muted' }
                                ].map((item) => (
                                   <div key={item.label} className="p-4 bg-surface-high/50 backdrop-blur-sm rounded-2xl border border-border group-hover:border-primary/10 transition-colors shadow-sm">
                                      <div className="flex flex-col gap-1.5">
                                         <item.icon size={12} className={item.color} />
                                         <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.1em] opacity-60">{item.label}</span>
                                         <span className={`text-base font-black tracking-tight ${item.color === 'text-text-muted' ? 'text-foreground' : item.color}`}>{item.value}</span>
                                      </div>
                                   </div>
                                ))}
                             </div>
                             
                             {/* Decorative Background Blob */}
                             <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-[0.03] transition-all group-hover:opacity-[0.08] ${route.recommended ? 'bg-primary' : 'bg-foreground'}`}></div>
                          </motion.div>
                       ))}
                    </div>
                 </motion.div>
              ) : (
                 <motion.div 
                   key="empty"
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="h-full bg-surface-high/30 border-2 border-dashed border-border rounded-[40px] flex flex-col items-center justify-center p-12 text-center shadow-inner"
                 >
                    <div className="p-12 border border-border bg-surface/50 rounded-full mb-10 shadow-sm">
                       <Zap size={48} className="text-text-muted opacity-20" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter text-foreground mb-3">Simulation Standby</h3>
                    <p className="text-sm font-bold max-w-sm text-text-muted opacity-40 uppercase tracking-widest leading-loose">Neural engines ready.<br/>Define origin and transit vectors to initialize the simulation matrix.</p>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>


      </div>

      {/* Deep Analysis Modal */}
      <AnimatePresence>
        {selectedRoute && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoute(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-surface border border-border rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Modal Left: Narrative */}
              <div className="flex-1 p-10 flex flex-col gap-8 bg-surface-high/30">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter text-foreground">Strategic Analysis</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted opacity-60">Route Identifier: {selectedRoute.id}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-3">Executive Summary</h4>
                    <p className="text-sm font-medium leading-relaxed opacity-80 text-foreground">
                      This {selectedRoute.name} model predicts a core transit efficiency of {selectedRoute.time} with a {selectedRoute.risk} probability of external disruption. 
                      Our neural engine identifies this as a <span className={`font-black ${selectedRoute.severity === 'high' ? 'text-secondary' : 'text-primary'}`}>{selectedRoute.details.riskLevel} Risk</span> vector based on the simulated parameters.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-surface border border-border rounded-3xl flex flex-col gap-2">
                       <IndianRupee size={14} className="text-secondary" />
                       <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Base Operational Cost</span>
                       <span className="text-xl font-bold">{selectedRoute.cost}</span>
                    </div>
                    <div className={`p-6 bg-surface border rounded-3xl flex flex-col gap-2 ${selectedRoute.severity === 'high' ? 'border-secondary/30' : 'border-primary/30'}`}>
                       <AlertTriangle size={14} className={selectedRoute.severity === 'high' ? 'text-secondary' : 'text-primary'} />
                       <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Post-Disruption Est.</span>
                       <span className={`text-xl font-bold ${selectedRoute.severity === 'high' ? 'text-secondary' : 'text-primary'}`}>{selectedRoute.details.disruptionCost}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-primary text-black rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-white transition-colors">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60 italic mb-1">AI Tactical Directive</div>
                      <div className="text-xs font-bold leading-snug">
                        {selectedRoute.recommended 
                          ? "Initiate logistics immediately. Current risk-cost ratio is optimal for identified budget ceiling." 
                          : "Monitor alternative vectors. Potential congestion at destination nodes exceeds identified risk tolerance."}
                      </div>
                    </div>
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Modal Right: Technical Breakdown */}
              <div className="w-full md:w-80 bg-surface border-l border-border p-10 flex flex-col gap-8">
                <div>
                   <h4 className="text-[11px] font-black uppercase tracking-widest text-text-muted mb-6">Simulation Metrics</h4>
                   <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-end mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Disruption Buffer</span>
                            <span className="text-xs font-bold text-foreground">+{selectedRoute.details.delayDays} Days</span>
                         </div>
                         <div className="h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: selectedRoute.risk }}></div>
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-end mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Cost Deviation</span>
                            <span className="text-xs font-bold text-foreground">{selectedRoute.details.impactPercent}</span>
                         </div>
                         <div className="h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: selectedRoute.details.impactPercent }}></div>
                         </div>
                      </div>

                      <div className="flex flex-col gap-2">
                         <div className="flex justify-between items-end mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Node Confidence</span>
                            <span className="text-xs font-bold text-foreground">94.2%</span>
                         </div>
                         <div className="h-1 bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-foreground/20" style={{ width: '94.2%' }}></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="mt-auto">
                   <button 
                     onClick={() => setSelectedRoute(null)}
                     className="w-full py-4 border border-border hover:bg-surface-high rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all mb-4"
                   >
                     Close Analysis
                   </button>
                   <button 
                     onClick={() => setSelectedRoute(null)}
                     className="w-full py-4 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl"
                   >
                     Initiate Path
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
