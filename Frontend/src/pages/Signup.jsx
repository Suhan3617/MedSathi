import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiBriefcase,
  FiFileText,
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiActivity,
  FiSun,
  FiMoon,
} from "react-icons/fi";

// --- ANIMATION VARIANTS ---
const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// --- DESIGN TOKENS (Tailwind Classes) ---
const inputBase =
  "w-full px-4 py-3 text-sm bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]";
const labelBase =
  "block text-xs font-bold uppercase tracking-wider mb-2 text-slate-700 dark:text-slate-300";
const textPrimary = "text-slate-900 dark:text-slate-100";
const textSecondary = "text-slate-600 dark:text-slate-400";
const textMuted = "text-slate-500 dark:text-slate-400";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const initialRole = location.pathname.includes("doctor")
    ? "doctor"
    : "patient";

  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 NEW: Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "Male",
    specialization: "General Physician",
    experience: "",
    medicalRegNumber: "",
    clinicAddress: "",
    clinicName: "",
    dateOfBirth: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  useEffect(() => {
    if (location.pathname === "/signup/doctor") setRole("doctor");
    else if (location.pathname === "/signup/patient") setRole("patient");
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setStep(1);
    navigate(`/signup/${newRole}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { ...formData, role };
      const result = await signup(payload, role);

      if (result.success) {
        navigate(role === "doctor" ? "/doctor" : "/patient");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW: Toggle Function
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- THEME DATA ---
  const isDoc = role === "doctor";
  const theme = isDoc
    ? {
        primaryBg:
          "from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600",
        primaryText: "text-blue-600 dark:text-cyan-400",
        gradientText:
          "bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500",
        btnHover:
          "hover:from-blue-700 hover:to-cyan-600 dark:hover:from-blue-600 dark:hover:to-cyan-500",
        badgeBg:
          "bg-blue-50 dark:bg-cyan-900/20 text-blue-600 dark:text-cyan-400 border-blue-100 dark:border-cyan-800/30",
        title: "Doctor Portal",
        sub: "Manage your practice and patients digitally.",
        heroTitle: "Healthcare connected.",
        heroSub: "Expand your practice with our premium digital suite.",
        icon: <FiBriefcase size={24} />,
      }
    : {
        primaryBg:
          "from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500",
        primaryText: "text-emerald-600 dark:text-emerald-400",
        gradientText:
          "bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400",
        btnHover:
          "hover:from-emerald-600 hover:to-teal-500 dark:hover:from-emerald-500 dark:hover:to-teal-400",
        badgeBg:
          "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30",
        title: "Patient Account",
        sub: "Book appointments and manage your health.",
        heroTitle: "Your health, everywhere.",
        heroSub: "Connect with top specialists from the comfort of your home.",
        icon: <FiUser size={24} />,
      };

  const renderSharedFields = () => (
    <div className="space-y-4">
      <div>
        <label className={labelBase}>Full Name</label>
        <input
          className={inputBase}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your full name"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Email Address</label>
          <input
            className={inputBase}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className={labelBase}>Phone Number</label>
          <input
            className={inputBase}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="00000-00000"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelBase}>Password</label>
          <input
            className={inputBase}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Min 6 characters"
            minLength="6"
          />
        </div>
        <div>
          <label className={labelBase}>Gender</label>
          <select
            className={inputBase}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

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
            className={`absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-20 blur-[80px] bg-gradient-to-br ${theme.primaryBg} animate-float`}
          />
          <div
            className={`absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-20 blur-[80px] bg-gradient-to-tl ${theme.primaryBg} animate-float-delayed`}
          />
        </div>

        {/* Main Glass Container */}
        <div className="w-full max-w-5xl bg-white/70 dark:bg-[#e2e8f0]/[0.02] backdrop-blur-[16px] border border-black/5 dark:border-white/[0.06] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] rounded-3xl overflow-hidden relative z-10 flex flex-col md:flex-row h-[90vh] md:h-auto md:min-h-[600px] md:max-h-[85vh]">
          {/* LEFT PANEL - Visual Storytelling (Hidden on Mobile) */}
          <div
            className={`hidden md:flex flex-col justify-between w-2/5 p-10 lg:p-12 relative overflow-hidden bg-gradient-to-br ${theme.primaryBg}`}
          >
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

              <div className="text-white/90 drop-shadow-md mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl inline-block border border-white/20">
                {theme.icon}
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4 drop-shadow-sm">
                {theme.heroTitle}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-sm font-medium">
                {theme.heroSub}
              </p>
            </div>

            <div className="relative z-10">
              <p className="text-white/60 text-sm font-medium">
                © 2026 MedSathi Technologies.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL - Form Area */}
          <div className="w-full md:w-3/5 flex flex-col p-6 sm:p-10 lg:p-12 bg-white/50 dark:bg-transparent relative h-full overflow-y-auto custom-scrollbar">
            {/* Top Navigation / Switcher */}
            <div className="flex justify-between items-center mb-8 shrink-0">
              {/* Mobile Logo */}
              <div className="flex md:hidden items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.primaryBg} flex items-center justify-center shadow-lg`}
                >
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
                  <span
                    className={`text-transparent bg-clip-text ${theme.gradientText}`}
                  >
                    Med
                  </span>
                </span>
              </div>
              <div className="hidden md:block"></div> {/* Spacer for desktop */}
              {/* Role Switcher */}
              <div className="flex bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-md p-1 rounded-xl border border-white/40 dark:border-white/5 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("patient")}
                  className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all z-10 ${role === "patient" ? textPrimary : textMuted}`}
                >
                  {role === "patient" && (
                    <motion.div
                      layoutId="roleSwitch"
                      className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-600/50 -z-10"
                    />
                  )}
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSwitch("doctor")}
                  className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-lg transition-all z-10 ${role === "doctor" ? textPrimary : textMuted}`}
                >
                  {role === "doctor" && (
                    <motion.div
                      layoutId="roleSwitch"
                      className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-600/50 -z-10"
                    />
                  )}
                  Doctor
                </button>
              </div>
            </div>

            {/* Header Title */}
            <div
              className={`shrink-0 flex items-center gap-4 p-4 rounded-2xl mb-8 border ${theme.badgeBg}`}
            >
              <div
                className={`p-3 rounded-xl bg-white/50 dark:bg-black/20 shadow-sm border border-white/20 dark:border-white/5`}
              >
                {theme.icon}
              </div>
              <div>
                <h2 className="text-lg font-extrabold m-0 leading-tight tracking-tight">
                  {theme.title}
                </h2>
                <p className="text-sm font-medium opacity-80 m-0 mt-0.5">
                  {theme.sub}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="shrink-0 mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-800/30 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm backdrop-blur-md"
                >
                  <FiAlertCircle size={18} /> {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Area */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col relative min-h-[300px]"
            >
              <AnimatePresence mode="wait">
                {/* DOCTOR - STEP 1 */}
                {isDoc && step === 1 && (
                  <motion.div
                    key="d1"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4 flex flex-col flex-1"
                  >
                    {renderSharedFields()}
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className={`w-full mt-auto py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${theme.primaryBg} ${theme.btnHover}`}
                    >
                      Continue to Medical Details <FiArrowRight />
                    </button>
                  </motion.div>
                )}

                {/* DOCTOR - STEP 2 */}
                {isDoc && step === 2 && (
                  <motion.div
                    key="d2"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4 flex flex-col flex-1"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className={labelBase}>Specialization</label>
                        <select
                          className={inputBase}
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                        >
                          <option value="General Physician">
                            General Physician
                          </option>
                          <option value="Cardiologist">Cardiologist</option>
                          <option value="Dermatologist">Dermatologist</option>
                          <option value="Neurologist">Neurologist</option>
                          <option value="Pediatrician">Pediatrician</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelBase}>Medical Reg. No</label>
                        <input
                          className={inputBase}
                          name="medicalRegNumber"
                          value={formData.medicalRegNumber}
                          onChange={handleChange}
                          required
                          placeholder="MCI-12345"
                        />
                      </div>
                      <div>
                        <label className={labelBase}>Experience (Yrs)</label>
                        <input
                          className={inputBase}
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          required
                          placeholder="5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelBase}>
                          Clinic/Hospital Name
                        </label>
                        <input
                          className={inputBase}
                          name="clinicName"
                          value={formData.clinicName}
                          onChange={handleChange}
                          required
                          placeholder="City Care Hospital"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-auto pt-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="p-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none flex items-center justify-center shrink-0"
                      >
                        <FiArrowLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className={`flex-1 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${theme.primaryBg} ${theme.btnHover}`}
                      >
                        Verify Profile <FiArrowRight />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* DOCTOR - STEP 3 */}
                {isDoc && step === 3 && (
                  <motion.div
                    key="d3"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 flex flex-col justify-center flex-1"
                  >
                    <div>
                      <label className={labelBase}>
                        Upload License{" "}
                        <span className="font-normal normal-case text-[10px] opacity-70">
                          (Optional)
                        </span>
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-cyan-500 group`}
                      >
                        <FiFileText
                          size={36}
                          className={`mx-auto mb-3 opacity-50 group-hover:opacity-100 transition-opacity ${theme.primaryText}`}
                        />
                        <span
                          className={`font-bold text-sm ${theme.primaryText}`}
                        >
                          Click to upload document
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          PDF, JPG or PNG (Max 5MB)
                        </p>
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="p-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none flex items-center justify-center shrink-0"
                      >
                        <FiArrowLeft size={18} />
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${theme.primaryBg} ${theme.btnHover} disabled:opacity-70`}
                      >
                        {loading ? (
                          <>
                            <FiLoader className="animate-spin" size={18} />{" "}
                            Creating Profile...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle size={18} /> Submit Registration
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] font-semibold text-center text-slate-400 uppercase tracking-widest">
                      * Verification required before activation
                    </p>
                  </motion.div>
                )}

                {/* PATIENT - STEP 1 */}
                {!isDoc && step === 1 && (
                  <motion.div
                    key="p1"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4 flex flex-col flex-1"
                  >
                    {renderSharedFields()}
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className={`w-full mt-auto py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${theme.primaryBg} ${theme.btnHover}`}
                    >
                      Continue to Medical Details <FiArrowRight />
                    </button>
                  </motion.div>
                )}

                {/* PATIENT - STEP 2 */}
                {!isDoc && step === 2 && (
                  <motion.div
                    key="p2"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 flex flex-col justify-center flex-1"
                  >
                    <div className="mb-2">
                      <h4
                        className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${textSecondary}`}
                      >
                        <FiActivity size={14} /> Medical Profile{" "}
                        <span className="font-medium normal-case opacity-70 tracking-normal">
                          (Optional)
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelBase}>Date of Birth</label>
                          <input
                            className={inputBase}
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className={labelBase}>Blood Group</label>
                          <select
                            className={inputBase}
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="O+">O+</option>
                            <option value="B+">B+</option>
                            <option value="AB+">AB+</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelBase}>Emergency Contact</label>
                          <input
                            className={inputBase}
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleChange}
                            placeholder="Contact Name"
                          />
                        </div>
                        <div>
                          <label className={labelBase}>Emergency Phone</label>
                          <input
                            className={inputBase}
                            name="emergencyContactPhone"
                            value={formData.emergencyContactPhone}
                            onChange={handleChange}
                            placeholder="Contact Phone"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-auto pt-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="p-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none flex items-center justify-center shrink-0"
                      >
                        <FiArrowLeft size={18} />
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r ${theme.primaryBg} ${theme.btnHover} disabled:opacity-70`}
                      >
                        {loading ? (
                          <>
                            <FiLoader className="animate-spin" size={18} />{" "}
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle size={18} /> Create Patient Account
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400 pb-4 shrink-0">
              Already have an account?{" "}
              <Link
                to="/login"
                className={`${theme.primaryText} hover:underline ml-1`}
              >
                Log in
              </Link>
            </div>

            {/* Mobile Footer Links */}
            <div className="md:hidden shrink-0 flex justify-center gap-6 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-xs font-semibold text-slate-400">
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
            <div className="hidden md:flex shrink-0 justify-between items-center mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-xs font-semibold text-slate-400">
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

        {/* Inject Custom Scrollbar Styles */}
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
          
          .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.3); border-radius: 10px; }
          .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.2); }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(148, 163, 184, 0.5); }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `,
          }}
        />
      </div>
    </div>
  );
};

export default Signup;
 