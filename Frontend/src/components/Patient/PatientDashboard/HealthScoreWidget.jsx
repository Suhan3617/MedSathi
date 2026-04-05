import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, glassCardClasses } from './dashboardConstants';

const HealthScoreWidget = ({ healthScore, profile, radius, circumference }) => {
    return (
        <motion.div variants={fadeUp} className={`${glassCardClasses} flex flex-col items-center text-center`}>
            <div className="w-full flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Health Score</h3>
            </div>
            
            <div className="relative w-36 h-36 mb-4">
                <svg width="100%" height="100%" viewBox="0 0 120 120" className="transform -rotate-90 drop-shadow-md">
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8" />
                    <motion.circle 
                        cx="60" cy="60" r={radius} fill="none" 
                        stroke={healthScore > 75 ? "#06B6D4" : "#3B82F6"} 
                        strokeWidth="8"
                        strokeDasharray={circumference} 
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - (circumference * healthScore) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        strokeLinecap="round" 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{healthScore}</span>
                </div>
            </div>
            
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-6">
                {healthScore > 75 ? "Excellent! Keep it up." : "Complete your profile to improve."}
            </p>

            <div className="w-full flex justify-between pt-4 pb-1 border-t border-slate-100 dark:border-slate-800/50">
                <div className="text-center w-1/3">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Blood</div>
                    <div className="font-bold text-red-500 dark:text-red-400 text-sm">{profile?.bloodGroup || '--'}</div>
                </div>
                <div className="text-center w-1/3 border-l border-r border-slate-100 dark:border-slate-800/50">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Height</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{profile?.height ? `${profile.height}cm` : '--'}</div>
                </div>
                <div className="text-center w-1/3">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Weight</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{profile?.weight ? `${profile.weight}kg` : '--'}</div>
                </div>
            </div>

            {profile?.vitals ? (
                <div className="w-full mt-5 pt-5 border-t border-dashed border-slate-200 dark:border-slate-700/50 grid grid-cols-2 gap-2">
                    {profile.vitals.bloodPressure && (
                        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-2 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">BP</span>
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{profile.vitals.bloodPressure}</span>
                        </div>
                    )}
                    {profile.vitals.heartRate && (
                        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-2 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">HR</span>
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{profile.vitals.heartRate}</span>
                        </div>
                    )}
                    {profile.vitals.temperature && (
                        <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-2 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Temp</span>
                            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{profile.vitals.temperature}°F</span>
                        </div>
                    )}
                    {profile.vitals.spO2 && (
                        <div className="flex flex-col items-center bg-blue-50/50 dark:bg-cyan-900/10 border border-blue-100/50 dark:border-cyan-800/30 p-2 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-blue-400 dark:text-cyan-500 uppercase">SpO2</span>
                            <span className="font-bold text-sm text-blue-600 dark:text-cyan-400">{profile.vitals.spO2}%</span>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-xs text-slate-400 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50 font-medium italic w-full">No vitals logged today</p>
            )}
        </motion.div>
    );
};

export default HealthScoreWidget;