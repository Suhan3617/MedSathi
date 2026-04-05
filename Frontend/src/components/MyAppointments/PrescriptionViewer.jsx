import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFileText, FiX } from "react-icons/fi";
import { modalVariants , overlayVariants } from "./animationVariants";

const PrescriptionViewer = ({ appointment, onClose }) => {
  if (!appointment) return null;
  const dateObj = new Date(appointment.appointmentDate);

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
          className="relative w-full max-w-2xl bg-white/95 dark:bg-[#0A0F1E]/95 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.08] rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-black/[0.05] dark:border-white/[0.06] flex justify-between items-start bg-white/50 dark:bg-white/[0.02]">
            <div>
              <h2 className="m-0 text-xl font-bold text-slate-800 dark:text-[#F1F5F9] flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-cyan-900/30 text-[#2563EB] dark:text-cyan-400">
                  <FiFileText size={18} />
                </div>
                Medical Prescription
              </h2>
              <p className="m-0 mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                Date: {dateObj.toLocaleDateString()} • {appointment.timeSlot}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-slate-500 dark:text-slate-300 rounded-full transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Patient & Doctor Info */}
          <div className="flex px-6 py-4 bg-black/[0.01] dark:bg-white/[0.01] border-b border-dashed border-black/[0.08] dark:border-white/[0.1]">
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Patient
              </div>
              <div className="font-bold text-slate-800 dark:text-[#F1F5F9] text-base">
                {appointment.patientId?.name || "Unknown Patient"}
              </div>
            </div>
            <div className="flex-1 border-l border-black/[0.05] dark:border-white/[0.1] pl-5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Doctor
              </div>
              <div className="font-bold text-[#2563EB] dark:text-cyan-400 text-base">
                {appointment.doctorId?.name || "Unknown Doctor"}
              </div>
            </div>
          </div>

          {/* Scrollable Clinical Details */}
          <div className="p-6 overflow-y-auto flex-1 glass-scroll">
            {/* Clinical Notes */}
            <div className="mb-6">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Clinical Notes
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-white/60 dark:bg-black/20 p-4 rounded-[16px] border border-black/[0.04] dark:border-white/[0.05] shadow-sm">
                {appointment.doctorNotes || (
                  <span className="italic text-slate-400">
                    No clinical notes provided.
                  </span>
                )}
              </div>
            </div>

            {/* Diagnosis */}
            <div className="mb-6">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Diagnosis
              </div>
              <div className="text-base font-semibold text-slate-800 dark:text-[#F1F5F9] bg-white/60 dark:bg-black/20 p-4 rounded-[16px] border border-black/[0.04] dark:border-white/[0.05] border-l-4 border-l-[#f59e0b] shadow-sm">
                {appointment.diagnosis || (
                  <span className="italic text-slate-400 font-normal">
                    Not specified
                  </span>
                )}
              </div>
            </div>

            {/* Medicines */}
            <div>
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="text-lg font-serif text-slate-800 dark:text-slate-200">
                  Rx
                </span>{" "}
                Medicines
              </div>
              <div className="bg-green-50/50 dark:bg-emerald-900/10 p-4 rounded-[16px] border border-green-100 dark:border-emerald-800/30 text-sm text-green-800 dark:text-emerald-300 whitespace-pre-wrap leading-relaxed shadow-sm">
                {appointment.prescription || (
                  <span className="italic opacity-70">
                    No medicines prescribed.
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrescriptionViewer;