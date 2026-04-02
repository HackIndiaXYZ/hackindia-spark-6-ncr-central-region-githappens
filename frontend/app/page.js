'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldAlert, Globe, Activity, ArrowRight, Zap, Combine, BarChart3, Fingerprint } from 'lucide-react';
import { useRef } from 'react';

export default function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-white overflow-hidden font-sans">
      
      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 backdrop-blur-md bg-black/80 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="SupplyAlert Logo" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-headline font-black text-xl tracking-tighter uppercase text-white">Supply<span className="text-primary italic font-light">Alert</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#vision" className="hover:text-white transition-colors">Vision</a>
          <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
          <a href="#simulation" className="hover:text-white transition-colors">Simulation</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-transform">
            Launch Platform
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section ref={targetRef} className="relative pt-40 pb-32 px-8 min-h-screen flex flex-col items-center justify-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-secondary/20 blur-[100px] rounded-full pointer-events-none opacity-30"></div>
        
        <motion.div style={{ y: y1, opacity: opacity1 }} className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
           <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm flex items-center gap-2 text-white/80"
           >
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
             Supply Alert Engine v2.4 Live
           </motion.div>
           
           <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 font-headline bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
           >
             Logistics.<br/>
             <span className="text-primary italic font-light drop-shadow-[0_0_30px_rgba(0,218,243,0.3)]">Mastered.</span>
           </motion.h1>

           <motion.p 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg md:text-2xl text-white/50 max-w-2xl font-light leading-relaxed mb-12"
           >
             Anticipate global disruptions before they happen. Powered by advanced predictive modeling and real-time AI analytics.
           </motion.p>

           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
             className="flex flex-col sm:flex-row gap-4"
           >
             <Link href="/dashboard" className="px-8 py-4 rounded-full bg-primary text-black font-bold text-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_40px_rgba(0,218,243,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.6)]">
               Enter Command Center <ArrowRight size={20} />
             </Link>
             <a href="#vision" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center">
               Explore Vision
             </a>
           </motion.div>
        </motion.div>
      </section>

      {/* ─── METRICS SHOWCASE (REMOVED) ─── */}

      {/* ─── FEATURE GRID (APPLE-STYLE BENTOS) ─── */}
      <section id="vision" className="py-32 px-8 max-w-7xl mx-auto relative z-20">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Unrivaled <br/><span className="text-white/40">Intelligence.</span></h2>
          <p className="text-xl text-white/50 max-w-xl font-light">A unified architecture designed to obliterate supply chain blind spots from origin to destination.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Large */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="lg:col-span-2 bg-[#0E141A] rounded-[32px] p-10 border border-white/5 relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700"></div>
             <Globe className="text-primary mb-8" size={48} />
             <h3 className="text-3xl font-bold tracking-tight mb-4 text-white">Global Topology Mapping</h3>
             <p className="text-white/50 text-lg max-w-md leading-relaxed">Instantly visualize weather patterns, port congestion, and geopolitical risks directly on an interactive command map.</p>
          </motion.div>

          {/* Card 2: Tall */}
          <motion.div 
            id="intelligence"
            whileHover={{ scale: 0.98 }}
            className="scroll-mt-32 bg-[#090F15] rounded-[32px] p-10 border border-white/5 relative overflow-hidden group"
          >
             <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[60px] group-hover:bg-secondary/20 transition-all"></div>
             <Combine className="text-secondary mb-8" size={48} />
             <h3 className="text-3xl font-bold tracking-tight mb-4 text-white">Strategic AI</h3>
             <p className="text-white/50 text-lg leading-relaxed">Chat directly with the Supply Alert Engine. Ask for rerouting options and receive analyzed mandates in milliseconds.</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="bg-[#12161A] rounded-[32px] p-10 border border-white/5 relative overflow-hidden"
          >
             <Fingerprint className="text-white/20 mb-8" size={48} />
             <h3 className="text-2xl font-bold tracking-tight mb-4">Secure & Private</h3>
             <p className="text-white/50">End-to-end encrypted node communication ensuring zero data leakage.</p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
             id="simulation"
             whileHover={{ scale: 0.98 }}
            className="scroll-mt-32 lg:col-span-2 bg-gradient-to-br from-[#1C1215] to-[#0A0506] rounded-[32px] p-10 border border-accent/20 relative overflow-hidden"
          >
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,61,0,0.1)_0%,transparent_70%))]"></div>
             <Zap className="text-accent mb-8 relative z-10" size={48} />
             <h3 className="text-3xl font-bold tracking-tight mb-4 text-white relative z-10">What-If Simulation Engine</h3>
             <p className="text-white/50 text-lg max-w-md leading-relaxed relative z-10">Stress-test your supply chain. Inject artificial catastrophes into your network to evaluate financial impact before reality strikes.</p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="py-32 px-8 text-center relative z-20">
         <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Ready to take command?</h2>
         <Link href="/dashboard" className="px-10 py-5 rounded-full bg-white text-black font-black text-xl hover:scale-105 transition-transform inline-block shadow-[0_0_50px_rgba(255,255,255,0.2)]">
           Initialize Dashboard
         </Link>
      </section>

      <footer className="py-8 text-center text-white/20 text-xs font-medium border-t border-white/5">
         <p>Supply Alert © 2026. Design aesthetic generated by Antigravity AI.</p>
      </footer>
    </div>
  );
}
