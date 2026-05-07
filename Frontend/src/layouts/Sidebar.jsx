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

        {/* Footer / Premium User Card */}
        <div className="p-5 border-t border-slate-200/60 dark:border-white/5 shrink-0">
          <Link
            to={profileLink}
            onClick={() => isMobile && onClose()}
            className="block outline-none mb-3"
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-3 p-3.5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/80 dark:border-slate-700/50 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-cyan-700/50 transition-all overflow-hidden cursor-pointer"
            >
              {/* Subtle background glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 dark:from-cyan-500/0 dark:via-cyan-500/10 dark:to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0 z-10">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              
              <div className="flex-1 min-w-0 z-10">
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  {user?.name || "My Profile"}
                </div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                  {user?.role === "doctor" ? "Doctor Account" : "Patient Account"}
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors z-10 shrink-0">
                <FiSettings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
              </div>
            </motion.div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => {
              if (isMobile) onClose();
              handleLogout();
            }}
            className="w-full group flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-250 ease-out border border-transparent text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
          >
            <motion.span
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center transition-transform group-hover:-translate-x-0.5"
            >
              <FiLogOut size={16} />
            </motion.span>
            <span className="tracking-wide">Sign Out</span>
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