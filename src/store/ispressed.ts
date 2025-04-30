import { create } from 'zustand';

interface WalletStore {
    pressed: 0 | 1;
    setPressed: (pressed: 0 | 1) => void;
    setPressedToOne: () => void;
    setPressedToZero: () => void;
    togglePressed: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
    pressed: 0,
    setPressed: (pressed) => set({ pressed }),
    setPressedToOne: () => set({ pressed: 1 }), // Correct
    setPressedToZero: () => set({ pressed: 0 }),
    togglePressed: () => set({ pressed: get().pressed === 0 ? 1 : 0 }),
}));