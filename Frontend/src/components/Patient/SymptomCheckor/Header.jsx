import React from "react";
import { FiActivity } from "react-icons/fi";

const Header = () => {
  return (
    <div className="chat-header px-5 py-4 flex items-center justify-between flex-shrink-0 border-b border-black/[0.05] dark:border-white/[0.06] bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-xl z-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-blue-50 dark:bg-cyan-900/30 border border-blue-100 dark:border-cyan-800/50 flex items-center justify-center text-[#2563EB] dark:text-cyan-400 shadow-sm">
          <FiActivity size={20} />
        </div>
        <div>
          <h2 className="header-title m-0 text-base md:text-lg font-bold text-slate-800 dark:text-[#F1F5F9] tracking-tight flex items-center">
            MedSathi AI Symptom Checker
          </h2>
          <p className="header-subtitle m-0 mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Get a quick preliminary assessment
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;