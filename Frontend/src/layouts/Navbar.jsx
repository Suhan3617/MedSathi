import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiMenu,
  FiMoon,
  FiSun,
  FiActivity,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ onMenuClick, isMobile, isOpen }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  // Initialize Dark Mode based on localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <nav className="sticky top-0 z-40 h-[76px] w-full bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/5 transition-colors duration-300">
      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* --- LEFT SECTION --- */}
        <div className="flex items-center gap-3 sm:gap-5 flex-1 max-w-full lg:max-w-[600px]">
          <div className="flex items-center gap-3 shrink-0">
            {/* Sleek Ghost Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 outline-none group"
              aria-label="Toggle Sidebar"
            >
              <FiMenu
                size={24}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </motion.button>

            {/* 🔥 Dynamic AlgoMed Logo (Navbar Version) */}
            <AnimatePresence>
              {/* Logo shows if Sidebar is CLOSED, OR if we are on MOBILE */}
              {(!isOpen || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, x: -15, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -15, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 shrink-0">
                    <FiActivity size={18} strokeWidth={2.5} />
                  </div>
                  <span className="text-[1.15rem] font-extrabold text-slate-900 dark:text-[#F1F5F9] tracking-tight mr-2">
                    Med
                    <span className="text-blue-600 dark:text-cyan-400">
                      Sathi
                    </span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT SECTION (ACTIONS) --- */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 dark:text-amber-300 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;