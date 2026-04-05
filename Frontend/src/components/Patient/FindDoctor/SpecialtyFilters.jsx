import React from "react";
import { motion } from "framer-motion";
import { SPECIALTIES } from "./specialties";

const SpecialtyFilters = ({ selectedSpecialty, setSelectedSpecialty }) => {
  return (
    <div className="mb-10 overflow-x-auto no-scrollbar pb-2">
      <div className="flex gap-3">
        {SPECIALTIES.map((spec, idx) => (
          <motion.button
            key={spec}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
              selectedSpecialty === spec
                ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white border-transparent shadow-lg shadow-blue-500/20"
                : "bg-white/50 dark:bg-white/5 text-[#64748B] dark:text-[#CBD5E1] border-black/5 dark:border-white/10 hover:border-[#06B6D4]/50 backdrop-blur-md"
            }`}
          >
            {spec}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyFilters;