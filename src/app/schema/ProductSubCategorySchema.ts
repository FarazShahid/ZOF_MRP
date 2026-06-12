import * as Yup from "yup";

export const ProductSubCategorySchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),
  productCategoryId: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? 0 : value
    )
    .typeError("Product Category is required")
    .moreThan(0, "Product Category is required")
    .required("Product Category is required"),
});
