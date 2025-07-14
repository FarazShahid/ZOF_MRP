import React, { useState, useRef, useEffect, useMemo } from "react";
import Label from "./common/Label";
import { GetClientsType } from "@/store/useClientStore";

interface MultiCheckboxSelectProps {
  clinets: GetClientsType[];
  name: string;
  label?: string;
  isRequired?: boolean;
  value: { clientId: number;}[]; // controlled selected value
  onChange: (selectedIds: number[]) => void;
}

const ClientmodeDropdown: React.FC<MultiCheckboxSelectProps> = ({
  clinets,
  name,
  label = "select clients",
  isRequired = false,
  value,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle selection for a given option
  const toggleOption = (id: number) => {
    let newSelectedIds: number[];
    if (value.some((v) => v.clientId === id)) {
      newSelectedIds = value
        .filter((v) => v.clientId !== id)
        .map((v) => v.clientId);
    } else {
      newSelectedIds = [...value.map((v) => v.clientId), id];
    }
    onChange(newSelectedIds);
  };

  // Display selected options names joined by comma or placeholder
  const selectedLabels = useMemo(() => {
    if (value.length === 0) return "Select options...";
    const selectedTypes = clinets
      .filter((opt) => value.some((v) => v.clientId === opt.Id))
      .map((opt) => opt.Name);
    return selectedTypes.join(", ");
  }, [value, clinets]);

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <Label isRequired={isRequired} label={label} />
      <div
        className="rounded-xl dark:text-gray-400 text-black dark:border-gray-400 border-gray-100 text-sm p-2 w-full outline-none dark:bg-slate-800 bg-gray-100 border-1 min-h-[37px] cursor-pointer select-none"
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
        {selectedLabels}
      </div>

      {isOpen && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-10 w-full max-h-60 overflow-auto dark:bg-slate-900 bg-gray-100 border-1 border-gray-600 rounded-md mt-1 p-2 shadow-lg"
        >
          {clinets.map((option) => {
            const checked = value.some((v) => v.clientId === option.Id);
            return (
              <li
                key={option.Id}
                className="flex items-center gap-2 cursor-pointer py-1 px-2 hover:bg-gray-300 rounded"
                onClick={() => toggleOption(option.Id)}
                role="option"
                aria-selected={checked}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option.Id)}
                  onClick={(e) => e.stopPropagation()} // prevent li click toggling twice
                  className="cursor-pointer"
                  id={`${name}-option-${option.Id}`}
                />
                <label
                  htmlFor={`${name}-option-${option.Id}`}
                  className="cursor-pointer select-none dark:text-gray-500 text-gray-800 text-sm"
                >
                  {option.Name}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ClientmodeDropdown;
