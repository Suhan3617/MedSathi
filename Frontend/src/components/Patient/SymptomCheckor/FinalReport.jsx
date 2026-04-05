import React from "react";
import { motion } from "framer-motion";
import { FiActivity, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getTriageColor } from "./triageUtils";

const FinalReport = ({ finalReport }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="final-report-card p-5 md:p-6"
    >
      <div
        className="bg-white/80 dark:bg-[#1E293B]/60 backdrop-blur-xl rounded-[20px] p-5 shadow-lg border border-black/[0.05] dark:border-white/[0.08] relative overflow-hidden"
        style={{
          borderTop: `4px solid ${getTriageColor(finalReport.triageLevel)}`,
        }}
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <FiActivity
            size={100}
            color={getTriageColor(finalReport.triageLevel)}
          />
        </div>

        <h3 className="report-title m-0 mb-4 text-lg font-bold text-slate-800 dark:text-[#F1F5F9] relative z-10">
          Assessment Complete
        </h3>

        <div className="report-grid grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative z-10">
          <div className="report-item bg-black/[0.02] dark:bg-white/[0.03] p-4 rounded-[14px] border border-black/[0.04] dark:border-white/[0.05]">
            <span className="report-label block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Severity Level
            </span>
            <span
              className="report-value flex items-center text-lg font-bold"
              style={{ color: getTriageColor(finalReport.triageLevel) }}
            >
              {finalReport.triageLevel === "High" ? (
                <FiAlertTriangle className="mr-2" />
              ) : null}
              {finalReport.triageLevel}
            </span>
          </div>
          <div className="report-item bg-black/[0.02] dark:bg-white/[0.03] p-4 rounded-[14px] border border-black/[0.04] dark:border-white/[0.05]">
            <span className="report-label block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Recommended Specialist
            </span>
            <span className="report-value flex items-center text-lg font-bold text-slate-800 dark:text-[#F1F5F9]">
              {finalReport.recommendedSpecialist}
            </span>
          </div>
        </div>

        <div className="report-summary bg-black/[0.02] dark:bg-white/[0.03] p-4 rounded-[14px] border border-black/[0.04] dark:border-white/[0.05] mb-5 relative z-10">
          <span className="report-label block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Summary
          </span>
          <p className="m-0 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {finalReport.summary}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-book w-full py-3.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-[14px] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 border border-white/10 transition-all relative z-10"
          onClick={() =>
            navigate(
              `/patient/find-doctors?specialty=${encodeURIComponent(
                finalReport.recommendedSpecialist
              )}`
            )
          }
        >
          Find a {finalReport.recommendedSpecialist || "Doctor"} <FiArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FinalReport;