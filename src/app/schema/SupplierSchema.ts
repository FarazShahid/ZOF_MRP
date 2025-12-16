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
    Password: Yup.string()
        .required('Password is required')
        .test('password-length', 'Password must be at least 8 characters', (value) => {
            if (!value) return false;
            return value.length >= 8;
        })
        .test('password-uppercase', 'Password must contain at least one uppercase letter', (value) => {
            if (!value) return false;
            return /[A-Z]/.test(value);
        })
        .test('password-lowercase', 'Password must contain at least one lowercase letter', (value) => {
            if (!value) return false;
            return /[a-z]/.test(value);
        })
        .test('password-number', 'Password must contain at least one number', (value) => {
            if (!value) return false;
            return /[0-9]/.test(value);
        })
        .test('password-special', 'Password must contain at least one special character (e.g., !@#$%^&*)', (value) => {
            if (!value) return false;
            return /[\W_]/.test(value);
        }),
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