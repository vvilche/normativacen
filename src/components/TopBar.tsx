import { Bell, Mail, LogOut } from "lucide-react";

interface TopBarProps {
  user?: {
    email: string;
    company: string;
    activeAsset: string;
  };
}

export function TopBar({ user }: TopBarProps) {
  const handleLogout = () => {
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userProfile');
    window.location.href = '/';
  };

  const displayName = user?.email?.split('@')[0] || "Invitado";
  const initials = displayName.substring(0, 1).toUpperCase();

  return (
    <header className="topbar-panel">
      <div className="flex items-center gap-5">
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
              <p className="text-[11px] font-bold text-slate-700 group-hover:text-primary transition-colors uppercase tracking-tight">{displayName}</p>
              <div className="flex items-center justify-end gap-1">
                  <div className="w-1 h-1 rounded-full bg-success shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.15em]">Online</span>
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
