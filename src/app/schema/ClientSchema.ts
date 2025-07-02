import * as Yup from 'yup';

export const SchemaValidation = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})