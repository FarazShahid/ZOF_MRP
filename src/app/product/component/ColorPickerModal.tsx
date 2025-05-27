"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  filterBtns,
  PantoneColor,
} from "../../setting/coloroptions/PantoneColorPicker";
import rawPantoneColors from "../../../../lib/pantone-colors.json";
import { useColorPickerStore } from "@/store/useColorPickerStore";

interface ComponentProps {
  isOpen: boolean;
  closeAddModal: () => void;
  onSaveColors: (colors: { name: string; hex: string }[]) => void;
}

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

const ColorPickerModal: React.FC<ComponentProps> = ({
  isOpen,
  closeAddModal,
}) => {
  const {
    selectedColors,
    toggleSelectedColor,
    resetSelectedColors,
  } = useColorPickerStore();
  const [search, setSearch] = useState("");
  const [selectedBtnId, setSelectedBtnId] = useState(1);

  const filteredColors = useMemo(() => {
    const s = search.toLowerCase();
    return pantoneColors.filter(
      (c) => c.name.toLowerCase().includes(s) || c.hex.toLowerCase().includes(s)
    );
  }, [search]);

  const handleToggleSelect = (color: PantoneColor) => {
    toggleSelectedColor(color);
  };

  const handleAddColors = () => {
    closeAddModal();
  };

  const handleSelectFilter = (id: number, name: string) => {
    const colorName = name === "All Shades" ? "" : name;

    setSelectedBtnId(id);
    setSearch(colorName);
  };

  useEffect(() => {
    if (isOpen) {
      resetSelectedColors();
      setSelectedBtnId(1);
      setSearch("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} size="4xl" onOpenChange={closeAddModal}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Choose a Color
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4 ">
                <div className="w-full lg:max-w-[992px] mb-[50px] px-5">
                  <ul className="flex flex-wrap items-center justify-center">
                    {filterBtns.map((btn, index) => {
                      return (
                        <li className="m-1" key={index}>
                          <button
                            type="button"
                            className={`color-tag ${
                              btn.id === selectedBtnId ? "tagIsActive" : ""
                            }`}
                            onClick={() => handleSelectFilter(btn.id, btn.name)}
                          >
                            {btn.name !== "All Shades" ? (
                              <div style={{ backgroundColor: btn.color }} />
                            ) : (
                              <></>
                            )}

                            <span>{btn.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedColors?.map((items, index) => {
                    return (
                      <div className="flex items-center gap-4" key={index}>
                        <div
                          className="w-10 h-10 rounded border shadow-inner"
                          style={{ backgroundColor: items.hex }}
                        />
                        <div className="text-sm text-gray-500">
                          <strong>{items.name}</strong> ({items.code}) —{" "}
                          <span>{items.hex.toUpperCase()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid card-grid popupColorGrid h-80 overflow-x-auto">
                  {filteredColors?.map((color) => (
                    <button
                      type="button"
                      className={`color-card `}
                      key={color.code}
                      onClick={() => handleToggleSelect(color)}
                    >
                      <div
                        className="color-card_color"
                        style={{ backgroundColor: color?.hex }}
                      >
                        <span className="font-xs">{color?.code}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-xs">
                          {color?.name} ({color?.code})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={closeAddModal}>
                Cancel
              </Button>
              <Button color="success" onPress={handleAddColors}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ColorPickerModal;
