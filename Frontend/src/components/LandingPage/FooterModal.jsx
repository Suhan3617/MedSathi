import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { FOOTER_DATA } from "./footerData";

const FooterModal = ({ activeModal, setActiveModal }) => {
  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 modal-blur">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden p-8 z-10"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-2xl shadow-inner">
                  {FOOTER_DATA[activeModal]?.icon}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {FOOTER_DATA[activeModal]?.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-400 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="prose prose-slate dark:prose-invert max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                {FOOTER_DATA[activeModal]?.content}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/[0.05]">
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
              >
                Got it, thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FooterModal;