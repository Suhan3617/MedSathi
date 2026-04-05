import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  return (
    <nav className="fixed w-full z-50 bg-white/70 dark:bg-[#0A0F1E]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/[0.06] transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <FiActivity className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white brand-font">
              MedSathi
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
            >
              How it Works
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-colors border border-transparent dark:border-white/[0.05] focus:outline-none"
              title="Toggle Theme"
            >
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <button
              onClick={handleLogin}
              className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 px-4 py-2 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={handleSignup}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 focus:outline-none"
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 dark:text-slate-300 focus:outline-none"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-[#0A0F1E]/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/[0.05] p-4 space-y-4 shadow-2xl absolute w-full transition-colors duration-300">
          <a
            href="#features"
            className="block text-slate-600 dark:text-slate-300 font-bold"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="block text-slate-600 dark:text-slate-300 font-bold"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            How it Works
          </a>
          <hr className="border-slate-100 dark:border-slate-800" />
          <button
            onClick={handleLogin}
            className="block w-full text-left text-slate-600 dark:text-slate-300 font-bold py-2"
          >
            Log in
          </button>
          <button
            onClick={handleSignup}
            className="block w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 rounded-xl text-center shadow-lg shadow-blue-500/25"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
