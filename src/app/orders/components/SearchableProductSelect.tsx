import React, { useState, useMemo, useRef, useEffect } from "react";

export interface Product {
  Id: number;
  Name: string;
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
        p.Name.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query, products]);

  const handleSelect = (product: Product) => {
    onSelect({ Id: product.Id, productName: product.Name });
    setIsOpen(false);
    setQuery(product.Name);
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
      className="relative w-full max-w-md"
      tabIndex={-1}
      aria-haspopup="listbox"
      aria-owns="product-listbox"
      aria-expanded={isOpen}
    >
      <div className="relative">
        {query && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Clear search"
          >
            &#10005;
          </button>
        )}

        <input
          type="text"
          className="w-full bg-slate-800 text-white text-sm px-4 py-3 pl-10 pr-10 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
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

        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
          <i className="ri-search-line w-4 h-4 flex items-center justify-center" />
        </div>
      </div>

      {isOpen && filteredProducts.length > 0 && (
        <ul
          id="product-listbox"
          role="listbox"
          className="absolute z-10 w-full max-h-60 overflow-auto bg-slate-800 border border-slate-700 rounded-lg mt-1 shadow-lg"
        >
          {filteredProducts.map((product, idx) => {
            const isHighlighted = idx === highlightedIndex;

            return (
              <li
                key={product.Id}
                id={`product-option-${idx}`}
                role="option"
                aria-selected={isHighlighted}
                className={`cursor-pointer px-4 text-white py-2.5 text-sm ${
                  isHighlighted ? "bg-slate-700" : "hover:bg-slate-700/50"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(product);
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
                {product.Name}
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && filteredProducts.length === 0 && (
        <div className="absolute z-10 w-full bg-slate-800 border border-slate-700 rounded-lg mt-1 p-3 text-slate-400 text-sm">
          No products found.
        </div>
      )}
    </div>
  );
};

export default SearchableProductSelect;
