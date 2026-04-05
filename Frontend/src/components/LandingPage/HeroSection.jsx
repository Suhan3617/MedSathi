import React from "react";
import ProductCarousel from "./ProductCarousel";
import dashboardImage1 from "../../assets/dashboard-left.png";
import dashboardImage2 from "../../assets/dashboard-right.png";

const HeroSection = () => {
  const heroSlides = [
    { src: dashboardImage1, label: "Real-time Transcription" },
    { src: dashboardImage2, label: "AI Diagnostic Suggestions" },
  ];

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] opacity-50 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[100px] opacity-50 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl leading-tight drop-shadow-sm">
          The AI-Assisted{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500">
            Second Brain
          </span>{" "}
          for Modern Healthcare.
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl leading-relaxed font-medium">
          MedSathi empowers doctors with real-time diagnostic support and
          automated clinical notes, while providing patients an AI symptom
          checker to find the right care instantly.
        </p>

        <div className="w-full max-w-5xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur-xl opacity-20 dark:opacity-40"></div>
            <div className="relative rounded-2xl border border-slate-200/50 dark:border-white/[0.06] bg-white/50 dark:bg-[#0A0F1E]/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video p-2">
              <div className="w-full h-full rounded-xl overflow-hidden">
                <ProductCarousel slides={heroSlides} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
