export const HEALTH_TIPS = [
    "Hydration is key! Aim for 8 glasses of water today.",
    "A 30-minute brisk walk can boost your mood.",
    "Reduce screen time 1 hour before bed.",
    "Don't skip breakfast—it jumpstarts your metabolism!",
    "Stretch every hour to prevent back strain."
];

export const fadeUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
};

export const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
};

export const glassCardClasses = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-[24px] p-6 sm:p-8 relative overflow-hidden";