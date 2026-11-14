import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Home() {
  const [investigationCount, setInvestigationCount] = useState<number>(0);
  const [datasetCount, setDatasetCount] = useState<number>(0);

  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const data: Array<{ source_file: string }> = await api.get('/investigations');
        setInvestigationCount(data.length);
        setDatasetCount(new Set(data.map((investigation) => investigation.source_file)).size);
      } catch (error) {
        console.error("Failed to load investigations:", error);
      }
    };
    fetchInvestigations();
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-7xl mx-auto min-h-screen lg:h-full selection:bg-[#FF5500] selection:text-white font-mono p-4 sm:p-0 pb-24 lg:pb-0 lg:overflow-hidden">
      
      {/* Top Main Banner */}
      <div className="shrink-0 border border-[#1a1a1a] rounded-xl p-4 sm:p-5 bg-black flex flex-col gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5500]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2c0 0-4 3.2-6 8.5C6 15.3 9.4 19 12 22c2.6-3 6-6.7 6-11.5C18 5.2 14 2 14 2s-1.5 2.5-2 2.5S12 2 12 2zm0 15.5c-2.3 0-3.5-2.2-3.5-2.2 1.5.5 3 .5 3.5-.5 0 0 1.2 2.7 0 2.7z"/>
          </svg>
          <h1 className="text-white text-base sm:text-lg font-bold tracking-[0.2em] uppercase">FLAMESYNC</h1>
        </div>
        <p className="text-[#FF5500] text-[10px] sm:text-xs font-bold tracking-wide mt-1">Discover. Compare. Predict. Stay Safer.</p>
        <p className="text-gray-400 text-[10px] sm:text-[11px] font-sans">AI-powered insights from combustion research for safer human space exploration.</p>
      </div>

      {/* Metrics Grid - Stacks 2x2 on mobile, 4 across on desktop */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { title: 'INVESTIGATIONS', value: investigationCount.toString(), sub: 'Total Records', active: false },
          { title: 'DATASETS', value: datasetCount.toString(), sub: 'Local source files', active: true },
          { title: 'DATA COVERAGE', value: 'N/A', sub: 'Beta Coverage', active: false },
          { title: 'LAST UPDATED', value: 'Nov 13, 2026', sub: '[when data available]', active: false, valColor: 'text-[#FF5500]' }
        ].map((stat, i) => (
          <div key={i} className={`border rounded-xl p-3 sm:p-4 bg-black flex flex-col gap-1 sm:gap-1.5 transition-colors ${
            stat.active ? 'border-[#FF5500] shadow-[0_0_10px_rgba(255,85,0,0.1)]' : 'border-[#1a1a1a]'
          }`}>
            <div className="text-[8px] sm:text-[10px] text-gray-500 font-bold tracking-widest uppercase">{stat.title}</div>
            <div className={`text-lg sm:text-2xl font-bold ${stat.valColor || 'text-white'}`}>{stat.value}</div>
            <div className="text-[8px] sm:text-[10px] text-gray-600 font-sans truncate">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Split Content Area - Stacks vertically on mobile */}
      <div className="flex-1 lg:min-h-0 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-5">
        
        {/* Mission Scenarios - Stacks 2x2 on small mobile, 4 across on tablets */}
        <div className="flex flex-col gap-3 h-full">
          <h2 className="shrink-0 text-[9px] sm:text-[10px] font-bold text-white tracking-[0.15em] uppercase">EXPLORE BY MISSION SCENARIO</h2>
          <div className="flex-1 lg:min-h-0 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'SPACECRAFT', icon: <path d="M12 2L2 22h20L12 2z"/>, active: false },
              { label: 'LUNAR', icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>, active: false },
              { label: 'MARS ROVER', icon: <path d="M4 8h16v10H4z M8 18v3 M16 18v3 M4 12h16"/>, active: true },
              { label: 'SPACE STATION', icon: <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>, active: false },
            ].map((scenario, i) => (
              <div key={i} className={`border rounded-xl flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 sm:p-0 transition-colors cursor-pointer h-full bg-black ${
                scenario.active 
                  ? 'border-[#FF5500] text-[#FF5500] shadow-[0_0_15px_rgba(255,85,0,0.15)]' 
                  : 'border-[#1a1a1a] text-gray-500 hover:border-gray-600'
              }`}>
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  {scenario.icon}
                </svg>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-center px-2">{scenario.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Research Areas */}
        <div className="flex flex-col gap-3 h-full">
          <h2 className="shrink-0 text-[9px] sm:text-[10px] font-bold text-white tracking-[0.15em] uppercase">TOP RESEARCH AREAS</h2>
          <div className="flex-1 lg:min-h-0 flex flex-col gap-3 sm:gap-4">
            {[
              { label: 'FLAMMABILITY', icon: <path d="M12 2c0 0-4 3.2-6 8.5C6 15.3 9.4 19 12 22c2.6-3 6-6.7 6-11.5C18 5.2 14 2 14 2s-1.5 2.5-2 2.5S12 2 12 2z"/>, active: false },
              { label: 'DETECTION', icon: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>, active: true },
              { label: 'SUPPRESSION', icon: <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18M6 12h12"/>, active: false },
            ].map((area, i) => (
              <div key={i} className={`border rounded-xl p-4 sm:p-5 flex items-center justify-between transition-colors cursor-pointer h-full bg-black ${
                area.active 
                  ? 'border-[#FF5500] text-white shadow-[0_0_15px_rgba(255,85,0,0.1)]' 
                  : 'border-[#1a1a1a] text-gray-400 hover:border-gray-600'
              }`}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${area.active ? 'text-[#FF5500]' : 'text-gray-500'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {area.icon}
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">{area.label}</span>
                </div>
                <span className={`text-base sm:text-lg ${area.active ? 'text-[#FF5500]' : 'text-gray-600'}`}>&rsaquo;</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Info Banner */}
      <div className="shrink-0 border border-[#1a1a1a] rounded-lg p-3 bg-black flex items-start sm:items-center gap-3">
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5500] shrink-0 mt-0.5 sm:mt-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
        </svg>
        <p className="text-[9px] sm:text-[10px] text-gray-400 font-sans leading-relaxed">
          Explorer loads locally available NASA PSI experimental tables and DAFT flight measurements. Each record includes its source file, and unavailable measurements are shown as N/A.
        </p>
      </div>

    </div>
  );
}
