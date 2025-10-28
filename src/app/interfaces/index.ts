import { Product } from "../services/useFetchProducts";

export interface Client {
  Id: string;
  Name: string;
}

export const loginInitialValues = {
  email: "",
  password: "",
  remember_me: true,
};

export function formatDate(inputDate: string) {
  const date = new Date(inputDate);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export const OrderTableHeader = [
  "Order Id",
  "Order Type",
  "Status",
  "Dead Line",
  "Discription",
  "Action",
];

// add order interface

export interface OrderFormValues {
  ClientId: number;
  OrderEventId: number;
  Description: string;
  OrderStatusId: number;
  Deadline: string;
  items: {
    ProductId: number;
    Description: string;
    ImageId?: number;
    FileId?: number;
    VideoId?: number;

    printingOptions: {
      PrintingOptionId: number;
      Description: string;
    }[];
  }[];
}

export const createOrderPayload = (values: OrderFormValues) => {
  return {
    ClientId: values.ClientId,
    OrderEventId: values.OrderEventId,
    Description: values.Description,
    OrderStatusId: values.OrderStatusId,
    Deadline: values.Deadline,
    items: values.items.map((item) => ({
      ProductId: item.ProductId,
      Description: item.Description,
      ImageId: item.ImageId,
      FileId: item.FileId,
      VideoId: item.VideoId,
      printingOptions: item.printingOptions.map((option) => ({
        PrintingOptionId: option.PrintingOptionId,
        Description: option.Description,
      })),
    })),
  };
};

export interface AvailableColor {
  Id: number;
  ColorName: string;
}

export interface OrderProductFormProps {
  index: number;
  remove: (index: number) => void;
}

export const formatedProductName = (
  FabricTypeName?: string,
  FabricName?: string,
  FabricGSM?: number,
  ProductCategoryName?: string,
  ProductCutOptionName?: string,
  ProductSizeOptionName?: string,
): string => {
  const parts = [
    ProductCutOptionName,
    ProductCategoryName,
    FabricTypeName,
    FabricName,
    FabricGSM?.toString(),
    ProductSizeOptionName,
  ].filter((part) => part);

  return parts.join("_");
};



export interface OrderItem {
  itemId: number;
  quantity: number;
}

export interface Order {
  Id: number;
  ClientId: string;
  ClientName: string;
  Deadline: string;
  Description: string;
  EventName: string;
  ExternalOrderId: string;
  OrderEventId: number;
  OrderName: string;
  OrderNumber: string;
  OrderPriority: number;
  OrderStatusId: number;
  StatusName: string;
  items: OrderItem[];
}

export interface OrderItem {
  Id: number;
  ProductId: number;
  Description: string;
  OrderItemPriority: number;
  ColorOptionId: number | null;
  ImageId: number;
  FileId: number;
  VideoId: number;
}



export function  generateOrderIdentifier(
  username?: string | null,
  eventName?: string | null,
  orderId?: number | null
): string {
  const userInitials = username
    ?.split(' ')
    .map(namePart => namePart.charAt(0).toUpperCase())
    .join('');

  const eventInitials = eventName
    ?.split(' ')
    .map(namePart => namePart.charAt(0).toUpperCase())
    .join('');

  const parts = [
    userInitials, 
    eventInitials, 
    orderId !== null && orderId !== undefined ? orderId.toString() : null
  ].filter(Boolean); // Filters out null, undefined, or empty values

  return parts.join('_');
}


export const statusPriority: Record<Order["StatusName"], number> = {
  Pending: 1,
  Completed: 2,
  Cancelled: 3,
};

export type SortConfig = {
  key: keyof Order | null;
  direction: "asc" | "desc";
};

export interface OrderItemType {
  ProductId: number;
  Description: string;
  OrderItemPriority: number;
  // ColorOptionId: number;
  // OrderItemQuantity: number;
  Name:string;
  ProductCategoryName: string;
  ProductFabricName: string;
  ProductFabricType: string;
  ProductFabricGSM: number;
  ImageId: number;
  FileId: number;
  VideoId: number;
  orderItemDetails:{
    ColorOptionId: number;
    Quantity: number;
    Priority: number;
  }[]
  printingOptions: {
    PrintingOptionId: number;
    Description: string;
  }[];
}

export interface AddOrderComponentProps {
  isOpen: boolean;
  clientId: number | undefined;
  isEditOrder: boolean;
  refreshKey: number;
  orderId: number;
  onClose: () => void;
  onOrderAdded: () => void;
}


export const getProductNameById = (
  products: Product[] | null,
  id: number
): string | null => {
  const product = products?.find((product) => product.Id === id);
  return product ? product.Name : null;
};

export const DOC_TYPE_ENUM = {
  ORDER_DOCTYPE_ID: 1,
  PRODUCT_DOCTYPE_ID: 2,
}