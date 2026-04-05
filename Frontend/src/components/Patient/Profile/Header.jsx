import React from "react";
import { motion } from "framer-motion";
import { FiPrinter, FiLoader, FiSave, FiCheckCircle } from "react-icons/fi";

const Header = ({ handlePrint, activeTab, isDirty, saving }) => {
  return (
    <div className="header-flex flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
      <div className="flex-1">
        <h1 className="page-title text-2xl md:text-3xl font-bold text-slate-800 dark:text-[#F1F5F9] m-0 tracking-tight">
          Health Profile
        </h1>
        <p className="sub-title text-sm text-slate-500 dark:text-slate-400 mt-1 mb-0 font-medium">
          Manage your medical history and vital stats securely.
        </p>
      </div>
      <div className="header-actions flex gap-3 w-full md:w-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handlePrint}
          className="print-btn hidden md:flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] bg-white dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.1] text-slate-600 dark:text-slate-300 text-sm font-semibold shadow-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.1] transition-colors"
        >
          <FiPrinter /> Print Record
        </motion.button>
        {activeTab !== "settings" &&
          (isDirty ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              form="profile-form"
              disabled={saving}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-[12px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-sm font-bold shadow-lg shadow-cyan-500/25 border border-white/10 transition-all"
            >
              {saving ? (
                <FiLoader className="spinner animate-spin" />
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </motion.button>
          ) : (
            <button
              type="button"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-[12px] bg-black/[0.03] dark:bg-white/[0.02] text-slate-400 dark:text-slate-500 text-sm font-semibold border border-transparent cursor-default"
              disabled
            >
              <FiCheckCircle /> Up to date
            </button>
          ))}
      </div>
    </div>
  );
};

export default Header;