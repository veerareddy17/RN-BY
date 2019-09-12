import { ErrorResponse } from './../../models/response/error-response';

import { errorCallAction, errorCallResetAction, serverErrorCallAction } from './error-actions';
import { Location } from './../../models/request/location-request';

import { Dispatch } from 'redux';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './action-types';
import { AuthenticationService } from '../../services/authentication-service';
import { AuthenticationRequest } from '../../models/request/authentication-request';
import { AuthenticationResponse } from '../../models/response/authentication-response';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';
import { resetWarningCache } from 'prop-types';
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

export const authenticate = (username: string, password: string, latitude: number, longitude: number): ((dispatch: Dispatch) => Promise<void>) => {
    return async (dispatch: Dispatch) => {

        dispatch(requestAction());
        dispatch(errorCallResetAction());
        console.log('in authenticate')
        const authRequest = new AuthenticationRequest(username, password, new Location(latitude, longitude));
        console.log('auth request ==>', authRequest);
        try {
            const response = await AuthenticationService.authenticate(authRequest);
            console.log(response.data);
            if (response.data !== null) {
                dispatch(successAction(response.data));
            } else {
                console.log('error failure')
                //errors = response.errors;
                dispatch(errorCallAction(response.errors));
                dispatch(failureAction(response.errors));
            }
        } catch (e) {
            console.log('error:', e.message);
            console.log('catch error')
            //let errorVal = new
            let errors = Array<ErrorResponse>();
            errors.push(new ErrorResponse('Server', e.message))
            dispatch(serverErrorCallAction(errors));
            dispatch(failureAction(e.message));
        }

    };
};

export const logout = (): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    // return async (dispatch: Dispatch) => {
    //     try {
    //         dispatch(logoutAction());
    //         await StorageService.removeKey(StorageConstants.TOKEN_KEY);
    //     } catch (error) {
    //         console.log('Logout action', error);
    //     }
    // };
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
