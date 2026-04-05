import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiActivity, FiArrowRight } from 'react-icons/fi';
import { fadeUp } from './dashboardConstants';

const QuickActions = ({ onOpenVitals }) => {
    return (
        <motion.div variants={fadeUp}>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 px-1">Actions</h3>
            
            <div className="flex flex-col gap-3">
                <Link to="/patient/find-doctors">
                    <motion.div 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/50 rounded-2xl cursor-pointer shadow-sm hover:border-blue-400 dark:hover:border-blue-500/50 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 transition-transform">
                                <FiMapPin size={18} />
                            </div>
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Find a Specialist</span>
                        </div>
                        <FiArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" size={16} />
                    </motion.div>
                </Link>

                <motion.div 
                    onClick={onOpenVitals}
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/50 rounded-2xl cursor-pointer shadow-sm hover:border-orange-400 dark:hover:border-orange-500/50 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-50 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-500 dark:text-orange-400 transition-transform">
                            <FiActivity size={18} />
                        </div>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Update Vitals</span>
                    </div>
                    <FiArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors" size={16} />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default QuickActions;