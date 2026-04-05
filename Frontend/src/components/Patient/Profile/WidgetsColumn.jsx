import React from "react";
import { FiInfo } from "react-icons/fi";
import {
  cardClass,
  sectionTitleClass,
} from "./sharedStyles";

const WidgetsColumn = ({ bmiData, profileStrength, formData }) => {
  return (
    <div className="widgets-column w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6 lg:sticky lg:top-6">
      <div className={cardClass}>
        <h3 className={`${sectionTitleClass} mb-4`}>Body Mass Index</h3>
        {bmiData ? (
          <div
            className="bmiWidget text-center p-6 rounded-[20px] border"
            style={{
              backgroundColor: bmiData.color + "10",
              borderColor: bmiData.color + "30",
            }}
          >
            <div
              className="bmiValue text-4xl font-black mb-2"
              style={{ color: bmiData.color }}
            >
              {bmiData.value}
            </div>
            <div
              className="bmiStatus text-[11px] font-bold uppercase tracking-widest"
              style={{ color: bmiData.color }}
            >
              {bmiData.status}
            </div>
            <div className="text-xs text-slate-500 mt-3 font-medium opacity-80">
              Based on {formData.height}cm / {formData.weight}kg
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 dark:text-slate-500 p-6 text-sm bg-black/[0.02] dark:bg-white/[0.02] rounded-[20px] border border-dashed border-black/[0.08] dark:border-white/[0.08]">
            <FiInfo className="mx-auto mb-2 text-xl opacity-70" />
            Enter Height & Weight in Vitals to calculate BMI.
          </div>
        )}

        <div className="mt-8">
          <div className="flex justify-between items-end mb-3">
            <h3 className={`${sectionTitleClass} !text-sm`}>
              Profile Completion
            </h3>
            <span
              className="font-black text-sm"
              style={{
                color: profileStrength === 100 ? "#10b981" : "#06B6D4",
              }}
            >
              {profileStrength}%
            </span>
          </div>
          <div className="progressBg h-2.5 bg-black/[0.05] dark:bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="progressFill h-full transition-all duration-1000 ease-out"
              style={{
                width: `${profileStrength}%`,
                backgroundColor:
                  profileStrength === 100 ? "#10b981" : "#06B6D4",
              }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-medium">
            {profileStrength < 100
              ? "Complete your history and lifestyle details to reach 100%."
              : "Excellent! Your medical profile is complete."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WidgetsColumn;