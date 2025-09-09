import React from "react";
import { IoIosPrint } from "react-icons/io";
import { FaFileAlt, FaListUl } from "react-icons/fa";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

// Types
export type PdfVariant = "summary" | "specification";

interface DownloadPdfMenuProps {
  downloading: boolean;
  OrderById?: string | number | null;
  handleDownloadPdf: (variant: PdfVariant) => void;
}

/**
 * Uses HeroUI Dropdown instead of MenuHandler/MenuList.
 * A single button opens a dropdown menu with options (summary / specification).
 */
export default function DownloadPdfMenu({ downloading, OrderById, handleDownloadPdf }: DownloadPdfMenuProps) {
  const disabled = !OrderById || downloading;

  const onAction = (key: React.Key) => {
    if (disabled) return;
    handleDownloadPdf(key as PdfVariant);
  };

  return (
    <div className="flex items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button
            isDisabled={disabled}
            aria-disabled={disabled}
            className="px-3 py-1 flex items-center gap-2 bg-blue-800 dark:bg-blue-600 rounded-lg text-sm text-white disabled:opacity-50"
          >
            <IoIosPrint className="text-base" />
            {downloading ? "Preparing PDF…" : "Download PDF"}
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Choose PDF type" className="w-80" onAction={onAction}>
          <DropdownItem key="summary" textValue="Order Summary">
            <div className="flex items-start gap-3 py-1">
              <FaFileAlt className="mt-0.5" size={16} aria-hidden />
              <div className="flex flex-col">
                <span className="font-medium leading-5">Order Summary</span>
                <span className="text-xs text-gray-500 leading-5">A concise overview with order number, customer info.</span>
              </div>
            </div>
          </DropdownItem>

          <DropdownItem key="specification" textValue="Order Specification">
            <div className="flex items-start gap-3 py-1">
              <FaListUl className="mt-0.5" size={22} aria-hidden />
              <div className="flex flex-col">
                <span className="font-medium leading-5">Order Specification</span>
                <span className="text-xs text-gray-500 leading-5">A detailed document with product specs, variants, measurements, notes, and per-item breakdowns.</span>
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
