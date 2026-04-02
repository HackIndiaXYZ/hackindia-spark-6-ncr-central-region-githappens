'use client';
import { useState } from 'react';
import { 
  Zap, MapPin, Ship, Plane, Train, 
  Search, ShieldAlert, BarChart3, ChevronRight, 
  AlertTriangle, Check, IndianRupee, Clock, Layers, Bot
} from 'lucide-react';
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

  const runSimulation = async () => {
    setSimulating(true);
    setResults(null);
    
    try {
      // Map frontend params to backend expected fields
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierLocation: params.origin,
          destination: params.destination,
          transportType: params.transport,
          budgetMode: params.budget,
          riskTolerance: params.risk,
          timeSensitivity: params.time
        })
      });
      const data = await res.json();
      
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
          recommended: data.results.riskLevel.toLowerCase() !== 'high'
        },
        ...data.alternatives.map((alt, i) => ({
          id: String.fromCharCode(66 + i),
          name: alt.description,
          desc: `Alternative mode identified by AI to mitigate detected ${data.results.riskLevel} risk nodes.`,
          cost: formatCurrency(alt.cost),
          time: `${alt.transitDays} Days`,
          risk: alt.delayProbability,
          severity: parseInt(alt.delayProbability) > 30 ? 'high' : 'minimal',
          recommended: i === 0 && data.results.riskLevel.toLowerCase() === 'high'
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
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in">
       <div className="pb-8 border-b border-[var(--border-muted)] flex items-center justify-between">
          <div>
             <h1 className="text-3xl font-black tracking-tighter text-[var(--text-primary)] mb-2">Simulation Engine</h1>
             <p className="text-[var(--text-muted)] text-xs font-bold tracking-[0.2em] uppercase">What-If Logistic Modeling Matrix</p>
          </div>
          <div className="flex items-center gap-4 text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-widest bg-[var(--surface)] border border-[var(--border-muted)] px-4 py-2 rounded-2xl group">
             <span className="w-2 h-2 rounded-full bg-[var(--secondary)] mb-0.5 animate-pulse"></span>
             <span>Simulation Node: READY</span>
          </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full mt-12 min-h-0 overflow-y-auto no-scrollbar">
        
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-[#0E141A] border border-white/5 p-8 rounded-[32px] flex flex-col gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="grid grid-cols-1 gap-6">
                 <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block pl-1">Origin Node</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-4 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                       <MapPin size={18} className="text-primary mr-3" />
                       <input 
                         type="text" 
                         value={params.origin} 
                         onChange={(e) => setParams({...params, origin: e.target.value})}
                         className="bg-transparent border-none outline-none text-white text-sm font-medium w-full" 
                       />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block pl-1">Destination Node</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl p-4 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                       <MapPin size={18} className="text-secondary mr-3" />
                       <input 
                         type="text" 
                         value={params.destination} 
                         onChange={(e) => setParams({...params, destination: e.target.value})}
                         className="bg-transparent border-none outline-none text-white text-sm font-medium w-full" 
                       />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 block pl-1">Transport Vector</label>
                    <div className="grid grid-cols-3 gap-2">
                       {[
                         { id: 'sea', icon: Ship, label: 'Sea' },
                         { id: 'air', icon: Plane, label: 'Air' },
                         { id: 'road', icon: Train, label: 'Road' }
                       ].map(mode => (
                         <button 
                           key={mode.id}
                           onClick={() => setParams({...params, transport: mode.id})}
                           className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${params.transport === mode.id ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,218,243,0.1)] text-primary' : 'bg-black/20 border-white/5 text-white/20 hover:text-white hover:border-white/20'}`}
                         >
                            <mode.icon size={20} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{mode.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                 {[
                   { label: 'Budget Ceiling', key: 'budget', value: `${params.budget}%` },
                   { label: 'Risk Tolerance', key: 'risk', value: `${params.risk}%` },
                   { label: 'Time Sensitivity', key: 'time', value: `${params.time}%` }
                 ].map(slider => (
                   <div key={slider.key}>
                      <div className="flex justify-between text-[10px] font-black text-white mb-3 px-1">
                         <span className="uppercase tracking-widest">{slider.label}</span>
                         <span className="text-primary">{slider.value}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={params[slider.key]} 
                        onChange={(e) => setParams({...params, [slider.key]: parseInt(e.target.value)})}
                        className="w-full h-1 bg-white/5 rounded-full appearance-none accent-primary cursor-pointer" 
                      />
                   </div>
                 ))}
              </div>

              <button 
                onClick={runSimulation}
                disabled={simulating}
                className="w-full py-5 bg-primary text-black rounded-[24px] font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-40 disabled:scale-100 mt-6 shadow-[0_0_40px_rgba(0,218,243,0.3)] flex items-center justify-center gap-4"
              >
                 {simulating ? (
                    <>
                       <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                       <span>Processing Model...</span>
                    </>
                 ) : (
                    <>
                       <Zap size={20} fill="currentColor" />
                       <span>Run Simulation</span>
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
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="h-full bg-[#0E141A]/40 border border-white/5 rounded-[40px] flex flex-col items-center justify-center p-12 overflow-hidden relative"
                 >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,218,243,0.05)_0%,transparent_70%)] animate-pulse"></div>
                    <Bot size={64} className="text-primary mb-8 animate-bounce opacity-40" />
                    <h3 className="text-2xl font-black tracking-tight text-white mb-4">Neural Signal Synthesis</h3>
                    <div className="flex flex-col gap-2 w-full max-w-sm">
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: "100%" }}
                             transition={{ duration: 2 }}
                             className="h-full bg-primary"
                          ></motion.div>
                       </div>
                       <div className="flex justify-between text-[10px] font-black text-white/20 uppercase tracking-[0.2em] pt-1">
                          <span>Modeling Port Congestion</span>
                          <span>76% Complete</span>
                       </div>
                    </div>
                 </motion.div>
              ) : results ? (
                 <motion.div 
                   key="results"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex flex-col gap-8 pb-12"
                 >
                    <div className="grid grid-cols-1 gap-6">
                       {results.map((route, i) => (
                          <motion.div 
                            key={route.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`group bg-[var(--surface)] p-8 rounded-[40px] border transition-all duration-500 relative overflow-hidden ${route.recommended ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]/20 shadow-[0_0_40px_var(--primary-glow)]' : 'border-[var(--border-muted)] hover:border-[var(--border)]'}`}
                          >
                             {route.recommended && (
                                <div className="absolute top-0 right-0 px-6 py-2 bg-[var(--primary)] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl">
                                   Recommended Route
                                </div>
                             )}

                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 relative z-10">
                                <div className="max-w-md">
                                   <div className="flex items-center gap-3 mb-2">
                                      {route.severity === 'high' ? <AlertTriangle className="text-[var(--accent)]" /> : <ShieldAlert className={route.recommended ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'} />}
                                      <h3 className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">{route.name}</h3>
                                   </div>
                                   <p className="text-[var(--text-muted)] text-sm leading-relaxed">{route.desc}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                   <button className={`px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${route.recommended ? 'bg-[var(--primary)] text-black shadow-[0_0_30px_var(--primary-glow)] hover:scale-105' : 'bg-[var(--surface-high)] text-[var(--text-muted)] border border-[var(--border-muted)] hover:bg-[var(--surface-high)]/80'}`}>
                                      {route.recommended ? 'Initiate Logistics' : 'View Full Matrix'}
                                   </button>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                                {[
                                   { label: 'Estimated Cost', value: route.cost, icon: IndianRupee, color: 'text-[var(--secondary)]' },
                                   { label: 'Transit Time', value: route.time, icon: Clock, color: 'text-[var(--primary)]' },
                                   { label: 'Disruption Risk', value: route.risk, icon: AlertTriangle, color: route.severity === 'high' ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]' },
                                   { label: 'Confidence Score', value: '94.2%', icon: BarChart3, color: 'text-[var(--text-muted)]' }
                                ].map((item) => (
                                   <div key={item.label} className="p-4 bg-black/40 rounded-3xl border border-[var(--border-muted)] group-hover:border-[var(--border)] transition-colors">
                                      <div className="flex flex-col gap-2">
                                         <item.icon size={14} className={item.color} />
                                         <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.1em]">{item.label}</span>
                                         <span className={`text-lg font-black tracking-tight ${item.color.includes('var(--text-muted)') ? 'text-[var(--text-primary)]' : item.color}`}>{item.value}</span>
                                      </div>
                                   </div>
                                ))}
                             </div>
                             
                             {/* Decorative Background Blob */}
                             <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20 transition-all ${route.recommended ? 'bg-primary' : 'bg-white/5 group-hover:bg-white/10'}`}></div>
                          </motion.div>
                       ))}
                    </div>
                 </motion.div>
              ) : (
                 <motion.div 
                   key="empty"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="h-full bg-[#0E141A]/40 border border-white/5 rounded-[40px] flex flex-col items-center justify-center p-12 opacity-30 text-center"
                 >
                    <div className="p-10 border-2 border-dashed border-white/5 rounded-full mb-8">
                       <Zap size={64} className="text-white/20" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-white mb-2">Simulation Standby</h3>
                    <p className="text-sm font-medium max-w-sm text-center">Neural engines ready. Define origin and transit vectors to initialize the simulation matrix.</p>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
