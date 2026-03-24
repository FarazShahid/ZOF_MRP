import * as Yup from 'yup';

export const SchemaValidation = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    Email: Yup.string().email('Invalid email').required('Email is required'),
    POCEmail: Yup.string().email('Invalid email'),
})