import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCpu, FiUser } from "react-icons/fi";

const slideIn = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const ChatArea = ({ messages, loading, chatEndRef }) => {
  return (
    <div className="chat-box flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50/30 dark:bg-[#0A0F1E]/20 glass-scroll scroll-smooth">
      <AnimatePresence initial={false}>
        {messages.map((msg, idx) => {
          if (msg.isSystem) return null; // Hide system messages
          const isUser = msg.role === "user";

          return (
            <motion.div
              key={idx}
              variants={slideIn}
              initial="hidden"
              animate="visible"
              className={`message-row flex w-full gap-3 ${
                isUser ? "row-user justify-end" : "row-ai justify-start"
              }`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1E293B] border border-black/[0.05] dark:border-white/[0.1] shadow-sm flex items-center justify-center text-[#2563EB] dark:text-cyan-400 flex-shrink-0 mt-1">
                  <FiCpu size={14} />
                </div>
              )}

              <div
                className={`message-bubble flex flex-col max-w-[85%] md:max-w-[75%] px-4 py-3 text-[14px] shadow-sm relative z-10
                ${
                  isUser
                    ? "bubble-user bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white rounded-[20px] rounded-tr-[4px] shadow-blue-500/20"
                    : "bubble-ai bg-white/90 dark:bg-white/[0.06] backdrop-blur-md text-slate-800 dark:text-[#F1F5F9] border border-black/[0.04] dark:border-white/[0.06] rounded-[20px] rounded-tl-[4px]"
                } ${
                  msg.isError
                    ? "bubble-error border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-900/10 text-red-600 dark:text-red-400"
                    : ""
                }`}
              >
                <div className="bubble-text leading-[1.5] whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 flex-shrink-0 mt-1 shadow-sm">
                  <FiUser size={14} />
                </div>
              )}
            </motion.div>
          );
        })}

        {loading && (
          <motion.div
            variants={slideIn}
            initial="hidden"
            animate="visible"
            className="message-row row-ai flex w-full gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1E293B] border border-black/[0.05] dark:border-white/[0.1] shadow-sm flex items-center justify-center text-[#2563EB] dark:text-cyan-400 flex-shrink-0 mt-1">
              <FiCpu size={14} />
            </div>
            <div className="message-bubble bubble-ai typing-indicator px-5 py-3.5 bg-white/90 dark:bg-white/[0.06] backdrop-blur-md border border-black/[0.04] dark:border-white/[0.06] rounded-[20px] rounded-tl-[4px] shadow-sm flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={chatEndRef} className="h-2" />
    </div>
  );
};

export default ChatArea;