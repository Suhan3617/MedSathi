import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  // Mobile breakpoint shifted to 1024px (lg) for better tablet experience
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        // Desktop pe default open rakhein
        setIsSidebarOpen(true); 
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Route change hone par mobile me sidebar auto-close ho jaye
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    // 🔥 Main Base Background - Handles Light/Dark universally
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0A0F1E] text-slate-900 dark:text-[#F1F5F9] transition-colors duration-300 font-sans flex overflow-hidden">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isMobile={isMobile}
      />
      
      {/* 🔥 Layout Wrapper - Adjusts margin based on Sidebar state */}
      <div 
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] w-full ${
          !isMobile && isSidebarOpen ? 'ml-[260px]' : 'ml-0'
        }`}
      >
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          isMobile={isMobile}
          isOpen={isSidebarOpen}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden w-full">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;