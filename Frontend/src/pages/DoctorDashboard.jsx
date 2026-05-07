// src/pages/DoctorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import {
  getMyAppointments,
  getDoctorProfileMe,
  getDoctorAnalytics,
} from "../services/api";
import { FiGrid, FiPieChart, FiAward, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Modals / Components
import PatientSnapshotDrawer from "../components/PatientSnapshotDrawer";
import ConsultationModal from "../components/ConsultationModal";
import VideoCallWidget from "../components/VideoCallWidgetComponent";
import PrescriptionViewerModal from "../components/Doctor/dashboard/PrescriptionViewerModal";
import AnalyticsPanel from "../components/Doctor/dashboard/AnalyticsPanel";
import DashboardOverview from "../components/Doctor/dashboard/DashboardOverview";

// Theme / Styling
import { textPrimary, textMuted, primaryGradientText } from "../components/Doctor/dashboard/dashboardTheme";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [viewMode, setViewMode] = useState("overview");

  // Data State
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [priorityStats, setPriorityStats] = useState({
    highRisk: 0,
    pending: 0,
    routine: 0,
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [consultationAppt, setConsultationAppt] = useState(null);
  const [activeCallAppt, setActiveCallAppt] = useState(null);
  const [viewingPrescriptionAppt, setViewingPrescriptionAppt] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile (Kept for future use, but removed the alert/redirect)
      const profRes = await getDoctorProfileMe();
      const docProfile = profRes?.data;

      // 2. Load Appointments
      const apptRes = await getMyAppointments();
      const allAppts = apptRes.data || [];
      const today = new Date().toDateString();

      let todaysList = allAppts.filter(
        (appt) =>
          new Date(appt.appointmentDate).toDateString() === today &&
          appt.status !== "Cancelled"
      );

      const uniqueAppts = Array.from(
        new Map(todaysList.map((item) => [item._id, item])).values()
      );
      uniqueAppts.sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

      updateDashboardState(uniqueAppts);

      // 3. Load Analytics
      const analyticsRes = await getDoctorAnalytics();
      setAnalyticsData(analyticsRes.data);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDashboardState = (appointments) => {
    setTodayAppointments(appointments);
    setPriorityStats({
      highRisk: appointments.filter((a) => a.riskTag === "High Risk").length,
      pending: appointments.filter((a) => a.status === "Scheduled").length,
      routine: appointments.filter((a) => a.riskTag !== "High Risk").length,
    });
  };

  const handlePatientClick = (patientId) => {
    setSelectedPatientId(patientId);
    setIsDrawerOpen(true);
  };

  const startConsultation = (appt) => {
    setConsultationAppt(appt);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon 🌤️";
    return "Good Evening 🌙";
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0A0F1E] font-sans transition-colors duration-300 w-full overflow-x-hidden pt-6 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              <span className={textPrimary}>{getGreeting()} </span>
              <span className={primaryGradientText}>
                Dr. {user?.name || ""}
              </span>
            </h1>

            <p className={`text-base ${textMuted} mb-4`}>
              You have{" "}
              <strong className={textPrimary}>
                {todayAppointments.length}
              </strong>{" "}
              appointments today.
            </p>

            {/* Badges Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {analyticsData && analyticsData.totalPatients > 5 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200/50 dark:border-orange-500/20 backdrop-blur-md">
                  <FiAward size={14} /> Practice Builder
                </div>
              )}
              {analyticsData && analyticsData.totalAppointments > 20 && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-bold border border-purple-200/50 dark:border-purple-500/20 backdrop-blur-md">
                  <FiStar size={14} /> Top Doc
                </div>
              )}
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex shrink-0 bg-slate-200/60 dark:bg-slate-800/60 backdrop-blur-md p-1 rounded-xl border border-white/40 dark:border-white/5">
            {["overview", "analytics"].map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setViewMode(mode)}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  viewMode === mode
                    ? "text-blue-600 dark:text-cyan-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {viewMode === mode && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white dark:bg-[#1E293B] rounded-lg border border-black/5 dark:border-white/5 shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {mode === "overview" ? (
                    <FiGrid size={16} />
                  ) : (
                    <FiPieChart size={16} />
                  )}
                  {mode}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === "overview" ? (
            <DashboardOverview
              priorityStats={priorityStats}
              loading={loading}
              todayAppointments={todayAppointments}
              handlePatientClick={handlePatientClick}
              startConsultation={startConsultation}
              setActiveCallAppt={setActiveCallAppt}
              setViewingPrescriptionAppt={setViewingPrescriptionAppt}
            />
          ) : (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalyticsPanel analyticsData={analyticsData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODALS */}
      <PatientSnapshotDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        patientId={selectedPatientId}
      />
      <ConsultationModal
        appointment={consultationAppt}
        onClose={() => setConsultationAppt(null)}
        onSuccess={fetchDashboardData}
      />
      <PrescriptionViewerModal
        appointment={viewingPrescriptionAppt}
        onClose={() => setViewingPrescriptionAppt(null)}
      />

      {activeCallAppt && (
        <VideoCallWidget
          appointment={activeCallAppt}
          onClose={() => setActiveCallAppt(null)}
        />
      )}

      {/* Inject Global Scrollbar Styles for the Glass Theme */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(148, 163, 184, 0.3);
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(148, 163, 184, 0.2);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(148, 163, 184, 0.5);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `,
        }}
      />
    </div>
  );
};

export default DoctorDashboard;