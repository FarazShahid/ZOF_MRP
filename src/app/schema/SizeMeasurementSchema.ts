import * as Yup from 'yup';

export const SizeMeasurementSchema = Yup.object().shape({
    Measurement1: Yup.string()
        .trim()
        .required('Name is required')
        .max(255, 'Name must not exceed 255 characters'),
    ProductCategoryId: Yup.number()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null ? 0 : value
        )
        .typeError('Product Category is required')
        .moreThan(0, 'Product Category is required')
        .required('Product Category is required'),
    ProductSubCategoryId: Yup.number()
        .nullable()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null ? null : value
        )
        .typeError('Product Sub Category is invalid'),
    StyleNumber: Yup.string()
        .trim()
        .nullable()
        .max(100, 'Style Number must not exceed 100 characters'),
    SizeOptionId: Yup.number()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null ? 0 : value
        )
        .typeError('Size Option is required')
        .moreThan(0, 'Size Option is required')
        .required('Size Option is required'),
    ClientId: Yup.number()
        .transform((value, originalValue) =>
            originalValue === "" || originalValue === null ? 0 : value
        )
        .typeError('Client is required')
        .moreThan(0, 'Client is required')
        .required('Client is required'),
    // FrontLengthHPS: Yup.string().required('Field is required'),
    // BackLengthHPS: Yup.string().required('Field is required'),
    // AcrossShoulders: Yup.string().required('Field is required'),
    // ArmHole: Yup.string().required('Field is required'),
    // UpperChest: Yup.string().required('Field is required'),
    // LowerChest: Yup.string().required('Field is required'),
    // Waist: Yup.string().required('Field is required'),
    // BottomWidth: Yup.string().required('Name is required'),
    // SleeveLength: Yup.string().required('Field is required'),
    // SleeveOpening: Yup.string().required('Field is required'),
    // NeckSize: Yup.string().required('Field is required'),
    // CollarHeight: Yup.string().required('Field is required'),
    // CollarPointHeight: Yup.string().required('Field is required'),
    // StandHeightBack: Yup.string().required('Field is required'),
    // CollarStandLength: Yup.string().required('Field is required'),
    // SideVentFront: Yup.string().required('Field is required'),
    // SideVentBack: Yup.string().required('Field is required'),
    // PlacketLength: Yup.string().required('Field is required'),
    // TwoButtonDistance: Yup.string().required('Field is required'),
    // PlacketWidth: Yup.string().required('Field is required'),
    // BottomHem: Yup.string().required('Field is required'),
})
