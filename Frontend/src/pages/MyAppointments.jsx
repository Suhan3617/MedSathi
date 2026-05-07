import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiSearch } from "react-icons/fi";
import { getMyAppointments, updateAppointmentStatus } from "../services/api";
import { useAuth } from "../context/AuthContext";

// Components
import VideoCallWidget from "../components/VideoCallWidgetComponent";
import QuickInfoModal from "../components/MyAppointments/QuickInfoModal";
import PrescriptionViewer from "../components/MyAppointments/PrescriptionViewer";
import RatingModal from "../components/MyAppointments/RatingModal";
import HeaderFilters from "../components/MyAppointments/HeaderFilters";
import SearchBar from "../components/MyAppointments/SearchBar";
import AppointmentCard from "../components/MyAppointments/AppointmentCard";

const MyAppointments = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [activeCallAppointment, setActiveCallAppointment] = useState(null);

  const [infoPatientId, setInfoPatientId] = useState(null);

  const [viewingRx, setViewingRx] = useState(null);

  const [ratingAppointment, setRatingAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);

    try {
      const res = await getMyAppointments();

      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate),
      );

      setAppointments(sorted);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this appointment as ${newStatus}?`,
      )
    ) {
      return;
    }

    try {
      await updateAppointmentStatus(id, {
        status: newStatus,
      });

      fetchAppointments();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleStartChat = (otherParty) => {
    const route =
      user.role === "doctor" ? "/doctor/messages" : "/patient/messages";

    navigate(route, {
      state: { selectedUser: otherParty },
    });
  };

  const handleJoinCall = (appointment) => setActiveCallAppointment(appointment);

  const filteredAppointments = appointments.filter((appt) => {
    const statusMatch = filter === "All" || appt.status === filter;

    const otherParty = user.role === "doctor" ? appt.patientId : appt.doctorId;

    const searchMatch = (otherParty?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "??";

  // Animation Variants for List
  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },

    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="app-container w-full max-w-5xl mx-auto p-4 md:p-8 font-sans text-slate-800 dark:text-slate-200 pb-24 md:pb-8">
      <HeaderFilters filter={filter} setFilter={setFilter} />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        user={user}
      />

      {/* --- CONTENT SECTION --- */}

      {loading ? (
        <div className="loading-state flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Syncing schedule...
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state flex flex-col items-center justify-center text-center p-10 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md border border-black/[0.05] dark:border-white/[0.05] rounded-[24px] min-h-[300px]"
        >
          <div className="empty-icon w-16 h-16 rounded-full bg-black/[0.03] dark:bg-white/[0.05] flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
            <FiCalendar size={28} />
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-[#F1F5F9] m-0 mb-2">
            No appointments found
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs m-0 mb-6">
            We couldn't find any records matching your current filters.
          </p>

          {user.role === "patient" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/find-doctors")}
              className="action-btn px-5 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-[14px] font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 border border-white/10"
            >
              <FiSearch className="btn-icon" />
              Book Consultation
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="cards-grid flex flex-col gap-4"
        >
          {filteredAppointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appt={appt}
              user={user}
              itemVariants={itemVariants}
              handleStartChat={handleStartChat}
              setInfoPatientId={setInfoPatientId}
              setViewingRx={setViewingRx}
              setRatingAppointment={setRatingAppointment}
              handleJoinCall={handleJoinCall}
              handleStatusUpdate={handleStatusUpdate}
              getInitials={getInitials}
            />
          ))}
        </motion.div>
      )}

      {/* Modals & Widgets */}

      {activeCallAppointment && (
        <VideoCallWidget
          appointment={activeCallAppointment}
          onClose={() => setActiveCallAppointment(null)}
        />
      )}

      {infoPatientId && (
        <QuickInfoModal
          patientId={infoPatientId}
          onClose={() => setInfoPatientId(null)}
        />
      )}

      {viewingRx && (
        <PrescriptionViewer
          appointment={viewingRx}
          onClose={() => setViewingRx(null)}
        />
      )}

      {ratingAppointment && (
        <RatingModal
          appointment={ratingAppointment}
          onClose={() => setRatingAppointment(null)}
          onRefresh={fetchAppointments}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 10px;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }

        .glass-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .glass-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .glass-scroll::-webkit-scrollbar-thumb {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 10px;
        }

        .dark .glass-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default MyAppointments;
