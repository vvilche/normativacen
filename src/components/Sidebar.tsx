import { LayoutDashboard, FileText, Book, BarChart3, Settings, Library, ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  danger?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, danger }: SidebarItemProps) => (
  <div 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border border-transparent",
      active 
        ? "bg-accent/20 text-white font-bold border-white/5 shadow-lg" 
        : danger 
          ? "text-red-500/70 hover:text-red-500 hover:bg-red-500/5"
          : "text-gray-500 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </div>
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
    { icon: Library, label: "Biblioteca" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0B0F1A]/50 backdrop-blur-3xl border-r border-white/5 flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
            <span className="font-black italic text-lg">N</span>
        </div>
        <span className="text-xl font-heading font-black text-white italic tracking-tighter">NormativaCEN</span>
      </div>

      <nav className="flex-1 space-y-1.5">
        <div className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-4 pl-2 opacity-50">Menú Principal</div>
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

      <div className="space-y-1.5 pt-6 border-t border-white/5">
        <SidebarItem 
            icon={Settings} 
            label="Configuración" 
            active={activeTab === "Configuración"}
            onClick={() => setActiveTab?.("Configuración")}
        />
        <SidebarItem 
            icon={LogOut} 
            label="Cerrar Sesión" 
            danger 
            onClick={handleLogout}
        />
      </div>

      <button className="mt-8 flex items-center gap-2 text-[10px] text-gray-700 font-black uppercase tracking-widest pl-4 hover:text-white transition-colors group">
        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
        <span>Colapsar Panel</span>
      </button>
    </aside>
  );
}
