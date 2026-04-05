import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiArrowRight,
  FiDatabase,
  FiLock,
  FiAlertCircle,
  FiLoader,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- DESIGN TOKENS (Tailwind Classes) ---
const inputBase =
  "w-full px-4 py-3 text-sm bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]";
const labelBase =
  "block text-xs font-bold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-300";
const textPrimary = "text-slate-900 dark:text-slate-100";
const textSecondary = "text-slate-600 dark:text-slate-400";
const primaryGradientBg =
  "bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 text-white shadow-lg shadow-blue-500/25 dark:shadow-cyan-500/20 hover:from-blue-700 hover:to-cyan-600 dark:hover:from-blue-600 dark:hover:to-cyan-500 transition-all";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  // 🔥 NEW: Toggle Function
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Wrap the entire component in a div that conditionally applies the "dark" class
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0A0F1E] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden transition-colors duration-300">
        {/* 🔥 NEW: Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform z-50 focus:outline-none"
          title="Toggle Theme"
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div
            className={`absolute top-[-10%] left-[-5%] w-[480px] h-[480px] rounded-full opacity-20 blur-[80px] bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 animate-float`}
          />
          <div
            className={`absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[80px] bg-gradient-to-tl from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 animate-float-delayed`}
          />
        </div>

        {/* Main Glass Container */}
        <div className="w-full max-w-4xl bg-white/70 dark:bg-[#e2e8f0]/[0.02] backdrop-blur-[16px] border border-black/5 dark:border-white/[0.06] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] rounded-3xl overflow-hidden relative z-10 flex flex-col md:flex-row min-h-[550px]">
          {/* LEFT PANEL - Visual Storytelling (Hidden on Mobile) */}
          <div className="hidden md:flex flex-col justify-between w-2/5 p-10 lg:p-12 relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600">
            {/* Overlay Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:24px_24px]"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-16">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 4V20M4 12H20" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  MedSathi.
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4 drop-shadow-sm mt-12">
                Welcome back.
              </h1>
              <p className="text-white/80 text-base leading-relaxed max-w-sm font-medium">
                Sign in to manage your appointments, prescriptions, and health
                records securely.
              </p>
            </div>

            <div className="relative z-10 mt-auto">
              <p className="text-white/60 text-sm font-medium">
                © 2026 MedSathi Technologies.
              </p>
            </div>

            {/* Decorative circle */}
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white opacity-[0.04]"></div>
          </div>

          {/* RIGHT PANEL - Form Area */}
          <div className="w-full md:w-3/5 flex flex-col p-6 sm:p-10 lg:p-12 bg-white/50 dark:bg-transparent relative h-full flex-1">
            <div className="flex-1 flex flex-col justify-center">
              {/* Mobile Logo */}
              <div className="flex md:hidden items-center justify-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 flex items-center justify-center shadow-lg">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 4V20M4 12H20" />
                  </svg>
                </div>
                <span
                  className={`text-lg font-extrabold tracking-tight ${textPrimary}`}
                >
                  Algo
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500">
                    Med
                  </span>
                </span>
              </div>

              {/* Header Title */}
              <div className="flex items-center gap-4 p-4 rounded-2xl mb-6 border bg-blue-50 dark:bg-cyan-900/20 border-blue-100 dark:border-cyan-800/30 text-blue-600 dark:text-cyan-400">
                <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20 shadow-sm border border-white/20 dark:border-white/5 text-blue-600 dark:text-cyan-400">
                  <FiLock size={20} />
                </div>
                <div>
                  <h2
                    className={`text-lg font-extrabold m-0 leading-tight tracking-tight ${textPrimary}`}
                  >
                    Account Login
                  </h2>
                  <p
                    className={`text-sm font-medium opacity-80 m-0 mt-0.5 ${textSecondary}`}
                  >
                    Please enter your credentials
                  </p>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/30 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm backdrop-blur-md"
                  >
                    <FiAlertCircle size={18} className="shrink-0" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelBase}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputBase}
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className={labelBase}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={inputBase}
                    placeholder="••••••••"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-4 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${primaryGradientBg} disabled:opacity-70`}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />{" "}
                      Authenticating...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 dark:text-cyan-400 hover:underline ml-1"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Mobile Footer Links */}
            <div className="md:hidden flex justify-center gap-6 mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-xs font-semibold text-slate-400">
              <a
                href="#"
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                Help
              </a>
            </div>

            {/* Desktop Footer Links */}
            <div className="hidden md:flex justify-between items-center mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-xs font-semibold text-slate-400">
              <span>© 2026 MedSathi Inc.</span>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  Help
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Inject Custom Styles for Animations */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes float {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes float-delayed {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(-30px, 50px) scale(1.1); }
              66% { transform: translate(20px, -20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-float { animation: float 25s infinite ease-in-out; }
          .animate-float-delayed { animation: float-delayed 20s infinite ease-in-out; }
        `,
          }}
        />
      </div>
    </div>
  );
};

export default Login;
