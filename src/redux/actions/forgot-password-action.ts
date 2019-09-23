import { FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE, FORGOT_PASSWORD_INIT } from "./action-types";
import { ForgotPasswordResponse } from "../../models/response/forgot-password-response";
import { Dispatch } from 'redux';
import { ForgotPasswordRequest } from "../../models/request/forgot-password-request";
import { AuthenticationService } from "../../services/authentication-service";

export const forgotPasswordReqAction = () => {
    return {
        type: FORGOT_PASSWORD_REQUEST,
    };
};

export const forgotPasswordSuccessAction = (forgotPasswordResponse: ForgotPasswordResponse) => {
    return {
        type: FORGOT_PASSWORD_SUCCESS,
        payload: forgotPasswordResponse,
    };
};

export const forgotPasswordfailureAction = (error) => {
    return {
        type: FORGOT_PASSWORD_FAILURE,
        payload: error,
    };
};

export const initialStateAction = () => {
    return {
        type: FORGOT_PASSWORD_INIT,
    }
};

export const forgotPassword = (email: string): ((dispatch: Dispatch) => Promise<void>) => {
    return async (dispatch: Dispatch) => {
        dispatch(forgotPasswordReqAction());
        const forgotPasswordRequest = new ForgotPasswordRequest(email);
        console.log('Forgot Password Req ==>', forgotPasswordRequest);
        const response = await AuthenticationService.forgotPassword(forgotPasswordRequest);
        if (response.data !== null) {
            console.log('success data', response.data)
            dispatch(forgotPasswordSuccessAction(response.data));
        } else {
            console.log('error data', response.errors)
            dispatch(forgotPasswordfailureAction(response.errors[0].message));
        }
    };
};

export const initStateForgotPassword = (): ((dispatch: Dispatch) => Promise<void>) => {
    return async (dispatch: Dispatch) => {
        dispatch(initialStateAction());
    };
};

