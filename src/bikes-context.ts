import { createContext } from '@lit/context';
import { AvailableBike } from './types.js';

export const bikesContext = createContext<Record<string, AvailableBike[]>>(
  Symbol('bikes'),
);
