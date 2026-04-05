'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Activity, ShieldAlert, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials or system offline');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[#00daf3]/5 blur-[200px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[#07090c]/80 backdrop-blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 relative group cursor-default transition-all hover:border-[#00daf3]/50"
          >
             <Image src="/logo.png" alt="Logo" width={48} height={48} />
             <div className="absolute inset-0 bg-[#00daf3]/10 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-4">
            Terminal.<span className="text-[#00daf3] not-italic">Login</span>
          </h1>
          <p className="text-white/40 font-bold text-[10px] uppercase tracking-[0.4em]">Initialize Command Session</p>
        </div>

        <div className="bg-[#0e141a]/60 backdrop-blur-3xl rounded-[40px] p-10 border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#00daf3] ml-4">Credential Identity</label>
              <div className="relative group">
                <ShieldAlert className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00daf3] transition-colors" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@supplyalert.ai"
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-[#00daf3]/30 focus:ring-4 focus:ring-[#00daf3]/5 transition-all text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#00daf3] ml-4">Access Key</label>
              <div className="relative group">
                <ShieldAlert className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00daf3] transition-colors" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 pl-14 pr-6 text-sm font-bold placeholder:text-white/10 focus:outline-none focus:border-[#00daf3]/30 focus:ring-4 focus:ring-[#00daf3]/5 transition-all text-white"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse text-[10px] font-bold text-red-500 whitespace-nowrap">Error</div>
                <p className="text-[11px] font-bold text-red-500/80">{error}</p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#00daf3] hover:bg-[#00daf3]/90 text-[#00363d] rounded-3xl py-5 font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group hover:scale-[1.02] shadow-[0_20px_40px_rgba(0,218,243,0.2)]"
            >
              {loading ? (
                <>
                  <Activity className="animate-spin" size={18} />
                  Authenticating...
                </>
              ) : (
                <>
                  Establish Connection
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 flex flex-col gap-4 text-center">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-loose">
               Secure Access Protocol v4.2<br/>
               Restricted to SupplyAlert Authorized Personnel
            </p>
          </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-3">
           <ShieldAlert size={14} className="text-[#00daf3]/40" />
           <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">End-to-End Encrypted Terminal</p>
        </div>
      </motion.div>
    </div>
  );
}
