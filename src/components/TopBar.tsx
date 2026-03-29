import { Bell, Mail, LogOut, Menu } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  user?: {
    email: string;
    company: string;
    activeAsset: string;
  };
  clientMode?: "guide" | "expert";
  onToggleSidebar?: () => void;
  isDesktop?: boolean;
}

export function TopBar({ user, clientMode = "expert", onToggleSidebar, isDesktop = true }: TopBarProps) {
  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userProfile');
    window.location.href = '/';
  };

  const displayName = user?.email?.split('@')[0] || "Invitado";
  const initials = displayName.substring(0, 1).toUpperCase();
  const company = user?.company || "Coordinado";
  const activeAsset = user?.activeAsset || "N/A";

  return (
    <header className="topbar-panel">
      <div className="flex items-center gap-3">
        {onToggleSidebar && !isDesktop && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg border border-white/10 text-white"
            aria-label="Abrir navegación"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 flex flex-col">
          <span>NormativaCEN Hub</span>
          <span>{company}</span>
        </div>
      </div>
        <div className="flex items-center gap-5 flex-wrap justify-end">
          <div className="hidden md:flex items-center gap-3 border border-white/10 rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em]">
            <span>{clientMode === "guide" ? "Modo guía" : "Modo operativo"}</span>
            <span className="text-white/60">Activo: {activeAsset}</span>
          </div>
          <Link
            href="/educacion"
            className="hidden md:inline-flex px-4 py-1 rounded-xl border border-white/15 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 hover:text-white hover:bg-white/5"
          >
            Educación
          </Link>
          <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-xl border border-transparent hover:border-slate-300/40 transition-colors relative">
                  <Mail className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-gold rounded-full" />
            </button>
            <button className="p-1.5 rounded-xl border border-transparent hover:border-slate-300/40 transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-red-500 rounded-full" />
            </button>
        </div>

        <div className="h-6 w-px bg-slate-300/30" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 group">
            <div className="text-right">
              <p className="text-[11px] font-bold text-white group-hover:text-primary transition-colors uppercase tracking-tight">{displayName}</p>
              <div className="flex items-center justify-end gap-1">
                  <div className="w-1 h-1 rounded-full bg-success shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  <span className="text-[8px] text-white/50 font-bold uppercase tracking-[0.15em]">Online</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 overflow-hidden flex items-center justify-center text-primary font-bold text-xs">
              {initials}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="p-1.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
