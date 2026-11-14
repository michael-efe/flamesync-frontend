import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCompare } from '../context/useCompare';
import { MAX_COMPARISON_ITEMS, type Investigation } from '../types/index';

export default function Explorer() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { selectedInvestigations, toggleInvestigation } = useCompare();

  useEffect(() => {
    let isMounted = true; // Prevents memory leaks if the component unmounts early

    const fetchInvestigations = async () => {
      try {
        const response = await api.get('/investigations');

        // This safely checks if the array is nested inside Axios's .data property, 
        // or if your interceptor already unwrapped it.
        const payload = Array.isArray(response) ? response : (response.data || []);

        if (isMounted) {
          setInvestigations(payload);
          setIsLoading(false); // Move this inside the successful block
        }
      } catch (error) {
        console.error("Error fetching investigations from backend:", error);
        if (isMounted) {
          setInvestigations([]); // Fallback to an empty array so it doesn't hang
          setIsLoading(false);
        }
      }
    };

    fetchInvestigations();

    return () => { isMounted = false; };
  }, []);

  const filteredInvestigations = investigations.filter(inv =>
    inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.source_file.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.fuel_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen lg:h-full max-w-7xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-4 sm:gap-6 p-4 sm:p-0 pb-24 lg:pb-0 lg:overflow-hidden">

      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">
            Investigation Explorer
          </h1>
          <p className="text-gray-400 text-[10px] sm:text-xs font-sans">
            Search, filter and explore combustion research investigations.
          </p>
          <p className="text-gray-600 text-[9px] sm:text-[10px] mt-1 sm:mt-2">
            Select up to {MAX_COMPARISON_ITEMS} rows to compare their source data.
          </p>
        </div>
        <button
          onClick={() => navigate('/compare')}
          disabled={selectedInvestigations.length === 0}
          className="w-full sm:w-auto border border-[#FF5500]/50 text-[#FF5500] hover:bg-[#FF5500]/10 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-3 sm:py-2 rounded text-[10px] sm:text-[9px] font-bold tracking-widest uppercase transition-colors"
        >
          Compare selected ({selectedInvestigations.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 shrink-0">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, project, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505] border border-[#1a1a1a] rounded-lg py-3 px-10 text-[11px] text-white outline-none focus:border-[#FF5500] transition-colors"
          />
          <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl flex flex-col flex-1 min-h-[500px] lg:min-h-0 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
        
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="min-w-[800px]">
            {/* Table Headers */}
            <div className="grid grid-cols-7 gap-4 p-4 border-b border-[#1a1a1a] bg-[#020202] sticky top-0 z-10 text-[9px] font-bold text-gray-500 tracking-widest uppercase">
              <div>ID</div>
              <div className="col-span-2">Investigation / Dataset</div>
              <div>Project</div>
              <div>Material / Fuel</div>
              <div>O2 / Flow</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="p-2">
              {isLoading ? (
                <div className="h-48 flex items-center justify-center text-[10px] text-gray-500 tracking-[0.2em]">
                  FETCHING NASA DATASETS...
                </div>
              ) : filteredInvestigations.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-[10px] text-gray-500 tracking-[0.2em]">
                  NO MATCHING INVESTIGATIONS FOUND.
                </div>
              ) : (
                filteredInvestigations.map((inv) => {
                  const isSelected = selectedInvestigations.some((selected) => selected.id === inv.id);
                  const atLimit = selectedInvestigations.length >= MAX_COMPARISON_ITEMS;
                  return (
                  <div key={inv.id} className="grid grid-cols-7 gap-4 p-4 items-center border-b border-[#1a1a1a]/50 hover:bg-[#1a1a1a]/30 transition-colors group rounded-lg">
                    <div className="text-[10px] text-gray-400 font-bold">{inv.id}</div>
                    <div className="col-span-2 min-w-0">
                      <div className="text-[11px] text-white font-bold truncate">{inv.name}</div>
                      <div className="text-[9px] text-gray-600 truncate">{inv.source_file} · row {inv.source_row}</div>
                    </div>
                    <div className="text-[10px] text-gray-400">{inv.project}</div>
                    <div className="text-[10px] text-gray-400">{inv.fuel_type}</div>
                    <div className="text-[10px] text-gray-400">
                      O2: {inv.oxygen_pct ?? 'N/A'}%
                      <br />
                      Flow: {inv.max_flow_velocity_cm_s ?? 'N/A'} cm/s
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => toggleInvestigation(inv)}
                        disabled={atLimit && !isSelected}
                        className={`border px-4 py-2 sm:py-1.5 rounded text-[9px] font-bold tracking-widest uppercase transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'border-[#FF5500] text-[#FF5500] bg-[#FF5500]/10'
                            : 'border-[#1a1a1a] text-gray-400 group-hover:border-[#FF5500] group-hover:text-[#FF5500]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Add'}
                      </button>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#020202] text-[10px] text-gray-500 flex justify-between items-center shrink-0">
          <div>Showing <span className="text-white font-bold">{filteredInvestigations.length}</span> investigations</div>
        </div>
      </div>
    </div>
  );
}
