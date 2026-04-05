// src/components/AnalyticsPanel.jsx
import React from "react";
import { motion } from "framer-motion";
import { FiInfo, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fadeUp,
  staggerContainer,
  glassSurface,
  glassInteractive,
  textPrimary,
  textMuted,
} from "./dashboardTheme";

const AnalyticsPanel = ({ analyticsData }) => {
  if (!analyticsData)
    return (
      <div className="p-10 text-center text-slate-500 dark:text-slate-400">
        <p>Not enough data available for analytics yet.</p>
      </div>
    );

  const total = analyticsData.totalAppointments || 1;
  const completedPct = Math.round(
    (analyticsData.breakdown.completed / total) * 100,
  );
  const scheduledPct = Math.round(
    (analyticsData.breakdown.scheduled / total) * 100,
  );
  const cancelledPct = Math.round(
    (analyticsData.breakdown.cancelled / total) * 100,
  );

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {[
          {
            val: analyticsData.totalPatients,
            label: "Total Patient Base",
            sub: "Distinct Individuals Treated",
            color: "text-blue-500 dark:text-blue-400",
          },
          {
            val: analyticsData.totalAppointments,
            label: "Total Consultations",
            sub: "All Completed Appointments",
            color: "text-emerald-500 dark:text-emerald-400",
          },
          {
            val: `${analyticsData.visitTypes.online} / ${analyticsData.visitTypes.offline}`,
            label: "Consultation Mode",
            sub: "Virtual / In-Clinic Split",
            color: "text-amber-500 dark:text-amber-400",
          },
          {
            val: "98%",
            label: "Patient Satisfaction",
            sub: "Based on Post-Visit Surveys",
            color: "text-purple-500 dark:text-purple-400",
          },
        ].map((item, idx) => (
          <motion.div
            variants={fadeUp}
            key={idx}
            className={`${glassInteractive} p-5 flex flex-col items-center justify-center text-center relative`}
          >
            <div className="absolute top-3 right-3 text-slate-400 dark:text-slate-500 hover:text-cyan-500 cursor-pointer transition-colors">
              <FiInfo size={14} />
            </div>
            <h3
              className={`text-3xl lg:text-4xl font-extrabold mb-1 ${item.color}`}
            >
              {item.val}
            </h3>
            <p className={`font-semibold text-sm md:text-base ${textPrimary}`}>
              {item.label}
            </p>
            <p className={`text-xs mt-1 ${textMuted}`}>{item.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          variants={fadeUp}
          className={`${glassSurface} p-5 lg:p-6 lg:col-span-2 h-[360px] flex flex-col`}
        >
          <h3 className={`mb-4 font-semibold text-lg ${textPrimary}`}>
            Patient Volume (Last 7 Days)
          </h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.weeklyTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(148, 163, 184, 0.15)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  }}
                  itemStyle={{ color: "#06B6D4" }}
                />
                <Bar
                  dataKey="visits"
                  fill="#06B6D4"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={`${glassSurface} p-5 lg:p-6 h-[360px] flex flex-col`}
        >
          <h3 className={`mb-4 font-semibold text-lg ${textPrimary}`}>
            Appointment Status
          </h3>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {[
              {
                label: "Completed",
                pct: completedPct || 0,
                val: analyticsData.breakdown.completed,
                icon: <FiCheckCircle size={18} />,
                bg: "bg-emerald-100/50 dark:bg-emerald-900/30",
                color: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Scheduled",
                pct: scheduledPct || 0,
                val: analyticsData.breakdown.scheduled,
                icon: <FiClock size={18} />,
                bg: "bg-blue-100/50 dark:bg-blue-900/30",
                color: "text-blue-600 dark:text-blue-400",
              },
              {
                label: "Cancelled",
                pct: cancelledPct || 0,
                val: analyticsData.breakdown.cancelled,
                icon: <FiXCircle size={18} />,
                bg: "bg-red-100/50 dark:bg-red-900/30",
                color: "text-red-600 dark:text-red-400",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between pb-3 ${idx !== 2 ? "border-b border-slate-200/50 dark:border-slate-700/50" : ""}`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${textPrimary}`}>
                      {stat.label}
                    </p>
                    <p className={`text-xs ${textMuted}`}>
                      {stat.pct}% of total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${textPrimary}`}>
                    {stat.val}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel;
