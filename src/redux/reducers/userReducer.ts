import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/actionTypes';
import { initialState } from '../../models/userInitialState';

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true,
                isLoggedIn: false,
                user: action.payload,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoggedIn: false,
                user: '',
                error: action.payload,
            };
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: '',
                error: '',
            };
        default:
            return state;
    }
}
