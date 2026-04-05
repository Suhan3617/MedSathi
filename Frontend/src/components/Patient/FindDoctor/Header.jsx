import React from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">
          Find{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
            Specialists
          </span>
        </h1>
        <p className="text-[#64748B] dark:text-[#CBD5E1] text-lg">
          AI-powered scheduling for premium clinical care.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative group w-full md:w-96"
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <FiSearch className="text-[#94A3B8] group-focus-within:text-[#06B6D4] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search doctors or symptoms..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/10 outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] text-[#0F172A] dark:text-white transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>
    </header>
  );
};

export default Header;