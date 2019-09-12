import { ForgotPasswordResponse } from './../../models/response/forgot-password-response';

export const initialState = {
    forgotPasswordResponse: new ForgotPasswordResponse(),
    isLoading: false,
    error: '',
};
