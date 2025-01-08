import * as Yup from 'yup';

export const SchemaValidation = Yup.object().shape({
    // Name: Yup.string().required('Name is required'),
    // Email: Yup.string().email('Inavlid Email').required('Email is required'),
    // Phone: Yup.string().required('Phone is required'),
    // Country: Yup.string().required('Country is required'),
    // State: Yup.string().required('State is required'),
    // City: Yup.string().required('City is required')
})