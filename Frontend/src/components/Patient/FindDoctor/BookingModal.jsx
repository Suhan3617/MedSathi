import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiMessageCircle,
} from "react-icons/fi";

const BookingModal = ({
  selectedDoctor,
  setSelectedDoctor,
  bookingData,
  setBookingData,
  handleDateChange,
  availableSlots,
  handleBookingSubmit,
  bookingStatus,
}) => {
  return (
    <AnimatePresence>
      {selectedDoctor && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoctor(null)}
            className="absolute inset-0 bg-[#0A0F1E]/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Modal Header */}
            <div className="p-8 pb-0 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F172A] dark:text-white mb-1">
                  Confirm Session
                </h2>
                <p className="text-[#64748B] dark:text-[#CBD5E1]">
                  Appointment with{" "}
                  <span className="text-[#2563EB] font-semibold">
                    Dr. {selectedDoctor.name}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <FiX size={24} className="text-[#94A3B8]" />
              </button>
            </div>

            <div className="p-8">
              {bookingStatus.message && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`mb-6 p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 ${
                    bookingStatus.error
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}
                >
                  {bookingStatus.error ? <FiX /> : <FiCheckCircle />}
                  {bookingStatus.message}
                </motion.div>
              )}

              <form
                id="booking-form"
                onSubmit={handleBookingSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    <FiCalendar /> Consultation Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    required
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-[#06B6D4] focus:ring-4 focus:ring-[#06B6D4]/10 outline-none text-[#0F172A] dark:text-white transition-all font-medium"
                  />
                </div>

                {bookingData.date && (
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                      <FiClock /> Available Slots
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() =>
                              setBookingData((prev) => ({
                                ...prev,
                                timeSlot: slot,
                              }))
                            }
                            className={`p-3 text-sm font-bold rounded-xl transition-all border ${
                              bookingData.timeSlot === slot
                                ? "bg-[#2563EB] border-transparent text-white shadow-lg shadow-blue-500/30"
                                : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#06B6D4]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-3 py-8 bg-slate-50 dark:bg-white/5 rounded-2xl text-center text-[#94A3B8] text-sm italic border border-dashed border-slate-200 dark:border-white/10">
                          No availability for selected date.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-[#94A3B8] flex items-center gap-2">
                    <FiMessageCircle /> Medical Note
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Describe your symptoms for the doctor..."
                    required
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-[#06B6D4] outline-none text-[#0F172A] dark:text-white transition-all"
                  />
                </div>
              </form>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-black/20 flex gap-4">
              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 py-4 font-bold text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-200 dark:hover:bg-white/5 rounded-2xl transition-all"
              >
                Dismiss
              </button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                form="booking-form"
                disabled={bookingStatus.loading || !bookingData.timeSlot}
                className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-extrabold shadow-xl shadow-blue-500/30 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
              >
                {bookingStatus.loading
                  ? "Encrypting..."
                  : "Confirm Appointment"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
