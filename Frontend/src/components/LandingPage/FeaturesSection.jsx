import React from "react";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiActivity,
  FiSearch,
  FiShield,
  FiMaximize,
} from "react-icons/fi";
import ProductCarousel from "./ProductCarousel";
import algomed_ai from "../../assets/algomed-ai.png";
import find_doctors from "../../assets/find-doctors.png";

const FeaturesSection = () => {
  const featureSlides = [
    { src: algomed_ai, label: "MedSathi - AI Chat" },
    { src: find_doctors, label: "Find Doctors" },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
            Focus on patients. Let AI handle the rest.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            Our advanced algorithms analyze patient data in real-time to provide
            actionable insights and automate administrative burdens.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[24px] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/50 dark:border-white/[0.05] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_20px_rgba(37,99,235,0.15)] transition-all duration-300 group flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-cyan-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-cyan-500 group-hover:text-white shadow-inner transition-all">
              <FiCpu className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
              AI Clinical Assistant
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Instantly generate differential diagnoses and treatment
              suggestions based on patient symptoms and history.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[24px] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/50 dark:border-white/[0.05] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300 group flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:text-white shadow-inner transition-all">
              <FiActivity className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
              Automated SOAP Notes
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Turn consultations into structured documentation automatically.
              Save up to 2 hours of charting daily.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[24px] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/50 dark:border-white/[0.05] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 group flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white shadow-inner transition-all">
              <FiSearch className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
              AI Symptom Checker
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Empower patients to pre-screen symptoms with our intelligent
              chatbot, guiding them to the right specialist instantly.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-8 rounded-[24px] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200/50 dark:border-white/[0.05] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 group flex flex-col h-full"
          >
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white shadow-inner transition-all">
              <FiShield className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">
              Enterprise Security
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              HIPAA-compliant infrastructure with end-to-end encryption ensures
              patient data remains private and secure.
            </p>
          </motion.div>
        </div>

        {/* <div className="mt-24 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 dark:bg-cyan-900/20 border border-blue-200/50 dark:border-cyan-800/30 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wide mb-4 shadow-sm backdrop-blur-sm">
              <FiMaximize className="w-3.5 h-3.5" /> Detailed View
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Experience the Clinical Interface
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto font-medium leading-relaxed">
              See how MedSathi integrates seamlessly into your consultation
              workflow, offering real-time assistance without disrupting the
              patient connection.
            </p>
          </div>

          <div className="relative rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-white/[0.06] bg-white/50 dark:bg-[#0A0F1E]/50 backdrop-blur-xl p-2 overflow-hidden aspect-video transform transition-all hover:scale-[1.005]">
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <ProductCarousel autoSlide={true} slides={featureSlides} />
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default FeaturesSection;
