import * as Yup from 'yup';

export const CutOptionSchema = Yup.object().shape({
    OptionProductCutOptions: Yup.string().required('Name is required'),
})



