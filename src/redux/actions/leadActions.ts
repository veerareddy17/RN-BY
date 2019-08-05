import { Dispatch } from 'redux';
import axios from 'axios';
import authHeader from '../../helpers/authHeader';
import config from '../../helpers/config';
import { ADD_LEAD, FETCH_LEAD, LOAD_LEAD_START, LOAD_LEAD_SUCCESS, LOAD_LEAD_FAIL } from './actionTypes';
import storage from '../../database/storage';
import generateOTP from '../../helpers/OTPCreation';

// The action creators
export const createLeadAction = lead => {
    return {
        type: ADD_LEAD,
        payload: lead,
    };
};

export const fetchLeadsAction = leads => {
    return {
        type: FETCH_LEAD,
        payload: leads,
    };
};

export const leadStartAction = () => {
    return {
        type: LOAD_LEAD_START,
    };
};

export const leadSuccessAction = () => {
    return {
        type: LOAD_LEAD_SUCCESS,
    };
};

export const leadFailureAction = error => {
    return {
        type: LOAD_LEAD_FAIL,
        payload: error,
    };
};

// GET method to fetch all captured leads
export const fetchAllLeadsApi = () => async (dispatch: Dispatch) => {
    let header = await authHeader();
    const options = {
        params: {},
        headers: { ...header, 'Content-Type': 'application/json' },
    };
    try {
        dispatch(leadStartAction());
        let response = await axios.get(`${config.api.baseURL}/lead/all`, options);
        // console.log(response.data.data);
        if (response.data.data !== null) {
            dispatch(fetchLeadsAction(response.data.data));
            try {
                await storage.storeData('leads', response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(leadFailureAction(response.data.errors));
        }
    } catch (error) {
        console.log(error);
    }
};

// POST method to create Lead
export const createLeadApi = (newLead: any) => async (dispatch: Dispatch) => {
    let header = await authHeader();
    const options = {
        headers: { ...header, 'Content-Type': 'application/json' },
    };
    const body = JSON.stringify(newLead);
    try {
        dispatch(leadStartAction());
        let response = await axios.post(`${config.api.baseURL}/lead`, body, options);
        console.log(response.data.data);
        if (response.data.data !== null) {
            dispatch(createLeadAction(response.data.data));
            try {
                //Fetch exisiting leads and append new lead to the list
                await storage.storeData('leads', response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(leadFailureAction(response.data.erros));
        }
    } catch (error) {
        // Error
        console.log(error);
    }
};

// POST method to generate and verify OTP
export const verifyOTPApi = () => async (dispatch: Dispatch) => {
    let header = await authHeader();
    let OTP = await generateOTP();
    const options = {
        headers: { ...header, 'Content-Type': 'application/json' },
    };
    const body = JSON.stringify(OTP);
    try {
        let otp = await storage.getDataByKey('OTP');
        console.log('Before OTP verify ', OTP);
        let response = await axios.post(`${config.api.baseURL}/lead`, body, options);
        console.log(response.data.data);
        if (response.data.data !== null) {
            // dispatch(createLeadAction(response.data.data));
            try {
                //Fetch exisiting leads and append new lead to the list
                await storage.removeItemByKey('OTP');
                let otp = await storage.getDataByKey('OTP');
                console.log('After OTP verify success', OTP);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(leadFailureAction(response.data.erros));
        }
    } catch (error) {
        // Error
        console.log(error);
    }
};
