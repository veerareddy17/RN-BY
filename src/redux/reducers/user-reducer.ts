import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/action-types';
import { initialState } from '../init/user-initial-state';

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true,
                user: '',
                error: '',
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
                user: '',
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                isLoading: false,
                user: '',
                error: '',
            };
        default:
            return state;
    }
}
