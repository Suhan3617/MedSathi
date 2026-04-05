import React, { useState, useEffect, useMemo } from "react";
import {
  getDoctorProfileMe,
  updateDoctorProfile,
  changePassword,
  deactivateAccount,
  deleteAccount,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiClock,
  FiAward,
  FiGlobe,
  FiLinkedin,
  FiShield,
  FiLink,
  FiSave,
  FiCheckCircle,
  FiTrash2,
  FiPlus,
  FiAlertCircle,
  FiLoader,
  FiCheck,
  FiStar,
  FiMessageCircle,
  FiSettings,
  FiLock,
  FiBell,
  FiAlertTriangle,
  FiPhone,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

// --- DESIGN TOKENS (Tailwind Classes) ---
const glassSurface =
  "bg-white/65 dark:bg-[#e2e8f0]/[0.04] backdrop-blur-[14px] border border-black/5 dark:border-white/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.3)] rounded-2xl";
const textPrimary = "text-slate-900 dark:text-slate-100";
const textSecondary = "text-slate-700 dark:text-slate-300";
const textMuted = "text-slate-500 dark:text-slate-400";
const primaryGradientText =
  "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500";
const primaryGradientBg =
  "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 text-white shadow-lg shadow-blue-500/25 dark:shadow-cyan-500/20";
const inputBase =
  "w-full px-4 py-3 text-sm bg-white/50 dark:bg-[#0A0F1E]/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all";

const DoctorProfile = () => {
  const { user, logout } = useAuth();

  // --- State Management ---
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [reviews, setReviews] = useState([]);

  const [customModal, setCustomModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    requireInput: false,
    inputMatch: "",
    action: null,
  });
  const [modalInput, setModalInput] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const [initialData, setInitialData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const [formData, setFormData] = useState({
    specialization: "",
    experience: 0,
    qualifications: [],
    languages: [],
    symptomsTreated: [],
    awards: [],
    fees: 0,
    sessionDuration: 15,
    followUpPolicy: 0,
    about: "",
    availableSlots: [],
    medicalLicense: { registrationNumber: "", medicalCouncil: "" },
    socialLinks: { website: "", linkedin: "", twitter: "" },
    vacationMode: false,
    notificationPreferences: { email: true, sms: false },
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (initialData) {
      const hasChanges =
        JSON.stringify(formData) !== JSON.stringify(initialData);
      setIsDirty(hasChanges);
    }
  }, [formData, initialData]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getDoctorProfileMe();
      if (res.data) {
        const fetchedData = {
          specialization: res.data.specialization || "",
          experience: res.data.experience || 0,
          qualifications: res.data.qualifications || [],
          languages: res.data.languages || [],
          symptomsTreated: res.data.symptomsTreated || [],
          awards: res.data.awards || [],
          fees: res.data.fees || 0,
          sessionDuration: res.data.sessionDuration || 15,
          followUpPolicy: res.data.followUpPolicy || 0,
          about: res.data.about || "",
          availableSlots: res.data.availableSlots || [],
          medicalLicense: {
            registrationNumber:
              res.data.medicalLicense?.registrationNumber || "",
            medicalCouncil: res.data.medicalLicense?.medicalCouncil || "",
          },
          socialLinks: {
            website: res.data.socialLinks?.website || "",
            linkedin: res.data.socialLinks?.linkedin || "",
            twitter: res.data.socialLinks?.twitter || "",
          },
          vacationMode: res.data.vacationMode || false,
          notificationPreferences: res.data.notificationPreferences || {
            email: true,
            sms: false,
          },
          phone: user?.phone || "",
          email: user?.email || "",
        };

        setFormData(fetchedData);
        setInitialData(fetchedData);

        if (res.data.patientReviews) {
          setReviews(res.data.patientReviews);
        }
      }
    } catch (error) {
      console.error("Error fetching profile", error);
      setMessage({ type: "error", text: "Could not load profile data." });
    } finally {
      setLoading(false);
    }
  };

  const profileStrength = useMemo(() => {
    let score = 0;
    if (formData.specialization) score += 15;
    if (formData.experience) score += 10;
    if (formData.qualifications.length > 0) score += 10;
    if (formData.symptomsTreated.length > 0) score += 10;
    if (formData.languages.length > 0) score += 5;
    if (formData.fees) score += 10;
    if (formData.about.length > 20) score += 10;
    if (formData.availableSlots.length > 0) score += 15;
    if (formData.medicalLicense.registrationNumber) score += 15;
    return Math.min(score, 100);
  }, [formData]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field, nestedField = null) => {
    if (nestedField) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [nestedField]: !prev[field][nestedField] },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
    }
  };

  const handleTagInput = (e, field) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val && !formData[field].includes(val)) {
        setFormData((prev) => ({ ...prev, [field]: [...prev[field], val] }));
      }
      e.target.value = "";
    }
  };

  const removeTag = (field, tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((tag) => tag !== tagToRemove),
    }));
  };

  const addSlot = () => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: [
        ...prev.availableSlots,
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
      ],
    }));
  };

  const removeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((_, i) => i !== index),
    }));
  };

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...formData.availableSlots];
    newSlots[index][field] = value;
    setFormData((prev) => ({ ...prev, availableSlots: newSlots }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) return;
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const dataToSave = {
        ...formData,
        fees: Number(formData.fees),
        sessionDuration: Number(formData.sessionDuration),
        followUpPolicy: Number(formData.followUpPolicy),
        experience: Number(formData.experience),
      };

      await updateDoctorProfile(dataToSave);
      setInitialData(dataToSave);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      if (window.innerWidth > 768) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("Update error", error);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage({ type: "error", text: "Please fill all password fields!" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (error) {
      console.error("Password change error", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update password. Check your current password.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    setModalLoading(true);
    try {
      await deactivateAccount();
      closeCustomModal();
      logout();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to deactivate account." });
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    setModalLoading(true);
    try {
      await deleteAccount();
      closeCustomModal();
      logout();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to delete account." });
      setModalLoading(false);
    }
  };

  const confirmDeactivate = () => {
    setCustomModal({
      isOpen: true,
      type: "warning",
      title: "Deactivate Account",
      message:
        "Are you sure you want to deactivate your account? Your profile will be temporarily hidden from patients. You can reactivate by simply logging in again.",
      requireInput: false,
      action: handleDeactivate,
    });
  };

  const confirmDelete = () => {
    setCustomModal({
      isOpen: true,
      type: "danger",
      title: "Permanently Delete Account",
      message:
        "This action is completely irreversible. All your appointments, reviews, and data will be erased forever.",
      requireInput: true,
      inputMatch: "DELETE",
      action: handleDelete,
    });
  };

  const closeCustomModal = () => {
    setCustomModal({
      isOpen: false,
      type: "",
      title: "",
      message: "",
      requireInput: false,
      inputMatch: "",
      action: null,
    });
    setModalInput("");
    setModalLoading(false);
  };

  const renderTags = (field, placeholder) => (
    <div className="w-full min-h-[48px] px-3 py-2 flex flex-wrap gap-2 items-center bg-white/50 dark:bg-[#0A0F1E]/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 rounded-xl transition-all">
      <AnimatePresence>
        {formData[field].map((tag, i) => (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(field, tag)}
              className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
            >
              <FiX size={14} />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <input
        placeholder={placeholder}
        onKeyDown={(e) => handleTagInput(e, field)}
        className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
      />
    </div>
  );

  if (loading)
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-4">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        <span className="font-medium">Loading Profile...</span>
      </div>
    );

  const tabs = [
    { id: "general", label: "General Info", icon: <FiUser size={16} /> },
    { id: "schedule", label: "Schedule & Fees", icon: <FiClock size={16} /> },
    { id: "trust", label: "Verification", icon: <FiShield size={16} /> },
    {
      id: "reviews",
      label: `Reviews (${reviews.length})`,
      icon: <FiStar size={16} />,
    },
    { id: "settings", label: "Settings", icon: <FiSettings size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0A0F1E] font-sans transition-colors duration-300 w-full overflow-x-hidden pt-6 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                <span className={textPrimary}>
                  Dr. {user?.name || "Doctor"} -{" "}
                </span>
                <span className={primaryGradientText}>Settings</span>
              </h1>
              <p className={`text-sm md:text-base ${textMuted}`}>
                Manage your profile, consultation fees, and online slots.
              </p>
            </div>

            {/* Desktop Save Button */}
            {activeTab !== "reviews" && (
              <div className="hidden md:block shrink-0">
                {isDirty ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={saving}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${primaryGradientBg}`}
                  >
                    {saving ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiSave />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </motion.button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/50 cursor-not-allowed"
                  >
                    <FiCheckCircle /> Up to date
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Alert Message */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold border backdrop-blur-md ${message.type === "success" ? "bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20" : "bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-500/20"}`}
              >
                {message.type === "success" ? (
                  <FiCheckCircle size={18} />
                ) : (
                  <FiAlertCircle size={18} />
                )}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Strength Banner */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className={`${glassSurface} p-5 md:p-6 mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6`}
          >
            <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              {profileStrength === 100 ? (
                <FiCheck size={24} />
              ) : (
                <FiAward size={24} />
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="flex justify-between items-end mb-2">
                <span className={`font-bold text-sm ${textPrimary}`}>
                  Profile Completeness
                </span>
                <span
                  className={`font-extrabold text-sm ${profileStrength === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-cyan-400"}`}
                >
                  {profileStrength}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileStrength}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${profileStrength === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-cyan-400"}`}
                />
              </div>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 border-b border-slate-200/60 dark:border-slate-800 pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id ? "text-blue-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
              >
                {tab.icon} {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeProfileTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-cyan-400 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              {/* --- GENERAL TAB --- */}
              {activeTab === "general" && (
                <motion.div
                  variants={fadeUp}
                  className={`${glassSurface} p-6 md:p-8 mb-6`}
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                      <FiUser size={18} />
                    </div>
                    <h3 className={`text-lg font-bold ${textPrimary}`}>
                      Professional Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                      >
                        Specialization
                      </label>
                      <input
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className={inputBase}
                        placeholder="e.g. Cardiologist"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                      >
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={inputBase}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                      >
                        Professional Bio
                      </label>
                      <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        className={`${inputBase} min-h-[120px] resize-y`}
                        placeholder="Brief summary of your medical career..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                      >
                        Symptoms & Conditions Treated (Press Enter)
                      </label>
                      {renderTags(
                        "symptomsTreated",
                        "e.g. Fever, Diabetes, Anxiety...",
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                      >
                        Qualifications (Press Enter)
                      </label>
                      {renderTags("qualifications", "e.g. MBBS, MD...")}
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                      >
                        Languages Spoken
                      </label>
                      {renderTags("languages", "e.g. English, Hindi...")}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* --- SCHEDULE TAB --- */}
              {activeTab === "schedule" && (
                <>
                  <motion.div
                    variants={fadeUp}
                    className={`${glassSurface} p-6 md:p-8 mb-6`}
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                        <FiClock size={18} />
                      </div>
                      <h3 className={`text-lg font-bold ${textPrimary}`}>
                        Consultation & Fees
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Online Consultation Fee (₹)
                        </label>
                        <input
                          type="number"
                          name="fees"
                          value={formData.fees}
                          onChange={handleChange}
                          className={inputBase}
                          placeholder="e.g. 500"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Session Duration (Mins)
                        </label>
                        <select
                          name="sessionDuration"
                          value={formData.sessionDuration}
                          onChange={handleChange}
                          className={inputBase}
                        >
                          <option value={15}>15 Minutes</option>
                          <option value={30}>30 Minutes</option>
                          <option value={45}>45 Minutes</option>
                          <option value={60}>60 Minutes</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Free Follow-up Chat (Days)
                        </label>
                        <select
                          name="followUpPolicy"
                          value={formData.followUpPolicy}
                          onChange={handleChange}
                          className={inputBase}
                        >
                          <option value={0}>No Free Follow-up</option>
                          <option value={3}>3 Days</option>
                          <option value={5}>5 Days</option>
                          <option value={7}>7 Days</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className={`${glassSurface} p-6 md:p-8 mb-6`}
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                        <FiClock size={18} />
                      </div>
                      <h3 className={`text-lg font-bold ${textPrimary}`}>
                        Online Availability
                      </h3>
                    </div>

                    {formData.availableSlots.length === 0 && (
                      <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 mb-4 text-slate-500 dark:text-slate-400">
                        No slots configured. Add a slot to start accepting
                        online appointments.
                      </div>
                    )}

                    <AnimatePresence>
                      {formData.availableSlots.map((slot, index) => (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto_1fr_auto] gap-3 md:gap-4 items-center p-4 bg-white/50 dark:bg-[#0A0F1E]/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl mb-4 relative"
                        >
                          <select
                            value={slot.day}
                            onChange={(e) =>
                              handleSlotChange(index, "day", e.target.value)
                            }
                            className={inputBase}
                          >
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleSlotChange(
                                index,
                                "startTime",
                                e.target.value,
                              )
                            }
                            className={inputBase}
                          />
                          <span className="hidden md:block text-slate-400 font-bold text-center">
                            -
                          </span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleSlotChange(index, "endTime", e.target.value)
                            }
                            className={inputBase}
                          />

                          <button
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="absolute top-2 right-2 md:static p-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors focus:outline-none"
                            title="Remove Slot"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={addSlot}
                      className="w-full py-4 mt-2 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-cyan-500 rounded-xl font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50/50 dark:hover:bg-cyan-500/5 transition-all flex justify-center items-center gap-2"
                    >
                      <FiPlus /> Add New Availability Slot
                    </button>
                  </motion.div>
                </>
              )}

              {/* --- TRUST & SOCIAL TAB --- */}
              {activeTab === "trust" && (
                <>
                  <motion.div
                    variants={fadeUp}
                    className={`${glassSurface} p-6 md:p-8 mb-6`}
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                        <FiShield size={18} />
                      </div>
                      <h3 className={`text-lg font-bold ${textPrimary}`}>
                        Medical Registration (Required)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Registration Number
                        </label>
                        <input
                          name="medicalLicense.registrationNumber"
                          value={formData.medicalLicense.registrationNumber}
                          onChange={handleChange}
                          className={inputBase}
                          placeholder="e.g. 12345"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Medical Council
                        </label>
                        <input
                          name="medicalLicense.medicalCouncil"
                          value={formData.medicalLicense.medicalCouncil}
                          onChange={handleChange}
                          className={inputBase}
                          placeholder="e.g. Medical Council"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className={`${glassSurface} p-6 md:p-8 mb-6`}
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                        <FiGlobe size={18} />
                      </div>
                      <h3 className={`text-lg font-bold ${textPrimary}`}>
                        Social & Recognition
                      </h3>
                    </div>
                    <div className="mb-6">
                      <label
                        className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                      >
                        Awards & Honors
                      </label>
                      {renderTags("awards", "Add award...")}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label
                          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          <FiGlobe /> Website URL
                        </label>
                        <input
                          name="socialLinks.website"
                          value={formData.socialLinks.website}
                          onChange={handleChange}
                          className={inputBase}
                          placeholder="https://"
                        />
                      </div>
                      <div>
                        <label
                          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          <FiLinkedin /> LinkedIn
                        </label>
                        <input
                          name="socialLinks.linkedin"
                          value={formData.socialLinks.linkedin}
                          onChange={handleChange}
                          className={inputBase}
                          placeholder="Profile URL"
                        />
                      </div>
                      <div>
                        <label
                          className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          <FiLink /> Twitter / X
                        </label>
                        <input
                          name="socialLinks.twitter"
                          value={formData.socialLinks.twitter}
                          onChange={handleChange}
                          className={inputBase}
                          placeholder="@handle"
                        />
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* --- REVIEWS TAB --- */}
              {activeTab === "reviews" && (
                <motion.div
                  variants={fadeUp}
                  className={`${glassSurface} p-6 md:p-8 mb-6`}
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                      <FiMessageCircle size={18} />
                    </div>
                    <h3 className={`text-lg font-bold ${textPrimary}`}>
                      Patient Feedback & Ratings
                    </h3>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center p-12 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      <FiStar size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="font-medium">
                        You don't have any patient reviews yet.
                      </p>
                      <p className="text-xs mt-1 opacity-70">
                        Ratings will appear here after consultations are
                        completed.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((rev) => (
                        <div
                          key={rev._id}
                          className="p-5 bg-white/50 dark:bg-[#0A0F1E]/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 rounded-xl"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className={`font-bold text-sm ${textPrimary}`}>
                              {rev.patientName}
                            </div>
                            <div className="text-right">
                              <div className={`text-xs ${textMuted}`}>
                                Reviewed:{" "}
                                {new Date(rev.date).toLocaleDateString()}
                              </div>
                              {(rev.appointmentDate || rev.timeSlot) && (
                                <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                                  Appt:{" "}
                                  {rev.appointmentDate
                                    ? new Date(
                                        rev.appointmentDate,
                                      ).toLocaleDateString()
                                    : ""}{" "}
                                  {rev.timeSlot ? `| ${rev.timeSlot}` : ""}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1 text-amber-500 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                size={14}
                                fill={
                                  star <= rev.rating ? "currentColor" : "none"
                                }
                                className={
                                  star <= rev.rating
                                    ? ""
                                    : "text-slate-300 dark:text-slate-600"
                                }
                              />
                            ))}
                          </div>
                          {rev.text && (
                            <div
                              className={`text-sm italic leading-relaxed ${textSecondary}`}
                            >
                              "{rev.text}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- SETTINGS & SECURITY TAB --- */}
              {activeTab === "settings" && (
                <>
                  {/* Contact Info */}
                  <motion.div
                    variants={fadeUp}
                    className={`${glassSurface} p-6 md:p-8 mb-6`}
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                        <FiPhone size={18} />
                      </div>
                      <h3 className={`text-lg font-bold ${textPrimary}`}>
                        Contact Details
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Registered Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputBase}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Preferences / Toggles */}
                  <motion.div
                    variants={fadeUp}
                    className={`${glassSurface} p-6 md:p-8 mb-6`}
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                        <FiBell size={18} />
                      </div>
                      <h3 className={`text-lg font-bold ${textPrimary}`}>
                        Preferences & Visibility
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Toggle Item */}
                      <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-[#0A0F1E]/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl">
                        <div>
                          <div className={`font-bold text-sm ${textPrimary}`}>
                            Vacation Mode / Hide Profile
                          </div>
                          <div className={`text-xs mt-1 ${textMuted}`}>
                            Turn this on to temporarily hide your profile from
                            patients.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggle("vacationMode")}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${formData.vacationMode ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.vacationMode ? "translate-x-5" : "translate-x-0"}`}
                          />
                        </button>
                      </div>

                      {/* Toggle Item */}
                      <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-[#0A0F1E]/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl">
                        <div>
                          <div className={`font-bold text-sm ${textPrimary}`}>
                            Email Notifications
                          </div>
                          <div className={`text-xs mt-1 ${textMuted}`}>
                            Receive an email when a new appointment is booked.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggle("notificationPreferences", "email")
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${formData.notificationPreferences.email ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.notificationPreferences.email ? "translate-x-5" : "translate-x-0"}`}
                          />
                        </button>
                      </div>

                      {/* Toggle Item */}
                      <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-[#0A0F1E]/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl">
                        <div>
                          <div className={`font-bold text-sm ${textPrimary}`}>
                            SMS / WhatsApp Alerts
                          </div>
                          <div className={`text-xs mt-1 ${textMuted}`}>
                            Receive text alerts for immediate updates.
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggle("notificationPreferences", "sms")
                          }
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${formData.notificationPreferences.sms ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.notificationPreferences.sms ? "translate-x-5" : "translate-x-0"}`}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Change Password */}
                  <motion.div
                    variants={fadeUp}
                    className={`${glassSurface} p-6 md:p-8 mb-6`}
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
                        <FiLock size={18} />
                      </div>
                      <h3 className={`text-lg font-bold ${textPrimary}`}>
                        Change Password
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="md:col-span-2">
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={inputBase}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={inputBase}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textSecondary}`}
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={inputBase}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={submitPasswordChange}
                      disabled={saving}
                      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${primaryGradientBg}`}
                    >
                      {saving ? <FiLoader className="animate-spin" /> : null}
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </motion.div>

                  {/* Danger Zone */}
                  <motion.div
                    variants={fadeUp}
                    className={`${glassSurface} bg-red-50/40 dark:bg-red-900/5 border-red-200/50 dark:border-red-500/20 p-6 md:p-8 mb-6`}
                  >
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-red-100 dark:border-red-900/30">
                      <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg">
                        <FiAlertTriangle size={18} />
                      </div>
                      <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                        Danger Zone
                      </h3>
                    </div>
                    <p className="text-sm text-red-700/80 dark:text-red-400/80 mb-6 leading-relaxed">
                      Proceed with caution. Deactivating your account will
                      disable your login temporarily. Deleting your account will
                      permanently erase all your data, appointments, and
                      reviews.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={confirmDeactivate}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm border border-red-500/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                      >
                        Deactivate Account
                      </button>
                      <button
                        type="button"
                        onClick={confirmDelete}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all"
                      >
                        Permanently Delete Account
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Mobile Save Button */}
          {activeTab !== "reviews" && (
            <div className="md:hidden mt-8">
              {isDirty ? (
                <button
                  type="submit"
                  disabled={saving}
                  className={`w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-base transition-all ${primaryGradientBg}`}
                >
                  {saving ? <FiLoader className="animate-spin" /> : <FiSave />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-base bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/50 cursor-not-allowed"
                >
                  <FiCheckCircle /> Up to date
                </button>
              )}
            </div>
          )}
        </form>

        {/* CUSTOM ACTION MODAL FOR DEACTIVATE/DELETE */}
        <AnimatePresence>
          {customModal.isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCustomModal}
                className="absolute inset-0 bg-slate-900/40 dark:bg-[#0A0F1E]/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className={`${glassSurface} bg-white/95 dark:bg-[#0A0F1E]/95 relative w-full max-w-md flex flex-col overflow-hidden`}
              >
                <div className="p-5 md:p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                  <h3
                    className={`flex items-center gap-2 m-0 text-lg font-bold ${customModal.type === "danger" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}
                  >
                    {customModal.type === "danger" ? (
                      <FiAlertTriangle />
                    ) : (
                      <FiAlertCircle />
                    )}
                    {customModal.title}
                  </h3>
                  <button
                    onClick={closeCustomModal}
                    className={`p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${textMuted} hover:${textPrimary}`}
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <p
                    className={`mb-4 text-sm md:text-base leading-relaxed ${textSecondary}`}
                  >
                    {customModal.message}
                  </p>
                  {customModal.requireInput && (
                    <input
                      type="text"
                      className={inputBase}
                      placeholder={`Type '${customModal.inputMatch}' to confirm`}
                      value={modalInput}
                      onChange={(e) => setModalInput(e.target.value)}
                    />
                  )}
                </div>
                <div className="p-5 md:p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-end gap-3">
                  <button
                    className="px-4 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    onClick={closeCustomModal}
                    disabled={modalLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${customModal.type === "danger" ? "bg-red-500 hover:bg-red-600 shadow-red-500/25" : primaryGradientBg} disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={customModal.action}
                    disabled={
                      modalLoading ||
                      (customModal.requireInput &&
                        modalInput !== customModal.inputMatch)
                    }
                  >
                    {modalLoading && <FiLoader className="animate-spin" />}
                    Confirm Action
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Inject Global Scrollbar Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
  );
};

export default DoctorProfile;
