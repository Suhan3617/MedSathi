import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  sendChatMessage,
  getUserThreads,
  getThreadMessages,
  deleteThread,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

// Sub-components
import Sidebar from "../components/AIchat/Sidebar";
import ChatHeader from "../components/AIchat/ChatHeader";
import ChatWindow from "../components/AIchat/ChatWindow";
import MessageInput from "../components/AIchat/MessageInput";

const AIChat = () => {
  const { user } = useAuth();

  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // --- Effects ---
  useEffect(() => {
    loadThreads();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- API Interactions ---
  const loadThreads = async () => {
    try {
      const res = await getUserThreads();
      setThreads(res.data || []);
    } catch (err) {
      console.error("Failed to load threads", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const openThread = async (threadId) => {
    setLoading(true);
    setActiveThreadId(threadId);
    setMobileMenuOpen(false);
    try {
      const res = await getThreadMessages(threadId);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveThreadId(null);
    setMessages([]);
    setMobileMenuOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setTimeout(() => {
      const inputEl = document.querySelector('input[type="text"]');
      if (inputEl) inputEl.focus();
    }, 100);
  };

  const handleDeleteThread = async (e, threadId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation?")) return;

    try {
      await deleteThread(threadId);
      setThreads((prev) => prev.filter((t) => t._id !== threadId));
      if (activeThreadId === threadId) {
        startNewChat();
      }
    } catch (err) {
      console.error("Failed to delete thread", err);
    }
  };

  // --- File Handling ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Please upload files under 5MB.");
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // --- Message Sending ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedFile) return;

    const currentMsg = inputMessage;
    const currentFile = selectedFile;
    const currentPreview = previewUrl;

    setInputMessage("");
    clearFile();

    const tempMsg = {
      role: "user",
      content: currentMsg,
      image: currentPreview,
    };

    const tempMessages = [...messages, tempMsg];
    setMessages(tempMessages);
    setLoading(true);

    try {
      let base64File = null;
      let mimeType = null;

      if (currentFile) {
        base64File = await convertToBase64(currentFile);
        mimeType = currentFile.type;
      }

      const res = await sendChatMessage(
        currentMsg,
        activeThreadId,
        base64File,
        mimeType
      );

      setMessages([...tempMessages, { role: "assistant", content: res.reply }]);

      if (!activeThreadId && res.threadId) {
        setActiveThreadId(res.threadId);
        loadThreads();
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (promptText) => {
    setInputMessage(promptText);
    const inputEl = document.querySelector('input[type="text"]');
    if (inputEl) inputEl.focus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="app-container flex overflow-hidden rounded-2xl border shadow-xl backdrop-blur-md 
                       h-[calc(100vh-110px)] text-sm transition-all duration-500 relative
                       bg-white/65 border-black/[0.05] 
                       dark:bg-[#E2E8F0]/[0.04] dark:border-white/[0.06] dark:shadow-2xl"
    >
      {/* Pure Tailwind scrollbars and markdown reset injected cleanly */}
      <style>{`
        .markdown-content p { margin-bottom: 0.5em; line-height: 1.6; }
        .markdown-content p:last-child { margin-bottom: 0; }
        .markdown-content ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
        .markdown-content strong { font-weight: 600; color: inherit; }
        .markdown-content code { background: rgba(0,0,0,0.05); padding: 0.2em 0.4em; border-radius: 4px; }
        .dark .markdown-content code { background: rgba(255,255,255,0.1); }
        
        .glass-scroll::-webkit-scrollbar { width: 5px; }
        .glass-scroll::-webkit-scrollbar-track { background: transparent; }
        .glass-scroll::-webkit-scrollbar-thumb { background: rgba(15, 23, 42, 0.1); border-radius: 10px; }
        .glass-scroll::-webkit-scrollbar-thumb:hover { background: rgba(15, 23, 42, 0.2); }
        .dark .glass-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>

      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        startNewChat={startNewChat}
        historyLoading={historyLoading}
        threads={threads}
        activeThreadId={activeThreadId}
        openThread={openThread}
        handleDeleteThread={handleDeleteThread}
      />

      {/* --- MAIN CHAT AREA --- */}
      <div
        className="flex-1 flex flex-col relative bg-slate-50/30 dark:bg-[#0A0F1E]/20"
        onClick={() => mobileMenuOpen && setMobileMenuOpen(false)}
      >
        <ChatHeader
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <ChatWindow
          messages={messages}
          loading={loading}
          user={user}
          handlePromptClick={handlePromptClick}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput
          handleSendMessage={handleSendMessage}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          clearFile={clearFile}
          fileInputRef={fileInputRef}
          handleFileSelect={handleFileSelect}
          loading={loading}
        />
      </div>
    </motion.div>
  );
};

export default AIChat;