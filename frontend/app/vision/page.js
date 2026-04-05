'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, X, Cpu, Globe, Database, Zap, ShieldCheck, Activity } from 'lucide-react';
import { useState } from 'react';

const VISION_DATA = [
  {
    id: 'fleet',
    src: '/vision/ship.png',
    subtitle: 'Strategic Assets',
    title: 'Global Fleet',
    detail: 'Real-time telemetry for every vessel. Monitor heading, fuel efficiency, and structural health through integrated IoT sensors.',
    icon: Globe,
    stats: { nodes: '1,240+', status: 'Operational' }
  },
  {
    id: 'topology',
    src: '/vision/map.png',
    subtitle: 'Live Intelligence',
    title: 'Topology Hub',
    detail: 'A digital twin of the global supply chain, using predictive modeling to identify bottlenecks before they manifest.',
    icon: Cpu,
    stats: { nodes: 'Global', status: 'Active Scan' }
  },
  {
    id: 'cargo',
    src: '/vision/container.png',
    subtitle: 'Sensor Network',
    title: 'Smart Cargo',
    detail: 'Granular tracking at the item level. Environmental sensors monitor temperature, vibration, and unauthorized access.',
    icon: ShieldCheck,
    stats: { nodes: '500k+', status: 'Secure' }
  },
  {
    id: 'hubs',
    src: '/vision/port.png',
    subtitle: 'Global Hubs',
    title: 'Digital Port',
    detail: 'Autonomous terminal management. Optimized berth allocation and automated container movement for zero-idle operations.',
    icon: Activity,
    stats: { nodes: '48 ports', status: 'Syncing' }
  },
  {
    id: 'vault',
    src: '/vision/warehouse.png',
    subtitle: 'Future Ready',
    title: 'The Vault',
    detail: 'Fully automated fulfillment centers. AI-driven inventory placement and robotics orchestration for 24/7 throughput.',
    icon: Database,
    stats: { nodes: 'High-Density', status: 'Optimized' }
  },
  {
    id: 'pulse',
    src: '/vision/graph.png',
    subtitle: 'Pulse Analysis',
    title: 'Stress Index',
    detail: 'Proprietary risk assessment engine. Aggregating geopolitical, weather, and labor data into a single operational score.',
    icon: Zap,
    stats: { nodes: 'Computed', status: 'High Precision' }
  }
];

// ─── VISION CARD COMPONENT ───
const VisionCard = ({ data, className, delay = 0, onSelect }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9, y: 50 }}
    animate={{ 
      opacity: 1, 
      scale: 1, 
      y: [0, -15, 0],
      transition: { 
        opacity: { duration: 1, delay },
        scale: { duration: 1, delay },
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }
      }
    }}
    whileHover={{ scale: 1.05, zIndex: 40 }}
    onClick={() => onSelect(data)}
    className={`absolute group cursor-pointer ${className}`}
  >
    <div className="relative overflow-hidden rounded-[48px] bg-black/40 border border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)] backdrop-blur-3xl transition-all duration-500 group-hover:border-[#00daf3]/30 group-hover:shadow-[0_40px_100px_rgba(0,218,243,0.15)]">
      <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px]">
        <Image 
          src={data.src} 
          alt={data.title} 
          fill 
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 saturate-50 group-hover:saturate-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-10 left-10 right-10">
           <div className="text-[10px] font-black tracking-[0.3em] uppercase text-[#00daf3] mb-2">{data.subtitle}</div>
           <h3 className="text-2xl font-black tracking-tighter uppercase text-white leading-tight">{data.title}</h3>
        </div>
        
        <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-[#00daf3] group-hover:text-[#00363d] transition-all">
           <ChevronRight size={24} />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function VisionPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#07090c] text-white selection:bg-[#00daf3]/30 overflow-hidden font-sans relative">
      
      {/* ─── ATMOSPHERIC BACKGROUND ─── */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[#00daf3]/5 blur-[200px] rounded-full pointer-events-none"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#07090c_80%)]"></div>
         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-8 pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/" className="flex items-center gap-3 group text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Return to Command</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#00daf3]">
             Vision Protocol Engaged
          </div>
        </div>
      </nav>

      {/* ─── CENTRAL CONTENT ─── */}
      <main className="relative z-10 w-full h-[150vh] flex items-center justify-center text-center">
        
        <div className="relative z-20 max-w-4xl mx-auto px-6">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           >
             <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8 uppercase italic">
               Logistics.<br/>
               <span className="text-[#00daf3] not-italic">Visualized.</span>
             </h1>
             <p className="text-xl md:text-2xl text-white/30 max-w-2xl mx-auto font-medium leading-relaxed tracking-tight">
               Every node, every route, and every disruption monitored in real-time. Experience the clarity of total operational awareness.
             </p>
           </motion.div>
        </div>

        {/* ─── FLOATING CARDS ─── */}
        <div className="absolute inset-0 pointer-events-none">
          <VisionCard data={VISION_DATA[0]} className="top-10 left-10 md:top-20 md:left-20 pointer-events-auto" delay={0.2} onSelect={setSelected} />
          <VisionCard data={VISION_DATA[1]} className="top-[-50px] right-[15%] md:top-10 md:right-[20%] pointer-events-auto" delay={0.5} onSelect={setSelected} />
          <VisionCard data={VISION_DATA[2]} className="top-[35%] left-[-5%] md:top-[40%] md:left-[5%] pointer-events-auto" delay={0.8} onSelect={setSelected} />
          <VisionCard data={VISION_DATA[3]} className="top-[30%] right-[-10%] md:top-[35%] md:right-[2%] pointer-events-auto" delay={1.1} onSelect={setSelected} />
          <VisionCard data={VISION_DATA[4]} className="bottom-10 left-10 md:bottom-20 md:left-[15%] pointer-events-auto" delay={1.4} onSelect={setSelected} />
          <VisionCard data={VISION_DATA[5]} className="bottom-[-20px] right-10 md:bottom-10 md:right-20 pointer-events-auto" delay={1.7} onSelect={setSelected} />
        </div>
      </main>

      {/* ─── TECH DETAIL OVERLAY ─── */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#12181f] border border-white/10 rounded-[60px] max-w-5xl w-full overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="w-full md:w-1/2 h-[400px] md:h-auto relative">
                 <Image src={selected.src} alt={selected.title} fill className="object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#12181f]"></div>
              </div>

              <div className="p-12 md:p-20 flex flex-col justify-center flex-1">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-[#00daf3]/10 text-[#00daf3]">
                       <selected.icon size={32} />
                    </div>
                    <div>
                       <div className="text-[10px] font-black tracking-[0.4em] uppercase text-[#00daf3]">{selected.subtitle}</div>
                       <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white">{selected.title}</h2>
                    </div>
                 </div>
                 
                 <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-medium mb-12 italic">
                    "{selected.detail}"
                 </p>

                 <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                    <div>
                       <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 block mb-2">Network Nodes</span>
                       <span className="text-2xl font-bold text-white tabular-nums">{selected.stats.nodes}</span>
                    </div>
                    <div>
                       <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 block mb-2">Current Integrity</span>
                       <span className="text-2xl font-bold text-[#00daf3]">{selected.stats.status}</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 pb-20 text-center">
         <Link href="/dashboard" className="inline-flex items-center gap-6 px-16 py-8 rounded-full bg-[#00daf3] text-[#00363d] font-black text-2xl tracking-tighter uppercase hover:scale-110 hover:shadow-[0_0_80px_rgba(0,218,243,0.4)] transition-all">
           Initialize Command Center
         </Link>
      </div>
    </div>
  );
}
