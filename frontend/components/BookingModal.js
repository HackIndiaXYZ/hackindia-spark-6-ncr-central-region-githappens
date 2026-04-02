'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ship, MapPin, Package, Send, CheckCircle2, Loader2, Globe } from 'lucide-react';
import api from '@/lib/api';

export default function BookingModal({ isOpen, onClose, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargo: '',
    type: 'sea' // sea, air, rail
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newShipment = await api.bookShipment(formData);
      setSuccess(true);
      setTimeout(() => {
        onBookingSuccess(newShipment);
        onClose();
        setSuccess(false);
        setFormData({ origin: '', destination: '', cargo: '', type: 'sea' });
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/10 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-surface rounded-[32px] shadow-2xl overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-high border border-border flex items-center justify-center shrink-0 shadow-sm">
                  <img src="/logo.png" alt="SupplyAlert Logo" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Book Shipment</h3>
                  <p className="text-[11px] font-black text-muted uppercase tracking-widest mt-1">Global Logistics Pipeline</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-surface-high hover:bg-rose-500/10 hover:text-rose-600 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="p-10">
              {success ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-8"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-foreground mb-2">Shipment Booked</h4>
                  <p className="text-muted font-bold">Your logistics request has been processed successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Origin Node</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          required
                          value={formData.origin}
                          onChange={e => setFormData({...formData, origin: e.target.value})}
                          placeholder="e.g. Shanghai Hub"
                          className="w-full bg-surface-high border border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm focus:bg-surface focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-foreground placeholder:text-muted"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Destination Node</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          required
                          value={formData.destination}
                          onChange={e => setFormData({...formData, destination: e.target.value})}
                          placeholder="e.g. Rotterdam Terminal"
                          className="w-full bg-surface-high border border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm focus:bg-surface focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-foreground placeholder:text-muted"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Cargo Details</label>
                    <div className="relative group">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        required
                        value={formData.cargo}
                        onChange={e => setFormData({...formData, cargo: e.target.value})}
                        placeholder="e.g. High-density Electronics (Batch XT)"
                        className="w-full bg-surface-high border border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm focus:bg-surface focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-bold text-foreground placeholder:text-muted"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Transit Protocol</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['sea', 'air', 'rail'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, type})}
                          className={`py-4 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all ${
                            formData.type === type 
                              ? 'bg-primary border-primary text-white shadow-lg' 
                              : 'bg-surface-high border-transparent text-muted hover:bg-surface-highest'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-2xl">{error}</div>}

                  <button
                    disabled={loading}
                    className="w-full py-5 bg-foreground text-background rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-40 mt-4"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {loading ? 'Establishing Link...' : 'Establish Shipment'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
