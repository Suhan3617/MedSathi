import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fadeUp, glassCardClasses } from './dashboardConstants';

const ActivityChart = ({ chartData }) => {
    return (
        <motion.div variants={fadeUp} className={glassCardClasses}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Wellness Journey</h3>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/50">
                    <FiTrendingUp size={18} />
                </div>
            </div>
            
            <div className="h-[260px] w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} dx={-10} />
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: '12px', 
                                    border: '1px solid rgba(148, 163, 184, 0.2)', 
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                                    fontSize: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.95)',
                                    backdropFilter: 'blur(8px)',
                                    color: '#0F172A',
                                    fontWeight: 600
                                }} 
                            />
                            <Area type="monotone" dataKey="visits" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                        <FiActivity size={36} className="opacity-20 mb-3"/>
                        <span className="text-sm font-medium">No activity data yet.</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ActivityChart;