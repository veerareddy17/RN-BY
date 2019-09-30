
import { LOAD_OTP_START, LOAD_OTP_FAIL, OTP_SENT, LOAD_OTP_INIT, OTP_VALIDATE } from './../actions/action-types';
import { initialState } from '../init/otp-initial-state';

export default function otpReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_OTP_START:
            return {
                ...state,
                isLoading: true,
                validated: '',
                otp: '',
                error: '',
            };
        case LOAD_OTP_FAIL:
            return {
                ...state,
                isLoading: false,
                otp: '',
                validated: '',
                error: action.payload,
            };
        case OTP_SENT:
            return {
                ...state,
                isLoading: false,
                validated: '',
                otp: action.payload,
            };
        case OTP_VALIDATE:
            return {
                ...state,
                isLoading: false,
                otp: '',
                validated: action.payload,
            };
        case LOAD_OTP_INIT:
            return {
                ...state,
                isLoading: false,
                otp: '',
                validated: '',
                error: '',
            };
        default:
            return state;
    }
}
