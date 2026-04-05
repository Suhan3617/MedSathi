import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const ProfileMessages = ({ message }) => {
  return (
    <AnimatePresence>
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-[16px] mb-6 text-sm font-semibold border flex items-center gap-3 shadow-sm ${
            message.type === "success"
              ? "bg-green-50/80 dark:bg-emerald-900/20 text-green-700 dark:text-emerald-400 border-green-200 dark:border-emerald-900/50"
              : "bg-red-50/80 dark:bg-rose-900/20 text-red-700 dark:text-rose-400 border-red-200 dark:border-rose-900/50"
          }`}
        >
          {message.type === "success" ? (
            <FiCheckCircle size={18} />
          ) : (
            <FiAlertCircle size={18} />
          )}{" "}
          {message.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileMessages;