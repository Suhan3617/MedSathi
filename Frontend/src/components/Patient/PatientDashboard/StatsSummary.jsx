import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, glassCardClasses } from './dashboardConstants';

const StatsSummary = ({ stats }) => {
    return (
        <motion.div variants={fadeUp} className={glassCardClasses}>
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Activity</h3>
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-700/30">
                    <div className="text-xl font-black text-slate-700 dark:text-slate-200 mb-0.5">{stats.total}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Visits</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl text-center border border-emerald-100/50 dark:border-emerald-800/30">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-0.5">{stats.completed}</div>
                    <div className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase">Done</div>
                </div>
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl text-center border border-blue-100/50 dark:border-blue-800/30">
                    <div className="text-xl font-black text-blue-600 dark:text-blue-400 mb-0.5">{stats.online}</div>
                    <div className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">Online</div>
                </div>
            </div>
        </motion.div>
    );
};

export default StatsSummary;