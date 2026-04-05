import React, { useState, useRef, useEffect } from "react";
import { checkSymptomsWithAI } from "../services/api";
import { motion } from "framer-motion";

// Components
import Header from "../components/Patient/SymptomCheckor/Header";
import ChatArea from "../components/Patient/SymptomCheckor/ChatArea";
import InputArea from "../components/Patient/SymptomCheckor/InputArea";
import FinalReport from "../components/Patient/SymptomCheckor/FinalReport";

const SymptomChecker = () => {
  const chatEndRef = useRef(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalReport, setFinalReport] = useState(null);

  // Initial Greeting Message
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hello! I am MedSathi's AI Triage Assistant. Could you briefly describe what symptoms you are experiencing today?",
    },
  ]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");

    // Add user message to UI
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await checkSymptomsWithAI(newMessages);
      let aiResponse = res.text;

      // Try to parse if it's a JSON string (Final Report)
      try {
        const parsedJSON = JSON.parse(aiResponse);
        if (parsedJSON.isComplete) {
          setFinalReport(parsedJSON);
          // Add a silent system message so UI knows it's done
          setMessages((prev) => [
            ...prev,
            { role: "ai", isSystem: true, content: "Triage Complete." },
          ]);
          setLoading(false);
          return;
        }
      } catch (e) {
        // Not a JSON, it's a normal chat message. Continue.
      }

      // Normal chat response
      setMessages((prev) => [...prev, { role: "ai", content: aiResponse }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          isError: true,
          content:
            "Sorry, I'm having trouble connecting to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="symptom-container w-full max-w-4xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)] md:h-[calc(100vh-110px)] flex items-center justify-center font-sans relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="chat-wrapper flex flex-col w-full h-full rounded-2xl border shadow-xl backdrop-blur-md overflow-hidden transition-all duration-500 bg-white/65 border-black/[0.05] dark:bg-[#E2E8F0]/[0.04] dark:border-white/[0.06] dark:shadow-2xl"
      >
        <Header />

        <ChatArea 
          messages={messages} 
          loading={loading} 
          chatEndRef={chatEndRef} 
        />

        <div className="border-t border-black/[0.05] dark:border-white/[0.06] bg-white/40 dark:bg-[#0A0F1E]/40 backdrop-blur-xl z-20 relative">
          {finalReport ? (
            <FinalReport finalReport={finalReport} />
          ) : (
            <InputArea
              input={input}
              setInput={setInput}
              loading={loading}
              handleSend={handleSend}
            />
          )}
        </div>
      </motion.div>

      {/* Internal CSS strictly for scrollbars */}
      <style>{`
        .glass-scroll::-webkit-scrollbar { width: 6px; }
        .glass-scroll::-webkit-scrollbar-track { background: transparent; }
        .glass-scroll::-webkit-scrollbar-thumb { background: rgba(15, 23, 42, 0.1); border-radius: 10px; }
        .glass-scroll::-webkit-scrollbar-thumb:hover { background: rgba(15, 23, 42, 0.2); }
        .dark .glass-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
        .dark .glass-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
};

export default SymptomChecker;