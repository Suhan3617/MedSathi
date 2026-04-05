import React from "react";
import { FiX, FiPaperclip, FiSend } from "react-icons/fi";

const MessageInput = ({
  handleSendMessage,
  inputMessage,
  setInputMessage,
  selectedFile,
  previewUrl,
  clearFile,
  fileInputRef,
  handleFileSelect,
  loading,
}) => {
  return (
    <div className="input-container p-3 md:p-4 bg-white/40 dark:bg-[#0A0F1E]/40 backdrop-blur-xl border-t border-black/[0.05] dark:border-white/[0.06] flex flex-col items-center z-20">
      <form
        onSubmit={handleSendMessage}
        className="w-full max-w-[900px] relative flex items-center gap-2 bg-white dark:bg-black/30 rounded-[10px] border border-black/[0.08] dark:border-white/[0.08] p-1 shadow-sm focus-within:ring-2 focus-within:ring-[#06B6D4]/30 transition-all"
      >
        {/* File Preview */}
        {selectedFile && (
          <div className="absolute bottom-[calc(100%+8px)] left-0 flex items-center gap-1.5 px-2 py-0.5 bg-[#e0f2fe] dark:bg-cyan-900/40 text-[#0369a1] dark:text-cyan-300 rounded-[4px] text-[0.7rem] border border-[#bae6fd] dark:border-cyan-800/50 z-30">
            <span className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedFile.name}
            </span>
            <button
              type="button"
              onClick={clearFile}
              className="bg-none border-none cursor-pointer flex items-center hover:text-red-500"
            >
              <FiX size={12} />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="icon-btn p-1.5 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 rounded-[6px] hover:text-[#2563EB] dark:hover:text-[#06B6D4] transition-colors flex-shrink-0"
          title="Upload Report"
        >
          <FiPaperclip size={16} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
          accept="image/*"
        />

        <input
          type="text"
          placeholder={
            selectedFile ? "Ask about this file..." : "Type your question..."
          }
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 text-[0.9rem] text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 h-full py-1.5 outline-none min-w-0"
        />

        <button
          type="submit"
          disabled={(!inputMessage.trim() && !selectedFile) || loading}
          className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center flex-shrink-0 transition-colors
                                ${
                                  (!inputMessage.trim() && !selectedFile) ||
                                  loading
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default"
                                    : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white cursor-pointer shadow-sm"
                                }`}
        >
          <FiSend size={14} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;