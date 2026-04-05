import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  setDoc,
  increment,
} from "firebase/firestore";
import { uploadChatFile } from "../../services/api";
import {
  FaPaperclip,
  FaPaperPlane,
  FaArrowLeft,
  FaCircle,
  FaTrash,
  FaTimes,
  FaFileAlt,
  FaLock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ChatWindow = ({ currentUser, otherUser, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef();

  const currentUserId = String(currentUser._id);
  const otherUserId = String(otherUser._id);
  const chatId = [currentUserId, otherUserId].sort().join("_");

  // --- MARK AS READ ---
  useEffect(() => {
    if (!chatId) return;

    const markAsRead = async () => {
      try {
        const chatRef = doc(db, "chats", chatId);
        await setDoc(
          chatRef,
          {
            unreadCounts: {
              [currentUserId]: 0,
            },
          },
          { merge: true },
        );
      } catch (error) {
        console.error("Error marking read:", error);
      }
    };

    if (messages.length > 0) {
      markAsRead();
    }
  }, [chatId, messages.length, currentUserId]);

  // --- FETCH MESSAGES ---
  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      setTimeout(
        () => scrollRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    });

    return () => unsubscribe();
  }, [chatId, currentUserId, otherUserId]);

  // --- SEND MESSAGE ---
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !file) || uploading) return;

    setUploading(true);
    try {
      let fileData = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await uploadChatFile(formData);

        const url = uploadRes.url || uploadRes.data?.url;
        const type = uploadRes.type || uploadRes.data?.type || "raw";
        const originalName =
          uploadRes.originalName || uploadRes.data?.originalName || file.name;

        if (!url)
          throw new Error(
            "Backend did not return a valid secure_url for the file.",
          );

        fileData = { url, type, name: originalName };
      }

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: currentUserId,
        senderName: currentUser.name,
        file: fileData,
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "chats", chatId),
        {
          participants: [currentUserId, otherUserId],
          participantDetails: [
            {
              _id: currentUserId,
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role,
            },
            {
              _id: otherUserId,
              name: otherUser.name,
              email: otherUser.email,
              role: otherUser.role || "User",
            },
          ],
          lastMessage:
            newMessage ||
            (fileData ? `📁 ${fileData.name}` : "Attachment sent"),
          lastUpdated: serverTimestamp(),
          unreadCounts: {
            [otherUserId]: increment(1),
          },
        },
        { merge: true },
      );

      setNewMessage("");
      setFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
      alert(
        "Failed to send message: " +
          (error.response?.data?.message || error.message || "Network Error"),
      );
    } finally {
      setUploading(false);
    }
  };

  // --- DELETE MESSAGE ---
  const handleDelete = async (messageId) => {
    if (!window.confirm("Delete message?")) return;
    try {
      await deleteDoc(doc(db, "chats", chatId, "messages", messageId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-transparent">
      {/* --- HEADER --- */}
      <div
        className="flex items-center justify-between px-4 py-3 sticky top-0 z-20
                      bg-white/65 dark:bg-[#0A0F1E]/70 backdrop-blur-xl 
                      border-b border-black/[0.05] dark:border-white/[0.06] shadow-sm"
      >
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mr-3 md:hidden p-2 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] rounded-full text-slate-600 dark:text-slate-300 transition-colors"
          >
            <FaArrowLeft size={14} />
          </motion.button>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#06B6D4] flex items-center justify-center text-white font-bold text-xs shadow-md border border-white/20">
              {otherUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#0A0F1E] rounded-full shadow-sm"></div>
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-slate-800 dark:text-[#F1F5F9] text-sm leading-tight tracking-tight">
              {otherUser.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                Secure Session
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar-glass">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500"
          >
            <div className="w-12 h-12 mb-3 rounded-full bg-blue-50 dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.05] flex items-center justify-center">
              <FaLock className="text-blue-300 dark:text-cyan-800/50" />
            </div>
            <p className="text-xs font-medium tracking-wide">
              End-to-End Encrypted
            </p>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = String(msg.senderId) === currentUserId;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex w-full group ${isMe ? "justify-end" : "justify-start"}`}
              >
                {isMe && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(msg.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 self-center mr-1"
                  >
                    <FaTrash size={11} />
                  </motion.button>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 text-[13px] md:text-sm flex flex-col relative z-10
                    ${
                      isMe
                        ? "bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white shadow-lg shadow-blue-500/20 dark:shadow-cyan-900/20 border border-white/10 rounded-[20px] rounded-br-[4px]"
                        : "bg-white/80 dark:bg-white/[0.06] backdrop-blur-md text-slate-800 dark:text-[#F1F5F9] border border-black/[0.04] dark:border-white/[0.06] shadow-sm rounded-[20px] rounded-bl-[4px]"
                    }`}
                >
                  {/* ATTACHMENTS */}
                  {msg.file && (
                    <div className="mb-2 mt-1">
                      {msg.file.type?.startsWith("image/") ? (
                        <a
                          href={msg.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-[200px] md:max-w-[260px] overflow-hidden rounded-xl border border-black/5 dark:border-white/10 hover:opacity-90 transition-opacity shadow-sm"
                        >
                          <img
                            src={msg.file.url}
                            alt={msg.file.name}
                            className="w-full h-auto object-cover"
                          />
                        </a>
                      ) : (
                        <a
                          href={msg.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors no-underline
                                   ${isMe ? "bg-black/10 border-white/20 hover:bg-black/20" : "bg-black/[0.03] dark:bg-black/40 border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-black/60"}`}
                        >
                          <div
                            className={`p-2 rounded-lg flex items-center justify-center
                                        ${isMe ? "bg-white/20 text-white" : "bg-white dark:bg-white/10 text-[#2563EB] dark:text-cyan-400 shadow-sm"}`}
                          >
                            <FaFileAlt size={14} />
                          </div>
                          <span className="truncate max-w-[140px] md:max-w-[180px] font-medium text-[12px]">
                            {msg.file.name || "Secure Document"}
                          </span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* TEXT CONTENT */}
                  {msg.text && (
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  )}

                  {/* TIMESTAMP */}
                  <span
                    className={`text-[10px] mt-1.5 block text-right font-medium
                        ${isMe ? "text-white/70" : "text-slate-400 dark:text-slate-500"}`}
                  >
                    {msg.createdAt?.toDate
                      ? msg.createdAt
                          .toDate()
                          .toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                      : "Sending..."}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={scrollRef} className="h-2" />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-3 md:p-4 bg-white/40 dark:bg-[#0A0F1E]/40 backdrop-blur-xl border-t border-black/[0.05] dark:border-white/[0.06] relative z-20">
        {/* SELECTED FILE POPUP */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute bottom-full left-4 mb-3 max-w-[85%] bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border border-black/[0.05] dark:border-white/[0.1] text-slate-700 dark:text-slate-200 px-3 py-2 rounded-xl shadow-lg flex items-center gap-3 text-xs z-30"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-cyan-900/30 flex items-center justify-center text-blue-500 dark:text-cyan-400">
                <FaPaperclip size={14} />
              </div>
              <span className="truncate max-w-[160px] font-medium">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="ml-auto p-1.5 bg-black/[0.05] dark:bg-white/[0.05] hover:bg-red-500 hover:text-white dark:hover:bg-red-500 rounded-full transition-colors"
              >
                <FaTimes size={10} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSend}
          className="relative flex items-end gap-2 md:gap-3"
        >
          <div className="flex-1 bg-white/60 dark:bg-black/20 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.08] rounded-[20px] px-2 py-1.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#06B6D4]/40 focus-within:border-transparent transition-all shadow-sm">
            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition-colors p-2.5 rounded-xl flex items-center justify-center
                    ${file ? "text-[#2563EB] dark:text-[#06B6D4] bg-blue-50/50 dark:bg-cyan-900/30" : "text-slate-400 hover:text-[#2563EB] dark:hover:text-[#06B6D4] hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"}`}
            >
              <FaPaperclip size={15} />
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,application/pdf,.doc,.docx"
              />
            </motion.label>

            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 dark:placeholder-slate-500 h-full py-2 outline-none"
              placeholder="Type a secure message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              autoComplete="off"
            />
          </div>

          <motion.button
            whileHover={!newMessage.trim() && !file ? {} : { scale: 1.05 }}
            whileTap={!newMessage.trim() && !file ? {} : { scale: 0.95 }}
            type="submit"
            disabled={(!newMessage.trim() && !file) || uploading}
            className={`w-[46px] h-[46px] rounded-[18px] flex items-center justify-center text-white shadow-sm transition-all flex-shrink-0
                ${
                  !newMessage.trim() && !file
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    : "bg-gradient-to-br from-[#2563EB] to-[#06B6D4] hover:shadow-lg hover:shadow-cyan-500/25"
                }`}
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaPaperPlane size={15} className="ml-1" />
            )}
          </motion.button>
        </form>
      </div>

      {/* Internal Styles for Glass Scrollbar */}
      <style>{`
        .custom-scrollbar-glass::-webkit-scrollbar { 
            width: 5px; 
        }
        .custom-scrollbar-glass::-webkit-scrollbar-track { 
            background: transparent; 
        }
        /* Light mode thumb */
        .custom-scrollbar-glass::-webkit-scrollbar-thumb { 
            background: rgba(15, 23, 42, 0.1); 
            border-radius: 10px; 
        }
        .custom-scrollbar-glass::-webkit-scrollbar-thumb:hover { 
            background: rgba(15, 23, 42, 0.2); 
        }
        /* Dark mode thumb */
        @media (prefers-color-scheme: dark) {
            .dark .custom-scrollbar-glass::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
            }
            .dark .custom-scrollbar-glass::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
