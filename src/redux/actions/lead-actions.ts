import { Dispatch } from 'redux';
import { ADD_LEAD, FETCH_LEAD, LOAD_LEAD_START, LOAD_LEAD_SUCCESS, LOAD_LEAD_FAIL, OTP_SENT } from './action-types';
import generateOTP from '../../helpers/otp-creation';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';
import { LeadService } from '../../services/lead-service';
import { LeadRequest, OTPRequest } from '../../models/request';
import { LeadResponse, OTPResponse } from '../../models/response';

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

export const otpSuccessAction = (otpResponse: OTPResponse) => {
    return {
        type: OTP_SENT,
        payload: otpResponse,
    };
};

// GET method to fetch all captured leads
export const fetchAllLeadsApi = () => async (dispatch: Dispatch) => {
    try {
        dispatch(leadStartAction());
        const response = await LeadService.fetchLeads(1);
        console.log(response.data);
        if (response && response.data) {
            dispatch(fetchLeadsAction(response.data.data));
            try {
                await StorageService.store(StorageConstants.USER_LEADS, response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(leadFailureAction(response.errors));
        }
    } catch (error) {
        console.log(error);
    }
};

// POST method to create Lead
export const createLeadApi = (newLead: any): ((dispatch: Dispatch) => Promise<void>) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(leadStartAction());
            let response = await LeadService.createLead(newLead);
            console.log(response.data);
            if (response && response.data) {
                dispatch(createLeadAction(response.data));
                try {
                    //TODO: Fetch exisiting leads and append new lead to the list
                    await StorageService.store(StorageConstants.USER_LEADS, response.data);
                    await StorageService.removeKey(StorageConstants.USER_OTP);
                } catch (error) {
                    console.log('Error in storing asyncstorage', error);
                }
            } else {
                dispatch(leadFailureAction(response.errors));
            }
        } catch (error) {
            // Error
            console.log(error);
        }
    };
};

// POST method to generate and verify OTP
export const verifyOTP = (phone: string) => async (dispatch: Dispatch) => {
    let OTP = await generateOTP();
    let otpRequest = new OTPRequest(phone, OTP);

    try {
        let response = await LeadService.verifyOTP(otpRequest);
        console.log(response.data);
        if (response && response.data) {
            try {
                dispatch(otpSuccessAction(response.data));
                console.log('OTP sent to server--', OTP);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(leadFailureAction(response.errors));
        }
    } catch (error) {
        // Error
        console.log(error);
    }
};
