import type { Investigation } from '../types/index';
import { useCompare } from '../context/CompareContext';

export default function Compare() {
  const { selectedInvestigations, clearSelection } = useCompare();

  const attributes = [
    { label: 'PROJECT', key: 'project' },
    { label: 'SAFETY DOMAIN', key: 'safety_domain' },
    { label: 'FUEL TYPE', key: 'fuel_type' },
    { label: 'OXYGEN (%)', key: 'oxygen_concentration_pct' },
    { label: 'HARDWARE', key: 'hardware' }
  ];

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-6 overflow-hidden">
      
      <div className="shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">
            Compare Investigations
          </h1>
          <p className="text-gray-400 text-xs font-sans">
            Side-by-side analysis of selected datasets.
          </p>
        </div>
        <button 
          onClick={clearSelection}
          disabled={selectedInvestigations.length === 0}
          className="text-[#FF5500] border border-[#FF5500]/30 hover:bg-[#FF5500]/10 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded text-[9px] font-bold tracking-widest uppercase transition-colors"
        >
          Clear Selection
        </button>
      </div>

      <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col min-h-0">
        {selectedInvestigations.length === 0 ? (
          <div className="flex-1 flex flex-col gap-4 items-center justify-center text-xs text-gray-600 font-bold tracking-widest uppercase">
            <svg className="w-12 h-12 text-gray-800" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            No investigations selected for comparison.
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <div className="min-w-200 flex flex-col h-full">
              
              {/* Header Row */}
              <div className="flex border-b border-[#1a1a1a] bg-[#020202] shrink-0">
                <div className="w-48 p-4 shrink-0"></div>
                {selectedInvestigations.map((inv) => (
                  <div key={inv.investigation_id} className="flex-1 p-4 border-l border-[#1a1a1a] flex flex-col gap-1">
                    <span className="text-[14px] font-bold text-white tracking-widest uppercase">{inv.investigation_id}</span>
                    <span className="text-[10px] text-gray-500 font-sans truncate">{inv.investigation_name}</span>
                  </div>
                ))}
              </div>

              {/* Attribute Rows */}
              <div className="flex-1 flex flex-col">
                {attributes.map((attr) => (
                  <div key={attr.key} className="flex border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/30 transition-colors">
                    <div className="w-48 p-4 shrink-0 flex items-center">
                      <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">{attr.label}</span>
                    </div>
                    {selectedInvestigations.map((inv, idx) => (
                      <div key={`${inv.investigation_id}-${attr.key}`} className="flex-1 p-4 border-l border-[#1a1a1a] flex items-center">
                        <span className={`text-[11px] font-bold ${idx === 0 ? 'text-[#FF5500]' : 'text-white'}`}>
                          {inv[attr.key as keyof Investigation] || 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}