import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiX } from "react-icons/fi";
import { submitAppointmentRating } from "../../services/api";
import { modalVariants , overlayVariants } from "./animationVariants";

const RatingModal = ({ appointment, onClose, onRefresh }) => {
  const [rating, setRating] = useState(appointment.rating || 0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState(appointment.review || "");
  const [submitting, setSubmitting] = useState(false);
  const isAlreadyRated = !!appointment.rating;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAlreadyRated) return onClose();
    if (rating === 0) return alert("Please select a star rating.");

    setSubmitting(true);
    try {
      await submitAppointmentRating(appointment._id, { rating, review });
      onRefresh();
      onClose();
    } catch (error) {
      alert("Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-sm bg-white/95 dark:bg-[#0A0F1E]/95 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.08] rounded-[24px] shadow-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-black/[0.05] dark:border-white/[0.06] flex justify-between items-center bg-amber-50/50 dark:bg-amber-900/10">
            <h3 className="m-0 text-base font-bold text-amber-700 dark:text-amber-500 flex items-center gap-2">
              <FiStar className="fill-amber-500 text-amber-500" />{" "}
              {isAlreadyRated ? "Your Rating" : "Rate Experience"}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-amber-700/50 dark:text-amber-500/50 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
            >
              <FiX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="text-center mb-6">
              <p className="m-0 mb-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                How was your consultation with Dr. {appointment.doctorId?.name}?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    whileHover={!isAlreadyRated ? { scale: 1.1 } : {}}
                    whileTap={!isAlreadyRated ? { scale: 0.9 } : {}}
                    type="button"
                    key={star}
                    disabled={isAlreadyRated}
                    className={`text-3xl p-1 transition-colors ${
                      isAlreadyRated ? "cursor-default" : "cursor-pointer"
                    } ${
                      (hover || rating) >= star
                        ? "text-amber-500"
                        : "text-slate-200 dark:text-slate-700"
                    }`}
                    onMouseEnter={() => !isAlreadyRated && setHover(star)}
                    onMouseLeave={() => !isAlreadyRated && setHover(0)}
                    onClick={() => !isAlreadyRated && setRating(star)}
                  >
                    <FiStar
                      className={
                        (hover || rating) >= star ? "fill-amber-500" : ""
                      }
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                Write a Review (Optional)
              </label>
              <textarea
                rows="3"
                disabled={isAlreadyRated}
                placeholder={
                  isAlreadyRated
                    ? "No review provided."
                    : "Share your experience..."
                }
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className={`w-full p-3 rounded-[12px] border outline-none text-sm resize-none transition-colors
                                    ${
                                      isAlreadyRated
                                        ? "bg-black/[0.02] dark:bg-white/[0.02] border-transparent text-slate-500 dark:text-slate-400"
                                        : "bg-white/50 dark:bg-black/20 border-black/[0.08] dark:border-white/[0.1] focus:border-amber-400 dark:focus:border-amber-500 text-slate-800 dark:text-slate-200 shadow-sm"
                                    }`}
              />
            </div>

            <motion.button
              whileHover={
                !submitting && (rating > 0 || isAlreadyRated)
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !submitting && (rating > 0 || isAlreadyRated)
                  ? { scale: 0.98 }
                  : {}
              }
              type="submit"
              disabled={submitting || (rating === 0 && !isAlreadyRated)}
              className={`w-full py-3 rounded-[14px] font-bold text-sm transition-all shadow-sm
                                ${
                                  isAlreadyRated
                                    ? "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10"
                                    : rating === 0
                                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/25 border border-white/10"
                                }`}
            >
              {submitting
                ? "Submitting..."
                : isAlreadyRated
                ? "Close"
                : "Submit Feedback"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RatingModal;