import { LayoutDashboard, FileText, Book, BarChart3, Settings, Library, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  danger?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, danger }: SidebarItemProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] border transition",
      active 
        ? "bg-[rgba(234,179,8,0.12)] border-gold/30 text-gold"
        : danger 
          ? "text-red-500/60 border-transparent hover:border-red-500/20"
          : "border-transparent text-slate-500 hover:border-slate-400/30"
    )}
  >
    <Icon className="w-3.5 h-3.5" />
    <span className="truncate">{label}</span>
  </button>
);

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function Sidebar({ activeTab = "Dashboard", setActiveTab }: SidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userProfile');
    window.location.href = '/';
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: FileText, label: "Resoluciones" },
    { icon: Book, label: "Normas" },
    { icon: BarChart3, label: "Reportes" },
    { icon: Settings, label: "Infotécnica" }, // Using Settings for now, or BarChart3
    { icon: Library, label: "Biblioteca" },
  ];

  return (
    <aside className="sidebar-panel">
      <div>
        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mb-3 font-black">
          N
        </div>
        <p className="text-xs uppercase tracking-[0.3em] opacity-70">NormativaCEN</p>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.label}
            onClick={() => setActiveTab?.(item.label)}
          />
        ))}
      </nav>

      <div className="space-y-2 border-t border-[rgba(13,30,37,0.08)] pt-3">
        <SidebarItem
          icon={Settings}
          label="Configuración"
          active={activeTab === "Configuración"}
          onClick={() => setActiveTab?.("Configuración")}
        />
        <SidebarItem icon={LogOut} label="Cerrar Sesión" danger onClick={handleLogout} />
      </div>
    </aside>
  );
}
