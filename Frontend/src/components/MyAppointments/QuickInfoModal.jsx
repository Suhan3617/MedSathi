import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiActivity, FiX, FiAlertCircle } from "react-icons/fi";
import { getPatientSummary } from "../../services/api";
import { modalVariants , overlayVariants } from "./animationVariants";

const QuickInfoModal = ({ patientId, onClose }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getPatientSummary(patientId);
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchSummary();
  }, [patientId]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-md bg-white/95 dark:bg-[#0A0F1E]/95 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.08] rounded-[24px] shadow-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-black/[0.05] dark:border-white/[0.06] flex justify-between items-center bg-white/50 dark:bg-white/[0.02]">
            <h3 className="m-0 text-base font-bold text-slate-800 dark:text-[#F1F5F9] flex items-center gap-2">
              <FiActivity className="text-[#06B6D4]" /> Patient Snapshot
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="w-6 h-6 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                  Retrieving Records...
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex gap-4 items-center p-4 bg-black/[0.02] dark:bg-white/[0.02] rounded-[16px] border border-black/[0.03] dark:border-white/[0.04]">
                  <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {summary?.basicInfo?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-[#F1F5F9] text-base">
                      {summary?.basicInfo?.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {summary?.basicInfo?.gender} • {summary?.basicInfo?.age}{" "}
                      Years
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <FiActivity /> Active Conditions
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary?.medicalHistory
                      ?.filter((h) => h.status === "Active")
                      .map((c, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-lg font-semibold"
                        >
                          {c.condition}
                        </span>
                      )) || (
                      <span className="text-xs text-slate-400 italic">
                        None reported
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <FiAlertCircle /> Allergies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {summary?.allergies?.map((a, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 rounded-lg font-semibold"
                      >
                        {a.allergy}
                      </span>
                    )) || (
                      <span className="text-xs text-slate-400 italic">
                        None reported
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickInfoModal;