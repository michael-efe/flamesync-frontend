import { useState, type ReactNode } from 'react';
import { CompareContext } from './compareContextValue';
import { MAX_COMPARISON_ITEMS, type Investigation } from '../types/index';

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedInvestigations, setSelectedInvestigations] = useState<Investigation[]>([]);

  const toggleInvestigation = (investigation: Investigation) => {
    setSelectedInvestigations((prev) => {
      const isSelected = prev.some((inv) => inv.id === investigation.id);
      if (isSelected) {
        return prev.filter((inv) => inv.id !== investigation.id);
      } else {
        if (prev.length >= MAX_COMPARISON_ITEMS) return prev;
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
