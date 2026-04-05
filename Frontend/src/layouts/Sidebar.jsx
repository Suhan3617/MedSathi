import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiActivity,
  FiSettings,
  FiCpu,
  FiX,
  FiMessageSquare,
  FiLogOut,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  let menuItems = [];
  if (user?.role === "patient") {
    menuItems = [
      { path: "/patient", label: "Dashboard", icon: <FiGrid /> },
      {
        path: "/patient/find-doctors",
        label: "Find Doctors",
        icon: <FiUsers />,
      },
      {
        path: "/patient/messages",
        label: "Messages",
        icon: <FiMessageSquare />,
      },
      { path: "/patient/ai", label: "MedSathi AI", icon: <FiCpu /> },
      {
        path: "/patient/AiSymptomChecker",
        label: "Symptom Checker",
        icon: <FiActivity />,
      },
      {
        path: "/patient/appointments",
        label: "Appointments",
        icon: <FiCalendar />,
      },
      // Removed Medical Profile from here
    ];
  } else if (user?.role === "doctor") {
    menuItems = [
      { path: "/doctor", label: "Overview", icon: <FiGrid /> },
      {
        path: "/doctor/messages",
        label: "Messages",
        icon: <FiMessageSquare />,
      },
      { path: "/doctor/ai", label: "MedSathi AI", icon: <FiCpu /> },
      { path: "/doctor/appointments", label: "Schedule", icon: <FiCalendar /> },
      // Removed Profile Settings from here
    ];
  }

  // Profile link based on role
  const profileLink =
    user?.role === "doctor" ? "/doctor/profile" : "/patient/profile";

  return (
    <>
      {/* Mobile Overlay with smooth fade */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[90] bg-slate-900/40 dark:bg-[#0A0F1E]/60 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-[100] flex flex-col w-[260px] bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-[16px] border-r border-slate-200/60 dark:border-white/5 shadow-[5px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[5px_0_35px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 🔥 Header / Logo (Sidebar Version) */}
        <div className="h-[76px] px-6 flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20 shrink-0">
              <FiActivity size={18} strokeWidth={2.5} />
            </div>
            <div className="text-[1.15rem] font-extrabold text-slate-900 dark:text-[#F1F5F9] tracking-tight">
              Med<span className="text-blue-600 dark:text-cyan-400">Sathi</span>
            </div>
          </div>

          {isMobile && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5"
              onClick={onClose}
            >
              <FiX size={22} />
            </motion.button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5 custom-scrollbar">
          <div className="px-2 mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-[#64748B]">
            Menu
          </div>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/patient" || item.path === "/doctor"}
              className={({ isActive }) => `
                group flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-sm font-semibold transition-all duration-250 ease-out border border-transparent
                ${
                  isActive
                    ? "bg-blue-50/80 dark:bg-cyan-900/20 text-blue-700 dark:text-cyan-400 shadow-sm dark:shadow-[inset_0_0_15px_rgba(6,182,212,0.15)] dark:border-cyan-500/10"
                    : "text-slate-500 dark:text-[#CBD5E1] hover:bg-slate-100/50 dark:hover:bg-[#ffffff06] hover:text-slate-800 dark:hover:text-[#F1F5F9]"
                }
              `}
              onClick={() => isMobile && onClose()} // Close menu on mobile click
            >
              {({ isActive }) => (
                <>
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center justify-center transition-colors ${isActive ? "text-blue-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-cyan-400"}`}
                  >
                    {React.cloneElement(item.icon, { size: 18 })}
                  </motion.span>
                  <span className="tracking-wide">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
          
        </nav>

        {/* Footer / User Card (Now clicks to Profile) */}
        <div className="p-5 border-t border-slate-200/60 dark:border-white/5 shrink-0">
          <Link
            to={profileLink}
            onClick={() => isMobile && onClose()}
            className="block outline-none mb-2"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-3 bg-white/60 dark:bg-[#ffffff06] backdrop-blur-md border border-slate-100 dark:border-white/5 rounded-[16px] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-extrabold text-sm border border-blue-200/50 dark:border-cyan-800/30 shrink-0 shadow-inner">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 dark:text-[#F1F5F9] truncate">
                  Profile
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-[#64748B] capitalize tracking-wide">
                  View & Edit
                </div>
              </div>
            </motion.div>
          </Link>
            <button
              onClick={() => {
                if (isMobile) onClose();
                handleLogout();
              }}
              className="w-full group flex items-center gap-3 px-3.5 py-3 rounded-[14px] text-sm font-semibold transition-all duration-250 ease-out border border-transparent text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center transition-transform group-hover:translate-x-0.5"
              >
                <FiLogOut size={18} />
              </motion.span>
              <span className="tracking-wide">Logout</span>
            </button>
        </div>
      </aside>

      {/* Hide Scrollbar for Webkit & Firefox inside the sidebar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.2);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
