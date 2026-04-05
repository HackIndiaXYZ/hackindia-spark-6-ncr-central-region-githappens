'use client';
import React, { useState } from 'react';
import { 
  Search, Filter, Box, MapPin, Ship, Plane, Train, 
  ChevronRight, AlertTriangle, CheckCircle2, Clock, MoreVertical,
  ExternalLink, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getCarrierIcon = (carrier) => {
  if (!carrier) return <Ship size={18} />;
  const c = String(carrier);
  if (c.includes('Maersk') || c.includes('MSC')) return <Ship size={18} />;
  if (c.includes('FedEx') || c.includes('DHL')) return <Plane size={18} />;
  return <Ship size={18} />;
};

const getStatusColor = (status) => {
  const s = String(status || '').toLowerCase();
  switch (s) {
    case 'delayed': case 'critical': return 'bg-accent/20 text-accent border-accent/20';
    case 'in transit': case 'on-time': return 'bg-primary/20 text-primary border-primary/20';
    case 'delivered': return 'bg-secondary/20 text-secondary border-secondary/20';
    case 'pending': case 'at-risk': return 'bg-white/5 text-white/40 border-white/10';
    default: return 'bg-white/5 text-white/40 border-white/10';
  }
};

export default function ShipmentsList({ initialShipments }) {
  const [shipments] = useState(initialShipments);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShipments = (shipments || []).filter(s => {
    if (!s) return false;
    const term = searchTerm.toLowerCase();
    const id = String(s.id || '').toLowerCase();
    const origin = String(s.origin || '').toLowerCase();
    const dest = String(s.destination || '').toLowerCase();
    return id.includes(term) || origin.includes(term) || dest.includes(term);
  });

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return '₹0.00';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col gap-10 animate-in pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-black tracking-tighter text-foreground mb-1">Freight Matrix</h1>
            <p className="text-text-muted text-[10px] font-bold tracking-[0.2em] uppercase">Tactical Deployment Surveillance</p>
         </div>
         <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 bg-surface border border-border px-4 py-2.5 rounded-2xl focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/10 transition-all shadow-sm">
               <Search size={16} className="text-text-muted" />
               <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search by ID, Origin, Port..." 
                 className="bg-transparent border-none outline-none text-[11px] text-foreground placeholder:text-text-muted/40 w-40 md:w-56 font-medium" 
               />
            </div>
            <button className="flex items-center gap-2 bg-surface-high border border-border px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-foreground hover:bg-surface transition-all shadow-sm">
               <Filter size={14} />
               <span>Config Filters</span>
            </button>
         </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         <AnimatePresence mode="popLayout">
         {filteredShipments.map((shipment, i) => (
            <motion.div 
               layout
               key={shipment.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.05 }}
               className="group bg-surface-high/40 backdrop-blur-xl border border-border p-6 rounded-[32px] hover:border-primary/20 transition-all duration-500 shadow-sm relative overflow-hidden"
            >
               {/* ─── Card Header ─── */}
               <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                     <div className={`p-3 rounded-2xl ${getStatusColor(shipment.status).split(' ')[0]} ${getStatusColor(shipment.status).split(' ')[1]} group-hover:scale-110 transition-transform shadow-sm`}>
                        <Box size={20} />
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5 opacity-50">Deployment ID</div>
                        <h3 className="text-lg font-black tracking-tight text-foreground">{shipment.id}</h3>
                     </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(shipment.status)}`}>
                     {shipment.status}
                  </div>
               </div>

               {/* ─── Logistics Path ─── */}
               <div className="flex items-center gap-4 mb-6 px-1">
                  <div className="flex flex-col items-center gap-1.5">
                     <MapPin size={12} className="text-primary" />
                     <div className="h-10 w-px bg-gradient-to-b from-primary to-transparent border-l border-dashed border-primary/30"></div>
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">Origin</span>
                           <span className="text-xs font-bold text-foreground">{shipment.origin}</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest opacity-40">Destination</span>
                           <span className="text-xs font-bold text-foreground">{shipment.destination}</span>
                        </div>
                     </div>
                     <div className="relative h-1 bg-surface-high rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${shipment.progress}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className={`h-full ${shipment.status === 'Delayed' ? 'bg-accent' : 'bg-primary'} relative`}
                        >
                           <div className="absolute top-0 right-0 h-full w-4 bg-white opacity-20 animate-pulse"></div>
                        </motion.div>
                     </div>
                  </div>
               </div>

               {/* ─── Fleet Details ─── */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                     { label: 'Carrier', value: shipment.carrier, icon: getCarrierIcon(shipment.carrier) },
                     { label: 'Value', value: formatCurrency(shipment.value), icon: <Clock size={14} /> },
                     { label: 'ETA Var', value: shipment.eta, icon: <CheckCircle2 size={14} /> },
                     { label: 'Conf', value: '98%', icon: <BarChart3 size={14} /> }
                  ].map((item, idx) => (
                     <div key={idx} className="bg-surface p-3 rounded-2xl border border-border flex flex-col gap-1.5 group-hover:border-primary/10 transition-colors shadow-sm">
                        <div className="text-text-muted opacity-60">{item.icon}</div>
                        <div className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none opacity-50">{item.label}</div>
                        <div className="text-[10px] font-bold text-foreground leading-none mt-0.5">{item.value}</div>
                     </div>
                  ))}
               </div>

               {/* ─── Footer Controls ─── */}
               <div className="flex items-center justify-between pt-5 border-t border-border">
                  <div className="flex items-center gap-2">
                     <span className={`w-1.5 h-1.5 rounded-full ${shipment.status === 'Delayed' ? 'bg-accent animate-pulse' : 'bg-primary'}`}></span>
                     <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">{shipment.status === 'Delayed' ? 'Neural Block' : 'Sync Active'}</span>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2.5 bg-surface-high border border-border rounded-xl text-text-muted hover:text-foreground hover:border-border transition-all">
                        <MoreVertical size={14} />
                     </button>
                     <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${shipment.status === 'Delayed' ? 'bg-accent text-white shadow-[0_0_20px_rgba(255,61,0,0.2)]' : 'bg-primary text-black hover:scale-105 shadow-[0_0_20px_rgba(0,218,243,0.2)]'}`}>
                        <span>Re-route</span>
                        <ChevronRight size={12} />
                     </button>
                  </div>
               </div>

               {/* Decorative Background Blob */}
               <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-10 transition-all ${shipment.status === 'Delayed' ? 'bg-accent' : 'bg-primary group-hover:opacity-20'}`}></div>
            </motion.div>
         ))}
         </AnimatePresence>
      </div>
    </div>
  );
}
