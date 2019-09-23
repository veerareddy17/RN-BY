import { ErrorResponse } from './../../models/response/error-response';
import { errorCallResetAction, errorCallAction, serverErrorCallAction } from './error-actions';
import { OTP_SENT, LOAD_OTP_START, LOAD_OTP_FAIL, LOAD_OTP_INIT, OTP_VALIDATE } from './action-types';
import { OTPRequest } from './../../models/request/otp-request';
import { LeadService } from './../../services/lead-service';
import { Dispatch } from 'redux';
import generateOTP from '../../helpers/otp-creation';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';
import config from '../../helpers/config';

export const otpStartAction = () => {
    return {
        type: LOAD_OTP_START,
    };
};

export const otpInitAction = () => {
    return {
        type: LOAD_OTP_INIT,
    };
};

export const otpFailureAction = error => {
    return {
        type: LOAD_OTP_FAIL,
        payload: error,
    };
};

export const otpSuccessAction = successData => {
    return {
        type: OTP_SENT,
        payload: successData,
    };
};

export const otpValidateAction = validatedData => {
    return {
        type: OTP_VALIDATE,
        payload: validatedData,
    };
};

export const sendOTP = (phone: string) => async (dispatch: Dispatch, getState: any) => {
    dispatch(errorCallResetAction());
    dispatch(otpStartAction());
    let OTP = await generateOTP();
    console.log('OTP generated - ', OTP);
    console.log('phone', phone);
    let otpRequest = new OTPRequest(phone, OTP);

    try {
        if (getState().connectionStateReducer.isConnected) {
            let response = await LeadService.sendOTP(otpRequest);
            if (response && response.data) {
                dispatch(otpSuccessAction(response.data));
            } else {
                dispatch(serverErrorCallAction(response.errors));
                dispatch(otpFailureAction(response.errors[0].message));
            }
        }
    } catch (error) {
        // Error
        console.log(e);
        let errors = Array<ErrorResponse>();
        errors.push(new ErrorResponse('Server', e.message));
        dispatch(serverErrorCallAction(errors));
        dispatch(otpFailureAction('Some error occured'));
    }
};

export const submitOTP = (otp: String) => async (dispatch: Dispatch) => {
    dispatch(otpStartAction());
    let storedOTP = await StorageService.get<string>(StorageConstants.USER_OTP);
    if (otp === storedOTP) {
        dispatch(otpValidateAction(true));
        return;
    }
    dispatch(otpValidateAction(false));
};

export const otpInit = () => async (dispatch: Dispatch) => {
    dispatch(otpInitAction());
};
