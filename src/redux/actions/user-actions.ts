import { Dispatch } from 'redux';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './action-types';
import { AuthenticationService } from '../../services/authentication-service';
import { AuthenticationRequest } from '../../models/request/authentication-request';
import { AuthenticationResponse } from '../../models/response/authentication-response';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';

// The action creators
export const requestAction = () => {
    return {
        type: LOGIN_REQUEST,
    };
};

export const successAction = (user: AuthenticationResponse) => {
    return {
        type: LOGIN_SUCCESS,
        payload: user,
    };
};

export const failureAction = (error: string[]) => {
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

export const authenticate = (username: string, password: string): ((dispatch: Dispatch) => Promise<void>) => {
    return async (dispatch: Dispatch) => {
        dispatch(requestAction());
        const authRequest = new AuthenticationRequest(username, password);
        const response = await AuthenticationService.authenticate(authRequest);
        if (response.data !== null) {
            dispatch(successAction(response.data));
        } else {
            dispatch(failureAction(response.errors));
        }
    };
};

export const logout = (): ((dispatch: Dispatch) => Promise<void>) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(logoutAction());
            await StorageService.removeKey(StorageConstants.TOKEN_KEY);
        } catch (error) {
            console.log('Logout action', error);
        }
    };
};
