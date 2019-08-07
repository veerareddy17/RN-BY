import { Dispatch } from 'redux';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actionTypes';
import config from '../../helpers/config';
import storage from '../../database/storage';
import { APIManager } from '../../manager/apiManager';
import { ApiResponse } from '../../models/responseModel';
import { UserLoginResponse } from '../../models/userLoginResponse';
import axios from 'axios';

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
    const options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const body = JSON.stringify({
        email: username,
        password: password,
    });
    try {
        dispatch(requestAction());
        const response = await axios.post(`${config.api.baseURL}/user/login`, body, options);
        if (response.data.data !== null) {
            dispatch(successAction(response.data.data));
            try {
                await storage.storeData('user', response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(failureAction(response.data.errors));
        }
    } catch (error) {
        console.log(error);
        dispatch(failureAction(error));
    }
};

export const logout = () => async (dispatch: Dispatch) => {
    console.log('Logging out..');
    try {
        await storage.removeItemByKey('user');
    } catch (error) {
        console.log('Logout action', error);
        dispatch(failureAction(error));
    }
};
