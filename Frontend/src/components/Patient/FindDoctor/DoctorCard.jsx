import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiActivity, FiCheckCircle } from "react-icons/fi";

const DoctorCard = ({ doc, handleBookClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-white/60 dark:bg-[#E2E8F0]/[0.04] backdrop-blur-xl rounded-[24px] border border-black/5 dark:border-white/10 overflow-hidden shadow-xl shadow-black/[0.02] dark:shadow-black/20"
    >
      {/* Card Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-[#06B6D4]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="p-6 flex-1">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {(doc.name || "D").charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">
              Dr. {doc.name}
            </h3>
            <p className="text-[#2563EB] dark:text-[#06B6D4] font-semibold text-sm uppercase tracking-wider">
              {doc.specialization}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <FiStar className="fill-amber-400 text-amber-400" size={14} />
              <span className="text-sm font-bold dark:text-white">
                {doc.rating > 0 ? Number(doc.rating).toFixed(1) : "New"}
              </span>
              <span className="text-xs text-[#94A3B8]">
                ({doc.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#334155] dark:text-[#CBD5E1] text-sm">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FiActivity size={16} />
            </div>
            <span>{doc.experience} Years of Clinical Expertise</span>
          </div>

          <div className="flex items-center gap-3 text-[#334155] dark:text-[#CBD5E1] text-sm">
            <div
              className={`p-2 rounded-lg ${
                doc.availableSlots?.length > 0
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                  : "bg-slate-50 dark:bg-white/5 text-slate-400"
              }`}
            >
              <FiCheckCircle size={16} />
            </div>
            <span
              className={
                doc.availableSlots?.length > 0
                  ? "text-emerald-600 font-semibold"
                  : ""
              }
            >
              {doc.availableSlots?.length > 0
                ? "Accepting Patients"
                : "Currently Fully Booked"}
            </span>
          </div>

          {/* Symptoms Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {doc.symptomsTreated?.slice(0, 3).map((sym, i) => (
              <span
                key={i}
                className="px-3 py-1 text-[11px] font-bold uppercase tracking-tight rounded-md bg-[#2563EB]/10 dark:bg-[#06B6D4]/10 text-[#2563EB] dark:text-[#06B6D4] border border-[#2563EB]/20 dark:border-[#06B6D4]/20"
              >
                {sym}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/5 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-widest mb-1">
            Consultation Fee
          </p>
          <p className="text-2xl font-black text-[#0F172A] dark:text-white">
            ₹{doc.fees}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => handleBookClick(doc)}
          disabled={!doc.availableSlots?.length}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-cyan-500/40 disabled:opacity-30 disabled:grayscale transition-all"
        >
          Book Visit
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
