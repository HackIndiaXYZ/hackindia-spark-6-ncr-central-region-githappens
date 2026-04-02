'use client';
import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Zap, RotateCcw, Filter, Search, MoreVertical, ChevronDown, Bell, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlertsList({ initialAlerts }) {
  const [alerts] = useState(initialAlerts);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'high' && (alert.severity === 'critical' || alert.severity === 'high')) ||
                      (activeTab === 'moderate' && alert.severity === 'medium') ||
                      (activeTab === 'advisory' && (alert.severity === 'low' || alert.severity === 'info'));
    return matchesSearch && matchesTab;
  });

  const getPriorityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high': return 'bg-accent text-white';
      case 'medium': return 'bg-secondary text-white';
      case 'low': return 'bg-primary/20 text-primary border border-primary/20';
      default: return 'bg-white/10 text-white/40';
    }
  };

  const getIcon = (type, severity) => {
    if (severity === 'critical') return <AlertTriangle size={32} />;
    if (type === 'ai_recommendation' || type === 'cost') return <Zap size={32} />;
    if (type === 'weather' || type === 'congestion') return <Bell size={32} />;
    return <Info size={32} />;
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-10 animate-in pb-12">
      
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">Alert Matrix</h1>
            <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">Tactical Threat & Disruption Feed</p>
         </div>
         <div className="flex gap-4">
            <div className="flex items-center gap-4 bg-[#0E141A] border border-white/5 px-6 py-4 rounded-[28px] focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
               <Search size={18} className="text-white/20" />
               <input 
                 placeholder="Filter alerts..." 
                 className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/10 w-48"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-[28px] text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all">
               <Filter size={16} />
               <span>Matrix Config</span>
            </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
         {['all', 'high', 'moderate', 'advisory'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${activeTab === tab ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,218,243,0.1)] text-primary' : 'bg-transparent border-white/5 text-white/30 hover:text-white hover:border-white/10'}`}
            >
               {tab}
            </button>
         ))}
      </div>

      {/* Alert Feed */}
      <div className="flex flex-col gap-6">
         {filteredAlerts.map((alert, i) => (
            <motion.div 
               key={alert.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className={`group bg-[#0E141A]/40 backdrop-blur-xl p-8 rounded-[40px] border shadow-2xl transition-all relative overflow-hidden ${alert.severity === 'critical' || alert.severity === 'high' ? 'border-accent shadow-[0_0_30px_rgba(255,61,0,0.15)]' : 'border-white/5 hover:border-white/10'}`}
            >
               <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start gap-8">
                     <div className={`p-4 rounded-3xl shrink-0 ${alert.severity === 'critical' || alert.severity === 'high' ? 'bg-accent/10 text-accent' : alert.severity === 'medium' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                        {getIcon(alert.type, alert.severity)}
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getPriorityColor(alert.severity)}`}>
                              {alert.severity} Priority
                           </span>
                           <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{formatTimestamp(alert.timestamp)}</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter text-white mb-2">{alert.title}</h3>
                        <p className="text-white/40 text-sm leading-relaxed max-w-2xl font-medium">{alert.message}</p>
                     </div>
                  </div>

                  <div className="flex gap-4 items-center">
                     <button className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${alert.severity === 'critical' || alert.severity === 'high' ? 'bg-accent text-white hover:scale-105 shadow-[0_0_30px_rgba(255,61,0,0.3)]' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                        {alert.read ? 'Acknowledged' : 'Acknowledge'}
                     </button>
                     <button className="p-3 text-white/10 hover:text-white transition-colors relative"><MoreVertical size={20} /></button>
                  </div>
               </div>
               
               {/* Background Decorative Element */}
               <div className={`absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-10 transition-all ${alert.severity === 'critical' || alert.severity === 'high' ? 'bg-accent group-hover:opacity-20' : 'bg-primary'}`}></div>
            </motion.div>
         ))}

         {filteredAlerts.length === 0 && (
            <div className="py-20 text-center bg-[#0E141A]/20 rounded-[32px] border border-dashed border-white/5">
               <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No matching tactical alerts detected</p>
            </div>
         )}
      </div>
    </div>
  );
}
