export interface Investigation {
  investigation_id: string;
  investigation_name: string;
  project: string;
  safety_domain: string;
  fuel_type: string;
  oxygen_concentration_pct: number;
  flow_velocity_cm_s?: number;
  hardware?: string;
}

export const MAX_COMPARISON_ITEMS = 4;

export interface PredictionPayload {
  fuel_type: string;
  oxygen_concentration_pct: number;
  flow_velocity_cm_s: number;
  hardware: string;
  thickness_mm: number;
  width_cm: number;
  burning_sides: number;
}

export interface PredictionResponse {
  predicted_spread_rate_mm_s: number;
  lower_bound_95: number;
  upper_bound_95: number;
  physics_consistency: {
    is_valid: boolean;
    violations: string[];
  };
}

export interface RankingPayload {
  mission_scenario: string;
  constraints: string;
}

export interface RankedItem {
  investigation_id: string;
  relevance_score: number;
  reasoning: string;
}
