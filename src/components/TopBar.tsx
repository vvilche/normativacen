import { Search, Bell, Mail, ScanFace, LogOut } from "lucide-react";

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
    <header className="h-14 border-b border-white-[0.03] flex items-center justify-between px-6 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-40">
      {/* Search in Header Removed for Minimalism */}
      <div className="flex-1" />

      {/* User Actions & Profile */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 transition-colors relative">
                <Mail className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-gold rounded-full border border-[#0B0F1A]" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-red-500 rounded-full border border-[#0B0F1A]" />
            </button>
        </div>

        <div className="h-6 w-px bg-white/5" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 group">
            <div className="text-right">
              <p className="text-[11px] font-black text-white/90 group-hover:text-gold transition-colors uppercase tracking-tight">{displayName}</p>
              <div className="flex items-center justify-end gap-1">
                  <div className="w-1 h-1 rounded-full bg-success shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.15em]">Online</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 overflow-hidden flex items-center justify-center text-gold font-black text-xs shadow-gold">
              {initials}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-all"
            title="Cerrar Sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
