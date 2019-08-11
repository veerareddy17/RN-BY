import { Dispatch } from 'redux';
import axios from 'axios';
import authHeader from '../../helpers/auth-header';
import config from '../../helpers/config';
import { ADD_LEAD, FETCH_LEAD, LOAD_LEAD_START, LOAD_LEAD_SUCCESS, LOAD_LEAD_FAIL, OTP_SENT } from './action-types';
import storage from '../../database/storage-service';
import generateOTP from '../../helpers/otp-creation';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';
import { CampaignService } from '../../services/campaign-service';
import { LeadService } from '../../services/lead-service';
import { HttpBaseService } from '../../services/http-base-service';
import { LeadRequest } from '../../models/request/lead-request';
import { LeadResponse } from '../../models/response';

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

export const otpSuccessAction = (status: string) => {
    return {
        type: OTP_SENT,
        payload: status,
    };
};

// GET method to fetch all captured leads
export const fetchAllLeadsApi = () => async (dispatch: Dispatch) => {
    try {
        dispatch(leadStartAction());
        const response = await LeadService._fetchLeads();
        console.log(response.data);
        if (response && response.data) {
            dispatch(fetchLeadsAction(response.data));
            try {
                await storage.store('leads', response.data);
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
                    await storage.store('leads', response.data);
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
export const verifyOTPApi = () => async (dispatch: Dispatch) => {
    let header = await authHeader();
    let OTP = await generateOTP();

    const options = {
        headers: { ...header, 'Content-Type': 'application/json' },
    };
    const body = JSON.stringify({
        phone: '7019432993',
        code: OTP,
    });
    try {
        let response = await axios.post(`${config.api.baseURL}/meta/sms`, body, options);
        console.log(response.data.data);
        if (response.data.data !== null) {
            try {
                dispatch(otpSuccessAction(response.data.data.status));
                console.log('OTP sent to server--', OTP);
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
