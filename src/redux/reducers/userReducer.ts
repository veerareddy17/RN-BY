import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/actionTypes';

export default function userReducer(state = {}, action) {
    console.log('Action user-----', action);
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true,
                user: action.payload,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                user: action.payload,
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                loggedIn: false,
                error: action.payload,
            };
        case LOGOUT:
            return {};
        default:
            return state;
    }
}
