import React from "react";
import { motion } from "framer-motion";
import { FiPhone, FiLock, FiAlertTriangle, FiLoader } from "react-icons/fi";
import {
  inputClass,
  cardClass,
  sectionHeaderClass,
  sectionTitleClass,
  labelClass,
} from "./sharedStyles";

const SettingsTab = ({
  formData,
  handleChange,
  passwordData,
  handlePasswordChange,
  submitPasswordChange,
  saving,
  confirmDeactivate,
  confirmDelete,
}) => {
  return (
    <>
      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-white/10 rounded-lg text-slate-600 dark:text-slate-300">
              <FiPhone size={18} />
            </div>
            <h3 className={sectionTitleClass}>Contact Details</h3>
          </div>
        </div>
        <div className="vitals-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Registered Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${inputClass} opacity-70 cursor-not-allowed`}
              disabled
              title="Email cannot be changed currently"
            />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-white/10 rounded-lg text-slate-600 dark:text-slate-300">
              <FiLock size={18} />
            </div>
            <h3 className={sectionTitleClass}>Change Password</h3>
          </div>
        </div>
        <div className="vitals-grid flex flex-col gap-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className={inputClass}
              placeholder="Enter current password"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={inputClass}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={inputClass}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={submitPasswordChange}
          className="mt-5 px-6 py-2.5 bg-slate-800 dark:bg-white/10 hover:bg-slate-900 dark:hover:bg-white/20 text-white rounded-[12px] font-bold text-sm transition-colors flex items-center justify-center gap-2"
          disabled={saving}
        >
          {saving ? (
            <FiLoader className="spinner animate-spin" />
          ) : (
            "Update Password"
          )}
        </motion.button>
      </div>

      <div
        className={`${cardClass} !bg-red-50/50 dark:!bg-rose-900/10 !border-red-200 dark:!border-rose-900/30`}
      >
        <div
          className={`${sectionHeaderClass} !border-red-200 dark:!border-rose-900/30`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-rose-900/50 rounded-lg text-red-600 dark:text-rose-400">
              <FiAlertTriangle size={18} />
            </div>
            <h3 className={`${sectionTitleClass} !text-red-700 dark:!text-rose-400`}>
              Danger Zone
            </h3>
          </div>
        </div>
        <p className="text-sm text-red-800 dark:text-rose-300 mb-6 leading-relaxed">
          Proceed with caution. Deactivating your account will disable
          your login temporarily. Deleting your account will
          permanently erase all your medical records, appointments,
          and data.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={confirmDeactivate}
            className="px-5 py-2.5 rounded-[12px] border border-red-300 dark:border-rose-800 text-red-600 dark:text-rose-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-rose-900/40 transition-colors"
          >
            Deactivate Account
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={confirmDelete}
            className="px-5 py-2.5 rounded-[12px] bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-500/20 transition-all"
          >
            Permanently Delete Account
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default SettingsTab;