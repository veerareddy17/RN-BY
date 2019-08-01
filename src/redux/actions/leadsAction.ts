import { Dispatch } from 'redux';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import authHeader from '../../helpers/authHeader';
import config from '../../helpers/config';
import { ADD_LEAD, FETCH_LEAD, FETCH_CAMPAIGN } from './actionTypes';

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

export const fetchCampaignsAction = campaigns => {
    return {
        type: FETCH_CAMPAIGN,
        payload: campaigns,
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
        let response = await axios.get(`${config.api.baseURL}/lead/all`, options);
        console.log(response.data.data);
        if (response.data.data !== null) {
            dispatch(fetchLeadsAction(response.data.data));
            try {
                await AsyncStorage.setItem('leads', JSON.stringify(response.data.data));
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(fetchLeadsAction(response.data.errors));
        }
    } catch (error) {
        // Error 😨
        console.log(error);
    }
};

// POST method to create Lead
export const createLead = (newLead: any) => async (dispatch: Dispatch) => {
    let header = await authHeader();
    const options = {
        headers: { ...header, 'Content-Type': 'application/json' },
    };
    const body = JSON.stringify(newLead);
    try {
        let response = await axios.post(`${config.api.baseURL}/lead`, body, options);
        console.log(response.data.data);
        if (response.data.data !== null) {
            dispatch(createLeadAction(response.data.data));
            try {
                //Fetch exisiting leads and append new lead to the list
                await AsyncStorage.setItem('leads', response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(createLeadAction(response.data.erros));
        }
    } catch (error) {
        // Error
        console.log(error);
    }
};
