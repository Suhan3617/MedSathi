import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiZap } from 'react-icons/fi';
import { fadeUp } from './dashboardConstants';

const DashboardHeader = ({ user, tip }) => {
    return (
        <motion.div variants={fadeUp} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Hello, {user?.name ? user.name.split(' ')[0] : 'Patient'} 👋
                </h1>
                <div className="inline-flex items-center gap-2 mt-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                    <FiSun className="text-amber-500" size={14} />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            <motion.div 
                whileHover={{ scale: 1.02 }}
                className="w-full lg:max-w-md flex items-center gap-4 p-4 rounded-[20px] bg-gradient-to-r from-emerald-50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/10 border border-emerald-200/50 dark:border-emerald-500/20 shadow-sm"
            >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                    <FiZap size={18} />
                </div>
                <div className="flex-1">
                    <div className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-400 mb-0.5 tracking-wider">Daily Insight</div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 font-medium italic">"{tip}"</div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardHeader;
