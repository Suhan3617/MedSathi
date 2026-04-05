import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
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

                  {/* Subtle divider before search bar */}
                  <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar */}
          <div className="flex items-center flex-1 bg-slate-100/70 dark:bg-[#ffffff06] border border-slate-200/60 dark:border-white/5 rounded-2xl px-4 py-2.5 focus-within:bg-white dark:focus-within:bg-[#0A0F1E] focus-within:ring-2 focus-within:ring-blue-500/30 dark:focus-within:ring-cyan-500/30 focus-within:border-blue-500/50 dark:focus-within:border-cyan-500/50 focus-within:shadow-[0_4px_20px_rgba(37,99,235,0.08)] dark:focus-within:shadow-[inset_0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 group">
            <FiSearch
              className="text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-cyan-400 transition-colors shrink-0"
              size={18}
            />
            <input
              type="text"
              placeholder={
                isMobile ? "Search..." : "Search patient records, doctors..."
              }
              className="w-full bg-transparent border-none outline-none ml-3 text-sm font-semibold text-slate-800 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:placeholder:text-[#64748B] m-0 p-0"
            />
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

          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 dark:text-[#CBD5E1] bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Notifications"
          >
            <FiBell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-white dark:border-[#0A0F1E]"></span>
          </motion.button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
