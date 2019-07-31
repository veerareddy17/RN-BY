import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Dispatch } from 'redux';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actionTypes';
import config from '../../helpers/config';

// The action creators
export const requestAction = user => {
    return {
        type: LOGIN_REQUEST,
        payload: user,
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
    console.log('login service', username);
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
        const response = await axios.post(`${config.api.baseURL}/user/login`, body, options);
        if (response.status == 200) {
            console.log(response.data);
            dispatch(successAction(response.data.data));
            try {
                await AsyncStorage.setItem('userToken', JSON.stringify(response.data.data.token));
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(failureAction(response.data));
            console.log(response.status);
        }
    } catch (error) {
        console.log(error);
        return error;
    }
};
