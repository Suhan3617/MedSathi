import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiCpu, FiUser } from "react-icons/fi";
import { SUGGESTED_CARDS } from "./chatSuggestions";

const ChatWindow = ({
  messages,
  loading,
  user,
  handlePromptClick,
  messagesEndRef,
}) => {
  const getGreetingTitle = () => {
    const role = user?.role?.toLowerCase();
    if (role === "patient") return "Patient";
    return "Doctor";
  };

  // Animation Variants
  const slideIn = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <div className="chat-window flex-1 overflow-y-auto p-4 md:p-5 flex flex-col gap-4 w-full max-w-[1000px] mx-auto glass-scroll scroll-smooth">
      {messages.length === 0 ? (
        <div className="empty-state h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-2.5">
          <h2 className="greeting-title m-0 mb-2 text-slate-800 dark:text-[#F1F5F9] text-[1.5rem] font-bold">
            Hello, {getGreetingTitle()}
          </h2>
          <p className="greeting-text max-w-[450px] text-center leading-[1.4] text-[0.9rem] mb-5">
            I can analyze reports or check symptoms. How can I help?
          </p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="suggestion-grid grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-[700px]"
          >
            {SUGGESTED_CARDS.map((item, i) => (
              <motion.div
                key={i}
                variants={slideIn}
                className="suggestion-card p-3 rounded-[10px] bg-white dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] cursor-pointer flex flex-col gap-1 text-left shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-[#06B6D4]/40 transition-all"
                onClick={() => handlePromptClick(item.text)}
              >
                <div className="text-[#2563EB] dark:text-[#06B6D4] text-[1rem] mb-0.5">
                  {item.icon}
                </div>
                <div className="text-[0.85rem] font-semibold text-slate-800 dark:text-slate-200">
                  {item.text}
                </div>
                <div className="text-[0.7rem] text-slate-400">
                  {item.category}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              className={`flex w-full gap-2.5 animate-[fadeIn_0.3s_ease-in-out] ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="w-[28px] h-[28px] rounded-[6px] bg-[#10b981] text-white flex items-center justify-center flex-shrink-0 text-[12px]">
                  <FiCpu size={14} />
                </div>
              )}

              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-[12px] text-[0.9rem] leading-[1.45] shadow-sm
                                ${
                                  isUser
                                    ? "bg-[#eff6ff] dark:bg-gradient-to-br dark:from-[#2563EB] dark:to-[#06B6D4] text-slate-900 dark:text-white rounded-tr-[2px]"
                                    : "bg-white dark:bg-white/[0.06] text-slate-800 dark:text-[#F1F5F9] border border-black/[0.04] dark:border-white/[0.06] rounded-tl-[2px]"
                                }`}
              >
                {msg.image && (
                  <div className="mb-2">
                    <img
                      src={msg.image}
                      alt="Upload"
                      className="max-w-full rounded-[8px] border border-black/10 dark:border-white/10"
                    />
                  </div>
                )}
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {isUser && (
                <div className="w-[28px] h-[28px] rounded-[6px] bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 text-[12px]">
                  <FiUser size={14} />
                </div>
              )}
            </div>
          );
        })
      )}

      {loading && (
        <div className="flex w-full gap-2.5 justify-start animate-[fadeIn_0.3s_ease-in-out]">
          <div className="w-[28px] h-[28px] rounded-[6px] bg-[#10b981] text-white flex items-center justify-center flex-shrink-0 text-[12px]">
            <FiCpu size={14} />
          </div>
          <div className="bg-[#f1f5f9] dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 italic px-3 py-2 rounded-[12px] rounded-tl-[2px] text-[0.85rem]">
            <span className="inline-block animate-pulse">Thinking...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;