import { createContext } from 'react';
import type { Investigation } from '../types/index';

interface CompareContextType {
  selectedInvestigations: Investigation[];
  toggleInvestigation: (investigation: Investigation) => void;
  clearSelection: () => void;
}

export const CompareContext = createContext<CompareContextType | undefined>(undefined);
