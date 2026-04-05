// src/components/DashboardOverview.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiVideo,
  FiMapPin,
  FiFileText,
  FiEye,
} from "react-icons/fi";
import {
  staggerContainer,
  fadeUp,
  glassInteractive,
  glassSurface,
  textPrimary,
  textMuted,
  primaryGradientBg,
} from "./dashboardTheme";

const DashboardOverview = ({
  priorityStats,
  loading,
  todayAppointments,
  handlePatientClick,
  startConsultation,
  setActiveCallAppt,
  setViewingPrescriptionAppt,
}) => {
  return (
    <motion.div
      key="overview"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      className="space-y-6 md:space-y-8"
    >
      {/* Priority Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Urgent Card */}
        <motion.div
          variants={fadeUp}
          className={`${glassInteractive} bg-red-50/60 dark:bg-red-900/10 border-red-200/50 dark:border-red-500/20 p-5 md:p-6 relative overflow-hidden group`}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-500"></div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-red-700 dark:text-red-400 text-xs tracking-wider uppercase">
              Urgent Attention
            </span>
            <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400">
              <FiAlertTriangle size={18} />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-extrabold text-red-800 dark:text-red-300 leading-none mb-2">
            {priorityStats.highRisk}
          </h3>
          <p className="text-sm font-medium text-red-700/80 dark:text-red-400/80">
            Patients tagged with critical alerts
          </p>
        </motion.div>

        {/* Up Next Card */}
        <motion.div
          variants={fadeUp}
          className={`${glassInteractive} bg-amber-50/60 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-500/20 p-5 md:p-6 relative overflow-hidden group`}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-amber-700 dark:text-amber-400 text-xs tracking-wider uppercase">
              Up Next
            </span>
            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-full text-amber-600 dark:text-amber-400">
              <FiClock size={18} />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-extrabold text-amber-800 dark:text-amber-300 leading-none mb-2">
            {priorityStats.pending}
          </h3>
          <p className="text-sm font-medium text-amber-700/80 dark:text-amber-400/80">
            Scheduled appointments awaiting start
          </p>
        </motion.div>

        {/* Standard Care Card */}
        <motion.div
          variants={fadeUp}
          className={`${glassInteractive} bg-emerald-50/60 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-500/20 p-5 md:p-6 relative overflow-hidden group`}
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-500"></div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs tracking-wider uppercase">
              Standard Care
            </span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400">
              <FiCheckCircle size={18} />
            </div>
          </div>
          <h3 className="text-4xl md:text-5xl font-extrabold text-emerald-800 dark:text-emerald-300 leading-none mb-2">
            {priorityStats.routine}
          </h3>
          <p className="text-sm font-medium text-emerald-700/80 dark:text-emerald-400/80">
            Regular follow-ups and general visits
          </p>
        </motion.div>
      </div>

      {/* Schedule Table */}
      <motion.div
        variants={fadeUp}
        className={`${glassSurface} overflow-hidden flex flex-col`}
      >
        <div className="p-5 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/20">
          <h3 className={`text-lg md:text-xl font-bold ${textPrimary}`}>
            Today's Schedule
          </h3>
        </div>

        {loading ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className={textMuted}>Syncing appointments...</p>
          </div>
        ) : todayAppointments.length === 0 ? (
          <div className={`p-12 text-center ${textMuted}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <FiCheckCircle size={24} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium">
              No appointments scheduled today.
            </p>
            <p className="text-sm mt-1 opacity-70">Take a breather, Doctor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-700/50">
                <tr>
                  {["Time", "Patient Name", "Mode", "Action"].map((head) => (
                    <th
                      key={head}
                      className="py-4 px-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                {todayAppointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td
                      className={`py-4 px-6 font-semibold text-sm ${textPrimary}`}
                    >
                      {appt.timeSlot}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handlePatientClick(appt.patientId?._id)
                          }
                          className="font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 hover:underline transition-colors text-sm text-left focus:outline-none"
                        >
                          {appt.patientId?.name || "Unknown Patient"}
                        </button>
                        {appt.riskTag === "High Risk" && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100/80 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-[10px] font-bold tracking-wide">
                            HIGH RISK
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {appt.type === "Online" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/60 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold border border-blue-200/50 dark:border-blue-500/20">
                          <FiVideo size={14} /> Video Call
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/60 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200/50 dark:border-emerald-500/20">
                          <FiMapPin size={14} /> In-Clinic
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {appt.status !== "Completed" ? (
                        <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startConsultation(appt)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${primaryGradientBg}`}
                            title="Write Prescription"
                          >
                            <FiFileText size={14} /> Rx
                          </motion.button>
                          {appt.type === "Online" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveCallAppt(appt)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 transition-all"
                              title="Start Video Call"
                            >
                              <FiVideo size={14} /> Call
                            </motion.button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <FiCheckCircle size={16} /> Done
                          </span>
                          <motion.button
                            whileHover={{
                              scale: 1.05,
                              backgroundColor: "rgba(6, 182, 212, 0.05)",
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewingPrescriptionAppt(appt)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300/50 dark:border-slate-600/50 text-xs font-semibold text-slate-600 dark:text-cyan-400 transition-all hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-300"
                          >
                            <FiEye size={14} /> View Rx
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
