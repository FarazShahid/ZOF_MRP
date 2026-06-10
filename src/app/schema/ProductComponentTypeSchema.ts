import * as Yup from "yup";

export const ProductComponentTypeSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),
});
