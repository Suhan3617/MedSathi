import React from "react";
import { motion } from "framer-motion";
import { FiActivity } from "react-icons/fi";

const HealthIDCard = ({ user, formData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="idCard printable-card relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 dark:from-[#0A0F1E] dark:to-slate-900 text-white rounded-[24px] p-6 shadow-2xl mb-8 border border-slate-700 dark:border-slate-800"
    >
      {/* Decorative Background Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2563EB]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#06B6D4]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="idHeader flex justify-between items-start md:items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
            <FiActivity size={20} className="text-[#06B6D4]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Algo<span className="text-[#06B6D4]">Med</span> Health ID
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 border border-slate-600 px-3 py-1 rounded-full bg-slate-800/50 backdrop-blur-sm">
          Official Record
        </span>
      </div>
      <div className="id-grid grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className="id-item bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-[16px]">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            Patient Name
          </div>
          <div className="text-lg font-bold text-white truncate">
            {user?.name || "Unknown Patient"}
          </div>
        </div>
        <div className="id-item bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-[16px]">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            Blood Group
          </div>
          <div className="text-lg font-bold text-rose-400">
            {formData.bloodGroup || "--"}
          </div>
        </div>
        <div className="id-item bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-[16px]">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            Date of Birth
          </div>
          <div className="text-lg font-bold text-white">
            {formData.dateOfBirth || "--"}
          </div>
        </div>
        <div className="id-item bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-[16px]">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">
            Emergency Contact
          </div>
          <div className="text-base font-bold text-white">
            {formData.emergencyContact.phone || "--"}
          </div>
          <div className="text-[11px] text-slate-400 truncate mt-0.5">
            {formData.emergencyContact.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthIDCard;