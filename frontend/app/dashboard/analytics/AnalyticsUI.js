'use client';
import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Activity,
  MapPin, ShieldAlert, ChevronRight, RotateCcw, Box, Globe, IndianRupee
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { motion } from 'framer-motion';

export default function AnalyticsUI({ initialAnalytics }) {
  const [analytics] = useState(initialAnalytics);
  
  const formatCurrency = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const getMetricIcon = (label) => {
    switch (label) {
      case 'Total Freight Cost': return <IndianRupee size={18} />;
      case 'Logistics Efficiency': return <Activity size={18} />;
      case 'Disruption Risk': return <ShieldAlert size={18} />;
      default: return <BarChart3 size={18} />;
    }
  };

  const dashboardStats = [
    { label: 'Total Freight Cost', value: formatCurrency(analytics?.costBreakdown?.reduce((acc, curr) => acc + curr.value, 0) || 0), change: '+2.4%', up: false, color: 'text-white' },
    { label: 'Logistics Efficiency', value: '94.2%', change: '+0.8%', up: true, color: 'text-primary' },
    { label: 'Disruption Risk', value: 'High', change: '+12%', up: false, color: 'text-accent' },
    { label: 'Active Trade Routes', value: '24', change: '+2', up: true, color: 'text-secondary' },
  ];

  return (
    <div className="flex flex-col gap-10 animate-in">
      
      {/* ─── TOP METRICS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {dashboardStats.map((stat, i) => (
            <motion.div 
               key={stat.label}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-surface-high/60 backdrop-blur-xl border border-border p-6 rounded-[32px] group hover:border-primary/20 transition-all duration-300 shadow-sm"
            >
               <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-surface ${stat.color} group-hover:scale-110 transition-transform shadow-sm border border-border/50`}>
                     {getMetricIcon(stat.label)}
                  </div>
                  <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${stat.up ? 'text-primary' : 'text-accent'}`}>
                     {stat.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                     {stat.change}
                  </div>
               </div>
               <div className="text-[9px] font-black text-text-muted/50 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
               <div className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
            </motion.div>
         ))}
      </div>

      {/* ─── MAIN ANALYTICS GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* COST TREND AREA CHART */}
         <div className="lg:col-span-8 bg-surface border border-border rounded-[32px] p-8 relative overflow-hidden h-[380px] shadow-sm">
            <div className="flex items-center justify-between relative z-10 mb-8">
               <div>
                  <h3 className="text-xl font-black tracking-tight text-foreground mb-1">Freight Cost Projections</h3>
                  <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Global Multi-Modal Analytics Matrix</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-surface-high border border-border rounded-xl text-[9px] font-black text-text-muted uppercase tracking-widest shadow-sm">
                     <Globe size={12} className="text-primary" />
                     <span>Rupee Valuation</span>
                  </div>
               </div>
            </div>
            
            <div className="h-full w-full pb-16">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.monthlyCostTrend || []}>
                     <defs>
                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.1} />
                     <XAxis 
                       dataKey="month" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 'bold' }} 
                       dy={10}
                     />
                     <YAxis hide domain={['auto', 'auto']} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: 'var(--primary)', fontSize: '11px', fontWeight: 'bold' }}
                        labelStyle={{ color: 'var(--text-muted)', fontSize: '9px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 'black', letterSpacing: '0.1em' }}
                        formatter={(val) => formatCurrency(val)}
                     />
                     <Area 
                       type="monotone" 
                       dataKey="cost" 
                       stroke="var(--primary)" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorCost)" 
                       animationDuration={1500}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* COST BREAKDOWN BAR CHART */}
         <div className="lg:col-span-4 bg-surface border border-border rounded-[32px] p-8 h-[380px] flex flex-col shadow-sm">
            <div className="mb-8">
               <h3 className="text-xl font-black tracking-tight text-foreground mb-1">Cost Vectors</h3>
               <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Per Component Breakdown</p>
            </div>
            
            <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.costBreakdown || []} layout="vertical" margin={{ left: -10 }}>
                     <XAxis type="number" hide />
                     <YAxis 
                       type="category" 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: 'var(--text-muted)', fontSize: 8, fontWeight: 'black', textTransform: 'uppercase' }} 
                     />
                     <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}
                        formatter={(val) => formatCurrency(val)}
                     />
                     <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20} animationDuration={1200}>
                        {(analytics?.costBreakdown || []).map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--primary)' : index === 1 ? 'var(--secondary)' : index === 2 ? 'var(--accent)' : 'var(--text-muted)'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

      </div>

      {/* ─── BOTTOM ROW: REGIONAL PERFORMANCE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-0">
         
         <div className="lg:col-span-2 bg-surface border border-border rounded-[32px] p-6 relative overflow-hidden shadow-sm">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 px-2">Regional Reliability Topology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
               {(analytics?.regionPerformance || []).map((region, i) => (
                  <div key={i} className="flex flex-col gap-2 group px-3 py-2 rounded-2xl hover:bg-surface-high transition-all">
                     <div className="flex justify-between items-center h-4">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${region.reliability > 80 ? 'bg-primary' : region.reliability > 70 ? 'bg-secondary' : 'bg-accent'}`}></div>
                           <span className="text-xs font-bold text-foreground tracking-tight">{region.region}</span>
                        </div>
                        <div className="text-[8px] font-black text-text-muted uppercase tracking-widest">{region.avgDelay}d</div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-surface-high rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${region.reliability}%` }}
                             transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                             className={`h-full ${region.reliability < 70 ? 'bg-accent' : 'bg-primary'}`}
                           ></motion.div>
                        </div>
                        <span className="text-[9px] font-black text-primary uppercase w-8 text-right">{region.reliability}%</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-1 bg-surface border border-border rounded-[32px] p-6 flex flex-col items-center justify-center text-center group shadow-sm">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,61,0,0.1)] group-hover:scale-110 transition-transform duration-500 mb-4 border border-accent/20">
               <RotateCcw className="text-accent" size={24} />
            </div>
            <h4 className="text-lg font-black tracking-tight text-foreground mb-1">Neural Stress Test</h4>
            <p className="text-[10px] text-text-muted leading-relaxed mb-5 px-6 font-medium italic opacity-70">Re-evaluate global cost impact with current volatility parameters.</p>
            <button className="px-8 py-3 bg-accent text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,61,0,0.2)] hover:scale-105 transition-transform">
               Recalculate
            </button>
         </div>

      </div>
    </div>
  );
}
