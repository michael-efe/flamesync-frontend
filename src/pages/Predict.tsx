import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { BurnTimeValidation, PredictionPayload, PredictionResponse } from '../types/index';

export default function Predict() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<BurnTimeValidation | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PredictionPayload>({
    fuel_type: 'ethane',
    oxygen_concentration: 0.21,
    chamber_pressure_bar: 1.0,
    mass_flow_rate_mg_s: 1.0,
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.get('/predictions/validation')
      .then((report: BurnTimeValidation) => {
        if (isMounted) setValidation(report);
      })
      .catch((requestError: unknown) => {
        if (isMounted) {
          setValidationError(
            requestError instanceof Error ? requestError.message : 'Validation report is unavailable.',
          );
        }
      });
    return () => { isMounted = false; };
  }, []);

  const handleInputChange = (field: keyof PredictionPayload, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError(null);
    setError(null);
  };

  const handlePredict = async () => {
    setResult(null);
    if (
      !Number.isFinite(formData.oxygen_concentration) ||
      formData.oxygen_concentration < 0 ||
      formData.oxygen_concentration > 1
    ) {
      setFormError('Oxygen concentration must be between 0 and 1 (for example, 0.21 for 21%).');
      return;
    }
    if (!Number.isFinite(formData.chamber_pressure_bar) || formData.chamber_pressure_bar <= 0) {
      setFormError('Chamber pressure must be greater than 0 bar.');
      return;
    }
    if (!Number.isFinite(formData.mass_flow_rate_mg_s) || formData.mass_flow_rate_mg_s < 0) {
      setFormError('Mass flow rate must be zero or greater.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post('/predictions/burn-time', formData) as PredictionResponse;
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('Prediction failed:', message);
      setResult(null);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-full max-w-7xl mx-auto font-mono selection:bg-[#FF5500] selection:text-white gap-4 sm:gap-6 p-4 sm:p-0 pb-24 lg:pb-0 lg:overflow-hidden">
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-[0.2em] uppercase mb-1">
            Microgravity Burn Duration
          </h1>
          <p className="text-gray-400 text-[10px] sm:text-xs font-sans">
            Experimental CFI-G burn-time estimate from the trained Random Forest model.
          </p>
          <div className="mt-2 sm:mt-3 border border-yellow-900/50 bg-yellow-900/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-[9px] sm:text-[10px] text-yellow-200">
            Experimental estimate only. This model is not validated or approved for fire-safety decisions.
          </div>
        </div>
        <button
          onClick={handlePredict}
          disabled={isLoading || Boolean(formError)}
          className="w-full sm:w-auto shrink-0 bg-[#FF5500] hover:bg-[#FF5500]/80 disabled:opacity-50 text-black px-5 py-3 sm:py-3 rounded text-[10px] sm:text-[11px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,85,0,0.2)]"
        >
          {isLoading ? 'Processing...' : 'Predict'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-4 flex-1 lg:min-h-0">
        
        {/* Column 1: Inputs */}
        <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl flex flex-col min-h-[400px] lg:min-h-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
          <div className="p-3 sm:p-4 border-b border-[#1a1a1a]">
            <h2 className="text-[9px] sm:text-[10px] font-bold text-white tracking-[0.15em] uppercase">Input Parameters</h2>
          </div>
          <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[8px] sm:text-[9px] text-gray-500 font-bold tracking-widest uppercase">Fuel Type</label>
              <select
                value={formData.fuel_type}
                onChange={(e) => handleInputChange('fuel_type', e.target.value)}
                className="bg-black border border-[#1a1a1a] rounded p-3 sm:p-2.5 text-[10px] sm:text-[11px] text-white font-bold outline-none focus:border-[#FF5500]"
              >
                <option value="ethane">Ethane</option>
                <option value="propane">Propane</option>
                <option value="50% butane">50% Butane Mix</option>
                <option value="30% ethane">30% Ethane Mix</option>
                <option value="30% propane">30% Propane Mix</option>
              </select>
            </div>

            {Object.entries(formData).filter(([key]) => key !== 'fuel_type').map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="text-[8px] sm:text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                  {key.replace(/_/g, ' ')}{key === 'oxygen_concentration' ? ' (fraction: 0-1)' : ''}
                </label>
                <input
                  type="number"
                  step={key === 'oxygen_concentration' ? '0.01' : 'any'}
                  min={validation?.input_ranges?.[key]?.minimum}
                  max={validation?.input_ranges?.[key]?.maximum}
                  value={Number.isFinite(value) ? value : ''}
                  onChange={(e) => handleInputChange(
                    key as keyof PredictionPayload,
                    e.target.value === '' ? Number.NaN : e.target.valueAsNumber,
                  )}
                  className="bg-black border border-[#1a1a1a] rounded p-3 sm:p-2.5 text-[10px] sm:text-[11px] text-white font-bold outline-none focus:border-[#FF5500]"
                />
              </div>
            ))}
            {formError && <div className="text-red-500 text-[10px] sm:text-xs" role="alert">{formError}</div>}
          </div>
        </div>

        {/* Column 2: Result */}
        <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl flex flex-col shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
          <div className="p-3 sm:p-4 border-b border-[#1a1a1a]">
            <h2 className="text-[9px] sm:text-[10px] font-bold text-white tracking-[0.15em] uppercase">Prediction Result</h2>
          </div>
          <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1">
            {error && <div className="text-red-500 text-[10px] sm:text-xs" role="alert">{error}</div>}

            <div className="border border-[#1a1a1a] bg-black rounded-lg p-4 sm:p-4">
              <div className="text-[8px] sm:text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-1">Predicted Burn Time</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-wider">
                  {result ? result.predicted_burn_time_sec.toFixed(2) : '---'}
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-bold tracking-widest uppercase">sec</span>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-5 shrink-0 mt-auto">
            <div className="border border-yellow-900/50 bg-yellow-900/10 rounded-lg p-3 sm:p-4 text-[9px] sm:text-[10px] text-yellow-200">
              No safety category is inferred from this estimate.
            </div>
          </div>
        </div>

        {/* Column 3: Importance & Validation */}
        <div className="flex flex-col gap-4">
          <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl flex flex-col h-full min-h-[300px] lg:min-h-[400px] shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
            <div className="p-3 sm:p-4 border-b border-[#1a1a1a]">
                <h2 className="text-[9px] sm:text-[10px] font-bold text-white tracking-[0.15em] uppercase">Model Feature Importance</h2>
            </div>
            <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 justify-center">
              {result?.feature_importance ? (
                  Object.entries(result.feature_importance).length > 0 ? Object.entries(result.feature_importance)
                  .sort(([, a], [, b]) => b - a)
                  .map(([feature, weight]) => (
                  <div key={feature} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[8px] sm:text-[9px] text-gray-500 font-bold tracking-widest uppercase">
                      <span>{feature.replace(/_/g, ' ')}</span>
                      <span>{(weight * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-[#1a1a1a] rounded-full overflow-hidden w-full">
                        <div className="h-full bg-[#FF5500] transition-all duration-1000" style={{ width: `${weight * 100}%` }} />
                    </div>
                  </div>
                )) : (
                  <div className="text-[10px] sm:text-xs text-gray-600 font-bold tracking-widest uppercase text-center">
                    Feature importance is unavailable for this model.
                  </div>
                )
              ) : (
                <div className="text-[10px] sm:text-xs text-gray-600 font-bold tracking-widest uppercase text-center">
                  [RUN PREDICTION TO VIEW VALUES]
                </div>
              )}
              {result?.feature_importance && Object.keys(result.feature_importance).length > 0 && (
                <p className="text-[8px] sm:text-[9px] text-gray-600 text-center mt-2">
                  Global importance across the trained model, not specific to this prediction.
                </p>
              )}
            </div>
          </div>
          <div className="border border-[#1a1a1a] bg-[#050505] rounded-xl p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] lg:shadow-none">
            <h2 className="text-[9px] sm:text-[10px] font-bold text-white tracking-[0.15em] uppercase">Held-out Validation</h2>
            {validation ? (
              <>
                <p className="text-[8px] sm:text-[9px] text-gray-500">
                  {validation.validation_method}; {validation.samples} rows across {validation.held_out_days} days.
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[9px] sm:text-[10px]">
                  <div><span className="text-gray-500">MAE</span><div className="text-white">{validation.mae_sec.toFixed(1)} sec</div></div>
                  <div><span className="text-gray-500">RMSE</span><div className="text-white">{validation.rmse_sec.toFixed(1)} sec</div></div>
                  <div><span className="text-gray-500">R²</span><div className="text-white">{validation.r2.toFixed(3)}</div></div>
                  <div><span className="text-gray-500">Within ±10 sec</span><div className="text-white">{(validation.within_10_sec_fraction * 100).toFixed(1)}%</div></div>
                </div>
                <p className="text-[8px] sm:text-[9px] text-gray-500">
                  Mean-baseline MAE: {validation.mean_baseline_mae_sec.toFixed(1)} sec.
                  Training ranges: O₂ {validation.input_ranges.oxygen_concentration.minimum.toFixed(3)}–{validation.input_ranges.oxygen_concentration.maximum.toFixed(3)},
                  {' '}pressure {validation.input_ranges.chamber_pressure_bar.minimum.toFixed(2)}–{validation.input_ranges.chamber_pressure_bar.maximum.toFixed(2)} bar,
                  {' '}flow {validation.input_ranges.mass_flow_rate_mg_s.minimum.toFixed(3)}–{validation.input_ranges.mass_flow_rate_mg_s.maximum.toFixed(3)} mg/s.
                </p>
                <p className="text-[8px] sm:text-[9px] text-yellow-300 mt-1">
                  Validation is not an independent safety certification; errors are substantial.
                </p>
              </>
            ) : (
              <p className="text-[8px] sm:text-[9px] text-gray-500">
                {validationError || 'Loading grouped validation results...'}
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
