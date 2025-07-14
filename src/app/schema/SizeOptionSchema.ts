import * as Yup from 'yup';

export const SizeOptionSchema = Yup.object().shape({
    OptionSizeOptions: Yup.string().required('Name is required'),
    ProductRegionId:  Yup.string().required('Product Region is required'),
})