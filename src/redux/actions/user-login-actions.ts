import { Dispatch } from 'redux';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './action-types';
import storage from '../../database/storage-service';
import { AuthenticationService } from '../../services/authentication-service';
import { AuthenticationRequest } from '../../models/request/authentication-request';

// The action creators
export const requestAction = () => {
    return {
        type: LOGIN_REQUEST,
    };
};

export const successAction = user => {
    return {
        type: LOGIN_SUCCESS,
        payload: user,
    };
};

export const failureAction = error => {
    return {
        type: LOGIN_FAILURE,
        payload: error,
    };
};

export const logoutAction = () => {
    return {
        type: LOGOUT,
    };
};

export const loginApi = (username: string, password: string) => async (dispatch: Dispatch) => {
    try {
        // dispatch(requestAction());
        // const response = await axios.post(`${config.api.baseURL}/authenticate`, body, options);
        const authRequest = new AuthenticationRequest(username, password);
        const response = AuthenticationService.loginApi(authRequest);
        if (response !== null) {
            // dispatch(successAction(response));
            console.log('Action : ', response);
        } else {
            // dispatch(failureAction(response));
        }
    } catch (error) {
        console.log(error);
        // dispatch(failureAction(error));
    }
};

export const logout = () => async (dispatch: Dispatch) => {
    console.log('Logging out..');
    try {
        await storage.removeKey('user');
    } catch (error) {
        console.log('Logout action', error);
        dispatch(failureAction(error));
    }
};
