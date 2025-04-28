"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { IoChevronBackOutline } from "react-icons/io5";
import useColorOptionsStore from "@/store/useColorOptionsStore";
import rawPantoneColors from "../../../../lib/pantone-colors.json";

export type PantoneColor = {
  code: string;
  name: string;
  hex: string;
  h: number;
  s: number;
  l: number;
};

const filterBtns = [
  {id: 1, name: "All Shades", color: ""},
  {id: 2, name: "Red", color: "#ff2929"},
  {id: 3, name: "Orange", color: "#ff7a29"},
  {id: 4, name: "Brown", color: "#bf7f35"},
  {id: 5, name: "Yellow", color: "#fad02e"},
  {id: 6, name: "Green", color: "#91fa49"},
  {id: 7, name: "Turquoise", color: "#36d8b7"},
  {id: 8, name: "Blue", color: "#3b8aff"},
  {id: 9, name: "Violet", color: "#991ef9"},
  {id: 10, name: "Pink", color: "#ff5dcd"},
  {id: 11, name: "White", color: "#FFFFFF"},
  {id: 12, name: "Gray", color: "#b3bac1"},
  {id: 13, name: "Black", color: "#000000"},
]

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
  const [selectedBtnId, setSelectedBtnId] = useState(1);
  const [selectedBtnName, setSelectedBtnName] = useState("");


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

  const handleSelectFilter = (id: number, name: string) =>{
    const colorName = name === "All Shades" ? "" : name;

    setSelectedBtnId(id);
    setSelectedBtnName(name);
    setSearch(colorName);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Link href="/setting/coloroptions" className="flex items-center gap-1 text-lg font-semibold">
          <IoChevronBackOutline size={20} />  Back
        </Link>
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
        <Button color="primary" type="submit" onPress={handleAddColor}>
        + Add Color
        </Button>
      </div>
      <div className="w-full lg:max-w-[992px] mb-[50px] px-5">
        <ul className="flex flex-wrap items-center justify-center">
          {
            filterBtns.map((btn)=>{
              return(
              <li className="m-1" key={btn.id}>
                <button className={`color-tag ${btn.id === selectedBtnId ? "tagIsActive":""}`} onClick={() => handleSelectFilter(btn.id, btn.name)}>
                  {
                    btn.name !== "All Shades" ? <div  style={{ backgroundColor: btn.color }} /> :<></>
                  }
                  
                  <span>{btn.name}</span>
                </button>
              </li>
              )
            })
          }
        </ul>
      </div>
      <div className="grid card-grid card-grid--350">
        {filteredColors?.map((color) => (
          <button type="button" className="color-card" key={color.code}  onClick={() => handleSelect(color)}>
            <div className="color-card_color" style={{ backgroundColor: color?.hex }}>
              <span>{color?.code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sm">{color?.name} ({color?.code})</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
