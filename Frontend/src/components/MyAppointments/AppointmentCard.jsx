import React from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiVideo,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiFileText,
  FiStar,
} from "react-icons/fi";

const AppointmentCard = ({
  appt,
  user,
  itemVariants,
  handleStartChat,
  setInfoPatientId,
  setViewingRx,
  setRatingAppointment,
  handleJoinCall,
  handleStatusUpdate,
  getInitials,
}) => {
  const dateObj = new Date(appt.appointmentDate);
  const isDoctor = user.role === "doctor";
  const otherParty = isDoctor ? appt.patientId : appt.doctorId;
  const otherName = otherParty?.name || "Unknown User";

  // Dynamic Status Styling
  const isScheduled = appt.status === "Scheduled";
  const isCompleted = appt.status === "Completed";
  const isCancelled = appt.status === "Cancelled";

  return (
    <motion.div
      variants={itemVariants}
      className="appt-card flex flex-col md:flex-row bg-white/70 dark:bg-white/[0.04] backdrop-blur-md border border-black/[0.05] dark:border-white/[0.06] rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:border-black/[0.1] dark:hover:border-white/[0.1] transition-all group"
    >
      {/* 1. LEFT: DATE STRIP */}
      <div className="card-date-strip w-full md:w-[100px] bg-black/[0.02] dark:bg-black/20 border-b md:border-b-0 md:border-r border-black/[0.04] dark:border-white/[0.04] flex flex-row md:flex-col items-center justify-center p-3 md:p-4 gap-2 md:gap-0 flex-shrink-0">
        <span className="date-month text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {dateObj.toLocaleString("default", { month: "short" })}
        </span>
        <span className="date-day text-2xl md:text-3xl font-black text-slate-800 dark:text-[#F1F5F9] my-0 md:my-1">
          {dateObj.getDate()}
        </span>
        <span className="date-year text-[10px] font-semibold text-slate-400 dark:text-slate-500">
          {dateObj.getFullYear()}
        </span>
      </div>

      {/* 2. RIGHT: MAIN CONTENT */}
      <div className="card-content flex-1 p-4 md:p-5 flex flex-col justify-between gap-4">
        {/* A. Top Row: User Info & Status */}
        <div className="content-header flex justify-between items-start md:items-center">
          <div className="user-profile flex items-center gap-3">
            <div className="avatar-circle w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white flex items-center justify-center font-bold text-sm shadow-sm border border-white/10">
              {getInitials(otherName)}
            </div>
            <div className="user-text">
              <h4 className="user-name m-0 text-sm md:text-base font-bold text-slate-800 dark:text-[#F1F5F9]">
                {otherName}
              </h4>
              <span className="user-role text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isDoctor ? "Patient" : "Specialist"}
              </span>
            </div>
          </div>
          <span
            className={`status-badge px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
                                        ${
                                          isScheduled
                                            ? "bg-blue-50/80 dark:bg-cyan-900/30 text-blue-600 dark:text-cyan-400 border-blue-100/50 dark:border-cyan-800/50"
                                            : ""
                                        }
                                        ${
                                          isCompleted
                                            ? "bg-green-50/80 dark:bg-emerald-900/30 text-green-600 dark:text-emerald-400 border-green-100/50 dark:border-emerald-800/50"
                                            : ""
                                        }
                                        ${
                                          isCancelled
                                            ? "bg-red-50/80 dark:bg-rose-900/30 text-red-600 dark:text-rose-400 border-red-100/50 dark:border-rose-800/50"
                                            : ""
                                        }
                                    `}
          >
            {appt.status}
          </span>
        </div>

        {/* B. Middle Row: Details */}
        <div className="content-details flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 pb-3 border-b border-black/[0.04] dark:border-white/[0.04]">
          <div className="detail-item flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-black/[0.03] dark:bg-white/[0.05] px-2.5 py-1 rounded-md">
            <FiClock className="text-[#06B6D4]" /> <span>{appt.timeSlot}</span>
          </div>
          <div className="detail-item flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-black/[0.03] dark:bg-white/[0.05] px-2.5 py-1 rounded-md">
            <FiVideo className="text-[#06B6D4]" /> <span>Tele-Consult</span>
          </div>
          <div className="detail-reason text-xs text-slate-500 dark:text-slate-400 flex-1 truncate">
            <span className="font-bold text-slate-700 dark:text-slate-200 mr-1">
              For:
            </span>{" "}
            {appt.reason}
          </div>
        </div>

        {/* C. Bottom Row: ACTIONS */}
        <div className="content-actions flex flex-wrap items-center gap-2 md:gap-3">
          {/* 1. Message */}
          {!isCancelled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="action-btn chat-btn flex-1 md:flex-none px-4 py-2 rounded-[12px] bg-white dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.1] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black/[0.02] dark:hover:bg-white/[0.1] shadow-sm transition-colors"
              onClick={() => handleStartChat(otherParty)}
            >
              <FiMessageSquare className="btn-icon text-[#2563EB] dark:text-cyan-400" />{" "}
              Message
            </motion.button>
          )}

          {/* 2. INFO (Doctor Only) */}
          {isDoctor && isScheduled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="action-btn chat-btn flex-1 md:flex-none px-4 py-2 rounded-[12px] bg-white dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.1] text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black/[0.02] dark:hover:bg-white/[0.1] shadow-sm transition-colors"
              onClick={() => setInfoPatientId(appt.patientId?._id)}
            >
              <FiInfo className="btn-icon text-[#06B6D4]" /> Snapshot
            </motion.button>
          )}

          {/* 3. RECORDS/Rx */}
          {isCompleted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="action-btn flex-1 md:flex-none px-4 py-2 rounded-[12px] bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 shadow-sm transition-colors"
              onClick={() => setViewingRx(appt)}
            >
              <FiFileText className="btn-icon" />{" "}
              {isDoctor ? "Records" : "Prescription"}
            </motion.button>
          )}

          {/* 4. RATE DOCTOR (Patient Only) */}
          {!isDoctor && isCompleted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="action-btn flex-1 md:flex-none px-4 py-2 rounded-[12px] bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-500 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-100 dark:hover:bg-amber-900/40 shadow-sm transition-colors"
              onClick={() => setRatingAppointment(appt)}
            >
              <FiStar
                className={`btn-icon ${appt.rating ? "fill-amber-500" : ""}`}
              />{" "}
              {appt.rating ? "Rating" : "Rate"}
            </motion.button>
          )}

          {/* 5. VIDEO CALL */}
          {isScheduled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="action-btn video-btn flex-1 md:flex-none px-5 py-2 rounded-[12px] bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white border border-white/10 text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
              onClick={() => handleJoinCall(appt)}
            >
              <FiVideo className="btn-icon" /> Join Call
            </motion.button>
          )}

          {/* 6. DOCTOR ACTIONS (Complete/Cancel) */}
          {isDoctor && isScheduled && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="action-btn complete-btn flex-1 md:flex-none px-4 py-2 rounded-[12px] bg-green-500 text-white border border-green-600 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-green-600 transition-colors"
                onClick={() => handleStatusUpdate(appt._id, "Completed")}
              >
                <FiCheckCircle className="btn-icon" /> Done
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="action-btn cancel-btn w-10 h-9 rounded-[12px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-500 flex items-center justify-center shadow-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                title="Cancel Appointment"
                onClick={() => handleStatusUpdate(appt._id, "Cancelled")}
              >
                <FiXCircle size={16} />
              </motion.button>
            </>
          )}

          {/* 7. PATIENT CANCEL */}
          {!isDoctor && isScheduled && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="action-btn cancel-btn w-10 h-9 rounded-[12px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-500 flex items-center justify-center shadow-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
              title="Cancel Appointment"
              onClick={() => handleStatusUpdate(appt._id, "Cancelled")}
            >
              <FiXCircle size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;