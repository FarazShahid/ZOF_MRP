import React, { useEffect, useRef, useState } from "react";
import { FiFilter } from "react-icons/fi";
import ColorWheel from "../../../../../public/color-wheel.png";
import Image from "next/image";
import { label } from "framer-motion/client";

interface ButtonProp {
  onClick: (color: string) => void;
}

const ColorFilter: React.FC<ButtonProp> = ({ onClick }) => {
  const filterRef = useRef<HTMLDivElement>(null);
  const [showFilter, setShowFilter] = useState(false);

  const COLORS = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffc107",
  ];

  const COLORS_LIST = [
    { id: 1, name: "Green", HexaCode: "#008000" },
    { id: 2, name: "Blue", HexaCode: "#0000ff" },
    { id: 3, name: "shell-pink", HexaCode: "#f88180" },
    { id: 4, name: "marsala", HexaCode: "#6a2e2a" },
    { id: 5, name: "fired-brick", HexaCode: "#6a2e2a" },
    { id: 6, name: "marshmallow", HexaCode: "#f0eee4" },
    { id: 7, name: "chili-oil", HexaCode: "#8e3c36" },
    { id: 11, name: "birch", HexaCode: "#ddd5c7" },
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="p-2 rounded-md w-20"
      >
        <Image src={ColorWheel} alt="color" />
      </button>

      {showFilter && (
        <div className="absolute z-50 mt-2 left-0 w-72 bg-white dark:bg-gray-800 border border-gray-300 rounded-xl shadow-xl p-4 space-y-4">
          <div className="grid grid-cols-6 gap-2">
            {COLORS_LIST.map((color) => (
              <button
                key={color.id}
                onClick={() => onClick(color.HexaCode)}
                className="w-8 h-8 rounded-full border-2 border-gray-25"
                style={{ backgroundColor: color.HexaCode }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorFilter;
