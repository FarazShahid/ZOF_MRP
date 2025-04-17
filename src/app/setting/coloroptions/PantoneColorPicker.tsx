'use client';

import { useEffect, useState } from 'react';
import rawPantoneColors from '../../../../lib/pantone-colors.json';

export type PantoneColor = {
  code: string;
  name: string;
  hex: string;
};


const pantoneColors: PantoneColor[] = Object.entries(
  rawPantoneColors as Record<string, { name: string; hex: string }>
).map(([code, value]) => ({
  code,
  name: value.name,
  hex: `#${value.hex}`,
}));

export default function PantoneColorDropdown({
  onChange,
  initialHexCode,
}: {
  onChange?: (color: PantoneColor) => void;
  initialHexCode?: string;
}) {
  const [selectedColor, setSelectedColor] = useState<PantoneColor>(pantoneColors[0]);

 useEffect(() => {
    if (initialHexCode) {
      const matched = pantoneColors.find(
        (color) => color.hex.toLowerCase() === initialHexCode.toLowerCase()
      );
      if (matched) {
        setSelectedColor(matched);
        onChange?.(matched);
      }
    }
  }, [initialHexCode]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = pantoneColors.find((c) => c.code === e.target.value);
    if (selected) {
      setSelectedColor(selected);
      onChange?.(selected);
    }
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <select
        className="formInputdefault border-2 w-full"
        value={selectedColor.code}
        onChange={handleChange}
      >
        {pantoneColors.map((color) => (
          <option key={color.code} value={color.code}>
            {color.name}
          </option>
        ))}
      </select>

      <div
        className="w-16 h-16 rounded-md border shadow-inner"
        style={{ backgroundColor: selectedColor.hex }}
        title={`${selectedColor.name} - ${selectedColor.hex}`}
      />
    </div>
  );
}
