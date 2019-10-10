import * as yup from 'yup';

export const loginValidation = yup.object().shape({
    email: yup
        .string()
        .email()
        .label('Email Id')
        .required(),
    password: yup
        .string()
        .label('Password')
        .required(),
});

export const leadValidation = yup.object().shape({
    proceedWithoutOtp: yup.boolean(),
    name: yup
        .string()
        .label('Student Name')
        .min(3)
        .required(),
    board_id: yup
        .string()
        .label('Board')
        .required(),
    school_name: yup
        .string()
        .label('School Name')
        .required(),
    classes_id: yup
        .string()
        .label('Class')
        .required(),
    parent_name: yup
        .string()
        .label('Parent Name')
        .min(3)
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
    state: yup
        .string()
        .label('State')
        .required(),
    city: yup
        .string()
        .label('City')
        .min(3)
        .required(),
    pincode: yup
        .string()
        .max(6)
        .min(6)
        .label('Pin code')
        .required(),
    siblings: yup.array().of(
        yup.object().shape({
            name: yup
                .string()
                .label('Sibling Name')
                .min(3)
                .required(),
            classes_id: yup
                .string()
                .label('Sibling Class')
                .required(),
        }),
    ),
    otp: yup
        .string()
        .max(4)
        .min(4)
        .label('OTP')
        .when('proceedWithoutOtp', (proceedWithoutOtp, schema) => {
            return !proceedWithoutOtp ? schema.required() : schema;
        }),
});
