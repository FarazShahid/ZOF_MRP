import { create } from 'zustand';

interface UIState {
  selectedItem: number;
  setSelectedItem: (id: number) => void;
}

const useUIStore = create<UIState>((set) => ({
  selectedItem: 1, // default to first item
  setSelectedItem: (id: number) => set({ selectedItem: id }),
}));

export default useUIStore;
