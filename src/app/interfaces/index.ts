export interface Client{
    Id: string;
    Name: string;
}

export const loginInitialValues = {
    email: "",
    password: "",
}

export const OrderTableHeader = [
    'Order Id',
    'Order Type',
    'Status',
    'Dead Line',
    'Discription',
    'Action'
]