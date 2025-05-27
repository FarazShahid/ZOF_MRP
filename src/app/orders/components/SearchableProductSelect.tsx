import React, { useState, useMemo, useRef, useEffect } from "react";

export interface Product {
  Id: number;
  ProductCategoryName: string;
  FabricType: string;
  FabricName: string;
  GSM?: number | null;
}

interface SearchableProductSelectProps {
  products: Product[];
  onSelect: (selected: { Id: number; productName: string }) => void;
  placeholder?: string;
}

const formatProductName = (p: Product) => {
  const parts = [
    p.ProductCategoryName,
    p.FabricType,
    p.FabricName,
    p.GSM ? p.GSM.toString() : null,
  ].filter(Boolean);
  return parts.join("_");
};

const SearchableProductSelect: React.FC<SearchableProductSelectProps> = ({
  products,
  onSelect,
  placeholder = "Search product...",
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;

    const lowerQuery = query.toLowerCase();

    return products.filter((p) => {
      return (
        p.ProductCategoryName.toLowerCase().includes(lowerQuery) ||
        p.FabricType.toLowerCase().includes(lowerQuery) ||
        p.FabricName.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query, products]);

  const handleSelect = (product: Product) => {
    const productName = formatProductName(product);
    onSelect({ Id: product.Id, productName });
    setIsOpen(false);
    setQuery(productName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const clearInput = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 < filteredProducts.length ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : filteredProducts.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredProducts[highlightedIndex]) {
        handleSelect(filteredProducts[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[400px]"
      tabIndex={-1}
      aria-haspopup="listbox"
      aria-owns="product-listbox"
      aria-expanded={isOpen}
    >
      <div className="relative">
        {/* Clear button on the left */}
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-100  focus:outline-none"
            aria-label="Clear search"
          >
            &#10005;
          </button>
        )}

        {/* Search input */}
        <input
          type="text"
          className={`w-full p-2 pl-8 pr-8 border-1 border-gray-600 rounded-lg ${
            query ? "pl-10" : "pl-2"
          }`}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-controls="product-listbox"
          aria-activedescendant={
            isOpen ? `product-option-${highlightedIndex}` : undefined
          }
        />

        {/* Search icon on the right */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown list */}
      {isOpen && filteredProducts.length > 0 && (
        <ul
          id="product-listbox"
          role="listbox"
          className="absolute z-10 w-full max-h-60 overflow-auto border border-gray-300  rounded-md mt-1 shadow-lg"
        >
          {filteredProducts.map((product, idx) => {
            const productName = formatProductName(product);
            const isHighlighted = idx === highlightedIndex;

            return (
              <li
                key={product.Id}
                id={`product-option-${idx}`}
                role="option"
                aria-selected={isHighlighted}
                className={`cursor-pointer px-4 text-white py-2 ${
                  isHighlighted ? "bg-[#56688f]" : "bg-gray-950"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(product);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {productName}
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && filteredProducts.length === 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 p-2 text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
};

export default SearchableProductSelect;
