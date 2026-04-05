import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiPlus, FiMessageSquare, FiTrash2 } from "react-icons/fi";

const Sidebar = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  startNewChat,
  historyLoading,
  threads,
  activeThreadId,
  openThread,
  handleDeleteThread,
}) => {
  return (
    <>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div
        className={`absolute md:relative z-40 h-full w-[260px] flex-shrink-0 flex flex-col border-r transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                bg-white/95 dark:bg-[#0A0F1E]/95 md:bg-transparent md:dark:bg-transparent backdrop-blur-2xl
                border-black/[0.05] dark:border-white/[0.06] shadow-2xl md:shadow-none
                ${
                  mobileMenuOpen
                    ? "translate-x-0 sidebar-open"
                    : "-translate-x-full md:translate-x-0 sidebar-closed"
                }`}
      >
        <div className="p-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <h3 className="m-0 text-[0.9rem] font-semibold text-slate-800 dark:text-[#F1F5F9]">
              History
            </h3>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-toggle-btn md:hidden p-1.5 text-slate-500 hover:bg-black/5 rounded-lg"
            >
              <FiX size={18} />
            </button>
          </div>
          <button
            onClick={startNewChat}
            className="new-chat-btn w-full py-2.5 px-4 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] hover:shadow-lg hover:shadow-blue-500/20 text-white rounded-[10px] font-semibold text-[0.85rem] flex items-center justify-center gap-2 border border-white/10 transition-all"
          >
            <FiPlus size={16} /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 glass-scroll flex flex-col gap-1">
          <div className="historyTitle text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2 mt-2">
            Recent
          </div>

          {historyLoading ? (
            <div className="text-center py-5 text-[0.8rem] text-slate-400">
              Loading...
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-5 text-[0.8rem] text-slate-400 dark:text-slate-500 italic">
              No conversations
            </div>
          ) : (
            threads.map((thread) => {
              const isActive = activeThreadId === thread._id;
              return (
                <div
                  key={thread._id}
                  onClick={() => openThread(thread._id)}
                  className={`thread-item group flex items-center justify-between p-2.5 rounded-[8px] cursor-pointer transition-all border
                                        ${
                                          isActive
                                            ? "bg-black/[0.05] dark:bg-white/[0.08] border-black/[0.05] dark:border-white/[0.08] text-slate-800 dark:text-[#F1F5F9] font-semibold"
                                            : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.02]"
                                        }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FiMessageSquare size={12} className="flex-shrink-0" />
                    <span className="truncate text-[0.85rem] max-w-[120px]">
                      {thread.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteThread(e, thread._id)}
                    className="delete-btn p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;