import React from "react";
import { FiMenu, FiActivity } from "react-icons/fi";

const ChatHeader = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="chat-header h-[50px] px-5 flex items-center justify-between flex-shrink-0 border-b border-black/[0.05] dark:border-white/[0.06] bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-xl z-10">
      <div className="flex items-center gap-2">
        <button
          className="mobile-toggle-btn md:hidden p-1.5 -ml-1.5 text-slate-600 dark:text-slate-300 hover:bg-black/5 rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
        >
          <FiMenu size={20} />
        </button>
        <div className="w-7 h-7 rounded-[6px] bg-blue-50 dark:bg-cyan-900/30 text-[#2563EB] dark:text-cyan-400 flex items-center justify-center">
          <FiActivity size={16} />
        </div>
        <div>
          <h3 className="m-0 text-[0.9rem] font-bold text-slate-800 dark:text-[#F1F5F9]">
            MedSathi AI
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;