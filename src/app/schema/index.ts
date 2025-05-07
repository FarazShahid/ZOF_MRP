import * as Yup from 'yup';

export const ProductValidationSchemas = [
    Yup.object({
        ProductCategoryId: Yup.string().required('Product Category is required'),
        FabricTypeId: Yup.string().required('Fabric Type is required'),
    }),
    // Yup.object({
    //   salesPrice: Yup.number().required('Required').min(0, 'Must be positive')
    // }),
    // Yup.object({
    //   reorderLevel: Yup.number().required('Required'),
    //   quantity: Yup.number().required('Required')
    // }),
    // Yup.object({
    //   weight: Yup.number().required('Required'),
    //   dimensions: Yup.string().required('Required')
    // })
  ];