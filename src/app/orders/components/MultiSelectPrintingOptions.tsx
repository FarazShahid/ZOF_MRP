import React, { useState, useRef, useEffect, useMemo } from "react";
import Label from "../../components/common/Label";

export interface PrintingOptionType {
  Id: number;
  Type: string;
  CreatedOn: string;
  CreatedBy: string;
  UpdatedOn: string;
  UpdatedBy: string;
}

interface MultiCheckboxSelectProps {
  printingOptions: PrintingOptionType[];
  name: string;
  label?: string;
  isRequired?: boolean;
  value: { PrintingOptionId: number; Description: string }[]; // controlled selected value
  onChange: (selectedIds: number[]) => void;
}

const MultiCheckboxSelect: React.FC<MultiCheckboxSelectProps> = ({
  printingOptions,
  name,
  label = "Available Printing Options",
  isRequired = false,
  value,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle selection for a given option
  const toggleOption = (id: number) => {
  let newSelectedIds: number[];
  if (value.some((v) => v.PrintingOptionId === id)) {
    newSelectedIds = value.filter((v) => v.PrintingOptionId !== id).map(v => v.PrintingOptionId);
  } else {
    newSelectedIds = [...value.map(v => v.PrintingOptionId), id];
  }
  onChange(newSelectedIds);
};

  // Display selected options names joined by comma or placeholder
  const selectedLabels = useMemo(() => {
    if (value.length === 0) return "Select options...";
    const selectedTypes = printingOptions
      .filter((opt) => value.some((v) => v.PrintingOptionId === opt.Id))
      .map((opt) => opt.Type);
    return selectedTypes.join(", ");
  }, [value, printingOptions]);

  return (
    <div className="relative w-full flex flex-col gap-2" ref={containerRef}>
      <Label isRequired={isRequired} label={label} />
      <div
        className="w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 min-h-[44px] cursor-pointer select-none flex items-center"
        onClick={() => setIsOpen((o) => !o)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((o) => !o);
          }
          if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
      >
        <span className={selectedLabels === "Select options..." ? "text-slate-500" : ""}>
          {selectedLabels}
        </span>
      </div>

      {isOpen && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-10 w-full max-h-60 overflow-auto bg-slate-800 border border-slate-700 rounded-lg mt-1 p-2 shadow-lg"
        >
          {printingOptions.map((option) => {
            const checked = value.some((v) => v.PrintingOptionId === option.Id);
            return (
              <li
                key={option.Id}
                className="flex items-center gap-2 cursor-pointer py-2 px-3 hover:bg-slate-700 rounded-lg text-white text-sm"
                onClick={() => toggleOption(option.Id)}
                role="option"
                aria-selected={checked}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option.Id)}
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer rounded border-slate-600 bg-slate-900"
                  id={`${name}-option-${option.Id}`}
                />
                <label htmlFor={`${name}-option-${option.Id}`} className="cursor-pointer select-none text-white">
                  {option.Type}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiCheckboxSelect;
