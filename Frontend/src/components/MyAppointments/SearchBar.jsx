import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ searchTerm, setSearchTerm, user }) => {
  return (
    <div className="search-bar-container relative mb-8 w-full md:max-w-md">
      <FiSearch className="search-icon absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input
        type="text"
        placeholder={
          user.role === "doctor"
            ? "Search patient directory..."
            : "Search doctor directory..."
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input w-full bg-white/60 dark:bg-black/20 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] rounded-[16px] pl-11 pr-4 py-3 outline-none text-sm text-slate-800 dark:text-[#F1F5F9] placeholder-slate-400 shadow-sm focus:ring-2 focus:ring-[#06B6D4]/40 transition-all"
      />
    </div>
  );
};

export default SearchBar;