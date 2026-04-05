// src/styles/dashboardTheme.js

export const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export const glassSurface =
  "bg-white/65 dark:bg-[#e2e8f0]/[0.04] backdrop-blur-[14px] border border-black/5 dark:border-white/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.3)] rounded-2xl";
export const glassInteractive = `${glassSurface} hover:scale-[1.015] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] dark:hover:border-cyan-500/30 transition-all duration-300`;
export const textPrimary = "text-slate-900 dark:text-slate-100";
export const textSecondary = "text-slate-700 dark:text-slate-300";
export const textMuted = "text-slate-500 dark:text-slate-400";
export const primaryGradientText =
  "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500";
export const primaryGradientBg =
  "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-400 dark:hover:to-cyan-300 text-white shadow-lg shadow-blue-500/25 dark:shadow-cyan-500/20";