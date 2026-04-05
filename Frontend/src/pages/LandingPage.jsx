import React, { useState } from "react";
import Navbar from "../components/LandingPage/Navbar";
import HeroSection from "../components/LandingPage/HeroSection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import HowItWorksSection from "../components/LandingPage/HowItWorksSection";
import CommunicationSection from "../components/LandingPage/CommunicationSection";
import DashboardSection from "../components/LandingPage/DashboardSection";
import Footer from "../components/LandingPage/Footer";
import FooterModal from "../components/LandingPage/FooterModal";

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Toggle Dark Mode
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        body {
          font-family: 'Inter', sans-serif !important;
        }
        .algo-app-container {
          zoom: 0.8;
        }
        @media (min-width: 768px) {
          .algo-app-container {
            zoom: 0.9;
          }
        }
        
        h1, h2, h3, h4, h5, h6, .brand-font, button {
          font-family: 'Inter', sans-serif !important;
        }
        @supports (-moz-appearance:none) {
          .algo-app-container {
            zoom: 1 !important;
            transform: scale(0.8);
            transform-origin: top center;
            width: 125%;
            height: 125%;
            overflow-x: hidden;
          }
          @media (min-width: 768px) {
            .algo-app-container {
              transform: scale(0.9);
              width: 111.11%;
              height: 111.11%;
            }
          }
        }

        /* Modal Styles */
        .modal-blur { backdrop-filter: blur(8px); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #334155; }
      `}</style>

      <div className="algo-app-container min-h-screen bg-[#F7FAFC] dark:bg-[#0A0F1E] text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-cyan-500/30">
        
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CommunicationSection />
        <DashboardSection />
        
        <Footer setActiveModal={setActiveModal} />

        <FooterModal activeModal={activeModal} setActiveModal={setActiveModal} />

      </div>
    </div>
  );
};

export default LandingPage;