'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Upload, CheckCircle2, AlertCircle, FileText, ArrowRight, Loader2, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminImportPage() {
  const { token, isAdmin, loading: authLoading } = useAuth();
  const [importType, setImportType] = useState('shipments');
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  if (authLoading) return <div className="p-20 text-center animate-pulse tracking-widest uppercase font-bold text-muted">Authenticating Terminal...</div>;
  if (!isAdmin) return <div className="p-20 text-center text-red-500 font-bold uppercase tracking-widest">Access Denied: Admin Clearance Required</div>;

  const handleImport = async () => {
    if (!jsonInput.trim()) {
      setStatus('error');
      setMessage('Please provide valid JSON data');
      return;
    }

    setStatus('loading');
    try {
      const parsedData = JSON.parse(jsonInput);
      const res = await fetch('http://localhost:5000/api/admin/import', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ type: importType, data: parsedData })
      });

      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setJsonInput('');
      } else {
        setStatus('error');
        setMessage(result.message || 'Import failed');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Invalid JSON format. Please check your syntax.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Database size={24} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">System Ingestion</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Data <span className="text-primary italic-none">Import Portal</span></h1>
          <p className="text-muted text-lg mt-4 max-w-2xl font-medium leading-relaxed">
            Append historical company data to the SupplyAlert Intelligence Matrix. Supports shipments, suppliers, and disruption logs.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Configuration Side */}
        <div className="space-y-8">
           <section className="bg-surface border border-border rounded-[32px] p-8 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#00daf3]">Configuration</h3>
              
              <div className="space-y-4">
                 <label className="text-[10px] font-bold text-muted uppercase tracking-widest block ml-2">Target Schema</label>
                 <div className="grid grid-cols-1 gap-2">
                    {['shipments', 'suppliers', 'disruptions'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setImportType(t)}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all font-bold text-sm capitalize ${importType === t ? 'bg-primary/5 border-primary/30 text-primary' : 'bg-surface-high border-border text-muted hover:text-foreground'}`}
                      >
                        {t}
                        {importType === t && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-border">
                 <div className="flex gap-4 p-4 rounded-2xl bg-surface-high/50 border border-border text-muted text-[11px] font-medium leading-relaxed italic">
                    <Info size={16} className="shrink-0 text-primary" />
                    Existing records with matching IDs will be maintained; new records will be prepended to the live database.
                 </div>
              </div>
           </section>

           <section className="bg-surface-high border border-border rounded-[32px] p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted mb-6">Instructions</h3>
              <ul className="space-y-4">
                 <li className="flex gap-3 text-[12px] font-medium text-muted">
                    <div className="w-5 h-5 rounded-md bg-surface border border-border flex items-center justify-center text-[10px] font-black shrink-0">1</div>
                    Select the target data category.
                 </li>
                 <li className="flex gap-3 text-[12px] font-medium text-muted">
                    <div className="w-5 h-5 rounded-md bg-surface border border-border flex items-center justify-center text-[10px] font-black shrink-0">2</div>
                    Paste your JSON array object.
                 </li>
                 <li className="flex gap-3 text-[12px] font-medium text-muted">
                    <div className="w-5 h-5 rounded-md bg-surface border border-border flex items-center justify-center text-[10px] font-black shrink-0">3</div>
                    Click "Initialize Ingestion".
                 </li>
              </ul>
           </section>
        </div>

        {/* Input Area */}
        <div className="lg:col-span-2 space-y-6">
           <div className="relative group">
              <div className="absolute -top-3 left-8 px-4 bg-background border border-border rounded-full text-[9px] font-black uppercase tracking-widest text-primary z-10">Payload Editor</div>
              <textarea 
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[ { "id": "EXP-001", "name": "Company X", ... } ]'
                className="w-full h-[500px] bg-black/40 border-2 border-border rounded-[40px] p-10 pt-12 pb-24 font-mono text-sm text-[#00daf3]/80 placeholder:text-white/5 focus:outline-none focus:border-primary/30 transition-all resize-none shadow-inner no-scrollbar"
              />
              
              <div className="absolute bottom-8 right-8 left-8 flex items-center justify-between pointer-events-none">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/80 border border-border backdrop-blur-md">
                    <FileText size={14} className="text-muted" />
                    <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">JSON Array Format Required</span>
                 </div>

                 <button 
                   onClick={handleImport}
                   disabled={status === 'loading'}
                   className="pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-secondary font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,218,243,0.2)] disabled:opacity-50"
                 >
                    {status === 'loading' ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                    Initialize Ingestion
                 </button>
              </div>
           </div>

           <AnimatePresence>
             {status !== 'idle' && status !== 'loading' && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className={`p-6 rounded-[32px] border flex items-center justify-between ${status === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
               >
                 <div className="flex items-center gap-4">
                    {status === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Log</span>
                       <span className="text-sm font-bold">{message}</span>
                    </div>
                 </div>
                 <button 
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2 rounded-full border border-current/20 text-[10px] font-black uppercase tracking-widest hover:bg-current/10 transition-all"
                 >
                   Acknowledge
                 </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
