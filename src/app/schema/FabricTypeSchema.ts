import * as Yup from 'yup';

export const FabricTypeSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    name: Yup.string().required('Name is required'),
    gsm: Yup.string().required('GSM is required'),
})