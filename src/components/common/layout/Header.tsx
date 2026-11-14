export default function Header() {
  return (
    <header className="h-14 sm:h-16 bg-[#030303] border-b border-[#1a1a1a] flex items-center justify-between px-4 sm:px-6 shrink-0 font-mono">
      
      {/* Title Area: Shortened on mobile to prevent overflow */}
      <div className="text-gray-400 text-[9px] sm:text-xs tracking-widest uppercase truncate pr-2">
        <span className="sm:hidden">n-Heptane Analysis</span>
        <span className="hidden sm:inline">n-Heptane Microgravity Analysis</span>
      </div>
      
      {/* Status & Profile */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        {/* Telemetry Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          {/* Hide the text on mobile, keep only the glowing dot to save space */}
          <span className="hidden sm:block text-[10px] text-emerald-500 tracking-widest uppercase font-bold">
            Telemetry Online
          </span>
        </div>
        
        {/* User Avatar */}
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-black border border-[#1a1a1a] hover:border-[#FF5500]/50 transition-colors flex items-center justify-center text-[10px] sm:text-xs text-white cursor-pointer">
          OM
        </div>
        
      </div>
    </header>
  );
}
