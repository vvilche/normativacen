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
      {/* Search in Header */}
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-gray-600 group-focus-within:text-accent transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search agents, nodes, resolutions..." 
            className="w-full bg-white/5 border border-white/5 rounded-lg py-1.5 pl-9 pr-4 text-[12px] text-white focus:outline-none focus:border-accent/30 focus:bg-white/10 transition-all font-medium"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="p-0.5 px-1 rounded border border-white/5 text-[8px] text-gray-700 font-black bg-white/5 uppercase tracking-tighter">⌘ K</div>
          </div>
        </div>
      </div>

      {/* User Actions & Profile */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-gray-600 transition-colors relative">
                <Mail className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-accent rounded-full border border-[#0B0F1A]" />
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
              <p className="text-[11px] font-black text-white/90 group-hover:text-accent transition-colors uppercase tracking-tight">{displayName}</p>
              <div className="flex items-center justify-end gap-1">
                  <div className="w-1 h-1 rounded-full bg-success shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  <span className="text-[8px] text-gray-600 font-black uppercase tracking-[0.15em]">Online</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 overflow-hidden flex items-center justify-center text-accent font-black text-xs">
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
