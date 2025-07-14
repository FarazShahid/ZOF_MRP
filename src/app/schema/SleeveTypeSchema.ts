import * as Yup from 'yup';

export const SleeveTypeSchema = Yup.object().shape({
    sleeveTypeName: Yup.string().required('Name is required'),
     productCategoryId: Yup.number()
    .typeError('Product Category is required')
    .required('Product Category is required')
    .min(1, 'Please select a valid category'),
})