// src/pages/PatientDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // 🔥 Added useNavigate
import { useAuth } from "../context/AuthContext";
import {
  getMyAppointments,
  getPatientProfile,
  updatePatientProfile,
} from "../services/api";
import { motion } from "framer-motion";

// Components
import DashboardHeader from "../components/Patient/PatientDashboard/DashboardHeader";
import UpcomingAppointment from "../components/Patient/PatientDashboard/UpcomingAppointment";
import ActivityChart from "../components/Patient/PatientDashboard/ActivityChart";
import HealthScoreWidget from "../components/Patient/PatientDashboard/HealthScoreWidget";
import StatsSummary from "../components/Patient/PatientDashboard/StatsSummary";
import QuickActions from "../components/Patient/PatientDashboard/QuickActions";
import VitalsModal from "../components/Patient/PatientDashboard/VitalsModal";

// Constants
import { HEALTH_TIPS , staggerContainer } from "../components/Patient/PatientDashboard/dashboardConstants";

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // 🔥 Initialize navigate

  // ---------------- STATES ----------------
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, online: 0 });
  const [chartData, setChartData] = useState([]);
  const [tip, setTip] = useState("");

  // Vitals
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [vitalsSaving, setVitalsSaving] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    spO2: "",
  });

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    setTip(HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)]);
    fetchDashboardData();
  }, []);

  // ---------------- FETCH DATA ----------------
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 🔥 1. Fetch Profile & Check if Complete
      const profRes = await getPatientProfile();
      const pData = profRes?.data;
      
      // If optional fields from signup are completely empty, force profile completion
      if (pData && !pData.dateOfBirth && !pData.bloodGroup && !pData.emergencyContactPhone) {
        alert("Welcome to MedSathi! Please complete your medical profile for a better healthcare experience.");
        navigate("/patient/profile");
        return; // Stop loading dashboard and redirect
      }
      
      setProfile(pData || {});

      // 2. Fetch Appointments
      const apptRes = await getMyAppointments();
      const allAppts = apptRes?.data || [];

      const now = new Date();

      const future = allAppts
        .filter(
          (a) =>
            new Date(a.appointmentDate) >= now &&
            a.status !== "Cancelled"
        )
        .sort(
          (a, b) =>
            new Date(a.appointmentDate) -
            new Date(b.appointmentDate)
        );

      setNextAppointment(future[0] || null);

      // --- Stats ---
      setStats({
        total: allAppts.length,
        completed: allAppts.filter((a) => a.status === "Completed").length,
        online: allAppts.filter((a) => a.type === "Online").length,
      });

      // --- Chart Data ---
      const monthMap = {};

      allAppts.forEach((appt) => {
        const month = new Date(appt.appointmentDate).toLocaleString(
          "default",
          { month: "short" }
        );
        monthMap[month] = (monthMap[month] || 0) + 1;
      });

      const chartArr = Object.keys(monthMap).map((key) => ({
        name: key,
        visits: monthMap[key],
      }));

      setChartData(chartArr);

    } catch (err) {
      console.error("Dashboard Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HEALTH SCORE ----------------
  const healthScore = useMemo(() => {
    if (!profile) return 50;

    let score = 50;

    if (profile.bloodGroup) score += 10;

    if (profile.height && profile.weight) {
      const h = profile.height / 100;
      const bmi = profile.weight / (h * h);

      if (bmi > 18.5 && bmi < 25) score += 20;
      else score += 10;
    }

    if (profile.lifestyle?.smoking === "No") score += 10;
    if (profile.lifestyle?.activityLevel === "Active") score += 10;

    return Math.min(score, 100);
  }, [profile]);

  // ---------------- DATE FORMAT ----------------
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);

    return {
      day: d.getDate(),
      month: d.toLocaleString("default", { month: "short" }),
      time: d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      weekday: d.toLocaleString("default", { weekday: "long" }),
    };
  };

  const nextDate = nextAppointment
    ? formatDate(nextAppointment.appointmentDate)
    : null;

  // ---------------- VITALS ----------------
  const handleOpenVitals = () => {
    setVitalsForm({
      bloodPressure: profile?.vitals?.bloodPressure || "",
      heartRate: profile?.vitals?.heartRate || "",
      temperature: profile?.vitals?.temperature || "",
      spO2: profile?.vitals?.spO2 || "",
    });
    setShowVitalsModal(true);
  };

  const handleVitalsSubmit = async (e) => {
    e.preventDefault();
    setVitalsSaving(true);

    try {
      const updatedProfile = {
        ...profile,
        vitals: {
          ...vitalsForm,
          lastUpdated: new Date().toISOString(),
        },
      };

      // Optimistic UI
      setProfile(updatedProfile);
      setShowVitalsModal(false);

      const res = await updatePatientProfile(updatedProfile);

      if (res?.data?.vitals) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error("Vitals Update Error:", err);
      alert("Failed to update vitals. Try again.");
    } finally {
      setVitalsSaving(false);
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-slate-400 dark:text-slate-500 text-sm font-medium">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading your personalized dashboard...
        </motion.div>
      </div>
    );
  }

  // ---------------- UI ----------------
  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6 min-h-screen text-slate-800 dark:text-slate-200"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <DashboardHeader user={user} tip={tip} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* LEFT */}
        <motion.div
          variants={staggerContainer}
          className="flex flex-col gap-6 lg:gap-8 lg:col-span-2"
        >
          <UpcomingAppointment
            nextAppointment={nextAppointment}
            nextDate={nextDate}
          />
          <ActivityChart chartData={chartData} />
        </motion.div>

        {/* RIGHT */}
        <motion.div
          variants={staggerContainer}
          className="flex flex-col gap-6 lg:gap-8"
        >
          <HealthScoreWidget
            healthScore={healthScore}
            profile={profile}
            radius={radius}
            circumference={circumference}
          />
          <StatsSummary stats={stats} />
          <QuickActions onOpenVitals={handleOpenVitals} />
        </motion.div>
      </div>

      <VitalsModal
        show={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        onSubmit={handleVitalsSubmit}
        saving={vitalsSaving}
        form={vitalsForm}
        setForm={setVitalsForm}
      />
    </motion.div>
  );
};

export default PatientDashboard;