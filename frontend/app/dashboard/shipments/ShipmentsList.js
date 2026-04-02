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

  const filteredShipments = shipments.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return '₹0.00';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col gap-10 animate-in pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">Freight Matrix</h1>
            <p className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">Tactical Deployment Surveillance</p>
         </div>
         <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-4 bg-[#0E141A] border border-white/5 px-6 py-4 rounded-[28px] focus-within:border-primary/30 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
               <Search size={18} className="text-white/20" />
               <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search by ID, Origin, Port..." 
                 className="bg-transparent border-none outline-none text-xs text-white placeholder:text-white/10 w-48 md:w-64" 
               />
            </div>
            <button className="flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-[28px] text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all">
               <Filter size={16} />
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
               className="group bg-[#0E141A]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] hover:border-white/10 transition-all duration-500 shadow-2xl relative overflow-hidden"
            >
               {/* ─── Card Header ─── */}
               <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className={`p-4 rounded-3xl ${getStatusColor(shipment.status).split(' ')[0]} ${getStatusColor(shipment.status).split(' ')[1]} group-hover:scale-110 transition-transform`}>
                        <Box size={24} />
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Deployment ID</div>
                        <h3 className="text-xl font-black tracking-tight text-white">{shipment.id}</h3>
                     </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusColor(shipment.status)}`}>
                     {shipment.status}
                  </div>
               </div>

               {/* ─── Logistics Path ─── */}
               <div className="flex items-center gap-6 mb-8 px-2">
                  <div className="flex flex-col items-center gap-2">
                     <MapPin size={14} className="text-primary" />
                     <div className="h-12 w-px bg-gradient-to-b from-primary to-transparent border-l border-dashed border-primary/40"></div>
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Origin Node</span>
                           <span className="text-sm font-bold text-white">{shipment.origin}</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Destination Node</span>
                           <span className="text-sm font-bold text-white">{shipment.destination}</span>
                        </div>
                     </div>
                     <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
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
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                     { label: 'Carrier', value: shipment.carrier, icon: getCarrierIcon(shipment.carrier) },
                     { label: 'Asset Value', value: formatCurrency(shipment.value), icon: <Clock size={16} /> },
                     { label: 'ETA Variance', value: shipment.eta, icon: <CheckCircle2 size={16} /> },
                     { label: 'Signal Confidence', value: '98.2%', icon: <BarChart3 size={16} /> }
                  ].map((item, idx) => (
                     <div key={idx} className="bg-black/20 border border-white/5 p-4 rounded-3xl flex flex-col gap-2 group-hover:border-white/10 transition-colors">
                        <div className="text-white/20">{item.icon}</div>
                        <div className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none">{item.label}</div>
                        <div className="text-xs font-bold text-white leading-none mt-1">{item.value}</div>
                     </div>
                  ))}
               </div>

               {/* ─── Footer Controls ─── */}
               <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${shipment.status === 'Delayed' ? 'bg-accent animate-pulse' : 'bg-primary'}`}></span>
                     <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{shipment.status === 'Delayed' ? 'Neural Signal Blocked' : 'Telemetry Sync Active'}</span>
                  </div>
                  <div className="flex gap-4">
                     <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white hover:border-white/20 transition-all">
                        <MoreVertical size={16} />
                     </button>
                     <button className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${shipment.status === 'Delayed' ? 'bg-accent text-white shadow-[0_0_20px_rgba(255,61,0,0.3)]' : 'bg-primary text-black hover:scale-105 shadow-[0_0_20px_rgba(0,218,243,0.3)]'}`}>
                        <span>Execute Re-route</span>
                        <ChevronRight size={14} />
                     </button>
                  </div>
               </div>

               {/* Decorative Background Blob */}
               <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20 transition-all ${shipment.status === 'Delayed' ? 'bg-accent' : 'bg-primary group-hover:opacity-30'}`}></div>
            </motion.div>
         ))}
         </AnimatePresence>
      </div>
    </div>
  );
}
