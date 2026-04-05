import React from "react";
import { motion } from "framer-motion";
import { FiHeart, FiFileText, FiSettings } from "react-icons/fi";

const TabsNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "vitals", icon: <FiHeart />, label: "Vitals & Lifestyle" },
    { id: "history", icon: <FiFileText />, label: "Medical Records" },
    { id: "settings", icon: <FiSettings />, label: "Account Settings" },
  ];

  return (
    <div className="tabs-nav no-print flex gap-2 mb-8 border-b border-black/[0.05] dark:border-white/[0.06] overflow-x-auto glass-scroll relative">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`tab-item px-5 py-3.5 text-sm font-bold flex items-center gap-2.5 transition-colors relative whitespace-nowrap
            ${
              activeTab === tab.id
                ? "text-[#2563EB] dark:text-cyan-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
        >
          {tab.icon} {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] dark:bg-cyan-400"
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;