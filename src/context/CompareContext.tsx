import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Investigation } from '../types/index';

interface CompareContextType {
  selectedInvestigations: Investigation[];
  toggleInvestigation: (investigation: Investigation) => void;
  clearSelection: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedInvestigations, setSelectedInvestigations] = useState<Investigation[]>([]);

  const toggleInvestigation = (investigation: Investigation) => {
    setSelectedInvestigations((prev) => {
      const isSelected = prev.some((inv) => inv.investigation_id === investigation.investigation_id);
      if (isSelected) {
        // Remove if already selected
        return prev.filter((inv) => inv.investigation_id !== investigation.investigation_id);
      } else {
        // Add if not selected (limit to 4 for UI purposes)
        if (prev.length >= 4) return prev;
        return [...prev, investigation];
      }
    });
  };

  const clearSelection = () => {
    setSelectedInvestigations([]);
  };

  return (
    <CompareContext.Provider value={{ selectedInvestigations, toggleInvestigation, clearSelection }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
