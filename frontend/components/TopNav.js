'use client';
import { Search, Bell, User, History, Sun, Moon, Ship } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const TopNav = ({ onBookClick }) => {
  const { theme, toggleTheme } = useTheme();

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

        <div className="flex items-center gap-4 border-l border-border pl-6 cursor-pointer group">
          <div className="flex flex-col text-right transition-opacity group-hover:opacity-80">
            <span className="text-[13px] font-bold text-foreground tracking-tight leading-none">Alex Morgan</span>
            <span className="text-[11px] text-muted font-bold tracking-tight mt-1">Operations</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-high flex items-center justify-center border border-border group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
              <User size={20} className="text-muted" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
