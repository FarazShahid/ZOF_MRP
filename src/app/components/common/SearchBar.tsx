import React from "react";
import { Input } from "@heroui/react";
import { CiSearch } from "react-icons/ci";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Type to search...",
}) => {
  return (
    <Input
      classNames={{
        base: "max-w-full sm:max-w-[10rem] h-10",
        mainWrapper: "h-full",
        input: "text-small",
        inputWrapper:
          "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
      }}
      placeholder={placeholder}
      size="sm"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      startContent={<CiSearch size={18} />}
    />
  );
};

export default SearchBar;
