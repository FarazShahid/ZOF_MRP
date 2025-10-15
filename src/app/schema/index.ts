import * as Yup from "yup";

export const StatusSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})


export const ProductValidationSchemas = [
  Yup.object({
    Name: Yup.string().required("Name is required"),
    ClientId: Yup.string().required("Client is required"),
    ProductCategoryId: Yup.string().required("Product Category is required"),
    FabricTypeId: Yup.string().required("Fabric Type is required"),
  }),
  null,
  null,
];

export const OrderValidationSchemas = [
  Yup.object({
    OrderNumber:  Yup.string().required("Order Number is required"),
    OrderName:  Yup.string().required("Order Name is required"),
    ClientId: Yup.string().required("Client is required"),
    Deadline: Yup.string().required("Deadline is required"),
  }),
  null,
  Yup.object({
    Description: Yup.string().trim().required("Description is required"),
  }),
];
