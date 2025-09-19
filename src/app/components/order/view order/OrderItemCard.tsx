import { FC, MouseEvent } from "react";
import { FaRegEye } from "react-icons/fa";
import { DOCUMENT_REFERENCE_TYPE } from "@/interface";
import RecentAttachmentsView from "../../RecentAttachmentsView";
import OrderItemStatusChip from "@/src/app/orders/components/OrderItemStatusChip";
import { OrderItem } from "@/src/app/interfaces/OrderStoreInterface";

export interface OrderItemDetail {
  SizeOptionId?: number;
  SizeOptionName?: string;
  Quantity?: number;
  MeasurementId?: number;
}

export interface PrintingOption {
  PrintingOptionId?: number;
  PrintingOptionName: string;
}

type Props = {
  item: OrderItem;
  selectionMode: boolean;
  selected: boolean;
  onToggle: (id: number) => void;
  onEnterSelection: (id: number) => void;
  onOpenViewModal: (measurementId: number, sizeName: string) => void;
};

const OrderItemCard: FC<Props> = ({
  item,
  selectionMode,
  selected,
  onToggle,
  onEnterSelection,
  onOpenViewModal,
}) => {
  const id = item.Id;

  const handleCardClick = () => {
    if (!selectionMode) onEnterSelection(id);
    else onToggle(id);
  };

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      className={[
        "relative cursor-pointer select-none",
        "dark:bg-[#161616] bg-gray-100 hover:shadow-md transition-all duration-200 rounded-2xl",
        "border-1 dark:border-slate-700 border-slate-300 p-4 flex flex-col gap-2 shadow-lg dark:text-foreground text-gray-700",
        selected ? "ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-200" : "",
      ].join(" ")}
    >
      {/* Checkbox overlay when in selection mode */}
      {selectionMode && (
        <div className="absolute left-3 top-4" onClick={stop}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(id)}
            className="h-4 w-4 accent-black"
            aria-label="Select order item"
          />
        </div>
      )}

      <div className="flex items-start justify-between pl-4">
        <span className="text-sm font-mono text-foreground font-bold">
          {item.ProductName}
        </span>
        <div onClick={stop}>
          <OrderItemStatusChip status={item.ItemShipmentStatus || ""} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">Fabric:</span>
        <span>
          {item?.ProductFabricName}_{item?.ProductFabricGSM}
        </span>
      </div>

      {!!item?.printingOptions?.length && (
        <div className="flex text-sm" onClick={stop}>
          <span>Printing:</span>
          <div className="flex flex-wrap gap-1 pl-1">
            {item.printingOptions.map((po, idx) => (
              <span
                key={po.PrintingOptionId ?? idx}
                className="rounded-xl px-2 text-xs bg-gray-200 flex items-center justify-center"
              >
                {po.PrintingOptionName}
              </span>
            ))}
          </div>
        </div>
      )}

      <div onClick={stop}>
        <table className="w-full">
          <thead>
            <tr>
              <th className="border-2 text-xs text-center">Size</th>
              <th className="border-2 text-xs text-center">Qunatity</th>
              <th className="border-2 text-xs text-center">Measurement</th>
            </tr>
          </thead>
          <tbody>
            {item?.orderItemDetails?.map((d, i) => (
              <tr key={i}>
                <td className="border-2 text-xs text-center">
                  {d.SizeOptionId && <>{d?.SizeOptionName}</>}
                </td>
                <td className="border-2 text-xs text-center">{d?.Quantity}</td>
                <td className="border-2 text-xs text-center">
                  {d.SizeOptionId && d.MeasurementId && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenViewModal(
                          d.MeasurementId!,
                          d.SizeOptionName || ""
                        );
                      }}
                      className="w-fit mx-auto block"
                      aria-label="View measurement"
                    >
                      <FaRegEye />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div onClick={stop}>
        <RecentAttachmentsView
          referenceId={item.ProductId}
          referenceType={DOCUMENT_REFERENCE_TYPE.PRODUCT}
        />
      </div>
    </div>
  );
};

export default OrderItemCard;
