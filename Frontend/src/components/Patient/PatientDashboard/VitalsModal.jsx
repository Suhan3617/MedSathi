import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const VitalsModal = ({ show, onClose, onSubmit, saving, form, setForm }) => {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                        onClick={e => e.stopPropagation()}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white m-0 tracking-tight">Update Daily Vitals</h3>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Log your latest health metrics</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            >
                                <FiX size={20}/>
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Blood Pressure <span className="text-slate-400 font-medium normal-case">(mmHg)</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g., 120/80" 
                                        value={form.bloodPressure}
                                        onChange={(e) => setForm({...form, bloodPressure: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Heart Rate <span className="text-slate-400 font-medium normal-case">(bpm)</span></label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g., 72" 
                                        value={form.heartRate}
                                        onChange={(e) => setForm({...form, heartRate: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Temperature <span className="text-slate-400 font-medium normal-case">(°F)</span></label>
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        placeholder="e.g., 98.6" 
                                        value={form.temperature}
                                        onChange={(e) => setForm({...form, temperature: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Oxygen SpO2 <span className="text-slate-400 font-medium normal-case">(%)</span></label>
                                    <input 
                                        type="number" 
                                        placeholder="e.g., 99" 
                                        value={form.spO2}
                                        onChange={(e) => setForm({...form, spO2: e.target.value})}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                            <div className="mt-8">
                                <motion.button 
                                    whileHover={!saving ? { scale: 1.02 } : {}}
                                    whileTap={!saving ? { scale: 0.98 } : {}}
                                    type="submit" 
                                    disabled={saving}
                                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {saving ? 'Saving...' : 'Save Vitals'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VitalsModal;