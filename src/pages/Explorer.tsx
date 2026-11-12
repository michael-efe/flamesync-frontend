import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Investigation } from '../types/index';
import { useCompare } from '../context/CompareContext';

export default function Explorer() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [fuelType, setFuelType] = useState('All');
  const [safetyDomain, setSafetyDomain] = useState('All');

  // Bring in the global state hook
  const { selectedInvestigations, toggleInvestigation } = useCompare();

  useEffect(() => {
    const fetchInvestigations = async () => {
      setIsLoading(true);
      try {
        let endpoint = '/investigations';
        const params = new URLSearchParams();
        
        if (fuelType !== 'All') params.append('fuel_type', fuelType);
        if (safetyDomain !== 'All') params.append('safety_domain', safetyDomain);
        
        const queryString = params.toString();
        if (queryString) {
          endpoint += `?${queryString}`;
        }

        const data = await api.get(endpoint);
        
        if (Array.isArray(data)) {
          setInvestigations(data);
        } else {
          setInvestigations([]);
        }
      } catch (error) {
        console.error("Failed to fetch investigations:", error);
        // Fallback demo data
        setInvestigations([
          { investigation_id: 'BASS-II-001', investigation_name: 'BASS-II', project: 'Microgravity Science', safety_domain: 'Flammability', fuel_type: 'Solid', oxygen_concentration_pct: 20.1 },
          { investigation_id: 'ACME-003', investigation_name: 'ACME CFT-G', project: 'Advanced Combustion', safety_domain: 'Flammability', fuel_type: 'Gaseous', oxygen_concentration_pct: 85.0 },
          { investigation_id: 'FLEX-002', investigation_name: 'FLEX', project: 'Fire Safety', safety_domain: 'Suppression', fuel_type: 'Liquid', oxygen_concentration_pct: 21.0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestigations();
  }, [fuelType, safetyDomain]);

  const clearFilters = () => {
    setFuelType('All');
    setSafetyDomain('All');
  };

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white overflow-hidden gap-5">
      
      {/* Header Section */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">Investigation Explorer</h1>
          <p className="text-gray-400 text-xs font-sans">Search, filter and explore combustion research investigations.</p>
        </div>
        <button className="p-2 border border-[#1a1a1a] rounded-lg text-gray-500 hover:text-white hover:border-gray-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 shrink-0">
        <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-lg flex items-center px-4 focus-within:border-[#FF5500]/50 transition-colors">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search by name, project, or keyword..." 
            className="w-full bg-transparent border-none outline-none text-xs text-white p-3 placeholder-gray-600 font-sans"
          />
        </div>
        <button className="flex items-center gap-2 bg-black border border-[#1a1a1a] px-6 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase text-white hover:border-[#FF5500] transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          FILTERS
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-lg p-2.5 flex flex-col gap-1.5 opacity-50 cursor-not-allowed">
          <label className="text-[8px] text-gray-500 font-bold tracking-widest uppercase">INVESTIGATION TYPE</label>
          <div className="text-[11px] text-gray-200">All</div>
        </div>

        <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-lg p-2.5 flex flex-col gap-1.5 hover:border-gray-700 transition-colors focus-within:border-[#FF5500]">
          <label className="text-[8px] text-gray-500 font-bold tracking-widest uppercase">FUEL TYPE</label>
          <select 
            value={fuelType} 
            onChange={(e) => setFuelType(e.target.value)}
            className="bg-transparent text-[11px] text-gray-200 outline-none w-full cursor-pointer appearance-none"
          >
            <option value="All" className="bg-black">All</option>
            <option value="Solid" className="bg-black">Solid</option>
            <option value="Liquid" className="bg-black">Liquid</option>
            <option value="Gaseous" className="bg-black">Gaseous</option>
          </select>
        </div>

        <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-lg p-2.5 flex flex-col gap-1.5 hover:border-gray-700 transition-colors focus-within:border-[#FF5500]">
          <label className="text-[8px] text-gray-500 font-bold tracking-widest uppercase">SAFETY DOMAIN</label>
          <select 
            value={safetyDomain} 
            onChange={(e) => setSafetyDomain(e.target.value)}
            className="bg-transparent text-[11px] text-gray-200 outline-none w-full cursor-pointer appearance-none"
          >
            <option value="All" className="bg-black">All</option>
            <option value="Flammability" className="bg-black">Flammability</option>
            <option value="Suppression" className="bg-black">Suppression</option>
            <option value="Detection" className="bg-black">Detection</option>
          </select>
        </div>

        <div className="flex-1 bg-[#050505] border border-[#1a1a1a] rounded-lg p-2.5 flex flex-col gap-1.5 opacity-50 cursor-not-allowed">
          <label className="text-[8px] text-gray-500 font-bold tracking-widest uppercase">HARDWARE</label>
          <div className="text-[11px] text-gray-200">All</div>
        </div>

        <button 
          onClick={clearFilters}
          className="text-[#FF5500] text-[9px] font-bold tracking-widest uppercase hover:text-white transition-colors px-2 shrink-0"
        >
          CLEAR ALL
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#050505] border border-[#1a1a1a] rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-[#1a1a1a] bg-[#020202] shrink-0">
          {['ID', 'NAME', 'PROJECT', 'SAFETY DOMAIN', 'FUEL TYPE', 'OXYGEN (%)', 'ACTIONS'].map((header) => (
            <div key={header} className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">
              {header}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-xs text-gray-500 tracking-widest uppercase animate-pulse">
              Fetching spatial datasets...
            </div>
          ) : investigations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-xs text-gray-500 tracking-widest uppercase">
              No investigations match criteria
            </div>
          ) : (
            investigations.map((row, i) => {
              const isSelected = selectedInvestigations.some(inv => inv.investigation_id === row.investigation_id);
              
              return (
                <div 
                  key={row.investigation_id || i} 
                  className={`grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_1fr_1fr] gap-4 p-4 items-center border-b border-[#1a1a1a] transition-colors ${
                    isSelected ? 'bg-[#FF5500]/5' : 'hover:bg-[#1a1a1a]/50'
                  } ${i === investigations.length - 1 ? 'border-b-0' : ''}`}
                >
                  <div className="text-[11px] font-bold text-white">{row.investigation_id || 'N/A'}</div>
                  <div className="text-[11px] text-gray-300 font-sans truncate">{row.investigation_name || 'N/A'}</div>
                  <div className="text-[11px] text-gray-300 font-sans truncate">{row.project || 'N/A'}</div>
                  <div className="text-[11px] text-gray-400 font-sans">{row.safety_domain || 'N/A'}</div>
                  <div className="text-[11px] text-gray-400 font-sans">{row.fuel_type || 'N/A'}</div>
                  <div className="text-[11px] text-white font-bold">
                    {row.oxygen_concentration_pct != null ? Number(row.oxygen_concentration_pct).toFixed(1) : 'N/A'}
                  </div>
                  
                  <div>
                    <button 
                      onClick={() => toggleInvestigation(row)}
                      className={`px-3 py-1.5 rounded text-[9px] font-bold tracking-widest uppercase transition-colors border ${
                        isSelected 
                          ? 'bg-[#FF5500] text-black border-[#FF5500]' 
                          : 'bg-black text-white border-[#1a1a1a] hover:border-[#FF5500] hover:text-[#FF5500]'
                      }`}
                    >
                      {isSelected ? 'ADDED' : 'COMPARE'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#020202] shrink-0 flex items-center justify-between">
          <div className="text-[10px] text-gray-500 font-sans">
            Showing <strong className="text-white">{investigations.length > 0 ? '1' : '0'}-{investigations.length}</strong> of {investigations.length} investigations
          </div>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 flex items-center justify-center border border-[#1a1a1a] rounded bg-black text-gray-600 hover:text-white transition-colors">
              <span className="text-xs">&lt;</span>
            </button>
            <button className="w-6 h-6 flex items-center justify-center border border-[#FF5500] rounded bg-[#FF5500]/10 text-[#FF5500] font-bold text-[10px]">
              1
            </button>
            <button className="w-6 h-6 flex items-center justify-center border border-[#1a1a1a] rounded bg-black text-gray-600 hover:text-white transition-colors">
              <span className="text-xs">&gt;</span>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}