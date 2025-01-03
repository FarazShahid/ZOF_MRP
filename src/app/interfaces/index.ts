export interface Client{
    Id: string;
    Name: string;
}

export const loginInitialValues = {
    email: "",
    password: "",
}


export function formatDate(inputDate: string) {
    const date = new Date(inputDate);
  
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${month}/${day}/${year}`;
  }

export const OrderTableHeader = [
    'Order Id',
    'Order Type',
    'Status',
    'Dead Line',
    'Discription',
    'Action'
]


// add order interface

export interface OrderFormValues {
    ClientId: number;
    OrderEventId: number;
    Description: string;
    OrderStatusId: number;
    Deadline: string;
    items:{
        ProductId: number;
        Description: string;
        ImageId?: number;
        FileId?: number;
        VideoId?: number;

        printingOptions:{
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
  