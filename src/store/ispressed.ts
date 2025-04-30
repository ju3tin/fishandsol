import { create } from 'zustand';

let walletAddress: string | null = null;






interface PressedStore {
  pressed: 0 | 1;
  setPressed: (value: 0 | 1) => void;
  setPressedToOne: () => void;
  setPressedToZero: () => void;
  togglePressed: () => void;
}

export const usePressedStore = create<PressedStore>((set, get) => ({
  pressed: 0,
  setPressed: (value) => set({ pressed: value }),
  setPressedToOne: () => set({ pressed: 1 }),
  setPressedToZero: () => set({ pressed: 0 }),
  togglePressed: () => set({ pressed: get().pressed === 0 ? 1 : 0 }),
}));