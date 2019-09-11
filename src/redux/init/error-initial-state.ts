import { ErrorResponse } from './../../models/response/error-response';

export const errorInitialState = {
    error: Array<ErrorResponse>(),
    showAlertError: false,
    showToastError: false,
};