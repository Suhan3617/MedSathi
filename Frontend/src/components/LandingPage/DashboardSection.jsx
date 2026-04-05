import React from "react";
import appScreenshot from "../../assets/algo-chat.png";

const DashboardSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-[#0A0F1E] border-t border-slate-100 dark:border-white/[0.02] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-16 tracking-tight">
          One Dashboard to Rule Them All
        </h2>

        <div className="relative max-w-6xl mx-auto group">
          {/* Decorative background glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

          {/* Main Image Container */}
          <div className="relative rounded-3xl shadow-2xl border border-slate-200/50 dark:border-white/[0.06] bg-white/50 dark:bg-[#0A0F1E]/50 backdrop-blur-xl p-2 overflow-hidden">
            <div className="rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900">
              <img
                src={appScreenshot}
                alt="MedSathi Dashboard Interface"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;