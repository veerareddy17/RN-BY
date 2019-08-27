import * as yup from 'yup';

export const loginValidation =
    yup.object().shape({
        email: yup
            .string()
            .email()
            .required(),
        password: yup
            .string()
            .required(),
    });

export const leadValidation =
    yup.object().shape({
        name: yup
            .string()
            .label('Student Name')
            .required(),
        school_board: yup
            .string()
            .label('Board')
            .required(),
        school_name: yup
            .string()
            .label('School Name')
            .required(),
        class_name: yup
            .string()
            .label('Class')
            .required(),
        parent_name: yup
            .string()
            .label('Parent Name')
            .required(),
        phone: yup
            .string()
            .min(10)
            .max(10)
            .label('Mobile Number')
            .required(),
        alternateMobileNumber: yup
            .string()
            .min(10)
            .max(10)
            .label('Alternate Mobile Number'),
        email: yup
            .string()
            .email()
            .label('Email')
            .required(),
        address: yup
            .string()
            .label('Address')
            .required(),
        country: yup
            .string()
            .label('Country')
            .required(),
        state: yup
            .string()
            .label('State')
            .required(),
        city: yup
            .string()
            .label('City')
            .required(),
        pincode: yup
            .string()
            .max(6)
            .label('Pin code')
            .required(),
    });

