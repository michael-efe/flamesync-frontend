import { useState } from 'react';
import { api } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import type { PredictionPayload, PredictionResponse } from '../types/index';

// Extended interface to handle the new SHAP data from the backend
interface ExtendedPredictionResponse extends PredictionResponse {
  feature_importance?: Record<string, number>;
}

export default function Predict() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExtendedPredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<PredictionPayload>({
    fuel_type: 'Solid',
    hardware: 'MDCA',
    thickness_mm: 2.0,
    width_cm: 1.5,
    burning_sides: 2,
    flow_velocity_cm_s: 12.0,
    oxygen_concentration_pct: 20.5,
  });

  const handleInputChange = (field: keyof PredictionPayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post('/predictions/spread-rate', formData);
      setResult(data);
    } catch (err) {
      console.error("Prediction failed:", err);
      setError("Failed to connect to ML prediction service.");
      // Demo fallback including the new SHAP feature_importance dictionary
      setResult({
        predicted_spread_rate_mm_s: 0.036,
        lower_bound_95: 0.029,
        upper_bound_95: 0.044,
        physics_consistency: { is_valid: true, violations: [] },
        feature_importance: {
          "Oxygen (%)": 0.015,
          "Flow Vel.": 0.008,
          "Thickness": -0.012,
          "Width": -0.004
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert the backend dictionary { "Oxygen": 0.015 } into an array for Recharts
  const chartData = result?.feature_importance 
    ? Object.entries(result.feature_importance).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-6 overflow-hidden">
      
      {/* Header Section */}
      <div className="shrink-0">
        <h1 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">
          Fire Spread Rate Prediction
        </h1>
        <p className="text-gray-400 text-[10px] font-sans">
          Model prediction with uncertainty and physics consistency check.
        </p>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* Column 1: Input Parameters */}
        <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl flex flex-col">
          <div className="p-4 border-b border-[#1a1a1a]">
            <h2 className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">Input Parameters</h2>
          </div>
          <div className="p-5 flex flex-col gap-4 flex-1 overflow-y-auto">
            {Object.entries(formData).filter(([key]) => key !== 'fuel_type' && key !== 'hardware').map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={value}
                  onChange={(e) => handleInputChange(key as keyof PredictionPayload, parseFloat(e.target.value))}
                  className="bg-black border border-[#1a1a1a] rounded p-2.5 text-[11px] text-white font-bold outline-none focus:border-[#FF5500] transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="p-5 shrink-0">
            <button 
              onClick={handlePredict}
              disabled={isLoading}
              className="w-full bg-[#FF5500] hover:bg-[#FF5500]/80 disabled:opacity-50 text-black py-3 rounded text-[11px] font-bold tracking-widest uppercase transition-colors shadow-[0_0_15px_rgba(255,85,0,0.2)]"
            >
              {isLoading ? 'Processing...' : 'Predict'}
            </button>
          </div>
        </div>

        {/* Column 2: Prediction Result */}
        <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl flex flex-col">
          <div className="p-4 border-b border-[#1a1a1a]">
            <h2 className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">Prediction Result</h2>
          </div>
          <div className="p-5 flex flex-col gap-4 flex-1">
            {error && <div className="text-red-500 text-xs">{error}</div>}
            
            <div className="border border-[#1a1a1a] bg-black rounded-lg p-4">
              <div className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-1">Predicted Spread Rate</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-wider">
                  {result ? result.predicted_spread_rate_mm_s.toFixed(3) : '---'}
                </span>
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">mm/s</span>
              </div>
            </div>

            <div className="border border-[#1a1a1a] bg-black rounded-lg p-4">
              <div className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-1">95% Confidence Interval</div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold text-white tracking-wider">
                  {result ? `${result.lower_bound_95.toFixed(3)} - ${result.upper_bound_95.toFixed(3)}` : '---'}
                </span>
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">mm/s</span>
              </div>
            </div>
          </div>
          
          <div className="p-5 shrink-0 mt-auto">
            {result?.physics_consistency.is_valid ? (
              <div className="border border-green-900/50 bg-green-900/10 rounded-lg p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-900/40 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-green-600 font-bold tracking-widest uppercase">Physics Check</span>
                  <span className="text-xs font-bold text-green-500 tracking-widest uppercase">Passed</span>
                </div>
              </div>
            ) : result?.physics_consistency.is_valid === false ? (
              <div className="border border-red-900/50 bg-red-900/10 rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-900/40 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-red-600 font-bold tracking-widest uppercase">Physics Check</span>
                    <span className="text-xs font-bold text-red-500 tracking-widest uppercase">Failed</span>
                  </div>
                </div>
                <div className="text-[10px] text-red-400 mt-2">
                  {result.physics_consistency.violations.map((v, i) => <div key={i}>• {v}</div>)}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Column 3: Charts */}
        <div className="flex flex-col gap-4">
          <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl flex flex-col h-1/2 min-h-50">
            <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
              <h2 className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">Distribution</h2>
            </div>
            <div className="flex-1 flex items-center justify-center text-xs text-gray-600 font-bold tracking-widest uppercase">
               [CHART COMPONENT]
            </div>
          </div>
          
          <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl flex flex-col h-1/2 min-h-50 overflow-hidden">
             <div className="p-4 border-b border-[#1a1a1a]">
              <h2 className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">Feature Importance (SHAP)</h2>
            </div>
            <div className="flex-1 p-4">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                    <XAxis type="number" hide domain={['dataMin - 0.005', 'dataMax + 0.005']} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} 
                      width={80}
                    />
                    <Tooltip 
                      cursor={{ fill: '#1a1a1a' }}
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #1a1a1a', fontSize: '10px' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [Number(value).toFixed(4), 'SHAP Value']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} // Red for acceleration, Blue for suppression
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-600 font-bold tracking-widest uppercase">
                  Awaiting Prediction...
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
