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
    <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0F1A]/50 backdrop-blur-3xl sticky top-0 z-40">
      {/* Search in Header */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 group-focus-within:text-accent transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search 'PMU regulations'..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all"
          />
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <div className="p-1 px-1.5 rounded border border-white/10 text-[8px] text-gray-600 font-bold bg-white/5 uppercase tracking-tighter">⌘ K</div>
          </div>
        </div>
      </div>

      {/* User Actions & Profile */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-white/5 text-gray-500 transition-colors relative">
                <Mail className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border border-[#0B0F1A]" />
            </button>
            <button className="p-2 rounded-xl hover:bg-white/5 text-gray-500 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#0B0F1A]" />
            </button>
        </div>

        <div className="h-8 w-px bg-white/5" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group">
            <div className="text-right">
              <p className="text-sm font-bold text-white group-hover:text-accent transition-colors uppercase">{displayName}</p>
              <div className="flex items-center justify-end gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 overflow-hidden flex items-center justify-center text-accent font-black">
              {initials}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
