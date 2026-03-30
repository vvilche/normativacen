import { LayoutDashboard, FileText, Settings, LogOut, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  danger?: boolean;
  href?: string;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, danger, href }: SidebarItemProps) => {
  const className = cn(
    "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] border transition",
    active
      ? "bg-[rgba(234,179,8,0.12)] border-gold/30 text-gold"
      : danger
        ? "text-red-500/60 border-transparent hover:border-red-500/20"
        : "border-transparent text-slate-500 hover:border-slate-400/30"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        <Icon className="w-3.5 h-3.5" />
        <span className="truncate">{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      <Icon className="w-3.5 h-3.5" />
      <span className="truncate">{label}</span>
    </button>
  );
};

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isDesktop?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  clientMode?: "guide" | "expert";
}

export function Sidebar({ activeTab = "Dashboard", setActiveTab, isDesktop = true, isOpen = true, onClose, clientMode = "expert" }: SidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userProfile');
    window.location.href = '/';
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: FileText, label: "Resoluciones" },
  ];

  return (
    <aside
      className={cn(
        "sidebar-panel transition-transform duration-300",
        isDesktop ? "translate-x-0" : isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mb-3 font-black">
            N
          </div>
          <p className="text-xs uppercase tracking-[0.3em] opacity-70">NormativaCEN</p>
        </div>
        {!isDesktop && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg border border-white/10 text-white"
            aria-label="Cerrar navegación"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
        {clientMode === "guide" ? "Modo guía" : "Modo operativo"}
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.label}
            href={item.href}
            onClick={() => {
              if (item.href) {
                if (!isDesktop) onClose?.();
              } else {
                setActiveTab?.(item.label);
                if (!isDesktop) {
                  onClose?.();
                }
              }
            }}
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
