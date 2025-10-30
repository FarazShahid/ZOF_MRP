import * as Yup from 'yup';

export const SupplierSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    Email: Yup.string()
        .trim()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i, 'Invalid email')
        .required("Email is required"),
    Phone: Yup.string()
        .trim()
        .test(
            'phone-allowed-chars',
            'Phone can include numbers, + - ( ) and spaces',
            (value) => {
                if (!value || value.trim() === '') return true;
                return /^(?=.*\d)[+()\-\s\d]+$/.test(value);
            }
        ),
})


export const UserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    Email: Yup.string().required('Email is required'),
    Password: Yup.string().required('Password is required'),
    roleId: Yup.number().required('Role is required'),
})


export const UnitOfMeasureSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
})

export const CarriorSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    
})

export const ProductCategorySchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    
})