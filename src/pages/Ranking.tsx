import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCompare } from '../context/CompareContext';
import type { RankingPayload, RankedItem, RankingResponse } from '../types/index';

export default function Ranking() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [rankedItems, setRankedItems] = useState<RankedItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasRunRanking, setHasRunRanking] = useState(false);
  const { selectedInvestigations, toggleInvestigation } = useCompare();

  const [missionScenario, setMissionScenario] = useState('Lunar Habitat');
  const [constraints, setConstraints] = useState('High Oxygen, Microgravity');

  const handleRank = async () => {
    setIsLoading(true);
    try {
      const payload: RankingPayload = {
        mission_scenario: missionScenario,
        constraints: constraints
      };

      const data = await api.post('/rankings', payload) as RankingResponse;
      setRankedItems(data.rankings);
      setErrorMessage('');
      setHasRunRanking(true);
    } catch (err) {
      console.error("Ranking failed:", err);
      setRankedItems([]);
      setErrorMessage('Could not rank records. Check that the backend is running and try again.');
      setHasRunRanking(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-full max-w-5xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-4 sm:gap-6 p-4 sm:p-0 pb-24 lg:pb-0 lg:overflow-hidden">

      <div className="shrink-0">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">
              Dataset Relevance Ranking
            </h1>
            <p className="text-gray-400 text-[10px] sm:text-xs font-sans">
              Rank local NASA records by how their source data matches your mission and constraints.
            </p>
          </div>
          <button
            onClick={() => navigate('/compare')}
            disabled={selectedInvestigations.length === 0}
            className="w-full sm:w-auto shrink-0 border border-[#FF5500]/50 text-[#FF5500] hover:bg-[#FF5500]/10 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-3 sm:py-2 rounded text-[10px] sm:text-[9px] font-bold tracking-widest uppercase transition-colors"
          >
            Compare selected ({selectedInvestigations.length})
          </button>
        </div>
      </div>

      {/* Configuration Area */}
      <div className="shrink-0 border border-[#1a1a1a] bg-[#050505] p-4 sm:p-5 rounded-xl flex flex-col lg:flex-row gap-4 lg:items-end shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
        <div className="w-full lg:flex-1 flex flex-col gap-1.5 sm:gap-2">
          <label className="text-[8px] sm:text-[9px] text-gray-500 font-bold tracking-widest uppercase">Mission Scenario</label>
          <select
            value={missionScenario}
            onChange={(e) => setMissionScenario(e.target.value)}
            className="w-full bg-black border border-[#1a1a1a] text-white text-[11px] sm:text-xs p-3 rounded outline-none focus:border-[#FF5500]"
          >
            <option value="Lunar Habitat">Lunar Habitat</option>
            <option value="Mars Rover">Mars Rover</option>
            <option value="ISS Module">ISS Module</option>
          </select>
        </div>
        <div className="w-full lg:flex-1 flex flex-col gap-1.5 sm:gap-2">
          <label className="text-[8px] sm:text-[9px] text-gray-500 font-bold tracking-widest uppercase">Constraints / Priority Factors</label>
          <input
            type="text"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="w-full bg-black border border-[#1a1a1a] text-white text-[11px] sm:text-xs p-3 rounded outline-none focus:border-[#FF5500]"
          />
        </div>
        <button
          onClick={handleRank}
          disabled={isLoading}
          className="w-full lg:w-auto mt-2 lg:mt-0 bg-[#FF5500] hover:bg-[#FF5500]/80 disabled:opacity-50 text-black px-8 py-3 rounded text-[10px] sm:text-[11px] font-bold tracking-widest uppercase transition-colors shrink-0 shadow-[0_0_15px_rgba(255,85,0,0.2)] lg:shadow-none"
        >
          {isLoading ? 'Processing...' : 'Run Ranking'}
        </button>
      </div>

      {/* Results List */}
      <div className="flex-1 lg:overflow-y-auto border border-[#1a1a1a] bg-[#050505] rounded-xl min-h-[400px] lg:min-h-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
        {errorMessage ? (
          <div className="h-full flex items-center justify-center text-[10px] sm:text-xs text-red-400 font-bold tracking-widest uppercase px-6 text-center py-10">
            {errorMessage}
          </div>
        ) : rankedItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[10px] sm:text-xs text-gray-600 font-bold tracking-widest uppercase text-center px-4 py-20">
            {isLoading
              ? 'Searching local NASA records...'
              : hasRunRanking
                ? 'No dataset rows matched those terms. Try broader keywords.'
                : 'Run a ranking to find matching records.'}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#1a1a1a]">
            {rankedItems.map((item, index) => (
              <div key={item.investigation_id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center hover:bg-[#1a1a1a]/30 transition-colors">

                {/* Mobile Top Row: Number & Action Button */}
                <div className="flex justify-between items-start sm:hidden">
                  <div className="text-2xl font-orbitron font-bold text-gray-700 w-8 text-center shrink-0">
                    {index + 1}
                  </div>
                  <button
                    onClick={() => toggleInvestigation(item.investigation)}
                    disabled={
                      selectedInvestigations.length >= 4 &&
                      !selectedInvestigations.some((selected) => selected.id === item.investigation_id)
                    }
                    className="shrink-0 border border-[#1a1a1a] hover:border-[#FF5500] text-gray-400 hover:text-[#FF5500] disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 rounded text-[9px] font-bold tracking-widest uppercase transition-colors"
                  >
                    {selectedInvestigations.some((selected) => selected.id === item.investigation_id)
                      ? 'Selected'
                      : 'Compare'}
                  </button>
                </div>

                {/* Desktop Number (Hidden on mobile) */}
                <div className="hidden sm:block text-3xl font-orbitron font-bold text-gray-700 w-8 text-center shrink-0">
                  {index + 1}
                </div>

                <div className="w-full sm:w-56 shrink-0 flex flex-col gap-1">
                  <span className="text-[11px] sm:text-base text-white font-bold tracking-wider">{item.investigation_id}</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">{item.investigation.name}</span>
                  <span className="text-[8px] sm:text-[9px] text-gray-600">{item.investigation.source_file} · row {item.investigation.source_row}</span>
                  <span className="text-[9px] sm:text-[10px] text-[#FF5500] font-bold tracking-widest uppercase mt-1">Match Score: {item.relevance_score}%</span>
                </div>

                <div className="w-full flex-1 flex flex-col gap-2 sm:gap-3">
                  {/* Progress Bar */}
                  <div className="h-1.5 bg-black border border-[#1a1a1a] rounded-full overflow-hidden w-full max-w-md">
                    <div
                      className="h-full bg-[#FF5500] transition-all duration-1000"
                      style={{ width: `${item.relevance_score}%` }}
                    />
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 font-sans leading-relaxed">
                    <strong className="text-gray-500 font-mono text-[8px] sm:text-[9px] uppercase tracking-widest mr-2">Top Reason:</strong>
                    {item.reasoning}
                  </div>
                </div>
                
                {/* Desktop Action Button (Hidden on mobile) */}
                <button
                  onClick={() => toggleInvestigation(item.investigation)}
                  disabled={
                    selectedInvestigations.length >= 4 &&
                    !selectedInvestigations.some((selected) => selected.id === item.investigation_id)
                  }
                  className="hidden sm:block shrink-0 border border-[#1a1a1a] hover:border-[#FF5500] text-gray-400 hover:text-[#FF5500] disabled:opacity-30 disabled:cursor-not-allowed px-3 py-2 rounded text-[9px] font-bold tracking-widest uppercase transition-colors"
                >
                  {selectedInvestigations.some((selected) => selected.id === item.investigation_id)
                    ? 'Selected'
                    : 'Compare'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
