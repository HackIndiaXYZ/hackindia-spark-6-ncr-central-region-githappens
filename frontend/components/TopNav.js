'use client';
import React, { useState } from 'react';
import { Search, Bell, User, History, Sun, Moon, Ship, Settings, LogOut, Shield } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const TopNav = ({ onBookClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-20 px-10 flex items-center justify-between absolute top-0 left-0 right-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-border text-foreground shadow-sm">
      <div className="flex items-center bg-surface-high/50 border border-border rounded-2xl px-5 py-2.5 w-[400px] focus-within:ring-2 focus-within:ring-primary/10 transition-all focus-within:bg-surface focus-within:border-primary/20">
        <Search className="text-muted mr-3" size={18} />
        <input 
          type="text" 
          placeholder="Search shipments, routes, or alerts..." 
          className="bg-transparent border-none outline-none text-[13px] w-full font-bold placeholder:text-muted" 
        />
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={onBookClick}
          className="px-6 py-2.5 bg-foreground text-background rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center gap-2"
        >
          <Ship size={14} />
          Book Shipment
        </button>

        <div className="flex items-center gap-4 border-l border-border pl-6 h-8">
          <button 
            onClick={toggleTheme}
            className="text-muted hover:text-foreground transition-colors p-2 rounded-xl hover:bg-surface-high"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="text-muted hover:text-foreground transition-colors relative">
            <Bell size={18} />
          </button>
        </div>

        {user ? (
          <div className="relative">
            <div 
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-4 border-l border-border pl-6 cursor-pointer group"
            >
              <div className="flex flex-col text-right transition-opacity group-hover:opacity-80">
                <span className="text-[13px] font-bold text-foreground tracking-tight leading-none truncate max-w-[120px]">{user?.name}</span>
                <span className="text-[10px] text-[#00daf3] font-black uppercase tracking-widest mt-1 opacity-70 italic">{user?.role}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform overflow-hidden shadow-sm text-primary font-black text-xs uppercase">
                  {user?.name?.charAt(0) || 'U'}
              </div>
            </div>

            <AnimatePresence>
              {showProfile && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfile(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-60 bg-surface border border-border rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 overflow-hidden"
                  >
                    <div className="p-5 border-b border-border bg-surface-high/30">
                       <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Matrix Credentials</div>
                       <div className="text-sm font-bold text-foreground">{user?.name}</div>
                       <div className="text-[11px] text-muted">{user?.email}</div>
                    </div>
                    
                    <div className="p-2">
                       <Link 
                         href="/dashboard/settings" 
                         className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-surface-high text-[13px] font-medium text-foreground transition-colors"
                         onClick={() => setShowProfile(false)}
                       >
                          <Settings size={16} className="text-muted" />
                          Matrix Settings
                       </Link>
                       <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-surface-high text-[13px] font-medium text-foreground cursor-not-allowed opacity-50">
                          <Shield size={16} className="text-muted" />
                          Security Clearance
                       </div>
                    </div>

                    <div className="p-2 border-t border-border bg-surface-high/10">
                       <button 
                         onClick={() => { logout(); setShowProfile(false); }}
                         className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-accent/10 text-[13px] font-bold text-accent transition-colors"
                       >
                          <LogOut size={16} />
                          Terminate Session
                       </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : !loading && (
          <Link href="/login" className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#00daf3]/30 text-[#00daf3] text-[11px] font-black uppercase tracking-widest hover:bg-[#00daf3]/5 transition-all">
            <User size={14} />
            Command Session
          </Link>
        )}
      </div>
    </header>
  );
};

export default TopNav;
