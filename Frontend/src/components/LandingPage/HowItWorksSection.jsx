import React from "react";
import { BsStars } from "react-icons/bs";
import { FiCheckCircle } from "react-icons/fi";

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-slate-900 dark:bg-[#050b14] text-white overflow-hidden relative transition-colors duration-300"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight tracking-tight">
              Designed for the modern medical workflow.
            </h2>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-400 flex items-center justify-center font-extrabold text-base shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">
                    Connect & Consult
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Launch a secure video consultation. MedSathi listens in the
                    background (with consent) to transcribe.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 flex items-center justify-center font-extrabold text-base shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">
                    Real-time Analysis
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    The AI highlights critical information and suggests
                    potential conditions as the patient speaks.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/50 text-purple-400 flex items-center justify-center font-extrabold text-base shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">
                    One-Click Documentation
                  </h4>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    Review the generated notes and prescriptions, sign off, and
                    push to your records instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Representation */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-3 border border-slate-700/50 shadow-2xl">
            <div className="bg-slate-900/80 rounded-2xl p-8 h-96 flex flex-col justify-center items-center text-center border border-slate-800 shadow-inner">
              <BsStars className="text-cyan-400 w-12 h-12 mb-5 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              <p className="text-cyan-300/80 font-mono text-sm mb-3 tracking-wider uppercase font-bold">
                Analyzing Symptoms...
              </p>
              <div className="w-64 h-2.5 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700/50">
                <div className="w-2/3 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
              </div>
              <div className="mt-10 text-left w-full bg-slate-800/60 backdrop-blur-sm p-5 rounded-xl border border-slate-700/80 shadow-lg">
                <div className="flex items-center gap-2 mb-2.5">
                  <FiCheckCircle className="text-emerald-400" size={18} />
                  <span className="text-sm font-extrabold text-slate-200 tracking-wide">
                    Insight Detected
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Patient reports persistent dry cough and low-grade fever. AI
                  suggests considering: Viral URI, Seasonal Allergies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
