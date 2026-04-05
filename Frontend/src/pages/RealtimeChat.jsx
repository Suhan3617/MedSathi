import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SidebarChat from "../components/chat/SidebarChat";
import ChatWindow from "../components/chat/ChatWindow";
import { useAuth } from "../context/AuthContext";
import { FaComments } from "react-icons/fa";

const RealtimeChat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (location.state && location.state.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

  // Animation Variants
  const containerVariants = {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const emptyStateVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.2, duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md 
                       h-[calc(100vh-110px)] text-sm transition-all duration-500
                       bg-white/65 border-black/[0.05] 
                       dark:bg-[#E2E8F0]/[0.04] dark:border-white/[0.06] dark:shadow-2xl"
    >
      {/* --- SIDEBAR PANEL --- */}
      <div
        className={`w-full md:w-[350px] md:flex-shrink-0 border-r transition-all duration-300
                border-black/[0.03] dark:border-white/[0.04]
                ${selectedUser ? "hidden md:flex flex-col" : "flex flex-col"}`}
      >
        {/* 🔥 PURE TAILWIND SCROLLBAR (No <style> tag needed)
         */}
        <div
          className="flex-1 overflow-y-auto 
                                [&::-webkit-scrollbar]:w-[5px] 
                                [&::-webkit-scrollbar-track]:bg-transparent 
                                [&::-webkit-scrollbar-thumb]:bg-black/[0.1] 
                                dark:[&::-webkit-scrollbar-thumb]:bg-white/[0.1] 
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                hover:[&::-webkit-scrollbar-thumb]:bg-black/[0.2]
                                dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/[0.2]"
        >
          <SidebarChat
            currentUser={user}
            onSelectUser={(u) => setSelectedUser(u)}
            selectedUser={selectedUser}
            mobileView={true}
          />
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div
        className={`flex-1 flex flex-col relative transition-colors duration-500
                bg-gray-50/30 dark:bg-black/20
                ${!selectedUser ? "hidden md:flex" : "flex"}`}
      >
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key={selectedUser.id || "chat-active"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="h-full w-full"
            >
              <ChatWindow
                currentUser={user}
                otherUser={selectedUser}
                onBack={() => setSelectedUser(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              variants={emptyStateVariants}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            >
              {/* AI Glow Icon Container */}
              <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-blue-500/20 dark:bg-cyan-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <div
                  className="relative w-24 h-24 flex items-center justify-center rounded-3xl border 
                                              bg-white dark:bg-white/5 border-black/[0.05] dark:border-white/10 
                                              shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-500"
                >
                  <FaComments className="text-5xl text-blue-500 dark:text-cyan-400 opacity-90" />
                </div>
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 mb-3">
                Clinical Communications
              </h3>
              <p className="max-w-xs text-slate-500 dark:text-slate-400 leading-relaxed text-base">
                Select a consultation or colleague from the directory to begin
                your encrypted session.
              </p>

              {/* Subtle Medical-Grade AI Indicator */}
              <div className="mt-10 flex items-center gap-2 px-4 py-2 rounded-full border border-black/[0.03] dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.02]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  End-to-End Encrypted
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default RealtimeChat;
