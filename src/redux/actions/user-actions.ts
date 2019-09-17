import { ErrorResponse } from './../../models/response/error-response';

import { errorCallAction, errorCallResetAction, serverErrorCallAction } from './error-actions';
import { Location } from './../../models/request/location-request';

import { Dispatch } from 'redux';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './action-types';
import { AuthenticationService } from '../../services/authentication-service';
import { AuthenticationRequest } from '../../models/request/authentication-request';
import { AuthenticationResponse } from '../../models/response/authentication-response';
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

export const failureAction = (error: ErrorResponse[]) => {
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

export const authenticate = (
    username: string,
    password: string,
    latitude: number,
    longitude: number,
): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState: any) => {
        const authRequest = new AuthenticationRequest(username, password, new Location(latitude, longitude));
        try {
            let isConnected = getState().connectionStateReducer.isConnected;
            let storedUser = getState().userReducer.user;
            dispatch(requestAction());
            if (!isConnected) {
                if (username == storedUser.email && password === storedUser.offline_pin) {
                    // storedUser.isOfflineLoggedIn = true;
                    dispatch(successAction(storedUser));
                } else {
                    // storedUser.isOfflineLoggedIn = false;
                    dispatch(failureAction(['Invalid Username/ PIN']));
                }
                return;
            }
            dispatch(errorCallResetAction());
            const response = await AuthenticationService.authenticate(authRequest);
            if (response.data !== null) {
                // response.data.isOfflineLoggedIn = false;
                dispatch(successAction(response.data));
            } else {
                //errors = response.errors;
                dispatch(errorCallAction(response.errors));
                dispatch(failureAction(response.errors));
            }
        } catch (e) {
            // dispatch(failureAction(e.message));
            //let errorVal = new
            let errors = Array<ErrorResponse>();
            errors.push(new ErrorResponse('Server', e.message));
            dispatch(serverErrorCallAction(errors));
        }
    };
};

export const logout = (): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState: any) => {
        try {
            let storedUser = getState().userReducer.user;
            storedUser.token = '';
            // storedUser.isOfflineLoggedIn = false;
            dispatch(logoutAction());
        } catch (error) {
            console.log('Logout action', error);
        }
    };
};
