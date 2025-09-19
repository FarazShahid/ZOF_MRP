import { create } from "zustand";

interface OrderItemSelectionState {
  selectionMode: boolean;
  selectedIds: Set<number>;
  enterSelectionWith: (id: number) => void;
  toggleOne: (id: number) => void;
  setAll: (ids: number[]) => void;
  clear: () => void;
  exit: () => void;
}

export const useOrderItemSelectionStore = create<OrderItemSelectionState>((set, get) => ({
  selectionMode: false,
  selectedIds: new Set(),

  enterSelectionWith: (id) =>
    set(() => ({ selectionMode: true, selectedIds: new Set([id]) })),

  toggleOne: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),

  setAll: (ids) => set(() => ({ selectedIds: new Set(ids) })),

  clear: () => set(() => ({ selectedIds: new Set() })),

  exit: () => set(() => ({ selectionMode: false, selectedIds: new Set() })),
}));
