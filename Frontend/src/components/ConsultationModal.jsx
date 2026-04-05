import React, { useState, useEffect } from "react";
import {
  FiMic,
  FiMicOff,
  FiX,
  FiCheck,
  FiActivity,
  FiCpu,
  FiLoader,
  FiEdit3,
  FiZap,
  FiPlus,
  FiTrash2,
  FiAlertTriangle,
  FiSearch,
  FiClock,
} from "react-icons/fi";
import { generateSOAPNotes, completeConsultation } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const FREQUENCIES = [
  "OD (Once a day)",
  "BD (Twice a day)",
  "TDS (Thrice a day)",
  "QID (4 times)",
  "SOS (As needed)",
];
const DURATIONS = [
  "3 Days",
  "5 Days",
  "7 Days",
  "15 Days",
  "1 Month",
  "Continue",
];
const COMMON_DIAGNOSES = [
  { code: "J00", name: "Acute Nasopharyngitis (Common Cold)" },
  { code: "I10", name: "Essential (Primary) Hypertension" },
  { code: "E11", name: "Type 2 Diabetes Mellitus" },
  { code: "J20.9", name: "Acute Bronchitis, unspecified" },
  { code: "R50.9", name: "Fever, unspecified" },
  { code: "K21.9", name: "Gastro-esophageal reflux disease" },
];

// 🔥 DOCTOR GUIDE PLACEHOLDERS
const PLACEHOLDERS = {
  subjective:
    "Patient's own words & complaints...\nE.g., 'Patient complains of severe headache, dry cough, and high fever since 3 days. Feeling very weak.'",
  objective:
    "Doctor's observations & factual data...\nE.g., 'Patient looks pale. Vitals show high temp. Throat is red and inflamed.'",
  assessment: "Your medical diagnosis...\nE.g., 'Acute Viral Pharyngitis.'",
  plan: "Treatment and instructions...\nE.g., 'Prescribed Paracetamol 500mg. Drink plenty of warm fluids. Review after 3 days.'",
};

// --- DESIGN TOKENS (Tailwind Classes) ---
const glassSurface =
  "bg-white/70 dark:bg-[#e2e8f0]/[0.03] backdrop-blur-[16px] border border-black/5 dark:border-white/[0.06]";
const textPrimary = "text-slate-900 dark:text-slate-100";
const textSecondary = "text-slate-700 dark:text-slate-300";
const textMuted = "text-slate-500 dark:text-slate-400";
const primaryGradientBg =
  "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 text-white shadow-lg shadow-blue-500/25 dark:shadow-cyan-500/20 transition-all";
const inputBase =
  "w-full px-4 py-3 text-sm bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]";

const ConsultationModal = ({ appointment, onClose, onSuccess }) => {
  if (!appointment) return null;

  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const isMobile = width < 900;
  const [mobileTab, setMobileTab] = useState("clinical");

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSection, setActiveSection] = useState("subjective");

  const [soap, setSoap] = useState({ s: "", o: "", a: "", p: "" });
  const [vitals, setVitals] = useState({
    bp: appointment.vitals?.bp || "",
    temp: appointment.vitals?.temp || "",
    weight: appointment.vitals?.weight || "",
    pulse: appointment.vitals?.pulse || "",
  });

  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({
    name: "",
    dose: "",
    freq: "BD (Twice a day)",
    duration: "5 Days",
    notes: "",
  });
  const [diagnosisSearch, setDiagnosisSearch] = useState("");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(
    appointment.diagnosis || "",
  );
  const [outcome, setOutcome] = useState("Pending");
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const toggleVoice = () => setIsListening(!isListening);
  const handleSoapChange = (field, val) =>
    setSoap((prev) => ({ ...prev, [field]: val }));
  const handleVitalChange = (e) =>
    setVitals({ ...vitals, [e.target.name]: e.target.value });

  const addMedication = () => {
    if (!newMed.name) return;
    setMedications([...medications, { ...newMed, id: Date.now() }]);
    setNewMed({
      name: "",
      dose: "",
      freq: "BD (Twice a day)",
      duration: "5 Days",
      notes: "",
    });
  };
  const removeMedication = (id) =>
    setMedications(medications.filter((m) => m.id !== id));

  // 🔥 UPDATED AI ASSISTANT LOGIC (Auto-fill)
  const runAIAssistant = async () => {
    if (!soap.s && !soap.o) {
      alert("Please enter some symptoms in 'Subjective' or 'Objective' first.");
      return;
    }
    setAiLoading(true);
    if (isMobile) setMobileTab("ai");

    try {
      const context = {
        patientAge: appointment.patientId?.age || "Unknown",
        patientGender: appointment.patientId?.gender || "Unknown",
        vitals: vitals,
      };

      const rawText = `Subjective: ${soap.s}\nObjective: ${soap.o}`;
      const res = await generateSOAPNotes(rawText, context);
      const data = res.data;

      if (data) {
        setAiSuggestions(data);

        const newAssessment = data.assessment || data.a || "";
        const newPlan = data.plan || data.p || "";

        // AUTO-FILL SOAP NOTES
        setSoap((prev) => ({
          ...prev,
          a: newAssessment,
          p: newPlan,
        }));

        // AUTO-FILL DIAGNOSIS BOX IF AI PROVIDES ICD-10 CODE
        if (data.suggestedICD10 && data.suggestedICD10.length > 0) {
          setSelectedDiagnosis(data.suggestedICD10[0]);
          setDiagnosisSearch(data.suggestedICD10[0]);
        } else {
          setSelectedDiagnosis(newAssessment);
          setDiagnosisSearch(newAssessment);
        }
      }
    } catch (error) {
      console.error("AI Error", error);
      alert("Failed to generate AI suggestions. Check console.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleReview = () => setStep(2);

  const finalizeConsultation = async () => {
    setLoading(true);
    try {
      const formattedNotes =
        `[SUBJECTIVE]\n${soap.s}\n\n[OBJECTIVE]\n${soap.o}\n\n[ASSESSMENT]\n${soap.a}\n\n[PLAN]\n${soap.p}`.trim();
      const formattedRx = medications
        .map((m) => `- ${m.name} ${m.dose} | ${m.freq} for ${m.duration}`)
        .join("\n");
      const payload = {
        doctorNotes: formattedNotes,
        diagnosis: selectedDiagnosis,
        prescription: formattedRx,
        vitals: vitals,
        outcome: outcome,
      };

      await completeConsultation(appointment._id, payload);

      localStorage.removeItem(`draft_${appointment._id}`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVitalColor = (type, value) => {
    if (!value) return "";
    const val = parseFloat(value);
    if (type === "temp")
      return val > 99.5
        ? "text-red-500 border-red-500/50"
        : "text-emerald-500 border-emerald-500/50";
    if (type === "bp") {
      const [sys, dia] = value.split("/").map(Number);
      return sys > 140 || dia > 90
        ? "text-red-500 border-red-500/50"
        : "text-emerald-500 border-emerald-500/50";
    }
    return "text-slate-800 dark:text-slate-200 border-cyan-500/30";
  };

  const renderSidebar = () => (
    <div
      className={`${isMobile && mobileTab !== "vitals" ? "hidden" : "block"} w-full md:w-[300px] border-r border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-[#0A0F1E]/40 overflow-y-auto p-5 md:p-6 custom-scrollbar shrink-0`}
    >
      <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <FiActivity size={16} /> VITALS
      </div>
      <div className="space-y-4">
        {Object.keys(vitals).map((k) => (
          <div
            key={k}
            className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-slate-700/50"
          >
            <label
              className={`text-sm font-semibold capitalize ${textSecondary}`}
            >
              {k === "bp"
                ? "BP"
                : k === "temp"
                  ? "Temp"
                  : k === "pulse"
                    ? "Pulse"
                    : "Weight"}
              <span className="text-xs font-normal ml-1 opacity-70">
                {k === "bp"
                  ? "(mmHg)"
                  : k === "temp"
                    ? "(°F)"
                    : k === "pulse"
                      ? "(bpm)"
                      : "(kg)"}
              </span>
            </label>
            <input
              name={k}
              inputMode={k === "bp" ? "text" : "decimal"}
              value={vitals[k]}
              onChange={handleVitalChange}
              placeholder="-"
              className={`w-24 px-3 py-2 text-right text-base font-bold bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-sm border rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all placeholder-slate-400 dark:placeholder-slate-600 ${getVitalColor(k, vitals[k]) || "text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"}`}
            />
          </div>
        ))}
      </div>

      <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-4 mt-10 flex items-center gap-2">
        <FiClock size={16} /> HISTORY
      </div>
      <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
        <span className="text-sm text-slate-500 dark:text-slate-400 italic">
          No prior records found.
        </span>
      </div>
    </div>
  );

  const renderMainContent = () => (
    <div
      className={`${isMobile && mobileTab !== "clinical" ? "hidden" : "block"} flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 custom-scrollbar`}
    >
      {/* SOAP Section */}
      <div className={`${glassSurface} p-5 md:p-6 mb-6 shadow-sm rounded-2xl`}>
        <div className="flex justify-between items-center mb-5">
          <h3
            className={`text-lg font-bold flex items-center gap-2 m-0 ${textPrimary}`}
          >
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-cyan-400 rounded-lg">
              <FiEdit3 size={18} />
            </div>
            Clinical Notes
          </h3>
          <button
            onClick={toggleVoice}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors border ${isListening ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
          >
            {isListening ? <FiMicOff /> : <FiMic />}{" "}
            {isListening ? "Stop Dictation" : "Dictate"}
          </button>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-5 border-b border-slate-200/60 dark:border-slate-700/60 pb-px no-scrollbar">
          {["subjective", "objective", "assessment", "plan"].map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              className={`relative px-4 py-2.5 text-sm font-bold capitalize transition-colors whitespace-nowrap ${activeSection === section ? "text-blue-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              {section}
              {activeSection === section && (
                <motion.div
                  layoutId="activeSoapTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-cyan-400 rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        <textarea
          value={soap[activeSection.charAt(0)]}
          onChange={(e) =>
            handleSoapChange(activeSection.charAt(0), e.target.value)
          }
          placeholder={PLACEHOLDERS[activeSection]}
          className="w-full min-h-[200px] p-4 text-sm md:text-base leading-relaxed bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all resize-y shadow-inner"
          autoFocus
        />
      </div>

      {/* Diagnosis & Rx Section */}
      <div className={`${glassSurface} p-5 md:p-6 shadow-sm rounded-2xl`}>
        <h3 className={`text-lg font-bold mb-5 ${textPrimary}`}>
          Diagnosis & Treatment
        </h3>

        {/* Search Diagnosis */}
        <div className="relative mb-6">
          <div className="flex items-center bg-white/60 dark:bg-[#0A0F1E]/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/50 rounded-xl px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500 transition-all">
            <FiSearch
              className="text-slate-400 dark:text-slate-500 shrink-0"
              size={20}
            />
            <input
              value={diagnosisSearch || selectedDiagnosis}
              onChange={(e) => {
                setDiagnosisSearch(e.target.value);
                setSelectedDiagnosis(e.target.value);
              }}
              placeholder="Search or enter Diagnosis (ICD-10)..."
              className="w-full bg-transparent border-none px-3 py-3.5 text-sm md:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
            />
            {selectedDiagnosis && (
              <FiCheck className="text-emerald-500 shrink-0" size={20} />
            )}
          </div>

          <AnimatePresence>
            {diagnosisSearch &&
              !COMMON_DIAGNOSES.some((d) => d.name === selectedDiagnosis) && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-[105%] left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl z-20 overflow-hidden max-h-64 overflow-y-auto custom-scrollbar"
                >
                  {COMMON_DIAGNOSES.filter((d) =>
                    d.name
                      .toLowerCase()
                      .includes(diagnosisSearch.toLowerCase()),
                  ).map((d) => (
                    <div
                      key={d.code}
                      onClick={() => {
                        setSelectedDiagnosis(`${d.code} - ${d.name}`);
                        setDiagnosisSearch("");
                      }}
                      className="px-4 py-3 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                    >
                      <span className="font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-900/20 px-2 py-0.5 rounded shrink-0">
                        {d.code}
                      </span>
                      <span className={textSecondary}>{d.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        {/* Add Medicine */}
        <div className="bg-slate-50/60 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 items-center">
            <input
              placeholder="Drug Name"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className={inputBase}
            />
            <input
              placeholder="Dose (500mg)"
              value={newMed.dose}
              onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
              className={inputBase}
            />
            <select
              value={newMed.freq}
              onChange={(e) => setNewMed({ ...newMed, freq: e.target.value })}
              className={inputBase}
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <select
              value={newMed.duration}
              onChange={(e) =>
                setNewMed({ ...newMed, duration: e.target.value })
              }
              className={inputBase}
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button
              onClick={addMedication}
              className="flex items-center justify-center gap-2 p-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white rounded-xl shadow-md transition-colors focus:outline-none"
            >
              <FiPlus size={20} />{" "}
              <span className="md:hidden font-bold text-sm">
                Add Medication
              </span>
            </button>
          </div>
        </div>

        {/* Medicine List */}
        <div className="space-y-3">
          {medications.length === 0 && (
            <div className="text-center text-sm italic text-slate-400 dark:text-slate-500 py-4">
              No medications added yet.
            </div>
          )}
          <AnimatePresence>
            {medications.map((med) => (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                key={med.id}
                className="flex items-center justify-between p-4 bg-white/70 dark:bg-[#0A0F1E]/70 border border-slate-200/60 dark:border-slate-700/50 rounded-xl shadow-sm"
              >
                <div>
                  <div className={`font-bold text-base ${textPrimary}`}>
                    {med.name}{" "}
                    <span className="font-normal opacity-70 ml-1">
                      {med.dose}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold">
                    <span className="bg-blue-50 dark:bg-cyan-900/20 text-blue-700 dark:text-cyan-400 px-2.5 py-0.5 rounded-md border border-blue-100/50 dark:border-cyan-800/30">
                      {med.freq}
                    </span>
                    <span className={textMuted}>{med.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeMedication(med.id)}
                  className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors focus:outline-none shrink-0"
                >
                  <FiTrash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderAiPanel = () => (
    <div
      className={`${isMobile && mobileTab !== "ai" ? "hidden" : "block"} w-full md:w-[340px] border-l border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-[#0A0F1E]/40 overflow-y-auto p-5 md:p-6 custom-scrollbar shrink-0`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <FiZap className="fill-amber-500" /> AI ASSISTANT
        </div>
        <button
          onClick={runAIAssistant}
          disabled={aiLoading}
          className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 disabled:opacity-50 transition-colors focus:outline-none"
        >
          {aiLoading ? "Thinking..." : "Refresh Insights"}
        </button>
      </div>

      {aiSuggestions ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-5 bg-emerald-50/80 dark:bg-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full mb-3 tracking-wide">
              DIAGNOSIS
            </div>
            <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 leading-relaxed">
              {aiSuggestions.assessment || "No confident diagnosis derived."}
            </div>
          </div>

          {aiSuggestions.redFlags?.length > 0 && (
            <div className="p-5 bg-red-50/80 dark:bg-red-900/10 border border-red-200/60 dark:border-red-800/30 rounded-xl">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2.5 py-1 rounded-full mb-3 tracking-wide">
                <FiAlertTriangle size={12} /> RED FLAGS
              </div>
              <ul className="m-0 pl-4 space-y-1.5 text-sm font-medium text-red-800 dark:text-red-300 marker:text-red-400">
                {aiSuggestions.redFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 rounded-xl">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 dark:text-cyan-400 bg-blue-100 dark:bg-cyan-900/30 px-2.5 py-1 rounded-full mb-3 tracking-wide">
              PLAN SUGGESTION
            </div>
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100 whitespace-pre-wrap leading-relaxed">
              {aiSuggestions.plan || "No specific plan suggested."}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center opacity-60">
          <FiCpu size={48} className="text-slate-400 mb-4" />
          <p className={`text-sm font-medium ${textSecondary}`}>
            Input clinical notes and vitals,
          </p>
          <p className={`text-sm font-medium ${textSecondary}`}>
            then click Refresh Insights.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/70 dark:bg-[#0A0F1E]/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Main Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className={`relative w-full h-[100dvh] md:h-[90vh] md:max-w-[1400px] bg-[#f8fafc] dark:bg-[#0A0F1E] md:rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-black/5 dark:border-white/[0.06]`}
        >
          {/* --- HEADER --- */}
          <header className="shrink-0 h-[72px] px-4 md:px-8 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10 shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 dark:bg-cyan-900/20 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg border border-blue-100 dark:border-cyan-800/30 shrink-0">
                {(appointment.patientId?.name || "U").charAt(0)}
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                <h3
                  className={`m-0 text-base md:text-lg font-extrabold truncate ${textPrimary}`}
                >
                  {appointment.patientId?.name || "Unknown Patient"}
                </h3>
                <span className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                  {appointment.patientId?.gender?.charAt(0)},{" "}
                  {appointment.patientId?.age || "?"}y{" "}
                  <span className="mx-1.5 opacity-50">•</span>{" "}
                  {appointment.type}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none ml-4"
            >
              <FiX size={20} />
            </button>
          </header>

          {/* --- MOBILE TABS --- */}
          {step === 1 && (
            <div className="md:hidden flex shrink-0 bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800 shadow-sm">
              {[
                {
                  id: "vitals",
                  icon: <FiActivity size={16} />,
                  label: "Vitals",
                },
                {
                  id: "clinical",
                  icon: <FiEdit3 size={16} />,
                  label: "Clinical",
                },
                { id: "ai", icon: <FiZap size={16} />, label: "AI Assist" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id)}
                  className={`flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-bold border-b-2 transition-colors ${mobileTab === tab.id ? "border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400" : "border-transparent text-slate-500 dark:text-slate-400"}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* --- BODY CONTENT --- */}
          {step === 1 ? (
            <div className="flex flex-1 overflow-hidden flex-col md:flex-row bg-[#F7FAFC] dark:bg-[#0A0F1E]">
              {renderSidebar()}
              {renderMainContent()}
              {renderAiPanel()}
            </div>
          ) : (
            // --- REVIEW SCREEN ---
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F7FAFC] dark:bg-[#0A0F1E] custom-scrollbar">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${glassSurface} max-w-4xl mx-auto p-6 md:p-10 rounded-2xl shadow-lg`}
              >
                <h2
                  className={`text-center text-2xl font-extrabold mb-10 ${textPrimary}`}
                >
                  Prescription Review
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200/60 dark:border-slate-700/50 pb-8 mb-8">
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                      DIAGNOSIS
                    </div>
                    <div className={`text-xl font-bold ${textPrimary}`}>
                      {selectedDiagnosis || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                      VITALS
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(vitals).map(
                        ([k, v]) =>
                          v && (
                            <span
                              key={k}
                              className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                            >
                              <span className="uppercase opacity-70 mr-1">
                                {k}:
                              </span>{" "}
                              {v}
                            </span>
                          ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                    MEDICATIONS
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-bold border-b border-slate-200/60 dark:border-slate-700/50">
                        <tr>
                          <th className="p-4 rounded-tl-xl">Drug</th>
                          <th className="p-4">Dosage & Frequency</th>
                          <th className="p-4 rounded-tr-xl">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {medications.map((m) => (
                          <tr
                            key={m.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                          >
                            <td
                              className={`p-4 font-bold text-base ${textPrimary}`}
                            >
                              {m.name}
                            </td>
                            <td className={`p-4 font-medium ${textSecondary}`}>
                              {m.dose}{" "}
                              <span className="mx-2 opacity-50">•</span>{" "}
                              <span className="bg-blue-50 dark:bg-cyan-900/20 text-blue-700 dark:text-cyan-400 px-2 py-0.5 rounded text-xs border border-blue-100/50 dark:border-cyan-800/30">
                                {m.freq}
                              </span>
                            </td>
                            <td className={`p-4 font-medium ${textSecondary}`}>
                              {m.duration}
                            </td>
                          </tr>
                        ))}
                        {medications.length === 0 && (
                          <tr>
                            <td
                              colSpan="3"
                              className="p-6 text-center text-slate-400 italic"
                            >
                              No medications prescribed.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                    INSTRUCTIONS
                  </div>
                  <p
                    className={`text-base leading-relaxed whitespace-pre-wrap bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 font-medium ${textSecondary}`}
                  >
                    {soap.p || "No specific instructions provided."}
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* --- FOOTER --- */}
          <footer className="shrink-0 px-4 md:px-8 py-4 md:py-5 bg-white dark:bg-[#1E293B] border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
            {step === 1 ? (
              <>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap uppercase tracking-wider">
                    Outcome:
                  </span>
                  <div className="relative w-full md:w-48">
                    <select
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Treated">Discharged</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none">
                    Save Draft
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReview}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm ${primaryGradientBg}`}
                  >
                    Review & Sign <FiCheck size={18} />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col md:flex-row justify-between gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none"
                >
                  Back to Edit
                </button>
                <motion.button
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  onClick={finalizeConsultation}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 border border-white/10 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={18} />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheck size={18} /> Confirm & Submit Prescription
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </footer>
        </motion.div>
      </div>

      {/* Inject Global Scrollbar Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.3); border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.2); }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(148, 163, 184, 0.5); }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `,
        }}
      />
    </AnimatePresence>
  );
};

export default ConsultationModal;
