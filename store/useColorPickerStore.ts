import { create } from 'zustand';
import { PantoneColor } from '@/src/app/setting/coloroptions/PantoneColorPicker';

interface ColorPickerStore {
  selectedColors: PantoneColor[];
  setSelectedColors: (colors: PantoneColor[]) => void;
  toggleSelectedColor: (color: PantoneColor) => void;
  resetSelectedColors: () => void;
}

export const useColorPickerStore = create<ColorPickerStore>((set, get) => ({
  selectedColors: [],
  setSelectedColors: (colors) => set({ selectedColors: colors }),
  toggleSelectedColor: (color) => {
    const existing = get().selectedColors;
    const isAlreadySelected = existing.find((c) => c.code === color.code);
    const updatedColors = isAlreadySelected
      ? existing.filter((c) => c.code !== color.code)
      : [...existing, color];
    set({ selectedColors: updatedColors });
  },
  resetSelectedColors: () => set({ selectedColors: [] }),
}));
