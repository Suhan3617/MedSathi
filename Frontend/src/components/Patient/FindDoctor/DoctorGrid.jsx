import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import DoctorCard from "./DoctorCard";

const DoctorGrid = ({ loading, filteredDoctors, handleBookClick }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin"></div>
        <p className="text-[#64748B] font-medium animate-pulse">
          Syncing with Clinical Database...
        </p>
      </div>
    );
  }

  if (!loading && filteredDoctors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-32 border-2 border-dashed border-black/5 dark:border-white/10 rounded-3xl"
      >
        <div className="bg-slate-100 dark:bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiSearch size={32} className="text-[#94A3B8]" />
        </div>
        <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">
          No Specialists Found
        </h3>
        <p className="text-[#64748B]">
          Try adjusting your search query or specialty filter.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <AnimatePresence mode="popLayout">
        {filteredDoctors.map((doc) => (
          <DoctorCard
            key={doc._id}
            doc={doc}
            handleBookClick={handleBookClick}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default DoctorGrid;
