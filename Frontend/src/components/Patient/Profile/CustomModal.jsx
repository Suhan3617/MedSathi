import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiAlertCircle, FiX, FiLoader } from "react-icons/fi";
import { inputClass } from "./sharedStyles";

const CustomModal = ({
  customModal,
  closeCustomModal,
  modalInput,
  setModalInput,
  modalLoading,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {customModal.isOpen && (
        <div
          className="custom-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
          onClick={closeCustomModal}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="custom-modal bg-white/95 dark:bg-[#0A0F1E]/95 backdrop-blur-xl rounded-[24px] w-full max-w-md border border-black/[0.05] dark:border-white/[0.08] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="custom-modal-header p-5 border-b border-black/[0.05] dark:border-white/[0.06] flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
              <h3
                className="custom-modal-title m-0 flex items-center gap-2 text-base font-bold"
                style={{
                  color: customModal.type === "danger" ? "#ef4444" : "#f59e0b",
                }}
              >
                {customModal.type === "danger" ? (
                  <FiAlertTriangle />
                ) : (
                  <FiAlertCircle />
                )}
                {customModal.title}
              </h3>
              <button
                onClick={closeCustomModal}
                className="text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="custom-modal-body p-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p className="m-0 mb-5">{customModal.message}</p>
              {customModal.requireInput && (
                <input
                  type="text"
                  className={inputClass}
                  placeholder={`Type '${customModal.inputMatch}' to confirm`}
                  value={modalInput}
                  onChange={(e) => setModalInput(e.target.value)}
                />
              )}
            </div>
            <div className="custom-modal-footer p-5 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.05] dark:border-white/[0.06] flex justify-end gap-3">
              <button
                className="px-5 py-2 text-sm font-semibold text-slate-500 hover:bg-black/5 dark:hover:bg-white/5 rounded-[12px] transition-colors"
                onClick={closeCustomModal}
                disabled={modalLoading}
              >
                Cancel
              </button>
              <button
                className={`px-5 py-2 text-sm font-bold text-white rounded-[12px] flex items-center gap-2 shadow-sm transition-all ${
                  customModal.type === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
                onClick={customModal.action}
                disabled={
                  modalLoading ||
                  (customModal.requireInput &&
                    modalInput !== customModal.inputMatch)
                }
              >
                {modalLoading ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  "Confirm Action"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;