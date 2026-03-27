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
      "flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all border border-transparent",
      active 
        ? "bg-gold/10 text-gold font-black border-gold/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
        : danger 
          ? "text-red-500/60 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/10"
          : "text-gray-500/80 hover:text-white hover:bg-white/5 hover:border-white/5"
    )}
  >
    <Icon className={cn("w-3.5 h-3.5", active && "text-gold shadow-gold")} />
    <span className="text-[10px] font-bold uppercase tracking-[0.14em] shrink-0">{label}</span>
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
    { icon: Settings, label: "Infotécnica" }, // Using Settings for now, or BarChart3
    { icon: Library, label: "Biblioteca" },
  ];

  return (
    <aside className="w-56 h-screen bg-[#0B0F1A] border-r border-white/5 flex flex-col p-5 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-2.5 mb-8 pl-1">
        <div className="w-6 h-6 rounded-md bg-gold flex items-center justify-center text-black shadow-gold">
            <span className="font-bold italic text-sm">N</span>
        </div>
        <span className="text-lg font-heading font-bold text-white italic tracking-tight">Normativa<span className="text-gold">CEN</span></span>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em] mb-3 pl-1 opacity-40">Orquestador</div>
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

      <div className="space-y-1 pt-5 border-t border-white/5">
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

      <button className="mt-8 flex items-center gap-2 text-[9px] text-gray-700 font-black uppercase tracking-[0.2em] pl-1 hover:text-white transition-colors group">
        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
        <span>Minimizar</span>
      </button>
    </aside>
  );
}
