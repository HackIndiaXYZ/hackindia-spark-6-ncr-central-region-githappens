'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// ─── ATMOSPHERIC SIGNAL CLUSTERS ───
const SignalClusters = () => {
  const [points, setPoints] = useState([]);
  
  useEffect(() => {
    const newPoints = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setPoints(newPoints);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {points.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            x: [`${p.x}%`, `${p.x + (Math.random() * 5 - 2.5)}%`],
            y: [`${p.y}%`, `${p.y + (Math.random() * 5 - 2.5)}%`]
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          style={{ width: p.size, height: p.size }}
          className="absolute bg-[#00daf3] rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

// ─── HERO CARD COMPONENT ───
const HeroCard = ({ src, alt, title, subtitle, className, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8, y: 30 }}
    animate={{ 
      opacity: 1, 
      scale: 1, 
      y: [0, -10, 0],
      transition: { 
        opacity: { duration: 1, delay },
        scale: { duration: 1, delay },
        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }
      }
    }}
    whileHover={{ scale: 1.1, zIndex: 50 }}
    className={`absolute group cursor-pointer z-30 ${className}`}
  >
    <div className="relative overflow-hidden rounded-[24px] bg-black/60 border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] backdrop-blur-3xl transition-all duration-500 group-hover:border-[#00daf3]/50 group-hover:shadow-[0_20px_60px_rgba(0,218,243,0.2)]">
      <div className="relative w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
        <Image 
          src={src} 
          alt={alt} 
          fill 
          className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 saturate-0 group-hover:saturate-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-left">
           <div className="text-[6px] font-black tracking-widest uppercase text-[#00daf3] mb-1">{subtitle}</div>
           <h3 className="text-[10px] font-black tracking-tight uppercase text-white leading-none">{title}</h3>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090b0d] text-white selection:bg-[#00daf3]/30 overflow-hidden font-sans relative">
      <SignalClusters />
      
      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 backdrop-blur-md bg-black/40 border-b border-white/5 transition-all duration-500 hover:bg-black/60">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#00daf3]/50 transition-all duration-500">
            <Image src="/logo.png" alt="SupplyAlert Logo" width={28} height={28} className="object-contain" />
          </div>
          <span className="font-bold text-xl tracking-tighter uppercase text-white group-hover:text-[#00daf3] transition-colors duration-500">Supply<span className="text-[#00daf3] italic font-light">Alert</span></span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">
          <Link href="/vision" className="text-white hover:tracking-[0.3em] transition-all duration-300">Vision</Link>
          <Link href="/dashboard/advisor" className="hover:text-white hover:tracking-[0.3em] transition-all duration-300">Intelligence</Link>
          <Link href="/dashboard/simulation" className="hover:text-white hover:tracking-[0.3em] transition-all duration-300">Simulation</Link>
          <Link href="/login" className="hover:text-[#00daf3] hover:tracking-[0.3em] transition-all duration-300 border-b border-[#00daf3]/40 pb-1">Login</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-[#00daf3] text-[#00363d] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,218,243,0.3)]">
            Launch Platform
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <main className="pt-24 pb-10 relative z-10 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="px-3 py-1 rounded-full border border-[#00daf3]/30 bg-[#00daf3]/5 text-[9px] font-black uppercase tracking-[0.3em] text-[#00daf3] animate-pulse">
                Navi Intelligence v4.0
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Global Status: Optimal</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8 uppercase italic"
            >
              Predict.<br/>
              Simulate.<br/>
              <span className="text-[#00daf3] not-italic">Secure.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-lg md:text-xl text-white/30 max-w-lg font-medium leading-relaxed tracking-tight mb-8"
            >
              The world's first AI-driven supply chain resilience terminal. Total operational awareness from node to destination.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex items-center gap-6"
            >
              <Link href="/dashboard" className="group flex items-center gap-4 px-8 py-4 rounded-full bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-[#00daf3] hover:text-[#00363d] transition-all">
                Access Terminal
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/vision" className="text-xs font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors border-b border-white/10 pb-1">
                Explore Vision
              </Link>
            </motion.div>
          </div>

          {/* ─── VISUAL STACK ─── */}
          <div className="relative h-[500px] hidden lg:block">
            <HeroCard 
              src="/vision/ship.png" 
              alt="Global Fleet" 
              title="Global Fleet" 
              subtitle="Asset Tracking" 
              className="top-10 right-0 scale-90" 
              delay={0.2}
            />
            <HeroCard 
              src="/vision/map.png" 
              alt="Topology Hub" 
              title="Topology Hub" 
              subtitle="Live Intel" 
              className="top-[35%] right-[25%] scale-90" 
              delay={0.5}
            />
            <HeroCard 
              src="/vision/port.png" 
              alt="Digital Port" 
              title="Digital Port" 
              subtitle="Terminal Automation" 
              className="bottom-10 right-[5%] scale-90" 
              delay={0.8}
            />
            
            {/* Geometric Accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[#00daf3]/10 rounded-full pointer-events-none animate-spin-slow"></div>
          </div>
        </div>
      </main>

      {/* ─── FOOTER DECOR ─── */}
      <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-between items-end pointer-events-none z-0 opacity-10">
        <div className="text-[80px] font-black tracking-tighter leading-none select-none italic uppercase">
          TERMINAL
        </div>
        <div className="text-[80px] font-black tracking-tighter leading-none select-none italic uppercase">
          SUPPLYALERT
        </div>
      </div>
    </div>
  );
}
