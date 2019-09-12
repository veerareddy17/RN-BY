import { ErrorResponse } from './../../models/response/error-response';
import { ERROR_CALL_ACTION, ERROR_CALL_RESET_ACTION, SERVER_ERROR_CALL_ACTION } from './action-types';

export const errorCallAction = (error: ErrorResponse[]) => {
    return {
        type: ERROR_CALL_ACTION,
        payload: error,
    };
};

export const serverErrorCallAction = (error: ErrorResponse[]) => {
    return {
        type: SERVER_ERROR_CALL_ACTION,
        payload: error,
    };
};

export const errorCallResetAction = () => {
    return {
        type: ERROR_CALL_RESET_ACTION,
    };
};