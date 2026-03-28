"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: any;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function DashboardLayout({ children, user, activeTab, setActiveTab }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen font-sans transition-colors">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen bg-transparent">
        <TopBar user={user} />
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
