import { errorInitialState } from './../init/error-initial-state';
import { ERROR_CALL_ACTION, ERROR_CALL_RESET_ACTION, SERVER_ERROR_CALL_ACTION } from './../actions/action-types';

export default function errorReducer(state = errorInitialState, action) {
    switch (action.type) {
        case ERROR_CALL_ACTION:
            return {
                ...state,
                showAlertError: true,
                error: action.payload,
            };
        case SERVER_ERROR_CALL_ACTION:
            return {
                ...state,
                showToastError: true,
                error: action.payload,
            };
        case ERROR_CALL_RESET_ACTION:
            return {
                ...state,
                showToastError: false,
                showAlertError: false,
                error: action.payload,
            };
        default:
            return state;
    }
}