export interface GetOrdersType {
  Id: number;
  OrderName: string;
  OrderNumber: string;
  ExternalOrderId: string;
  Description: string;
  OrderEventId: number;
  ClientId: number;
  OrderStatusId: number;
  OrderPriority: number;
  Deadline: string;
  EventName: string;
  ClientName: string;
  StatusName: string;
}

export interface GetOrderByClientResponse {
  data: GetOrdersType[];
}

export interface orderItemDetailsType {
  ColorOptionId: number;
  Quantity: number;
  Priority: number;
}

export interface GetOrderByIdType {
  ClientId: number;
  OrderEventId: number;
  OrderPriority: number;
  Description: string;
  OrderNumber: string;
  OrderName: string;
  ExternalOrderId: string;
  OrderStatusId: number;
  Deadline: string;
  EventName: string;
  ClientName: string;
  StatusName: string;
  items: {
    Id: number;
    ProductId: number;
    ProductName: string;
    Description: string;
    OrderNumber: string;
    OrderName: string;
    ExternalOrderId: string;
    OrderItemPriority: number;
    ImageId: number;
    FileId: number;
    VideoId: number;
    printingOptions: {
      PrintingOptionId: number;
      PrintingOptionName: string;
      Description: string;
    }[];
    orderItemDetails: {
      ColorOptionName: string;
      ColorOptionId: number;
      Quantity: number;
      Priority: number;
    }[];
  }[];
}

export interface AddOrderType {
  ClientId: number;
  OrderEventId: number;
  Description: string;
  OrderStatusId: number;
  Deadline: string;
  OrderNumber: string;
  OrderName: string;
  ExternalOrderId: number;
  OrderPriority: number;
  items: {
    ProductId: number;
    Description: string;
    OrderItemPriority: number;
    ImageId: number;
    FileId: number;
    VideoId: number;
    orderItemDetails: orderItemDetailsType[];
    printingOptions: {
      PrintingOptionId: number;
      Description: string;
    }[];
  }[];
}

export interface AvailableColorOptions {
  Id: number;
  ColorName: string;
  HexCode: string;
}
export interface ColorsByProductResponse {
  data: AvailableColorOptions[];
}

export interface Event {
  Id: number;
  EventName: string;
  Description: string;
}
export interface GetClinetReponse {
  data: Event[];
}

export interface OderStatus {
    Id: number;
    StatusName: string;
}
export interface OderStatusResponse {
    data: OderStatus[];
}