import React from "react";
import { FiVideo, FiMessageSquare } from "react-icons/fi";
import ProductCarousel from "./ProductCarousel";
import dr_admin_dashboard from "../../assets/algo-doctor.jpg";
import dr_admin_dashboard2 from "../../assets/algo-health.jpg";

const CommunicationSection = () => {
  const chatSlides = [
    { src: dr_admin_dashboard, label: "Algohealth" },
    { src: dr_admin_dashboard2, label: "Dr. Admin Dashboard" },
  ];

  return (
    <section className="py-24 bg-blue-50/40 dark:bg-cyan-900/5 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Side */}
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#0A0F1E]/80 backdrop-blur-md border border-blue-100 dark:border-cyan-800/30 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wide mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 dark:bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 dark:bg-cyan-500"></span>
              </span>
              Telemedicine Suite
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              Connect beyond the clinic walls.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              Experience a unified platform where high-definition video
              calls and secure instant messaging meet AI-powered
              documentation.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/60 dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-white/[0.05]">
                <div className="p-3.5 bg-white dark:bg-[#0A0F1E] rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-md text-blue-600 dark:text-cyan-400 shrink-0">
                  <FiVideo size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    HD Video Consultations
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed">
                    Crystal clear, low-latency video built for medical
                    examinations. Screen share diagnostic results in
                    real-time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5 p-4 rounded-2xl hover:bg-white/60 dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-white/[0.05]">
                <div className="p-3.5 bg-white dark:bg-[#0A0F1E] rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-md text-cyan-600 dark:text-blue-400 shrink-0">
                  <FiMessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Secure Patient Chat
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed">
                    Asynchronous messaging for follow-ups, prescription
                    refills, and quick questions. Fully encrypted.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className="order-1 md:order-2 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full blur-3xl opacity-40"></div>
            <div className="relative rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-white/[0.06] bg-white/50 dark:bg-[#0A0F1E]/50 backdrop-blur-xl p-2 overflow-hidden aspect-square md:aspect-[4/5]">
              <div className="w-full h-full rounded-2xl overflow-hidden">
                <ProductCarousel slides={chatSlides} />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 bg-white/90 dark:bg-[#0A0F1E]/90 backdrop-blur-md p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl max-w-[260px] z-20 animate-bounce">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Incoming Message
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  "Dr. Pratibha, the AI just flagged a potential interaction
                  with the new prescription."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunicationSection;