'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  LineChart, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  Search,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';



// ─── PREMIUM BROWSER DEMO CARD (BIGGER & BETTER) ───
const DemoCard = () => (
  <motion.div 
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative max-w-5xl mx-auto mt-24 z-20 group"
  >
    <div className="bg-white/5 rounded-[40px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden backdrop-blur-2xl transform transition-transform duration-700 group-hover:scale-[1.01]">
      {/* Browser Bar */}
      <div className="bg-white/5 px-8 py-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
        </div>
        <div className="bg-white/10 border border-white/5 rounded-lg px-6 py-1.5 text-[11px] font-bold text-white/40 w-1/3 text-center shadow-sm">
          supplyalert.ai/intelligence/navi
        </div>
        <div className="w-12"></div>
      </div>
      
      {/* Content */}
      <div className="p-10 md:p-14 space-y-12">
        {/* Problem Row */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-[#e11d48] font-black text-xs uppercase tracking-[0.2em]">
            <AlertTriangle size={16} />
            PROBLEM DETECTED
          </div>
          <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[32px] flex items-center justify-between gap-8 group/card">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#fecdd3] flex items-center justify-center shrink-0 shadow-inner">
                <Globe className="text-[#e11d48]" size={28} />
              </div>
              <div className="pt-1">
                <h4 className="text-2xl font-black text-white leading-none mb-2 italic uppercase">Storm near Shanghai Port</h4>
                <p className="text-base text-white/40 font-medium leading-relaxed">Impact on Shipment #4492. Expected delay: <span className="text-red-500 font-bold">5-7 days</span>.</p>
              </div>
            </div>
            <div className="hidden lg:block w-32 h-1 bg-gradient-to-r from-transparent via-[#fecdd3] to-transparent"></div>
          </div>
        </div>

        {/* Divider / Action Flow */}
        <div className="flex justify-center -my-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-xl flex items-center justify-center text-blue-600 animate-bounce">
            <ChevronRight size={24} className="rotate-90" />
          </div>
        </div>

        {/* Navi Response Row */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-[#2563eb] font-black text-xs uppercase tracking-[0.2em]">
            <Zap size={16} />
            NAVI RECOMMENDATION
          </div>
          <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-[32px] flex items-center justify-between gap-8 group/card transition-all hover:border-[#00daf3]/30">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-[#dbeafe] flex items-center justify-center shrink-0 shadow-inner">
                <Activity className="text-[#2563eb]" size={28} />
              </div>
              <div className="pt-1">
                <h4 className="text-2xl font-black text-white leading-none mb-2 italic uppercase">Switch to Route B via Ningbo</h4>
                <p className="text-base text-white/40 font-medium leading-relaxed">Bypass storm impact. Adjusted arrival: <span className="text-[#00daf3] font-bold">+2 days</span> vs +7 days.</p>
                <div className="mt-8 flex gap-3">
                  <button className="bg-[#2563eb] text-white px-8 py-3 rounded-2xl text-sm font-black shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    Executes Route Change <ArrowRight size={16} />
                  </button>
                  <button className="bg-white border-2 border-[#dbeafe] text-[#2563eb] px-8 py-3 rounded-2xl text-sm font-black hover:bg-white hover:border-blue-500 transition-all">
                    View Full Analysis
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-32 h-1 bg-gradient-to-r from-transparent via-[#dbeafe] to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Background Glows */}
    <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] -z-10"></div>
    <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px] -z-10"></div>
  </motion.div>
);

// ─── FEATURE CARD (GLASS) ───
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[32px] border border-white/10 shadow-sm hover:shadow-2xl transition-all group hover:bg-white/10 hover:-translate-y-2 duration-500">
    <div className="w-14 h-14 rounded-2xl bg-[#00daf3]/10 flex items-center justify-center text-[#00daf3] mb-8 group-hover:bg-[#00daf3] group-hover:text-black transition-all duration-500 shadow-inner">
      <Icon size={28} />
    </div>
    <h3 className="text-2xl font-black tracking-tight text-white mb-4 italic uppercase">{title}</h3>
    <p className="text-white/40 font-medium leading-relaxed text-base">{description}</p>
  </div>
);

// ─── MAIN LANDING PAGE ───
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090b0d] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* ─── BACKGROUND GRADIENTS (DARK MODE) ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 150, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[15%] -left-[10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 0],
            y: [0, -70, 0],
            scale: [1, 1.4, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[25%] -right-[15%] w-[80%] h-[80%] bg-cyan-600/10 rounded-full blur-[180px]"
        />
        <div className="absolute top-[25%] left-[35%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[130px]" />
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10 rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
              <Image src="/logo.png" alt="SupplyAlert Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">Supply<span className="text-[#00daf3] italic">Alert</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            <Link href="/dashboard" className="hover:text-[#00daf3] transition-colors">Global Network</Link>
            <Link href="/dashboard/advisor" className="hover:text-[#00daf3] transition-colors">Navi Intelligence</Link>
            <Link href="/dashboard/simulation" className="hover:text-[#00daf3] transition-colors">Simulation Lab</Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-white/50 hover:text-[#00daf3] transition-colors">
              Login
            </Link>
            <Link href="/dashboard" className="px-8 py-3.5 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-white/5 hover:bg-[#00daf3] hover:text-black hover:-translate-y-1 transition-all duration-300">
              Access Terminal
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="pt-52 pb-32 px-10 relative">


        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-cyan-50 border border-cyan-100 mb-10 shadow-sm"
          >
            <Sparkles size={14} className="text-[#00daf3] animate-spin-slow" />
            <span className="text-[10px] font-black text-[#00daf3] uppercase tracking-[0.3em]">Cognitive Supply Chain Engine v4.0</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white max-w-6xl mx-auto leading-[0.85] md:leading-[0.85] italic uppercase"
          >
            See problems.<br/>
            <span className="text-[#00daf3] not-italic">Know actions.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed tracking-tight"
          >
            AI that detects global disruptions and calculates the optimal tactile response instantly. Stop tracking delays—start bypassing them.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/dashboard" className="group w-full sm:w-auto px-12 py-6 rounded-3xl bg-[#00daf3] text-black font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-cyan-500/20 hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-4">
              Access Terminal <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard/simulation" className="w-full sm:w-auto px-12 py-6 rounded-3xl bg-black border-2 border-white/10 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300">
              Run Live Scenario
            </Link>
          </motion.div>

          {/* Centerpiece DemoCard */}
          <DemoCard />
        </div>
      </section>

      {/* ─── SECOND HEADLINE SECTION ─── */}
      <section className="py-40 px-10 bg-gray-900 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-none"
          >
            Supply chain problems?<br/>
            <span className="text-[#00daf3] not-italic">We tell you what to do.</span>
          </motion.h2>
          <p className="mt-12 text-xl text-gray-500 max-w-2xl mx-auto font-medium tracking-tight leading-relaxed">
            While others give you data, Navi gives you decisions. Total operational awareness from node to destination.
          </p>
        </div>
      </section>

      {/* ─── HOW IT WORKS (STYLIZED) ─── */}
      <section className="py-40 px-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <FeatureCard 
              icon={Search}
              title="Detect"
              description="Real-time ingestion of global disruption signals—from storm vectors to labor news."
            />
            <FeatureCard 
              icon={Activity}
              title="Analyze"
              description="AI calculations across every node in your network to quantify the exact risk impact."
            />
            <FeatureCard 
              icon={Zap}
              title="Act"
              description="Navi presents a ranked tactical recommendation. Execute the solution in one click."
            />
          </div>
        </div>
      </section>

      {/* ─── CORE VALUE STATEMENT FLASH ─── */}
      <section className="py-24 px-10 bg-[#00daf3]">
        <marquee className="text-8xl md:text-[150px] font-black tracking-tighter uppercase italic text-gray-900 select-none whitespace-nowrap overflow-hidden">
          Predict. Prepare. Prevent. &nbsp; Predict. Prepare. Prevent. &nbsp; Predict. Prepare. Prevent. &nbsp;
        </marquee>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-24 px-10 border-t border-white/5 text-center bg-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 shadow-lg overflow-hidden">
              <Image src="/logo.png" alt="SupplyAlert Logo" width={24} height={24} className="object-contain" />
            </div>
            <span className="font-black text-xl tracking-tighter text-white uppercase">Supply<span className="text-[#00daf3]">Alert</span></span>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-12">
            <Link href="#" className="hover:text-[#00daf3] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#00daf3] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#00daf3] transition-colors">Status</Link>
          </div>
          <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest leading-none">© 2026 SupplyAlert Terminal Core. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
