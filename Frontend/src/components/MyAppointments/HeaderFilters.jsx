import React from "react";

const HeaderFilters = ({ filter, setFilter }) => {
  return (
    <div className="header-section flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div className="header-text">
        <h1 className="page-title text-3xl md:text-4xl font-extrabold tracking-tight m-0 mb-2">
          <span className="text-slate-900 dark:text-slate-100">Clinical </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500">
            Schedule
          </span>
        </h1>
        <p className="page-subtitle text-sm text-slate-500 dark:text-slate-400 font-medium m-0 mt-1">
          Manage your consultations and records
        </p>
      </div>

      <div className="filter-wrapper flex bg-black/[0.03] dark:bg-white/[0.04] p-1.5 rounded-[14px] overflow-x-auto custom-scrollbar border border-black/[0.02] dark:border-white/[0.02]">
        {["All", "Scheduled", "Completed", "Cancelled"].map((f) => (
          <button
            key={f}
            className={`filter-tab px-4 py-1.5 text-sm font-medium rounded-[10px] transition-all whitespace-nowrap
                                ${
                                  filter === f
                                    ? "bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-cyan-400 shadow-sm border border-black/[0.04] dark:border-white/[0.05]"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                                }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeaderFilters;