import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/actionTypes';

export default function userReducer(state = {}, action) {
    console.log('ACtion user-----', action);
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.payload,
            };
        case LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.payload,
            };
        case LOGIN_FAILURE:
            return {
                loggedIn: false,
                error: action.payload,
            };
        case LOGOUT:
            return {};
        default:
            return state;
    }
}
