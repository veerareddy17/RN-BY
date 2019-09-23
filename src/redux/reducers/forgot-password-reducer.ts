import { FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE, FORGOT_PASSWORD_INIT } from './../actions/action-types';
import { initialState } from '../init/forgot-password-init-state';

export default function forgotPasswordReducer(state = initialState, action) {
    switch (action.type) {
        case FORGOT_PASSWORD_REQUEST:
            return {
                ...state,
                isLoading: true,
                forgotPasswordResponse: '',
                error: '',
            };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                forgotPasswordResponse: action.payload,
            };
        case FORGOT_PASSWORD_FAILURE:
            return {
                ...state,
                isLoading: false,
                forgotPasswordResponse: '',
                error: action.payload,
            };
        case FORGOT_PASSWORD_INIT:
            return {
                ...state,
                isLoading: false,
                forgotPasswordResponse: '',
                error: '',
            };
        default:
            return state;
    }
}
