import React, { useEffect, useState } from "react";
import { getPatientSummary } from "../services/api";
import {
  FiX,
  FiActivity,
  FiAlertCircle,
  FiClock,
  FiUser,
  FiLoader,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- DESIGN TOKENS (Tailwind Classes) ---
const glassSurfaceDesktop =
  "bg-white/85 dark:bg-[#0A0F1E]/90 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50 shadow-2xl";
const glassSurfaceMobile =
  "bg-white/90 dark:bg-[#0A0F1E]/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl";
const textPrimary = "text-slate-900 dark:text-slate-100";
const textSecondary = "text-slate-700 dark:text-slate-300";
const textMuted = "text-slate-500 dark:text-slate-400";
const primaryGradientBg =
  "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 text-white shadow-lg shadow-blue-500/25 dark:shadow-cyan-500/20 transition-all";

// --- ANIMATION VARIANTS ---
const desktopVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 30, stiffness: 250 },
  },
  exit: { x: "100%", transition: { duration: 0.3, ease: "easeInOut" } },
};

const mobileVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const PatientSnapshotDrawer = ({ isOpen, onClose, patientId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    if (isOpen && patientId) {
      fetchSummary();
    }
  }, [isOpen, patientId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await getPatientSummary(patientId);
      setData(res.data);
    } catch (error) {
      console.error("Failed to load patient summary", error);
    } finally {
      setLoading(false);
    }
  };

  // Render Content Helper to keep JSX clean
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500 dark:text-slate-400 gap-4">
          <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <span className="font-semibold text-sm">Loading Snapshot...</span>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-20 gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mb-2">
            <FiAlertCircle size={24} />
          </div>
          <div className="text-red-500 dark:text-red-400 font-semibold">
            Failed to load data.
          </div>
          <button
            onClick={fetchSummary}
            className="text-sm font-bold text-blue-600 dark:text-cyan-400 hover:underline focus:outline-none"
          >
            Retry Connection
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {/* Basic Info */}
        <div className="pb-6 border-b border-dashed border-slate-200 dark:border-slate-700/70">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 shrink-0 rounded-[14px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
              <FiUser size={24} />
            </div>
            <div className="overflow-hidden">
              <h2
                className={`m-0 text-xl font-extrabold truncate ${textPrimary}`}
              >
                {data.basic.name}
              </h2>
              <p className="m-0 mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                {data.basic.gender} <span className="mx-1.5 opacity-50">•</span>{" "}
                {data.basic.age} Years
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Blood
              </span>
              <span className={`font-bold text-base ${textPrimary}`}>
                {data.medical.bloodGroup}
              </span>
            </div>
            <div className="bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Height
              </span>
              <span className={`font-bold text-base ${textPrimary}`}>
                {data.medical.height}
              </span>
            </div>
            <div className="bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Weight
              </span>
              <span className={`font-bold text-base ${textPrimary}`}>
                {data.medical.weight}
              </span>
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="pb-6 border-b border-dashed border-slate-200 dark:border-slate-700/70">
          <label className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
            <FiActivity size={14} /> Active Conditions
          </label>
          <div className="flex flex-wrap gap-2">
            {data.medical.activeConditions.length > 0 ? (
              data.medical.activeConditions.map((cond, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/30"
                >
                  {cond.condition}
                </span>
              ))
            ) : (
              <span className="text-sm italic text-slate-400 dark:text-slate-500">
                No active conditions.
              </span>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div className="pb-6 border-b border-dashed border-slate-200 dark:border-slate-700/70">
          <label className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
            <FiAlertCircle size={14} /> Allergies
          </label>
          {data.medical.allergies.length > 0 ? (
            <div className="space-y-2">
              {data.medical.allergies.map((alg, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-slate-100 dark:border-slate-800 shadow-sm"
                >
                  <span className={`text-sm font-semibold ${textPrimary}`}>
                    {alg.allergen}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-md ${alg.severity === "Severe" ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
                  >
                    {alg.severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm italic text-slate-400 dark:text-slate-500">
              No known allergies.
            </span>
          )}
        </div>

        {/* Last Visit */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
            <FiClock size={14} /> Last Visit
          </label>
          {data.lastVisit ? (
            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-amber-700 dark:text-amber-500">
                  {data.lastVisit.reason}
                </span>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-600/80 bg-amber-100/50 dark:bg-amber-900/30 px-2 py-0.5 rounded">
                  {new Date(data.lastVisit.date).toLocaleDateString()}
                </span>
              </div>
              <p className="m-0 text-sm text-amber-800/80 dark:text-amber-400/80 italic leading-relaxed">
                "{data.lastVisit.notes || "No clinical notes provided."}"
              </p>
            </div>
          ) : (
            <span className="text-sm italic text-slate-400 dark:text-slate-500">
              First visit.
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-slate-900/40 dark:bg-[#0A0F1E]/80 backdrop-blur-sm"
          />

          {/* Drawer Container */}
          {isMobile ? (
            // Mobile Layout: Centered Popup Modal
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                variants={mobileVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`w-full max-w-sm max-h-[85vh] flex flex-col rounded-3xl pointer-events-auto overflow-hidden ${glassSurfaceMobile}`}
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-white/5 flex justify-between items-center shrink-0">
                  <h3
                    className={`m-0 text-lg font-bold flex items-center gap-2 ${textPrimary}`}
                  >
                    <FiActivity className="text-cyan-500" /> Patient Snapshot
                  </h3>
                  <button
                    onClick={onClose}
                    className={`p-1.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none ${textMuted} hover:${textPrimary}`}
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                  {renderContent()}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-white/5 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 ${primaryGradientBg}`}
                  >
                    Open Full Medical Profile
                  </motion.button>
                </div>
              </motion.div>
            </div>
          ) : (
            // Desktop Layout: Sliding Right Drawer
            <motion.div
              variants={desktopVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed top-0 right-0 z-[9999] h-[100dvh] w-[420px] flex flex-col rounded-l-[24px] overflow-hidden ${glassSurfaceDesktop}`}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-white/5 flex justify-between items-center shrink-0">
                <h3
                  className={`m-0 text-lg font-bold flex items-center gap-2 ${textPrimary}`}
                >
                  <FiActivity className="text-cyan-500" /> Patient Snapshot
                </h3>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors focus:outline-none ${textMuted} hover:${textPrimary}`}
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                {renderContent()}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-white/5 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 ${primaryGradientBg}`}
                >
                  Open Full Medical Profile
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Inject Custom Scrollbar Styles for Glass UI */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.3); border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.2); }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(148, 163, 184, 0.5); }
            `,
        }}
      />
    </AnimatePresence>
  );
};

export default PatientSnapshotDrawer;
