import * as Yup from "yup";

export const StatusSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})


export const ProductValidationSchemas = [
  Yup.object({
    ProductCategoryId: Yup.string().required("Product Category is required"),
    FabricTypeId: Yup.string().required("Fabric Type is required"),
  }),
  null,
  null,
];

export const OrderValidationSchemas = [
  Yup.object({
    ClientId: Yup.string().required("Client is required"),
    OrderEventId: Yup.string().required("Event is required"),
    Deadline: Yup.string().required("Deadline is required"),
  }),
  null,
  null,
];
