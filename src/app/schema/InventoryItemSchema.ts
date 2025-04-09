import * as Yup from 'yup';

export const InventoryItemSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    SubCategoryId: Yup.string().required('Sub Category is required'),
    UnitOfMeasure: Yup.string().required('Unit Of Measure is required'),
    SupplierId: Yup.string().required('Supplier is required'),
    ReorderLevel: Yup.number().required('Reorder Level is required'),
    Stock: Yup.number().required('Stock is required'),
})