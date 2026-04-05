import React, { useEffect, useState } from "react";
import { getAllDoctors, getMyAppointments } from "../../services/api";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FaSearch, FaUserMd, FaInbox } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ChatSidebar = ({
  currentUser,
  onSelectUser,
  selectedUser,
  mobileView,
}) => {
  const [baseContacts, setBaseContacts] = useState([]);
  const [dbContacts, setDbContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUserId = String(currentUser?._id);

  // 1. Fetch Contacts from Database (Appointments / Doctors list)
  useEffect(() => {
    const fetchBaseContacts = async () => {
      if (!currentUser || !currentUser._id) return;

      try {
        setLoading(true);
        let data = [];

        if (currentUser.role === "patient") {
          const response = await getAllDoctors();
          data = response.data || [];
        } else if (currentUser.role === "doctor") {
          const response = await getMyAppointments();
          const uniquePatients = [];
          const map = new Map();
          if (response.data) {
            response.data.forEach((appt) => {
              if (appt.patientId && !map.has(appt.patientId._id)) {
                map.set(appt.patientId._id, true);
                uniquePatients.push({
                  _id: appt.patientId._id,
                  name: appt.patientId.name,
                  email: appt.patientId.email,
                  role: "Patient",
                });
              }
            });
          }
          data = uniquePatients;
        }
        setBaseContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBaseContacts();
  }, [currentUser]);

  // 2. Fetch Active Chats from Firebase Realtime
  useEffect(() => {
    if (!currentUserId || currentUserId === "undefined") return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUserId),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        let otherParticipant = data.participantDetails?.find(
          (p) => String(p._id) !== currentUserId,
        );

        if (!otherParticipant && data.participants) {
          const otherId = data.participants.find(
            (id) => String(id) !== currentUserId,
          );
          if (otherId) {
            otherParticipant = {
              _id: otherId,
              name: "Unknown User",
              email: "",
              role: "User",
            };
          }
        }

        if (otherParticipant) {
          const myUnreadCount = data.unreadCounts?.[currentUserId] || 0;
          chats.push({
            _id: otherParticipant._id,
            name: otherParticipant.name || "Unknown User",
            email: otherParticipant.email,
            role: otherParticipant.role || "User",
            lastMessage: data.lastMessage,
            lastUpdated: data.lastUpdated,
            unreadCount: myUnreadCount,
          });
        }
      });
      setDbContacts(chats);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  // 3. Merge and Sort Contacts Safely
  const mergedMap = new Map();

  baseContacts.forEach((c) => {
    mergedMap.set(String(c._id), { ...c, unreadCount: 0 });
  });

  dbContacts.forEach((dbC) => {
    const id = String(dbC._id);
    const existing = mergedMap.get(id);

    if (existing) {
      mergedMap.set(id, {
        ...existing,
        lastMessage: dbC.lastMessage,
        lastUpdated: dbC.lastUpdated,
        unreadCount: dbC.unreadCount,
      });
    } else {
      mergedMap.set(id, dbC);
    }
  });

  let finalContacts = Array.from(mergedMap.values());

  finalContacts.sort((a, b) => {
    const timeA = a.lastUpdated?.seconds
      ? a.lastUpdated.seconds
      : a.lastUpdated
        ? new Date(a.lastUpdated).getTime() / 1000
        : 0;
    const timeB = b.lastUpdated?.seconds
      ? b.lastUpdated.seconds
      : b.lastUpdated
        ? new Date(b.lastUpdated).getTime() / 1000
        : 0;
    return timeB - timeA;
  });

  if (selectedUser && !mergedMap.has(String(selectedUser._id))) {
    finalContacts.unshift(selectedUser);
  }

  const filteredContacts = finalContacts.filter((contact) =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative z-10">
      {/* --- HEADER --- */}
      <div
        className="p-4 border-b border-black/[0.05] dark:border-white/[0.06] sticky top-0 z-20 
                      bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-[#F1F5F9] tracking-tight flex items-center gap-2">
            <FaInbox className="text-blue-500 dark:text-cyan-400 opacity-80" />
            Clinical Inbox
          </h2>
          <span className="text-[10px] bg-blue-50/80 dark:bg-cyan-900/30 text-blue-600 dark:text-cyan-400 border border-blue-100/50 dark:border-cyan-800/50 px-2.5 py-1 rounded-full font-bold shadow-sm">
            {filteredContacts.length} Sessions
          </span>
        </div>

        <div className="relative group">
          <input
            type="text"
            placeholder="Search directory..."
            className="w-full pl-9 pr-4 py-2 bg-white/70 dark:bg-black/20 border border-black/[0.06] dark:border-white/[0.08] rounded-[14px] text-sm outline-none focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-[#06B6D4]/40 transition-all text-slate-800 dark:text-slate-100 placeholder-slate-400 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-[#06B6D4]" />
        </div>
      </div>

      {/* --- CONTACT LIST --- */}
      <div
        className="flex-1 overflow-y-auto py-2
                      [&::-webkit-scrollbar]:w-[5px] 
                      [&::-webkit-scrollbar-track]:bg-transparent 
                      [&::-webkit-scrollbar-thumb]:bg-black/[0.08] 
                      dark:[&::-webkit-scrollbar-thumb]:bg-white/[0.1] 
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      hover:[&::-webkit-scrollbar-thumb]:bg-black/[0.15]
                      dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/[0.2]"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-6 h-6 border-2 border-[#06B6D4]/30 border-t-[#06B6D4] rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Syncing Directory...
            </p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-40 p-6 text-center"
          >
            <div className="w-12 h-12 mb-3 rounded-full bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-center">
              <FaUserMd className="text-xl text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No personnel found
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-1 px-2"
          >
            {filteredContacts.map((contact) => {
              const isSelected = selectedUser?._id === contact._id;

              return (
                <motion.div
                  key={contact._id}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: isSelected
                      ? ""
                      : "rgba(255, 255, 255, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectUser(contact)}
                  className={`flex items-center p-3 rounded-[16px] cursor-pointer border transition-all duration-200
                        ${
                          isSelected
                            ? "bg-white/90 dark:bg-white/[0.08] border-black/[0.05] dark:border-white/[0.1] shadow-md dark:shadow-none"
                            : "border-transparent hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                        }`}
                >
                  <div className="relative">
                    <div
                      className={`w-11 h-11 rounded-[14px] flex-shrink-0 flex items-center justify-center text-sm font-bold shadow-sm transition-colors
                          ${
                            isSelected
                              ? "bg-gradient-to-br from-[#2563EB] to-[#06B6D4] text-white shadow-blue-500/20"
                              : "bg-black/[0.04] dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 border border-black/[0.05] dark:border-white/[0.05]"
                          }`}
                    >
                      {contact.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    {/* Online/Active Indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0A0F1E] rounded-full"></div>
                  </div>

                  <div className="ml-3.5 flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3
                        className={`text-sm font-semibold truncate tracking-tight
                            ${isSelected ? "text-[#2563EB] dark:text-cyan-400" : "text-slate-800 dark:text-[#F1F5F9]"}`}
                      >
                        {contact.name}
                      </h3>

                      {/* Unread Badge */}
                      <AnimatePresence>
                        {contact.unreadCount > 0 && !isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="bg-red-500 dark:bg-red-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm"
                          >
                            {contact.unreadCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <p
                      className={`text-xs truncate
                        ${isSelected ? "text-[#2563EB]/80 dark:text-cyan-400/80 font-medium" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {contact.lastMessage
                        ? contact.lastMessage
                        : contact.role || "Consultation"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
