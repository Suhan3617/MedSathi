import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  getPatientProfile,
  updatePatientProfile,
  changePassword,
  deactivateAccount,
  deleteAccount,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

// Sub-components
import Header from "../components/Patient/SymptomCheckor/Header";
import ProfileMessages from "../components/Patient/Profile/ProfileMessages";
import HealthIDCard from "../components/Patient/Profile/HealthIDCard";
import TabsNavigation from "../components/Patient/Profile/TabsNavigation";
import WidgetsColumn from "../components/Patient/Profile/WidgetsColumn";
import VitalsTab from "../components/Patient/Profile/VitalsTab";
import HistoryTab from "../components/Patient/Profile/HistoryTab";
import SettingsTab from "../components/Patient/Profile/SettingsTab";
import CustomModal from "../components/Patient/Profile/CustomModal";

const PatientProfile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Tabs Navigation
  const [activeTab, setActiveTab] = useState("vitals");

  // Custom Modal for Danger Zone
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
    dateOfBirth: "",
    bloodGroup: "",
    height: "",
    weight: "",
    medicalHistory: [],
    allergies: [],
    currentMedications: [],
    familyHistory: [],
    pastSurgeries: [],
    vaccinations: [],
    lifestyle: { smoking: "No", alcohol: "No", activityLevel: "Moderate" },
    emergencyContact: { name: "", phone: "", relation: "" },
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (getPatientProfile) {
          const res = await getPatientProfile();
          if (res.data) {
            const fetchedData = {
              ...formData,
              ...res.data,
              dateOfBirth: res.data.dateOfBirth
                ? res.data.dateOfBirth.split("T")[0]
                : "",
              lifestyle: {
                ...formData.lifestyle,
                ...(res.data.lifestyle || {}),
              },
              emergencyContact: {
                ...formData.emergencyContact,
                ...(res.data.emergencyContact || {}),
              },
              medicalHistory: res.data.medicalHistory || [],
              allergies: res.data.allergies || [],
              currentMedications: res.data.currentMedications || [],
              familyHistory: res.data.familyHistory || [],
              pastSurgeries: res.data.pastSurgeries || [],
              vaccinations: res.data.vaccinations || [],
              phone: user?.phone || "",
              email: user?.email || "",
            };
            setFormData(fetchedData);
            setInitialData(fetchedData);
          }
        }
      } catch (error) {
        console.error("Error fetching patient profile", error);
        setMessage({ type: "error", text: "Could not load profile data." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smart Save Tracker
  useEffect(() => {
    if (initialData) {
      const hasChanges =
        JSON.stringify(formData) !== JSON.stringify(initialData);
      setIsDirty(hasChanges);
    }
  }, [formData, initialData]);

  const bmiData = useMemo(() => {
    if (formData.height && formData.weight) {
      const h = formData.height / 100;
      const val = (formData.weight / (h * h)).toFixed(1);

      let status = "Unknown";
      let color = "#94a3b8";

      if (val < 18.5) {
        status = "Underweight";
        color = "#3b82f6";
      } else if (val < 25) {
        status = "Healthy Weight";
        color = "#10b981";
      } else if (val < 30) {
        status = "Overweight";
        color = "#f59e0b";
      } else {
        status = "Obese";
        color = "#ef4444";
      }

      return { value: val, status, color };
    }
    return null;
  }, [formData.height, formData.weight]);

  const profileStrength = useMemo(() => {
    let score = 0;
    if (formData.dateOfBirth) score += 10;
    if (formData.bloodGroup) score += 10;
    if (formData.height && formData.weight) score += 20;
    if (formData.emergencyContact?.name) score += 15;
    if (formData.medicalHistory.length > 0) score += 10;
    if (formData.lifestyle?.activityLevel) score += 10;
    if (formData.lifestyle?.smoking) score += 10;
    if (
      formData.familyHistory.length > 0 ||
      formData.pastSurgeries.length > 0 ||
      formData.vaccinations.length > 0
    )
      score += 15;
    return Math.min(score, 100);
  }, [formData]);

  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleArrayChange = (field, index, subField, value) => {
    const updated = [...formData[field]];
    updated[index][subField] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const addItem = (field, item) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeItem = (field, index) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) return;
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      if (updatePatientProfile) await updatePatientProfile(formData);
      setInitialData(formData);
      setMessage({
        type: "success",
        text: "Medical profile updated successfully!",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // --- Password & Account Handlers ---
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
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
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password.",
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
        "Are you sure you want to deactivate your account? You can reactivate by simply logging in again.",
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
        "This action is completely irreversible. All your medical records, history, and appointments will be erased forever.",
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

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading Profile...
        </p>
      </div>
    );

  const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="mobile-scaler w-full max-w-5xl mx-auto px-4 py-6 md:py-8 font-sans relative z-10 text-slate-800 dark:text-slate-200">
      
      <Header
        handlePrint={handlePrint}
        activeTab={activeTab}
        isDirty={isDirty}
        saving={saving}
      />

      <ProfileMessages message={message} />

      <HealthIDCard user={user} formData={formData} />

      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <form id="profile-form" onSubmit={handleSubmit}>
        <div className="main-layout-grid flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          <motion.div
            key={activeTab}
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 w-full"
          >
            {activeTab === "vitals" && (
              <VitalsTab
                formData={formData}
                handleChange={handleChange}
                handleNestedChange={handleNestedChange}
              />
            )}
            
            {activeTab === "history" && (
              <HistoryTab
                formData={formData}
                handleArrayChange={handleArrayChange}
                addItem={addItem}
                removeItem={removeItem}
              />
            )}
            
            {activeTab === "settings" && (
              <SettingsTab
                formData={formData}
                handleChange={handleChange}
                passwordData={passwordData}
                handlePasswordChange={handlePasswordChange}
                submitPasswordChange={submitPasswordChange}
                saving={saving}
                confirmDeactivate={confirmDeactivate}
                confirmDelete={confirmDelete}
              />
            )}
          </motion.div>

          <WidgetsColumn
            bmiData={bmiData}
            profileStrength={profileStrength}
            formData={formData}
          />
        </div>
      </form>

      <CustomModal
        customModal={customModal}
        closeCustomModal={closeCustomModal}
        modalInput={modalInput}
        setModalInput={setModalInput}
        modalLoading={modalLoading}
      />

      <style>{`
        .glass-scroll::-webkit-scrollbar { height: 4px; }
        .glass-scroll::-webkit-scrollbar-track { background: transparent; }
        .glass-scroll::-webkit-scrollbar-thumb { background: rgba(15, 23, 42, 0.1); border-radius: 10px; }
        .dark .glass-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }

        @media (max-width: 768px) {
            .mobile-scaler {
                width: 112%; 
                transform: scale(0.9);
                transform-origin: top left;
                margin-bottom: -20%; 
            }
        }

        @media print {
            body * { visibility: hidden; }
            .no-print { display: none !important; }
            .printable-card, .printable-card * { visibility: visible; }
            .printable-card { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; border: 1px solid #000; }
        }
      `}</style>
    </div>
  );
};

export default PatientProfile;