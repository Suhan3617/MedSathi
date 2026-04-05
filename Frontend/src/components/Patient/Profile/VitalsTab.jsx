import React from "react";
import { FiUser, FiActivity, FiAlertCircle } from "react-icons/fi";
import {
  inputClass,
  cardClass,
  sectionHeaderClass,
  sectionTitleClass,
  labelClass,
} from "./sharedStyles";

const VitalsTab = ({ formData, handleChange, handleNestedChange }) => {
  return (
    <>
      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-cyan-900/30 rounded-lg text-[#2563EB] dark:text-[#06B6D4]">
              <FiUser size={18} />
            </div>
            <h3 className={sectionTitleClass}>Essential Vitals</h3>
          </div>
        </div>
        <div className="vitals-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Blood Type</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">--</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="175"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="70"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-cyan-900/30 rounded-lg text-[#2563EB] dark:text-[#06B6D4]">
              <FiActivity size={18} />
            </div>
            <h3 className={sectionTitleClass}>Lifestyle Factors</h3>
          </div>
        </div>
        <div className="vitals-grid grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Smoking</label>
            <select
              value={formData.lifestyle.smoking}
              onChange={(e) =>
                handleNestedChange("lifestyle", "smoking", e.target.value)
              }
              className={inputClass}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Occasionally">Occasionally</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Alcohol</label>
            <select
              value={formData.lifestyle.alcohol}
              onChange={(e) =>
                handleNestedChange("lifestyle", "alcohol", e.target.value)
              }
              className={inputClass}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Occasionally">Occasionally</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Physical Activity</label>
            <select
              value={formData.lifestyle.activityLevel}
              onChange={(e) =>
                handleNestedChange("lifestyle", "activityLevel", e.target.value)
              }
              className={inputClass}
            >
              <option value="Sedentary">Sedentary</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className={`${cardClass} !bg-red-50/50 dark:!bg-rose-900/10 !border-red-100 dark:!border-rose-900/30`}
      >
        <div
          className={`${sectionHeaderClass} !border-red-200 dark:!border-rose-900/30`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-rose-900/50 rounded-lg text-red-600 dark:text-rose-400">
              <FiAlertCircle size={18} />
            </div>
            <h3 className={`${sectionTitleClass} !text-red-700 dark:!text-rose-400`}>
              Emergency Contact
            </h3>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <input
            placeholder="Contact Person Name"
            value={formData.emergencyContact.name}
            onChange={(e) =>
              handleNestedChange("emergencyContact", "name", e.target.value)
            }
            className={`${inputClass} !bg-white/80 dark:!bg-black/20 !border-red-200 dark:!border-rose-900/50 focus:!ring-red-400/40`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Phone Number"
              value={formData.emergencyContact.phone}
              onChange={(e) =>
                handleNestedChange("emergencyContact", "phone", e.target.value)
              }
              className={`${inputClass} !bg-white/80 dark:!bg-black/20 !border-red-200 dark:!border-rose-900/50 focus:!ring-red-400/40`}
            />
            <input
              placeholder="Relationship (e.g. Spouse)"
              value={formData.emergencyContact.relation}
              onChange={(e) =>
                handleNestedChange("emergencyContact", "relation", e.target.value)
              }
              className={`${inputClass} !bg-white/80 dark:!bg-black/20 !border-red-200 dark:!border-rose-900/50 focus:!ring-red-400/40`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VitalsTab;