"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: any;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function DashboardLayout({ children, user, activeTab, setActiveTab }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => (typeof window === "undefined" ? true : window.innerWidth >= 1024));

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
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
      />
      {!isDesktop && sidebarOpen && (
        <button className="sidebar-overlay" aria-label="Cerrar navegación" onClick={closeSidebar} />
      )}
      <div
        className="flex-1 flex flex-col min-h-screen bg-transparent"
        style={{ marginLeft: isDesktop ? "var(--sidebar-width)" : 0 }}
      >
        <TopBar user={user} onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
