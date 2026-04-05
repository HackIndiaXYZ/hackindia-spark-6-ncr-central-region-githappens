'use client';
import React, { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Palette, 
  Globe, Database, Zap, Save, ChevronRight,
  Sun, Moon, Monitor, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('identity');

  const tabs = [
    { id: 'identity', label: 'Matrix Identity', icon: User },
    { id: 'interface', label: 'Terminal Interface', icon: Palette },
    { id: 'alerts', label: 'Signal Thresholds', icon: Bell },
    { id: 'access', label: 'Security Clearance', icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-10 animate-in pb-12 overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-black tracking-tighter text-foreground mb-1">Matrix Settings</h1>
            <p className="text-text-muted text-[10px] font-black tracking-[0.2em] uppercase">System Calibration & Preferences</p>
         </div>
         <button className="flex items-center gap-3 bg-primary text-black px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(0,218,243,0.3)]">
            <Save size={16} />
            <span>Synchronize Config</span>
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[600px]">
         
         {/* Sidebar Tabs */}
         <div className="lg:col-span-3 flex flex-col gap-2">
            {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                    activeTab === tab.id 
                    ? 'bg-primary text-black shadow-lg translate-x-2' 
                    : 'bg-surface border border-border text-text-muted hover:bg-surface-high'
                 }`}
               >
                  <tab.icon size={18} className={activeTab === tab.id ? 'text-black' : 'group-hover:text-primary transition-colors'} />
                  <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-9 bg-surface border border-border rounded-[40px] p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
               <Settings size={200} />
            </div>

            {activeTab === 'identity' && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8 max-w-2xl relative z-10">
                  <div>
                     <h3 className="text-xl font-black tracking-tight text-foreground mb-2">Matrix Credentials</h3>
                     <p className="text-sm text-text-muted font-medium mb-8">Manage your primary deployment identity and role mapping.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Operator Name</label>
                        <input defaultValue={user?.name} className="bg-surface-high border border-border p-4 rounded-2xl text-sm font-bold focus:border-primary/40 outline-none" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Neural Alias</label>
                        <input placeholder="@logistics_prime" className="bg-surface-high border border-border p-4 rounded-2xl text-sm font-bold focus:border-primary/40 outline-none" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Secure Channel (Email)</label>
                     <input defaultValue={user?.email} className="bg-surface-high border border-border p-4 rounded-2xl text-sm font-bold focus:border-primary/40 outline-none" />
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Assigned Designation</label>
                     <div className="bg-surface-high border border-border p-4 rounded-2xl text-xs font-black text-primary uppercase tracking-widest">
                        {user?.role || 'Supply Chain Architect'}
                     </div>
                  </div>
               </motion.div>
            )}

            {activeTab === 'interface' && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-10 max-w-2xl relative z-10">
                  <div>
                     <h3 className="text-xl font-black tracking-tight text-foreground mb-2">Terminal Interface</h3>
                     <p className="text-sm text-text-muted font-medium">Calibrate the visual experience of the Terminal platform.</p>
                  </div>

                  <div className="flex flex-col gap-6">
                     <div className="flex items-center justify-between p-6 bg-surface-high border border-border rounded-3xl">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                           </div>
                           <div>
                              <div className="text-sm font-bold text-foreground">Theme Protocol</div>
                              <div className="text-xs text-text-muted">Current Mode: {theme.charAt(0).toUpperCase() + theme.slice(1)}</div>
                           </div>
                        </div>
                        <button 
                          onClick={toggleTheme}
                          className="px-6 py-2 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                        >
                           Swap Protocol
                        </button>
                     </div>

                     <div className="flex items-center justify-between p-6 bg-surface-high border border-border rounded-3xl opacity-50 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                              <Zap size={20} />
                           </div>
                           <div>
                              <div className="text-sm font-bold text-foreground">Haptic Animations</div>
                              <div className="text-xs text-text-muted">High-fidelity UI transitions active.</div>
                           </div>
                        </div>
                        <div className="w-12 h-6 bg-secondary/20 rounded-full flex items-center px-1 shadow-inner">
                           <div className="w-4 h-4 bg-secondary rounded-full shadow-lg"></div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}

            {activeTab === 'alerts' && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8 max-w-2xl relative z-10">
                  <div>
                     <h3 className="text-xl font-black tracking-tight text-foreground mb-2">Signal Thresholds</h3>
                     <p className="text-sm text-text-muted font-medium">Define when the platform should trigger emergency notifications.</p>
                  </div>

                  <div className="flex flex-col gap-4">
                     {[
                        { label: 'Risk Score Threshold', val: '75', color: 'text-primary' },
                        { label: 'Cost Impact Variance', val: '₹12L', color: 'text-secondary' },
                        { label: 'Neural Signal Degradation', val: '20%', color: 'text-accent' }
                     ].map(alert => (
                        <div key={alert.label} className="p-6 bg-surface-high border border-border rounded-3xl group hover:border-primary/20 transition-all cursor-pointer">
                           <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-text-muted uppercase tracking-widest">{alert.label}</span>
                              <span className={`text-lg font-black ${alert.color}`}>{alert.val}</span>
                           </div>
                           <div className="mt-4 h-1 bg-border rounded-full overflow-hidden">
                              <div className="h-full w-3/4 bg-primary rounded-full group-hover:w-full transition-all duration-700"></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}
         </div>
      </div>
    </div>
  );
}
