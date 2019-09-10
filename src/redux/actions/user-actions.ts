import { Location } from './../../models/request/location-request';

import { Dispatch } from 'redux';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './action-types';
import { AuthenticationService } from '../../services/authentication-service';
import { AuthenticationRequest } from '../../models/request/authentication-request';
import { AuthenticationResponse } from '../../models/response/authentication-response';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';
import { Toast } from 'native-base';

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
            if (!isConnected) {
                if (username == storedUser.email && password === storedUser.offline_pin) {
                    dispatch(successAction(storedUser));
                } else {
                    dispatch(failureAction(['Invalid Username/ PIN']));
                }
                return;
            }
            dispatch(requestAction());
            const response = await AuthenticationService.authenticate(authRequest);
            if (response.data !== null) {
                dispatch(successAction(response.data));
            } else {
                dispatch(failureAction(response.errors));
            }
        } catch (e) {
            // dispatch(failureAction(e.message));
            Toast.show({
                text: e.message,
                buttonText: 'Ok',
                type: 'danger',
            });
        }
    };
};

export const logout = (): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState: any) => {
        try {
            let storedUser = getState().userReducer.user;
            storedUser.token = '';
            dispatch(logoutAction());
        } catch (error) {
            console.log('Logout action', error);
        }
    };
};
