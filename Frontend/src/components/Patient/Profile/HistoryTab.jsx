import React from "react";
import {
  FiActivity,
  FiPlus,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiUsers,
  FiScissors,
  FiShield,
} from "react-icons/fi";
import {
  inputClass,
  cardClass,
  sectionHeaderClass,
  sectionTitleClass,
} from "./sharedStyles";

const HistoryTab = ({ formData, handleArrayChange, addItem, removeItem }) => {
  return (
    <>
      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-cyan-900/30 rounded-lg text-[#2563EB] dark:text-[#06B6D4]">
              <FiActivity size={18} />
            </div>
            <h3 className={sectionTitleClass}>Current Conditions</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              addItem("medicalHistory", {
                condition: "",
                diagnosedDate: "",
                status: "Active",
              })
            }
            className="px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] rounded-lg text-xs font-bold text-[#2563EB] dark:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>
        {formData.medicalHistory.length === 0 && (
          <div className="empty-list text-sm text-slate-400 italic text-center py-6 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.08]">
            No current medical conditions recorded.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {formData.medicalHistory.map((item, index) => (
            <div
              key={index}
              className="list-item-wrapper relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] p-3 rounded-[16px] flex flex-col md:flex-row gap-3"
            >
              <div className="list-inputs-grid-3 flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3 w-full">
                <input
                  placeholder="Condition / Disease"
                  value={item.condition}
                  onChange={(e) =>
                    handleArrayChange(
                      "medicalHistory",
                      index,
                      "condition",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <input
                  type="date"
                  value={
                    item.diagnosedDate ? item.diagnosedDate.split("T")[0] : ""
                  }
                  onChange={(e) =>
                    handleArrayChange(
                      "medicalHistory",
                      index,
                      "diagnosedDate",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <select
                  value={item.status}
                  onChange={(e) =>
                    handleArrayChange(
                      "medicalHistory",
                      index,
                      "status",
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Managed">Managed</option>
                  <option value="Cured">Cured</option>
                </select>
              </div>
              <div className="list-action absolute -top-2 -right-2 md:relative md:top-0 md:right-0 md:flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeItem("medicalHistory", index)}
                  className="p-2 bg-white dark:bg-[#1E293B] shadow-sm md:shadow-none md:bg-transparent border border-black/[0.05] md:border-transparent rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-500">
              <FiAlertCircle size={18} />
            </div>
            <h3 className={sectionTitleClass}>Allergies</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              addItem("allergies", {
                allergen: "",
                reaction: "",
                severity: "Mild",
              })
            }
            className="px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] rounded-lg text-xs font-bold text-[#2563EB] dark:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>
        {formData.allergies.length === 0 && (
          <div className="empty-list text-sm text-slate-400 italic text-center py-6 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.08]">
            No known allergies.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {formData.allergies.map((item, index) => (
            <div
              key={index}
              className="list-item-wrapper relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] p-3 rounded-[16px] flex flex-col md:flex-row gap-3"
            >
              <div className="list-inputs-grid-allergy flex-1 grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr] gap-3 w-full">
                <input
                  placeholder="Allergen (e.g. Peanuts)"
                  value={item.allergen}
                  onChange={(e) =>
                    handleArrayChange(
                      "allergies",
                      index,
                      "allergen",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Reaction (e.g. Rashes)"
                  value={item.reaction}
                  onChange={(e) =>
                    handleArrayChange(
                      "allergies",
                      index,
                      "reaction",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <select
                  value={item.severity}
                  onChange={(e) =>
                    handleArrayChange(
                      "allergies",
                      index,
                      "severity",
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div className="list-action absolute -top-2 -right-2 md:relative md:top-0 md:right-0 md:flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeItem("allergies", index)}
                  className="p-2 bg-white dark:bg-[#1E293B] shadow-sm md:shadow-none md:bg-transparent border border-black/[0.05] md:border-transparent rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-emerald-900/30 rounded-lg text-green-500">
              <FiCheckCircle size={18} />
            </div>
            <h3 className={sectionTitleClass}>Current Medications</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              addItem("currentMedications", {
                name: "",
                dosage: "",
                frequency: "",
              })
            }
            className="px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] rounded-lg text-xs font-bold text-[#2563EB] dark:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>
        {formData.currentMedications.length === 0 && (
          <div className="empty-list text-sm text-slate-400 italic text-center py-6 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.08]">
            Not taking any regular medications.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {formData.currentMedications.map((item, index) => (
            <div
              key={index}
              className="list-item-wrapper relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] p-3 rounded-[16px] flex flex-col md:flex-row gap-3"
            >
              <div className="list-inputs-grid-3 flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3 w-full">
                <input
                  placeholder="Medication Name"
                  value={item.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "currentMedications",
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Dosage (e.g. 500mg)"
                  value={item.dosage}
                  onChange={(e) =>
                    handleArrayChange(
                      "currentMedications",
                      index,
                      "dosage",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Frequency"
                  value={item.frequency}
                  onChange={(e) =>
                    handleArrayChange(
                      "currentMedications",
                      index,
                      "frequency",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div className="list-action absolute -top-2 -right-2 md:relative md:top-0 md:right-0 md:flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeItem("currentMedications", index)}
                  className="p-2 bg-white dark:bg-[#1E293B] shadow-sm md:shadow-none md:bg-transparent border border-black/[0.05] md:border-transparent rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-500">
              <FiUsers size={18} />
            </div>
            <h3 className={sectionTitleClass}>Family Medical History</h3>
          </div>
          <button
            type="button"
            onClick={() =>
              addItem("familyHistory", {
                relation: "",
                condition: "",
              })
            }
            className="px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] rounded-lg text-xs font-bold text-[#2563EB] dark:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>
        {formData.familyHistory.length === 0 && (
          <div className="empty-list text-sm text-slate-400 italic text-center py-6 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.08]">
            No significant family medical history.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {formData.familyHistory.map((item, index) => (
            <div
              key={index}
              className="list-item-wrapper relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] p-3 rounded-[16px] flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3 w-full">
                <input
                  placeholder="Relation (e.g. Father)"
                  value={item.relation}
                  onChange={(e) =>
                    handleArrayChange(
                      "familyHistory",
                      index,
                      "relation",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <input
                  placeholder="Condition (e.g. Diabetes)"
                  value={item.condition}
                  onChange={(e) =>
                    handleArrayChange(
                      "familyHistory",
                      index,
                      "condition",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div className="list-action absolute -top-2 -right-2 md:relative md:top-0 md:right-0 md:flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeItem("familyHistory", index)}
                  className="p-2 bg-white dark:bg-[#1E293B] shadow-sm md:shadow-none md:bg-transparent border border-black/[0.05] md:border-transparent rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-500">
              <FiScissors size={18} />
            </div>
            <h3 className={sectionTitleClass}>Past Surgeries / Procedures</h3>
          </div>
          <button
            type="button"
            onClick={() => addItem("pastSurgeries", { name: "", year: "" })}
            className="px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] rounded-lg text-xs font-bold text-[#2563EB] dark:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>
        {formData.pastSurgeries.length === 0 && (
          <div className="empty-list text-sm text-slate-400 italic text-center py-6 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.08]">
            No past surgeries.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {formData.pastSurgeries.map((item, index) => (
            <div
              key={index}
              className="list-item-wrapper relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] p-3 rounded-[16px] flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 w-full">
                <input
                  placeholder="Surgery / Procedure Name"
                  value={item.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "pastSurgeries",
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Year (e.g. 2018)"
                  value={item.year}
                  onChange={(e) =>
                    handleArrayChange(
                      "pastSurgeries",
                      index,
                      "year",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div className="list-action absolute -top-2 -right-2 md:relative md:top-0 md:right-0 md:flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeItem("pastSurgeries", index)}
                  className="p-2 bg-white dark:bg-[#1E293B] shadow-sm md:shadow-none md:bg-transparent border border-black/[0.05] md:border-transparent rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <div className={sectionHeaderClass}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg text-teal-500">
              <FiShield size={18} />
            </div>
            <h3 className={sectionTitleClass}>Vaccinations</h3>
          </div>
          <button
            type="button"
            onClick={() => addItem("vaccinations", { name: "", date: "" })}
            className="px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] rounded-lg text-xs font-bold text-[#2563EB] dark:text-cyan-400 flex items-center gap-1.5 transition-colors"
          >
            <FiPlus /> Add
          </button>
        </div>
        {formData.vaccinations.length === 0 && (
          <div className="empty-list text-sm text-slate-400 italic text-center py-6 bg-black/[0.02] dark:bg-white/[0.02] rounded-xl border border-dashed border-black/[0.08] dark:border-white/[0.08]">
            No vaccination records.
          </div>
        )}
        <div className="flex flex-col gap-3">
          {formData.vaccinations.map((item, index) => (
            <div
              key={index}
              className="list-item-wrapper relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05] p-3 rounded-[16px] flex flex-col md:flex-row gap-3"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 w-full">
                <input
                  placeholder="Vaccine Name (e.g. COVID-19)"
                  value={item.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "vaccinations",
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
                <input
                  type="date"
                  value={item.date ? item.date.split("T")[0] : ""}
                  onChange={(e) =>
                    handleArrayChange(
                      "vaccinations",
                      index,
                      "date",
                      e.target.value
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div className="list-action absolute -top-2 -right-2 md:relative md:top-0 md:right-0 md:flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeItem("vaccinations", index)}
                  className="p-2 bg-white dark:bg-[#1E293B] shadow-sm md:shadow-none md:bg-transparent border border-black/[0.05] md:border-transparent rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HistoryTab;