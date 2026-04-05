// src/components/PrescriptionViewerModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import {
  glassSurface,
  textPrimary,
  textSecondary,
  textMuted,
} from "./dashboardTheme";

const PrescriptionViewerModal = ({ appointment, onClose }) => {
  const parsePrescriptionLines = (text) => {
    if (!text) return [];
    return text.split("\n").filter((line) => line.trim() !== "");
  };

  return (
    <AnimatePresence>
      {appointment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 dark:bg-[#0A0F1E]/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`${glassSurface} bg-white/90 dark:bg-[#0A0F1E]/95 relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <div>
                <h2
                  className={`text-lg md:text-xl font-semibold ${textPrimary}`}
                >
                  Prescription Details
                </h2>
                <p className={`text-sm mt-1 ${textMuted}`}>
                  For{" "}
                  <span className="font-medium">
                    {appointment.patientId?.name}
                  </span>
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${textMuted} hover:${textPrimary}`}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="mb-6">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                  Diagnosis
                </span>
                <p
                  className={`mt-2 text-base md:text-lg font-medium ${textPrimary}`}
                >
                  {appointment.diagnosis || "No diagnosis recorded"}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                  Medications
                </span>
                <div className="mt-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-4">
                  {appointment.prescription ? (
                    <ul
                      className={`space-y-2 pl-4 list-disc marker:text-cyan-500 ${textSecondary} text-sm md:text-base leading-relaxed`}
                    >
                      {parsePrescriptionLines(appointment.prescription).map(
                        (med, i) => (
                          <li key={i}>{med.replace("- ", "")}</li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className={`italic text-sm ${textMuted}`}>
                      No medications prescribed
                    </p>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                  Clinical Notes / Instructions
                </span>
                <div
                  className={`mt-3 whitespace-pre-wrap text-sm md:text-base leading-relaxed ${textSecondary}`}
                >
                  {appointment.doctorNotes || "No additional notes provided."}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PrescriptionViewerModal;
