import React from "react";
import { FiActivity, FiTwitter, FiLinkedin, FiGithub } from "react-icons/fi";

const Footer = ({ setActiveModal }) => {
  return (
    <footer className="bg-slate-50 dark:bg-[#0A0F1E] border-t border-slate-200/60 dark:border-slate-800/60 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <FiActivity size={16} />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight brand-font">
                MedSathi
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Transforming healthcare delivery through artificial
              intelligence and seamless design.
            </p>
          </div>

          {/* 🔥 INTERACTIVE FOOTER LINKS */}
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => setActiveModal("features")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("security")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Security
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("pricing")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => setActiveModal("about")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("careers")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("contact")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => setActiveModal("privacy")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("terms")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveModal("hipaa")}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  HIPAA
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/60 dark:border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            © 2026 MedSathi Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-cyan-900/30 dark:hover:text-cyan-400 transition-all duration-300 shadow-sm"
            >
              <FiTwitter size={16} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-cyan-900/30 dark:hover:text-cyan-400 transition-all duration-300 shadow-sm"
            >
              <FiLinkedin size={16} />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-cyan-900/30 dark:hover:text-cyan-400 transition-all duration-300 shadow-sm"
            >
              <FiGithub size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;