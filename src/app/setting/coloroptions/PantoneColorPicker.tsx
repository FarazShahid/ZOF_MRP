"use client";

import { useEffect, useMemo, useState } from "react";
import rawPantoneColors from "../../../../lib/pantone-colors.json";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import useColorOptionsStore, { AddColorOption } from "@/store/useColorOptionsStore";

export type PantoneColor = {
  code: string;
  name: string;
  hex: string;
  h: number;
  s: number;
  l: number;
};

// Convert HEX to HSL
function hexToHSL(hex: string): [number, number, number] {
  hex = hex.replace("#", "");
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Prepare and sort the pantone colors
const pantoneColors: PantoneColor[] = Object.entries(
  rawPantoneColors as Record<string, { name: string; hex: string }>
)
  .map(([code, value]) => {
    const hex = `#${value.hex}`;
    const [h, s, l] = hexToHSL(value.hex);
    return {
      code,
      name: value.name,
      hex,
      h,
      s,
      l,
    };
  })
  .sort((a, b) => {
    if (a.h !== b.h) return a.h - b.h;
    if (a.s !== b.s) return b.s - a.s;
    return b.l - a.l;
  });

export default function PantoneColorDropdown({
  onChange,
  initialHexCode,
}: {
  onChange?: (color: PantoneColor) => void;
  initialHexCode?: string;
}) {
  const [selectedColor, setSelectedColor] = useState<PantoneColor>(
    pantoneColors[0]
  );
  const [search, setSearch] = useState("");


  const {addColorOption} = useColorOptionsStore();
  const router = useRouter();

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

  const filteredColors = useMemo(() => {
    const s = search.toLowerCase();
    return pantoneColors.filter(
      (c) => c.name.toLowerCase().includes(s) || c.hex.toLowerCase().includes(s)
    );
  }, [search]);

  const handleSelect = (color: PantoneColor) => {
    setSelectedColor(color);
    onChange?.(color);
  };


  const onCloseModal = () => {
    router.push("/setting/coloroptions");
  }

    const handleAddColor = async () => {
      const values = {
        HexCode: selectedColor?.hex || "",
        Name: selectedColor?.name || "",
      };

        addColorOption(values, () => {
              onCloseModal();
            });
      };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded border shadow-inner"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <strong>{selectedColor.name}</strong> ({selectedColor.code}) —{" "}
            <span>{selectedColor.hex.toUpperCase()}</span>
          </div>
        </div>
        <Input
          type="text"
          placeholder="Search color by name or hex..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-2/4"
        />
        <div className="flex items-center gap-3">
          <Button color="danger" variant="flat" onPress={onCloseModal}>
            Cancel
          </Button>
          <Button color="primary" type="submit" onPress={handleAddColor}>
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredColors.map((color) => (
          <button
            key={color.code}
            type="button"
            className="w-24 h-24 border transition-all duration-150 hover:ring-1 hover:ring-slate-600 hover:scale-125 text-xs flex justify-end"
            style={{
              backgroundColor: color.hex,
              // clipPath:
              //   'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              // shapeOutside:
              //   'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            }}
            onClick={() => handleSelect(color)}
            title={`${color.name} (${color.hex})`}
          >
            {color.hex}
          </button>
        ))}
      </div>
    </div>
  );
}
