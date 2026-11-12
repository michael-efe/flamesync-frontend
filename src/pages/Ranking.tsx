import { useState } from 'react';
import { api } from '../services/api';
import type { RankingPayload, RankedItem } from '../types/index';

export default function Ranking() {
  const [isLoading, setIsLoading] = useState(false);
  const [rankedItems, setRankedItems] = useState<RankedItem[]>([]);
  
  const [missionScenario, setMissionScenario] = useState('Lunar Habitat');
  const [constraints, setConstraints] = useState('High Oxygen, Microgravity');

  const handleRank = async () => {
    setIsLoading(true);
    try {
      const payload: RankingPayload = {
        mission_scenario: missionScenario,
        constraints: constraints
      };
      const data = await api.post('/rankings', payload);
      if (Array.isArray(data)) {
        setRankedItems(data);
      }
    } catch (err) {
      console.error("Ranking failed:", err);
      // Demo fallback
      setRankedItems([
        { investigation_id: 'ACME-003', relevance_score: 95, reasoning: 'Direct match for high oxygen concentration (85%) environments similar to proposed lunar habitats.' },
        { investigation_id: 'BASS-II-001', relevance_score: 82, reasoning: 'Strong baseline for solid material flammability in reduced gravity.' },
        { investigation_id: 'FLEX-002', relevance_score: 45, reasoning: 'Focuses on liquid fuels, lower relevance for solid cabin materials.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-6 overflow-hidden">
      
      <div className="shrink-0">
        <h1 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">
          Dataset Relevance Ranking
        </h1>
        <p className="text-gray-400 text-xs font-sans">
          AI-driven prioritization of historical investigations for target mission scenarios.
        </p>
      </div>

      {/* Configuration Area */}
      <div className="shrink-0 border border-[#1a1a1a] bg-[#050505] p-5 rounded-xl flex gap-4 items-end">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Mission Scenario</label>
          <select 
            value={missionScenario}
            onChange={(e) => setMissionScenario(e.target.value)}
            className="bg-black border border-[#1a1a1a] text-white text-xs p-3 rounded outline-none focus:border-[#FF5500]"
          >
            <option value="Lunar Habitat">Lunar Habitat</option>
            <option value="Mars Rover">Mars Rover</option>
            <option value="ISS Module">ISS Module</option>
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">Constraints / Priority Factors</label>
          <input 
            type="text"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="bg-black border border-[#1a1a1a] text-white text-xs p-3 rounded outline-none focus:border-[#FF5500]"
          />
        </div>
        <button 
          onClick={handleRank}
          disabled={isLoading}
          className="bg-[#FF5500] hover:bg-[#FF5500]/80 disabled:opacity-50 text-black px-8 py-3 rounded text-[11px] font-bold tracking-widest uppercase transition-colors shrink-0"
        >
          {isLoading ? 'Processing...' : 'Run Ranking'}
        </button>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto border border-[#1a1a1a] bg-[#050505] rounded-xl">
        {rankedItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-600 font-bold tracking-widest uppercase">
            Awaiting Mission Parameters...
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#1a1a1a]">
            {rankedItems.map((item, index) => (
              <div key={item.investigation_id} className="p-6 flex gap-6 items-center hover:bg-[#1a1a1a]/30 transition-colors">
                
                <div className="text-3xl font-orbitron font-bold text-gray-700 w-8 text-center shrink-0">
                  {index + 1}
                </div>
                
                <div className="w-48 shrink-0 flex flex-col gap-1">
                  <span className="text-white font-bold tracking-wider">{item.investigation_id}</span>
                  <span className="text-[10px] text-[#FF5500] font-bold tracking-widest uppercase">Match Score: {item.relevance_score}%</span>
                </div>
                
                <div className="flex-1 flex flex-col gap-3">
                  {/* Progress Bar */}
                  <div className="h-1.5 bg-black border border-[#1a1a1a] rounded-full overflow-hidden w-full max-w-md">
                    <div 
                      className="h-full bg-[#FF5500] transition-all duration-1000" 
                      style={{ width: `${item.relevance_score}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 font-sans leading-relaxed">
                    <strong className="text-gray-500 font-mono text-[9px] uppercase tracking-widest mr-2">Top Reason:</strong> 
                    {item.reasoning}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}