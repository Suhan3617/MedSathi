import React from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";

const InputArea = ({ input, setInput, loading, handleSend }) => {
  return (
    <form className="input-area p-4 md:p-5 flex items-center gap-3" onSubmit={handleSend}>
      <div className="flex-1 bg-white/80 dark:bg-black/30 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.08] rounded-[24px] px-4 py-2 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-[#06B6D4]/40 transition-all">
        <input
          type="text"
          placeholder="Describe your symptoms here..."
          className="chat-input flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 h-full py-1.5"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />
      </div>
      <motion.button
        whileHover={!input.trim() || loading ? {} : { scale: 1.05 }}
        whileTap={!input.trim() || loading ? {} : { scale: 0.95 }}
        type="submit"
        className={`send-btn w-[46px] h-[46px] rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all shadow-sm
          ${
            loading || !input.trim()
              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-default"
              : "bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white hover:shadow-md hover:shadow-cyan-500/25"
          }`}
        disabled={loading || !input.trim()}
      >
        <FiSend size={16} className="ml-1" />
      </motion.button>
    </form>
  );
};

export default InputArea;