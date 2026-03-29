"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: any;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  clientMode?: "guide" | "expert";
}

export function DashboardLayout({ children, user, activeTab, setActiveTab, clientMode = "expert" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const sidebarVisible = isDesktop || sidebarOpen;

  return (
    <div className="flex min-h-screen font-sans transition-colors">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDesktop={isDesktop}
        isOpen={sidebarVisible}
        onClose={closeSidebar}
        clientMode={clientMode}
      />
      {!isDesktop && sidebarVisible && (
        <button className="sidebar-overlay" aria-label="Cerrar navegación" onClick={closeSidebar} />
      )}
      <div className="flex-1 flex flex-col min-h-screen bg-transparent" style={{ marginLeft: isDesktop ? "16rem" : 0 }}>
        <TopBar user={user} clientMode={clientMode} onToggleSidebar={toggleSidebar} isDesktop={isDesktop} />
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
