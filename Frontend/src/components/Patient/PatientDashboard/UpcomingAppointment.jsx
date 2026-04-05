import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiVideo } from 'react-icons/fi';
import { fadeUp } from './dashboardConstants';

const UpcomingAppointment = ({ nextAppointment, nextDate }) => {
    return (
        <motion.div variants={fadeUp}>
            {nextAppointment ? (
                <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-600 to-cyan-500 p-8 sm:p-10 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30 dark:border-white/10">
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 pointer-events-none"></div>
                    <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-blue-900/20 backdrop-blur-xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-white/20 shadow-sm">
                                Upcoming Visit
                            </span>
                            <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                                {nextAppointment.type === 'Online' ? <FiVideo size={22} /> : <FiMapPin size={22} />}
                            </div>
                        </div>
                        
                        <div>
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-2 drop-shadow-sm">
                                {nextDate.time}
                            </h2>
                            <div className="text-lg lg:text-xl text-blue-50 font-semibold opacity-90">
                                {nextDate.weekday}, {nextDate.day} {nextDate.month}
                            </div>
                            
                            <div className="mt-8 pt-5 border-t border-white/20 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm sm:text-base font-medium text-blue-50">
                                <span className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">Dr</div>
                                    {nextAppointment.doctorId?.name}
                                </span>
                                <span className="hidden sm:inline opacity-40">•</span>
                                <span className="opacity-90">{nextAppointment.reason}</span>
                            </div>
                        </div>
                    </div>
                    
                    {nextAppointment.videoLink && (
                        <motion.a 
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            href={nextAppointment.videoLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="relative z-10 mt-8 block w-full bg-white hover:bg-slate-50 text-blue-600 text-center py-3.5 rounded-xl text-sm font-extrabold tracking-wide transition-all shadow-md"
                        >
                            Join Video Consultation
                        </motion.a>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center rounded-[28px] bg-slate-50 dark:bg-slate-900/50 p-10 shadow-sm border border-slate-200/60 dark:border-slate-700/50">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-full mb-4">
                        <FiCalendar size={40} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Upcoming Appointments</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">You're all caught up. Need to see a doctor? Book a new consultation anytime.</p>
                    <Link to="/patient/find-doctors">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
                        >
                            Book New Visit
                        </motion.button>
                    </Link>
                </div>
            )}
        </motion.div>
    );
};

export default UpcomingAppointment;