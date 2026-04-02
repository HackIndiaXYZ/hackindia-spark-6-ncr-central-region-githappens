'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, MessageSquareText, Activity, ShieldAlert, 
  Settings, LogOut, BarChart3, Box, AlertTriangle, Home
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Command Center' },
    { path: '/dashboard/advisor', icon: MessageSquareText, label: 'Navi AI' },
    { path: '/dashboard/simulation', icon: Activity, label: 'Simulation' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/shipments', icon: Box, label: 'Shipments' },
    { path: '/dashboard/alerts', icon: AlertTriangle, label: 'Alerts' },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-72'} bg-surface border-r border-border h-full flex flex-col pt-10 pb-8 shrink-0 z-50 transition-all duration-300 ease-in-out relative group shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
      {/* Brand Header */}
      <div className="flex items-center gap-4 px-10 mb-16 overflow-hidden whitespace-nowrap">
        <div className="w-12 h-12 rounded-2xl bg-surface-high border border-border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
          <Image src="/logo.png" alt="SupplyAlert Logo" width={32} height={32} className="object-contain" />
        </div>
        <div className={`transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          <span className="font-bold text-lg tracking-tight text-foreground">SupplyAlert</span>
          <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase leading-none mt-1">Intelligence Matrix</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 px-6 flex-1 overflow-y-auto no-scrollbar">
        {!collapsed && <div className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.25em] pl-4 mb-4">Operations</div>}
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              title={collapsed ? item.label : ''}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group/item relative ${isActive 
                ? 'bg-primary/5 text-primary' 
                : 'text-gray-500 hover:text-foreground hover:bg-surface-high'}`}
            >
              <item.icon size={18} className={`shrink-0 ${isActive ? 'text-primary' : 'text-inherit opacity-60'}`} />
              <span className={`font-semibold text-[13px] tracking-tight transition-all duration-300 ${collapsed ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]"
                ></motion.div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="flex flex-col gap-2 px-6 border-t border-border pt-8 mt-6">
        <Link href="/dashboard/settings" className="flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all text-gray-400 hover:text-foreground hover:bg-surface-high font-semibold text-[13px] tracking-tight">
          <Settings size={18} className="shrink-0 opacity-60" />
          <span className={`transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>Settings</span>
        </Link>
        <button className="flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all text-gray-400 hover:text-red-500 hover:bg-red-500/10 font-semibold text-[13px] tracking-tight">
          <LogOut size={18} className="shrink-0 opacity-60" />
          <span className={`transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>Logout</span>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 w-6 h-6 bg-surface border border-border rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 shadow-sm transition-all z-50 opacity-0 group-hover:opacity-100"
      >
        <div className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </div>
      </button>
    </aside>
  );
};

export default Sidebar;
