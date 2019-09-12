
import { LOAD_OTP_START, LOAD_OTP_FAIL, OTP_SENT, LOAD_OTP_INIT } from './../actions/action-types';
import { initialState } from '../init/otp-initial-state';

export default function otpReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_OTP_START:
            return {
                ...state,
                isLoading: true,
                error: '',
            };
        case LOAD_OTP_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case OTP_SENT:
            console.log('action, payload in otpreducer', action.type, action.payload)
            return {
                ...state,
                isLoading: false,
                otp: action.payload,
            };
        default:
            return state;
    }
}
