import type { Investigation } from '../types/index';
import { useCompare } from '../context/useCompare';
import { useNavigate } from 'react-router-dom';

export default function Compare() {
  const { selectedInvestigations, clearSelection } = useCompare();
  const navigate = useNavigate();

  const attributes: Array<{ label: string; value: (investigation: Investigation) => string | number | null }> = [
    { label: 'PROJECT', value: (investigation) => investigation.project },
    { label: 'SOURCE FILE', value: (investigation) => investigation.source_file },
    { label: 'SOURCE ROW', value: (investigation) => investigation.source_row },
    { label: 'MATERIAL / FUEL', value: (investigation) => investigation.fuel_type },
    { label: 'OXYGEN (%)', value: (investigation) => investigation.oxygen_pct },
    { label: 'FLOW VELOCITY (CM/S)', value: (investigation) => investigation.max_flow_velocity_cm_s },
    { label: 'PRESSURE (BAR)', value: (investigation) => investigation.pressure_bar },
  ];

  const sourceFields = Array.from(
    new Set(selectedInvestigations.flatMap((investigation) => Object.keys(investigation.raw_data || {}))),
  ).sort((left, right) => left.localeCompare(right));
  
  const comparisonRows = [
    ...attributes.map((attribute) => ({
      label: attribute.label,
      values: selectedInvestigations.map(attribute.value),
    })),
    ...sourceFields.map((field) => ({
      label: field,
      values: selectedInvestigations.map((investigation) => investigation.raw_data[field] || null),
    })),
  ];
  
  const gridStyle = {
    gridTemplateColumns: `minmax(11rem, 1.1fr) repeat(${selectedInvestigations.length}, minmax(12rem, 1fr))`,
  };
  
  const displayValue = (value: string | number | null) =>
    value === null || value === '' ? 'N/A' : String(value);
    
  const isDifferent = (values: Array<string | number | null>) => {
    const presentValues = values.map(displayValue).filter((value) => value !== 'N/A');
    return presentValues.length > 1 && new Set(presentValues).size > 1;
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-full max-w-7xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-4 sm:gap-6 p-4 sm:p-0 pb-24 lg:pb-0 lg:overflow-hidden">
      
      {/* Header Section - Stacks on mobile */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">
            Compare Investigations
          </h1>
          <p className="text-gray-400 text-[10px] sm:text-xs font-sans">
            Compare normalized measurements and original fields from each selected source row.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate('/explorer')}
            className="flex-1 sm:flex-none border border-[#1a1a1a] text-gray-400 hover:border-gray-500 px-4 py-3 sm:py-2 rounded text-[9px] font-bold tracking-widest uppercase transition-colors"
          >
            Add records
          </button>
          <button
            onClick={clearSelection}
            disabled={selectedInvestigations.length === 0}
            className="flex-1 sm:flex-none text-[#FF5500] border border-[#FF5500]/30 hover:bg-[#FF5500]/10 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-3 sm:py-2 rounded text-[9px] font-bold tracking-widest uppercase transition-colors"
          >
            Clear selection
          </button>
        </div>
      </div>

      {/* Main Grid Container - Scrollable horizontally on small screens */}
      <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col min-h-[500px] lg:min-h-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
        {selectedInvestigations.length === 0 ? (
          <div className="flex-1 flex flex-col gap-4 items-center justify-center text-[10px] sm:text-xs text-gray-600 font-bold tracking-widest uppercase text-center p-4">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-800" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            No records selected. Choose records in Explorer to build a comparison.
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <div className="min-w-max">
              
              <div className="grid border-b border-[#1a1a1a] bg-[#020202] sticky top-0" style={gridStyle}>
                <div className="p-3 sm:p-4 text-[8px] sm:text-[9px] text-gray-600 uppercase tracking-widest self-end">
                  {selectedInvestigations.length} selected
                </div>
                {selectedInvestigations.map((inv) => (
                  <div key={inv.id} className="p-3 sm:p-4 border-l border-[#1a1a1a] flex flex-col gap-1 min-w-48">
                    <span className="text-[11px] sm:text-[12px] font-bold text-white tracking-wider">{inv.id}</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-400 font-sans truncate">{inv.name}</span>
                    <span className="text-[8px] sm:text-[9px] text-gray-600 truncate">{inv.source_file} · row {inv.source_row}</span>
                  </div>
                ))}
              </div>

              <div>
                {comparisonRows.map((row) => {
                  const different = isDifferent(row.values);
                  return (
                  <div key={row.label} className="grid border-b border-[#1a1a1a] hover:bg-[#1a1a1a]/30 transition-colors" style={gridStyle}>
                    <div className="p-3 sm:p-4 min-w-44 flex items-center">
                      <span className="text-[8px] sm:text-[9px] font-bold text-gray-500 tracking-widest uppercase">{row.label}</span>
                    </div>
                    {row.values.map((value, idx) => (
                      <div key={`${selectedInvestigations[idx].id}-${row.label}`} className="p-3 sm:p-4 border-l border-[#1a1a1a] min-w-48 flex items-center">
                        <span className={`text-[10px] sm:text-[11px] font-bold break-words ${different ? 'text-[#FF8A4C]' : 'text-white'}`}>
                          {displayValue(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                  );
                })}
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
