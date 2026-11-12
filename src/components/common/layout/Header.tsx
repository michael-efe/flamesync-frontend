export default function Header() {
  return (
    <header className="h-16 bg-[#030303] border-b border-[#1a1a1a] flex items-center justify-between px-6 shrink-0 font-mono">
      <div className="text-gray-400 text-xs tracking-widest uppercase">
        n-Heptane Microgravity Analysis
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          <span className="text-[10px] text-emerald-500 tracking-widest uppercase font-bold">Telemetry Online</span>
        </div>
        <div className="w-8 h-8 rounded bg-black border border-[#1a1a1a] hover:border-[#FF6B00]/50 transition-colors flex items-center justify-center text-xs text-white cursor-pointer">
          OM
        </div>
      </div>
    </header>
  );
}